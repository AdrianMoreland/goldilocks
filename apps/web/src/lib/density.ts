/** Row and control size in the redesign. Kept per browser, and applied as an attribute the stylesheet reads. */
export type Density = "compact" | "comfortable"

const KEY = "gl-density"

export function readDensity(): Density {
  try {
    return localStorage.getItem(KEY) === "comfortable" ? "comfortable" : "compact"
  } catch {
    return "compact"
  }
}

export function applyDensity(density: Density) {
  document.documentElement.dataset.density = density
}

export function saveDensity(density: Density) {
  try {
    localStorage.setItem(KEY, density)
  } catch {
    // Private mode or blocked storage: the choice just lasts until the page is closed.
  }
  applyDensity(density)
}
