import { useMemo, useState, type ReactNode } from "react"
import { useSearchParams } from "react-router-dom"
import { Boxes, Check, Compass, Layers, LayoutGrid, Moon, Palette, Ruler, ScrollText, Shapes, Sun, Type, X } from "lucide-react"
import { parseDesignDoc } from "@goldilocks/shared-types"
import designMd from "../../../../../../DESIGN.md?raw"
import { cn } from "@/lib/utils"
import { HubLayout, PaneCard, type NavGroup } from "../components/hub-layout"
import { InlineMarkdown, RoadmapMarkdown } from "../components/roadmap-markdown"
import { ColorVisuals, ProseDisclosure, Swatch } from "../design/color-visuals"
import { ComponentVisuals } from "../design/component-visuals"
import { buildPalette, type Mode } from "../design/palette"
import { ElevationVisuals, LayoutVisuals, ShapeVisuals, TypographyVisuals } from "../design/system-visuals"

const SECTIONS = [
    { key: "overview", label: "Overview", doc: "Overview", icon: Compass, summary: "The Living Spreadsheet: a grid-first workbook with three colour pillars." },
    { key: "colors", label: "Colors", doc: "Colors", icon: Palette, summary: "Neutral zinc, three accent pillars, four metals and a status family." },
    { key: "typography", label: "Typography", doc: "Typography", icon: Type, summary: "One family, tabular figures, a scale that mirrors the Figma text styles." },
    { key: "layout", label: "Layout and spacing", doc: "Layout", icon: LayoutGrid, summary: "The page fills one viewport; only the grid and the side panel scroll." },
    { key: "elevation", label: "Elevation", doc: "Elevation & Depth", icon: Layers, summary: "Depth comes from tone, not shadow." },
    { key: "shapes", label: "Shapes", doc: "Shapes", icon: Shapes, summary: "Tight 6–8px corners and 1px hairlines; pills stay inside the tools panel." },
    { key: "components", label: "Components", doc: "Components", icon: Boxes, summary: "Buttons, the metal spot card, the product grid and the Pricing Tools panel, live." },
    { key: "rules", label: "Rules, do's and don'ts", doc: "Do's and Don'ts", icon: ScrollText, summary: "The named rules and the short list of things to do and avoid." },
] as const

/**
 * The design system, read from DESIGN.md as-is at build time. The front-matter tokens drive every swatch,
 * specimen and component mock, so a change to the document shows up here without touching this page.
 * The light / dark switch re-renders the specimens with each mode's values from the "Colors" section.
 */
export default function DesignView() {
    const doc = useMemo(() => parseDesignDoc(designMd), [])
    const [mode, setMode] = useState<Mode>("light")
    const [params, setParams] = useSearchParams()
    const palette = useMemo(() => buildPalette(mode, doc.tokens.colors), [mode, doc])

    const selected = SECTIONS.find((s) => s.key === params.get("d")) ?? SECTIONS[0]
    const prose = doc.sections.find((s) => s.title === selected.doc)?.body ?? ""
    const groups: NavGroup[] = [{ name: "Design system", items: SECTIONS.map((s) => ({ key: s.key, label: s.label, icon: s.icon })) }]

    const visual: ReactNode = (() => {
        switch (selected.key) {
            case "overview":
                return (
                    <div className="grid gap-2 sm:grid-cols-3">
                        <Swatch name="Brand · gold" hex={doc.tokens.colors["merrion-gold"]!} note="identity, active, primary" />
                        <Swatch name="Price · teal" hex={doc.tokens.colors["price-teal"]!} note="what we charge" />
                        <Swatch name="Buyback · raspberry" hex={doc.tokens.colors["buyback-raspberry"]!} note="what we pay" />
                    </div>
                )
            case "colors":
                return <ColorVisuals colors={doc.tokens.colors} palette={palette} />
            case "typography":
                return <TypographyVisuals typography={doc.tokens.typography} />
            case "layout":
                return <LayoutVisuals spacing={doc.tokens.spacing} palette={palette} />
            case "elevation":
                return <ElevationVisuals palette={palette} />
            case "shapes":
                return <ShapeVisuals rounded={doc.tokens.rounded} colors={doc.tokens.colors} palette={palette} />
            case "components":
                return <ComponentVisuals colors={doc.tokens.colors} palette={palette} />
            case "rules":
                return <Rules rules={doc.rules} dos={doc.dos} donts={doc.donts} />
        }
    })()

    return (
        <HubLayout groups={groups} selected={selected.key} onSelect={(key) => setParams({ view: "design", d: key }, { replace: true })}>
            <PaneCard icon={selected.icon} title={selected.label} summary={selected.summary} source="DESIGN.md">
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-muted-foreground text-xs">{doc.name}</p>
                    <ModeToggle mode={mode} onChange={setMode} />
                </div>
                {visual}
                {selected.key === "overview" ? (
                    <RoadmapMarkdown>{prose}</RoadmapMarkdown>
                ) : selected.key !== "rules" && prose ? (
                    <ProseDisclosure title={`Read the full ${selected.doc} text from DESIGN.md`}>{prose}</ProseDisclosure>
                ) : null}
            </PaneCard>
        </HubLayout>
    )
}

function ModeToggle({ mode, onChange }: { mode: Mode; onChange: (mode: Mode) => void }) {
    return (
        <div role="group" aria-label="Specimen mode" className="bg-muted flex rounded-lg p-0.5">
            {(["light", "dark"] as const).map((m) => (
                <button
                    key={m}
                    type="button"
                    aria-pressed={mode === m}
                    onClick={() => onChange(m)}
                    className={cn("flex cursor-pointer items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium capitalize", mode === m ? "bg-primary text-primary-foreground" : "text-muted-foreground")}
                >
                    {m === "light" ? <Sun className="size-3.5" /> : <Moon className="size-3.5" />}
                    {m}
                </button>
            ))}
        </div>
    )
}

function Rules({ rules, dos, donts }: { rules: { name: string; text: string }[]; dos: string[]; donts: string[] }) {
    return (
        <div className="flex flex-col gap-6">
            <div>
                <h3 className="mb-2 flex items-center gap-1.5 text-sm font-semibold">
                    <Ruler className="size-4" /> Named rules
                </h3>
                <div className="grid gap-3 md:grid-cols-2">
                    {rules.map((rule) => (
                        <div key={rule.name} className="rounded-xl border p-3">
                            <p className="text-sm font-semibold">{rule.name}</p>
                            <p className="text-muted-foreground mt-1 text-sm">
                                <InlineMarkdown>{rule.text}</InlineMarkdown>
                            </p>
                        </div>
                    ))}
                </div>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
                <ListCard title="Do" items={dos} good />
                <ListCard title="Don't" items={donts} good={false} />
            </div>
        </div>
    )
}

function ListCard({ title, items, good }: { title: string; items: string[]; good: boolean }) {
    const Icon = good ? Check : X
    return (
        <div className={cn("rounded-xl border p-4", good ? "border-emerald-500/50 bg-emerald-500/10" : "border-red-500/50 bg-red-500/10")}>
            <h3 className="mb-2 flex items-center gap-1.5 text-sm font-semibold">
                <Icon className="size-4" /> {title}
            </h3>
            <ul className="flex flex-col gap-2 text-sm">
                {items.map((item) => (
                    <li key={item} className="flex gap-2">
                        <Icon className="mt-0.5 size-3.5 shrink-0 opacity-70" />
                        <span>
                            <InlineMarkdown>{item.replace(/^\*\*(Do|Don't)\*\*\s*/, "")}</InlineMarkdown>
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    )
}
