import { describe, expect, it } from "vitest"
import { navGroupsFor } from "./nav"

const withWorkbook = { pricingWorkbook: true }
const withoutWorkbook = { pricingWorkbook: false }

function urls(access: Parameters<typeof navGroupsFor>[0]): string[] {
  return navGroupsFor(access).flatMap((group) => group.items.map((item) => item.url))
}

describe("navGroupsFor", () => {
  it("offers a plain user the workbook and the Knowledge Center only", () => {
    expect(urls({ isAdmin: false, isManager: false, capabilities: withWorkbook })).toEqual(["/dashboard", "/knowledge"])
  })

  it("hides the workbook from a branch without it", () => {
    expect(urls({ isAdmin: false, isManager: false, capabilities: withoutWorkbook })).toEqual(["/knowledge"])
  })

  it("adds stocktake and customer orders for a manager, and nothing admin-only", () => {
    const groups = navGroupsFor({ isAdmin: false, isManager: true, capabilities: withWorkbook })
    expect(groups.map((group) => group.label)).toEqual(["Navigation", "Manager"])
    expect(urls({ isAdmin: false, isManager: true, capabilities: withWorkbook })).toEqual([
      "/dashboard",
      "/knowledge",
      "/stocktake",
      "/customer-orders",
    ])
  })

  it("gives an admin the whole admin group, trade sheets and the console included", () => {
    expect(urls({ isAdmin: true, isManager: true, capabilities: withWorkbook })).toEqual([
      "/dashboard",
      "/knowledge",
      "/stocktake",
      "/customer-orders",
      "/tradesheets",
      "/admin",
      "/project",
    ])
  })

  it("lists each page once", () => {
    const all = urls({ isAdmin: true, isManager: true, capabilities: withWorkbook })
    expect(new Set(all).size).toBe(all.length)
  })
})
