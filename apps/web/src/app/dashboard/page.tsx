import {useCallback, useMemo} from 'react';
import {useNavigate} from 'react-router-dom';
import {RefreshCw, PanelRight, ChevronRight} from 'lucide-react';
import {DataTable} from './components/table/data-table2.tsx';
import {BaseLayout} from '@/components/layouts/base-layout';
import {SectionCards} from './components/section-cards.tsx';
import {ChartAreaInteractive} from './components/chart-area-interactive.tsx';
import {Button} from '@/components/ui/button';
import {Separator} from '@/components/ui/separator';
import {usePricingWorkbook} from '@/hooks/use-pricing-workbook.hook.ts';
import {useAssistantDock} from '@/contexts/docks-context';
import {useGlobalShortcuts} from '@/hooks/use-global-shortcuts.hook';
import {useAuth} from '@/contexts/auth-context';
import {useUserPreference} from '@/hooks/use-user-preference.hook';
import {PricingToolsProvider, usePricingTools} from './context/pricing-tools-context';
import {PricingSettingsProvider} from './context/pricing-settings-context';
import {PricingToolsPanel} from './components/pricing-tools/pricing-tools-panel';
import {AssistantDock, AssistantToggle} from '../knowledge/components/assistant-panel';
import {KeyboardShortcutsHint} from './components/keyboard-shortcuts-hint';
import {DataFreshnessIndicator} from './components/data-freshness-indicator';
import {StalePricesNotice} from './components/stale-prices-notice';
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
 * content, then the Pricing Tools panel.
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
                    <AssistantDock/>
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
    const { open: toolsOpen, toggleOpen: toggleTools, flipTransactionType, focusTradeQuantity, clearSelection } = usePricingTools();
    const { isAdmin } = useAuth();
    const assistant = useAssistantDock();
    const navigate = useNavigate();
    const [graphVisible, setGraphVisible] = useUserPreference('chart-visible', true);

    // Ctrl+Z: back to a clean slate — every frozen spot resumes live, every ticked row is unticked.
    const resetAll = useCallback(() => {
        clearAllSpotOverrides();
        clearSelection();
    }, [clearAllSpotOverrides, clearSelection]);

    // With the assistant showing in the tools slot, "tools" means "bring the tools back".
    const toggleToolsPanel = () => {
        if (assistant.open) {
            assistant.close();
            if (!toolsOpen) toggleTools();
        } else toggleTools();
    };

    useGlobalShortcuts({
        onToggleTools: toggleToolsPanel,
        onToggleChart: () => setGraphVisible((v) => !v),
        onOpenAdmin: isAdmin ? () => navigate('/admin') : undefined,
        onSelectMetal: setSelectedMetal,
        onFlipTransaction: flipTransactionType,
        onFocusQuantity: focusTradeQuantity,
        onResetAll: resetAll,
    });

    const productsArr = Array.isArray(products) ? products : [];

    const fetchSource = summarizeFetchSource(metalCards);

    return (
        <BaseLayout
            fillViewport
            title="Pricing Workbook"
            showLogo
            headerActions={() => (
                <>
                    {/* One cluster for price status: how fresh, why to worry, and the fix. Day/night, theme editor and sign-out live in the sidebar's user menu; the chart's collapse control lives on the chart. */}
                    <DataFreshnessIndicator
                        lastUpdatedRelative={lastUpdatedRelative}
                        snapshotAt={fetchedAt}
                        fetchSource={fetchSource}
                        isStale={isStale}
                    />
                    {isStale && (
                        <StalePricesNotice
                            lastUpdatedRelative={lastUpdatedRelative}
                            snapshotAt={fetchedAt}
                            fetchSource={fetchSource}
                        />
                    )}
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
                    <Separator orientation="vertical" className="mx-1 hidden data-[orientation=vertical]:h-5 sm:block"/>
                    {/* Next to the product table so prices can be asked for while looking at them; the assistant quotes the same spot the table does. */}
                    <AssistantToggle/>
                    <Button
                        variant={toolsOpen && !assistant.open ? "default" : "outline"}
                        size="icon"
                        className="cursor-pointer"
                        title="Toggle pricing tools panel (t)"
                        aria-label="Toggle pricing tools panel"
                        onClick={toggleToolsPanel}
                    >
                        <PanelRight className="h-4 w-4"/>
                    </Button>
                </>
            )}
        >
            {/* ── Cards + chart — fixed in place, never scroll. ───────────── */}
            <div className="bg-background shrink-0 pt-4 pb-4">
                <div className="px-4 lg:px-6">
                    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                        {metalCards.map((card) => (
                            <SectionCards
                                key={card.metal}
                                data={card}
                                active={selectedMetal === card.metal}
                                onClick={() => toggleSelectedMetal(card.metal)}
                                onValueChange={(value) => handleSpotOverride(card.metal, value)}
                                onFreeze={() => freezeSpot(card.metal)}
                                onClearOverride={() => clearSpotOverride(card.metal)}
                            />
                        ))}
                    </div>

                    {graphVisible ? (
                        <div className="mt-4 h-[clamp(140px,26vh,320px)]">
                            {historicSpot.length > 0 ? (
                                <ChartAreaInteractive
                                    data={historicSpot}
                                    selectedMetal={selectedMetal}
                                    onCollapse={() => setGraphVisible(false)}
                                />
                            ) : (
                                <p className="text-muted-foreground text-sm">
                                    No historic market data available
                                </p>
                            )}
                        </div>
                    ) : (
                        <button
                            type="button"
                            onClick={() => setGraphVisible(true)}
                            title="Show the price chart (g)"
                            className="text-muted-foreground hover:text-foreground hover:bg-muted/50 focus-visible:ring-ring/50 mt-3 flex w-full cursor-pointer items-center gap-1.5 rounded-md border border-dashed px-3 py-1.5 text-sm outline-none focus-visible:ring-[3px]"
                        >
                            <ChevronRight className="size-4"/>
                            Spot price history
                        </button>
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
