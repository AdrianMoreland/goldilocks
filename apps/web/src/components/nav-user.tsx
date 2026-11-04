"use client"

import * as React from "react"
import { EllipsisVertical, LogOut, Moon, Paintbrush, Rows3, Sun } from "lucide-react"
import { useNavigate } from "react-router-dom"

import { Logo } from "@/components/logo"
import { useThemeEditorDock } from "@/contexts/docks-context"
import { useAuth } from "@/contexts/auth-context"
import { useCircularTransition } from "@/hooks/use-circular-transition"
import { useIsDarkMode } from "@/hooks/use-is-dark-mode"
import { features } from "@/config/features"
import { readDensity, saveDensity, type Density } from "@/lib/density"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

/** Two letters for the avatar: first and last word of the name, or the start of an email. */
function initialsOf(text: string): string {
  const words = text.split(/[\s@.]+/).filter(Boolean)
  const letters = words.length > 1 ? words[0][0] + words[words.length - 1][0] : (words[0] ?? "").slice(0, 2)
  return letters.toUpperCase()
}

/**
 * The account and preferences home: sign out, day/night and (for admins) the
 * theme editor all live behind the user card, so no page needs its own copy
 * of those buttons in its header.
 */
export function NavUser({
  user,
}: {
  user: {
    name: string
    email: string
    avatar: string
  }
}) {
  const { isMobile } = useSidebar()
  const { logout, isAdmin, isManager } = useAuth()
  const navigate = useNavigate()
  const { toggleTheme } = useCircularTransition()
  const isDarkMode = useIsDarkMode()
  const [density, setDensity] = React.useState<Density>(readDensity)
  const densityLabel = density === "compact" ? "Comfortable rows" : "Compact rows"
  const themeEditor = useThemeEditorDock()

  const handleLogout = () => {
    logout()
    navigate("/auth/sign-in", { replace: true })
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground cursor-pointer"
            >
              {features.redesign ? (
                <div className="bg-muted flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold">
                  {initialsOf(user.name || user.email)}
                </div>
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-lg">
                  < Logo size={28} />
                </div>
              )}
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                <span className="text-muted-foreground truncate text-xs">
                  {features.redesign ? (isAdmin ? "Admin" : isManager ? "Manager" : "Staff") : user.email}
                </span>
              </div>
              <EllipsisVertical className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <div className="h-8 w-8 rounded-lg">
                  < Logo size={28} />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.name}</span>
                  <span className="text-muted-foreground truncate text-xs">
                    {user.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={toggleTheme} className="cursor-pointer">
              {isDarkMode ? <Sun /> : <Moon />}
              {isDarkMode ? "Light mode" : "Dark mode"}
            </DropdownMenuItem>
            {features.redesign && (
              <DropdownMenuItem
                onSelect={() => {
                  const next: Density = density === "compact" ? "comfortable" : "compact"
                  saveDensity(next)
                  setDensity(next)
                }}
                className="cursor-pointer"
              >
                <Rows3 />
                {densityLabel}
              </DropdownMenuItem>
            )}
            {isAdmin && (
              <DropdownMenuItem onSelect={themeEditor.toggle} className="cursor-pointer">
                <Paintbrush />
                Theme editor
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
