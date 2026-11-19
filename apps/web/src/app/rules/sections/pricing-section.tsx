import { CronBuilder } from "../devl/cron-builder"
import { FlagTargeting } from "../devl/flag-targeting"
import { initialPriceRules, MARKET_MODES, modeSchedules, premiumVariants, productFields, productRows } from "../data"
import { useEditHandler, useHub } from "../hub-context"
import { Note, SectionShell } from "../components/section-shell"

export function PricingSection() {
  const { toasts } = useHub()
  const edited = useEditHandler("Price rules")
  return (
    <SectionShell
      lead={
        <>
          Premiums set by rules instead of typed per product: "gold bars of 100g and over get 3.50%". Each market mode has
          its own tab, so Weekend, Volatile and Shortage become sets of rules rather than code. Products no rule matches
          keep their own premium.
        </>
      }
      stage="later"
      title="Price rules"
    >
      <Note title="Not before the pricing snapshot work" tone="warn">
        These rules would change every price on the dashboard. They wait for "Snapshot full pricing context on any
        committed price", and publishing them will need a manager to confirm a before-and-after list.
      </Note>
      <div className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,580px)_minmax(0,1fr)]">
        <FlagTargeting
          environments={MARKET_MODES}
          fields={productFields}
          flagKey="sell-premiums"
          flagName="Sell premiums"
          onChange={edited}
          population={productRows}
          showRollout={false}
          targeting={initialPriceRules}
          variants={premiumVariants}
          wording={{
            rulesTitle: "Premium rules",
            rulesHint: "First match wins",
            unit: ["product", "products"],
            offTitle: "When this mode's rules are off",
            offHint: "Every product gets this.",
            distributionTitle: "Premiums across the catalogue",
            serves: "Prices",
            everyoneElseGets: "keeps",
            serveVerb: "Set",
          }}
        />
        <div className="flex min-w-0 flex-col gap-3">
          <div className="flex flex-col gap-1">
            <h3 className="font-medium text-sm">Switch modes on a schedule</h3>
            <p className="text-muted-foreground text-xs">Optional: turn Weekend mode on and off at set times instead of by hand.</p>
          </div>
          <CronBuilder
            defaultValue="0 18 * * 5"
            onChange={(_expression, valid) => {
              if (valid) edited()
            }}
            presets={modeSchedules}
          />
          <button
            className="self-start text-primary-text text-xs underline-offset-4 hover:underline"
            onClick={() => toasts.show({ title: "Schedule kept as a draft", tone: "info", duration: 3000 })}
            type="button"
          >
            Keep this schedule as a draft
          </button>
        </div>
      </div>
    </SectionShell>
  )
}
