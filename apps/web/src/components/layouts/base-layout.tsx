"use client"

import * as React from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ThemeCustomizer } from "@/components/theme-customizer"
import { useSidebarConfig } from "@/hooks/use-sidebar-config"
import { cn } from "@/lib/utils"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

interface BaseLayoutHelpers {
  openThemeCustomizer: () => void
}

interface BaseLayoutProps {
  children: React.ReactNode
  title?: string
  description?: string
  headerActions?: (helpers: BaseLayoutHelpers) => React.ReactNode
  /**
   * Pins the whole layout to exactly the viewport height (header + whatever
   * `children` render above the fold never scroll) instead of the normal
   * page-level scroll. `children` is responsible for its own internal
   * scrolling in this mode — it's handed a bounded, overflow-hidden flex
   * column, not a naturally-growing one.
   */
  fillViewport?: boolean
}

export function BaseLayout({ children, title, description, headerActions, fillViewport }: BaseLayoutProps) {
  const [themeCustomizerOpen, setThemeCustomizerOpen] = React.useState(false)
  const { config } = useSidebarConfig()
  const helpers: BaseLayoutHelpers = { openThemeCustomizer: () => setThemeCustomizerOpen(true) }

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
      defaultOpen={false}
      style={
        {
          "--sidebar-width": "16rem",
          "--sidebar-width-icon": "3rem",
          "--header-height": "calc(var(--spacing) * 14)",
        } as React.CSSProperties
      }
      className={cn(config.collapsible === "none" && "sidebar-none-mode", fillViewport && "h-svh overflow-hidden")}
    >
      {config.side === "left" ? (
        <>
          <AppSidebar
            variant={config.variant}
            collapsible={config.collapsible}
            side={config.side}
          />
          <SidebarInset className={fillViewport ? "overflow-hidden" : undefined}>
            <SiteHeader title={title} actions={headerActions?.(helpers)} />
            {content}
            {!fillViewport && <SiteFooter/>}
          </SidebarInset>
        </>
      ) : (
          <>
            <SidebarInset className={fillViewport ? "overflow-hidden" : undefined}>
              <SiteHeader title={title} actions={headerActions?.(helpers)} />
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

      {/* Theme Customizer */}
      <ThemeCustomizer
        open={themeCustomizerOpen}
        onOpenChange={setThemeCustomizerOpen}
      />
    </SidebarProvider>
  )
}
