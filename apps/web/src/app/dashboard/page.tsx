import {useCallback, useMemo} from 'react';
import {useNavigate} from 'react-router-dom';
import {RefreshCw, PanelRight, LineChart, LayoutGrid, ShieldCheck, LogOut} from 'lucide-react';
import {DataTable} from './components/table/data-table2.tsx';
import {BaseLayout} from '@/components/layouts/base-layout';
import {ModeToggle} from '@/components/mode-toggle';
import {SectionCards} from './components/section-cards.tsx';
import {ChartAreaInteractive} from './components/chart-area-interactive.tsx';
import {Button} from '@/components/ui/button';
import {usePricingWorkbook} from '@/hooks/use-pricing-workbook.hook.ts';
import {useGlobalShortcuts} from '@/hooks/use-global-shortcuts.hook';
import {useAuth} from '@/contexts/auth-context';
import {useUserPreference} from '@/hooks/use-user-preference.hook';
import {PricingToolsProvider, usePricingTools} from './context/pricing-tools-context';
import {PricingSettingsProvider} from './context/pricing-settings-context';
import {PricingToolsPanel} from './components/pricing-tools/pricing-tools-panel';
import {AdminSidePanel} from './components/admin/admin-side-panel';
import {KeyboardShortcutsHint} from './components/keyboard-shortcuts-hint';
import {DataFreshnessIndicator} from './components/data-freshness-indicator';
import {StalePricesBanner} from './components/stale-prices-banner';
import {summarizeFetchSource} from './utils/fetch-source';
import {MarketModeBanner} from './components/market-mode-banner';
import {SpotPricesProvider} from './context/spot-prices-context';
import type {MetalType} from '@/lib/types';

export default function Page() {
    return (
        <PricingSettingsProvider>
            <PricingToolsProvider>
                <DashboardShell/>
            </PricingToolsProvider>
        </PricingSettingsProvider>
    );
}

/**
 * Owns the one usePricingWorkbook() call and the top-level flex row — main
 * content, then whichever right-hand panel is showing. Both side panels
 * (Pricing Tools and Admin) sit as flex siblings here, at the exact same
 * width/height, rather than one being nested only inside the other's tree —
 * that's what lets the Admin panel occupy that shared slot at all.
 */
function DashboardShell() {
    const workbook = usePricingWorkbook();

    const spotPrices = useMemo(
        () => ({
            displayPrices: workbook.displayPrices,
            overriddenMetals: Object.keys(workbook.spotOverrides) as MetalType[],
            setSpot: workbook.handleSpotOverride,
            clearSpot: workbook.clearSpotOverride,
        }),
        [workbook.displayPrices, workbook.spotOverrides, workbook.handleSpotOverride, workbook.clearSpotOverride],
    );

    return (
        <SpotPricesProvider value={spotPrices}>
            <div className="flex h-svh flex-col overflow-hidden">
                <MarketModeBanner/>
                <div className="flex min-h-0 flex-1 items-stretch gap-4 overflow-hidden">
                    <div className="flex min-h-0 min-w-0 flex-1 flex-col">
                        <PricingWorkbookPage workbook={workbook}/>
                    </div>
                    <PricingToolsPanel/>
                    <AdminSidePanel metalCards={workbook.metalCards}/>
                </div>
            </div>
        </SpotPricesProvider>
    );
}

function PricingWorkbookPage({workbook}: { workbook: ReturnType<typeof usePricingWorkbook> }) {
    const {
        products,
        historicSpot,
        metalCards,
        lastUpdatedRelative,
        isStale,
        refresh,
        refreshing,
        selectedMetal,
        setSelectedMetal,
        toggleSelectedMetal,
        handleSpotOverride,
        clearSpotOverride,
        clearAllSpotOverrides,
        freezeSpot,
        fetchedAt,
        loading,
        error,
    } = workbook;
    const { open: toolsOpen, toggleOpen: toggleTools, adminPanelOpen, toggleAdminPanel, cardsVisible, toggleCardsVisible, flipTransactionType, focusTradeQuantity, clearSelection } = usePricingTools();
    const { isAdmin, logout } = useAuth();
    const navigate = useNavigate();
    const [graphVisible, setGraphVisible] = useUserPreference('chart-visible', true);

    // Ctrl+Z: back to a clean slate — every frozen spot resumes live, every ticked row is unticked.
    const resetAll = useCallback(() => {
        clearAllSpotOverrides();
        clearSelection();
    }, [clearAllSpotOverrides, clearSelection]);

    useGlobalShortcuts({
        onToggleTools: toggleTools,
        onToggleChart: () => setGraphVisible((v) => !v),
        onToggleAdminPanel: isAdmin ? toggleAdminPanel : undefined,
        onSelectMetal: setSelectedMetal,
        onFlipTransaction: flipTransactionType,
        onFocusQuantity: focusTradeQuantity,
        onResetAll: resetAll,
    });

    const handleLogout = () => {
        logout();
        navigate('/auth/sign-in', { replace: true });
    };

    const productsArr = Array.isArray(products) ? products : [];

    return (
        <BaseLayout
            fillViewport
            title="Pricing Workbook"
            showLogo
            manualModeToggle
            headerActions={() => (
                <>
                    <DataFreshnessIndicator
                        lastUpdatedRelative={lastUpdatedRelative}
                        snapshotAt={fetchedAt}
                        fetchSource={summarizeFetchSource(metalCards)}
                        isStale={isStale}
                    />
                    {/* Order: Update, Graph, Cards, Day/Night, Sidebar open, (admin: Admin panel), Logout. */}
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => refresh()}
                        disabled={refreshing}
                        className="cursor-pointer"
                        title="Refresh spot prices"
                        aria-label="Refresh spot prices"
                    >
                        <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`}/>
                    </Button>
                    <Button
                        variant={graphVisible ? "default" : "outline"}
                        size="icon"
                        className="cursor-pointer"
                        title="Toggle price chart (g)"
                        aria-label="Toggle price chart"
                        onClick={() => setGraphVisible((v) => !v)}
                    >
                        <LineChart className="h-4 w-4"/>
                    </Button>
                    <Button
                        variant={cardsVisible ? "default" : "outline"}
                        size="icon"
                        className="cursor-pointer"
                        title="Toggle metal cards"
                        aria-label="Toggle metal cards"
                        onClick={toggleCardsVisible}
                    >
                        <LayoutGrid className="h-4 w-4"/>
                    </Button>
                    <ModeToggle />
                    <Button
                        variant={toolsOpen && !adminPanelOpen ? "default" : "outline"}
                        size="icon"
                        className="cursor-pointer"
                        title="Toggle pricing tools panel (t)"
                        aria-label="Toggle pricing tools panel"
                        onClick={toggleTools}
                    >
                        <PanelRight className="h-4 w-4"/>
                    </Button>
                    {isAdmin && (
                        <Button
                            variant={adminPanelOpen ? "default" : "outline"}
                            size="icon"
                            className="cursor-pointer"
                            title="Admin panel (a)"
                            aria-label="Admin panel"
                            onClick={toggleAdminPanel}
                        >
                            <ShieldCheck className="h-4 w-4"/>
                        </Button>
                    )}
                    <Button
                        variant="outline"
                        size="icon"
                        className="cursor-pointer"
                        title="Sign out"
                        aria-label="Sign out"
                        onClick={handleLogout}
                    >
                        <LogOut className="h-4 w-4"/>
                    </Button>
                </>
            )}
        >
            {/* ── Cards + chart — fixed in place, never scroll. ───────────── */}
            <div className="bg-background shrink-0 pt-4 pb-4">
                <div className="px-4 lg:px-6">
                    {isStale && (
                        <div className="mb-3">
                            <StalePricesBanner
                                lastUpdatedRelative={lastUpdatedRelative}
                                snapshotAt={fetchedAt}
                                fetchSource={summarizeFetchSource(metalCards)}
                                onRefresh={() => refresh()}
                                refreshing={refreshing}
                            />
                        </div>
                    )}

                    {cardsVisible && (
                        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                            {metalCards.map((card) => (
                                <SectionCards
                                    key={card.metal}
                                    data={card}
                                    active={selectedMetal === card.metal}
                                    onClick={() =>
                                        toggleSelectedMetal(card.metal)
                                    }
                                    onValueChange={(value) =>
                                        handleSpotOverride(
                                            card.metal,
                                            value
                                        )
                                    }
                                    onFreeze={() => freezeSpot(card.metal)}
                                    onClearOverride={() => {
                                        clearSpotOverride(card.metal);
                                    }}
                                />
                            ))}
                        </div>
                    )}

                    {graphVisible && (
                        <div className="mt-4 h-[clamp(140px,26vh,320px)]">
                            {historicSpot.length > 0 ? (
                                <ChartAreaInteractive
                                    data={historicSpot}
                                    selectedMetal={selectedMetal}
                                />
                            ) : (
                                <p className="text-muted-foreground text-sm">
                                    No historic market data available
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* ── Table — the only thing that scrolls; its own column
                header stays pinned to the top of that scroll area. A min
                height keeps it from being fully crushed by the cards/chart
                block above on a very short window. ────────────────────── */}
            <div className="@container/main flex min-h-[180px] flex-1 flex-col overflow-hidden">
                <DataTable
                    data={productsArr}
                    activeMetal={selectedMetal}
                    onActiveMetalChange={setSelectedMetal}
                    isLoading={loading}
                    hasError={Boolean(error)}
                />
            </div>

            <KeyboardShortcutsHint isAdmin={isAdmin}/>
        </BaseLayout>
    );
}
