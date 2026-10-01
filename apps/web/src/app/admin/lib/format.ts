const hourFormat = new Intl.DateTimeFormat("en-IE", { hour: "2-digit", minute: "2-digit", hour12: false })
const dateTimeFormat = new Intl.DateTimeFormat("en-IE", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false })

export const formatHour = (iso: string) => hourFormat.format(new Date(iso))
export const formatDateTime = (value: string | number) => dateTimeFormat.format(new Date(value))

export function formatBytes(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`
    const units = ["KB", "MB", "GB", "TB"]
    let value = bytes / 1024
    let unit = 0
    while (value >= 1024 && unit < units.length - 1) {
        value /= 1024
        unit++
    }
    return `${value >= 100 ? Math.round(value) : value.toFixed(1)} ${units[unit]}`
}

export function formatUptime(seconds: number): string {
    const days = Math.floor(seconds / 86400)
    const hours = Math.floor((seconds % 86400) / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    if (days > 0) return `${days}d ${hours}h`
    if (hours > 0) return `${hours}h ${minutes}m`
    return `${minutes}m`
}

export const formatCount = (n: number) => n.toLocaleString("en-IE")
