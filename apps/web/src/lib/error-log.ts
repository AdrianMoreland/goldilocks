import {
    createErrorReference,
    type ClientErrorReport,
    type ErrorLogEntry,
    type ErrorLogKind,
    type ErrorLogSeverity,
} from "@goldilocks/shared-types"
import { API_URL } from "@/api/base"

/**
 * This browser's own error log. Kept in localStorage so a failure is still
 * recorded when the API is the thing that's down ("Connection error" can't
 * be reported to the server at the moment it happens). Reportable entries
 * are sent to POST /errors/client as soon as the API answers again, where
 * they join the server's log in the Admin panel.
 */
const STORAGE_KEY = "goldilocks:error-log"
const MAX_ENTRIES = 100

export interface LocalErrorEntry extends ErrorLogEntry {
    /** Should the server get a copy? False when the server already logged it (a 5xx with its own reference). */
    reportable: boolean
    synced: boolean
}

export interface RecordClientErrorInput {
    kind: ErrorLogKind
    severity?: ErrorLogSeverity
    message: string
    detail?: string
    statusCode?: number
    method?: string
    path?: string
    stack?: string
    /** Use the server's reference when the server already logged this failure. */
    reference?: string
    reportable?: boolean
}

type Listener = () => void
const listeners = new Set<Listener>()

function read(): LocalErrorEntry[] {
    try {
        const raw = localStorage.getItem(STORAGE_KEY)
        return raw ? (JSON.parse(raw) as LocalErrorEntry[]) : []
    } catch {
        return []
    }
}

function write(entries: LocalErrorEntry[]) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(entries.slice(0, MAX_ENTRIES)))
    } catch {
        // Storage full or blocked — the in-page toast still told the user.
    }
    listeners.forEach((listener) => listener())
}

/** Records a browser-side failure and returns its reference ("E-7F3K2") for the toast. */
export function recordClientError(input: RecordClientErrorInput): string {
    const reference = input.reference ?? createErrorReference()
    const entry: LocalErrorEntry = {
        id: crypto.randomUUID(),
        reference,
        at: new Date().toISOString(),
        source: "client",
        severity: input.severity ?? "error",
        kind: input.kind,
        message: input.message.slice(0, 500),
        detail: input.detail?.slice(0, 4000) ?? null,
        statusCode: input.statusCode ?? null,
        method: input.method ?? null,
        path: input.path?.slice(0, 500) ?? null,
        code: null,
        stack: input.stack?.slice(0, 4000) ?? null,
        user: null,
        userAgent: navigator.userAgent,
        reportable: input.reportable ?? true,
        synced: false,
    }
    write([entry, ...read()])
    void flushClientErrors()
    return reference
}

export function getLocalErrors(): LocalErrorEntry[] {
    return read()
}

export function clearLocalErrors() {
    write([])
}

export function subscribeToLocalErrors(listener: Listener): () => void {
    listeners.add(listener)
    return () => listeners.delete(listener)
}

let flushing = false

/**
 * Sends unsynced reportable entries to the API. Uses fetch directly rather
 * than useApi, so a failing report can't itself raise a toast or record a
 * new error (which would loop). Needs a signed-in token; silently waits
 * otherwise.
 */
export async function flushClientErrors(): Promise<void> {
    if (flushing) return
    const token = localStorage.getItem("token")
    if (!token) return
    const pending = read().filter((e) => e.reportable && !e.synced).slice(0, 50)
    if (pending.length === 0) return

    flushing = true
    try {
        const reports: ClientErrorReport[] = pending.map((e) => ({
            reference: e.reference,
            occurredAt: e.at,
            severity: e.severity,
            kind: e.kind,
            message: e.message,
            detail: e.detail ?? undefined,
            statusCode: e.statusCode ?? undefined,
            method: e.method ?? undefined,
            path: e.path ?? undefined,
            stack: e.stack ?? undefined,
        }))
        const res = await fetch(`${API_URL}/errors/client`, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({ reports }),
        })
        if (!res.ok) return
        const sent = new Set(pending.map((e) => e.id))
        write(read().map((e) => (sent.has(e.id) ? { ...e, synced: true } : e)))
    } catch {
        // Still offline — they stay pending for the next successful request.
    } finally {
        flushing = false
    }
}

if (typeof window !== "undefined") {
    window.addEventListener("online", () => void flushClientErrors())
}
