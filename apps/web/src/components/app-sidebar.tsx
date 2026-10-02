"use client"

import * as React from "react"
import { BookOpen, KanbanSquare, LayoutDashboard, ShieldCheck } from "lucide-react"
import { Link } from "react-router-dom"
import { Logo } from "@/components/logo"
import { useAuth } from "@/contexts/auth-context"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

// BaseLayout shows this sidebar to non-admins too, so the admin group below is
// added only for admins. That is discoverability only: /admin and every API
// route behind it enforce admin on their own.
const navGroups = [
  {
    label: "Navigation",
    items: [
      {
        title: "Pricing Workbook",
        url: "/dashboard",
        icon: LayoutDashboard,
      },
      {
        title: "Knowledge Center",
        url: "/knowledge",
        icon: BookOpen,
      },
    ],
  },
]

const adminGroup = {
  label: "Admin",
  items: [
    {
      title: "Admin Console",
      url: "/admin",
      icon: ShieldCheck,
    },
    {
      title: "Project Management",
      url: "/project",
      icon: KanbanSquare,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user, isAdmin } = useAuth()
  const groups = isAdmin ? [...navGroups, adminGroup] : navGroups

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center">
                  <Logo size={32} />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Merrion Gold</span>
                  <span className="truncate text-xs">Pricing Workbook</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {groups.map((group) => (
          <NavMain key={group.label} label={group.label} items={group.items} />
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={{
            name: user ? `${user.firstName} ${user.lastName}` : "",
            email: user?.email ?? "",
            avatar: "",
          }}
        />
      </SidebarFooter>
    </Sidebar>
  )
}
