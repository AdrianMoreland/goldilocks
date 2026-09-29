"use client"

import React from 'react'
import { Dices, Upload, Sun, Moon, RotateCcw, Check, ChevronsUpDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'
import { Slider } from '@/components/ui/slider'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { useCircularTransition } from '@/hooks/use-circular-transition'
import { useThemePreference } from '@/contexts/theme-preference-context'
import { colorThemes, tweakcnThemes } from '@/config/theme-data'
import { radiusOptions } from '@/config/theme-customizer-constants'
import { FONT_OPTIONS, type Density, type ShadowStrength } from '@/lib/theme-preference'
import { cn } from '@/lib/utils'
import { ColorField } from './color-field'
import "./circular-transition.css"

interface ThemeTabProps {
  onImportClick: () => void
}

type ColorSpec = {
  label: string
  cssVar: string
  /** Checked against this other theme colour, at this minimum ratio. */
  contrast?: { against: string; label: string; min: number }
}

// Grouped by what staff see them as — the three Merrion colour pillars first.
const COLOR_GROUPS: { title: string; colors: ColorSpec[] }[] = [
  {
    title: "Brand",
    colors: [
      { label: "Primary", cssVar: "--primary" },
      { label: "Text on primary", cssVar: "--primary-foreground", contrast: { against: "--primary", label: "primary", min: 4.5 } },
    ],
  },
  {
    title: "Price",
    colors: [
      { label: "Price fill", cssVar: "--price" },
      { label: "Price text", cssVar: "--price-text", contrast: { against: "--background", label: "background", min: 4.5 } },
    ],
  },
  {
    title: "Buyback",
    colors: [
      { label: "Buyback fill", cssVar: "--buyback" },
      { label: "Buyback text", cssVar: "--buyback-text", contrast: { against: "--background", label: "background", min: 4.5 } },
    ],
  },
  {
    title: "Surfaces and text",
    colors: [
      { label: "Background", cssVar: "--background" },
      { label: "Text", cssVar: "--foreground", contrast: { against: "--background", label: "background", min: 4.5 } },
      { label: "Card", cssVar: "--card" },
      { label: "Muted surface", cssVar: "--muted" },
      { label: "Muted text", cssVar: "--muted-foreground", contrast: { against: "--background", label: "background", min: 4.5 } },
      { label: "Border", cssVar: "--border" },
    ],
  },
  {
    title: "Secondary and accent",
    colors: [
      { label: "Secondary", cssVar: "--secondary" },
      { label: "Text on secondary", cssVar: "--secondary-foreground", contrast: { against: "--secondary", label: "secondary", min: 4.5 } },
      { label: "Accent", cssVar: "--accent" },
      { label: "Text on accent", cssVar: "--accent-foreground", contrast: { against: "--accent", label: "accent", min: 4.5 } },
    ],
  },
]

const DENSITY_OPTIONS: { value: Density; label: string }[] = [
  { value: "compact", label: "Compact" },
  { value: "default", label: "Default" },
  { value: "comfortable", label: "Comfortable" },
]

const SHADOW_OPTIONS: { value: ShadowStrength; label: string }[] = [
  { value: "none", label: "None" },
  { value: "subtle", label: "Subtle" },
  { value: "default", label: "Default" },
]

function OptionButtons<T extends string>({
  options,
  value,
  onChange,
  columns,
}: {
  options: { value: T; label: string }[]
  value: T
  onChange: (value: T) => void
  columns: number
}) {
  return (
    <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
      {options.map((option) => (
        <Button
          key={option.value}
          type="button"
          variant={value === option.value ? "default" : "outline"}
          size="sm"
          aria-pressed={value === option.value}
          className="cursor-pointer"
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </Button>
      ))}
    </div>
  )
}

function PresetSwatches({ styles }: { styles: Record<string, string> }) {
  return (
    <div className="flex gap-1">
      {["primary", "secondary", "accent", "muted"].map((key) => (
        <div key={key} className="size-3 rounded-full border border-border/20" style={{ backgroundColor: styles[key] }} />
      ))}
    </div>
  )
}

export function ThemeTab({ onImportClick }: ThemeTabProps) {
  const { preference, isDarkMode, update, setColorOverride, resetColors, presetValue } = useThemePreference()
  const { toggleTheme } = useCircularTransition()
  const [tweakcnPopoverOpen, setTweakcnPopoverOpen] = React.useState(false)

  const selectedShadcn = preference.source === "shadcn" ? preference.value : ""
  const selectedTweakcn = preference.source === "tweakcn" ? preference.value : ""
  const selectedTweakcnPreset = tweakcnThemes.find((t) => t.value === selectedTweakcn)
  const modeOverrides = preference.colorOverrides[isDarkMode ? "dark" : "light"]
  const overrideCount = Object.keys(preference.colorOverrides.light).length + Object.keys(preference.colorOverrides.dark).length

  // Picking a preset starts that preset clean — colour edits made on top of
  // the previous one wouldn't make sense on a different palette.
  const choosePreset = (source: "shadcn" | "tweakcn", value: string) =>
    update({ source, value, imported: null, colorOverrides: { light: {}, dark: {} } })

  const currentColor = (cssVar: string) =>
    modeOverrides[cssVar] ??
    presetValue(cssVar) ??
    getComputedStyle(document.documentElement).getPropertyValue(cssVar).trim()

  return (
    <div className="p-4 space-y-6">

      <Button variant="outline" size="sm" onClick={resetColors} className="w-full cursor-pointer">
        <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
        Reset to Merrion Gold theme
      </Button>

      {/* ── Presets ─────────────────────────────────────────────────────── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">Shadcn UI theme presets</Label>
          <Button
            variant="outline"
            size="sm"
            onClick={() => choosePreset("shadcn", colorThemes[Math.floor(Math.random() * colorThemes.length)].value)}
            className="cursor-pointer"
          >
            <Dices className="h-3.5 w-3.5 mr-1.5" />
            Random
          </Button>
        </div>

        <Select value={selectedShadcn} onValueChange={(value) => choosePreset("shadcn", value)}>
          <SelectTrigger className="w-full cursor-pointer">
            <SelectValue placeholder="Choose a shadcn theme" />
          </SelectTrigger>
          <SelectContent className="max-h-60">
            <div className="p-2">
              {colorThemes.map((theme) => (
                <SelectItem key={theme.value} value={theme.value} className="cursor-pointer">
                  <div className="flex items-center gap-2">
                    <PresetSwatches styles={theme.preset.styles.light} />
                    <span>{theme.name}</span>
                  </div>
                </SelectItem>
              ))}
            </div>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">Tweakcn theme presets</Label>
          <Button
            variant="outline"
            size="sm"
            onClick={() => choosePreset("tweakcn", tweakcnThemes[Math.floor(Math.random() * tweakcnThemes.length)].value)}
            className="cursor-pointer"
          >
            <Dices className="h-3.5 w-3.5 mr-1.5" />
            Random
          </Button>
        </div>

        {/*
          A Popover, not a Select: Radix's Select always closes on item
          click, which made trying several themes in a row tedious. This
          stays open until an outside click, Escape, or the trigger.
        */}
        <Popover open={tweakcnPopoverOpen} onOpenChange={setTweakcnPopoverOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={tweakcnPopoverOpen}
              className="w-full cursor-pointer justify-between font-normal"
            >
              {selectedTweakcnPreset ? (
                <div className="flex items-center gap-2">
                  <PresetSwatches styles={selectedTweakcnPreset.preset.styles.light} />
                  <span>{selectedTweakcnPreset.name}</span>
                </div>
              ) : (
                <span className="text-muted-foreground">Choose a tweakcn theme</span>
              )}
              <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-(--radix-popover-trigger-width) max-h-60 overflow-y-auto p-2" align="start">
            <div className="flex flex-col gap-0.5">
              {tweakcnThemes.map((theme) => (
                <button
                  key={theme.value}
                  type="button"
                  onClick={() => choosePreset("tweakcn", theme.value)}
                  className={cn(
                    "flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground text-left",
                    theme.value === selectedTweakcn && "bg-accent/50",
                  )}
                >
                  <PresetSwatches styles={theme.preset.styles.light} />
                  <span className="flex-1">{theme.name}</span>
                  {theme.value === selectedTweakcn && <Check className="h-4 w-4 shrink-0" />}
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <Button variant="outline" size="sm" onClick={onImportClick} className="w-full cursor-pointer">
        <Upload className="h-3.5 w-3.5 mr-1.5" />
        {preference.source === "imported" ? "Import another theme" : "Import theme"}
      </Button>

      <Separator />

      {/* ── Mode and shape ──────────────────────────────────────────────── */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Mode</Label>
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant={!isDarkMode ? "secondary" : "outline"}
            size="sm"
            aria-pressed={!isDarkMode}
            onClick={(e) => isDarkMode && toggleTheme(e)}
            className="cursor-pointer mode-toggle-button relative overflow-hidden"
          >
            <Sun className="h-4 w-4 mr-1" />
            Light
          </Button>
          <Button
            variant={isDarkMode ? "secondary" : "outline"}
            size="sm"
            aria-pressed={isDarkMode}
            onClick={(e) => !isDarkMode && toggleTheme(e)}
            className="cursor-pointer mode-toggle-button relative overflow-hidden"
          >
            <Moon className="h-4 w-4 mr-1" />
            Dark
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        <Label className="text-sm font-medium">Radius</Label>
        <OptionButtons
          options={radiusOptions.map((o) => ({ value: o.value, label: o.name }))}
          value={preference.radius}
          onChange={(radius) => update({ radius })}
          columns={5}
        />
      </div>

      <div className="space-y-3">
        <Label className="text-sm font-medium">Density</Label>
        <OptionButtons options={DENSITY_OPTIONS} value={preference.density} onChange={(density) => update({ density })} columns={3} />
        <p className="text-muted-foreground text-xs">Spacing inside and between controls, table rows and panels.</p>
      </div>

      <div className="space-y-3">
        <Label className="text-sm font-medium">Shadows</Label>
        <OptionButtons options={SHADOW_OPTIONS} value={preference.shadows} onChange={(shadows) => update({ shadows })} columns={3} />
      </div>

      <Separator />

      {/* ── Typography ──────────────────────────────────────────────────── */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="theme-font" className="text-sm font-medium">Font</Label>
          <Select value={preference.font} onValueChange={(font) => update({ font })}>
            <SelectTrigger id="theme-font" className="w-full cursor-pointer">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {FONT_OPTIONS.map((font) => (
                <SelectItem key={font.value} value={font.value} className="cursor-pointer">
                  <span style={{ fontFamily: font.stack }}>{font.label}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="theme-font-scale" className="text-sm font-medium">Text size</Label>
            <span className="text-muted-foreground text-xs tabular-nums">{Math.round(preference.fontScale * 100)}%</span>
          </div>
          <Slider
            id="theme-font-scale"
            min={0.9}
            max={1.15}
            step={0.05}
            value={preference.fontScale}
            onValueChange={(fontScale) => update({ fontScale: Math.round(fontScale * 100) / 100 })}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="theme-letter-spacing" className="text-sm font-medium">Letter spacing</Label>
            <span className="text-muted-foreground text-xs tabular-nums">
              {preference.letterSpacing === 0 ? "Normal" : `${preference.letterSpacing > 0 ? "+" : ""}${preference.letterSpacing.toFixed(3)}em`}
            </span>
          </div>
          <Slider
            id="theme-letter-spacing"
            min={-0.02}
            max={0.05}
            step={0.005}
            value={preference.letterSpacing}
            onValueChange={(letterSpacing) => update({ letterSpacing: Math.round(letterSpacing * 1000) / 1000 })}
          />
        </div>
      </div>

      <Separator />

      {/* ── Colours ─────────────────────────────────────────────────────── */}
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="colors" className="rounded-lg border">
          <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/50">
            <span className="text-sm font-medium">
              Colours
              {overrideCount > 0 && <span className="text-muted-foreground ml-1.5 font-normal">({overrideCount} edited)</span>}
            </span>
          </AccordionTrigger>
          <AccordionContent className="space-y-5 border-t px-4 pt-3 pb-4">
            <p className="text-muted-foreground text-xs">
              Editing {isDarkMode ? "dark" : "light"} mode. Switch mode above to edit the other one — each keeps its own colours.
            </p>
            {COLOR_GROUPS.map((group) => (
              <div key={group.title} className="space-y-3">
                <div className="text-muted-foreground text-[11px] font-bold tracking-wide uppercase">{group.title}</div>
                {group.colors.map((spec) => (
                  <ColorField
                    key={spec.cssVar}
                    label={spec.label}
                    cssVar={spec.cssVar}
                    value={currentColor(spec.cssVar)}
                    isOverridden={spec.cssVar in modeOverrides}
                    onChange={(value) => setColorOverride(spec.cssVar, value)}
                    onReset={() => setColorOverride(spec.cssVar, null)}
                    contrastWith={
                      spec.contrast
                        ? { label: spec.contrast.label, color: currentColor(spec.contrast.against), minContrast: spec.contrast.min }
                        : undefined
                    }
                  />
                ))}
              </div>
            ))}
            {overrideCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                className="w-full cursor-pointer"
                onClick={() => update({ colorOverrides: { light: {}, dark: {} } })}
              >
                <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
                Undo all colour edits
              </Button>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
