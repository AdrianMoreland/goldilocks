/**
 * Build-time switches for work that one deployment shows before the others. They are read from `VITE_*` variables when
 * the web app is built, so a deployment that does not set them keeps today's behaviour.
 */
const previewFeatures = import.meta.env.VITE_PREVIEW_FEATURES === "true"

export const features = {
  /** The Ctrl+K command palette and its search box in the page header. */
  commandPalette: previewFeatures,
} as const
