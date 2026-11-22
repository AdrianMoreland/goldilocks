import {
  BarChart3,
  BookOpen,
  ClipboardCheck,
  Workflow,
  Boxes,
  Download,
  Receipt,
  Users,
  FileSpreadsheet,
  ListChecks,
  KanbanSquare,
  LayoutDashboard,
  PackageCheck,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react"
import type { Capabilities, PermissionKey } from "@goldilocks/shared-types"
import { features } from "@/config/features"

export interface NavItem {
  title: string
  url: string
  icon: LucideIcon
  /** Hidden for branches without this capability. */
  requires?: "pricingWorkbook"
  /** Hidden from anyone whose role does not hold this page permission (Roles & permissions; the API enforces the same). */
  page?: PermissionKey
  /** Hidden from admins, who already have this page in their own Stock & orders group. */
  hideForAdmin?: boolean
  /** Its route only exists with the preview features on, so the link only shows then too. */
  preview?: boolean
  /** Extra words the command palette matches besides the title. */
  keywords?: string[]
}

export interface NavGroup {
  label: string
  items: NavItem[]
}

export interface NavAccess {
  isAdmin: boolean
  /** Whether the person holds a permission (an admin holds every one). */
  can: (key: PermissionKey) => boolean
  /** The redesign lists an admin's pages in two groups, Manager and Admin, as the prototype does. */
  grouped?: boolean
  capabilities: Pick<Capabilities, "pricingWorkbook">
}

const navGroups: NavGroup[] = [
  {
    label: "Navigation",
    items: [
      {
        title: "Pricing",
        url: "/dashboard",
        icon: LayoutDashboard,
        requires: "pricingWorkbook",
        page: "page.dashboard",
        keywords: ["dashboard", "prices", "spot", "products"],
      },
      {
        title: "Inventory",
        url: "/inventory",
        icon: Boxes,
        page: "page.inventory",
        hideForAdmin: true,
        preview: true,
        keywords: ["stock", "inventory", "in stock", "branch", "bars", "coins"],
      },
      {
        title: "Analytics",
        url: "/analytics",
        icon: BarChart3,
        requires: "pricingWorkbook",
        page: "page.analytics",
        preview: true,
        keywords: ["charts", "reports", "profit", "margin", "sales", "trends"],
      },
      {
        title: "SOP",
        url: "/knowledge",
        icon: BookOpen,
        page: "page.knowledge",
        keywords: ["procedures", "sop", "help", "how to"],
      },
      {
        title: "Rules",
        url: "/rules",
        icon: Workflow,
        page: "page.rules",
        keywords: ["offers", "premium limits", "alerts", "checks", "segments", "assistant"],
      },
    ],
  },
]

const stocktakeItem: NavItem = { title: "Stocktake", url: "/stocktake", icon: ClipboardCheck, page: "page.stocktake", keywords: ["stock count", "month end"] }
const customerOrdersItem: NavItem = { title: "Customer orders", url: "/customer-orders", icon: PackageCheck, page: "page.customer-orders", keywords: ["orders"] }
const tradesheetsItem: NavItem = { title: "Trade sheets", url: "/tradesheets", icon: FileSpreadsheet, page: "page.tradesheets", keywords: ["tradesheet", "import", "monthly"] }

/** The redesign's stock and order pages. Admin only for now; the old pages stay for managers. */
const stockOrdersItems: NavItem[] = [
  { title: "Inventory", url: "/inventory", icon: Boxes, page: "page.inventory", keywords: ["stock", "bars", "coins", "stocktake", "month end"] },
  { title: "Orders", url: "/orders", icon: ListChecks, page: "page.orders", keywords: ["customer orders", "allocate", "collect", "sheet updates"] },
  { title: "Import", url: "/import", icon: Download, page: "page.import", keywords: ["tradesheet", "import", "upload", "bc report", "review"] },
  { title: "Customers", url: "/customers", icon: Users, page: "page.customers", keywords: ["customer", "client", "history"] },
  { title: "Invoices", url: "/invoices", icon: Receipt, page: "page.invoices", keywords: ["invoice", "zoho", "serial", "payment"] },
]

const adminItems: NavItem[] = [
  { title: "Admin", url: "/admin", icon: ShieldCheck, keywords: ["admin", "logs", "errors", "health", "users"] },
  { title: "Project", url: "/project", icon: KanbanSquare, keywords: ["roadmap", "tasks", "plan"] },
]

/**
 * The pages a signed-in user is offered, by role permissions and branch. The sidebar and the command palette both read
 * this, so they cannot drift apart. It is discoverability only: every route and API call enforces access on its own.
 */
export function navGroupsFor({ isAdmin, can, grouped, capabilities }: NavAccess): NavGroup[] {
  const offered = (item: NavItem) =>
    (!item.requires || capabilities[item.requires]) &&
    (!item.page || can(item.page)) &&
    !(item.hideForAdmin && isAdmin) &&
    (!item.preview || features.redesign)
  const visible = navGroups
    .map((group) => ({ ...group, items: group.items.filter(offered) }))
    .filter((group) => group.items.length > 0)
  const extra = (label: string, items: NavItem[]): NavGroup[] => {
    const shown = items.filter((item) => !item.page || can(item.page))
    return shown.length > 0 ? [{ label, items: shown }] : []
  }
  const stocktakeAndOrders = [stocktakeItem, customerOrdersItem, tradesheetsItem]
  if (isAdmin && grouped) {
    return [...visible, ...extra("Stock & orders", stockOrdersItems), { label: "Admin", items: adminItems }]
  }
  if (isAdmin) {
    return [...visible, { label: "Admin", items: [...stocktakeAndOrders, ...adminItems] }]
  }
  // Anyone else: the redesign's stock pages they were given sit with Inventory, the rest under "Manager".
  const given = grouped ? stockOrdersItems.filter((item) => item.url !== "/inventory") : []
  return [...visible, ...extra("Stock & orders", given), ...extra("Manager", stocktakeAndOrders)]
}
