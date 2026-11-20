/**
 * For a dialog's `onOpenAutoFocus`. On a touch screen, focusing the first text field when a dialog opens pops the
 * keyboard over it before the user has asked to type. There, focus the dialog itself instead (it is still announced
 * and Tab still starts inside it); the keyboard opens only when a field is tapped. With a mouse and keyboard the
 * first field keeps its focus, which is what someone typing expects.
 */
export function keepKeyboardClosedOnTouch(event: Event) {
    if (typeof window === "undefined" || !window.matchMedia("(pointer: coarse)").matches) return
    event.preventDefault()
    ;(event.currentTarget as HTMLElement | null)?.focus()
}
