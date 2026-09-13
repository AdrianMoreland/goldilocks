"use client"

import React from 'react'
import { Layout, Palette, RotateCcw, Settings, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useThemeManager } from '@/hooks/use-theme-manager'
import { useSidebarConfig } from '@/contexts/sidebar-context'
import { useAuth } from '@/contexts/auth-context'
import { tweakcnThemes } from '@/config/theme-data'
import { DEFAULT_THEME_PREFERENCE, loadThemePreference, saveThemePreference } from '@/lib/theme-preference'
import { ThemeTab } from './theme-tab.tsx'
import { LayoutTab } from './layout-tab.tsx'
import { ImportModal } from './import-modal.tsx'
import { cn } from '@/lib/utils'
import type { ImportedTheme } from '@/types/theme-customizer'

interface ThemeCustomizerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ThemeCustomizer({ open, onOpenChange }: ThemeCustomizerProps) {
  const { applyImportedTheme, isDarkMode, resetTheme, applyRadius, setBrandColorsValues, applyTheme, applyTweakcnTheme } = useThemeManager()
  const { config: sidebarConfig, updateConfig: updateSidebarConfig } = useSidebarConfig()
  const { user } = useAuth()

  // Hydrate from this user's saved pick (localStorage, keyed by user id) or
  // fall back to the app default theme — see lib/theme-preference.ts.
  const initialPreference = React.useMemo(
    () => (user ? loadThemePreference(user.id) ?? DEFAULT_THEME_PREFERENCE : DEFAULT_THEME_PREFERENCE),
    // Only ever needs to run once per mount — a mid-session user switch isn't
    // a real scenario in this app (login always remounts the tree).
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  const [activeTab, setActiveTab] = React.useState("theme")
  const [selectedTheme, setSelectedTheme] = React.useState(initialPreference.kind === "shadcn" ? initialPreference.value : "")
  const [selectedTweakcnTheme, setSelectedTweakcnTheme] = React.useState(initialPreference.kind === "tweakcn" ? initialPreference.value : "")
  const [selectedRadius, setSelectedRadius] = React.useState(initialPreference.radius)
  const [importModalOpen, setImportModalOpen] = React.useState(false)
  const [importedTheme, setImportedTheme] = React.useState<ImportedTheme | null>(null)

  // Remember this user's pick whenever it changes (imported/custom themes
  // aren't persisted — they're a one-off preview, not a saved preference).
  React.useEffect(() => {
    if (!user) return
    if (importedTheme) return
    if (selectedTheme) {
      saveThemePreference(user.id, { kind: "shadcn", value: selectedTheme, radius: selectedRadius })
    } else if (selectedTweakcnTheme) {
      saveThemePreference(user.id, { kind: "tweakcn", value: selectedTweakcnTheme, radius: selectedRadius })
    }
  }, [user, selectedTheme, selectedTweakcnTheme, selectedRadius, importedTheme])

  const handleReset = () => {
    // Complete reset to application defaults

    // 1. Reset all state variables to initial values
    setSelectedTheme("")  // Clear theme selection after reset
    setSelectedTweakcnTheme("")
    setSelectedRadius("0.5rem")
    setImportedTheme(null) // Clear imported theme
    setBrandColorsValues({}) // Clear brand colors state

    // 2. Completely remove all custom CSS variables
    resetTheme()

    // 3. Reset the radius to default
    applyRadius("0.5rem")

    // 4. Reset sidebar to defaults
    updateSidebarConfig({ variant: "inset", collapsible: "offcanvas", side: "left" })
  }

  const handleResetToDefaultTheme = () => {
    setSelectedTheme("")
    setImportedTheme(null)
    setBrandColorsValues({})
    setSelectedRadius(DEFAULT_THEME_PREFERENCE.radius)
    setSelectedTweakcnTheme(DEFAULT_THEME_PREFERENCE.value)
    applyRadius(DEFAULT_THEME_PREFERENCE.radius)
    const preset = tweakcnThemes.find((t) => t.value === DEFAULT_THEME_PREFERENCE.value)?.preset
    if (preset) applyTweakcnTheme(preset, isDarkMode)
  }

  const handleImport = (themeData: ImportedTheme) => {
    setImportedTheme(themeData)
    // Clear other selections to indicate custom import is active
    setSelectedTheme("")
    setSelectedTweakcnTheme("")

    // Apply the imported theme
    applyImportedTheme(themeData, isDarkMode)
  }

  const handleImportClick = () => {
    setImportModalOpen(true)
  }

  // Re-apply themes when theme mode changes
  React.useEffect(() => {
    if (importedTheme) {
      applyImportedTheme(importedTheme, isDarkMode)
    } else if (selectedTheme) {
      applyTheme(selectedTheme, isDarkMode)
    } else if (selectedTweakcnTheme) {
      const selectedPreset = tweakcnThemes.find(t => t.value === selectedTweakcnTheme)?.preset
      if (selectedPreset) {
        applyTweakcnTheme(selectedPreset, isDarkMode)
      }
    }
  }, [isDarkMode, importedTheme, selectedTheme, selectedTweakcnTheme, applyImportedTheme, applyTheme, applyTweakcnTheme])

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange} modal={false}>
        <SheetContent
          side={sidebarConfig.side === "left" ? "right" : "left"}
          className="w-[400px] p-0 gap-0 pointer-events-auto [&>button]:hidden overflow-hidden flex flex-col"
          onInteractOutside={(e) => {
            // Prevent the sheet from closing when dialog is open
            if (importModalOpen) {
              e.preventDefault()
            }
          }}
        >
          <SheetHeader className="space-y-0 p-4 pb-2">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Settings className="h-4 w-4" />
              </div>
              <SheetTitle className="text-lg font-semibold">Customizer</SheetTitle>
              <div className="ml-auto flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={handleReset} className="cursor-pointer h-8 w-8">
                  <RotateCcw className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={() => onOpenChange(false)} className="cursor-pointer h-8 w-8">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <SheetDescription className="text-sm text-muted-foreground sr-only">
              Customize the them and layout of your dashboard.
            </SheetDescription>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
              <div className="py-2">
                <TabsList className="grid w-full grid-cols-2 rounded-none h-12 p-1.5">
                  <TabsTrigger value="theme" className="cursor-pointer data-[state=active]:bg-background"><Palette className="h-4 w-4 mr-1" /> Theme</TabsTrigger>
                  <TabsTrigger value="layout" className="cursor-pointer data-[state=active]:bg-background"><Layout className="h-4 w-4 mr-1" /> Layout</TabsTrigger>
                </TabsList>
                {/* <TabsList className="grid w-full grid-cols-2 rounded-none h-12 p-1.5">
                  <TabsTrigger value="theme" className="cursor-pointer data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"><Palette className="h-4 w-4 mr-1" /> Theme</TabsTrigger>
                  <TabsTrigger value="layout" className="cursor-pointer data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"><Layout className="h-4 w-4 mr-1" /> Layout</TabsTrigger>
                </TabsList> */}
              </div>

              <TabsContent value="theme" className="flex-1 mt-0">
                <ThemeTab
                  onResetToDefaultTheme={handleResetToDefaultTheme}
                  selectedTheme={selectedTheme}
                  setSelectedTheme={setSelectedTheme}
                  selectedTweakcnTheme={selectedTweakcnTheme}
                  setSelectedTweakcnTheme={setSelectedTweakcnTheme}
                  selectedRadius={selectedRadius}
                  setSelectedRadius={setSelectedRadius}
                  setImportedTheme={setImportedTheme}
                  onImportClick={handleImportClick}
                />
              </TabsContent>

              <TabsContent value="layout" className="flex-1 mt-0">
                <LayoutTab />
              </TabsContent>
            </Tabs>
          </div>
        </SheetContent>
      </Sheet>

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
