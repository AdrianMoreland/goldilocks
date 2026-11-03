/**
 * Build-time switches for work that one deployment shows before the others. They are read from `VITE_*` variables when
 * the web app is built, so a deployment that does not set them keeps today's behaviour.
 */
const previewFeatures = import.meta.env.VITE_PREVIEW_FEATURES === "true"

export const features = {
  /** The Ctrl+K command palette and its search box in the page header. */
  commandPalette: previewFeatures,
  /** The Sonar theme in the theme editor's list. */
  sonarTheme: previewFeatures,
  /** The theme a user without a saved choice gets. Sonar only when the build offers it and asks for it. */
  defaultTheme: previewFeatures && import.meta.env.VITE_DEFAULT_THEME === "sonar" ? "sonar" : "merrion-gold",
} as const
