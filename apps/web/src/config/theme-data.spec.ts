import { afterEach, describe, expect, it, vi } from "vitest"
import { tweakcnPresets } from "@/utils/tweakcn-theme-presets"

afterEach(() => {
  vi.unstubAllEnvs()
  vi.resetModules()
})

async function loadWith(env: Record<string, string>) {
  vi.resetModules()
  for (const [name, value] of Object.entries(env)) vi.stubEnv(name, value)
  const [{ tweakcnThemes }, { DEFAULT_THEME_PREFERENCE }] = await Promise.all([import("./theme-data"), import("@/lib/theme-preference")])
  return { names: tweakcnThemes.map((theme) => theme.value), defaults: DEFAULT_THEME_PREFERENCE }
}

describe("Sonar theme", () => {
  it("sets every variable Merrion Gold sets, in both modes, plus its own extras", () => {
    const extras = ["up", "down", "mt-gold", "mt-silver", "mt-platinum", "mt-palladium", "ctl-h", "row-py", "ck-w"]
    for (const mode of ["light", "dark"] as const) {
      const sonar = Object.keys(tweakcnPresets.sonar.styles[mode])
      const merrion = Object.keys(tweakcnPresets["merrion-gold"].styles[mode])
      expect(sonar).toEqual(expect.arrayContaining(merrion))
      expect(sonar.filter((key) => !merrion.includes(key)).sort()).toEqual([...extras].sort())
    }
  })

  it("keeps cards flat, controls bordered strongly and the corner radius at 0.75rem", () => {
    for (const mode of ["light", "dark"] as const) {
      const styles = tweakcnPresets.sonar.styles[mode]
      expect(styles["shadow-opacity"]).toBe("0")
      expect(styles.radius).toBe("0.75rem")
      expect(styles.input).toMatch(/0\.4\)$/)
    }
  })

  // The product table's row height follows this unit; a looser one shows fewer products on opening (5 rows instead of 8).
  it("uses the same spacing unit as Merrion Gold, so the table is as dense", () => {
    for (const mode of ["light", "dark"] as const) {
      expect(tweakcnPresets.sonar.styles[mode].spacing).toBe(tweakcnPresets["merrion-gold"].styles[mode].spacing)
    }
  })

  it("is hidden, and not the default, when the build does not turn it on", async () => {
    const { names, defaults } = await loadWith({ VITE_PREVIEW_FEATURES: "", VITE_DEFAULT_THEME: "sonar" })
    expect(names).not.toContain("sonar")
    expect(names).toContain("merrion-gold")
    expect(defaults.value).toBe("merrion-gold")
    expect(defaults.radius).toBe("0.5rem")
  })

  it("is listed but not the default when only the preview features are on", async () => {
    const { names, defaults } = await loadWith({ VITE_PREVIEW_FEATURES: "true", VITE_DEFAULT_THEME: "" })
    expect(names).toContain("sonar")
    expect(defaults.value).toBe("merrion-gold")
  })

  it("is the default, with its own radius, when the build asks for it", async () => {
    const { defaults } = await loadWith({ VITE_PREVIEW_FEATURES: "true", VITE_DEFAULT_THEME: "sonar" })
    expect(defaults.value).toBe("sonar")
    expect(defaults.radius).toBe("0.75rem")
  })
})
