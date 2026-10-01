"use client"

import React from 'react'
import { Layout, Palette, RotateCcw, Settings, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DockedPanel, LEFT_PANEL_WIDTH } from '@/components/docked-panel'
import { useThemeEditorDock } from '@/contexts/docks-context'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useSidebarConfig } from '@/contexts/sidebar-context'
import { useThemePreference } from '@/contexts/theme-preference-context'
import { ThemeTab } from './theme-tab.tsx'
import { LayoutTab } from './layout-tab.tsx'
import { ImportModal } from './import-modal.tsx'
import { cn } from '@/lib/utils'
import type { ImportedTheme } from '@/types/theme-customizer'

/**
 * The theme editor, docked on the left beside the sidebar so the app reflows
 * around it and every change can be watched live. All state lives in
 * ThemePreferenceProvider (app root), which applies and remembers every
 * change per user: this is just the UI onto it.
 */
export function ThemeEditorDock() {
  const { open, close } = useThemeEditorDock()
  const { updateConfig: updateSidebarConfig } = useSidebarConfig()
  const { update, resetAll } = useThemePreference()

  const [activeTab, setActiveTab] = React.useState("theme")
  const [importModalOpen, setImportModalOpen] = React.useState(false)

  const handleReset = () => {
    resetAll()
    updateSidebarConfig({ variant: "inset", collapsible: "offcanvas", side: "left" })
  }

  const handleImport = (themeData: ImportedTheme) => {
    update({ source: "imported", value: "", imported: themeData, colorOverrides: { light: {}, dark: {} } })
  }

  return (
    <>
      <DockedPanel side="left" open={open} width={LEFT_PANEL_WIDTH} label="Theme editor">
        <>
          <div className="flex items-center gap-2 p-3 pb-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Settings className="h-4 w-4" />
            </div>
            <h2 className="text-base font-semibold">Theme editor</h2>
            <div className="ml-auto flex items-center gap-1.5">
              <Button
                variant="outline"
                size="icon"
                onClick={handleReset}
                className="cursor-pointer h-8 w-8"
                title="Reset everything to the app defaults"
                aria-label="Reset everything to the app defaults"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={close}
                className="cursor-pointer h-8 w-8"
                aria-label="Close theme editor"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
              <div className="py-2">
                <TabsList className="grid w-full grid-cols-2 rounded-none h-12 p-1.5">
                  <TabsTrigger value="theme" className="cursor-pointer data-[state=active]:bg-background"><Palette className="h-4 w-4 mr-1" /> Theme</TabsTrigger>
                  <TabsTrigger value="layout" className="cursor-pointer data-[state=active]:bg-background"><Layout className="h-4 w-4 mr-1" /> Layout</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="theme" className="flex-1 mt-0">
                <ThemeTab onImportClick={() => setImportModalOpen(true)} />
              </TabsContent>

              <TabsContent value="layout" className="flex-1 mt-0">
                <LayoutTab />
              </TabsContent>
            </Tabs>
          </div>
        </>
      </DockedPanel>

      <ImportModal
        open={importModalOpen}
        onOpenChange={setImportModalOpen}
        onImport={handleImport}
      />
    </>
  )
}

// Floating trigger button - positioned dynamically based on sidebar side
export function ThemeCustomizerTrigger({ onClick }: { onClick: () => void }) {
  const { config: sidebarConfig } = useSidebarConfig()

  return (
    <Button
      onClick={onClick}
      size="icon"
      className={cn(
        "fixed top-1/2 -translate-y-1/2 h-12 w-12 rounded-full shadow-lg z-50 bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer",
        sidebarConfig.side === "left" ? "right-4" : "left-4"
      )}
    >
      <Settings className="h-5 w-5" />
    </Button>
  )
}
