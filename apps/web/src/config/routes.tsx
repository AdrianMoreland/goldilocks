import { lazy } from 'react'
import { Navigate } from 'react-router-dom'
import { homePathFor } from '@goldilocks/shared-types'
import { useAuth } from '@/contexts/auth-context'
import { RequireAdmin, RequireAuth, RequireCapability, RequireManager } from '@/components/auth/require-auth'
import { features } from '@/config/features'

// Lazy load components for better performance
const Landing = lazy(() => import('@/app/landing/page'))
const Dashboard = lazy(() => import('@/app/dashboard/page'))
const Dashboard2 = lazy(() => import('@/app/dashboard-2/page'))
const Admin = lazy(() => import('@/app/admin/page'))
const Project = lazy(() => import('@/app/project/page'))
const Project2 = lazy(() => import('@/app/project2/page'))
const Stocktake = lazy(() => import('@/app/stocktake/page'))
const StocktakeDetail = lazy(() => import('@/app/stocktake/detail/page'))
const CustomerOrders = lazy(() => import('@/app/customer-orders/page'))
const Tradesheets = lazy(() => import('@/app/tradesheets/page'))
const Inventory = lazy(() => import('@/app/inventory/page'))
const Orders = lazy(() => import('@/app/orders/page'))
const ImportHub = lazy(() => import('@/app/import/page'))
const Customers = lazy(() => import('@/app/customers/page'))
const CustomerDetail = lazy(() => import('@/app/customers/detail/page'))
const Invoices = lazy(() => import('@/app/invoices/page'))
const InvoiceDetail = lazy(() => import('@/app/invoices/detail/page'))
const KnowledgeCenter = lazy(() => import('@/app/knowledge/page'))
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
    element: <RequireCapability capability="pricingWorkbook"><Dashboard /></RequireCapability>
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
        { path: "/inventory", element: <RequireAdmin><Inventory /></RequireAdmin> },
        { path: "/orders", element: <RequireAdmin><Orders /></RequireAdmin> },
        { path: "/import", element: <RequireAdmin><ImportHub /></RequireAdmin> },
        { path: "/customers", element: <RequireAdmin><Customers /></RequireAdmin> },
        { path: "/customers/:id", element: <RequireAdmin><CustomerDetail /></RequireAdmin> },
        { path: "/invoices", element: <RequireAdmin><Invoices /></RequireAdmin> },
        { path: "/invoices/:id", element: <RequireAdmin><InvoiceDetail /></RequireAdmin> },
      ]
    : []),
  // Month-end stocktake: admins and managers; the API enforces the same on every call
  {
    path: "/stocktake",
    element: <RequireManager><Stocktake /></RequireManager>
  },
  {
    path: "/stocktake/:id",
    element: <RequireManager><StocktakeDetail /></RequireManager>
  },
  {
    path: "/customer-orders",
    element: <RequireManager><CustomerOrders /></RequireManager>
  },
  // Monthly trade-sheet import (roadmap 1.19): admins only; the API enforces the same
  {
    path: "/tradesheets",
    element: <RequireAdmin><Tradesheets /></RequireAdmin>
  },
  // Knowledge Center — SOP library and reader, for every signed-in user (not admin-only)
  {
    path: "/knowledge",
    element: <RequireAuth><KnowledgeCenter /></RequireAuth>
  },
  {
    path: "/knowledge/all",
    element: <RequireAuth><KnowledgeAll /></RequireAuth>
  },
  {
    path: "/knowledge/business-central",
    element: <RequireAuth><KnowledgeBusinessCentral /></RequireAuth>
  },
  {
    path: "/knowledge/articles/:slug",
    element: <RequireAuth><KnowledgeArticle /></RequireAuth>
  },
  {
    path: "/demo",
    element: <RequireCapability capability="pricingWorkbook"><Dashboard /></RequireCapability>
  },
  {
    path: "/dashboard-2",
    element: <Dashboard2 />
  },

  // Application Routes
  {
    path: "/mail",
    element: <Mail />
  },
  {
    path: "/tasks",
    element: <Tasks />
  },
  {
    path: "/chat",
    element: <Chat />
  },
  {
    path: "/calendar",
    element: <Calendar />
  },

  // Content Pages
  {
    path: "/users",
    element: <Users />
  },
  {
    path: "/faqs",
    element: <FAQs />
  },
  {
    path: "/pricing",
    element: <Pricing />
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
    element: <UserSettings />
  },
  {
    path: "/settings/account",
    element: <AccountSettings />
  },
  {
    path: "/settings/billing",
    element: <BillingSettings />
  },
  {
    path: "/settings/appearance",
    element: <AppearanceSettings />
  },
  {
    path: "/settings/notifications",
    element: <NotificationSettings />
  },
  {
    path: "/settings/connections",
    element: <ConnectionSettings />
  },

  // Catch-all route for 404
  {
    path: "*",
    element: <NotFound />
  }
]
