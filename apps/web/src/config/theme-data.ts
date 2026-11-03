import { shadcnThemePresets } from '@/utils/shadcn-ui-theme-presets'
import { tweakcnPresets } from '@/utils/tweakcn-theme-presets'
import type { ColorTheme } from '@/types/theme-customizer'
import { features } from '@/config/features'

// Tweakcn theme presets for the dropdown - convert from tweakcnPresets
export const tweakcnThemes: ColorTheme[] = Object.entries(tweakcnPresets)
  // Sonar is listed only in builds that turn it on, so other deployments show the same themes as before.
  .filter(([key]) => key !== 'sonar' || features.sonarTheme)
  .map(([key, preset]) => ({
    name: preset.label || key,
    value: key,
    preset: preset
  }))

// Shadcn theme presets for the dropdown - convert from shadcnThemePresets  
export const colorThemes: ColorTheme[] = Object.entries(shadcnThemePresets).map(([key, preset]) => ({
  name: preset.label || key,
  value: key,
  preset: preset
}))
