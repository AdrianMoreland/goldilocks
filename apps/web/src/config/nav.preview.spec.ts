import { describe, expect, it, vi } from "vitest"

vi.mock("@/config/features", () => ({ features: { redesign: true, commandPalette: true, sonarTheme: true, defaultTheme: "merrion-gold" } }))

const { navGroupsFor } = await import("./nav")
const { DEFAULT_ROLE_PERMISSIONS } = await import("@goldilocks/shared-types")
type PermissionKey = import("@goldilocks/shared-types").PermissionKey
type PermissionRole = import("@goldilocks/shared-types").PermissionRole

function urls(access: Parameters<typeof navGroupsFor>[0]): string[] {
  return navGroupsFor(access).flatMap((group) => group.items.map((item) => item.url))
}

const held = (role: PermissionRole, extra: PermissionKey[] = []) => {
  const keys = new Set<PermissionKey>([...DEFAULT_ROLE_PERMISSIONS[role], ...extra])
  return (key: PermissionKey) => keys.has(key)
}

describe("navGroupsFor with the preview features on", () => {
  it("keeps Inventory and Analytics away from every role until an admin switches them on", () => {
    expect(urls({ isAdmin: false, can: held("MANAGER"), capabilities: { pricingWorkbook: true } })).not.toContain("/inventory")
    expect(urls({ isAdmin: false, can: held("SALES"), capabilities: { pricingWorkbook: true } })).toEqual(["/dashboard", "/knowledge"])
  })

  it("offers Inventory to a role it was switched on for, with or without the workbook", () => {
    expect(urls({ isAdmin: false, can: held("SALES", ["page.inventory", "page.analytics"]), capabilities: { pricingWorkbook: true } })).toEqual(["/dashboard", "/inventory", "/analytics", "/knowledge"])
    expect(urls({ isAdmin: false, can: held("SALES", ["page.inventory", "page.analytics"]), capabilities: { pricingWorkbook: false } })).toEqual(["/inventory", "/knowledge"])
  })

  it("lists Inventory once for admins, in their Stock & orders group", () => {
    const all = urls({ isAdmin: true, can: held("ADMIN"), grouped: true, capabilities: { pricingWorkbook: true } })
    expect(all.filter((u) => u === "/inventory")).toHaveLength(1)
  })

  it("offers Analytics only to branches with the Pricing Workbook", () => {
    const can = held("SALES", ["page.analytics"])
    expect(urls({ isAdmin: false, can, capabilities: { pricingWorkbook: true } })).toContain("/analytics")
    expect(urls({ isAdmin: false, can, capabilities: { pricingWorkbook: false } })).not.toContain("/analytics")
  })
})
