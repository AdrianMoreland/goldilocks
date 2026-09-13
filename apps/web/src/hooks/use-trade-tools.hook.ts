import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTradeApi } from '@/api/trade.api';
import { queryKeys } from '@/lib/query-keys';
import type { MetalType } from '@/lib/types';
import { usePricingSettings } from '@/app/dashboard/context/pricing-settings-context';
import {
    GRAMS_PER_TROY_OUNCE,
    MeltCategoryKeyEnum,
    type MeltCategoryKey,
    type TradeCartRequest,
    type TradeProduct,
    type TradeTransactionType,
} from '@goldilocks/shared-types';

const DEBOUNCE_MS = 150;

export const MELT_CATEGORY_OPTIONS = MeltCategoryKeyEnum.options;

interface CartItemState {
    id: number;
    productId: number | null;
    quantity: number;
    percent: number;
}

// transactionType 'buying' = customer buys from us (our sell side, premium);
// 'selling' = customer sells to us (our buy side, discount) — see
// pricing-settings-context's getAdjustmentDelta, which speaks in those terms.
function defaultPercentFor(
    products: TradeProduct[],
    productId: number | null,
    transactionType: TradeTransactionType,
    adjustmentDeltaPct = 0,
): number {
    const product = products.find((p) => p.id === productId);
    if (!product) return 0;
    const base = transactionType === 'buying' ? product.premiumPct : product.discountPct;
    return Math.max(0, base + adjustmentDeltaPct);
}

const BAR_NAME_RE = /bar/i;
const BONDED_NAME_RE = /bonded/i;

// The default product opened for a fresh metal quote — plain 1oz bars for
// gold/platinum/palladium, a 1kg bar for silver (matching how each metal is
// actually traded in bulk). Picked by shape (bar) + weight rather than by
// name text alone, since "contains 1oz" also matches mint coins like the
// US Eagle — which isn't a high-volume product and shouldn't be the default.
// Bonded bars are excluded even though they match the same weight tier —
// they're a separate, specialty pricing product, not the standard bar.
function findDefaultProduct(metal: MetalType, products: TradeProduct[]): TradeProduct | null {
    const targetWeight = metal === 'SILVER' ? 1000 : GRAMS_PER_TROY_OUNCE;
    const tolerance = metal === 'SILVER' ? 1 : 0.5;

    const bar = products.find(
        (p) => BAR_NAME_RE.test(p.name) && !BONDED_NAME_RE.test(p.name) && Math.abs(p.weight - targetWeight) < tolerance,
    );
    return bar ?? products[0] ?? null;
}

/**
 * Trade tab state + calculations — buy/sell cart and melt/scrap calculator,
 * scoped to a single metal mode. Ported from the Merrion Gold Apps Script
 * tool's Scripts.Trade.html + Api.Trade.gs/Api.Melt.gs.
 *
 * "Freeze" here means: while ON, the working spot price won't be
 * overwritten by a background refetch of live prices. The original
 * spreadsheet tool used freeze to stop the active cart item from following
 * the user's spreadsheet cell selection — there's no equivalent "active
 * cell" concept in a web dashboard, so this is the closest faithful
 * reinterpretation: it protects a manually-typed spot price from being
 * clobbered while the user is working with it.
 */
export function useTradeTools(
    metal: MetalType,
    selectedProductIds: number[] = [],
    pendingTradeProductId: number | null = null,
    clearPendingTradeProduct: () => void = () => {},
) {
    const api = useTradeApi();
    const { getAdjustmentDelta } = usePricingSettings();

    const [transactionType, setTransactionTypeState] = useState<TradeTransactionType>('buying');
    const [freeze, setFreeze] = useState(true);

    // Cart + spot are kept per metal, not reset on every switch — leaving
    // metal X's quote and looking at metal Y (or its dashboard card) must
    // not discard what was being built for X, so the panel can work like a
    // running quote per metal instead of a single throwaway scratchpad.
    const [cartsByMetal, setCartsByMetal] = useState<Partial<Record<MetalType, CartItemState[]>>>({});
    const [spotByMetal, setSpotByMetal] = useState<Partial<Record<MetalType, number>>>({});
    const initializedMetals = useRef<Set<MetalType>>(new Set());

    const items = cartsByMetal[metal] ?? [];
    const spot = spotByMetal[metal] ?? null;

    // A ref rather than state: syncing the product-table selection can add
    // several items in one pass (see the effect below), which needs several
    // fresh ids synchronously — state's next-render-only update can't do that.
    const nextItemIdRef = useRef(1);
    const newItemId = useCallback(() => nextItemIdRef.current++, []);

    const setItemsForMetal = useCallback(
        (updater: (current: CartItemState[]) => CartItemState[]) => {
            setCartsByMetal((prev) => ({ ...prev, [metal]: updater(prev[metal] ?? []) }));
        },
        [metal],
    );

    const setSpot = useCallback(
        (value: number) => setSpotByMetal((prev) => ({ ...prev, [metal]: value })),
        [metal],
    );

    const [subTab, setSubTab] = useState<'products' | 'melt'>('products');
    const [meltCategory, setMeltCategory] = useState<MeltCategoryKey>('24ct');
    const [meltWeight, setMeltWeight] = useState(31.1);

    const bootstrapQuery = useQuery({
        queryKey: queryKeys.trade.bootstrap(metal),
        queryFn: () => api.getBootstrap(metal),
        refetchInterval: 60_000,
    });

    const products = useMemo(() => bootstrapQuery.data?.products ?? [], [bootstrapQuery.data]);

    // Active Weekend/Volatile/Metal-Shortage modes (see Settings tab), as a
    // percentage-point delta for whichever side of the trade is in play.
    const adjustmentDeltaPct = useMemo(
        () => getAdjustmentDelta(metal, transactionType === 'buying' ? 'sell' : 'buy') * 100,
        [getAdjustmentDelta, metal, transactionType],
    );

    // Seed a metal's quote the FIRST time it's ever visited in this session
    // only — switching away and back later leaves whatever's there alone.
    useEffect(() => {
        if (!bootstrapQuery.data || initializedMetals.current.has(metal)) return;
        initializedMetals.current.add(metal);

        setSpotByMetal((prev) => ({ ...prev, [metal]: bootstrapQuery.data!.spot }));

        const defaultProduct = findDefaultProduct(metal, bootstrapQuery.data!.products);
        setCartsByMetal((prev) => ({
            ...prev,
            [metal]: defaultProduct
                ? [
                      {
                          id: newItemId(),
                          productId: defaultProduct.id,
                          quantity: 1,
                          percent: defaultPercentFor(bootstrapQuery.data!.products, defaultProduct.id, transactionType, adjustmentDeltaPct),
                      },
                  ]
                : [],
        }));
        // transactionType/adjustmentDeltaPct intentionally omitted: this must
        // only run once per metal (its first load), not on every toggle.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [metal, bootstrapQuery.data]);

    // While unfrozen, keep this metal's working spot glued to its live price.
    useEffect(() => {
        if (freeze || !bootstrapQuery.data) return;
        setSpot(bootstrapQuery.data.spot);
    }, [bootstrapQuery.data, freeze, setSpot]);

    // "Open in Trade" from the Product tab: replace this metal's cart with
    // just the product that was opened, as soon as its data is available.
    useEffect(() => {
        if (pendingTradeProductId == null) return;
        const product = products.find((p) => p.id === pendingTradeProductId);
        if (!product) return;

        setItemsForMetal(() => [
            {
                id: newItemId(),
                productId: product.id,
                quantity: 1,
                percent: defaultPercentFor(products, product.id, transactionType, adjustmentDeltaPct),
            },
        ]);
        clearPendingTradeProduct();
        // transactionType/adjustmentDeltaPct read at trigger time only — this
        // must fire once per pending id, not every time either one changes.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pendingTradeProductId, products, clearPendingTradeProduct, setItemsForMetal, newItemId]);

    // Mirror the product table's row-selection checkboxes into this metal's
    // cart: whatever's checked there (and belongs to this metal — the table
    // selection isn't cleared when its own tab switches) is what shows up
    // here, priced with its own premium/discount. Existing quantity/percent
    // edits are preserved for products that stay selected; an empty
    // selection is left alone (unchecking every row shouldn't wipe out a
    // cart being built by hand).
    const relevantSelectedIds = useMemo(
        () => selectedProductIds.filter((id) => products.some((p) => p.id === id)),
        [selectedProductIds, products],
    );

    useEffect(() => {
        if (!relevantSelectedIds.length) return;

        setItemsForMetal((current) => {
            const existingByProductId = new Map(current.map((item) => [item.productId, item]));
            return relevantSelectedIds.map((productId) => {
                const existing = existingByProductId.get(productId);
                if (existing) return existing;
                return {
                    id: newItemId(),
                    productId,
                    quantity: 1,
                    percent: defaultPercentFor(products, productId, transactionType, adjustmentDeltaPct),
                };
            });
        });
    }, [relevantSelectedIds, products, transactionType, adjustmentDeltaPct, newItemId, setItemsForMetal]);

    const setTransactionType = useCallback(
        (mode: TradeTransactionType) => {
            setTransactionTypeState(mode);
            const delta = getAdjustmentDelta(metal, mode === 'buying' ? 'sell' : 'buy') * 100;
            setItemsForMetal((current) =>
                current.map((item) => ({
                    ...item,
                    percent: defaultPercentFor(products, item.productId, mode, delta),
                })),
            );
            if (mode === 'buying') setSubTab('products'); // melt only makes sense when selling
        },
        [products, metal, getAdjustmentDelta, setItemsForMetal],
    );

    const toggleFreeze = useCallback(() => setFreeze((f) => !f), []);

    const resetSpot = useCallback(async () => {
        const result = await bootstrapQuery.refetch();
        if (result.data) setSpot(result.data.spot);
    }, [bootstrapQuery, setSpot]);

    const addItem = useCallback(() => {
        const lastProductId = items.length ? items[items.length - 1].productId : (products[0]?.id ?? null);
        if (lastProductId === null) return;

        setItemsForMetal((current) => [
            ...current,
            {
                id: newItemId(),
                productId: lastProductId,
                quantity: 1,
                percent: defaultPercentFor(products, lastProductId, transactionType, adjustmentDeltaPct),
            },
        ]);
    }, [items, products, newItemId, transactionType, adjustmentDeltaPct, setItemsForMetal]);

    const removeItem = useCallback((id: number) => {
        setItemsForMetal((current) => current.filter((item) => item.id !== id));
    }, [setItemsForMetal]);

    const updateItemProduct = useCallback(
        (id: number, productId: number) => {
            setItemsForMetal((current) =>
                current.map((item) =>
                    item.id === id
                        ? { ...item, productId, percent: defaultPercentFor(products, productId, transactionType, adjustmentDeltaPct) }
                        : item,
                ),
            );
        },
        [products, transactionType, adjustmentDeltaPct, setItemsForMetal],
    );

    const updateItemQuantity = useCallback((id: number, quantity: number) => {
        setItemsForMetal((current) =>
            current.map((item) => (item.id === id ? { ...item, quantity: Math.max(1, Math.floor(quantity) || 1) } : item)),
        );
    }, [setItemsForMetal]);

    const updateItemPercent = useCallback((id: number, percent: number) => {
        setItemsForMetal((current) => current.map((item) => (item.id === id ? { ...item, percent } : item)));
    }, [setItemsForMetal]);

    const itemsView = useMemo(
        () =>
            items.map((item) => ({
                ...item,
                product: products.find((p) => p.id === item.productId) ?? null,
            })),
        [items, products],
    );

    // ── Cart pricing (debounced) ────────────────────────────────────────────
    const [cartPayload, setCartPayload] = useState<TradeCartRequest | null>(null);

    useEffect(() => {
        if (!spot || spot <= 0 || !items.length || items.some((i) => i.productId === null)) {
            setCartPayload(null);
            return;
        }

        const handle = setTimeout(() => {
            setCartPayload({
                metalType: metal,
                transactionType,
                customSpot: spot,
                items: items.map((i) => ({
                    productId: i.productId as number,
                    quantity: i.quantity,
                    percent: i.percent,
                })),
            });
        }, DEBOUNCE_MS);

        return () => clearTimeout(handle);
    }, [metal, transactionType, spot, items]);

    const cartQuery = useQuery({
        queryKey: ['trade', 'cart', cartPayload] as const,
        queryFn: () => api.calculateCart(cartPayload as TradeCartRequest),
        enabled: cartPayload !== null,
        placeholderData: (prev) => prev,
    });

    // ── Melt calculation (debounced) ────────────────────────────────────────
    const [meltPayload, setMeltPayload] = useState<{ category: MeltCategoryKey; weight: number } | null>(null);

    useEffect(() => {
        if (subTab !== 'melt' || !meltWeight || meltWeight <= 0) {
            setMeltPayload(null);
            return;
        }
        const handle = setTimeout(() => setMeltPayload({ category: meltCategory, weight: meltWeight }), DEBOUNCE_MS);
        return () => clearTimeout(handle);
    }, [subTab, meltCategory, meltWeight]);

    const meltQuery = useQuery({
        queryKey: ['trade', 'melt', meltPayload] as const,
        queryFn: () => api.calculateMelt(meltPayload as { category: MeltCategoryKey; weight: number }),
        enabled: meltPayload !== null,
        placeholderData: (prev) => prev,
    });

    return {
        bootstrap: bootstrapQuery.data,
        bootstrapLoading: bootstrapQuery.isLoading,
        bootstrapError: bootstrapQuery.error,
        products,

        transactionType,
        setTransactionType,

        freeze,
        toggleFreeze,

        spot,
        setSpot,
        resetSpot,
        minSpot: bootstrapQuery.data?.minSpot ?? 0,
        maxSpot: bootstrapQuery.data?.maxSpot ?? 0,

        items: itemsView,
        addItem,
        removeItem,
        updateItemProduct,
        updateItemQuantity,
        updateItemPercent,

        subTab,
        setSubTab,
        meltCategory,
        setMeltCategory,
        meltWeight,
        setMeltWeight,

        cartResult: cartQuery.data,
        cartLoading: cartQuery.isFetching,
        cartError: cartQuery.error as Error | null,

        meltResult: meltQuery.data,
        meltLoading: meltQuery.isFetching,
        meltError: meltQuery.error as Error | null,
    };
}
