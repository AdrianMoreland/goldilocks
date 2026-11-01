import type { Priority } from "./roadmap-state"

export type Effort = "S" | "M" | "L"

export interface TaskMeta {
    /** The task text without the trailing effort tag, status note or leading priority mark. Inline Markdown is kept. */
    title: string
    /** The `- S`, `- M` or `- L` size tag the roadmap file puts after a task, if it has one. */
    effort: Effort | null
    /** The `*(...)*` note after the task: what was checked, what was done and when. */
    note: string | null
    /** A priority the task carries itself (the 🔴 🟠 🟡 ⚪ marks), which beats its section's. */
    priority: Priority | null
}

const MARKS: Record<string, Priority> = { "🔴": "P0", "🟠": "P1", "🟡": "P2", "⚪": "P3" }

/**
 * Splits a roadmap task line into what a task card shows: the title, a size, a note and a priority mark. The file
 * stays the record: this only reads the text, it never rewrites it, so editing a task still edits the whole line.
 */
export function parseTaskMeta(text: string): TaskMeta {
    let rest = text.trim()
    let priority: Priority | null = null

    const mark = Object.keys(MARKS).find((m) => rest.startsWith(m))
    if (mark) {
        priority = MARKS[mark]
        rest = rest.slice(mark.length).trim()
    }

    // Everything from the first `*(` on is the note; it is the last thing on the line by convention.
    let note: string | null = null
    const noteAt = rest.search(/\s\*\(/)
    if (noteAt >= 0) {
        note = rest
            .slice(noteAt)
            .trim()
            .replace(/^\*\(/, "")
            .replace(/\)\*$/, "")
            .trim()
        rest = rest.slice(0, noteAt).trim()
    }

    let effort: Effort | null = null
    const sized = rest.match(/\s-\s([SML])$/)
    if (sized) {
        effort = sized[1] as Effort
        rest = rest.slice(0, sized.index).trim()
    }

    return { title: rest, effort, note: note || null, priority }
}

/** A short, stable ID for a task card: its section's ID and its place among that section's tasks (`1.20-3`). */
export const taskId = (sectionId: string | null, ordinal: number): string => `${sectionId ?? "·"}-${ordinal + 1}`
