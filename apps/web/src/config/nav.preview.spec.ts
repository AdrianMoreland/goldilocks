import { describe, expect, it, vi } from "vitest"

vi.mock("@/config/features", () => ({ features: { redesign: true, commandPalette: true, sonarTheme: true, defaultTheme: "merrion-gold" } }))

const { navGroupsFor } = await import("./nav")

function urls(access: Parameters<typeof navGroupsFor>[0]): string[] {
  return navGroupsFor(access).flatMap((group) => group.items.map((item) => item.url))
}

describe("navGroupsFor with the preview features on", () => {
  it("offers every non-admin the Inventory page, with or without the workbook", () => {
    expect(urls({ isAdmin: false, isManager: false, capabilities: { pricingWorkbook: true } })).toEqual(["/dashboard", "/inventory", "/analytics", "/knowledge"])
    expect(urls({ isAdmin: false, isManager: false, capabilities: { pricingWorkbook: false } })).toEqual(["/inventory", "/knowledge"])
    expect(urls({ isAdmin: false, isManager: true, capabilities: { pricingWorkbook: true } })).toContain("/inventory")
  })

  it("lists Inventory once for admins, in their Stock & orders group", () => {
    const all = urls({ isAdmin: true, isManager: true, grouped: true, capabilities: { pricingWorkbook: true } })
    expect(all.filter((u) => u === "/inventory")).toHaveLength(1)
  })

  it("offers Analytics only to branches with the Pricing Workbook (its tabs check permissions)", () => {
    expect(urls({ isAdmin: false, isManager: false, capabilities: { pricingWorkbook: true } })).toContain("/analytics")
    expect(urls({ isAdmin: false, isManager: false, capabilities: { pricingWorkbook: false } })).not.toContain("/analytics")
  })
})
