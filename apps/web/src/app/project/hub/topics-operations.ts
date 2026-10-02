import { Activity, Gauge, Rocket, Server } from "lucide-react"
import type { Topic } from "./topics"

/** Operations: running it, scaling it, seeing inside it, and making it faster for a measured reason. */
export const OPERATIONS_TOPICS: Topic[] = [
    {
        id: "scaling",
        group: "Operations",
        title: "Scaling and reliability",
        icon: Server,
        summary: "More capacity changes how things fail. Add control with it.",
        blocks: [
            {
                kind: "md",
                text: "Web replicas must be **replaceable and stateless between requests**. Anything shared has to move out of process memory before a second replica is safe.",
            },
            {
                kind: "table",
                head: ["Shared thing", "Today", "Needed for >1 replica"],
                rows: [
                    ["Product / spot cache", "Redis (shared)", "Nothing; already correct."],
                    ["Price-cron pause toggle", "In-memory in `metals.cron`", "Redis or a BullMQ repeatable job."],
                    ["Admin log buffer, audit fallback", "In-memory", "Persistent store (audit table, 0.6)."],
                    ["Rate-limit counters", "None yet", "Redis-backed throttler."],
                    ["Scheduled jobs", "Run in every replica", "One owner: BullMQ job, lock, or dedicated replica."],
                ],
            },
            {
                kind: "bars",
                caption: "Retry with exponential backoff: 1 s doubling to a cap, each plus jitter. Waits grow so a struggling vendor gets room to recover.",
                unit: "s",
                bars: [
                    { label: "Attempt 1", value: 1, note: "then wait" },
                    { label: "Attempt 2", value: 2 },
                    { label: "Attempt 3", value: 4 },
                    { label: "Attempt 4", value: 8 },
                    { label: "Attempt 5", value: 16, note: "cap, then fail" },
                ],
            },
            {
                kind: "cards",
                items: [
                    { title: "Retry budget", body: "A total deadline across attempts, bounded attempts, jitter, and retry only classified transient failures. Never retry validation, auth or conflict errors without a state change." },
                    { title: "Idempotency", body: "No \"exactly once\" magic. Derive a stable key, record the claim with the write, and no-op on a completed duplicate. External APIs may need their own key." },
                    { title: "Backpressure", body: "Bound bodies, pages, queues and concurrency. When saturated, choose: reject fast, degrade a non-critical feature, or enqueue within a known capacity." },
                    { title: "Circuit breaker", tone: "warn", body: "Stops every request hammering a failing vendor and burning paid quota; serve last-known-good instead. Planned for the metal-price client (0.1)." },
                ],
            },
            {
                kind: "flow",
                caption: "Graceful shutdown, in order.",
                steps: [
                    { label: "SIGTERM" },
                    { label: "Mark unready, stop intake" },
                    { label: "Drain in-flight work", sub: "within a deadline" },
                    { label: "Flush telemetry" },
                    { label: "Close DB and Redis" },
                    { label: "Exit", tone: "gold" },
                ],
            },
        ],
    },
    {
        id: "observability",
        group: "Operations",
        title: "Observability",
        icon: Activity,
        summary: "Detect, explain and safely change the system from user impact.",
        blocks: [
            {
                kind: "cards",
                cols: 3,
                items: [
                    { title: "Logs", tag: "what happened", tone: "ok", body: "Structured JSON via `nestjs-pino`, secrets redacted, a tail shown in the admin Logs tab. Log a failure once, at its owner." },
                    { title: "Metrics", tag: "how much", tone: "warn", body: "Fetch success rate, latency and cache hit ratio on the admin Overview. Missing: process-level latency histograms." },
                    { title: "Traces", tag: "where time went", body: "Not yet. Sentry (0.7) would add error tracking and breadcrumbs on the pricing cascade." },
                ],
            },
            {
                kind: "layers",
                caption: "Debugging an incident: move down one level at a time.",
                layers: [
                    { label: "Symptom", sub: "prices stale, requests failing, slow dashboard" },
                    { label: "Scope", sub: "which route, which metal, since when, after which deploy?" },
                    { label: "Dependency or resource", sub: "vendor, Redis, DB pool, event loop" },
                    { label: "Evidence", sub: "the log line, fetch attempt row, or trace" },
                ],
            },
            {
                kind: "checks",
                items: [
                    { label: "Request logging with duration", status: "done", note: "request ids are generated but not yet on the log line" },
                    { label: "`/health` for uptime monitors", status: "done", note: "DB, Redis, MetalsAPI, last fetch" },
                    { label: "Admin Overview, Logs, fetch history", status: "done" },
                    { label: "Error tracking (Sentry)", status: "todo", note: "roadmap 0.7" },
                    { label: "Crash / restart / uptime alerts", status: "todo", note: "Railway metrics (0.7)" },
                    { label: "Tested backup restore", status: "todo", note: "a backup job is not proof of recovery (0.7)" },
                ],
            },
            {
                kind: "callout",
                title: "Alert for action",
                text: "Page only for urgent, actionable user impact. A process restart or one failed health check, on its own, is not a reason to wake someone. Keep metric labels bounded: never raw user ids, request ids or error messages.",
            },
        ],
    },
    {
        id: "performance",
        group: "Operations",
        title: "Performance diagnosis",
        icon: Gauge,
        summary: "Measure first. Fix the dominant constraint, one change at a time.",
        blocks: [
            {
                kind: "flow",
                caption: "The loop. Skipping 'measure' is how teams optimise the wrong thing.",
                steps: [
                    { label: "Define a workload", sub: "route, data volume, concurrency" },
                    { label: "Measure", sub: "p50/p95/p99, errors, saturation", tone: "gold" },
                    { label: "Find the constraint" },
                    { label: "Change one thing" },
                    { label: "Re-measure the same workload" },
                ],
            },
            {
                kind: "table",
                head: ["Constraint", "How it shows up", "Typical fix"],
                rows: [
                    ["Event loop", "A long synchronous callback stalls unrelated requests.", "Bound input, use async I/O, move CPU work to a worker."],
                    ["N+1 queries", "Query count grows with row count.", "Join or batch; count queries in a trace."],
                    ["DB pool", "Waiting for a connection under load.", "Shorter transactions first; size pool × replicas ≤ DB limit."],
                    ["Payload size", "Big JSON re-sent on every load.", "Split endpoints, cache, thin the data (market-data rework, 0.13)."],
                    ["Missing cache", "Same read repeated for no reason.", "Cache-aside with a TTL, after the query is right."],
                    ["Vendor latency", "Slow third-party call in the request path.", "Timeout, breaker, last-known-good."],
                ],
            },
            {
                kind: "callout",
                title: "Don't reach for these first",
                text: "Request-scoped providers (recreated per request, and the scope spreads upward), lazy-loaded modules (shift cost to first use) and extra services. Measure cold start and first-use latency before and after any of them.",
            },
        ],
    },
    {
        id: "delivery",
        group: "Operations",
        title: "Delivery and deployment",
        icon: Rocket,
        summary: "How a change gets from a branch to Railway.",
        blocks: [
            {
                kind: "flow",
                caption: "Target pipeline. CI is the missing first stage today (roadmap 0.10).",
                steps: [
                    { label: "Branch + PR", sub: "feature/ fix/ docs/" },
                    { label: "CI", sub: "build shared-types → tsc → lint → tests", tone: "gold" },
                    { label: "Merge to master", sub: "branch protection" },
                    { label: "Railway deploy", sub: "api + web services" },
                    { label: "Health check", sub: "/health" },
                ],
            },
            {
                kind: "cards",
                items: [
                    { title: "Conventional Commits", tag: "git", body: "`feat(trade): …`, `fix(products): …`. One logical change per commit, branches off `master`. Commit only when asked." },
                    { title: "Rebuild shared-types", tag: "gotcha", tone: "warn", body: "Consumers read `dist/`. After editing `packages/shared-types`, run its build, then restart a `--watch` API." },
                    { title: "Env on Railway", tag: "config", body: "API needs the database, Supabase and Redis URLs plus `FRONTEND_URL`; the web build needs `VITE_API_URL`. Redis must be a real host, never `127.0.0.1`." },
                    { title: "Expand, then contract", tag: "schema", body: "Ship additive migrations first so the old and new app versions both run during a deploy." },
                ],
            },
        ],
    },
]
