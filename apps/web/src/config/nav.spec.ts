import { describe, expect, it } from "vitest"
import { DEFAULT_ROLE_PERMISSIONS, PERMISSION_KEYS, type PermissionKey, type PermissionRole } from "@goldilocks/shared-types"
import { navGroupsFor } from "./nav"

const withWorkbook = { pricingWorkbook: true }
const withoutWorkbook = { pricingWorkbook: false }

/** What a person of this role holds out of the box, plus any page an admin switched on for them. */
function holding(role: PermissionRole, extra: PermissionKey[] = []) {
  const held = new Set<PermissionKey>([...DEFAULT_ROLE_PERMISSIONS[role], ...extra])
  return (key: PermissionKey) => held.has(key)
}
const adminCan = holding("ADMIN")

function urls(access: Parameters<typeof navGroupsFor>[0]): string[] {
  return navGroupsFor(access).flatMap((group) => group.items.map((item) => item.url))
}

describe("navGroupsFor", () => {
  it("gives an admin the Stock & orders group and a separate Admin group when asked", () => {
    const groups = navGroupsFor({ isAdmin: true, can: adminCan, grouped: true, capabilities: withWorkbook })
    expect(groups.map((group) => group.label)).toEqual(["Navigation", "Stock & orders", "Admin"])
    expect(groups[0].items.map((item) => item.url)).toEqual(["/dashboard", "/knowledge", "/rules"])
    expect(groups[1].items.map((item) => item.url)).toEqual(["/inventory", "/orders", "/import", "/customers", "/invoices"])
    expect(groups[2].items.map((item) => item.url)).toEqual(["/admin", "/project"])
  })

  it("offers a plain user the workbook and the Knowledge Center only", () => {
    expect(urls({ isAdmin: false, can: holding("SALES"), capabilities: withWorkbook })).toEqual(["/dashboard", "/knowledge"])
  })

  it("hides the workbook from a branch without it", () => {
    expect(urls({ isAdmin: false, can: holding("SALES"), capabilities: withoutWorkbook })).toEqual(["/knowledge"])
  })

  it("adds stocktake and customer orders for a manager, and nothing else", () => {
    const access = { isAdmin: false, can: holding("MANAGER"), capabilities: withWorkbook }
    expect(navGroupsFor(access).map((group) => group.label)).toEqual(["Navigation", "Manager"])
    expect(urls(access)).toEqual(["/dashboard", "/knowledge", "/stocktake", "/customer-orders"])
  })

  it("gives an admin the whole admin group, trade sheets and the console included", () => {
    expect(urls({ isAdmin: true, can: adminCan, capabilities: withWorkbook })).toEqual([
      "/dashboard",
      "/knowledge",
      "/rules",
      "/stocktake",
      "/customer-orders",
      "/tradesheets",
      "/admin",
      "/project",
    ])
  })

  it("shows the Rules hub only to people it has been switched on for", () => {
    expect(urls({ isAdmin: false, can: holding("MANAGER"), capabilities: withWorkbook })).not.toContain("/rules")
    expect(urls({ isAdmin: false, can: holding("MANAGER", ["page.rules"]), capabilities: withWorkbook })).toContain("/rules")
    expect(urls({ isAdmin: true, can: adminCan, capabilities: withoutWorkbook }).slice(0, 2)).toEqual(["/knowledge", "/rules"])
  })

  it("never offers the admin console or the roadmap to a non-admin, whatever they are granted", () => {
    const everything = (key: PermissionKey) => PERMISSION_KEYS.includes(key)
    const all = urls({ isAdmin: false, can: everything, grouped: true, capabilities: withWorkbook })
    expect(all).not.toContain("/admin")
    expect(all).not.toContain("/project")
  })

  it("hides a page switched off for a role", () => {
    const noKnowledge = (key: PermissionKey) => key !== "page.knowledge" && holding("MANAGER")(key)
    expect(urls({ isAdmin: false, can: noKnowledge, capabilities: withWorkbook })).not.toContain("/knowledge")
  })

  it("lists each page once", () => {
    const all = urls({ isAdmin: true, can: adminCan, capabilities: withWorkbook })
    expect(new Set(all).size).toBe(all.length)
  })
})
