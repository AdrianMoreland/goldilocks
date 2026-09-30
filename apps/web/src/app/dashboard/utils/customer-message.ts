import type { TradeCartResponse, TradeTransactionType } from "@goldilocks/shared-types"
import { formatPrice, formatSpot } from "./formatters"

export type MessageChannel = "whatsapp" | "email"

interface MessageInput {
    channel: MessageChannel
    /** Which side the clerk is quoting — decides the closing paragraph. */
    transactionType: TradeTransactionType
    inStock: boolean
    /** The quote on screen. */
    cart: TradeCartResponse
    /** The same items priced from the other side; when present, both Price and Buyback are shown. */
    otherCart?: TradeCartResponse
}

type Line = TradeCartResponse["lines"][number]

const escapeHtml = (value: string) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
const pct = (line: Line) => `${line.percent.toFixed(2)}%`
const bold = (value: string) => `*${value}*`

const spotFigure = (cart: TradeCartResponse) => `${formatSpot(cart.metalType, cart.spot)}/oz`

/** `wrap` bolds the figure in whichever markup the channel uses. */
const spotSentence = (cart: TradeCartResponse, wrap: (value: string) => string = (v) => v) =>
    `based on the current spot price of ${wrap(spotFigure(cart))}`

const BUYBACK_CLOSING =
    "If you would like to go ahead, we can arrange an appointment for you to bring the product along with photo ID. After testing and confirming the final price, we would send the funds to your bank account after no more than 10 working days depending on the amount."

/**
 * The customer's chosen product line for one item on both sides, always in
 * Price-then-Buyback order regardless of which side the clerk is quoting.
 */
interface Row {
    name: string
    quantity: number
    price?: Line
    buyback?: Line
}

function buildRows({ cart, otherCart, transactionType }: Pick<MessageInput, "cart" | "otherCart" | "transactionType">): Row[] {
    const priceCart = transactionType === "buying" ? cart : otherCart
    const buybackCart = transactionType === "buying" ? otherCart : cart

    return cart.lines.map((line, index) => ({
        name: line.product,
        quantity: line.quantity,
        price: priceCart?.lines[index],
        buyback: buybackCart?.lines[index],
    }))
}

/** WhatsApp bullet: "Name: €3,800 - 3.50%", per side, joined with " | " when both are shown. */
function whatsappBullet(row: Row): string {
    const qty = row.quantity > 1 ? ` (× ${row.quantity})` : ""
    const part = (label: string, line: Line, both: boolean) => {
        const amount = row.quantity > 1 ? `${formatPrice(line.unitPrice)} each, ${formatPrice(line.lineTotal)}` : formatPrice(line.unitPrice)
        return `${both ? `${label} ` : ""}${bold(amount)} - ${bold(pct(line))}`
    }
    const both = Boolean(row.price && row.buyback)
    const parts = [row.price && part("Price", row.price, both), row.buyback && part("Buyback", row.buyback, both)].filter(Boolean)
    return `* ${row.name}${qty}: ${parts.join(" | ")}`
}

/**
 * Customer-facing reply for a price enquiry. The wording of the "Price"
 * (customer buying) WhatsApp message is the owner's own template; the
 * in-stock variant and the email's process paragraph are adaptations of it,
 * so those should be read once by the owner before staff rely on them.
 */
export function buildCustomerMessage(input: MessageInput): { text: string; html?: string } {
    const { channel, transactionType, inStock, cart, otherCart } = input
    const many = cart.lines.length > 1
    const isPrice = transactionType === "buying"
    const rows = buildRows(input)

    const priceProcess = (formal: boolean) => {
        const stock = inStock
            ? `${many ? "The products are" : "The product is"} currently in stock, so we can arrange for you to collect ${formal ? "your order" : "the order"} as soon as payment is received.`
            : `As ${many ? "the products are" : "the product is"} not currently in stock, we would need to order ${many ? "them" : "it"} for you, but you can still purchase at the current price and collect after 4 to 6 weeks if not sooner.`

        return formal
            ? `Should you wish to proceed, please reply to confirm the items and quantities you would like and we will send you a live quote together with our bank details. Once your payment is received, we lock the price for you. ${stock}`
            : `If you want to go ahead with the purchase I can send you a live quote with our bank details. Once payment is received, we would lock the price for you and arrange for you to collect the order.\n${stock}`
    }

    if (channel === "whatsapp") {
        const closing = isPrice ? priceProcess(false) : BUYBACK_CLOSING
        const opening = otherCart
            ? "Here are our current prices for the requested items"
            : isPrice
              ? "Here are some prices for the requested items"
              : "Here are our current buyback prices for the requested items"

        return {
            text: [
                `Hello, thank you for your interest in Merrion Gold. ${opening}, ${spotSentence(cart, bold)}:`,
                "",
                ...rows.map(whatsappBullet),
                "",
                closing,
            ].join("\n"),
        }
    }

    // ── Email ───────────────────────────────────────────────────────────────
    // A quantity column and a totals column only earn their place when the
    // customer asked for more than one of something.
    const showQty = rows.some((row) => row.quantity > 1)

    const headers = ["Item"]
    if (showQty) headers.push("Qty")
    const sideHeaders = (label: string, percentLabel: string) => {
        headers.push(showQty ? `${label} (each)` : label)
        if (showQty) headers.push(`${label} total`)
        headers.push(percentLabel)
    }
    if (rows[0]?.price) sideHeaders("Price", "Premium")
    if (rows[0]?.buyback) sideHeaders("Buyback", "Discount")

    const tableRows = rows.map((row) => {
        const cells = [row.name]
        if (showQty) cells.push(String(row.quantity))
        for (const line of [row.price, row.buyback]) {
            if (!line) continue
            cells.push(formatPrice(line.unitPrice))
            if (showQty) cells.push(formatPrice(line.lineTotal))
            cells.push(pct(line))
        }
        return cells
    })

    const intro = `Thank you for your interest in Merrion Gold. Please find below the prices for the items you asked about, ${spotSentence(cart)}. Prices move with the market and are shown in euro.`
    const introHtml = escapeHtml(intro).replace(
        escapeHtml(spotFigure(cart)),
        `<strong>${escapeHtml(spotFigure(cart))}</strong>`,
    )
    const closing = isPrice ? priceProcess(true) : BUYBACK_CLOSING

    const text = [
        "Dear Customer,",
        "",
        intro,
        "",
        [headers, ...tableRows].map((cells) => cells.join("\t")).join("\n"),
        "",
        closing,
        "",
        "Kind regards,",
        "Merrion Gold",
    ].join("\n")

    // Inline styles plus a bgcolor attribute: Outlook and Gmail drop most
    // stylesheet rules but honour these. Gold is the brand's own colour.
    const cell = (value: string, tag: "th" | "td", strong = false) =>
        tag === "th"
            ? `<th bgcolor="#DAAB69" style="border:1px solid #ddd;padding:6px 10px;text-align:left;background-color:#DAAB69;color:#1a1a1a;">${escapeHtml(value)}</th>`
            : `<td style="border:1px solid #ddd;padding:6px 10px;text-align:left;${strong ? "font-weight:bold;" : ""}">${escapeHtml(value)}</td>`
    const paragraph = (value: string) => `<p style="margin:0 0 12px;">${escapeHtml(value)}</p>`

    const html = `<div style="font-family:sans-serif;font-size:14px;">
${paragraph("Dear Customer,")}
<p style="margin:0 0 12px;">${introHtml}</p>
<table style="border-collapse:collapse;margin:0 0 12px;font-size:13px;"><thead><tr>${headers.map((h) => cell(h, "th")).join("")}</tr></thead><tbody>${tableRows.map((r) => `<tr>${r.map((c, i) => cell(c, "td", i > 0 && !(showQty && i === 1))).join("")}</tr>`).join("")}</tbody></table>
${paragraph(closing)}
${paragraph("Kind regards,")}
<p style="margin:0;">Merrion Gold</p>
</div>`

    return { text, html }
}
