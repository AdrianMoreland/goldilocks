import * as React from "react"
import { SPOT_FETCH_INTERVAL_MS } from "@goldilocks/shared-types"

/** Matches the backend cron's CronExpression.EVERY_5_MINUTES (clock-aligned to :00/:05/:10…, not "5 minutes after the last fetch"), so this needs no data from the server - just the current time. */
const CRON_INTERVAL_MS = SPOT_FETCH_INTERVAL_MS

function msUntilNextMark(): number {
    return CRON_INTERVAL_MS - (Date.now() % CRON_INTERVAL_MS)
}

/** Ticking countdown to the next scheduled price-refresh cron run. Purely a clock computation: callers hide it while the cron is paused (the market data says so). */
export function useNextFetchCountdown() {
    const [msRemaining, setMsRemaining] = React.useState(msUntilNextMark)

    React.useEffect(() => {
        const id = setInterval(() => setMsRemaining(msUntilNextMark()), 1000)
        return () => clearInterval(id)
    }, [])

    const totalSeconds = Math.max(0, Math.round(msRemaining / 1000))
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60

    return `${minutes}:${seconds.toString().padStart(2, "0")}`
}
