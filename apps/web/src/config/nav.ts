import {
  BookOpen,
  ClipboardCheck,
  Boxes,
  Download,
  FileSpreadsheet,
  ListChecks,
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
  /** The redesign lists an admin's pages in two groups, Manager and Admin, as the prototype does. */
  grouped?: boolean
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

/** The redesign's stock and order pages. Admin only for now; the old pages stay for managers. */
const stockOrdersItems: NavItem[] = [
  { title: "Inventory", url: "/inventory", icon: Boxes, keywords: ["stock", "bars", "coins", "stocktake", "month end"] },
  { title: "Orders", url: "/orders", icon: ListChecks, keywords: ["customer orders", "allocate", "collect", "sheet updates"] },
  { title: "Import hub", url: "/import", icon: Download, keywords: ["tradesheet", "import", "upload", "bc report"] },
]

const adminItems: NavItem[] = [
  { title: "Admin Console", url: "/admin", icon: ShieldCheck, keywords: ["admin", "logs", "errors", "health", "users"] },
  { title: "Project Management", url: "/project", icon: KanbanSquare, keywords: ["roadmap", "tasks", "plan"] },
]

/**
 * The pages a signed-in user is offered, by role and branch. The sidebar and the command palette both read this, so
 * they cannot drift apart. It is discoverability only: every route and API call enforces access on its own.
 */
export function navGroupsFor({ isAdmin, isManager, grouped, capabilities }: NavAccess): NavGroup[] {
  const visible = navGroups.map((group) => ({
    ...group,
    items: group.items.filter((item) => !item.requires || capabilities[item.requires]),
  }))
  // Managers get the stocktake and customer orders without the rest of the admin group; admins see them inside it.
  if (isAdmin && grouped) {
    return [
      ...visible,
      { label: "Stock & orders", items: stockOrdersItems },
      { label: "Admin", items: adminItems },
    ]
  }
  if (isAdmin) {
    return [...visible, { label: "Admin", items: [stocktakeItem, customerOrdersItem, tradesheetsItem, ...adminItems] }]
  }
  if (isManager) {
    return [...visible, { label: "Manager", items: [stocktakeItem, customerOrdersItem] }]
  }
  return visible
}
