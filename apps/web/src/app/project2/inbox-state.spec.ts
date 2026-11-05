import { describe, expect, it } from "vitest"
import { defaultTaskText, excerpt, newItems, refreshMessage, sectionLabel } from "./inbox-state"

describe("excerpt", () => {
    it("drops form headings and the empty-answer marker, joins lines and shortens", () => {
        expect(excerpt("### What\n\nBuy a label printer\n\n### Kind\n\n_No response_")).toBe("Buy a label printer")
        expect(excerpt("x".repeat(300), 10)).toBe("xxxxxxxxx…")
        expect(excerpt("")).toBe("")
    })
})

describe("defaultTaskText", () => {
    it("is one line and at most 500 characters", () => {
        expect(defaultTaskText({ title: "  two\n  lines  " })).toBe("two lines")
        expect(defaultTaskText({ title: "a".repeat(600) })).toHaveLength(500)
    })
})

describe("sectionLabel, newItems and refreshMessage", () => {
    it("labels sections with or without a number", () => {
        expect(sectionLabel({ id: "1.20", title: "Roadmap tool" })).toBe("1.20 Roadmap tool")
        expect(sectionLabel({ id: null, title: "Icebox" })).toBe("Icebox")
    })

    it("keeps only items still to triage", () => {
        const item = (id: number, status: "new" | "promoted") => ({ id, status }) as never
        expect(newItems([item(1, "new"), item(2, "promoted")]).map((i) => i.id)).toEqual([1])
    })

    it("words the refresh result", () => {
        expect(refreshMessage({ added: 0, closedOnGithub: 0 })).toBe("Nothing new")
        expect(refreshMessage({ added: 1, closedOnGithub: 2 })).toBe("1 new idea, 2 closed on GitHub")
        expect(refreshMessage({ added: 3, closedOnGithub: 0 })).toBe("3 new ideas")
    })
})
