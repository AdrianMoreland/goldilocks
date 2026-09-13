"use client"

import * as React from "react"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { CommandSearch, SearchTrigger } from "@/components/command-search"
import { ModeToggle } from "@/components/mode-toggle"

interface SiteHeaderProps {
  title?: string
  actions?: React.ReactNode
  /** The sidebar (and its toggle) are admin-only — see BaseLayout. */
  showSidebarTrigger?: boolean
}

export function SiteHeader({ title, actions, showSidebarTrigger = true }: SiteHeaderProps) {
  const [searchOpen, setSearchOpen] = React.useState(false)

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setSearchOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  return (
    <>
      <header className="bg-background sticky top-0 z-40 flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
        <div className="flex w-full min-w-0 items-center gap-1 overflow-hidden px-4 py-3 lg:gap-2 lg:px-6">
          {showSidebarTrigger && (
            <>
              <SidebarTrigger className="-ml-1 shrink-0" />
              <Separator
                orientation="vertical"
                className="mx-2 shrink-0 data-[orientation=vertical]:h-4"
              />
            </>
          )}
          {title && (
            <>
              <h1 className="hidden shrink-0 text-lg font-semibold tracking-tight whitespace-nowrap lg:inline-block">{title}</h1>
              <Separator
                orientation="vertical"
                className="mx-2 hidden shrink-0 data-[orientation=vertical]:h-4 lg:block"
              />
            </>
          )}
          <div className="min-w-0 max-w-sm flex-1">
            <SearchTrigger onClick={() => setSearchOpen(true)} />
          </div>
          <div className="ml-auto flex shrink-0 items-center gap-1 sm:gap-2">
            {actions}
            <ModeToggle />
          </div>
        </div>
      </header>
      <CommandSearch open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  )
}
