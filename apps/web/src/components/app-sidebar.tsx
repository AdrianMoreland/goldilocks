"use client"

import * as React from "react"
import { Link } from "react-router-dom"
import { Logo } from "@/components/logo"
import { useAuth } from "@/contexts/auth-context"
import { useNavGroups } from "@/hooks/use-nav-groups.hook"
import { features } from "@/config/features"
import { Search } from "lucide-react"
import { Kbd } from "@/components/ui/kbd"
import { OPEN_SEARCH_EVENT, modKeyLabel } from "@/components/command-search"

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

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth()
  // BaseLayout shows this sidebar to non-admins too; the groups depend on role and branch (see config/nav.ts). That is
  // discoverability only: every route and API call behind a page enforces access on its own.
  const groups = useNavGroups()

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/">
                <div className="flex aspect-square size-8 items-center justify-center">
                  <Logo size={32} />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Merrion Gold</span>
                  {!features.redesign && <span className="truncate text-xs">Pricing Workbook</span>}
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          {features.redesign && features.commandPalette && (
            <SidebarMenuItem>
              <SidebarMenuButton onClick={() => window.dispatchEvent(new Event(OPEN_SEARCH_EVENT))} className="cursor-pointer">
                <Search />
                <span>Search and commands</span>
                <Kbd className="ms-auto">{modKeyLabel} K</Kbd>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
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
