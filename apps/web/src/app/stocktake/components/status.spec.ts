import { describe, expect, it } from "vitest"
import { sortByUrgency, statusSteps } from "./status"

describe("statusSteps", () => {
    it("marks earlier steps done, the current one current and later ones todo", () => {
        expect(statusSteps("COUNTING").map((s) => s.state)).toEqual(["done", "current", "todo", "todo"])
        expect(statusSteps("DRAFT").map((s) => s.state)).toEqual(["current", "todo", "todo", "todo"])
    })

    it("reads a finalised stocktake as all done", () => {
        expect(statusSteps("FINALISED").every((s) => s.state === "done")).toBe(true)
    })
})

describe("sortByUrgency", () => {
    it("puts open work first, finalised last, and the newest count first within a group", () => {
        const items = [
            { id: 1, status: "FINALISED" as const, countDate: "2026-09-30" },
            { id: 2, status: "DRAFT" as const, countDate: "2026-10-31" },
            { id: 3, status: "COUNTING" as const, countDate: "2026-08-31" },
            { id: 4, status: "COUNTING" as const, countDate: "2026-10-31" },
            { id: 5, status: "RECONCILING" as const, countDate: "2026-09-30" },
        ]
        expect(sortByUrgency(items).map((s) => s.id)).toEqual([4, 3, 5, 2, 1])
    })

    it("does not change the array it was given", () => {
        const items = [
            { status: "FINALISED" as const, countDate: "2026-09-30" },
            { status: "COUNTING" as const, countDate: "2026-09-30" },
        ]
        sortByUrgency(items)
        expect(items[0].status).toBe("FINALISED")
    })
})
