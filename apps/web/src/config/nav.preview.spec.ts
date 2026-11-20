import { describe, expect, it, vi } from "vitest"

vi.mock("@/config/features", () => ({ features: { redesign: true, commandPalette: true, sonarTheme: true, defaultTheme: "merrion-gold" } }))

const { navGroupsFor } = await import("./nav")

function urls(access: Parameters<typeof navGroupsFor>[0]): string[] {
  return navGroupsFor(access).flatMap((group) => group.items.map((item) => item.url))
}

describe("navGroupsFor with the preview features on", () => {
  it("offers every non-admin the Stock page, with or without the workbook", () => {
    expect(urls({ isAdmin: false, isManager: false, capabilities: { pricingWorkbook: true } })).toEqual(["/dashboard", "/stock", "/knowledge"])
    expect(urls({ isAdmin: false, isManager: false, capabilities: { pricingWorkbook: false } })).toEqual(["/stock", "/knowledge"])
    expect(urls({ isAdmin: false, isManager: true, capabilities: { pricingWorkbook: true } })).toContain("/stock")
  })

  it("leaves Stock out for admins, who have Inventory", () => {
    const all = urls({ isAdmin: true, isManager: true, grouped: true, capabilities: { pricingWorkbook: true } })
    expect(all).not.toContain("/stock")
    expect(all).toContain("/inventory")
  })
})
