import * as React from "react"

/** Matches the backend cron's CronExpression.EVERY_10_MINUTES (clock-aligned to :00/:10/:20…, not "10 minutes after the last fetch"), so this needs no data from the server — just the current time. */
const CRON_INTERVAL_MS = 10 * 60 * 1000

function msUntilNextMark(): number {
    return CRON_INTERVAL_MS - (Date.now() % CRON_INTERVAL_MS)
}

/** Ticking countdown to the next scheduled price-refresh cron run. Purely a clock computation — doesn't know or care whether an admin has actually paused the cron (see the Admin Panel), it just reflects when it WOULD normally fire. */
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
