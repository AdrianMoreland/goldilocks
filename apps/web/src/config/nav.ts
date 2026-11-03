import {
  BookOpen,
  ClipboardCheck,
  FileSpreadsheet,
  KanbanSquare,
  LayoutDashboard,
  PackageCheck,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react"
import type { Capabilities } from "@goldilocks/shared-types"

export interface NavItem {
  title: string
  url: string
  icon: LucideIcon
  /** Hidden for branches without this capability. */
  requires?: "pricingWorkbook"
  /** Extra words the command palette matches besides the title. */
  keywords?: string[]
}

export interface NavGroup {
  label: string
  items: NavItem[]
}

export interface NavAccess {
  isAdmin: boolean
  isManager: boolean
  capabilities: Pick<Capabilities, "pricingWorkbook">
}

const navGroups: NavGroup[] = [
  {
    label: "Navigation",
    items: [
      {
        title: "Pricing Workbook",
        url: "/dashboard",
        icon: LayoutDashboard,
        requires: "pricingWorkbook",
        keywords: ["dashboard", "prices", "spot", "products"],
      },
      {
        title: "Knowledge Center",
        url: "/knowledge",
        icon: BookOpen,
        keywords: ["procedures", "sop", "help", "how to"],
      },
    ],
  },
]

const stocktakeItem: NavItem = { title: "Stocktake", url: "/stocktake", icon: ClipboardCheck, keywords: ["stock count", "month end"] }
const customerOrdersItem: NavItem = { title: "Customer orders", url: "/customer-orders", icon: PackageCheck, keywords: ["orders"] }
const tradesheetsItem: NavItem = { title: "Trade sheets", url: "/tradesheets", icon: FileSpreadsheet, keywords: ["tradesheet", "import", "monthly"] }

const adminItems: NavItem[] = [
  { title: "Admin Console", url: "/admin", icon: ShieldCheck, keywords: ["admin", "logs", "errors", "health", "users"] },
  { title: "Project Management", url: "/project", icon: KanbanSquare, keywords: ["roadmap", "tasks", "plan"] },
]

/**
 * The pages a signed-in user is offered, by role and branch. The sidebar and the command palette both read this, so
 * they cannot drift apart. It is discoverability only: every route and API call enforces access on its own.
 */
export function navGroupsFor({ isAdmin, isManager, capabilities }: NavAccess): NavGroup[] {
  const visible = navGroups.map((group) => ({
    ...group,
    items: group.items.filter((item) => !item.requires || capabilities[item.requires]),
  }))
  // Managers get the stocktake and customer orders without the rest of the admin group; admins see them inside it.
  if (isAdmin) {
    return [...visible, { label: "Admin", items: [stocktakeItem, customerOrdersItem, tradesheetsItem, ...adminItems] }]
  }
  if (isManager) {
    return [...visible, { label: "Manager", items: [stocktakeItem, customerOrdersItem] }]
  }
  return visible
}
