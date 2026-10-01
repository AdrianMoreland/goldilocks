import * as React from "react"
import { useQuery } from "@tanstack/react-query"
import { toast } from "sonner"
import { Copy, Loader2, Lock, Play, Search } from "lucide-react"
import type { ApiEndpoint } from "@goldilocks/shared-types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { API_URL } from "@/api/base"
import { useAdminApi } from "@/api/admin.api"
import { queryKeys } from "@/lib/query-keys"
import { cn } from "@/lib/utils"
import { Panel, PanelEmpty } from "../panel"
import { formatBytes } from "../../lib/format"

const METHOD_STYLE: Record<ApiEndpoint["method"], string> = {
    GET: "text-emerald-700 dark:text-emerald-400",
    POST: "text-primary-text",
    PUT: "text-amber-700 dark:text-amber-400",
    PATCH: "text-amber-700 dark:text-amber-400",
    DELETE: "text-destructive",
}

function MethodTag({ method }: { method: ApiEndpoint["method"] }) {
    return <span className={cn("w-12 shrink-0 text-[11px] font-bold", METHOD_STYLE[method])}>{method}</span>
}

interface SentResponse {
    status: number
    statusText: string
    ms: number
    bytes: number
    headers: [string, string][]
    body: string
    error?: string
}

const endpointId = (e: ApiEndpoint) => `${e.method} ${e.path}`

function buildUrl(endpoint: ApiEndpoint, pathValues: Record<string, string>, queryValues: Record<string, string>): string {
    const path = endpoint.path.replace(/\{(\w+)\}/g, (_, name: string) => encodeURIComponent(pathValues[name] ?? `{${name}}`))
    const query = new URLSearchParams()
    for (const [key, value] of Object.entries(queryValues)) if (value !== "") query.set(key, value)
    const qs = query.toString()
    return `${API_URL}${path}${qs ? `?${qs}` : ""}`
}

function prettyBody(text: string, contentType: string | null): string {
    if (!contentType?.includes("json")) return text
    try {
        return JSON.stringify(JSON.parse(text), null, 2)
    } catch {
        return text
    }
}

function statusTone(status: number) {
    if (status >= 500) return "border-destructive/40 bg-destructive/10 text-destructive"
    if (status >= 400) return "border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-400"
    return "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
}

export function ApiTesterTab() {
    const api = useAdminApi()
    const catalogue = useQuery({ queryKey: queryKeys.admin.endpoints, queryFn: api.getEndpoints, staleTime: 5 * 60_000 })

    const [selected, setSelected] = React.useState<ApiEndpoint | null>(null)
    const [filter, setFilter] = React.useState("")

    const endpoints = catalogue.data?.endpoints
    const grouped = React.useMemo(() => {
        const term = filter.trim().toLowerCase()
        const groups = new Map<string, ApiEndpoint[]>()
        for (const e of endpoints ?? []) {
            if (term && !`${e.method} ${e.path} ${e.summary}`.toLowerCase().includes(term)) continue
            groups.set(e.tag, [...(groups.get(e.tag) ?? []), e])
        }
        return [...groups.entries()]
    }, [endpoints, filter])

    return (
        <div className="grid gap-4 lg:grid-cols-[20rem_1fr]">
            <Panel title="Endpoints" description={endpoints ? `${endpoints.length} routes` : undefined} className="lg:max-h-[calc(100svh-11rem)]">
                <div className="relative">
                    <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
                    <Input
                        placeholder="Filter by path or name"
                        aria-label="Filter endpoints"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="pl-8"
                    />
                </div>
                <div className="-mx-1 min-h-0 flex-1 overflow-y-auto px-1">
                    {catalogue.isLoading ? (
                        <div className="flex flex-col gap-2">
                            {Array.from({ length: 8 }, (_, i) => (
                                <Skeleton key={i} className="h-8" />
                            ))}
                        </div>
                    ) : catalogue.isError ? (
                        <PanelEmpty>Couldn&apos;t load the endpoint list.</PanelEmpty>
                    ) : grouped.length === 0 ? (
                        <PanelEmpty>No endpoints match.</PanelEmpty>
                    ) : (
                        grouped.map(([tag, items]) => (
                            <div key={tag} className="mb-3">
                                <div className="text-muted-foreground mb-1 text-[11px] font-bold tracking-wide uppercase">{tag}</div>
                                <ul>
                                    {items.map((e) => (
                                        <li key={endpointId(e)}>
                                            <button
                                                type="button"
                                                onClick={() => setSelected(e)}
                                                aria-current={selected !== null && endpointId(selected) === endpointId(e)}
                                                className={cn(
                                                    "hover:bg-muted/60 focus-visible:ring-ring/50 flex w-full cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs outline-none focus-visible:ring-[3px]",
                                                    selected && endpointId(selected) === endpointId(e) && "bg-muted",
                                                )}
                                            >
                                                <MethodTag method={e.method} />
                                                <span className="min-w-0 flex-1 truncate font-mono" title={e.path}>
                                                    {e.path}
                                                </span>
                                                {e.requiresAuth && <Lock className="text-muted-foreground size-3 shrink-0" aria-label="Needs sign-in" />}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))
                    )}
                </div>
            </Panel>

            {selected ? (
                <RequestPanel key={endpointId(selected)} endpoint={selected} />
            ) : (
                <Panel title="Test an endpoint">
                    <PanelEmpty>
                        Pick a route on the left. Requests are sent as you, with your own sign-in, so the server applies the same checks as it does for the app. Anything
                        that isn&apos;t a GET changes real data and asks you to confirm first.
                    </PanelEmpty>
                </Panel>
            )}
        </div>
    )
}

function RequestPanel({ endpoint }: { endpoint: ApiEndpoint }) {
    const pathParams = endpoint.parameters.filter((p) => p.in === "path")
    const queryParams = endpoint.parameters.filter((p) => p.in === "query")
    const hasBody = endpoint.bodyExample !== null && endpoint.method !== "GET"

    const [pathValues, setPathValues] = React.useState<Record<string, string>>({})
    const [queryValues, setQueryValues] = React.useState<Record<string, string>>({})
    const [body, setBody] = React.useState(() => (hasBody ? JSON.stringify(endpoint.bodyExample, null, 2) : ""))
    const [armed, setArmed] = React.useState(false)
    const [sending, setSending] = React.useState(false)
    const [response, setResponse] = React.useState<SentResponse | null>(null)

    const url = buildUrl(endpoint, pathValues, queryValues)
    const missingPath = pathParams.filter((p) => !pathValues[p.name]?.trim())
    const writes = endpoint.method !== "GET"

    let bodyProblem: string | null = null
    if (hasBody && body.trim()) {
        try {
            JSON.parse(body)
        } catch {
            bodyProblem = "The body isn't valid JSON."
        }
    }
    const blocked = missingPath.length > 0 || bodyProblem !== null

    const send = async () => {
        setArmed(false)
        setSending(true)
        const token = localStorage.getItem("token")
        const startedAt = performance.now()
        try {
            const res = await fetch(url, {
                method: endpoint.method,
                credentials: "include",
                headers: {
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                    ...(hasBody ? { "Content-Type": "application/json" } : {}),
                },
                body: hasBody && body.trim() ? body : undefined,
            })
            const text = await res.text()
            setResponse({
                status: res.status,
                statusText: res.statusText,
                ms: Math.round(performance.now() - startedAt),
                bytes: new Blob([text]).size,
                headers: [...res.headers.entries()],
                body: prettyBody(text, res.headers.get("content-type")),
            })
        } catch (error) {
            setResponse({
                status: 0,
                statusText: "",
                ms: Math.round(performance.now() - startedAt),
                bytes: 0,
                headers: [],
                body: "",
                error: error instanceof Error ? error.message : "The request failed.",
            })
        } finally {
            setSending(false)
        }
    }

    const copyCurl = () => {
        const parts = [`curl -X ${endpoint.method} '${url}'`, `-H 'Authorization: Bearer <token>'`]
        if (hasBody && body.trim()) parts.push(`-H 'Content-Type: application/json'`, `-d '${body.replace(/'/g, `'\\''`)}'`)
        void navigator.clipboard.writeText(parts.join(" \\\n  "))
        toast.success("cURL command copied (token left out)")
    }

    return (
        <div className="flex min-w-0 flex-col gap-4">
            <Panel
                title={endpoint.summary || endpoint.path}
                description={endpoint.description}
                action={
                    <Button variant="outline" size="sm" className="cursor-pointer" onClick={copyCurl}>
                        <Copy /> cURL
                    </Button>
                }
            >
                <div className="bg-muted/40 flex items-center gap-3 rounded-lg border px-3 py-2">
                    <MethodTag method={endpoint.method} />
                    <code className="min-w-0 flex-1 text-xs break-all">{url}</code>
                </div>

                {pathParams.length + queryParams.length > 0 && (
                    <div className="grid gap-3 sm:grid-cols-2">
                        {[...pathParams, ...queryParams].map((p) => {
                            const values = p.in === "path" ? pathValues : queryValues
                            const set = p.in === "path" ? setPathValues : setQueryValues
                            return (
                                <label key={`${p.in}-${p.name}`} className="flex flex-col gap-1">
                                    <span className="text-[13px] font-semibold">
                                        {p.name} <span className="text-muted-foreground font-normal">{p.in}{p.required ? ", required" : ""}</span>
                                    </span>
                                    {p.options?.length ? (
                                        <select
                                            value={values[p.name] ?? ""}
                                            onChange={(e) => set((v) => ({ ...v, [p.name]: e.target.value }))}
                                            className="border-input bg-background h-9 rounded-md border px-2 text-sm"
                                        >
                                            <option value="">{p.required ? "Choose…" : "(not set)"}</option>
                                            {p.options.map((o) => (
                                                <option key={o} value={o}>
                                                    {o}
                                                </option>
                                            ))}
                                        </select>
                                    ) : (
                                        <Input
                                            value={values[p.name] ?? ""}
                                            placeholder={p.type}
                                            onChange={(e) => set((v) => ({ ...v, [p.name]: e.target.value }))}
                                        />
                                    )}
                                </label>
                            )
                        })}
                    </div>
                )}

                {hasBody && (
                    <label className="flex flex-col gap-1">
                        <span className="text-[13px] font-semibold">JSON body</span>
                        <Textarea
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                            spellCheck={false}
                            className="min-h-40 font-mono text-xs"
                            aria-invalid={bodyProblem !== null}
                        />
                        {bodyProblem && <span className="text-destructive text-xs">{bodyProblem}</span>}
                    </label>
                )}

                <div className="flex flex-wrap items-center gap-2">
                    {armed ? (
                        <>
                            <span className="text-sm">
                                This {endpoint.method} changes real data. Send it?
                            </span>
                            <Button variant="destructive" className="cursor-pointer" onClick={() => void send()}>
                                Yes, send {endpoint.method}
                            </Button>
                            <Button variant="outline" className="cursor-pointer" onClick={() => setArmed(false)}>
                                Cancel
                            </Button>
                        </>
                    ) : (
                        <Button className="cursor-pointer" disabled={blocked || sending} onClick={() => (writes ? setArmed(true) : void send())}>
                            {sending ? <Loader2 className="animate-spin" /> : <Play />} Send
                        </Button>
                    )}
                    {missingPath.length > 0 && (
                        <span className="text-muted-foreground text-xs">Fill in {missingPath.map((p) => p.name).join(", ")} first.</span>
                    )}
                </div>
            </Panel>

            <ResponsePanel response={response} sending={sending} />
        </div>
    )
}

function ResponsePanel({ response, sending }: { response: SentResponse | null; sending: boolean }) {
    return (
        <Panel title="Response">
            {!response ? (
                <PanelEmpty>{sending ? "Waiting for the server…" : "Send the request to see the response here."}</PanelEmpty>
            ) : response.error ? (
                <p className="text-destructive text-sm">
                    No response: {response.error}. The API may be down, or the browser blocked the request (CORS).
                </p>
            ) : (
                <>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
                        <span className={cn("rounded-full border px-2.5 py-1 font-bold tabular-nums", statusTone(response.status))}>
                            {response.status} {response.statusText}
                        </span>
                        <span className="text-muted-foreground tabular-nums">{response.ms} ms</span>
                        <span className="text-muted-foreground tabular-nums">{formatBytes(response.bytes)}</span>
                    </div>
                    <Tabs defaultValue="body" className="gap-2">
                        <TabsList>
                            <TabsTrigger value="body" className="cursor-pointer px-3">
                                Body
                            </TabsTrigger>
                            <TabsTrigger value="headers" className="cursor-pointer px-3">
                                Headers ({response.headers.length})
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="body">
                            <div className="relative">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="absolute top-1.5 right-1.5 cursor-pointer"
                                    onClick={() => {
                                        void navigator.clipboard.writeText(response.body)
                                        toast.success("Response copied")
                                    }}
                                >
                                    <Copy /> Copy
                                </Button>
                                <pre className="bg-muted max-h-[28rem] overflow-auto rounded-lg p-3 font-mono text-xs leading-relaxed break-words whitespace-pre-wrap">
                                    {response.body || "(empty body)"}
                                </pre>
                            </div>
                        </TabsContent>
                        <TabsContent value="headers">
                            <dl className="divide-y rounded-lg border text-xs">
                                {response.headers.map(([name, value]) => (
                                    <div key={name} className="flex gap-3 px-3 py-1.5">
                                        <dt className="w-44 shrink-0 font-mono font-medium">{name}</dt>
                                        <dd className="text-muted-foreground min-w-0 font-mono break-all">{value}</dd>
                                    </div>
                                ))}
                            </dl>
                        </TabsContent>
                    </Tabs>
                </>
            )}
        </Panel>
    )
}
