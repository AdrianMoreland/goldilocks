import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTradeApi } from '@/api/trade.api';
import { queryKeys } from '@/lib/query-keys';
import type { MetalType } from '@/lib/types';
import { usePricingSettings } from '@/app/dashboard/context/pricing-settings-context';
import { useSpotPrices } from '@/app/dashboard/context/spot-prices-context';
import { usePricingTools } from '@/app/dashboard/context/pricing-tools-context';
import { useMeltCalculator } from './use-melt-calculator.hook';
import { findDefaultProduct } from '@/lib/default-product';
import {
    GRAMS_PER_TROY_OUNCE,
    MeltCategoryKeyEnum,
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
    // Rounded: premium (5.9) plus a mode delta (0.5) carries float noise otherwise.
    return Math.round(Math.max(0, base + adjustmentDeltaPct) * 1e4) / 1e4;
}

/**
 * Trade tab state + calculations — buy/sell cart and melt/scrap calculator,
 * scoped to a single metal mode. Ported from the Merrion Gold Apps Script
 * tool's Scripts.Trade.html + Api.Trade.gs/Api.Melt.gs.
 *
 * The spot here is the same number the metal's card shows — the user's
 * override if they froze or typed one, otherwise the live price. Editing it
 * in this tab edits the card, so Trade, Melt, Portfolio and the cards can
 * never quote different spots. (The old per-tab "Freeze" is now the card's
 * own freeze control.)
 */
export function useTradeTools(
    metal: MetalType,
    selectedProductIds: number[] = [],
    pendingTradeProductId: number | null = null,
    clearPendingTradeProduct: () => void = () => {},
) {
    const api = useTradeApi();
    const { getAdjustmentDelta } = usePricingSettings();
    const { displayPrices, setSpot: setMetalSpot, clearSpot } = useSpotPrices();
    const { transactionType, setTransactionType: setTransactionTypeState } = usePricingTools();

    // Cart + spot are kept per metal, not reset on every switch — leaving
    // metal X's quote and looking at metal Y (or its dashboard card) must
    // not discard what was being built for X, so the panel can work like a
    // running quote per metal instead of a single throwaway scratchpad.
    const [cartsByMetal, setCartsByMetal] = useState<Partial<Record<MetalType, CartItemState[]>>>({});
    const initializedMetals = useRef<Set<MetalType>>(new Set());

    const items = cartsByMetal[metal] ?? [];
    const spot = displayPrices[metal] > 0 ? displayPrices[metal] : null;

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
        (value: number) => {
            // A blank or zero field mid-typing must not become a €0 override.
            if (value > 0) setMetalSpot(metal, value);
        },
        [metal, setMetalSpot],
    );

    const [subTab, setSubTab] = useState<'products' | 'melt'>('products');
    const melt = useMeltCalculator(subTab === 'melt', displayPrices);

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

    // Price/Buyback lives in the pricing-tools context so a keyboard shortcut
    // can flip it from anywhere — so re-default the cart's premium/discount
    // whenever it changes, not just when this tab's own toggle is clicked.
    const lastTransactionType = useRef(transactionType);
    useEffect(() => {
        if (lastTransactionType.current === transactionType) return;
        lastTransactionType.current = transactionType;

        setItemsForMetal((current) =>
            current.map((item) => ({
                ...item,
                percent: defaultPercentFor(products, item.productId, transactionType, adjustmentDeltaPct),
            })),
        );
        if (transactionType === 'buying') setSubTab('products'); // melt only makes sense when selling
    }, [transactionType, products, adjustmentDeltaPct, setItemsForMetal]);

    const setTransactionType = setTransactionTypeState;

    /** Back to the live market price (drops this metal's override). */
    const resetSpot = useCallback(() => clearSpot(metal), [clearSpot, metal]);

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

    /**
     * Prices the same items from the other side of the trade (Buyback when
     * quoting Price, and vice versa) at each product's own default
     * premium/discount plus any active market mode — for customer messages
     * that show both figures. The cart on screen is left untouched.
     */
    const quoteOppositeSide = useCallback(
        (customSpot: number) => {
            const other: TradeTransactionType = transactionType === 'buying' ? 'selling' : 'buying';
            const delta = getAdjustmentDelta(metal, other === 'buying' ? 'sell' : 'buy') * 100;

            return api.calculateCart({
                metalType: metal,
                transactionType: other,
                customSpot,
                items: items
                    .filter((i) => i.productId !== null)
                    .map((i) => ({
                        productId: i.productId as number,
                        quantity: i.quantity,
                        percent: defaultPercentFor(products, i.productId, other, delta),
                    })),
            });
        },
        [api, transactionType, getAdjustmentDelta, metal, items, products],
    );

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
        queryKey: queryKeys.trade.cart(cartPayload),
        queryFn: () => api.calculateCart(cartPayload as TradeCartRequest),
        enabled: cartPayload !== null,
        placeholderData: (prev) => prev,
    });

    return {
        bootstrap: bootstrapQuery.data,
        bootstrapLoading: bootstrapQuery.isLoading,
        bootstrapError: bootstrapQuery.error,
        products,

        transactionType,
        setTransactionType,

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

        quoteOppositeSide,

        cartResult: cartQuery.data,
        cartLoading: cartQuery.isFetching,
        cartError: cartQuery.error as Error | null,

        ...melt,
    };
}
