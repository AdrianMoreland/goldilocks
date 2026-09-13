"use client"

import * as React from "react"
import {Area, AreaChart, CartesianGrid, ReferenceLine, XAxis, YAxis} from "recharts"

import {useIsMobile} from "@/hooks/use-mobile"
import {
    Card,
    CardAction,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    type ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import {
    ToggleGroup,
    ToggleGroupItem,
} from "@/components/ui/toggle-group"
import {Button} from "@/components/ui/button"


import type {HistoricSpot, MetalType,} from "@/lib/types"

// Gold and Silver keep the universally intuitive yellow/orange and grey —
// Platinum and Palladium are tuned to echo the site's own accent (teal-blue)
// and Sell (dusty rose) hues instead of an arbitrary steel-blue/violet pair,
// so the chart reads as part of the same Merrion Gold palette.
const chartConfig = {
    gold: {
        label: "Gold",
        color: "hsl(40 78% 52%)", // warm amber-gold
    },
    silver: {
        label: "Silver",
        color: "hsl(0 0% 65%)", // grey
    },
    platinum: {
        label: "Platinum",
        color: "hsl(196 30% 58%)", // muted teal-blue, matches the site accent
    },
    palladium: {
        label: "Palladium",
        color: "hsl(340 25% 62%)", // muted dusty rose, matches the site's Sell accent
    },
} satisfies ChartConfig;


type ChartMetalKey = | "gold" | "silver" | "platinum" | "palladium";


const chartMetalKeys: ChartMetalKey[] = [
    "gold",
    "silver",
    "platinum",
    "palladium",
];


type ChartRow = { date: string; } & Partial<Record<ChartMetalKey, number>>;
type ChartMode = | "all" | "selected";
type DisplayMode = | "absolute" | "performance";
type TimeRange = | "7d" | "30d" | "90d" | "180d" | "365d";

interface ChartAreaInteractiveProps {
    data: HistoricSpot[];
    selectedMetal: MetalType | null;
}

export function ChartAreaInteractive({
                                         data,
                                         selectedMetal
                                     }: ChartAreaInteractiveProps) {
    const isMobile = useIsMobile()
    const [timeRange, setTimeRange] = React.useState<TimeRange>("90d");
    // Defaults to showing just the selected metal (Gold, on launch) rather
    // than all four curves at once — see usePricingWorkbook's selectedMetal.
    const [chartMode, setChartMode] = React.useState<ChartMode>("selected");
    const [displayMode, setDisplayMode] = React.useState<DisplayMode>("absolute");

    React.useEffect(() => {
        if (isMobile) {
            setTimeRange("7d")
        }
    }, [isMobile])

    const chartData = React.useMemo(() => {

        const grouped = new Map<string, ChartRow>();

        data.forEach((item) => {

            const date = item.timestamp.split("T")[0];

            if (!grouped.has(date)) {
                grouped.set(date, {date});
            }

            const row = grouped.get(date)!;

            const key = item.metalType.toLowerCase() as ChartMetalKey;

            row[key] = item.priceEur;
        });


        return Array.from(grouped.values())
            .sort((a, b) => a.date.localeCompare(b.date));


    }, [data]);

    const filteredData = React.useMemo(() => {

        let rows = chartData.filter((item) => {

            const date = new Date(item.date);
            const start = new Date();

            const daysLookup: Record<TimeRange, number> = {
                "7d": 7,
                "30d": 30,
                "90d": 90,
                "180d": 180,
                "365d": 365,
            };

            const days = daysLookup[timeRange];

            start.setDate(start.getDate() - days);

            return date >= start;

        });


        if (displayMode === "performance") {

            const first = rows[0];


            rows = rows.map(row => {

                const result: ChartRow = {
                    date: row.date,
                };


                chartMetalKeys.forEach((metal) => {

                    const startValue = first[metal];
                    const currentValue = row[metal];


                    if (
                        startValue !== undefined &&
                        currentValue !== undefined
                    ) {
                        result[metal] =
                            ((currentValue / startValue) - 1) * 100;
                    }

                });


                return result;

            });

        }


        return rows;


    }, [
        chartData,
        timeRange,
        displayMode
    ]);

    // Scale the Y axis to the range actually on screen (padded a little)
    // instead of recharts' default of always starting at 0 — a metal
    // hovering around €1,550 barely moves on a 0–1,550 axis.
    const yDomain = React.useMemo<[number, number]>(() => {
        const visibleKeys =
            chartMode === "selected" && selectedMetal
                ? [selectedMetal.toLowerCase() as ChartMetalKey]
                : chartMetalKeys;

        let min = Infinity;
        let max = -Infinity;

        filteredData.forEach((row) => {
            visibleKeys.forEach((key) => {
                const value = row[key];
                if (typeof value === "number" && isFinite(value)) {
                    if (value < min) min = value;
                    if (value > max) max = value;
                }
            });
        });

        if (!isFinite(min) || !isFinite(max)) return [0, 1];
        if (min === max) return [min - 1, max + 1];

        const padding = (max - min) * 0.1;
        return [min - padding, max + padding];
    }, [filteredData, chartMode, selectedMetal]);

    const toggleItemClass =
        "data-[state=on]:bg-accent data-[state=on]:text-accent-foreground data-[state=on]:font-medium";

    return (
        <Card className="@container/card flex h-full min-h-0 flex-col gap-2 py-3">
            <CardHeader className="px-4">
                <CardTitle>Metals Market Price Chart</CardTitle>
                <CardAction className="flex items-center gap-2">

                    {/* All Metals / Selected toggle */}
                    <Button
                        size="sm"
                        variant={chartMode === "selected" ? "default" : "secondary"}
                        disabled={!selectedMetal && chartMode === "all"}
                        onClick={() =>
                            setChartMode(chartMode === "all" ? "selected" : "all")
                        }
                    >
                        {chartMode === "all" ? "All Metals" : "Selected"}
                    </Button>


                    {/* Absolute / Performance toggle */}
                    <Button
                        size="sm"
                        variant={
                            displayMode === "absolute"
                                ? "default"
                                : "secondary"
                        }
                        onClick={() =>
                            setDisplayMode(
                                displayMode === "absolute"
                                    ? "performance"
                                    : "absolute"
                            )
                        }
                    >
                        {displayMode === "absolute"
                            ? "Absolute €"
                            : "Performance %"}
                    </Button>



                    {/* Date range */}
                    <ToggleGroup
                        type="single"
                        value={timeRange}
                        onValueChange={(value) => {
                            if (value) {
                                setTimeRange(
                                    value as TimeRange
                                );
                            }
                        }}
                        variant="outline"
                        className="
        [&_[data-state=on]]:bg-primary
        [&_[data-state=on]]:text-primary-foreground
        [&_[data-state=on]]:border-primary
    "
                    >
                        <ToggleGroupItem
                            value="7d"
                            className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground data-[state=on]:border-primary"
                        >
                            1W
                        </ToggleGroupItem>

                        <ToggleGroupItem
                            value="30d"
                            className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground data-[state=on]:border-primary"
                        >
                            1M
                        </ToggleGroupItem>

                        <ToggleGroupItem
                            value="90d"
                            className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground data-[state=on]:border-primary"
                        >
                            3M
                        </ToggleGroupItem>

                        <ToggleGroupItem
                            value="180d"
                            className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground data-[state=on]:border-primary"
                        >
                            6M
                        </ToggleGroupItem>

                        <ToggleGroupItem
                            value="365d"
                            className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground data-[state=on]:border-primary"
                        >
                            1Y
                        </ToggleGroupItem>
                    </ToggleGroup>
                </CardAction>
            </CardHeader>
            <CardContent className="min-h-0 flex-1 px-2 pb-2 sm:px-4">
                <ChartContainer
                    config={chartConfig}
                    className="aspect-auto h-full w-full"
                >
                    <AreaChart
                        data={filteredData}
                    >
                        <defs>
                            <linearGradient id="fill-gold" x1="0" y1="0" x2="0" y2="1">
                                <stop
                                    offset="5%"
                                    stopColor="var(--color-gold)"
                                    stopOpacity={1.0}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="var(--color-gold)"
                                    stopOpacity={0.1}
                                />
                            </linearGradient>
                            <linearGradient id="fill-silver" x1="0" y1="0" x2="0" y2="1">
                                <stop
                                    offset="5%"
                                    stopColor="var(--color-silver)"
                                    stopOpacity={0.8}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="var(--color-silver)"
                                    stopOpacity={0.1}
                                />
                            </linearGradient>
                            <linearGradient id="fill-platinum" x1="0" y1="0" x2="0" y2="1">
                                <stop
                                    offset="5%"
                                    stopColor="var(--color-platinum)"
                                    stopOpacity={0.8}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="var(--color-platinum)"
                                    stopOpacity={0.1}
                                />
                            </linearGradient>
                            <linearGradient id="fill-palladium" x1="0" y1="0" x2="0" y2="1">
                                <stop
                                    offset="5%"
                                    stopColor="var(--color-palladium)"
                                    stopOpacity={0.8}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="var(--color-palladium)"
                                    stopOpacity={0.1}
                                />
                            </linearGradient>
                        </defs>
                        <CartesianGrid vertical={false}/>
                        <YAxis
                            tickLine={false}
                            axisLine={false}
                            domain={yDomain}
                            tickFormatter={(value) => {

                                if (displayMode === "performance") {
                                    return `${value.toFixed(0)}%`;
                                }

                                return `€${Intl.NumberFormat(
                                    "en",
                                    {
                                        notation: "compact",
                                        maximumFractionDigits: 1
                                    }
                                ).format(value)}`;
                            }}
                        />
                        <XAxis
                            dataKey="date"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            minTickGap={32}
                            tickFormatter={(value) => {
                                const date = new Date(value)
                                return date.toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                })
                            }}
                        />
                        {displayMode === "performance" && (
                            <ReferenceLine y={0}/>
                        )}
                        <ChartTooltip
                            cursor={false}
                            itemSorter={(item) =>
                                chartMetalKeys.indexOf(String(item.dataKey) as ChartMetalKey)
                            }
                            content={
                                <ChartTooltipContent
                                    labelFormatter={(value) => {
                                        return new Date(value as string | number | Date).toLocaleDateString(
                                            "en-US",
                                            {
                                                month: "short",
                                                day: "numeric",
                                            }
                                        )
                                    }}
                                    formatter={(value, name) => {
                                        const labels = {
                                            gold: "Gold: ",
                                            silver: "Silver: ",
                                            platinum: "Platinum: ",
                                            palladium: "Palladium: ",
                                        };
                                        const numericValue = Number(value);

                                        const change = numericValue;

                                        const formattedValue =
                                            displayMode === "performance"
                                                ? `${change >= 0 ? "+" : ""}${change.toFixed(2)}%`
                                                : `€${numericValue.toFixed(2)}`;

                                        return [
                                            labels[name as ChartMetalKey],
                                            formattedValue,
                                        ];
                                    }}
                                    indicator="dot"
                                />
                            }
                        />
                        {
                            chartMetalKeys.map((metal) => {

                                if (chartMode === "selected" && selectedMetal?.toLowerCase() !== metal) {
                                    return null;
                                }

                                return (
                                    <Area
                                        key={metal}
                                        dataKey={metal}
                                        type="natural"
                                        stroke={chartConfig[metal].color}
                                        fill={`url(#fill-${metal})`}
                                        connectNulls
                                    />
                                );

                            })}
                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
