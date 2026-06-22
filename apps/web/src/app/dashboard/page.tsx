import { RefreshCw } from 'lucide-react';
import { DataTable } from './components/data-table.tsx';
import { BaseLayout } from '@/components/layouts/base-layout';
import { SectionCards } from './components/section-cards.tsx';
import { ChartAreaInteractive } from './components/chart-area-interactive.tsx';
import { Button } from '@/components/ui/button';
import { METALS, usePricingWorkbook } from '@/hooks/use-pricing-workbook.hook.ts';

export default function Page() {
    const {
        products,
        // loading,
        // error,
        displayPrices,
        spotStatusLabel,
        refresh,
        refreshing,
        selectedMetal,
        toggleSelectedMetal,
        handleSpotOverride,
    } = usePricingWorkbook();

    const productsArr = Array.isArray(products) ? products : [];

    return (
        <BaseLayout
            title="Pricing Workbook"
            description="Prices are updated automatically, but you can pause, enter a custom spot price and more."
        >
            {/* ── Header ──────────────────────────────────────────────────── */}
            <div className="flex items-center justify-between px-4 lg:px-6 pb-2">
                <p className="text-sm text-muted-foreground">{spotStatusLabel}</p>

                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => refresh()}
                    disabled={refreshing}
                    className="gap-2 cursor-pointer"
                >
                    <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                    {refreshing ? 'Refreshing…' : 'Refresh Spot Prices'}
                </Button>
            </div>

            {/* ── Metal cards ─────────────────────────────────────────────── */}
            <div className="@container/main px-4 lg:px-6 space-y-6">
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                    {METALS.map((metal) => (
                        <SectionCards
                            key={metal}
                            title={metal}
                            price={displayPrices[metal]}
                            description={spotStatusLabel}
                            active={selectedMetal === metal}
                            onClick={() => toggleSelectedMetal(metal)}
                            onValueChange={(value) => handleSpotOverride(metal, value)}
                        />
                    ))}
                </div>

                {productsArr.length > 0 ? (
                    <ChartAreaInteractive />
                ) : (
                    <p className="text-muted-foreground text-sm">No products to display chart</p>
                )}
            </div>

            {/* ── Table ───────────────────────────────────────────────────── */}
            <div className="@container/main">
                <DataTable data={productsArr} />
            </div>
        </BaseLayout>
    );
}


/*
import { useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { DataTable } from './components/data-table.tsx';
import { BaseLayout } from '@/components/layouts/base-layout';
import { SectionCards } from './components/section-cards.tsx';
import { ChartAreaInteractive } from './components/chart-area-interactive.tsx';
import { Button } from '@/components/ui/button';
import { useProducts } from '@/hooks/use-products.hook.ts';
import { useMetalSpotPrices } from '@/hooks/use-metal-spot-prices.hook.ts';
import type {MetalType} from "@/api/api.ts";

const METALS = ['GOLD', 'SILVER', 'PLATINUM', 'PALLADIUM'] as const;

function countByMetal(products: { metalType: string }[]) {
    return Object.fromEntries(
        METALS.map((metal) => [metal, products.filter((p) => p.metalType === metal).length]),
    ) as Record<(typeof METALS)[number], number>;
}

function spotStatusLabel(
    loading: boolean,
    error: unknown,
    lastUpdated: string | undefined,
) {
    if (loading) return 'Loading spot prices…';
    if (error) return 'Could not load spot prices';
    return `Live spot prices${lastUpdated ? ` · updated ${lastUpdated}` : ''}`;
}

export default function Page() {
    const [selectedMetal, setSelectedMetal] = useState<MetalType | null>(null);
    const [spotOverrides, setSpotOverrides] = useState<Partial<Record<MetalType, number>>>({});

    const {
        products = [],
        loading: productsLoading,
        error: productsError,
    } = useProducts({ spotOverrides });

    const { prices, loadingSpot, errorSpot, refreshPrices, isRefreshing } = useMetalSpotPrices();

    const {
        prices,
        loadingSpot,
        errorSpot,
        refreshPrices,
        isRefreshing,
    } = useMetalSpotPrices();

    const {
        products,
        prices,
        loadingSpot,
        errorSpot,
        refreshPrices,
        isRefreshing,
        selectedMetal,
        setSelectedMetal,
        handleSpotOverride,
        productsDescription,
    } = usePricingWorkbook();
    /!**
     * Handles recalculation of product prices based on spot price overrides.
     * @param {Partial<Record<MetalType, number>>} overrides - The overridden spot prices.
     *!/
    const handleRecalc = (overrides: Partial<Record<MetalType, number>>) => {
        recalc(overrides);
    };


    /!**
     * Updates the spot price override for a specific metal.
     * @param {MetalType} metal - The metal type to override.
     * @param {number} value - The new spot price value.
     *!/
    const handleSpotOverride = (metal: MetalType, value: number) => {
        setSpotOverrides((prev) => ({ ...prev, [metal]: value }));
    };

    useEffect(() => {
        if (Object.keys(spotOverrides).length === 0) return;
        console.log("spotOverrides changed:", spotOverrides);

        const timeout = setTimeout(() => {
            console.log("CALLING RECALC:", spotOverrides);
            recalc(spotOverrides);
        }, 300);

        return () => clearTimeout(timeout);
    }, [spotOverrides, recalc]);


    return (
        <BaseLayout
            title="Pricing Workbook"
            description="Prices are updated automatically, but you can pause, enter a custom spot price and more."
        >
            {/!* ── Header row: title area + refresh button ───────────────────── *!/}
            <div className="flex items-center justify-between px-4 lg:px-6 pb-2">
                <p className="text-sm text-muted-foreground">
                    {loadingSpot
                        ? 'Loading spot prices…'
                        : errorSpot
                            ? 'Could not load spot prices'
                            : `Showing live spot prices for ${METALS.length} metals`}
                </p>

                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => refreshPrices()}
                    disabled={isRefreshing}
                    className="gap-2 cursor-pointer"
                >
                    <RefreshCw
                        className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`}
                    />
                    {isRefreshing ? 'Refreshing…' : 'Refresh Spot Prices'}
                </Button>
            </div>

            {/!* ── Metal cards ───────────────────────────────────────────────── *!/}
            <div className="@container/main px-4 lg:px-6 space-y-6">
                <MetalCards
                    metals={METALS}
                    prices={prices}
                    selectedMetal={selectedMetal}
                    productsDescription={
                        productsDescription
                    }
                    onSelectMetal={
                        setSelectedMetal
                    }
                    onSpotOverrideChange={
                        handleSpotOverride
                    }
                />

             {/!*   <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                    {METALS.map((metal) => (
                        <SectionCards
                            key={metal}
                            title={metal}
                            price={prices.find((p) => p.metalType === metal)?.currentPrice ?? 0}
                            description={
                                loading
                                    ? 'Loading…'
                                    : error
                                        ? 'Failed to load products'
                                        : `Products: ${}`
                            }
                            active={selectedMetal === metal}
                            onClick={() => setSelectedMetal(metal)}
                            onValueChange={(value) => {
                                setSpotOverrides(prev => ({
                                    ...prev,
                                    [metal]: value,
                                }));
                            }}
                        />
                    ))}
                </div>*!/}

                {products.length > 0 ? (
                    <ChartAreaInteractive />
                ) : (
                    <p className="text-muted-foreground text-sm">No products to display chart</p>
                )}
            </div>

            {/!* ── Products table ────────────────────────────────────────────── *!/}
            <div className="@container/main">
                <DataTable data={products} />
            </div>
        </BaseLayout>
    );
}*/


/*
import {useEffect, useState} from "react";
import { DataTable } from "./components/data-table.tsx"
import { BaseLayout } from "@/components/layouts/base-layout"
import { PauseIcon } from "lucide-react"
import { SectionCards } from "./components/section-cards.tsx"
import { ChartAreaInteractive } from "./components/chart-area-interactive.tsx"
// import pastPerformanceData from "./data/past-performance-data.json"
// import keyPersonnelData from "./data/key-personnel-data.json"
// import focusDocumentsData from "./data/focus-documents-data.json"

import { useProducts } from "@/hooks/use-products.hook.ts";
import {useMetalSpotPrices} from "@/hooks/use-metal-spot-prices.hook.ts";

const METALS = ["GOLD", "SILVER", "PLATINUM", "PALLADIUM"];


export default function Page() {
    const [selectedMetal, setSelectedMetal] = useState<string | null>(null);

    const { products = [], loading, error } = useProducts();
    const { prices = [], loadingSpot, errorSpot } = useMetalSpotPrices();

    // Log fetched products
    useEffect(() => {
        console.log("Fetched products:", products);
    }, [products]);

    // Log errors if fetching fails
    useEffect(() => {
        if (error) {
            console.warn("Failed to fetch products:", error);
        }
    }, [error]);


    // Count products per metal safely
    const counts: Record<string, number> = {};
    for (const metal of METALS) {
        counts[metal] = products?.filter((p) => p.metalType === metal)?.length ?? 0;
    }

    return (
    <BaseLayout title="Pricing Workbook" description="Prices are updated automatically, but you can pause, enter a custom spot price and more.">
        <div className="@container/main px-4 lg:px-6 space-y-6">
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                {METALS.map((metal) => (
                    <SectionCards
                        key={metal}
                        title={metal}
                        price={
                            prices.find(p => p.metalType === metal)?.currentPrice ?? 0
                        }
                        description={
                            loading
                                ? "Loading..."
                                : error
                                    ? "Failed to load products"
                                    : `Products: ${counts[metal]}`
                        }
                        active={selectedMetal === metal}
                        onClick={() => setSelectedMetal(metal)}
                    />
                ))}
            </div>

            {products.length > 0 ? <ChartAreaInteractive /> : <p>No products to display chart</p>}

        </div>
        <div className="@container/main">
            {/!* DataTable with fallback for missing data *!/}
            <DataTable
                data={products ?? []}
            />
        </div>
    </BaseLayout>
    )
}
*/
