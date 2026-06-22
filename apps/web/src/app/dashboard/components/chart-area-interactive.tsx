"use client"

import * as React from "react"
import {Area, AreaChart, CartesianGrid, XAxis} from "recharts"

import {useIsMobile} from "@/hooks/use-mobile"
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    ToggleGroup,
    ToggleGroupItem,
} from "@/components/ui/toggle-group"

export const description = "An interactive area chart"

const chartData = [
    {date: "2024-04-01", silver: 222, gold: 150},
    {date: "2024-04-02", silver: 97, gold: 180},
    {date: "2024-04-03", silver: 167, gold: 120},
    {date: "2024-04-04", silver: 242, gold: 260},
    {date: "2024-04-05", silver: 373, gold: 290},
    {date: "2024-04-06", silver: 301, gold: 340},
    {date: "2024-04-07", silver: 245, gold: 180},
    {date: "2024-04-08", silver: 409, gold: 320},
    {date: "2024-04-09", silver: 59, gold: 110},
    {date: "2024-04-10", silver: 261, gold: 190},
    {date: "2024-04-11", silver: 327, gold: 350},
    {date: "2024-04-12", silver: 292, gold: 210},
    {date: "2024-04-13", silver: 342, gold: 380},
    {date: "2024-04-14", silver: 137, gold: 220},
    {date: "2024-04-15", silver: 120, gold: 170},
    {date: "2024-04-16", silver: 138, gold: 190},
    {date: "2024-04-17", silver: 446, gold: 360},
    {date: "2024-04-18", silver: 364, gold: 410},
    {date: "2024-04-19", silver: 243, gold: 180},
    {date: "2024-04-20", silver: 89, gold: 150},
    {date: "2024-04-21", silver: 137, gold: 200},
    {date: "2024-04-22", silver: 224, gold: 170},
    {date: "2024-04-23", silver: 138, gold: 230},
    {date: "2024-04-24", silver: 387, gold: 290},
    {date: "2024-04-25", silver: 215, gold: 250},
    {date: "2024-04-26", silver: 75, gold: 130},
    {date: "2024-04-27", silver: 383, gold: 420},
    {date: "2024-04-28", silver: 122, gold: 180},
    {date: "2024-04-29", silver: 315, gold: 240},
    {date: "2024-04-30", silver: 454, gold: 380},
    {date: "2024-05-01", silver: 165, gold: 220},
    {date: "2024-05-02", silver: 293, gold: 310},
    {date: "2024-05-03", silver: 247, gold: 190},
    {date: "2024-05-04", silver: 385, gold: 420},
    {date: "2024-05-05", silver: 481, gold: 390},
    {date: "2024-05-06", silver: 498, gold: 520},
    {date: "2024-05-07", silver: 388, gold: 300},
    {date: "2024-05-08", silver: 149, gold: 210},
    {date: "2024-05-09", silver: 227, gold: 180},
    {date: "2024-05-10", silver: 293, gold: 330},
    {date: "2024-05-11", silver: 335, gold: 270},
    {date: "2024-05-12", silver: 197, gold: 240},
    {date: "2024-05-13", silver: 197, gold: 160},
    {date: "2024-05-14", silver: 448, gold: 490},
    {date: "2024-05-15", silver: 473, gold: 380},
    {date: "2024-05-16", silver: 338, gold: 400},
    {date: "2024-05-17", silver: 499, gold: 420},
    {date: "2024-05-18", silver: 315, gold: 350},
    {date: "2024-05-19", silver: 235, gold: 180},
    {date: "2024-05-20", silver: 177, gold: 230},
    {date: "2024-05-21", silver: 82, gold: 140},
    {date: "2024-05-22", silver: 81, gold: 120},
    {date: "2024-05-23", silver: 252, gold: 290},
    {date: "2024-05-24", silver: 294, gold: 220},
    {date: "2024-05-25", silver: 201, gold: 250},
    {date: "2024-05-26", silver: 213, gold: 170},
    {date: "2024-05-27", silver: 420, gold: 460},
    {date: "2024-05-28", silver: 233, gold: 190},
    {date: "2024-05-29", silver: 78, gold: 130},
    {date: "2024-05-30", silver: 340, gold: 280},
    {date: "2024-05-31", silver: 178, gold: 230},
    {date: "2024-06-01", silver: 178, gold: 200},
    {date: "2024-06-02", silver: 470, gold: 410},
    {date: "2024-06-03", silver: 103, gold: 160},
    {date: "2024-06-04", silver: 439, gold: 380},
    {date: "2024-06-05", silver: 88, gold: 140},
    {date: "2024-06-06", silver: 294, gold: 250},
    {date: "2024-06-07", silver: 323, gold: 370},
    {date: "2024-06-08", silver: 385, gold: 320},
    {date: "2024-06-09", silver: 438, gold: 480},
    {date: "2024-06-10", silver: 155, gold: 200},
    {date: "2024-06-11", silver: 92, gold: 150},
    {date: "2024-06-12", silver: 492, gold: 420},
    {date: "2024-06-13", silver: 81, gold: 130},
    {date: "2024-06-14", silver: 426, gold: 380},
    {date: "2024-06-15", silver: 307, gold: 350},
    {date: "2024-06-16", silver: 371, gold: 310},
    {date: "2024-06-17", silver: 475, gold: 520},
    {date: "2024-06-18", silver: 107, gold: 170},
    {date: "2024-06-19", silver: 341, gold: 290},
    {date: "2024-06-20", silver: 408, gold: 450},
    {date: "2024-06-21", silver: 169, gold: 210},
    {date: "2024-06-22", silver: 317, gold: 270},
    {date: "2024-06-23", silver: 69.32, gold: 3979},
    {date: "2024-06-24", silver: 69.69, gold: 3982},
    {date: "2024-06-25", silver: 71.22, gold: 4002},
    {date: "2024-06-26", silver: 63.33, gold: 4009},
    {date: "2024-06-27", silver: 72.21, gold: 4007},
    {date: "2024-06-28", silver: 76.32, gold: 3999},
    {date: "2024-06-29", silver: 74.33, gold: 3996},
    {date: "2024-06-30", silver: 75.55, gold: 4005},
]

const chartConfig = {
    spot: {
        label: "Spot",
    },
    silver: {
        label: "Silver",
        color: "var(--primary)",
    },
    gold: {
        label: "Gold",
        color: "var(--primary)",
    },
} satisfies ChartConfig

export function ChartAreaInteractive() {
    const isMobile = useIsMobile()
    const [timeRange, setTimeRange] = React.useState("90d")

    React.useEffect(() => {
        if (isMobile) {
            setTimeRange("7d")
        }
    }, [isMobile])

    const filteredData = chartData.filter((item) => {
        const date = new Date(item.date)
        const referenceDate = new Date("2024-06-30")
        let daysToSubtract = 90
        if (timeRange === "30d") {
            daysToSubtract = 30
        } else if (timeRange === "7d") {
            daysToSubtract = 7
        }
        const startDate = new Date(referenceDate)
        startDate.setDate(startDate.getDate() - daysToSubtract)
        return date >= startDate
    })

    return (
        <Card className="@container/card">
            <CardHeader>
                <CardTitle>Metals Market Price Chart</CardTitle>
                <CardDescription>
          <span className="hidden @[540px]/card:block">
            Total for the last 3 months
          </span>
                    <span className="@[540px]/card:hidden">Last 3 months</span>
                </CardDescription>
                <CardAction>
                    <ToggleGroup
                        type="single"
                        value={timeRange}
                        onValueChange={setTimeRange}
                        variant="outline"
                        className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
                    >
                        <ToggleGroupItem value="90d">Last 3 months</ToggleGroupItem>
                        <ToggleGroupItem value="30d">Last 30 days</ToggleGroupItem>
                        <ToggleGroupItem value="7d">Last 7 days</ToggleGroupItem>
                    </ToggleGroup>
                    <Select value={timeRange} onValueChange={setTimeRange}>
                        <SelectTrigger
                            className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
                            size="sm"
                            aria-label="Select a value"
                        >
                            <SelectValue placeholder="Last 3 months"/>
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                            <SelectItem value="90d" className="rounded-lg">
                                Last 3 months
                            </SelectItem>
                            <SelectItem value="30d" className="rounded-lg">
                                Last 30 days
                            </SelectItem>
                            <SelectItem value="7d" className="rounded-lg">
                                Last 7 days
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </CardAction>
            </CardHeader>
            <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
                <ChartContainer
                    config={chartConfig}
                    className="aspect-auto h-[250px] w-full"
                >
                    <AreaChart data={filteredData}>
                        <defs>
                            <linearGradient id="fillSilver" x1="0" y1="0" x2="0" y2="1">
                                <stop
                                    offset="5%"
                                    stopColor="var(--color-gold)"
                                    stopOpacity={1.0}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="var(--color-silver)"
                                    stopOpacity={0.1}
                                />
                            </linearGradient>
                            <linearGradient id="fillSilver" x1="0" y1="0" x2="0" y2="1">
                                <stop
                                    offset="5%"
                                    stopColor="var(--color-gold)"
                                    stopOpacity={0.8}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="var(--color-silver)"
                                    stopOpacity={0.1}
                                />
                            </linearGradient>
                        </defs>
                        <CartesianGrid vertical={false}/>
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
                        <ChartTooltip
                            cursor={false}
                            content={
                                <ChartTooltipContent
                                    labelFormatter={(value) => {
                                        return new Date(value as string | number | Date).toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                        })
                                    }}
                                    indicator="dot"
                                />
                            }
                        />
                        <Area
                            dataKey="silver"
                            type="natural"
                            fill="url(#fillSilver)"
                            stroke="var(--color-silver)"
                            stackId="a"
                        />
                        <Area
                            dataKey="gold"
                            type="natural"
                            fill="url(#fillGold)"
                            stroke="var(--color-gold)"
                            stackId="a"
                        />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
