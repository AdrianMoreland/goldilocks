import { useState } from "react"
import { Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

/** A one-line text box that submits on Enter and cancels on Escape. */
export function TextEntry({
    initial = "",
    placeholder,
    onSubmit,
    onCancel,
    className,
}: {
    initial?: string
    placeholder: string
    onSubmit: (text: string) => void
    onCancel?: () => void
    className?: string
}) {
    const [text, setText] = useState(initial)
    const submit = () => {
        const trimmed = text.trim()
        if (!trimmed) return
        onSubmit(trimmed)
        // A box that stays on screen (the "add" box) is ready for the next entry; one that closes on submit is unmounted anyway.
        if (!onCancel) setText("")
    }
    return (
        <div className={`flex items-center gap-1.5 ${className ?? ""}`}>
            <Input
                autoFocus={!!onCancel}
                value={text}
                placeholder={placeholder}
                aria-label={placeholder}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter") submit()
                    if (e.key === "Escape") onCancel?.()
                }}
                className="h-8 text-sm"
            />
            <Button size="icon" variant="ghost" className="size-8 shrink-0 cursor-pointer" onClick={submit} disabled={!text.trim()} aria-label="Save">
                <Check />
            </Button>
            {onCancel && (
                <Button size="icon" variant="ghost" className="size-8 shrink-0 cursor-pointer" onClick={onCancel} aria-label="Cancel">
                    <X />
                </Button>
            )}
        </div>
    )
}
