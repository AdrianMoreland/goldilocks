import { FlaskConical, Fingerprint, Route, ShieldCheck, TriangleAlert } from "lucide-react"
import type { Topic } from "./topics"

/** Runtime and security: how a request travels, how failures are shaped, and what protects the app. */
export const RUNTIME_TOPICS: Topic[] = [
    {
        id: "lifecycle",
        group: "Runtime and security",
        title: "Request lifecycle",
        icon: Route,
        summary: "The order Nest runs things in, and what Goldilocks plugs into each stage.",
        blocks: [
            {
                kind: "flow",
                caption: "An HTTP request, left to right. Errors jump from any step straight to the exception filter.",
                steps: [
                    { label: "Middleware", sub: "pino request log, request id" },
                    { label: "Guards", sub: "JwtAuthGuard, RolesGuard", tone: "gold" },
                    { label: "Interceptors in" },
                    { label: "Pipes", sub: "ZodValidationPipe, ParseIntPipe", tone: "gold" },
                    { label: "Controller → service" },
                    { label: "Interceptors out", sub: "ZodSerializerInterceptor" },
                    { label: "Response" },
                ],
            },
            {
                kind: "flow",
                steps: [
                    { label: "Any thrown error", tone: "bad" },
                    { label: "AllExceptionsFilter", sub: "Prisma + HTTP mapping, one log line", tone: "gold" },
                    { label: "Safe JSON error", sub: "no stack, no SQL" },
                ],
            },
            {
                kind: "table",
                head: ["Feature", "Right job", "Common misuse"],
                rows: [
                    ["Module", "Encapsulation, wiring, public exports", "One global module exporting everything"],
                    ["Middleware", "Raw preprocessing, correlation ids", "Route authorisation"],
                    ["Guard", "May this principal proceed?", "Response mapping, business transactions"],
                    ["Pipe", "Validate and transform arguments", "Database writes, external calls"],
                    ["Interceptor", "Wrap execution: timing, tracing, mapping", "Hidden feature policy in a global interceptor"],
                    ["Exception filter", "Map uncaught failures to a response", "Swallowing errors or retrying work"],
                    ["Controller", "Adapt transport to one operation", "Owning invariants, querying several stores"],
                    ["Scheduler", "A time trigger", "Assuming it runs once per replica"],
                ],
            },
            {
                kind: "callout",
                title: "Binding scope",
                text: "Pick the narrowest level that matches the policy: **global** for baseline rules (auth, validation), **controller** for a shared adapter policy (admin-only), **route** for one operation, **parameter** for one value. Register DI-aware globals with `APP_GUARD`, `APP_PIPE`, `APP_FILTER` so they live inside the container.",
            },
            {
                kind: "md",
                text: "Validation here is **Zod through `nestjs-zod`**, never `class-validator`. Every schema lives in `shared-types`; `dtos.ts` wraps each as a Nest DTO. Route params are not covered by the body pipe, so numeric ids need `ParseIntPipe` explicitly.",
            },
        ],
    },
    {
        id: "errors",
        group: "Runtime and security",
        title: "Error handling",
        icon: TriangleAlert,
        summary: "Classify first, map once at the boundary, never leak internals.",
        blocks: [
            {
                kind: "table",
                head: ["Category", "Meaning", "Default handling", "Nest exception"],
                rows: [
                    ["Business rejection", "State disallows the operation", "Stable failure, usually not retried", "`BadRequest` / `Conflict`"],
                    ["Invalid input", "Fails the boundary contract", "Reject before any side effect", "`BadRequest` (Zod pipe)"],
                    ["Auth", "No/invalid identity, or not allowed", "Generic message; never retry blindly", "`Unauthorized` / `Forbidden`"],
                    ["Conflict", "Version or uniqueness changed", "Stable conflict; retry the right unit", "`Conflict`"],
                    ["Transient dependency", "Vendor or DB may recover", "Deadline, retry budget, idempotency", "`ServiceUnavailable`"],
                    ["Permanent dependency", "Config or credentials wrong", "Translate and escalate; don't retry", "`InternalServerError`"],
                    ["Unknown defect", "An assumption broke", "Safe 500, one diagnostic log", "(unmapped → filter)"],
                ],
            },
            {
                kind: "layers",
                caption: "Where each kind of error is handled.",
                layers: [
                    { label: "Domain / service", sub: "expresses business meaning (NotFoundException, BadRequestException)" },
                    { label: "Adapters", sub: "translate vendor and Prisma errors into app categories", tone: "muted" },
                    { label: "Exception filter", sub: "maps once to a response and logs once", tone: "gold" },
                ],
            },
            {
                kind: "cards",
                items: [
                    { title: "Auth uses one generic message", tag: "built", tone: "ok", body: "\"Invalid email or password\" regardless of cause, and \"This account is not set up for this application.\" for a valid identity with no local row. Never reveal which." },
                    { title: "A timeout does not mean the write failed", tag: "rule", body: "Reconcile or use an idempotency key before repeating a side effect. Retry only classified transient failures, with backoff and a total deadline." },
                    { title: "Never expose internals", tag: "rule", body: "No stack traces, SQL, file paths, secrets, raw vendor bodies or class names in a response. Give support an opaque request id instead." },
                    { title: "Log a failure once", tag: "rule", body: "At the boundary that owns the context. Duplicate stacks from every layer bury the signal." },
                ],
            },
        ],
    },
    {
        id: "security",
        group: "Runtime and security",
        title: "Security layers",
        icon: ShieldCheck,
        summary: "Defence in depth, with an honest status for each layer.",
        blocks: [
            {
                kind: "layers",
                caption: "Outside in. Each layer assumes the one before it can fail.",
                layers: [
                    { label: "Edge: CORS, headers, rate limiting", sub: "stops abuse before it reaches code" },
                    { label: "Authentication", sub: "who is this? (Supabase token via JwtAuthGuard)" },
                    { label: "Authorisation", sub: "may they do this to this thing? (RolesGuard, admin flag)", tone: "gold" },
                    { label: "Input validation", sub: "allow-list shape and size (Zod)" },
                    { label: "Data access", sub: "parameterised queries, no raw user SQL" },
                    { label: "Output control", sub: "explicit DTOs, never raw rows with secrets" },
                ],
            },
            {
                kind: "checks",
                items: [
                    { label: "Every route guarded server-side", status: "done", note: "global `JwtAuthGuard`; a spec fails if a route is added unguarded" },
                    { label: "Admin enforced on the server", status: "done", note: "403 verified; the UI toggle is only discoverability" },
                    { label: "Zod validation on bodies", status: "done", note: "route params still need `ParseIntPipe`" },
                    { label: "Secrets only in env, `.env` ignored", status: "done" },
                    { label: "CORS from `FRONTEND_URL`", status: "done" },
                    { label: "Audit trail for admin writes", status: "partial", note: "Redis list, DB-browser edits only (roadmap 0.6)" },
                    { label: "Fail-closed admin gating", status: "partial", note: "a route with no `@Roles` is open to any signed-in user (0.12)" },
                    { label: "Login rate limiting", status: "todo", note: "`@nestjs/throttler` (0.6)" },
                    { label: "Security headers", status: "todo", note: "Helmet (0.6)" },
                    { label: "Entra ID SSO", status: "todo", note: "behind `AuthProviderPort` (0.6)" },
                    { label: "Token in httpOnly cookie vs localStorage", status: "todo", note: "a decision (0.12)" },
                ],
            },
            {
                kind: "callout",
                tone: "warn",
                title: "A valid token is not proof of ownership",
                text: "Authentication says who you are; authorisation says what you may do to *this* resource. Check the second even when the first passes. CORS is a browser policy, not authentication.",
            },
            {
                kind: "table",
                head: ["Verify with", "Test"],
                rows: [
                    ["Policies", "Unit-test ownership and role decisions."],
                    ["Boundaries", "E2E: unauthenticated, forbidden, malformed, oversized, replayed, rate-limited."],
                    ["Output", "Response allow-lists and log redaction."],
                    ["Supply chain", "Dependency scan in CI, then triage the results."],
                ],
            },
        ],
    },
    {
        id: "testing",
        group: "Runtime and security",
        title: "Testing strategy",
        icon: FlaskConical,
        summary: "Match the test to the boundary that carries the risk.",
        blocks: [
            {
                kind: "pyramid",
                caption: "Fewer, slower tests at the top. Today: API Jest ~500 tests, shared-types Vitest ~170, web 0.",
                levels: [
                    { label: "End-to-end", sub: "one smoke test: load → select → copy (planned)" },
                    { label: "HTTP / contract tests", sub: "real app boundary; `route-auth.spec` is one" },
                    { label: "Integration", sub: "real DB / cache / vendor semantics" },
                    { label: "Unit tests", sub: "pure maths, policies, services with owned fakes" },
                ],
            },
            {
                kind: "table",
                head: ["Boundary or risk", "Best test"],
                rows: [
                    ["Pricing maths, policies", "Plain unit test with direct construction (100% target)."],
                    ["Application service", "Unit test; mock `PrismaService` at the provider boundary, no deeper."],
                    ["Module wiring, guards, pipes", "`Test.createTestingModule()`."],
                    ["Database, cache, vendor adapter", "Integration or contract test against something realistic."],
                    ["HTTP contract", "Supertest through the real app with global pipes and filters."],
                    ["Capacity, queues, shutdown", "Separate load or failure test, not in the unit suite."],
                ],
            },
            {
                kind: "cards",
                items: [
                    { title: "Do", tone: "ok", body: "Assert observable behaviour and domain failures. Control clocks and ids instead of sleeping. Name fixtures after the business condition." },
                    { title: "Don't", tone: "bad", body: "Test private methods or call order, point tests at a shared environment, or treat a mock ORM as proof the SQL, indexes or migrations work." },
                ],
            },
        ],
    },
    {
        id: "api-contract",
        group: "Runtime and security",
        title: "API contracts",
        icon: Fingerprint,
        summary: "Stable shapes, one schema shared by both apps.",
        blocks: [
            {
                kind: "flow",
                caption: "One schema, three consumers. A change here breaks the build, not production.",
                steps: [
                    { label: "Zod schema", sub: "packages/shared-types", tone: "gold" },
                    { label: "DTO wrapper", sub: "dtos.ts → Nest validation + Swagger" },
                    { label: "Web client", sub: "useApiClient parses every response" },
                ],
            },
            {
                kind: "cards",
                items: [
                    { title: "Validate at the trust boundary", body: "Bodies via the global Zod pipe; numeric path params with `ParseIntPipe`; query params via shared Zod schemas (planned, 0.12)." },
                    { title: "The web client re-validates", body: "`useApiClient` parses each response against its Zod schema, so an API/web mismatch is reported with the exact issues instead of crashing later." },
                    { title: "Swagger at `/docs`", body: "Add `ApiTags`, `ApiOperation` and `ApiBearerAuth` to new endpoints. Off in production unless `SWAGGER_ENABLED=true`." },
                    { title: "Normalise before the surface grows", body: "Product routes are inconsistent today (`/products/products`); the market-data rework (0.13) tidies them in one breaking PR." },
                ],
            },
        ],
    },
]
