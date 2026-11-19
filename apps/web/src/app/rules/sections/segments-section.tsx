import { useRef } from "react"
import { SegmentBuilder, type SegmentPerson } from "../devl/segment-builder"
import { customerFields, exampleCustomers, initialSegments } from "../data"
import { useEditHandler } from "../hub-context"
import { Note, SectionShell } from "../components/section-shell"

const euro = new Intl.NumberFormat("en-IE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 })

const describe = (p: SegmentPerson) => `${euro.format(Number(p.spent12m))} · ${p.trades12m} trades · ${p.daysSinceLast} days ago`

export function SegmentsSection() {
  const edited = useEditHandler("Customer segments")
  // The builder reports the segment after every render that changes its query object, including its first ones; count
  // a change only when the name or rules differ from what each builder first reported.
  const first = useRef<Record<string, string>>({})
  const onSegment = (id: string) => (segment: { name: string; query: unknown }) => {
    const shape = JSON.stringify([segment.name, segment.query])
    first.current[id] ??= shape
    if (first.current[id] !== shape) edited()
  }
  return (
    <SectionShell
      lead={
        <>
          Name a group of customers once ("VIP: spent €50,000 or more in 12 months") and use it in offers and price rules.
          The assistant only ever sees the segment's name, never the customer.
        </>
      }
      stage="later"
      title="Customer segments"
    >
      <Note title="Example customers" tone="warn">
        The people below are invented for the preview. Segments go live with the customer history view.
      </Note>
      <div className="grid min-w-0 gap-4 xl:grid-cols-2">
        {initialSegments.map((s) => (
          <SegmentBuilder
            defaultName={s.name}
            defaultQuery={s.query}
            describe={describe}
            fields={customerFields}
            key={s.id}
            onChange={onSegment(s.id)}
            people={exampleCustomers}
          />
        ))}
      </div>
    </SectionShell>
  )
}
