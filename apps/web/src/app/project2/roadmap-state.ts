import { countTasks, type RoadmapSection, type RoadmapTask } from "@goldilocks/shared-types"

/** The separator between a phase's name and what it is about: a spaced hyphen, en dash or em dash. */
const DASH = /\s[-–—]\s/

export type Priority = NonNullable<RoadmapSection["priority"]>

export const PRIORITIES: Priority[] = ["P0", "P1", "P2", "P3"]

/** The words the roadmap file uses for each priority level, shortest first. */
export const PRIORITY_LABEL: Record<Priority, string> = {
    P0: "Now",
    P1: "Next",
    P2: "Planned",
    P3: "Idea",
}

export interface Progress {
    done: number
    total: number
}

export function progressOf(sections: RoadmapSection[]): Progress {
    return sections.reduce(
        (sum, section) => {
            const { done, total } = countTasks(section.tasks)
            return { done: sum.done + done, total: sum.total + total }
        },
        { done: 0, total: 0 },
    )
}

/** "PHASE 1 - Internal features" becomes "PHASE 1": the text before the dash (hyphen or em dash) that the file puts in the `# ` heading. */
export const phaseName = (group: string): string => group.split(DASH)[0].trim()

/** What follows the dash in a phase heading, or an empty string when it has none. */
export const phaseSubtitle = (group: string): string => group.split(DASH).slice(1).join(" - ").trim()

export interface SectionGroup {
    name: string
    sections: RoadmapSection[]
}

/** Sections grouped in file order by the `# ` heading they sit under. */
export function groupSections(sections: RoadmapSection[]): SectionGroup[] {
    const groups: SectionGroup[] = []
    for (const section of sections) {
        const last = groups[groups.length - 1]
        if (last && last.name === section.group) last.sections.push(section)
        else groups.push({ name: section.group, sections: [section] })
    }
    return groups
}

/** A task is done when it and everything under it is ticked. */
export const taskDone = (task: RoadmapTask): boolean => task.checked && task.children.every(taskDone)

const taskMentions = (task: RoadmapTask, needle: string): boolean =>
    task.text.toLowerCase().includes(needle) || task.children.some((child) => taskMentions(child, needle))

export interface RoadmapFilter {
    query: string
    /** Empty means every priority, sections without one included. */
    priorities: Priority[]
    hideDone: boolean
}

export const NO_FILTER: RoadmapFilter = { query: "", priorities: [], hideDone: false }

export const isFiltering = (filter: RoadmapFilter): boolean => filter.query.trim() !== "" || filter.priorities.length > 0 || filter.hideDone

/** Whether a section stays in the navigation: the search looks at the ID, title, note and every task, at any depth. */
export function sectionMatches(section: RoadmapSection, filter: RoadmapFilter): boolean {
    if (filter.priorities.length > 0 && (!section.priority || !filter.priorities.includes(section.priority))) return false

    if (filter.hideDone) {
        const { done, total } = countTasks(section.tasks)
        if (total > 0 && done === total) return false
    }

    const needle = filter.query.trim().toLowerCase()
    if (!needle) return true
    return (
        (section.id ?? "").toLowerCase().includes(needle) ||
        section.title.toLowerCase().includes(needle) ||
        (section.note ?? "").toLowerCase().includes(needle) ||
        section.tasks.some((task) => taskMentions(task, needle))
    )
}

const RANK: Record<Priority, number> = { P0: 0, P1: 1, P2: 2, P3: 3 }

export interface UpNextItem {
    section: RoadmapSection
    done: number
    total: number
}

/**
 * The sections to look at first: ones that still have open tasks and a priority, most urgent first, and within a
 * priority the one closest to finished first (it is the quickest to clear). File order breaks any remaining tie.
 */
export function upNext(sections: RoadmapSection[], limit: number): UpNextItem[] {
    return sections
        .map((section, index) => ({ section, index, ...countTasks(section.tasks) }))
        .filter((item) => item.section.priority !== null && item.total > 0 && item.done < item.total)
        .sort(
            (a, b) =>
                RANK[a.section.priority as Priority] - RANK[b.section.priority as Priority] ||
                a.total - a.done - (b.total - b.done) ||
                a.index - b.index,
        )
        .slice(0, limit)
        .map(({ section, done, total }) => ({ section, done, total }))
}

/** The section to show: the one asked for, else the first with open tasks, else the first there is. */
export function pickSection(sections: RoadmapSection[], requestedKey: string | null): RoadmapSection | undefined {
    return (
        sections.find((s) => s.key === requestedKey) ??
        sections.find((s) => {
            const { done, total } = countTasks(s.tasks)
            return done < total
        }) ??
        sections[0]
    )
}

export type BoardKey = Priority | "none" | "done"

export interface BoardColumn {
    key: BoardKey
    label: string
    items: UpNextItem[]
}

const BOARD_LABEL: Record<BoardKey, string> = { ...PRIORITY_LABEL, none: "No priority", done: "Done" }

/**
 * The board: one column per priority, then sections with no priority, then finished sections. Only sections that
 * have tasks appear (prose-only ones have nothing to track). Within an open column the section closest to finished comes first.
 */
export function boardColumns(sections: RoadmapSection[]): BoardColumn[] {
    const keys: BoardKey[] = [...PRIORITIES, "none", "done"]
    const columns = new Map<BoardKey, UpNextItem[]>(keys.map((key) => [key, []]))

    sections.forEach((section) => {
        const { done, total } = countTasks(section.tasks)
        if (total === 0) return
        const key: BoardKey = done === total ? "done" : (section.priority ?? "none")
        columns.get(key)?.push({ section, done, total })
    })

    for (const key of keys) {
        if (key !== "done") columns.get(key)?.sort((a, b) => a.total - a.done - (b.total - b.done))
    }

    return keys
        .filter((key) => key !== "none" || (columns.get("none")?.length ?? 0) > 0)
        .map((key) => ({ key, label: BOARD_LABEL[key], items: columns.get(key) ?? [] }))
}

export interface MixSlice {
    key: Priority | "none"
    label: string
    open: number
}

/** Open tasks split by the priority of the section they sit in: where the remaining work is. */
export function priorityMix(sections: RoadmapSection[]): MixSlice[] {
    const open = new Map<Priority | "none", number>()
    for (const section of sections) {
        const { done, total } = countTasks(section.tasks)
        const key = section.priority ?? "none"
        open.set(key, (open.get(key) ?? 0) + (total - done))
    }
    return ([...PRIORITIES, "none"] as const).map((key) => ({ key, label: key === "none" ? "No priority" : PRIORITY_LABEL[key], open: open.get(key) ?? 0 }))
}

export interface OverviewTotals {
    tasksOpen: number
    tasksDone: number
    sectionsOpen: number
    nowOpen: number
}

export function overviewTotals(sections: RoadmapSection[]): OverviewTotals {
    const totals: OverviewTotals = { tasksOpen: 0, tasksDone: 0, sectionsOpen: 0, nowOpen: 0 }
    for (const section of sections) {
        const { done, total } = countTasks(section.tasks)
        totals.tasksDone += done
        totals.tasksOpen += total - done
        if (done < total) {
            totals.sectionsOpen += 1
            if (section.priority === "P0") totals.nowOpen += total - done
        }
    }
    return totals
}
