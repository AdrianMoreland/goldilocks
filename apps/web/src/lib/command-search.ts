/** Fired by anything that wants the command palette open (the sidebar's "Search and commands"); the header listens. */
export const OPEN_SEARCH_EVENT = "goldilocks:open-search"

/** Mac shows the Command key, everything else Ctrl; the shortcut itself accepts both. */
export const modKeyLabel = typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.userAgent) ? "⌘" : "Ctrl"
