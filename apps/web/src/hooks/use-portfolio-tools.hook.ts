import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useTradeApi } from '@/api/trade.api';
import { usePortfolioApi } from '@/api/portfolio.api';
import { queryKeys } from '@/lib/query-keys';
import type { MetalType } from '@/lib/types';
import type {
    ProfitAnalysisMissingFieldDto,
    ProfitAnalysisRequest,
    TradeProduct,
    PortfolioBuildResponse,
    PortfolioProductTypeFilter,
    PriorityStrength,
} from '@goldilocks/shared-types';

const DEBOUNCE_MS = 150;

type PurchaseMode = 'premium' | 'price';

function findDefaultProduct(products: TradeProduct[]): TradeProduct | null {
    const oneOz = products.find((p) => p.name.toLowerCase().replace(/\s/g, '').includes('1oz'));
    return oneOz ?? products[0] ?? null;
}

/**
 * Portfolio P/L subtab — ported from Scripts.Portfolio.html's P/L panel +
 * Api.Pricing.gs's calculateProfitAnalysis. Shares the Trade tab's bootstrap
 * query (same query key), so opening both doesn't double the network calls.
 */
export function usePortfolioPL(metal: MetalType) {
    const tradeApi = useTradeApi();
    const portfolioApi = usePortfolioApi();

    const bootstrapQuery = useQuery({
        queryKey: queryKeys.trade.bootstrap(metal),
        queryFn: () => tradeApi.getBootstrap(metal),
    });

    const products = useMemo(() => bootstrapQuery.data?.products ?? [], [bootstrapQuery.data]);

    const [productId, setProductId] = useState<number | null>(null);
    const [purchMode, setPurchMode] = useState<PurchaseMode>('premium');
    const [purchaseSpot, setPurchaseSpot] = useState<number | null>(null);
    const [purchasePremium, setPurchasePremium] = useState(0);
    const [purchasePrice, setPurchasePrice] = useState(0);
    const [currentSpot, setCurrentSpot] = useState<number | null>(null);
    const [currentDiscount, setCurrentDiscount] = useState(0);
    const [targetProfit, setTargetProfit] = useState(0);

    const lastResetMetal = useRef<MetalType | null>(null);
    useEffect(() => {
        if (!bootstrapQuery.data || lastResetMetal.current === metal) return;
        lastResetMetal.current = metal;

        const defaultProduct = findDefaultProduct(bootstrapQuery.data.products);

        setProductId(defaultProduct?.id ?? null);
        setPurchaseSpot(bootstrapQuery.data.spot);
        setCurrentSpot(bootstrapQuery.data.spot);
        setPurchMode('premium');
        setPurchasePremium(defaultProduct?.premiumPct ?? 0);
        setCurrentDiscount(defaultProduct?.discountPct ?? 0);
        setTargetProfit(0);
    }, [metal, bootstrapQuery.data]);

    const selectProduct = useCallback(
        (id: number) => {
            const product = products.find((p) => p.id === id);
            setProductId(id);
            if (product) {
                setPurchMode('premium');
                setPurchasePremium(product.premiumPct);
                setCurrentDiscount(product.discountPct);
            }
        },
        [products],
    );

    const missingField: ProfitAnalysisMissingFieldDto = purchMode === 'premium' ? 'price' : 'premium';

    const [payload, setPayload] = useState<ProfitAnalysisRequest | null>(null);

    useEffect(() => {
        if (!productId || purchaseSpot === null || currentSpot === null || currentSpot <= 0) {
            setPayload(null);
            return;
        }

        const handle = setTimeout(() => {
            setPayload({
                metalType: metal,
                productId,
                purchaseSpot,
                purchasePremium,
                purchasePrice,
                missingField,
                currentSpot,
                currentDiscount,
                targetProfit,
            });
        }, DEBOUNCE_MS);

        return () => clearTimeout(handle);
    }, [metal, productId, purchaseSpot, purchasePremium, purchasePrice, missingField, currentSpot, currentDiscount, targetProfit]);

    const analysisQuery = useQuery({
        queryKey: ['portfolio', 'profit-analysis', payload] as const,
        queryFn: () => portfolioApi.calculateProfitAnalysis(payload as ProfitAnalysisRequest),
        enabled: payload !== null,
        placeholderData: (prev) => prev,
    });

    const moveRequired = useMemo(() => {
        const data = analysisQuery.data;
        if (!data || !data.currentSpot) return null;
        return ((data.requiredSpot - data.currentSpot) / data.currentSpot) * 100;
    }, [analysisQuery.data]);

    return {
        bootstrapLoading: bootstrapQuery.isLoading,
        products,

        productId,
        selectProduct,

        purchMode,
        togglePurchMode: () => setPurchMode((m) => (m === 'premium' ? 'price' : 'premium')),

        purchaseSpot,
        setPurchaseSpot,
        purchasePremium,
        setPurchasePremium,
        purchasePrice,
        setPurchasePrice,

        currentSpot,
        setCurrentSpot,
        currentDiscount,
        setCurrentDiscount,

        targetProfit,
        setTargetProfit,

        result: analysisQuery.data,
        moveRequired,
        loading: analysisQuery.isFetching,
        error: analysisQuery.error as Error | null,
    };
}

/**
 * Portfolio Scenario subtab — pure client arithmetic, no backend involved.
 * Ported from Scripts.Portfolio.html's Scenario panel (the slider there is
 * replaced with a plain percentage input — this project has no Slider
 * primitive).
 */
export function usePortfolioScenario() {
    const [value, setValue] = useState(50000);
    const [pct, setPct] = useState(10);

    const newValue = value * (1 + pct / 100);
    const change = newValue - value;
    const onePercent = value * 0.01;

    return {
        value,
        setValue,
        pct,
        setPct,
        newValue,
        change,
        onePercent,
    };
}

/**
 * Portfolio Builder subtab — ported from Scripts.Portfolio.html's Builder
 * panel + Api.Portfolio.gs's buildPortfolio. Unlike P/L/Scenario, this is an
 * explicit "Build portfolio options" action rather than live-debounced —
 * matching the original UX, and appropriate given the backend evaluates
 * a few thousand candidate portfolios per call.
 */
export function usePortfolioBuilder(metal: MetalType) {
    const tradeApi = useTradeApi();
    const portfolioApi = usePortfolioApi();

    const bootstrapQuery = useQuery({
        queryKey: queryKeys.trade.bootstrap(metal),
        queryFn: () => tradeApi.getBootstrap(metal),
    });

    const products = useMemo(() => bootstrapQuery.data?.products ?? [], [bootstrapQuery.data]);

    const [budget, setBudget] = useState(10000);
    const [productType, setProductType] = useState<PortfolioProductTypeFilter>('either');
    const [priorityProductId, setPriorityProductId] = useState<number | null>(null);
    const [priorityStrength, setPriorityStrength] = useState<PriorityStrength>('none');

    const lastResetMetal = useRef<MetalType | null>(null);
    useEffect(() => {
        if (lastResetMetal.current === metal) return;
        lastResetMetal.current = metal;
        setPriorityProductId(null);
        setPriorityStrength('none');
    }, [metal]);

    const mutation = useMutation({
        mutationFn: () =>
            portfolioApi.buildPortfolio({
                metalType: metal,
                budget,
                productType,
                priorityProductId: priorityProductId ?? undefined,
                priorityStrength,
            }),
    });

    const build = useCallback(() => {
        if (budget <= 0) return;
        mutation.mutate();
    }, [budget, mutation]);

    return {
        bootstrapLoading: bootstrapQuery.isLoading,
        products,

        budget,
        setBudget,
        productType,
        setProductType,
        priorityProductId,
        setPriorityProductId,
        priorityStrength,
        setPriorityStrength,

        build,
        results: (mutation.data as PortfolioBuildResponse | undefined)?.results ?? null,
        loading: mutation.isPending,
        error: mutation.error as Error | null,
        hasBuilt: mutation.isSuccess || mutation.isError,
    };
}
