import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {RefreshCw, Paintbrush, PanelRight, LineChart, ShieldCheck, LogOut} from 'lucide-react';
import {DataTable} from './components/table/data-table2.tsx';
import {BaseLayout} from '@/components/layouts/base-layout';
import {SectionCards} from './components/section-cards.tsx';
import {ChartAreaInteractive} from './components/chart-area-interactive.tsx';
import {Button} from '@/components/ui/button';
import {usePricingWorkbook} from '@/hooks/use-pricing-workbook.hook.ts';
import {useAuth} from '@/contexts/auth-context';
import {PricingToolsProvider, usePricingTools} from './context/pricing-tools-context';
import {PricingSettingsProvider} from './context/pricing-settings-context';
import {PricingToolsPanel} from './components/pricing-tools/pricing-tools-panel';

export default function Page() {
    return (
        <PricingSettingsProvider>
            <PricingToolsProvider>
                <div className="flex h-svh min-h-0 items-stretch gap-4 overflow-hidden">
                    <div className="flex min-h-0 min-w-0 flex-1 flex-col">
                        <PricingWorkbookPage/>
                    </div>
                    <PricingToolsPanel/>
                </div>
            </PricingToolsProvider>
        </PricingSettingsProvider>
    );
}

function PricingWorkbookPage() {
    const {
        products,
        historicSpot,
        metalCards,
        lastUpdatedRelative,
        refresh,
        refreshing,
        selectedMetal,
        toggleSelectedMetal,
        handleSpotOverride,
        clearSpotOverride,
    } = usePricingWorkbook();
    const { open: toolsOpen, toggleOpen: toggleTools, adminMode, toggleAdminMode } = usePricingTools();
    const { isAdmin, logout } = useAuth();
    const navigate = useNavigate();
    const [graphVisible, setGraphVisible] = useState(true);

    const handleLogout = () => {
        logout();
        navigate('/auth/sign-in', { replace: true });
    };

    const productsArr = Array.isArray(products) ? products : [];

    return (
        <BaseLayout
            fillViewport
            title="Pricing Workbook"
            headerActions={({ openThemeCustomizer }) => (
                <>
                    <div className="text-muted-foreground hidden flex-col leading-tight md:flex">
                        <span className="text-[11px] whitespace-nowrap">Last Updated:</span>
                        <span className="text-[11px] whitespace-nowrap">{lastUpdatedRelative}</span>
                    </div>
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
                        title="Toggle price chart"
                        aria-label="Toggle price chart"
                        onClick={() => setGraphVisible((v) => !v)}
                    >
                        <LineChart className="h-4 w-4"/>
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        className="cursor-pointer"
                        title="Theme editor"
                        aria-label="Theme editor"
                        onClick={openThemeCustomizer}
                    >
                        <Paintbrush className="h-4 w-4"/>
                    </Button>
                    <Button
                        variant={toolsOpen ? "default" : "outline"}
                        size="icon"
                        className="cursor-pointer"
                        title="Toggle pricing tools panel"
                        aria-label="Toggle pricing tools panel"
                        onClick={toggleTools}
                    >
                        <PanelRight className="h-4 w-4"/>
                    </Button>
                    {isAdmin && (
                        <Button
                            variant={adminMode ? "default" : "outline"}
                            size="icon"
                            className="cursor-pointer"
                            title="Toggle admin mode (edit product pricing)"
                            aria-label="Toggle admin mode"
                            onClick={toggleAdminMode}
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
                                onClearOverride={() => {
                                    clearSpotOverride(card.metal);
                                }}
                            />
                        ))}
                    </div>

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
                <DataTable data={productsArr} activeMetal={selectedMetal}/>
            </div>
        </BaseLayout>
    );
}
