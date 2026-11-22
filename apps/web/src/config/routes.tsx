import { lazy } from 'react'
import { Navigate } from 'react-router-dom'
import { homePathFor } from '@goldilocks/shared-types'
import { useAuth } from '@/contexts/auth-context'
import { RequireAdmin, RequireAuth, RequirePage } from '@/components/auth/require-auth'
import { features } from '@/config/features'

// Lazy load components for better performance
const Landing = lazy(() => import('@/app/landing/page'))
const Dashboard = lazy(() => import('@/app/dashboard/page'))
const Board = lazy(() => import('@/app/board/page'))
const Dashboard2 = lazy(() => import('@/app/dashboard-2/page'))
const Admin = lazy(() => import('@/app/admin/page'))
const Project = lazy(() => import('@/app/project/page'))
const Project2 = lazy(() => import('@/app/project2/page'))
const Stocktake = lazy(() => import('@/app/stocktake/page'))
const StocktakeDetail = lazy(() => import('@/app/stocktake/detail/page'))
const CustomerOrders = lazy(() => import('@/app/customer-orders/page'))
const Tradesheets = lazy(() => import('@/app/tradesheets/page'))
const Inventory = lazy(() => import('@/app/inventory/page'))
const Analytics = lazy(() => import('@/app/analytics/page'))
const Settings = lazy(() => import('@/app/settings/page'))
const Orders = lazy(() => import('@/app/orders/page'))
const ImportHub = lazy(() => import('@/app/import/page'))
const Customers = lazy(() => import('@/app/customers/page'))
const CustomerDetail = lazy(() => import('@/app/customers/detail/page'))
const Invoices = lazy(() => import('@/app/invoices/page'))
const InvoiceDetail = lazy(() => import('@/app/invoices/detail/page'))
const KnowledgeCenter = lazy(() => import('@/app/knowledge/page'))
const Rules = lazy(() => import('@/app/rules/page'))
const KnowledgeAll = lazy(() => import('@/app/knowledge/all/page'))
const KnowledgeBusinessCentral = lazy(() => import('@/app/knowledge/business-central/page'))
const KnowledgeArticle = lazy(() => import('@/app/knowledge/article/page'))
const Mail = lazy(() => import('@/app/mail/page'))
const Tasks = lazy(() => import('@/app/tasks/page'))
const Chat = lazy(() => import('@/app/chat/page'))
const Calendar = lazy(() => import('@/app/calendar/page'))
const Users = lazy(() => import('@/app/users/page'))
const FAQs = lazy(() => import('@/app/faqs/page'))
const Pricing = lazy(() => import('@/app/pricing/page'))

// Auth pages
const SignIn = lazy(() => import('@/app/auth/sign-in/page'))
const SignIn2 = lazy(() => import('@/app/auth/sign-in-2/page'))
const SignIn3 = lazy(() => import('@/app/auth/sign-in-3/page'))
const SignUp = lazy(() => import('@/app/auth/sign-up/page'))
const SignUp2 = lazy(() => import('@/app/auth/sign-up-2/page'))
const SignUp3 = lazy(() => import('@/app/auth/sign-up-3/page'))
const ForgotPassword = lazy(() => import('@/app/auth/forgot-password/page'))
const ForgotPassword2 = lazy(() => import('@/app/auth/forgot-password-2/page'))
const ForgotPassword3 = lazy(() => import('@/app/auth/forgot-password-3/page'))

// Error pages
const Unauthorized = lazy(() => import('@/app/errors/unauthorized/page'))
const Forbidden = lazy(() => import('@/app/errors/forbidden/page'))
const NotFound = lazy(() => import('@/app/errors/not-found/page'))
const InternalServerError = lazy(() => import('@/app/errors/internal-server-error/page'))
const UnderMaintenance = lazy(() => import('@/app/errors/under-maintenance/page'))

// Settings pages
const UserSettings = lazy(() => import('@/app/settings/user/page'))
const AccountSettings = lazy(() => import('@/app/settings/account/page'))
const BillingSettings = lazy(() => import('@/app/settings/billing/page'))
const AppearanceSettings = lazy(() => import('@/app/settings/appearance/page'))
const NotificationSettings = lazy(() => import('@/app/settings/notifications/page'))
const ConnectionSettings = lazy(() => import('@/app/settings/connections/page'))

/** The landing page differs by branch: UK branches have no Pricing Workbook. */
function HomeRedirect() {
  const { capabilities } = useAuth()
  return <Navigate to={homePathFor(capabilities).slice(1)} replace />
}

export interface RouteConfig {
  path: string
  element: React.ReactNode
  children?: RouteConfig[]
}

export const routes: RouteConfig[] = [
  // Default route - redirect to dashboard
  // Use relative path "dashboard" instead of "/dashboard" for basename compatibility
  {
    path: "/",
    element: <RequireAuth><HomeRedirect /></RequireAuth>
  },

  // Landing Page
  {
    path: "/landing",
    element: <Landing />
  },

  // Dashboard Routes
  {
    path: "/dashboard",
    element: <RequirePage page="page.dashboard" capability="pricingWorkbook"><Dashboard /></RequirePage>
  },
  // Price board: full-screen live prices for an iPad or a branch screen; same access as the dashboard
  {
    path: "/board",
    element: <RequirePage page="page.dashboard" capability="pricingWorkbook"><Board /></RequirePage>
  },
  // Admin console — admins only; the API enforces the same on every call it makes
  {
    path: "/admin",
    element: <RequireAdmin><Admin /></RequireAdmin>
  },
  // Project Management (the roadmap) — admins only; the API enforces the same on every call
  {
    path: "/project",
    element: <RequireAdmin><Project /></RequireAdmin>
  },
  // The roadmap tool being rebuilt (roadmap 1.20), developed beside /project and replacing it when complete — admins only
  {
    path: "/project2",
    // With the redesign on, the rebuilt roadmap lives on /project, so the old address just goes there.
    element: features.redesign
      ? <RequireAdmin><Navigate to="/project" replace /></RequireAdmin>
      : <RequireAdmin><Project2 /></RequireAdmin>
  },
  // The redesign's stock and order pages: admins only for now (the API enforces the same).
  ...(features.redesign
    ? [
        // Inventory for every signed-in user; editing and the month-end tab are for admins and managers (the API enforces the same)
        { path: "/inventory", element: <RequirePage page="page.inventory"><Inventory /></RequirePage> },
        // Each tab inside checks its own permission; the API refuses the rest.
        { path: "/analytics", element: <RequirePage page="page.analytics" capability="pricingWorkbook"><Analytics /></RequirePage> },
        // Settings replaces the unused template pages; their old addresses land on it.
        { path: "/settings", element: <RequireAuth><Settings /></RequireAuth> },
        // The old read-only stock page, kept so saved links still land on Inventory
        { path: "/stock", element: <Navigate to="/inventory" replace /> },
        { path: "/orders", element: <RequirePage page="page.orders"><Orders /></RequirePage> },
        { path: "/import", element: <RequirePage page="page.import"><ImportHub /></RequirePage> },
        { path: "/customers", element: <RequirePage page="page.customers"><Customers /></RequirePage> },
        { path: "/customers/:id", element: <RequirePage page="page.customers"><CustomerDetail /></RequirePage> },
        { path: "/invoices", element: <RequirePage page="page.invoices"><Invoices /></RequirePage> },
        { path: "/invoices/:id", element: <RequirePage page="page.invoices"><InvoiceDetail /></RequirePage> },
      ]
    : []),
  // Month-end stocktake: admins and managers; the API enforces the same on every call
  {
    path: "/stocktake",
    element: <RequirePage page="page.stocktake"><Stocktake /></RequirePage>
  },
  {
    path: "/stocktake/:id",
    element: <RequirePage page="page.stocktake"><StocktakeDetail /></RequirePage>
  },
  {
    path: "/customer-orders",
    element: <RequirePage page="page.customer-orders"><CustomerOrders /></RequirePage>
  },
  // Monthly trade-sheet import (roadmap 1.19): admins only; the API enforces the same
  {
    path: "/tradesheets",
    element: <RequirePage page="page.tradesheets"><Tradesheets /></RequirePage>
  },
  // Rules hub (assistant offers, premium limits, alerts, checks): admins only; any rules API will enforce the same
  {
    path: "/rules",
    element: <RequirePage page="page.rules"><Rules /></RequirePage>
  },
  // Knowledge Center — SOP library and reader, for every signed-in user (not admin-only)
  {
    path: "/knowledge",
    element: <RequirePage page="page.knowledge"><KnowledgeCenter /></RequirePage>
  },
  {
    path: "/knowledge/all",
    element: <RequirePage page="page.knowledge"><KnowledgeAll /></RequirePage>
  },
  {
    path: "/knowledge/business-central",
    element: <RequirePage page="page.knowledge"><KnowledgeBusinessCentral /></RequirePage>
  },
  {
    path: "/knowledge/articles/:slug",
    element: <RequirePage page="page.knowledge"><KnowledgeArticle /></RequirePage>
  },
  {
    path: "/demo",
    element: <RequirePage page="page.dashboard" capability="pricingWorkbook"><Dashboard /></RequirePage>
  },
  {
    path: "/dashboard-2",
    element: <RequireAdmin><Dashboard2 /></RequireAdmin>
  },

  // The rest of these are unused template pages; admin-only so nothing of them is reachable by anyone else.
  // Application Routes
  {
    path: "/mail",
    element: <RequireAdmin><Mail /></RequireAdmin>
  },
  {
    path: "/tasks",
    element: <RequireAdmin><Tasks /></RequireAdmin>
  },
  {
    path: "/chat",
    element: <RequireAdmin><Chat /></RequireAdmin>
  },
  {
    path: "/calendar",
    element: <RequireAdmin><Calendar /></RequireAdmin>
  },

  // Content Pages
  {
    path: "/users",
    element: <RequireAdmin><Users /></RequireAdmin>
  },
  {
    path: "/faqs",
    element: <RequireAdmin><FAQs /></RequireAdmin>
  },
  {
    path: "/pricing",
    element: <RequireAdmin><Pricing /></RequireAdmin>
  },

  // Authentication Routes
  {
    path: "/auth/sign-in",
    element: <SignIn />
  },
  {
    path: "/auth/sign-in-2",
    element: <SignIn2 />
  },
  {
    path: "/auth/sign-in-3",
    element: <SignIn3 />
  },
  {
    path: "/auth/sign-up",
    element: <SignUp />
  },
  {
    path: "/auth/sign-up-2",
    element: <SignUp2 />
  },
  {
    path: "/auth/sign-up-3",
    element: <SignUp3 />
  },
  {
    path: "/auth/forgot-password",
    element: <ForgotPassword />
  },
  {
    path: "/auth/forgot-password-2",
    element: <ForgotPassword2 />
  },
  {
    path: "/auth/forgot-password-3",
    element: <ForgotPassword3 />
  },

  // Error Pages
  {
    path: "/errors/unauthorized",
    element: <Unauthorized />
  },
  {
    path: "/errors/forbidden",
    element: <Forbidden />
  },
  {
    path: "/errors/not-found",
    element: <NotFound />
  },
  {
    path: "/errors/internal-server-error",
    element: <InternalServerError />
  },
  {
    path: "/errors/under-maintenance",
    element: <UnderMaintenance />
  },

  // Settings Routes
  {
    path: "/settings/user",
    element: features.redesign ? <Navigate to="/settings" replace /> : <UserSettings />
  },
  {
    path: "/settings/account",
    element: features.redesign ? <Navigate to="/settings" replace /> : <AccountSettings />
  },
  {
    path: "/settings/billing",
    element: features.redesign ? <Navigate to="/settings" replace /> : <BillingSettings />
  },
  {
    path: "/settings/appearance",
    element: features.redesign ? <Navigate to="/settings" replace /> : <AppearanceSettings />
  },
  {
    path: "/settings/notifications",
    element: features.redesign ? <Navigate to="/settings" replace /> : <NotificationSettings />
  },
  {
    path: "/settings/connections",
    element: features.redesign ? <Navigate to="/settings" replace /> : <ConnectionSettings />
  },

  // Catch-all route for 404
  {
    path: "*",
    element: <NotFound />
  }
]
