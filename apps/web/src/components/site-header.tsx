"use client"

import * as React from "react"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { CommandSearch, OPEN_SEARCH_EVENT, SearchTrigger } from "@/components/command-search"
import { features } from "@/config/features"
import { Logo } from "@/components/logo"

interface SiteHeaderProps {
  title?: string
  /** Shows the Merrion Gold mark beside the title. */
  showLogo?: boolean
  actions?: React.ReactNode
  /** The sidebar toggle. The sidebar is shown to every signed-in user (it holds the Knowledge Center link). */
  showSidebarTrigger?: boolean
  /** The command palette and its Ctrl+K shortcut. BaseLayout turns it on per deployment (config/features.ts). */
  showSearch?: boolean
}

export function SiteHeader({ title, showLogo, actions, showSidebarTrigger = true, showSearch = true }: SiteHeaderProps) {
  const [searchOpen, setSearchOpen] = React.useState(false)

  React.useEffect(() => {
    if (!showSearch) return

    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setSearchOpen((open) => !open)
      }
    }

    const open = () => setSearchOpen(true)
    document.addEventListener("keydown", down)
    window.addEventListener(OPEN_SEARCH_EVENT, open)
    return () => {
      document.removeEventListener("keydown", down)
      window.removeEventListener(OPEN_SEARCH_EVENT, open)
    }
  }, [showSearch])

  return (
    <>
      <header className="bg-background sticky top-0 z-40 flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
        <div className="flex w-full min-w-0 items-center gap-1 overflow-hidden px-4 py-3 lg:gap-2 lg:px-6">
          {showSidebarTrigger && (
            <>
              <SidebarTrigger className="-ml-1 shrink-0" />
              {!features.redesign && (
                <Separator
                  orientation="vertical"
                  className="mx-2 shrink-0 data-[orientation=vertical]:h-4"
                />
              )}
            </>
          )}
          {title && (features.redesign ? (
            // The redesign: one quiet 16px title that truncates; the mark lives in the sidebar brand.
            <h1 className="min-w-0 flex-1 truncate text-base font-semibold">{title}</h1>
          ) : (
            <>
              {showLogo && <Logo size={30} className="shrink-0" />}
              <h1 className="type-h3 hidden shrink-0 whitespace-nowrap lg:inline-block">{title}</h1>
              <Separator
                orientation="vertical"
                className="mx-2 hidden shrink-0 data-[orientation=vertical]:h-4 lg:block"
              />
            </>
          ))}
          {showSearch && !features.redesign && (
            <div className="min-w-0 max-w-sm flex-1">
              <SearchTrigger onClick={() => setSearchOpen(true)} />
            </div>
          )}
          <div className={features.redesign ? "flex shrink-0 items-center gap-1 sm:gap-2" : "ml-auto flex shrink-0 items-center gap-1 sm:gap-2"}>
            {actions}
          </div>
        </div>
      </header>
      {showSearch && <CommandSearch open={searchOpen} onOpenChange={setSearchOpen} />}
    </>
  )
}
