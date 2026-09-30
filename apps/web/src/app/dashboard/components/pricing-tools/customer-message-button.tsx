import { useState, type ReactNode } from "react"
import { ArrowLeft, ArrowLeftRight, Mail, MessageCircle, MessageSquareText, PackageCheck, PackageX, Tag } from "lucide-react"
import { toast } from "sonner"
import type { TradeCartResponse, TradeTransactionType } from "@goldilocks/shared-types"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { buildCustomerMessage, type MessageChannel } from "../../utils/customer-message"

interface CustomerMessageButtonProps {
    cart: TradeCartResponse | undefined
    transactionType: TradeTransactionType
    /** Prices the same items from the other side of the trade, for messages that show Price and Buyback together. */
    fetchOtherSide: (customSpot: number) => Promise<TradeCartResponse>
}

const CHANNEL_LABEL: Record<MessageChannel, string> = { whatsapp: "WhatsApp", email: "Email" }

/**
 * Copies a ready-to-send reply to a price enquiry. Steps: WhatsApp or Email →
 * in stock or not (Price quotes only — stock is irrelevant when we're buying) →
 * just the side being quoted, or both Price and Buyback. The message, filled
 * in from the current quote, lands on the clipboard.
 */
export function CustomerMessageButton({ cart, transactionType, fetchOtherSide }: CustomerMessageButtonProps) {
    const [open, setOpen] = useState(false)
    const [busy, setBusy] = useState(false)
    const [channel, setChannel] = useState<MessageChannel | null>(null)
    const [inStock, setInStock] = useState<boolean | null>(null)
    const isPrice = transactionType === "buying"
    const selectedLabel = isPrice ? "Price" : "Buyback"
    const otherLabel = isPrice ? "Buyback" : "Price"

    const reset = () => {
        setChannel(null)
        setInStock(null)
    }

    // Which question is showing: channel → stock (Price only) → which prices.
    const step: "channel" | "stock" | "scope" = channel === null ? "channel" : isPrice && inStock === null ? "stock" : "scope"

    const finish = async (both: boolean) => {
        if (!cart || !channel) return
        setBusy(true)

        try {
            const otherCart = both ? await fetchOtherSide(cart.spot) : undefined
            const { text, html } = buildCustomerMessage({ channel, transactionType, inStock: inStock ?? true, cart, otherCart })

            if (html && typeof ClipboardItem !== "undefined") {
                await navigator.clipboard.write([
                    new ClipboardItem({
                        "text/plain": new Blob([text], { type: "text/plain" }),
                        "text/html": new Blob([html], { type: "text/html" }),
                    }),
                ])
            } else {
                await navigator.clipboard.writeText(text)
            }
            toast.success(`${CHANNEL_LABEL[channel]} message copied — paste it into your reply`)
            setOpen(false)
            reset()
        } catch {
            toast.error(
                both
                    ? `Couldn't build the message with both prices. Try "${selectedLabel} only", or check your connection.`
                    : "Couldn't copy — your browser blocked clipboard access",
            )
        } finally {
            setBusy(false)
        }
    }

    const back = () => {
        if (step === "scope" && isPrice) setInStock(null)
        else reset()
    }

    return (
        <Popover
            open={open}
            onOpenChange={(next) => {
                setOpen(next)
                if (!next) reset()
            }}
        >
            <PopoverTrigger asChild>
                <button
                    type="button"
                    disabled={!cart || cart.lines.length === 0}
                    className="border-border bg-card hover:bg-muted flex cursor-pointer items-center justify-center gap-2 rounded-full border py-2.5 text-sm font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <MessageSquareText className="size-4" /> Message customer
                </button>
            </PopoverTrigger>
            <PopoverContent className="w-72 rounded-2xl p-3" align="center">
                <div className="flex flex-col gap-2">
                    {step !== "channel" && channel && (
                        <button
                            type="button"
                            onClick={back}
                            className="text-muted-foreground hover:text-foreground flex cursor-pointer items-center gap-1 self-start text-xs font-semibold"
                        >
                            <ArrowLeft className="size-3" /> {CHANNEL_LABEL[channel]}
                            {step === "scope" && isPrice && inStock !== null ? ` · ${inStock ? "In stock" : "Not in stock"}` : ""}
                        </button>
                    )}

                    {step === "channel" && (
                        <>
                            <p className="text-sm font-bold">Reply to the customer by…</p>
                            <ChoiceButton icon={<MessageCircle className="size-4" />} label="WhatsApp" hint="Short message with a bullet list" onClick={() => setChannel("whatsapp")} />
                            <ChoiceButton icon={<Mail className="size-4" />} label="Email" hint="Formal, with a price table" onClick={() => setChannel("email")} />
                        </>
                    )}

                    {step === "stock" && (
                        <>
                            <p className="text-sm font-bold">Are the items in stock?</p>
                            <ChoiceButton icon={<PackageCheck className="size-4" />} label="In stock" hint="Collect once payment is received" onClick={() => setInStock(true)} />
                            <ChoiceButton icon={<PackageX className="size-4" />} label="Not in stock" hint="We order it in — 4 to 6 weeks" onClick={() => setInStock(false)} />
                        </>
                    )}

                    {step === "scope" && (
                        <>
                            <p className="text-sm font-bold">Which prices should it show?</p>
                            <ChoiceButton
                                icon={<Tag className="size-4" />}
                                label={`${selectedLabel} only`}
                                hint={isPrice ? "What the customer would pay" : "What we would pay the customer"}
                                disabled={busy}
                                onClick={() => void finish(false)}
                            />
                            <ChoiceButton
                                icon={<ArrowLeftRight className="size-4" />}
                                label={`${selectedLabel} and ${otherLabel}`}
                                hint="Both sides, side by side"
                                disabled={busy}
                                onClick={() => void finish(true)}
                            />
                        </>
                    )}
                </div>
            </PopoverContent>
        </Popover>
    )
}

function ChoiceButton({ icon, label, hint, onClick, disabled }: { icon: ReactNode; label: string; hint: string; onClick: () => void; disabled?: boolean }) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            className="hover:bg-muted flex w-full cursor-pointer items-center gap-3 rounded-xl border px-3 py-2 text-left transition-colors disabled:cursor-wait disabled:opacity-60"
        >
            <span className="text-muted-foreground">{icon}</span>
            <span className="flex flex-col">
                <span className="text-sm font-semibold">{label}</span>
                <span className="text-muted-foreground text-xs">{hint}</span>
            </span>
        </button>
    )
}
