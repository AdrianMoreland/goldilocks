import { Boxes, Database, Layers, Network, Puzzle, Scale, Waypoints } from "lucide-react"
import type { Topic } from "./topics"

/** Architecture: how Goldilocks is cut up, and the tests used to decide when to cut it differently. */
export const ARCHITECTURE_TOPICS: Topic[] = [
    {
        id: "big-picture",
        group: "Architecture",
        title: "The big picture",
        icon: Network,
        summary: "Three packages, one API, and the outside systems they lean on.",
        blocks: [
            {
                kind: "md",
                text: "Goldilocks is a **pnpm monorepo** run by Turborepo. The web app and the API never share code directly: everything they must agree on (Zod schemas, pricing maths) lives in `packages/shared-types`, so the dashboard and the server can never quote different prices.",
            },
            {
                kind: "graph",
                caption: "Who talks to whom. Arrows point from caller to dependency.",
                height: 330,
                nodes: [
                    { id: "web", label: "apps/web (React + Vite)", x: 140, y: 50, w: 200, tone: "gold" },
                    { id: "api", label: "apps/api (NestJS)", x: 400, y: 150, w: 180, tone: "gold" },
                    { id: "types", label: "packages/shared-types", x: 660, y: 50, w: 190, tone: "gold" },
                    { id: "sb", label: "Supabase (Postgres + Auth)", x: 140, y: 270, w: 210 },
                    { id: "redis", label: "Redis cache", x: 400, y: 285, w: 130 },
                    { id: "metal", label: "MetalPrice API", x: 590, y: 270, w: 140 },
                    { id: "llm", label: "OpenAI (assistant)", x: 740, y: 190, w: 130 },
                ],
                edges: [
                    ["web", "api", "HTTPS + Bearer token"],
                    ["web", "types"],
                    ["api", "types"],
                    ["api", "sb", "Prisma / Auth"],
                    ["api", "redis"],
                    ["api", "metal", "spot prices"],
                    ["api", "llm", "LlmPort"],
                ],
            },
            {
                kind: "cards",
                cols: 3,
                items: [
                    { title: "apps/web", tag: "UI", body: "React, React Router, TanStack Query + Table, shadcn/Radix, Tailwind v4. Server state lives in TanStack Query, shared UI state in React Context." },
                    { title: "apps/api", tag: "Server", body: "NestJS 11, Prisma 7, Redis cache-aside, `nestjs-zod` validation, Supabase Auth behind a port. A modular monolith." },
                    { title: "packages/shared-types", tag: "Contract", body: "Zod schemas and pure pricing maths, built with tsup and consumed from `dist/`: rebuild it after every change." },
                ],
            },
            {
                kind: "callout",
                tone: "good",
                title: "Business Central is the system of record",
                text: "Goldilocks reads customers, quotes and orders from BC and writes only through its API. It keeps snapshots, logs and decisions, never a competing ledger.",
            },
        ],
    },
    {
        id: "modular-monolith",
        group: "Architecture",
        title: "Modular monolith",
        icon: Boxes,
        summary: "One deployable, many feature modules with small public surfaces.",
        blocks: [
            {
                kind: "md",
                text: "The API is organised by **business capability**, not by technical bucket: there is a `ProductsModule`, not a global `controllers/` folder. Each module owns its tables, keeps its providers private and exports only what another module needs.",
            },
            {
                kind: "graph",
                caption: "Real imports between API feature modules (read from the source). Gold = the pricing core everything else reads.",
                height: 380,
                nodes: [
                    { id: "trade", label: "Trade", x: 90, y: 40, w: 110 },
                    { id: "portfolio", label: "Portfolio", x: 240, y: 40, w: 110 },
                    { id: "ai", label: "AI assistant", x: 470, y: 40, w: 130 },
                    { id: "roadmap", label: "Roadmap", x: 640, y: 40, w: 110 },
                    { id: "mode", label: "Market mode", x: 740, y: 120, w: 110 },
                    { id: "md", label: "Market data", x: 330, y: 135, w: 130, tone: "gold" },
                    { id: "kb", label: "Knowledge", x: 560, y: 135, w: 110 },
                    { id: "products", label: "Products", x: 130, y: 235, w: 110, tone: "gold" },
                    { id: "metals", label: "Metals (spot)", x: 330, y: 235, w: 130, tone: "gold" },
                    { id: "admin", label: "Admin + audit", x: 560, y: 235, w: 130 },
                    { id: "errlog", label: "Error log", x: 740, y: 235, w: 100 },
                    { id: "auth", label: "Auth", x: 640, y: 330, w: 90 },
                    { id: "infra", label: "Prisma · Redis · vendor ports", x: 300, y: 335, w: 250, tone: "muted" },
                ],
                edges: [
                    ["trade", "products"],
                    ["trade", "metals"],
                    ["portfolio", "products"],
                    ["portfolio", "metals"],
                    ["md", "products"],
                    ["md", "metals"],
                    ["ai", "md"],
                    ["ai", "kb"],
                    ["admin", "metals"],
                    ["admin", "errlog"],
                    ["mode", "admin", "audit"],
                    ["roadmap", "admin", "audit"],
                    ["metals", "infra"],
                    ["products", "infra"],
                    ["auth", "admin"],
                ],
            },
            {
                kind: "layers",
                caption: "Inside one feature, a request flows downward. Dependencies only point down.",
                layers: [
                    { label: "Controller", sub: "adapts HTTP to one operation; validates with the Zod DTO", tone: "muted" },
                    { label: "Service", sub: "business rules and coordination; throws Nest exceptions", tone: "gold" },
                    { label: "Provider / cache store", sub: "owns Prisma calls and the Redis cache for its data" },
                    { label: "Prisma + Redis", sub: "infrastructure", tone: "muted" },
                ],
            },
            {
                kind: "table",
                head: ["Rule", "What it means here"],
                rows: [
                    ["Organise around capabilities", "`products/`, `trade/`, `knowledge/`: each owns its data and public entry points."],
                    ["Keep module APIs small", "Providers are private by default; export only the service another module calls."],
                    ["One owner per write", "Product writes go through `ProductsProvider` (the admin database editor is the one exception, on the clean-up list); spot rows are written only by the metals provider."],
                    ["Cycles are design feedback", "Fix ownership first. `forwardRef()` is a documented escape hatch, never the default."],
                    ["`@Global()` sparingly", "Only process-wide facilities. `ErrorLogModule` fits (the exception filter needs it); `AdminModule` is on the clean-up list."],
                    ["Wiring lives at the edge", "Modules choose implementations (`useClass`); business code never reads env vars or `ModuleRef`."],
                ],
            },
        ],
    },
    {
        id: "ladder",
        group: "Architecture",
        title: "The architecture ladder",
        icon: Layers,
        summary: "Climb only when a real constraint forces it.",
        blocks: [
            {
                kind: "md",
                text: "Each rung is an *option*, not a maturity badge. Choose the lowest level that protects a boundary you can name. The roadmap's **scaling triggers** are the agreed signals for moving up.",
            },
            {
                kind: "ladder",
                current: 0,
                steps: [
                    { label: "1 · Feature modules", sub: "Cohesive modules, Prisma in services. Default for CRUD-heavy products." },
                    { label: "2 · Layered feature", sub: "Domain / application / infrastructure inside a complex feature." },
                    { label: "3 · Ports, hexagonal, CQRS", sub: "When one behaviour has many adapters or read/write models truly differ." },
                    { label: "4 · Separate services", sub: "Independent release, scaling, data or failure isolation." },
                ],
            },
            {
                kind: "table",
                head: ["Signal", "Respond with"],
                rows: [
                    ["Small team, one deployable, mostly CRUD", "Stay on rung 1 (today)."],
                    ["Vendor API changes often (BC, Open Banking, hedge platform)", "An application-owned **port** plus an adapter, like `AuthProviderPort`."],
                    ["CPU-heavy or scheduled job needs its own capacity", "A separate **worker** deployment before any business microservice."],
                    ["Circular module imports", "Repair ownership. A network boundary does not fix a design cycle."],
                    ["More than one Railway replica", "Move in-memory state to Redis, add BullMQ, Redis-backed throttling."],
                    ["Customer-facing site (Phase 2)", "A separate `apps/site` on the same core API, with its own public, cached controller surface."],
                ],
            },
            {
                kind: "callout",
                tone: "warn",
                title: "Signs a split would be premature",
                text: "Two services sharing tables, releasing together, or calling each other on every request are a *distributed monolith*: all the cost of a network boundary and none of the independence.",
            },
        ],
    },
    {
        id: "ports",
        group: "Architecture",
        title: "Dependency injection and ports",
        icon: Puzzle,
        summary: "How `AuthProviderPort` lets a vendor change without a rewrite.",
        blocks: [
            {
                kind: "md",
                text: "NestJS builds a graph of providers and injects them through constructors. **Dependency inversion** means high-level code owns the interface it needs, and the vendor adapter implements it. TypeScript interfaces vanish at runtime, so a port needs a `Symbol` token.",
            },
            {
                kind: "flow",
                caption: "The auth seam, as built.",
                steps: [
                    { label: "AuthService", sub: "@Inject(AUTH_PROVIDER)", tone: "gold" },
                    { label: "AUTH_PROVIDER", sub: "Symbol token" },
                    { label: "AuthProviderPort", sub: "signInWithPassword · verifyToken" },
                    { label: "SupabaseAuthProvider", sub: "useClass in auth.module.ts", tone: "muted" },
                ],
            },
            {
                kind: "code",
                text: `export const AUTH_PROVIDER = Symbol('AUTH_PROVIDER');

@Injectable()
export class AuthService {
  constructor(@Inject(AUTH_PROVIDER) private readonly auth: AuthProviderPort) {}
}

// auth.module.ts: the only line that names the vendor
{ provide: AUTH_PROVIDER, useClass: SupabaseAuthProvider }`,
            },
            {
                kind: "table",
                head: ["Provider form", "Use it when"],
                rows: [
                    ["Class provider", "One concrete implementation is the local default."],
                    ["`useClass`", "Selecting an implementation behind a token (the port pattern)."],
                    ["`useValue`", "Config, constants, or a test double."],
                    ["`useFactory`", "Construction depends on runtime config or other providers."],
                    ["`useExisting`", "An alias to the same singleton."],
                ],
            },
            {
                kind: "cards",
                items: [
                    { title: "Create a port when…", tone: "ok", body: "the edge is external or volatile, tests need a deterministic seam, or a second implementation is a known requirement. Goldilocks has `AUTH_PROVIDER`, the metal-price API port and `LlmPort`." },
                    { title: "Skip the port when…", tone: "bad", body: "it is a stable local helper with no external effect. An interface with one implementation and no boundary only adds navigation cost." },
                ],
            },
            {
                kind: "callout",
                text: "Singleton scope is the default and right for almost everything. Never keep per-request state in a singleton field; request scope bubbles up the graph and recreates every consumer.",
            },
        ],
    },
    {
        id: "data",
        group: "Architecture",
        title: "Data, transactions and caching",
        icon: Database,
        summary: "Decimal money, cache-aside reads, and writes that stay consistent.",
        blocks: [
            {
                kind: "flow",
                caption: "Cache-aside read (ProductCacheStore, SpotPriceCacheStore). Callers never see the cache.",
                steps: [
                    { label: "Request", sub: "get(key)" },
                    { label: "Redis hit?", sub: "yes: return it", tone: "gold" },
                    { label: "Prisma query", sub: "miss: read the source" },
                    { label: "Populate Redis", sub: "TTL, e.g. 5 min" },
                    { label: "Return value" },
                ],
            },
            {
                kind: "cards",
                cols: 3,
                items: [
                    { title: "Money is Decimal", tag: "Prisma", body: "Every currency and weight column is `Decimal`, never `Float`. Round only at output; quoted prices round in the dealer's favour." },
                    { title: "Two connection strings", tag: "Supabase", body: "`DATABASE_URL` is pooled (6543) for queries; `DIRECT_URL` (5432) is for migrations. Don't collapse them." },
                    { title: "Raw writes skip the cache", tag: "Gotcha", tone: "warn", body: "A script that writes with Prisma does not invalidate Redis. Wait out the 5-minute TTL or clear `products:all`." },
                ],
            },
            {
                kind: "md",
                text: "### Transactions\n\nAlign a transaction with **one business invariant**, keep it short, and never call HTTP, email or a broker while holding locks. Pass the transaction client explicitly. Enforce uniqueness and foreign keys in the database too, not only in code.",
            },
            {
                kind: "callout",
                tone: "warn",
                title: "The gap the roadmap closes (0.6)",
                text: "A product write, its audit row and its cache refresh are three separate steps today. The planned audit table is written in the **same `$transaction`** as the change, so neither can exist without the other.",
            },
            {
                kind: "table",
                head: ["Migration rule", "Why"],
                rows: [
                    ["Commit and review every schema change", "Generated SQL is a starting point; read what it does to data."],
                    ["Never auto-sync the schema in production", "A bad model edit must not alter live tables."],
                    ["Expand, then contract", "Old and new app versions overlap during a deploy; add first, remove later."],
                    ["Back up and rehearse restores", "A successful backup job is not proof you can recover."],
                ],
            },
        ],
    },
    {
        id: "principles",
        group: "Architecture",
        title: "Principles as decision tests",
        icon: Scale,
        summary: "Questions that settle a design argument, not slogans.",
        blocks: [
            {
                kind: "cards",
                cols: 3,
                items: [
                    { title: "Cohesion and coupling", body: "Do these files change for the *same business reason*? Can a consumer use the capability without knowing its internals?" },
                    { title: "KISS", body: "Can a maintainer trace the success **and failure** paths without simulating framework magic? Simple includes operable." },
                    { title: "YAGNI", body: "Which accepted requirement makes this abstraction pay rent *now*? Keep a boundary only if volatility, security or ownership already demands it." },
                    { title: "DRY, Rule of Three", body: "Remove duplicated **knowledge**, not every repeated line. Two DTOs that look alike may be different contracts." },
                    { title: "Information hiding", body: "Could the implementation change without editing consumers? Don't leak a whole ORM row or vendor response." },
                    { title: "Law of Demeter", body: "`order.canUseFeature(f)` beats `order.customer.account.plan.canUse(f)`: the owner answers the question." },
                    { title: "Fail fast", body: "Reject invalid config at startup. At runtime, tell retryable, permanent, partial and unavailable apart." },
                    { title: "Explicit contracts", body: "Validate at trust boundaries; make nullability, idempotency and error behaviour visible." },
                    { title: "Evolve reversibly", body: "Add before remove, support old and new during migration, measure before and after." },
                ],
            },
            {
                kind: "table",
                head: ["Tension", "Decision test"],
                rows: [
                    ["DRY vs coupling", "Share stable knowledge, not coincidental shape."],
                    ["KISS vs reliability", "Include known failure behaviour; omit speculative machinery."],
                    ["Encapsulation vs reporting", "Expose a purpose-built read model, not internal persistence."],
                    ["Strict layering vs delivery", "Layer only the complex feature; keep simple ones compact."],
                    ["Reuse vs ownership", "Prefer a duplicated adapter over shared business write ownership."],
                ],
            },
        ],
    },
    {
        id: "calls-events",
        group: "Architecture",
        title: "Calls, events and queues",
        icon: Waypoints,
        summary: "Pick the coupling style by what the caller needs back.",
        blocks: [
            {
                kind: "table",
                head: ["Mechanism", "Use it when", "Careful"],
                rows: [
                    ["Synchronous call", "The caller needs the result now or shares one transaction.", "Adds a runtime dependency on the callee."],
                    ["In-process event", "An optional reaction whose loss is acceptable.", "Not durable; lost on crash; one replica only."],
                    ["Durable queue (BullMQ)", "Work must survive restarts, absorb bursts or scale apart.", "Needs idempotency, retries, a dead-letter plan."],
                    ["Transactional outbox", "A DB change and an external event must not diverge.", "Needs a relay, ordering and retention design."],
                    ["Scheduler", "Time-triggered work.", "A trigger, not a lock: every replica fires it."],
                ],
            },
            {
                kind: "callout",
                title: "Where this bites in Goldilocks",
                text: "The 10-minute price cron runs in each API replica, and its pause toggle is in-memory. That is fine with one replica; with two it needs a BullMQ repeatable job (roadmap 0.7).",
            },
        ],
    },
]
