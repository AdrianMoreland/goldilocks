import * as React from "react"
import { useTheme } from "@/hooks/use-theme"

/** Whether the page is currently dark, following the system setting when the theme is "system". */
export function useIsDarkMode(): boolean {
  const { theme } = useTheme()
  const [isDark, setIsDark] = React.useState(false)

  React.useEffect(() => {
    const update = () => {
      if (theme === "dark") setIsDark(true)
      else if (theme === "light") setIsDark(false)
      else setIsDark(window.matchMedia("(prefers-color-scheme: dark)").matches)
    }
    update()

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    mediaQuery.addEventListener("change", update)
    return () => mediaQuery.removeEventListener("change", update)
  }, [theme])

  return isDark
}
