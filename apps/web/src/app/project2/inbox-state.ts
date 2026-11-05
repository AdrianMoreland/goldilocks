import type { RoadmapInboxItem, RoadmapSection } from "@goldilocks/shared-types"

/** A GitHub issue form leaves headings and "_No response_" in the body; show only what the person wrote. */
export function excerpt(body: string, max = 180): string {
    const text = body
        .split(/\r?\n/)
        .filter((line) => !/^#{1,6}\s/.test(line.trim()) && line.trim() !== "_No response_")
        .join(" ")
        .replace(/\s+/g, " ")
        .trim()
    return text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text
}

/** The task text a promoted item starts with: its title on one line, within the 500 characters a task may hold. */
export function defaultTaskText(item: Pick<RoadmapInboxItem, "title">): string {
    return item.title.replace(/\s+/g, " ").trim().slice(0, 500)
}

/** How a section reads in the picker: its number and title, or just the title for a heading with no number. */
export function sectionLabel(section: Pick<RoadmapSection, "id" | "title">): string {
    return section.id ? `${section.id} ${section.title}` : section.title
}

export const newItems = (items: RoadmapInboxItem[]): RoadmapInboxItem[] => items.filter((i) => i.status === "new")

/** The one-line result of a refresh, for a toast. */
export function refreshMessage(r: { added: number; closedOnGithub: number }): string {
    const parts: string[] = []
    if (r.added > 0) parts.push(`${r.added} new idea${r.added === 1 ? "" : "s"}`)
    if (r.closedOnGithub > 0) parts.push(`${r.closedOnGithub} closed on GitHub`)
    return parts.length > 0 ? parts.join(", ") : "Nothing new"
}
