import { useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { Monitor, Moon, Sun } from "lucide-react"
import { NOTIFICATION_KINDS, NOTIFICATION_LABELS, renderQuoteText, type CompanyQuoteTemplate } from "@goldilocks/shared-types"
import { useMyPreferences, useSettingsApi } from "@/api/settings.api"
import { BaseLayout } from "@/components/layouts/base-layout"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Kbd } from "@/components/ui/kbd"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { tweakcnThemes } from "@/config/theme-data"
import { useAuth } from "@/contexts/auth-context"
import { useThemeEditorDock } from "@/contexts/docks-context"
import { useThemePreference } from "@/contexts/theme-preference-context"
import { useTheme } from "@/hooks/use-theme"
import { readDensity, saveDensity, type Density } from "@/lib/density"
import { queryKeys } from "@/lib/query-keys"

const SECTIONS = [
    { id: "profile", label: "Profile & preferences" },
    { id: "quoting", label: "Quoting defaults" },
    { id: "shortcuts", label: "Keyboard shortcuts" },
    { id: "branch", label: "My branch & board" },
    { id: "notifications", label: "Notifications", adminOnly: true },
    { id: "security", label: "Security & sessions" },
    { id: "theme", label: "Theme" },
] as const

/**
 * Settings: one page, saved on the account so it follows each person to any browser. Company-wide switches
 * (market modes, thresholds) stay in Admin.
 */
export default function SettingsPage() {
    const { isAdmin } = useAuth()
    const sections = SECTIONS.filter((s) => !("adminOnly" in s) || isAdmin)
    return (
        <BaseLayout title="Settings" description="Your preferences, saved on your account">
            <div className="grid gap-6 px-4 lg:grid-cols-[200px_1fr] lg:px-6">
                <nav aria-label="Settings sections" className="hidden lg:block">
                    <ul className="sticky top-4 space-y-1 text-sm">
                        {sections.map((s) => (
                            <li key={s.id}>
                                <a href={`#${s.id}`} className="text-muted-foreground hover:text-foreground block rounded px-2 py-1">
                                    {s.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>
                <div className="min-w-0 space-y-4">
                    <ProfileSection />
                    <QuotingSection />
                    <ShortcutsSection />
                    <BranchSection />
                    {isAdmin && <NotificationsSection />}
                    <SecuritySection />
                    <ThemeSection />
                </div>
            </div>
        </BaseLayout>
    )
}

function Section({ id, title, description, children }: { id: string; title: string; description?: string; children: React.ReactNode }) {
    return (
        <Card id={id} className="min-w-0 scroll-mt-4 gap-3 py-4">
            <CardHeader className="px-4">
                <CardTitle className="text-base">{title}</CardTitle>
                {description && <CardDescription>{description}</CardDescription>}
            </CardHeader>
            <CardContent className="space-y-4 px-4">{children}</CardContent>
        </Card>
    )
}

function Row({ label, hint, htmlFor, children }: { label: string; hint?: string; htmlFor?: string; children: React.ReactNode }) {
    return (
        <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="min-w-0">
                <Label htmlFor={htmlFor}>{label}</Label>
                {hint && <p className="text-muted-foreground text-xs">{hint}</p>}
            </div>
            {children}
        </div>
    )
}

function ProfileSection() {
    const { user } = useAuth()
    const { prefs, save } = useMyPreferences()
    return (
        <Section id="profile" title="Profile & preferences" description="Your name and role are set by an admin in Admin → People.">
            <dl className="grid gap-x-6 gap-y-1 text-sm sm:grid-cols-[auto_1fr]">
                <dt className="text-muted-foreground">Name</dt>
                <dd>{user ? `${user.firstName} ${user.lastName}` : "–"}</dd>
                <dt className="text-muted-foreground">Email</dt>
                <dd>{user?.email}</dd>
                <dt className="text-muted-foreground">Role</dt>
                <dd>{user ? user.role.charAt(0) + user.role.slice(1).toLowerCase() : "–"}{user?.admin && user.role !== "ADMIN" ? " · admin access" : ""}</dd>
            </dl>
            <Row label="Detail level" hint="Simple shows the essentials; Detailed adds tables and secondary figures on pages that support it.">
                <ToggleGroup type="single" variant="outline" size="sm" value={prefs.detail} onValueChange={(v) => v && save({ detail: v as typeof prefs.detail })} aria-label="Detail level">
                    <ToggleGroupItem value="simple" className="flex-none px-3">Simple</ToggleGroupItem>
                    <ToggleGroupItem value="detailed" className="flex-none px-3">Detailed</ToggleGroupItem>
                </ToggleGroup>
            </Row>
        </Section>
    )
}

const SAMPLE = { name: "Maeve", spot_time: "14:05" }

function QuotingSection() {
    const { isAdmin, user } = useAuth()
    const { prefs, save } = useMyPreferences()
    const [signOff, setSignOff] = useState<string | null>(null)
    return (
        <Section id="quoting" title="Quoting defaults" description="Used when you copy a WhatsApp or email message from the price table.">
            <Row label="Default channel" htmlFor="q-channel">
                <Select value={prefs.quote.defaultChannel ?? "ask"} onValueChange={(v) => save({ quote: { ...prefs.quote, defaultChannel: v === "ask" ? null : (v as "whatsapp" | "email") } })}>
                    <SelectTrigger id="q-channel" className="w-40"><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ask">Ask each time</SelectItem>
                        <SelectItem value="whatsapp">WhatsApp</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                    </SelectContent>
                </Select>
            </Row>
            <div className="space-y-1.5">
                <Label htmlFor="q-signoff">Your sign-off</Label>
                <Textarea
                    id="q-signoff"
                    rows={2}
                    maxLength={300}
                    value={signOff ?? prefs.quote.signOff}
                    onChange={(e) => setSignOff(e.target.value)}
                    onBlur={() => signOff !== null && signOff !== prefs.quote.signOff && save({ quote: { ...prefs.quote, signOff: signOff.trim() } })}
                    placeholder={`Kind regards,\n${user?.firstName ?? ""}, Merrion Gold`}
                />
                <p className="text-muted-foreground text-xs">Added at the end of every message you copy. Saved when you leave the box.</p>
            </div>
            {isAdmin && <CompanyTemplate />}
        </Section>
    )
}

function CompanyTemplate() {
    const api = useSettingsApi()
    const client = useQueryClient()
    const current = useQuery({ queryKey: queryKeys.settings.quoteTemplate, queryFn: api.quoteTemplate })
    const [draft, setDraft] = useState<CompanyQuoteTemplate | null>(null)
    const value = draft ?? current.data ?? { opening: null, closingNote: null }
    const save = useMutation({
        mutationFn: () => api.saveQuoteTemplate({ opening: value.opening?.trim() || null, closingNote: value.closingNote?.trim() || null }),
        onSuccess: () => {
            toast.success("Company wording saved")
            setDraft(null)
            void client.invalidateQueries({ queryKey: queryKeys.settings.quoteTemplate })
        },
        onError: (e) => toast.error(e instanceof Error ? e.message : "Couldn't save the wording."),
    })
    return (
        <div className="space-y-3 rounded-md border p-3">
            <div>
                <p className="text-sm font-medium">Company wording <Badge variant="outline" className="ml-1">Admin</Badge></p>
                <p className="text-muted-foreground text-xs">
                    Everyone&apos;s messages use these around the price lines. Leave a box empty to keep the built-in text. Placeholders: <code>{"{name}"}</code> (who copies it), <code>{"{spot_time}"}</code> (when prices were struck).
                </p>
            </div>
            <div className="space-y-1.5">
                <Label htmlFor="q-open">Opening line</Label>
                <Input id="q-open" value={value.opening ?? ""} onChange={(e) => setDraft({ ...value, opening: e.target.value })} placeholder="Hello, thank you for your interest in Merrion Gold." />
                {value.opening && <p className="text-muted-foreground text-xs">Preview: {renderQuoteText(value.opening, SAMPLE)}</p>}
            </div>
            <div className="space-y-1.5">
                <Label htmlFor="q-close">Closing note</Label>
                <Textarea id="q-close" rows={2} value={value.closingNote ?? ""} onChange={(e) => setDraft({ ...value, closingNote: e.target.value })} />
            </div>
            <div className="flex justify-end gap-2">
                {draft && <Button type="button" variant="outline" size="sm" onClick={() => setDraft(null)}>Discard</Button>}
                <Button type="button" size="sm" disabled={!draft || save.isPending} onClick={() => save.mutate()}>{save.isPending ? "Saving…" : "Save wording"}</Button>
            </div>
        </div>
    )
}

const SHORTCUTS: { keys: string[]; what: string; single?: boolean }[] = [
    { keys: ["Ctrl", "K"], what: "Search everything (command palette)" },
    { keys: ["/"], what: "Search products in the price table", single: true },
    { keys: ["1", "–", "4"], what: "Switch metal: gold, silver, platinum, palladium", single: true },
    { keys: ["P"], what: "Flip between Price and Buyback", single: true },
    { keys: ["Q"], what: "Jump to the quantity box", single: true },
    { keys: ["T"], what: "Show or hide the tools panel", single: true },
    { keys: ["G"], what: "Show or hide the chart", single: true },
    { keys: ["A"], what: "Open Admin (admins)", single: true },
    { keys: ["↑", "↓"], what: "Move between rows in a table" },
    { keys: ["Enter"], what: "Open the selected row" },
    { keys: ["Ctrl", "Z"], what: "Unfreeze every metal and untick the selected rows" },
]

function ShortcutsSection() {
    const { prefs, save } = useMyPreferences()
    return (
        <Section id="shortcuts" title="Keyboard shortcuts" description="On the Pricing page. Shortcuts never fire while you type in a box.">
            <Row label="Single-key shortcuts" hint="Turn off if you type into the page without clicking a box first." htmlFor="s-single">
                <Switch id="s-single" checked={prefs.singleKeyShortcuts} onCheckedChange={(v) => save({ singleKeyShortcuts: v })} />
            </Row>
            <ul className="divide-y text-sm">
                {SHORTCUTS.map((s) => (
                    <li key={s.what} className={`flex items-center justify-between gap-3 py-2 ${s.single && !prefs.singleKeyShortcuts ? "opacity-50" : ""}`}>
                        <span>{s.what}</span>
                        <span className="flex shrink-0 gap-1">{s.keys.map((k) => (k === "–" ? <span key={k} className="text-muted-foreground">to</span> : <Kbd key={k}>{k}</Kbd>))}</span>
                    </li>
                ))}
            </ul>
        </Section>
    )
}

function BranchSection() {
    const { user } = useAuth()
    const { prefs, save } = useMyPreferences()
    return (
        <Section id="branch" title="My branch & board" description="Your branch is set by an admin. Price board choices follow you to every screen you sign in on.">
            <Row label="Branch">
                <span className="text-sm">{user?.branch?.name ?? "No branch (treated as an Irish branch)"}</span>
            </Row>
            <Row label="Price board opens on" htmlFor="b-view">
                <Select value={prefs.board.view} onValueChange={(v) => save({ board: { ...prefs.board, view: v } })}>
                    <SelectTrigger id="b-view" className="w-40"><SelectValue /></SelectTrigger>
                    <SelectContent>
                        {["GOLD", "SILVER", "PLATINUM", "PALLADIUM"].map((m) => <SelectItem key={m} value={m}>{m.charAt(0) + m.slice(1).toLowerCase()}</SelectItem>)}
                        <SelectItem value="auto">Each metal in turn</SelectItem>
                    </SelectContent>
                </Select>
            </Row>
            <Row label="Pinned products" hint="Pin or unpin on the price board itself.">
                <span className="text-sm tabular-nums">{prefs.board.pins.length || "None"}</span>
            </Row>
        </Section>
    )
}

function NotificationsSection() {
    const { prefs, save } = useMyPreferences()
    const muted = new Set(prefs.notifications.muted)
    return (
        <Section id="notifications" title="Notifications" description="In the app only, under the bell at the top. For admins for now.">
            {NOTIFICATION_KINDS.map((k) => (
                <Row key={k} label={NOTIFICATION_LABELS[k]} htmlFor={`n-${k}`}>
                    <Switch
                        id={`n-${k}`}
                        checked={!muted.has(k)}
                        onCheckedChange={(on) => save({ notifications: { muted: on ? [...muted].filter((x) => x !== k) : [...muted, k] } })}
                    />
                </Row>
            ))}
        </Section>
    )
}

const ago = new Intl.RelativeTimeFormat("en-IE", { numeric: "auto" })
function since(iso: string) {
    const mins = Math.round((Date.now() - new Date(iso).getTime()) / 60_000)
    if (mins < 60) return ago.format(-mins, "minute")
    if (mins < 48 * 60) return ago.format(-Math.round(mins / 60), "hour")
    return ago.format(-Math.round(mins / 1440), "day")
}

function SecuritySection() {
    const api = useSettingsApi()
    const { user } = useAuth()
    const client = useQueryClient()
    const key = queryKeys.settings.sessions(user?.id ?? "")
    const sessions = useQuery({ queryKey: key, queryFn: api.sessions, enabled: !!user })
    const refresh = () => client.invalidateQueries({ queryKey: key })
    const one = useMutation({ mutationFn: api.signOut, onSuccess: () => toast.success("Signed out that device"), onError: () => toast.error("Couldn't sign that device out."), onSettled: refresh })
    const others = useMutation({ mutationFn: api.signOutOthers, onSuccess: () => toast.success("Signed out everywhere else"), onError: () => toast.error("Couldn't sign the other devices out."), onSettled: refresh })
    const otherCount = (sessions.data ?? []).filter((s) => !s.current).length
    return (
        <Section id="security" title="Security & sessions" description="Every browser where you are signed in. Signing one out ends it on its next click.">
            {sessions.isError ? (
                <p role="alert" className="text-destructive text-sm">Couldn&apos;t load your sessions. Try again in a moment.</p>
            ) : (
                <ul className="divide-y text-sm">
                    {(sessions.data ?? []).map((s) => (
                        <li key={s.id} className="flex flex-wrap items-center justify-between gap-3 py-2">
                            <span className="flex min-w-0 items-center gap-2">
                                <Monitor className="text-muted-foreground size-4 shrink-0" aria-hidden />
                                <span className="min-w-0">
                                    <span className="font-medium">{s.device}</span>
                                    {s.current && <Badge variant="outline" className="ml-2">This device</Badge>}
                                    <span className="text-muted-foreground block text-xs">Active {since(s.lastActiveAt)}{s.ip ? ` · ${s.ip}` : ""}</span>
                                </span>
                            </span>
                            {!s.current && sessions.data?.some((x) => x.current) && (
                                <Button type="button" variant="outline" size="sm" disabled={one.isPending} onClick={() => one.mutate(s.id)}>Sign out</Button>
                            )}
                        </li>
                    ))}
                </ul>
            )}
            <div className="flex justify-end">
                <Button type="button" variant="outline" size="sm" disabled={otherCount === 0 || others.isPending} onClick={() => others.mutate()}>
                    Sign out everywhere else{otherCount ? ` (${otherCount})` : ""}
                </Button>
            </div>
        </Section>
    )
}

function ThemeSection() {
    const { isAdmin } = useAuth()
    const { preference, update } = useThemePreference()
    const { theme, setTheme } = useTheme()
    const dock = useThemeEditorDock()
    // The same row-size switch as the user menu.
    const [density, setDensity] = useState<Density>(readDensity)
    return (
        <Section id="theme" title="Theme" description={isAdmin ? "Pick a preset, or open the full builder to change colours, fonts and radius." : "Pick a preset, day or night, and how dense the pages are."}>
            <Row label="Preset" htmlFor="t-preset">
                <Select value={preference.source === "tweakcn" ? preference.value : ""} onValueChange={(v) => update({ source: "tweakcn", value: v, imported: null })}>
                    <SelectTrigger id="t-preset" className="w-48"><SelectValue placeholder="Custom" /></SelectTrigger>
                    <SelectContent>
                        {tweakcnThemes.map((t) => <SelectItem key={t.value} value={t.value}>{t.name}</SelectItem>)}
                    </SelectContent>
                </Select>
            </Row>
            <Row label="Day or night">
                <ToggleGroup type="single" variant="outline" size="sm" value={theme === "dark" ? "dark" : "light"} onValueChange={(v) => v && setTheme(v as "light" | "dark")} aria-label="Day or night">
                    <ToggleGroupItem value="light" className="flex-none px-3"><Sun aria-hidden /> Day</ToggleGroupItem>
                    <ToggleGroupItem value="dark" className="flex-none px-3"><Moon aria-hidden /> Night</ToggleGroupItem>
                </ToggleGroup>
            </Row>
            <Row label="Density">
                <ToggleGroup
                    type="single"
                    variant="outline"
                    size="sm"
                    value={density}
                    onValueChange={(v) => {
                        if (!v) return
                        saveDensity(v as Density)
                        setDensity(v as Density)
                    }}
                    aria-label="Density"
                >
                    <ToggleGroupItem value="compact" className="flex-none px-3">Compact</ToggleGroupItem>
                    <ToggleGroupItem value="comfortable" className="flex-none px-3">Comfortable</ToggleGroupItem>
                </ToggleGroup>
            </Row>
            {isAdmin && (
                <div className="flex justify-end">
                    <Button type="button" variant="outline" size="sm" onClick={() => !dock.open && dock.toggle()}>Open the theme builder</Button>
                </div>
            )}
        </Section>
    )
}
