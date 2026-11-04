import * as React from "react"

/** True while the media query matches, and updates when it changes (a window resize, a phone turned sideways). */
export function useMediaQuery(query: string): boolean {
    const [matches, setMatches] = React.useState(() => (typeof window === "undefined" ? false : window.matchMedia(query).matches))

    React.useEffect(() => {
        const mql = window.matchMedia(query)
        const onChange = () => setMatches(mql.matches)
        onChange()
        mql.addEventListener("change", onChange)
        return () => mql.removeEventListener("change", onChange)
    }, [query])

    return matches
}
