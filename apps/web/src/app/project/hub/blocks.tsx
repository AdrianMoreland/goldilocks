import type { ReactNode } from "react"
import { ArrowDown, ArrowRight, Check, Circle, CircleDot, Info, Lightbulb, TriangleAlert } from "lucide-react"
import { cn } from "@/lib/utils"
import { InlineMarkdown, RoadmapMarkdown } from "../components/roadmap-markdown"

/**
 * The page's own tiny content language. A topic is a list of blocks, so the knowledge-hub text stays
 * data and each diagram is one reusable renderer here, instead of a one-off component per topic.
 *
 * Colour follows DESIGN.md's Earned Colour Rule: neutral zinc for structure, gold for "look here",
 * and the status colours (emerald, amber, red) only where a block really reports a state.
 */
export type Tone = "plain" | "muted" | "gold" | "ok" | "warn" | "bad"

export type Block =
    | { kind: "md"; text: string }
    | { kind: "callout"; tone?: "info" | "warn" | "good"; title?: string; text: string }
    | { kind: "flow"; caption?: string; steps: { label: string; sub?: string; tone?: Tone }[] }
    | { kind: "layers"; caption?: string; layers: { label: string; sub?: string; tone?: Tone }[] }
    | { kind: "graph"; caption?: string; height: number; nodes: GraphNode[]; edges: [string, string, string?][] }
    | { kind: "pyramid"; caption?: string; levels: { label: string; sub: string }[] }
    | { kind: "ladder"; caption?: string; steps: { label: string; sub: string }[]; current: number }
    | { kind: "bars"; caption?: string; unit: string; bars: { label: string; value: number; note?: string }[] }
    | { kind: "cards"; cols?: 2 | 3; items: { title: string; body: string; tag?: string; tone?: Tone }[] }
    | { kind: "table"; head: string[]; rows: string[][] }
    | { kind: "checks"; items: { label: string; status: "done" | "partial" | "todo"; note?: string }[] }
    | { kind: "code"; text: string }

export interface GraphNode {
    id: string
    label: string
    x: number
    y: number
    w?: number
    tone?: Tone
}

const TONE: Record<Tone, string> = {
    plain: "bg-card border-border",
    muted: "bg-muted/60 border-border",
    gold: "bg-primary/10 border-primary/60",
    ok: "bg-emerald-500/10 border-emerald-500/50",
    warn: "bg-amber-500/10 border-amber-500/50",
    bad: "bg-red-500/10 border-red-500/50",
}

function Caption({ children }: { children?: string }) {
    return children ? <p className="text-muted-foreground mb-2 text-xs">{children}</p> : null
}

function Flow({ steps, caption }: { steps: Extract<Block, { kind: "flow" }>["steps"]; caption?: string }) {
    return (
        <figure>
            <Caption>{caption}</Caption>
            <div className="flex flex-wrap items-stretch gap-y-2">
                {steps.map((step, i) => (
                    <div key={step.label} className="flex items-center">
                        <div className={cn("flex h-full min-w-24 flex-col justify-center rounded-lg border px-3 py-2", TONE[step.tone ?? "plain"])}>
                            <span className="text-sm leading-tight font-medium">{step.label}</span>
                            {step.sub && <span className="text-muted-foreground mt-0.5 text-xs leading-snug">{step.sub}</span>}
                        </div>
                        {i < steps.length - 1 && <ArrowRight className="text-muted-foreground mx-1 size-4 shrink-0" />}
                    </div>
                ))}
            </div>
        </figure>
    )
}

function Layers({ layers, caption }: { layers: Extract<Block, { kind: "layers" }>["layers"]; caption?: string }) {
    return (
        <figure>
            <Caption>{caption}</Caption>
            <div className="mx-auto flex max-w-xl flex-col items-stretch">
                {layers.map((layer, i) => (
                    <div key={layer.label} className="flex flex-col items-center">
                        <div className={cn("w-full rounded-lg border px-4 py-2.5 text-center", TONE[layer.tone ?? "plain"])}>
                            <p className="text-sm font-medium">{layer.label}</p>
                            {layer.sub && <p className="text-muted-foreground text-xs">{layer.sub}</p>}
                        </div>
                        {i < layers.length - 1 && <ArrowDown className="text-muted-foreground my-1 size-4" />}
                    </div>
                ))}
            </div>
        </figure>
    )
}

/** Where the line between two boxes meets the second one's edge, so arrowheads sit on the border. */
function edgePoint(from: GraphNode, to: GraphNode) {
    const hw = (to.w ?? 120) / 2
    const hh = 20
    const dx = from.x - to.x
    const dy = from.y - to.y
    const scale = Math.min(dx === 0 ? Infinity : hw / Math.abs(dx), dy === 0 ? Infinity : hh / Math.abs(dy))
    return { x: to.x + dx * scale, y: to.y + dy * scale }
}

function Graph({ nodes, edges, height, caption }: { nodes: GraphNode[]; edges: [string, string, string?][]; height: number; caption?: string }) {
    const byId = new Map(nodes.map((n) => [n.id, n]))
    return (
        <figure>
            <Caption>{caption}</Caption>
            <div className="overflow-x-auto">
            <svg viewBox={`0 0 800 ${height}`} className="w-full min-w-[640px]" role="img" aria-label={caption ?? "Diagram"}>
                <defs>
                    <marker id="hub-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                        <path d="M0 0L10 5L0 10z" style={{ fill: "var(--muted-foreground)" }} />
                    </marker>
                </defs>
                {edges.map(([from, to, label], i) => {
                    const a = byId.get(from)
                    const b = byId.get(to)
                    if (!a || !b) return null
                    const start = edgePoint(b, a)
                    const end = edgePoint(a, b)
                    return (
                        <g key={`${from}-${to}-${i}`}>
                            <line x1={start.x} y1={start.y} x2={end.x} y2={end.y} markerEnd="url(#hub-arrow)" style={{ stroke: "var(--muted-foreground)", strokeWidth: 1.25, opacity: 0.7 }} />
                            {label && (
                                <text x={(start.x + end.x) / 2} y={(start.y + end.y) / 2 - 4} textAnchor="middle" className="text-[11px]" style={{ fill: "var(--muted-foreground)" }}>
                                    {label}
                                </text>
                            )}
                        </g>
                    )
                })}
                {nodes.map((node) => {
                    const w = node.w ?? 120
                    const gold = node.tone === "gold"
                    return (
                        <g key={node.id}>
                            <rect
                                x={node.x - w / 2}
                                y={node.y - 20}
                                width={w}
                                height={40}
                                rx={6}
                                style={{
                                    fill: gold ? "color-mix(in oklab, var(--primary) 14%, var(--card))" : node.tone === "muted" ? "var(--muted)" : "var(--card)",
                                    stroke: gold ? "var(--primary)" : "var(--border)",
                                    strokeWidth: 1.25,
                                }}
                            />
                            <text x={node.x} y={node.y + 5} textAnchor="middle" className="text-[14px] font-medium" style={{ fill: "var(--foreground)" }}>
                                {node.label}
                            </text>
                        </g>
                    )
                })}
            </svg>
            </div>
        </figure>
    )
}

function Pyramid({ levels, caption }: { levels: Extract<Block, { kind: "pyramid" }>["levels"]; caption?: string }) {
    return (
        <figure>
            <Caption>{caption}</Caption>
            <div className="flex flex-col items-center gap-1">
                {levels.map((level, i) => (
                    <div
                        key={level.label}
                        className={cn("rounded-md border px-3 py-2 text-center", i === 0 ? TONE.gold : TONE.plain)}
                        style={{ width: `${34 + (i * 66) / Math.max(levels.length - 1, 1)}%` }}
                    >
                        <p className="text-sm font-medium">{level.label}</p>
                        <p className="text-muted-foreground text-xs">{level.sub}</p>
                    </div>
                ))}
            </div>
        </figure>
    )
}

function Ladder({ steps, current, caption }: { steps: Extract<Block, { kind: "ladder" }>["steps"]; current: number; caption?: string }) {
    return (
        <figure>
            <Caption>{caption}</Caption>
            <div className="flex items-end gap-2">
                {steps.map((step, i) => (
                    <div key={step.label} className="flex flex-1 flex-col">
                        {i === current && <span className="bg-primary text-primary-foreground mb-1 w-fit self-center rounded-full px-2 py-0.5 text-[11px] font-semibold">We are here</span>}
                        <div
                            className={cn("rounded-lg border px-3 py-2", i === current ? TONE.gold : i < current ? TONE.muted : "border-dashed bg-transparent")}
                            style={{ minHeight: `${4.5 + i * 1.6}rem` }}
                        >
                            <p className="text-sm leading-tight font-medium">{step.label}</p>
                            <p className="text-muted-foreground mt-1 text-xs leading-snug">{step.sub}</p>
                        </div>
                    </div>
                ))}
            </div>
        </figure>
    )
}

function Bars({ bars, unit, caption }: { bars: Extract<Block, { kind: "bars" }>["bars"]; unit: string; caption?: string }) {
    const max = Math.max(...bars.map((b) => b.value))
    return (
        <figure>
            <Caption>{caption}</Caption>
            <div className="flex flex-col gap-1.5">
                {bars.map((bar) => (
                    <div key={bar.label} className="grid grid-cols-[7rem_1fr_auto] items-center gap-3 text-xs">
                        <span className="text-muted-foreground truncate">{bar.label}</span>
                        <div className="bg-muted h-3 rounded-sm">
                            <div className="bg-primary h-3 rounded-sm" style={{ width: `${(bar.value / max) * 100}%` }} />
                        </div>
                        <span className="tabular-nums">
                            {bar.value}
                            {unit} {bar.note && <span className="text-muted-foreground">· {bar.note}</span>}
                        </span>
                    </div>
                ))}
            </div>
        </figure>
    )
}

function Cards({ items, cols = 2 }: { items: Extract<Block, { kind: "cards" }>["items"]; cols?: 2 | 3 }) {
    return (
        <div className={cn("grid gap-3", cols === 3 ? "md:grid-cols-2 xl:grid-cols-3" : "md:grid-cols-2")}>
            {items.map((item) => (
                <div key={item.title} className={cn("rounded-xl border p-4", TONE[item.tone ?? "plain"])}>
                    <div className="flex items-start justify-between gap-2">
                        <h4 className="text-sm leading-tight font-semibold">{item.title}</h4>
                        {item.tag && <span className="bg-muted text-muted-foreground shrink-0 rounded-md px-1.5 py-0.5 text-[11px] font-medium">{item.tag}</span>}
                    </div>
                    <div className="text-muted-foreground mt-1.5 text-sm [&_p]:my-1">
                        <RoadmapMarkdown>{item.body}</RoadmapMarkdown>
                    </div>
                </div>
            ))}
        </div>
    )
}

function DataTable({ head, rows }: { head: string[]; rows: string[][] }) {
    return (
        <div className="overflow-x-auto rounded-lg border">
            <table className="w-full text-left text-sm">
                <thead>
                    <tr>
                        {head.map((h) => (
                            <th key={h} className="bg-muted/60 border-b px-3 py-2 text-xs font-semibold">
                                {h}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, i) => (
                        <tr key={i} className="border-b last:border-b-0">
                            {row.map((cell, j) => (
                                <td key={j} className={cn("px-3 py-2 align-top", j === 0 && "font-medium")}>
                                    <InlineMarkdown>{cell}</InlineMarkdown>
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

const STATUS = {
    done: { label: "In place", icon: Check, chip: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300" },
    partial: { label: "Partly", icon: CircleDot, chip: "bg-amber-500/15 text-amber-800 dark:text-amber-300" },
    todo: { label: "Planned", icon: Circle, chip: "bg-muted text-muted-foreground" },
} as const

function Checks({ items }: { items: Extract<Block, { kind: "checks" }>["items"] }) {
    return (
        <ul className="flex flex-col divide-y rounded-lg border">
            {items.map((item) => {
                const s = STATUS[item.status]
                return (
                    <li key={item.label} className="flex items-start gap-3 px-3 py-2">
                        <span className={cn("mt-0.5 inline-flex w-20 shrink-0 items-center justify-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] font-semibold", s.chip)}>
                            <s.icon className="size-3" /> {s.label}
                        </span>
                        <div className="min-w-0 text-sm">
                            <span className="font-medium">{item.label}</span>
                            {item.note && <span className="text-muted-foreground"> · <InlineMarkdown>{item.note}</InlineMarkdown></span>}
                        </div>
                    </li>
                )
            })}
        </ul>
    )
}

const CALLOUT = {
    info: { icon: Info, box: "border-border bg-muted/40" },
    warn: { icon: TriangleAlert, box: "border-amber-500/50 bg-amber-500/10" },
    good: { icon: Lightbulb, box: "border-primary/60 bg-primary/10" },
} as const

export function BlockView({ block }: { block: Block }): ReactNode {
    switch (block.kind) {
        case "md":
            return <RoadmapMarkdown>{block.text}</RoadmapMarkdown>
        case "callout": {
            const c = CALLOUT[block.tone ?? "info"]
            return (
                <div className={cn("flex gap-3 rounded-lg border p-3", c.box)}>
                    <c.icon className="mt-0.5 size-4 shrink-0" />
                    <div className="min-w-0 text-sm">
                        {block.title && <p className="font-semibold">{block.title}</p>}
                        <RoadmapMarkdown>{block.text}</RoadmapMarkdown>
                    </div>
                </div>
            )
        }
        case "flow":
            return <Flow steps={block.steps} caption={block.caption} />
        case "layers":
            return <Layers layers={block.layers} caption={block.caption} />
        case "graph":
            return <Graph nodes={block.nodes} edges={block.edges} height={block.height} caption={block.caption} />
        case "pyramid":
            return <Pyramid levels={block.levels} caption={block.caption} />
        case "ladder":
            return <Ladder steps={block.steps} current={block.current} caption={block.caption} />
        case "bars":
            return <Bars bars={block.bars} unit={block.unit} caption={block.caption} />
        case "cards":
            return <Cards items={block.items} cols={block.cols} />
        case "table":
            return <DataTable head={block.head} rows={block.rows} />
        case "checks":
            return <Checks items={block.items} />
        case "code":
            return <pre className="bg-muted overflow-x-auto rounded-lg p-3 font-mono text-xs leading-5">{block.text}</pre>
    }
}
