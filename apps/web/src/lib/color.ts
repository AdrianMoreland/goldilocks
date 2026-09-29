/**
 * Resolve any CSS colour string (hex, rgb, oklch, a relative-colour
 * expression, …) to sRGB by painting it onto a 1×1 canvas — the browser does
 * the parsing and gamut mapping, so this handles every format a theme uses.
 */
let ctx: CanvasRenderingContext2D | null = null

export function cssColorToRgb(color: string): [number, number, number] | null {
    if (!color) return null
    if (!ctx) {
        const canvas = document.createElement("canvas")
        canvas.width = canvas.height = 1
        ctx = canvas.getContext("2d", { willReadFrequently: true })
    }
    if (!ctx) return null
    // Resolve through a real element first: canvas can't parse var() or
    // relative-colour syntax, but getComputedStyle can.
    const probe = document.createElement("span")
    probe.style.color = color
    if (!probe.style.color) return null
    document.body.appendChild(probe)
    const resolved = getComputedStyle(probe).color
    probe.remove()

    ctx.clearRect(0, 0, 1, 1)
    ctx.fillStyle = "#000"
    ctx.fillStyle = resolved
    ctx.fillRect(0, 0, 1, 1)
    const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data
    return [r, g, b]
}

export function toHex(color: string): string | null {
    const rgb = cssColorToRgb(color)
    return rgb ? `#${rgb.map((v) => v.toString(16).padStart(2, "0")).join("")}` : null
}

function luminance([r, g, b]: [number, number, number]): number {
    const channel = (v: number) => {
        const s = v / 255
        return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
    }
    return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b)
}

/** WCAG contrast ratio between two CSS colours, or null if either can't be parsed. */
export function contrastRatio(a: string, b: string): number | null {
    const ra = cssColorToRgb(a)
    const rb = cssColorToRgb(b)
    if (!ra || !rb) return null
    const [hi, lo] = [luminance(ra), luminance(rb)].sort((x, y) => y - x)
    return (hi + 0.05) / (lo + 0.05)
}
