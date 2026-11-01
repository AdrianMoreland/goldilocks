import { describe, expect, it } from "vitest"
import { parseTaskMeta, taskId } from "./task-meta"

describe("parseTaskMeta", () => {
    it("splits the title, size and note", () => {
        expect(parseTaskMeta("Redis cache on `findAllActive` - S *(5-min TTL; rewritten after every write)*")).toEqual({
            title: "Redis cache on `findAllActive`",
            effort: "S",
            note: "5-min TTL; rewritten after every write",
            priority: null,
        })
    })

    it("reads a leading priority mark", () => {
        const meta = parseTaskMeta("🔴 Timeout, retry and circuit breaker - M")
        expect(meta.priority).toBe("P0")
        expect(meta.title).toBe("Timeout, retry and circuit breaker")
        expect(meta.effort).toBe("M")
    })

    it("leaves a plain task alone", () => {
        expect(parseTaskMeta("Remove dead code")).toEqual({ title: "Remove dead code", effort: null, note: null, priority: null })
    })

    it("does not mistake a dash in the middle of the title for a size", () => {
        expect(parseTaskMeta("Fuzzy search - with aliases").effort).toBeNull()
    })

    it("keeps a note that has no size before it", () => {
        const meta = parseTaskMeta("Retry button *(the route exists)*")
        expect(meta.title).toBe("Retry button")
        expect(meta.note).toBe("the route exists")
    })
})

describe("taskId", () => {
    it("joins the section ID and a 1-based place", () => {
        expect(taskId("1.20", 0)).toBe("1.20-1")
        expect(taskId(null, 2)).toBe("·-3")
    })
})
