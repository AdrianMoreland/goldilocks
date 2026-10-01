"use client"

import * as React from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ThemeEditorDock } from "@/components/theme-customizer"
import { useUserPreference } from "@/hooks/use-user-preference.hook"
import { useThemeEditorDock } from "@/contexts/docks-context"
import { useSidebarConfig } from "@/hooks/use-sidebar-config"
import { cn } from "@/lib/utils"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

interface BaseLayoutProps {
  children: React.ReactNode
  title?: string
  /** Shows the Merrion Gold mark beside the title. */
  showLogo?: boolean
  description?: string
  headerActions?: () => React.ReactNode
  /**
   * Pins the whole layout to exactly the viewport height (header + whatever
   * `children` render above the fold never scroll) instead of the normal
   * page-level scroll. `children` is responsible for its own internal
   * scrolling in this mode — it's handed a bounded, overflow-hidden flex
   * column, not a naturally-growing one.
   */
  fillViewport?: boolean
}

export function BaseLayout({ children, title, showLogo, description, headerActions, fillViewport }: BaseLayoutProps) {
  const { config } = useSidebarConfig()
  // Remembered, so the sidebar stays as it was left when moving between pages (each page mounts its own layout).
  const [sidebarOpen, setSidebarOpen] = useUserPreference("sidebar-open", false)
  // The theme editor takes the sidebar's slot while it is open, rather than sitting beside it. The
  // remembered sidebar choice is untouched, so closing the editor brings the sidebar back as it was.
  const themeEditor = useThemeEditorDock()
  const handleSidebarOpenChange = (open: boolean) => {
    // Opening the sidebar (its trigger, Ctrl+B) while the editor is showing means "go back to the menu".
    if (themeEditor.open) themeEditor.close()
    setSidebarOpen(open)
  }

  const content = fillViewport ? (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">{children}</div>
  ) : (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 justify-center">
        <div className="w-full max-w-[1600px] flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          {description && (
              <div className="px-4 lg:px-6">
                <p className="text-muted-foreground">{description}</p>
              </div>
          )}
          {children}
        </div>
      </div>
    </div>
  )

  return (
    <SidebarProvider
      open={sidebarOpen && !themeEditor.open}
      onOpenChange={handleSidebarOpenChange}
      style={
        {
          "--sidebar-width": "16rem",
          "--sidebar-width-icon": "3rem",
          "--header-height": "calc(var(--spacing) * 14)",
        } as React.CSSProperties
      }
      className={cn(config.collapsible === "none" && "sidebar-none-mode", fillViewport && "h-full min-h-0 overflow-hidden")}
    >
      {config.side === "left" ? (
        <>
          <AppSidebar
            variant={config.variant}
            collapsible={config.collapsible}
            side={config.side}
          />
          <ThemeEditorDock />
          <SidebarInset className={fillViewport ? "overflow-hidden" : undefined}>
            <SiteHeader title={title} showLogo={showLogo} actions={headerActions?.()} showSidebarTrigger showSearch={false} />
            {content}
            {!fillViewport && <SiteFooter/>}
          </SidebarInset>
        </>
      ) : (
          <>
            <ThemeEditorDock />
            <SidebarInset className={fillViewport ? "overflow-hidden" : undefined}>
              <SiteHeader title={title} showLogo={showLogo} actions={headerActions?.()} showSidebarTrigger showSearch={false} />
              {content}
              {!fillViewport && <SiteFooter />}
          </SidebarInset>
          <AppSidebar
            variant={config.variant}
            collapsible={config.collapsible}
            side={config.side}
          />
        </>
      )}

    </SidebarProvider>
  )
}
