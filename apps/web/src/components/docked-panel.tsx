import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

/** Width of the right-hand column shared by the Pricing Tools and Assistant panels, so swapping one for the other never moves the page. */
export const RIGHT_PANEL_WIDTH = "clamp(260px, 32vw, 384px)"
/** The theme editor takes the app sidebar's place, so it is exactly as wide as the sidebar (BaseLayout defines --sidebar-width). */
export const LEFT_PANEL_WIDTH = "var(--sidebar-width)"

/**
 * A column that sits beside the page and pushes it, rather than floating over
 * it: its outer width animates between 0 and `width` while the inner content
 * keeps a fixed width and is clipped, so nothing reflows mid-animation. It is
 * sticky and viewport-tall, so it stays in view on pages that scroll as a
 * whole. Closed panels are `inert`: not focusable and hidden from assistive tech.
 */
export function DockedPanel({
    side,
    open,
    width,
    label,
    children,
    className,
}: {
    side: "left" | "right"
    open: boolean
    width: string
    label: string
    children: ReactNode
    className?: string
}) {
    return (
        <aside
            aria-label={label}
            inert={!open}
            className={cn(
                "bg-card sticky top-0 z-30 h-svh shrink-0 self-start overflow-hidden transition-[width] duration-200 ease-in-out",
                side === "left" ? "border-r" : "border-l",
                className,
            )}
            style={{ width: open ? width : 0 }}
        >
            <div className="flex h-full flex-col" style={{ width }}>
                {children}
            </div>
        </aside>
    )
}
