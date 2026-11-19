import { useState } from "react"
import { PencilIcon, PlusIcon, SparklesIcon, Trash2Icon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UNDERLINE_TAB, UNDERLINE_TAB_LIST } from "@/lib/underline-tabs"
import { RoutingRules, type Route, type RouteDestination } from "../devl/routing-rules"
import { MoneyInput } from "../devl/money-input"
import { BRANCHES, initialOfferRoutes, initialOffers, PRODUCTS, productName, requestFields, requestHistory, sampleRequest, type BranchId } from "../data"
import { useHub } from "../hub-context"
import { Note, SectionShell } from "../components/section-shell"

const OFFER_KINDS = [
  { value: "offer", label: "Offer a product" },
  { value: "swap", label: "Swap for N× another product" },
  { value: "mix", label: "Budget mix (main + top-up)" },
  { value: "push", label: "Push a product first" },
  { value: "manager", label: "Hand to a manager" },
] as const

const PREMIUM_MODES = [
  { value: "normal", label: "Normal premium" },
  { value: "match", label: "The premium of another product" },
  { value: "fixed", label: "A fixed premium (never below its limit)" },
] as const

type OfferKind = (typeof OFFER_KINDS)[number]["value"]
type PremiumMode = (typeof PREMIUM_MODES)[number]["value"]

interface OfferDraft {
  id?: string
  kind: OfferKind
  product: string
  other: string
  quantity: number
  premium: PremiumMode
  matchProduct: string
  fixedPremium: string
  maxBudget: number | null
}

const emptyDraft: OfferDraft = {
  kind: "offer",
  product: "gold-1oz",
  other: "gold-10g",
  quantity: 1,
  premium: "normal",
  matchProduct: "gold-1kg",
  fixedPremium: "4.00",
  maxBudget: null,
}

/** Turns the form into the one-line name and detail the offer rules show. */
function describeOffer(d: OfferDraft): Pick<RouteDestination, "name" | "detail"> {
  const premium =
    d.premium === "match" ? `at the ${productName(d.matchProduct)} premium` : d.premium === "fixed" ? `at ${d.fixedPremium}%` : "at the normal premium"
  const budget = d.maxBudget ? `, budgets up to €${d.maxBudget.toLocaleString("en-IE")}` : ""
  switch (d.kind) {
    case "swap":
      return { name: `${d.quantity}× ${productName(d.other)} ${premium}`, detail: `Instead of ${productName(d.product)}${budget}` }
    case "mix":
      return { name: `Budget mix: ${productName(d.product)} + ${productName(d.other)}`, detail: `Main product first, the rest in the smaller one${budget}` }
    case "push":
      return { name: `${productName(d.product)} first`, detail: `Listed before other options, ${premium}${budget}` }
    case "manager":
      return { name: "Hand to a manager", detail: "No offer in the reply; the notes ask for a manager" }
    default:
      return { name: `${d.quantity}× ${productName(d.product)} ${premium}`, detail: `Offered when a rule matches${budget}` }
  }
}

export function OffersSection() {
  const { toasts, markChanged } = useHub()
  const [branch, setBranch] = useState<BranchId>("all")
  const [routes, setRoutes] = useState(initialOfferRoutes)
  const [fallbacks, setFallbacks] = useState<Record<BranchId, string>>({ all: "best-fit", dublin: "best-fit", cork: "best-fit", barcelona: "best-fit" })
  const [offers, setOffers] = useState<RouteDestination[]>(initialOffers)
  const [drafts, setDrafts] = useState<Record<string, OfferDraft>>({})
  const [editing, setEditing] = useState<OfferDraft | null>(null)

  const used = (id: string) => Object.values(routes).some((list) => list.some((r) => r.to === id)) || Object.values(fallbacks).includes(id)

  const saveOffer = (draft: OfferDraft) => {
    const text = describeOffer(draft)
    if (draft.id) {
      setOffers((list) => list.map((o) => (o.id === draft.id ? { ...o, ...text } : o)))
      setDrafts((d) => ({ ...d, [draft.id as string]: draft }))
      toasts.show({ title: "Offer updated", description: text.name, tone: "success", duration: 3000 })
    } else {
      const id = `offer-${Date.now().toString(36)}`
      setOffers((list) => [...list.slice(0, -1), { id, ...text }, ...list.slice(-1)])
      setDrafts((d) => ({ ...d, [id]: { ...draft, id } }))
      toasts.show({ title: "Offer added", description: `${text.name}. Pick it in a rule to use it.`, tone: "success", duration: 4000 })
    }
    markChanged("Assistant offers")
    setEditing(null)
  }

  const removeOffer = (offer: RouteDestination) => {
    const before = offers
    setOffers((list) => list.filter((o) => o.id !== offer.id))
    markChanged("Assistant offers")
    toasts.show({
      title: "Offer deleted",
      description: offer.name,
      tone: "default",
      duration: 6000,
      action: { label: "Undo", onClick: () => setOffers(before) },
    })
  }

  const branchName = BRANCHES.find((b) => b.id === branch)?.name ?? ""

  return (
    <SectionShell
      lead={
        <>
          What the assistant proposes when a customer asks to buy or sell. Rules are checked top to bottom; the first two
          that match are suggested in the assistant panel, and the staff member accepts them before the reply is written.
          Prices always come from the live product table.
        </>
      }
      stage="building"
      title="Assistant offers"
    >
      <Tabs onValueChange={(v) => setBranch(v as BranchId)} value={branch}>
        <TabsList className={UNDERLINE_TAB_LIST}>
          {BRANCHES.map((b) => (
            <TabsTrigger className={UNDERLINE_TAB} key={b.id} value={b.id}>
              {b.name}
              <span className="ms-1 text-muted-foreground text-xs tabular-nums">{routes[b.id].length}</span>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,600px)_minmax(0,1fr)]">
        <RoutingRules
          description={
            branch === "all"
              ? "Applies at every branch. Checked top to bottom; the first two matches are suggested."
              : `Checked before the All branches rules, for ${branchName} only.`
          }
          destinations={offers}
          fallback={fallbacks[branch]}
          fields={requestFields}
          history={requestHistory}
          key={branch}
          onChange={(next: Route[], fallback: string) => {
            setRoutes((r) => ({ ...r, [branch]: next }))
            setFallbacks((f) => ({ ...f, [branch]: fallback }))
            markChanged("Assistant offers")
          }}
          routes={routes[branch]}
          sampleResponse={sampleRequest}
          showSql={false}
          title={`Offer rules · ${branchName}`}
          wording={{
            route: "Offer",
            add: "Add offer rule",
            otherwise: "Otherwise offer",
            everyone: "Always offer",
            testTitle: "Test a request",
            testHint: "Change the request to see which offer it gets",
            fallback: "the fallback",
          }}
        />

        <div className="flex min-w-0 flex-col gap-4">
          <div className="flex flex-col overflow-hidden rounded-2xl border bg-card text-sm">
            <div className="flex items-center justify-between gap-3 px-4 pt-3.5 pb-2">
              <div>
                <h3 className="font-medium">Offers you can make</h3>
                <p className="text-muted-foreground text-xs">Each rule points at one of these.</p>
              </div>
              <Button onClick={() => setEditing({ ...emptyDraft })} size="sm" variant="outline">
                <PlusIcon /> New offer
              </Button>
            </div>
            <ul className="flex flex-col">
              {offers.map((o) => (
                <li className="flex items-start gap-3 border-t px-4 py-2.5" key={o.id}>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-[13px]">{o.name}</p>
                    <p className="text-muted-foreground text-xs">{o.detail}</p>
                  </div>
                  {used(o.id) && <span className="mt-0.5 shrink-0 rounded-full bg-success/10 px-2 py-0.5 text-[11px] text-success-foreground">In use</span>}
                  <Button
                    aria-label={`Edit ${o.name}`}
                    className="size-8"
                    onClick={() => setEditing(drafts[o.id] ?? { ...emptyDraft, id: o.id })}
                    size="icon"
                    variant="ghost"
                  >
                    <PencilIcon />
                  </Button>
                  <Button
                    aria-label={`Delete ${o.name}`}
                    className="size-8"
                    disabled={used(o.id)}
                    onClick={() => removeOffer(o)}
                    size="icon"
                    title={used(o.id) ? "Used by a rule; change the rule first" : undefined}
                    variant="ghost"
                  >
                    <Trash2Icon />
                  </Button>
                </li>
              ))}
            </ul>
          </div>

          <AssistantPreview />

          <Note title="Premium limits still apply">
            An offer at a reduced premium is never quoted below the product's lowest premium. Anything lower needs a
            manager, and the assistant says so in the staff notes, not to the customer.
          </Note>
        </div>
      </div>

      <OfferDialog draft={editing} onClose={() => setEditing(null)} onSave={saveOffer} />
    </SectionShell>
  )
}

/** A static picture of how the suggestions will appear in the assistant panel before the reply is written. */
function AssistantPreview() {
  return (
    <div className="flex flex-col gap-2 rounded-2xl border bg-card p-4 text-sm">
      <div className="flex items-center gap-2">
        <SparklesIcon className="size-4 text-primary-text" />
        <h3 className="font-medium">In the assistant panel</h3>
        <span className="ms-auto text-muted-foreground text-xs">Preview</span>
      </div>
      <p className="text-muted-foreground text-xs">"hi, i want to buy gold, around 5k" (example)</p>
      <div className="flex flex-col gap-1.5 rounded-xl border bg-muted/30 p-2.5">
        <p className="font-medium text-xs">Suggested for this request</p>
        {["1× 1oz gold bar + 3× 10g gold bar", "1oz Maple Leaf first (Dublin)"].map((s) => (
          <div className="flex items-center gap-2 rounded-lg border bg-background px-2.5 py-1.5" key={s}>
            <span className="min-w-0 flex-1 truncate text-xs">{s}</span>
            <Button className="h-6 px-2 text-xs" size="sm" variant="outline">
              Use
            </Button>
            <Button className="h-6 px-2 text-xs" size="sm" variant="ghost">
              Skip
            </Button>
          </div>
        ))}
        <p className="text-[11px] text-muted-foreground">The reply is written only after the staff member chooses.</p>
      </div>
    </div>
  )
}

function OfferDialog({ draft, onClose, onSave }: { draft: OfferDraft | null; onClose: () => void; onSave: (d: OfferDraft) => void }) {
  return (
    <Dialog onOpenChange={(open) => !open && onClose()} open={draft !== null}>
      <DialogContent className="max-w-lg">
        {draft && <OfferForm initial={draft} onCancel={onClose} onSave={onSave} />}
      </DialogContent>
    </Dialog>
  )
}

function OfferForm({ initial, onSave, onCancel }: { initial: OfferDraft; onSave: (d: OfferDraft) => void; onCancel: () => void }) {
  const [d, setD] = useState(initial)
  const set = <K extends keyof OfferDraft>(key: K, value: OfferDraft[K]) => setD((x) => ({ ...x, [key]: value }))
  const needsOther = d.kind === "swap" || d.kind === "mix"
  const needsPremium = d.kind !== "manager" && d.kind !== "mix"
  const preview = describeOffer(d)

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={(e) => {
        e.preventDefault()
        onSave(d)
      }}
    >
      <DialogHeader>
        <DialogTitle>{initial.id ? "Edit offer" : "New offer"}</DialogTitle>
        <DialogDescription>An offer is what the assistant suggests when a rule matches.</DialogDescription>
      </DialogHeader>

      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Kind of offer" id="offer-kind">
          <Select onValueChange={(v) => set("kind", v as OfferKind)} value={d.kind}>
            <SelectTrigger className="w-full" id="offer-kind">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {OFFER_KINDS.map((k) => (
                <SelectItem key={k.value} value={k.value}>
                  {k.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        {d.kind !== "manager" && (
          <Field label={d.kind === "swap" ? "Instead of" : d.kind === "mix" ? "Main product" : "Product"} id="offer-product">
            <ProductSelect id="offer-product" onChange={(v) => set("product", v)} value={d.product} />
          </Field>
        )}

        {needsOther && (
          <Field label={d.kind === "swap" ? "Offer" : "Top up with"} id="offer-other">
            <ProductSelect id="offer-other" onChange={(v) => set("other", v)} value={d.other} />
          </Field>
        )}

        {(d.kind === "offer" || d.kind === "swap") && (
          <Field label="Quantity" id="offer-qty">
            <Input
              id="offer-qty"
              min={1}
              onChange={(e) => set("quantity", Math.max(1, Number(e.target.value) || 1))}
              type="number"
              value={d.quantity}
            />
          </Field>
        )}

        {needsPremium && (
          <Field label="Premium" id="offer-premium">
            <Select onValueChange={(v) => set("premium", v as PremiumMode)} value={d.premium}>
              <SelectTrigger className="w-full" id="offer-premium">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PREMIUM_MODES.map((m) => (
                  <SelectItem key={m.value} value={m.value}>
                    {m.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        )}

        {needsPremium && d.premium === "match" && (
          <Field label="Use the premium of" id="offer-match">
            <ProductSelect id="offer-match" onChange={(v) => set("matchProduct", v)} value={d.matchProduct} />
          </Field>
        )}

        {needsPremium && d.premium === "fixed" && (
          <Field label="Premium (%)" id="offer-fixed">
            <Input
              id="offer-fixed"
              inputMode="decimal"
              onChange={(e) => set("fixedPremium", e.target.value.replace(/[^0-9.]/g, ""))}
              value={d.fixedPremium}
            />
          </Field>
        )}
      </div>

      {d.kind !== "manager" && (
        <MoneyInput
          currencies={[{ code: "EUR", locale: "en-IE", name: "Euro" }]}
          defaultCurrency="EUR"
          label="Only for budgets up to (optional)"
          onValueChange={(v) => set("maxBudget", v)}
          value={d.maxBudget}
        />
      )}

      <div className="rounded-lg border bg-muted/30 px-3 py-2 text-xs">
        <p className="font-medium">{preview.name}</p>
        <p className="text-muted-foreground">{preview.detail}</p>
      </div>

      <DialogFooter>
        <Button onClick={onCancel} type="button" variant="ghost">
          Cancel
        </Button>
        <Button type="submit">{initial.id ? "Save offer" : "Add offer"}</Button>
      </DialogFooter>
    </form>
  )
}

function Field({ label, id, children }: { label: string; id: string; children: React.ReactNode }) {
  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      {children}
    </div>
  )
}

function ProductSelect({ id, value, onChange }: { id: string; value: string; onChange: (v: string) => void }) {
  return (
    <Select onValueChange={onChange} value={value}>
      <SelectTrigger className="w-full" id={id}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {PRODUCTS.map((p) => (
          <SelectItem key={p.id} value={p.id}>
            {p.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
