import { useState } from "react"
import { PlusIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AlertRules } from "../devl/alert-rules"
import { NotificationMatrix } from "../devl/notification-matrix"
import {
  alertActions,
  alertFields,
  alertMetrics,
  initialAlerts,
  notificationDefaults,
  notificationGroups,
  priceEpisodes,
  type AlertCardConfig,
} from "../data"
import { useHub } from "../hub-context"
import { Note, SectionShell } from "../components/section-shell"

export function AlertsSection() {
  const { toasts } = useHub()
  const [alerts, setAlerts] = useState<AlertCardConfig[]>(initialAlerts)

  const addAlert = () => {
    const id = `a${Date.now().toString(36)}`
    setAlerts((list) => [
      ...list,
      {
        id,
        name: "New price alert",
        trigger: { metric: "goldMove", operator: "gte", threshold: 2, minutes: 0 },
        scope: { kind: "group", combinator: "and", children: [] },
        action: "me-app",
      },
    ])
    toasts.show({ title: "Alert added", description: "Edit it below; it is off until you publish.", tone: "info", duration: 4000 })
  }

  return (
    <SectionShell
      actions={
        <Button onClick={addAlert} size="sm" variant="outline">
          <PlusIcon /> New alert
        </Button>
      }
      lead={
        <>
          Tell me when gold crosses a price, moves sharply, or a premium gets close to its limit. Each alert is checked on
          the server at every price update, and the timeline shows how often it would have fired over the last 30 days
          (example price history here).
        </>
      }
      stage="next"
      title="Price alerts"
    >
      <div className="grid min-w-0 gap-4 lg:grid-cols-2">
        {alerts.map((a) => (
          <AlertRules
            actions={alertActions}
            defaultAction={a.action}
            defaultName={a.name}
            defaultScope={a.scope}
            defaultTrigger={a.trigger}
            durationField="minutes"
            fields={alertFields}
            incidents={priceEpisodes}
            key={a.id}
            metrics={alertMetrics}
          />
        ))}
      </div>
      <div className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,320px)]">
        <NotificationMatrix
          defaultValue={notificationDefaults}
          description="Choose where each alert reaches you. Shared alerts follow each person's own choice."
          groups={notificationGroups}
          onSave={async () => {
            await new Promise((r) => setTimeout(r, 500))
            toasts.show({ title: "Notification settings saved", tone: "success", duration: 3000 })
          }}
          title="Where alerts go"
        />
        <Note title="Personal and shared alerts">
          Anyone can keep their own alerts. Alerts shared with a branch (like "premium close to its limit") are created by
          managers and admins. Email delivery comes with the notifications table; push comes later.
        </Note>
      </div>
    </SectionShell>
  )
}
