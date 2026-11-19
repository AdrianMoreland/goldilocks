/**
 * Example data for the Rules hub. Nothing here is live: the products, premiums, people, thresholds and past price moves
 * are made up to show how each rule type behaves while the screens are built. The real rules will be stored by the API
 * (planned SalesRule / RuleSet tables) and read from there; this file then shrinks to field catalogues.
 */
import { defineFields, f, type Fields, type Query } from "@qnot/core"
import type { RouteDestination, Route } from "./devl/routing-rules"
import type { EnvironmentTargeting, FlagVariant } from "./devl/flag-targeting"
import type { PastIncident, AlertAction, AlertTrigger } from "./devl/alert-rules"
import type { SegmentPerson } from "./devl/segment-builder"
import type { PlaygroundFlag, ContextPreset } from "./devl/flag-playground"
import type { FeatureFlag, FlagEnvironment, FlagSegment } from "./devl/flag-board"
import type { NotificationGroup, NotificationPrefs } from "./devl/notification-matrix"
import type { NotificationItem } from "./devl/notification-centre"
import type { DiffSegment } from "./devl/redline"
import type { GoNoGoRequest } from "./devl/go-no-go"

/* ---------- shared vocabulary ---------- */

export const BRANCHES = [
  { id: "all", name: "All branches" },
  { id: "dublin", name: "Dublin" },
  { id: "cork", name: "Cork" },
  { id: "barcelona", name: "Barcelona" },
] as const

export type BranchId = (typeof BRANCHES)[number]["id"]

const metals = [
  { value: "gold", label: "Gold" },
  { value: "silver", label: "Silver" },
  { value: "platinum", label: "Platinum" },
  { value: "palladium", label: "Palladium" },
] as const

const categories = [
  { value: "bar", label: "Bar" },
  { value: "coin", label: "Coin" },
] as const

/** Example catalogue. Premiums are illustrative, not the live product table. */
export const PRODUCTS = [
  { id: "gold-1g", name: "1g gold bar", metal: "gold", category: "bar", weight: 1, premium: 14 },
  { id: "gold-10g", name: "10g gold bar", metal: "gold", category: "bar", weight: 10, premium: 6.8 },
  { id: "gold-1oz", name: "1oz gold bar", metal: "gold", category: "bar", weight: 31.1, premium: 5.9 },
  { id: "gold-50g", name: "50g gold bar", metal: "gold", category: "bar", weight: 50, premium: 4.8 },
  { id: "gold-100g", name: "100g gold bar", metal: "gold", category: "bar", weight: 100, premium: 4.55 },
  { id: "gold-250g", name: "250g gold bar", metal: "gold", category: "bar", weight: 250, premium: 4.1 },
  { id: "gold-500g", name: "500g gold bar", metal: "gold", category: "bar", weight: 500, premium: 3.75 },
  { id: "gold-1kg", name: "1kg gold bar", metal: "gold", category: "bar", weight: 1000, premium: 3.5 },
  { id: "maple-1oz", name: "1oz Maple Leaf", metal: "gold", category: "coin", weight: 31.1, premium: 6.2 },
  { id: "krugerrand-1oz", name: "1oz Krugerrand", metal: "gold", category: "coin", weight: 33.9, premium: 6.0 },
  { id: "britannia-1oz", name: "1oz Britannia", metal: "gold", category: "coin", weight: 31.1, premium: 6.4 },
  { id: "philharmonic-1oz", name: "1oz Philharmonic", metal: "gold", category: "coin", weight: 31.1, premium: 6.3 },
  { id: "silver-maple-1oz", name: "1oz silver Maple Leaf", metal: "silver", category: "coin", weight: 31.1, premium: 28 },
  { id: "silver-1kg", name: "1kg silver bar", metal: "silver", category: "bar", weight: 1000, premium: 12 },
  { id: "platinum-1oz", name: "1oz platinum bar", metal: "platinum", category: "bar", weight: 31.1, premium: 8.5 },
] as const

const productOptions = PRODUCTS.map((p) => ({ value: p.id, label: p.name }))
export const productName = (id: string) => PRODUCTS.find((p) => p.id === id)?.name ?? id

const group = (...children: Query["children"]): Query => ({ kind: "group", combinator: "and", children })
const rule = (field: string, operator: string, value: unknown): Query["children"][number] => ({ kind: "rule", field, operator, value } as Query["children"][number])

/** A tiny seeded generator so the example history is the same on every load. */
function seeded(seed: number) {
  let s = seed
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296
    return s / 4294967296
  }
}

/* ---------- 1. Assistant offers ---------- */

export const requestFields: Fields = defineFields({
  intent: f.enum([{ value: "buy", label: "Buy" }, { value: "sell", label: "Sell" }], { label: "Customer wants to" }),
  metal: f.enum(metals, { label: "Metal" }),
  category: f.enum(categories, { label: "Category" }),
  product: f.enum(productOptions, { label: "Asks for" }),
  quantity: f.number({ label: "Quantity", min: 1, integer: true }),
  budget: f.number({ label: "Budget", prefix: "€", min: 0, step: 500 }),
  stockConfirmed: f.boolean({ label: "Stock confirmed" }),
})

export const initialOffers: RouteDestination[] = [
  { id: "swap-1kg", name: "32× 1oz gold bar at the 1kg premium", detail: "Swap a kilo bar for 1oz bars at 3.50%" },
  { id: "budget-gold", name: "Budget mix: 1oz bars + 10g bars", detail: "1oz bars first, 10g bars for the rest" },
  { id: "push-maple", name: "1oz Maple Leaf first", detail: "We hold plenty; normal premium" },
  { id: "manager", name: "Hand to a manager", detail: "No offer in the reply; the notes ask for a manager" },
  { id: "best-fit", name: "Best fit from the catalogue", detail: "Closest products at normal premiums" },
]

export const initialOfferRoutes: Record<BranchId, Route[]> = {
  all: [
    { id: "o1", when: group(rule("product", "eq", "gold-1kg")), to: "swap-1kg" },
    {
      id: "o2",
      when: group(rule("intent", "eq", "buy"), rule("metal", "eq", "gold"), rule("budget", "between", [2000, 20000])),
      to: "budget-gold",
    },
    { id: "o3", when: group(rule("budget", "gt", 150000)), to: "manager" },
  ],
  dublin: [
    { id: "o4", when: group(rule("metal", "eq", "gold"), rule("category", "eq", "coin")), to: "push-maple" },
  ],
  cork: [],
  barcelona: [],
}

export const sampleRequest = {
  intent: "buy",
  metal: "gold",
  category: "bar",
  product: "gold-1oz",
  quantity: 1,
  budget: 5000,
  stockConfirmed: false,
}

/** Example "last month" of assistant requests (shape only, never the customer's words). */
export const requestHistory = (() => {
  const rnd = seeded(7)
  return Array.from({ length: 240 }, () => {
    const p = PRODUCTS[Math.floor(rnd() * PRODUCTS.length)]
    return {
      intent: rnd() < 0.78 ? "buy" : "sell",
      metal: p.metal,
      category: p.category,
      product: p.id,
      quantity: 1 + Math.floor(rnd() * 5),
      budget: Math.round((500 + rnd() * rnd() * 60000) / 100) * 100,
      stockConfirmed: rnd() < 0.5,
    }
  })
})()

/* ---------- 2. Premium limits ---------- */

export const productFields: Fields = defineFields({
  product: f.enum(productOptions, { label: "Product" }),
  metal: f.enum(metals, { label: "Metal" }),
  category: f.enum(categories, { label: "Category" }),
  weight: f.number({ label: "Weight", suffix: "g", min: 0 }),
  stockConfirmed: f.boolean({ label: "Stock confirmed" }),
})

export const limitVariants: FlagVariant[] = [
  { id: "none", name: "No limit", tone: "bg-muted-foreground/50" },
  { id: "f350", name: "Lowest 3.50%", tone: "bg-amber-500" },
  { id: "f400", name: "Lowest 4.00%", tone: "bg-sky-500" },
  { id: "f500", name: "Lowest 5.00%", tone: "bg-emerald-500" },
]

/** Every product, once with stock confirmed and once without, so the preview counts both situations. */
export const productPopulation = PRODUCTS.flatMap((p) => [
  { id: `${p.id}-in`, product: p.id, metal: p.metal, category: p.category, weight: p.weight, stockConfirmed: true },
  { id: `${p.id}-ask`, product: p.id, metal: p.metal, category: p.category, weight: p.weight, stockConfirmed: false },
])

const limitBase = (rules: EnvironmentTargeting["rules"]): EnvironmentTargeting => ({
  on: true,
  rules,
  rollout: { none: 100 },
  offVariant: "none",
})

export const initialLimits: Record<string, EnvironmentTargeting> = {
  all: limitBase([
    { id: "l1", when: group(rule("product", "eq", "gold-1oz"), rule("stockConfirmed", "eq", true)), serve: "f350" },
    { id: "l2", when: group(rule("category", "eq", "coin"), rule("metal", "eq", "gold")), serve: "f400" },
  ]),
  dublin: limitBase([
    { id: "l3", when: group(rule("product", "eq", "maple-1oz"), rule("stockConfirmed", "eq", true)), serve: "f350" },
  ]),
  cork: limitBase([]),
  barcelona: limitBase([{ id: "l4", when: group(rule("metal", "eq", "silver")), serve: "f500" }]),
}

export const limitRedline: DiffSegment[] = [
  "1oz gold bar, stock confirmed: lowest premium ",
  { del: "4.00%", ins: "3.50%", reason: "Matches the 1kg bar's premium for the swap offer" },
  ". Gold coins: lowest premium ",
  { ins: "4.00%", reason: "New limit" },
  ". Silver in Barcelona: lowest premium ",
  { del: "6.00%", ins: "5.00%", reason: "Barcelona asked to match local dealers" },
  ".",
]

/* ---------- 3. Price alerts ---------- */

export const alertFields: Fields = defineFields({
  goldSpot: f.number({ label: "Gold spot (€/oz)", suffix: "€" }),
  goldMove: f.number({ label: "Gold move in 4 hours", suffix: "%" }),
  headroom: f.number({ label: "Premium above its limit", suffix: "%" }),
  minutes: f.number({ label: "Minutes", min: 0, integer: true }),
  currency: f.enum([{ value: "EUR", label: "EUR" }, { value: "GBP", label: "GBP" }, { value: "USD", label: "USD" }], { label: "Currency" }),
  mode: f.enum(
    [
      { value: "normal", label: "Normal" },
      { value: "weekend", label: "Weekend" },
      { value: "volatile", label: "Volatile" },
      { value: "shortage", label: "Shortage" },
    ],
    { label: "Market mode" },
  ),
  branch: f.enum(BRANCHES.filter((b) => b.id !== "all").map((b) => ({ value: b.id, label: b.name })), { label: "Branch" }),
})

export const alertMetrics = ["goldSpot", "goldMove", "headroom"]

export const alertActions: AlertAction[] = [
  { id: "me-app", name: "Notify me in the app" },
  { id: "me-email", name: "Notify me in the app and by email" },
  { id: "managers", name: "Notify branch managers" },
  { id: "pause", name: "Pause reduced-premium offers" },
]

/** Example price episodes over the last 30 days (day 0 = 30 days ago). */
export const priceEpisodes: PastIncident[] = [
  { id: "e1", day: 2, at: "Oct 21", title: "Gold dips on a strong dollar", goldSpot: 2338, goldMove: -1.6, headroom: 1.2, minutes: 40, currency: "EUR", mode: "normal", branch: "dublin" },
  { id: "e2", day: 5, at: "Oct 24", title: "US jobs report", goldSpot: 2391, goldMove: 2.4, headroom: 0.9, minutes: 25, currency: "EUR", mode: "volatile", branch: "dublin" },
  { id: "e3", day: 9, at: "Oct 28", title: "Weekend gap on the open", goldSpot: 2362, goldMove: -2.1, headroom: 0.4, minutes: 90, currency: "EUR", mode: "weekend", branch: "cork" },
  { id: "e4", day: 12, at: "Oct 31", title: "Month-end selling", goldSpot: 2344, goldMove: -1.2, headroom: 1.4, minutes: 20, currency: "EUR", mode: "normal", branch: "dublin" },
  { id: "e5", day: 15, at: "Nov 3", title: "Central bank buying headline", goldSpot: 2410, goldMove: 2.9, headroom: 2.1, minutes: 55, currency: "EUR", mode: "volatile", branch: "barcelona" },
  { id: "e6", day: 18, at: "Nov 6", title: "Quiet session", goldSpot: 2398, goldMove: 0.3, headroom: 2.4, minutes: 10, currency: "EUR", mode: "normal", branch: "dublin" },
  { id: "e7", day: 21, at: "Nov 9", title: "Gold slides after rate comments", goldSpot: 2329, goldMove: -2.6, headroom: 0.3, minutes: 65, currency: "EUR", mode: "volatile", branch: "dublin" },
  { id: "e8", day: 24, at: "Nov 12", title: "GBP spike", goldSpot: 2371, goldMove: 1.1, headroom: 1.8, minutes: 15, currency: "GBP", mode: "normal", branch: "cork" },
  { id: "e9", day: 27, at: "Nov 15", title: "Weekend mode premium squeeze", goldSpot: 2356, goldMove: -0.8, headroom: 0.2, minutes: 120, currency: "EUR", mode: "weekend", branch: "barcelona" },
  { id: "e10", day: 29, at: "Nov 17", title: "Recovery to the week's high", goldSpot: 2402, goldMove: 1.9, headroom: 1.6, minutes: 30, currency: "EUR", mode: "normal", branch: "dublin" },
]

export interface AlertCardConfig {
  id: string
  name: string
  trigger: AlertTrigger
  scope: Query
  action: string
}

export const initialAlerts: AlertCardConfig[] = [
  {
    id: "a1",
    name: "Gold under €2,350",
    trigger: { metric: "goldSpot", operator: "lt", threshold: 2350, minutes: 15 },
    scope: group(rule("currency", "eq", "EUR")),
    action: "me-email",
  },
  {
    id: "a2",
    name: "Premium close to its limit",
    trigger: { metric: "headroom", operator: "lt", threshold: 0.5, minutes: 30 },
    scope: group(),
    action: "managers",
  },
]

export const notificationGroups: NotificationGroup[] = [
  {
    id: "price",
    label: "Price alerts",
    events: [
      { id: "gold-under", label: "Gold under €2,350", description: "Your alert" },
      { id: "headroom", label: "Premium close to its limit", description: "Shared with branch managers" },
    ],
  },
  {
    id: "rules",
    label: "Rule changes",
    events: [
      { id: "published", label: "Rules published", description: "Someone published a new version" },
      { id: "kill", label: "Reduced premiums paused", description: "The kill switch was used", locked: { inApp: "Always shown to admins" } },
    ],
  },
]

export const notificationDefaults: NotificationPrefs = {
  "gold-under": { email: true, push: false, inApp: true },
  headroom: { email: false, push: false, inApp: true },
  published: { email: true, push: false, inApp: true },
  kill: { email: true, push: true, inApp: true },
}

export const notificationFeed: NotificationItem[] = [
  { id: "n1", kind: "deploy", actor: { name: "Rules hub", tone: "amber" }, action: "fired", target: "Gold under €2,350", snippet: "Gold at €2,329/oz for 65 minutes (example)", time: "09:42", group: "Today" },
  { id: "n2", kind: "access", actor: { name: "Branch manager", tone: "violet" }, action: "asked to publish", target: "Premium limits", snippet: "1oz gold bar: lowest premium 3.50% when stock is confirmed", time: "08:15", group: "Today", request: true },
  { id: "n3", kind: "comment", actor: { name: "Desk staff", tone: "sky" }, action: "edited", target: "Assistant offers · Dublin", time: "Yesterday", group: "Earlier", read: true },
]

/* ---------- 4. Price rules (margin builder) ---------- */

export const MARKET_MODES = [
  { id: "normal", name: "Normal" },
  { id: "weekend", name: "Weekend" },
  { id: "volatile", name: "Volatile" },
  { id: "shortage", name: "Shortage" },
]

export const premiumVariants: FlagVariant[] = [
  { id: "own", name: "Product's own premium", tone: "bg-muted-foreground/50" },
  { id: "p350", name: "3.50%", tone: "bg-amber-500" },
  { id: "p450", name: "4.50%", tone: "bg-sky-500" },
  { id: "p620", name: "6.20%", tone: "bg-emerald-500" },
  { id: "p750", name: "7.50%", tone: "bg-rose-500" },
]

const modeBase = (rules: EnvironmentTargeting["rules"], on = true): EnvironmentTargeting => ({
  on,
  rules,
  rollout: { own: 100 },
  offVariant: "own",
})

export const initialPriceRules: Record<string, EnvironmentTargeting> = {
  normal: modeBase([
    { id: "p1", when: group(rule("metal", "eq", "gold"), rule("weight", "gte", 100)), serve: "p350" },
    { id: "p2", when: group(rule("metal", "eq", "gold"), rule("category", "eq", "coin")), serve: "p620" },
  ]),
  weekend: modeBase([{ id: "p3", when: group(rule("metal", "eq", "gold"), rule("weight", "gte", 100)), serve: "p450" }]),
  volatile: modeBase([{ id: "p4", when: group(rule("category", "eq", "coin")), serve: "p750" }]),
  shortage: modeBase([], false),
}

export const productRows = PRODUCTS.map((p) => ({ id: p.id, product: p.id, metal: p.metal, category: p.category, weight: p.weight, stockConfirmed: true }))

export const modeSchedules = [
  { label: "Friday 18:00 (Weekend starts)", value: "0 18 * * 5" },
  { label: "Monday 08:00 (back to Normal)", value: "0 8 * * 1" },
  { label: "Weekdays 09:30", value: "30 9 * * 1-5" },
]

/* ---------- 5. Checks and approvals ---------- */

export const tradeFields: Fields = defineFields({
  direction: f.enum([{ value: "buy", label: "Customer buys" }, { value: "sell", label: "Customer sells" }], { label: "Trade" }),
  total: f.number({ label: "Total", prefix: "€", min: 0, step: 500 }),
  payment: f.enum(
    [
      { value: "card", label: "Card" },
      { value: "transfer", label: "Bank transfer" },
      { value: "cash", label: "Cash" },
    ],
    { label: "Payment" },
  ),
  newCustomer: f.boolean({ label: "New customer" }),
})

export const checkOutcomes: RouteDestination[] = [
  { id: "photo-id", name: "Photo ID at collection", detail: "Staff check and note the ID before handing over" },
  { id: "manager-code", name: "Manager code before completing", detail: "A manager enters their code on the trade" },
  { id: "source-of-funds", name: "Source of funds form", detail: "The customer completes the form first" },
  { id: "none", name: "No extra checks", detail: "Standard procedure only" },
]

export const initialChecks: Route[] = [
  { id: "c1", when: group(rule("direction", "eq", "sell"), rule("total", "gt", 50000)), to: "manager-code" },
  { id: "c2", when: group(rule("payment", "eq", "cash"), rule("total", "gte", 5000)), to: "source-of-funds" },
  { id: "c3", when: group(rule("total", "gte", 10000)), to: "photo-id" },
]

export const sampleTrade = { direction: "buy", total: 12500, payment: "transfer", newCustomer: true }

export const tradeHistory = (() => {
  const rnd = seeded(11)
  const payments = ["card", "transfer", "cash"]
  return Array.from({ length: 180 }, () => ({
    direction: rnd() < 0.7 ? "buy" : "sell",
    total: Math.round((200 + rnd() * rnd() * 80000) / 100) * 100,
    payment: payments[Math.floor(rnd() * 3)],
    newCustomer: rnd() < 0.3,
  }))
})()

/* ---------- 6. Customer segments ---------- */

export const customerFields: Fields = defineFields({
  spent12m: f.number({ label: "Spent in 12 months", prefix: "€", min: 0, step: 1000 }),
  trades12m: f.number({ label: "Trades in 12 months", min: 0, integer: true }),
  daysSinceLast: f.number({ label: "Days since last trade", min: 0, integer: true }),
  prefers: f.enum(metals, { label: "Mostly buys" }),
  sellsBack: f.boolean({ label: "Has sold back to us" }),
  branch: f.enum(BRANCHES.filter((b) => b.id !== "all").map((b) => ({ value: b.id, label: b.name })), { label: "Home branch" }),
})

const FIRST = ["Aoife", "Ciarán", "Niamh", "Seán", "Orla", "Darragh", "Emma", "Conor", "Lucía", "Pablo", "Grace", "Liam", "Sofía", "Rory", "Clara", "Fionn"]
const LAST = ["Byrne", "Walsh", "Kelly", "Ryan", "O'Brien", "García", "Murphy", "Doyle", "Martín", "Nolan", "Burke", "Ruiz"]

/** Invented example customers; not real people and not from the customer records. */
export const exampleCustomers: SegmentPerson[] = (() => {
  const rnd = seeded(3)
  const branchIds = ["dublin", "cork", "barcelona"]
  return Array.from({ length: 120 }, (_, i) => {
    const first = FIRST[Math.floor(rnd() * FIRST.length)]
    const last = LAST[Math.floor(rnd() * LAST.length)]
    const trades = Math.floor(rnd() * rnd() * 30)
    return {
      id: `c${i}`,
      name: `${first} ${last}`,
      email: `example${i}@example.com`,
      spent12m: Math.round((rnd() * rnd() * rnd() * 150000) / 100) * 100,
      trades12m: trades,
      daysSinceLast: Math.floor(rnd() * 400),
      prefers: rnd() < 0.7 ? "gold" : rnd() < 0.8 ? "silver" : "platinum",
      sellsBack: rnd() < 0.25,
      branch: branchIds[Math.floor(rnd() * branchIds.length)],
    }
  })
})()

export const initialSegments = [
  { id: "vip", name: "VIP", query: group(rule("spent12m", "gte", 50000)) },
  { id: "lapsed", name: "Lapsed regulars", query: group(rule("trades12m", "gte", 3), rule("daysSinceLast", "gt", 180)) },
]

/* ---------- Overview: switches per branch ---------- */

export const switchEnvironments: FlagEnvironment[] = BRANCHES.filter((b) => b.id !== "all").map((b) => ({ id: b.id, name: b.name }))

export const switchSegments: FlagSegment[] = initialSegments.map((s) => ({ id: s.id, name: s.name }))

const allOn = (segments: string[] = []) => ({ dublin: { on: true, rollout: 100, segments }, cork: { on: true, rollout: 100, segments }, barcelona: { on: true, rollout: 100, segments } })

export const initialSwitches: FeatureFlag[] = [
  { key: "assistant-offers", description: "The assistant proposes products from the offers list", envs: allOn(), updated: "Today" },
  { key: "reduced-premiums", description: "Offers may use a premium below normal, never below a limit", envs: { ...allOn(), barcelona: { on: false, rollout: 100, segments: [] } }, updated: "Yesterday" },
  { key: "vip-offers", description: "Extra offers only for customers in a segment", envs: allOn(["vip"]), updated: "Nov 12" },
  { key: "price-alerts", description: "Alerts are checked on every price update", envs: allOn(), updated: "Nov 10" },
  { key: "trade-checks", description: "Checks and approvals are shown on trades", envs: { dublin: { on: false, rollout: 100, segments: [] }, cork: { on: false, rollout: 100, segments: [] }, barcelona: { on: false, rollout: 100, segments: [] } }, updated: "Draft" },
]

/** Example decisions, as the live log will show them once the server records which rule fired. */
export const decisionLog = [
  { time: "14:02", where: "Dublin", type: "Assistant offers", detail: "Offer 2 · Budget mix for a €5,000 gold request" },
  { time: "13:47", where: "Cork", type: "Premium limits", detail: "1oz gold bar held at 3.50% (stock confirmed)" },
  { time: "13:30", where: "Dublin", type: "Assistant offers", detail: "Offer 1 · 32× 1oz instead of a 1kg bar" },
  { time: "12:58", where: "All", type: "Price alerts", detail: "Gold under €2,350 fired (example)" },
  { time: "11:20", where: "Barcelona", type: "Checks", detail: "Source of funds form for a €7,200 cash trade" },
]

/* ---------- Test bench ---------- */

export const benchFields: Fields = { ...requestFields, ...tradeFields }

export const benchFlags: PlaygroundFlag[] = [
  {
    key: "assistant-offers",
    description: "What the assistant proposes",
    variants: initialOffers.map((o, i) => ({ id: o.id, name: o.name, tone: ["bg-amber-500", "bg-sky-500", "bg-emerald-500", "bg-rose-500", "bg-muted-foreground/50"][i] ?? "bg-muted-foreground/50" })),
    rules: initialOfferRoutes.all.map((r, i) => ({ name: `Offer ${i + 1}`, when: r.when, serve: r.to })),
    rollout: { "best-fit": 100 },
  },
  {
    key: "trade-checks",
    description: "What the trade needs before it completes",
    variants: checkOutcomes.map((c, i) => ({ id: c.id, name: c.name, tone: ["bg-sky-500", "bg-rose-500", "bg-amber-500", "bg-muted-foreground/50"][i] ?? "bg-muted-foreground/50" })),
    rules: initialChecks.map((r, i) => ({ name: `Check ${i + 1}`, when: r.when, serve: r.to })),
    rollout: { none: 100 },
  },
]

export const benchPresets: ContextPreset[] = [
  { name: "Gold, about €5k", context: { ...sampleRequest, ...sampleTrade, budget: 5000, total: 5000, payment: "card" } },
  { name: "Wants a 1kg bar", context: { ...sampleRequest, product: "gold-1kg", budget: 0, total: 76000, payment: "transfer" } },
  { name: "Sells €60k in cash", context: { ...sampleRequest, intent: "sell", direction: "sell", total: 60000, payment: "cash" } },
]

/* ---------- Publishing ---------- */

export const publishRequest: GoNoGoRequest = {
  agent: "Rules hub",
  action: "Publish 3 changes to Premium limits and Assistant offers",
  risk: "medium",
  reason: "Lowers the 1oz gold bar limit to 3.50% when stock is confirmed. Every assistant reply after publishing uses it.",
  preview: {
    type: "diff",
    file: "premium-limits · All branches",
    lines: [
      { kind: " ", text: "If product is 1oz gold bar and stock confirmed is Yes" },
      { kind: "-", text: "  lowest premium 4.00%" },
      { kind: "+", text: "  lowest premium 3.50%" },
      { kind: " ", text: "If category is Coin and metal is Gold" },
      { kind: "+", text: "  lowest premium 4.00%   (new)" },
    ],
  },
}
