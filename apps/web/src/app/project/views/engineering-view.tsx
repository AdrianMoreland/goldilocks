import { useMemo } from "react"
import { useSearchParams } from "react-router-dom"
import { BookText } from "lucide-react"
import { splitDocSections } from "@goldilocks/shared-types"
import engineeringMd from "../../../../../../docs/ENGINEERING.md?raw"
import { HubLayout, PaneCard, type NavGroup } from "../components/hub-layout"
import { RoadmapMarkdown } from "../components/roadmap-markdown"
import { BlockView } from "../hub/blocks"
import type { Topic, TopicGroup } from "../hub/topics"
import { ARCHITECTURE_TOPICS } from "../hub/topics-architecture"
import { OOP_TOPICS } from "../hub/topics-oop"
import { RUNTIME_TOPICS } from "../hub/topics-runtime"
import { OPERATIONS_TOPICS } from "../hub/topics-operations"

const TOPICS: Topic[] = [...ARCHITECTURE_TOPICS, ...OOP_TOPICS, ...RUNTIME_TOPICS, ...OPERATIONS_TOPICS]
const TOPIC_GROUPS: TopicGroup[] = ["Architecture", "OOP and SOLID", "Runtime and security", "Operations"]

/** `## 6. Auth architecture — provider-agnostic by design` → a short nav label without the number. */
const shortTitle = (title: string) => title.replace(/^\d+\.\s*/, "").split(/ [—–-] /)[0]!.trim()
/** The guide's sections end in a `---` rule that only separates them in the raw file. */
const stripRule = (body: string) => body.replace(/\n+---\s*$/, "")

/**
 * The engineering reference: the project guide (docs/ENGINEERING.md, read as-is at build time so the page
 * can't drift from the file) followed by hand-written concept topics with diagrams, tied to this stack.
 */
export default function EngineeringView() {
    const [params, setParams] = useSearchParams()
    const guide = useMemo(() => splitDocSections(engineeringMd), [])

    const groups: NavGroup[] = [
        ...TOPIC_GROUPS.map((name) => ({
            name,
            items: TOPICS.filter((t) => t.group === name).map((t) => ({ key: t.id, label: t.title, icon: t.icon })),
        })),
        { name: "Project guide", items: guide.map((s, i) => ({ key: `guide-${i}`, label: shortTitle(s.title), icon: BookText })) },
    ]

    const requested = params.get("t") ?? TOPICS[0]!.id
    const topic = TOPICS.find((t) => t.id === requested)
    const guideIndex = /^guide-(\d+)$/.exec(requested)?.[1]
    const section = guideIndex !== undefined ? guide[Number(guideIndex)] : undefined
    const selected = topic ? topic.id : section ? requested : TOPICS[0]!.id

    return (
        <HubLayout groups={groups} selected={selected} onSelect={(key) => setParams({ view: "engineering", t: key }, { replace: true })}>
            {topic ? (
                <PaneCard icon={topic.icon} title={topic.title} summary={topic.summary}>
                    {topic.blocks.map((block, i) => (
                        <BlockView key={i} block={block} />
                    ))}
                </PaneCard>
            ) : section ? (
                <PaneCard icon={BookText} title={section.title.replace(/^\d+\.\s*/, "")} summary="From the project guide" source="docs/ENGINEERING.md">
                    <RoadmapMarkdown>{stripRule(section.body)}</RoadmapMarkdown>
                </PaneCard>
            ) : (
                <PaneCard icon={BookText} title="Not found">
                    <p className="text-muted-foreground text-sm">That topic does not exist.</p>
                </PaneCard>
            )}
        </HubLayout>
    )
}
