import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import type { AdminOverview } from "@goldilocks/shared-types"
import { type ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Panel, PanelEmpty, Stat } from "../panel"
import { formatBytes, formatCount, formatHour } from "../../lib/format"

// Healthy traffic stays a quiet neutral so amber and red stand out as the
// exceptions; gold marks the "data" series elsewhere. Price teal and Buyback
// raspberry are reserved for money and deliberately not used.
const NEUTRAL = "color-mix(in oklab, var(--foreground) 32%, var(--card))"
const AMBER = "oklch(0.769 0.188 70.08)"

const trafficConfig = {
    ok: { label: "Successful", color: NEUTRAL },
    clientErrors: { label: "Client errors (4xx)", color: AMBER },
    serverErrors: { label: "Server errors (5xx)", color: "var(--destructive)" },
} satisfies ChartConfig

const loginConfig = {
    logins: { label: "Signed in", color: "var(--primary)" },
    failedLogins: { label: "Failed", color: "var(--destructive)" },
} satisfies ChartConfig

const storageConfig = {
    bytes: { label: "Size", color: "var(--primary)" },
} satisfies ChartConfig

const AXIS = { fontSize: 11 }

export function TrafficPanel({ overview }: { overview: AdminOverview }) {
    const data = React.useMemo(
        () =>
            overview.hours.map((h) => ({
                hour: formatHour(h.hour),
                ok: Math.max(h.requests - h.clientErrors - h.serverErrors, 0),
                clientErrors: h.clientErrors,
                serverErrors: h.serverErrors,
            })),
        [overview.hours],
    )
    const total = overview.hours.reduce((s, h) => s + h.requests, 0)
    const serverErrors = overview.hours.reduce((s, h) => s + h.serverErrors, 0)
    const clientErrors = overview.hours.reduce((s, h) => s + h.clientErrors, 0)
    const weighted = overview.hours.reduce((s, h) => s + h.avgLatencyMs * h.requests, 0)

    return (
        <Panel title="API requests, last 24 hours" description="Counted per hour; admin console polling is left out.">
            {!overview.metricsAvailable ? (
                <PanelEmpty>Request history needs Redis, which isn&apos;t connected right now.</PanelEmpty>
            ) : total === 0 ? (
                <PanelEmpty>No requests recorded yet. Counting starts from the first request after this release is deployed.</PanelEmpty>
            ) : (
                <>
                    <div className="flex flex-wrap gap-x-8 gap-y-2">
                        <Stat label="Requests" value={formatCount(total)} />
                        <Stat label="Average response" value={`${Math.round(weighted / total)} ms`} />
                        <Stat label="Client errors" value={formatCount(clientErrors)} tone={clientErrors > 0 ? "warn" : undefined} />
                        <Stat label="Server errors" value={formatCount(serverErrors)} tone={serverErrors > 0 ? "bad" : undefined} />
                    </div>
                    <ChartContainer config={trafficConfig} className="h-56 w-full">
                        <BarChart data={data} margin={{ left: -12, right: 4, top: 4 }}>
                            <CartesianGrid vertical={false} />
                            <XAxis dataKey="hour" tickLine={false} axisLine={false} tick={AXIS} interval={2} />
                            <YAxis tickLine={false} axisLine={false} tick={AXIS} allowDecimals={false} />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <ChartLegend content={<ChartLegendContent />} />
                            <Bar dataKey="ok" stackId="a" fill="var(--color-ok)" />
                            <Bar dataKey="clientErrors" stackId="a" fill="var(--color-clientErrors)" />
                            <Bar dataKey="serverErrors" stackId="a" fill="var(--color-serverErrors)" radius={[3, 3, 0, 0]} />
                        </BarChart>
                    </ChartContainer>
                </>
            )}
        </Panel>
    )
}

export function SignInsPanel({ overview }: { overview: AdminOverview }) {
    const data = React.useMemo(
        () => overview.hours.map((h) => ({ hour: formatHour(h.hour), logins: h.logins, failedLogins: h.failedLogins })),
        [overview.hours],
    )
    const logins = overview.hours.reduce((s, h) => s + h.logins, 0)
    const failed = overview.hours.reduce((s, h) => s + h.failedLogins, 0)

    return (
        <Panel title="Sign-ins, last 24 hours">
            <div className="flex flex-wrap gap-x-8 gap-y-2">
                <Stat label="Signed in" value={formatCount(logins)} />
                <Stat label="Failed" value={formatCount(failed)} tone={failed > 0 ? "warn" : undefined} />
                <Stat label="Staff active" value={formatCount(overview.activeUsers)} />
            </div>
            {overview.metricsAvailable ? (
                <ChartContainer config={loginConfig} className="h-40 w-full">
                    <BarChart data={data} margin={{ left: -24, right: 4, top: 4 }}>
                        <CartesianGrid vertical={false} />
                        <XAxis dataKey="hour" tickLine={false} axisLine={false} tick={AXIS} interval={5} />
                        <YAxis tickLine={false} axisLine={false} tick={AXIS} allowDecimals={false} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="logins" stackId="a" fill="var(--color-logins)" />
                        <Bar dataKey="failedLogins" stackId="a" fill="var(--color-failedLogins)" radius={[3, 3, 0, 0]} />
                    </BarChart>
                </ChartContainer>
            ) : (
                <PanelEmpty>Needs Redis.</PanelEmpty>
            )}
            <p className="text-muted-foreground text-xs">
                Staff by role:{" "}
                {overview.usersByRole.length === 0
                    ? "none"
                    : overview.usersByRole.map((r) => `${r.role.toLowerCase()} ${r.count}`).join(" · ")}
            </p>
        </Panel>
    )
}

export function StoragePanel({ overview }: { overview: AdminOverview }) {
    const data = overview.tables.slice(0, 8).map((t) => ({ name: t.name, bytes: t.bytes, rows: t.rows }))

    return (
        <Panel title="Database storage" description={`${formatBytes(overview.databaseBytes)} used across ${overview.tables.length} tables`}>
            <ChartContainer config={storageConfig} className="h-64 w-full">
                <BarChart data={data} layout="vertical" margin={{ left: 8, right: 16, top: 0, bottom: 0 }}>
                    <CartesianGrid horizontal={false} />
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" tickLine={false} axisLine={false} width={130} tick={AXIS} />
                    <ChartTooltip
                        content={
                            <ChartTooltipContent
                                hideLabel
                                formatter={(value, _name, item) => (
                                    <div className="flex w-full items-center justify-between gap-4">
                                        <span className="text-muted-foreground">{(item.payload as { name: string }).name}</span>
                                        <span className="font-mono font-medium tabular-nums">
                                            {formatBytes(Number(value))} · {formatCount((item.payload as { rows: number }).rows)} rows
                                        </span>
                                    </div>
                                )}
                            />
                        }
                    />
                    <Bar dataKey="bytes" fill="var(--color-bytes)" radius={[0, 3, 3, 0]} />
                </BarChart>
            </ChartContainer>
        </Panel>
    )
}

export function RoutesPanel({ overview }: { overview: AdminOverview }) {
    return (
        <Panel title="Busiest endpoints" description="Last 24 hours, by request count">
            {overview.topRoutes.length === 0 ? (
                <PanelEmpty>{overview.metricsAvailable ? "No requests recorded yet." : "Needs Redis."}</PanelEmpty>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-muted-foreground border-b text-left text-xs">
                                <th className="py-1.5 pr-3 font-medium">Endpoint</th>
                                <th className="px-3 py-1.5 text-right font-medium">Requests</th>
                                <th className="px-3 py-1.5 text-right font-medium">Errors</th>
                                <th className="py-1.5 pl-3 text-right font-medium">Avg time</th>
                            </tr>
                        </thead>
                        <tbody className="tabular-nums">
                            {overview.topRoutes.map((r) => (
                                <tr key={r.route} className="border-b last:border-b-0">
                                    <td className="max-w-0 truncate py-2 pr-3 font-mono text-xs" title={r.route}>
                                        {r.route}
                                    </td>
                                    <td className="px-3 py-2 text-right">{formatCount(r.count)}</td>
                                    <td className={r.errors > 0 ? "text-destructive px-3 py-2 text-right" : "text-muted-foreground px-3 py-2 text-right"}>
                                        {formatCount(r.errors)}
                                    </td>
                                    <td className="py-2 pl-3 text-right">{r.avgLatencyMs} ms</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </Panel>
    )
}
