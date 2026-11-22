import { describe, expect, it } from "vitest"
import { buildCustomerMessage } from "./customer-message"

const cart = {
    metalType: "GOLD",
    spot: 3600,
    lines: [{ product: "1oz Gold Bar", quantity: 1, unitPrice: 3800, lineTotal: 3800, percent: 5.5 }],
} as never

describe("buildCustomerMessage wording", () => {
    it("keeps the built-in text when no wording is given", () => {
        const { text } = buildCustomerMessage({ channel: "whatsapp", transactionType: "buying", inStock: true, cart })
        expect(text.startsWith("Hello, thank you for your interest in Merrion Gold.")).toBe(true)
        const email = buildCustomerMessage({ channel: "email", transactionType: "buying", inStock: true, cart })
        expect(email.text.endsWith("Kind regards,\nMerrion Gold")).toBe(true)
    })

    it("uses the company opening, adds the closing note and ends with the sign-off", () => {
        const wording = { opening: "Hi, Maeve from Merrion Gold here.", closingNote: "Prices hold for 15 minutes.", signOff: "Thanks,\nMaeve" }
        const { text } = buildCustomerMessage({ channel: "whatsapp", transactionType: "buying", inStock: true, cart, wording })
        expect(text.startsWith("Hi, Maeve from Merrion Gold here. Here are some prices")).toBe(true)
        expect(text.endsWith("Prices hold for 15 minutes.\n\nThanks,\nMaeve")).toBe(true)

        const email = buildCustomerMessage({ channel: "email", transactionType: "buying", inStock: true, cart, wording })
        expect(email.text).toContain("Hi, Maeve from Merrion Gold here. Please find below")
        expect(email.text.endsWith("Prices hold for 15 minutes.\n\nThanks,\nMaeve")).toBe(true)
        expect(email.html).toContain("Thanks,<br>Maeve")
        expect(email.html).not.toContain("Kind regards,")
    })

    it("escapes the sign-off in the email HTML", () => {
        const wording = { opening: null, closingNote: null, signOff: "<b>Maeve</b>" }
        const { html } = buildCustomerMessage({ channel: "email", transactionType: "buying", inStock: true, cart, wording })
        expect(html).toContain("&lt;b&gt;Maeve&lt;/b&gt;")
    })
})
