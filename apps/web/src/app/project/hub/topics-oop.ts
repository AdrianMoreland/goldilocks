import { Blocks, Bug, Component, Shapes } from "lucide-react"
import type { Topic } from "./topics"

/** OOP and SOLID: object design inside one service, with the Goldilocks class that shows each idea. */
export const OOP_TOPICS: Topic[] = [
    {
        id: "solid",
        group: "OOP and SOLID",
        title: "SOLID in this codebase",
        icon: Blocks,
        summary: "Five tests for object design, each with a class you can open.",
        blocks: [
            {
                kind: "md",
                text: "SOLID is a set of **tests you apply when a design hurts**, not a checklist to satisfy up front. Each card gives the rule in one line and where it already shows up (or is still missing) in this repo.",
            },
            {
                kind: "cards",
                items: [
                    {
                        title: "S · Single Responsibility",
                        tag: "one reason to change",
                        body: "A class is one *cohesive policy*, not one method. `ProductsProvider` owns product persistence, `ProductCacheStore` owns the cache, `ProductsService` owns the rules.\n\n**Split when** unrelated actors ask for changes, dependencies cluster in two groups, or tests need unrelated setup. *Open item:* `MetalsProvider` (407 lines) mixes vendor fetching with storing.",
                    },
                    {
                        title: "O · Open / Closed",
                        tag: "extend, don't edit",
                        body: "Build the direct case first. When repeated change shows a stable operation with varying behaviour, extract the variation. Market modes (Weekend, Volatile, Shortage) are the candidate: one strategy per mode instead of growing conditionals.\n\nA small stable `if` is fine; don't replace it with a class hierarchy just to avoid touching a file.",
                    },
                    {
                        title: "L · Liskov Substitution",
                        tag: "same contract",
                        body: "An implementation must keep the inputs, outputs, error categories and side effects of its interface. Every `CacheAsideStore` subclass must fall through to its source when Redis is down. A cached repository that silently drops writes is *not* substitutable, even if the types match.",
                    },
                    {
                        title: "I · Interface Segregation",
                        tag: "consumer-shaped",
                        body: "Design ports from what the consumer uses. `LlmPort` exposes generate and stream, not the whole OpenAI SDK. Separate read and write ports when consumers and semantics differ; don't fragment an interface every consumer always uses whole.",
                    },
                    {
                        title: "D · Dependency Inversion",
                        tag: "policy owns the port",
                        body: "`PlaceOrder -> PaymentGateway <- StripeGateway`. Here: `AuthService -> AuthProviderPort <- SupabaseAuthProvider`. The application defines what it needs; infrastructure implements it. Application code never imports the vendor.",
                    },
                ],
            },
            {
                kind: "flow",
                caption: "Dependency Inversion in one line: the arrow into the port comes from both sides.",
                steps: [
                    { label: "High-level policy", sub: "AuthService, AskService", tone: "gold" },
                    { label: "Port (interface + token)", sub: "AuthProviderPort, LlmPort" },
                    { label: "Adapter", sub: "SupabaseAuthProvider, OpenAiLlmClient", tone: "muted" },
                ],
            },
            {
                kind: "callout",
                tone: "good",
                title: "Checklist before merging a class",
                text: "Business mutations are named and keep invariants · public surface is smaller than internal state · composition preferred · every abstraction maps to real variation or a boundary · implementations honour behaviour, not just types · constructor dependencies read like the collaboration.",
            },
        ],
    },
    {
        id: "oop",
        group: "OOP and SOLID",
        title: "OOP fundamentals",
        icon: Shapes,
        summary: "Encapsulation, abstraction, composition, polymorphism: what each is for.",
        blocks: [
            {
                kind: "cards",
                items: [
                    { title: "Encapsulation", tag: "protect invariants", body: "Protect *behaviour*, not just fields. A public `setStatus(value)` is weak even with a private field; expose a named operation like `confirm()` that rejects an illegal move." },
                    { title: "Abstraction", tag: "hide a decision", body: "Hide a decision likely to change or a boundary worth testing. A `Clock { now() }` earns its keep; a wrapper that mirrors a whole SDK method by method hides nothing." },
                    { title: "Composition over inheritance", tag: "prefer", body: "Inject collaborating policies instead of extending base classes. Feature services rarely need a generic `BaseService<T>`." },
                    { title: "Polymorphism", tag: "real variation", body: "Use it for genuine variants (`StandardPricing` vs `PartnerPricing`). Select the variant at the composition root or one focused factory, never from raw user input." },
                ],
            },
            {
                kind: "table",
                head: ["Inheritance warning sign", "What it tells you"],
                rows: [
                    ["Subclass overrides a method to throw \"unsupported\"", "It is not really a subtype."],
                    ["Callers check the subtype's name", "The variation belongs in a strategy."],
                    ["Protected mutable state coordinates behaviour", "Hidden coupling between base and child."],
                    ["A base change breaks unrelated features", "The base is a shared dumping ground."],
                ],
            },
            {
                kind: "pyramid",
                caption: "Prefer the layers at the top; reach down the list only when the lighter option cannot do the job.",
                levels: [
                    { label: "Plain function / pure module", sub: "pricing-math.ts: no state, trivially testable" },
                    { label: "Injected collaborator", sub: "a service gets a port in its constructor" },
                    { label: "Strategy / adapter class", sub: "real variation or an external edge" },
                    { label: "Inheritance / template method", sub: "only for a fixed skeleton with a stable contract" },
                ],
            },
        ],
    },
    {
        id: "patterns",
        group: "OOP and SOLID",
        title: "Design pattern catalogue",
        icon: Component,
        summary: "Start from a force or failure, then pick the smallest pattern.",
        blocks: [
            {
                kind: "callout",
                title: "Read pattern lists carefully",
                text: "Lists mix levels: architecture (hexagonal), framework mechanisms (guards, pipes), and object patterns (Strategy). Nest's `@UseGuards()` is a metadata decorator, not the GoF Decorator, and a provider's default scope is a container lifetime, not a hand-written Singleton.",
            },
            {
                kind: "flow",
                caption: "Strategy: one stable operation, several interchangeable algorithms.",
                steps: [
                    { label: "Caller", sub: "calculate(order)" },
                    { label: "PricingPolicy", sub: "interface", tone: "gold" },
                    { label: "StandardPricing" },
                    { label: "PartnerPricing" },
                ],
            },
            {
                kind: "flow",
                caption: "Adapter + port: translate a vendor shape and its errors into the app's own.",
                steps: [
                    { label: "MetalsProvider", sub: "wants spot prices" },
                    { label: "MetalPriceApiPort", sub: "app-owned contract", tone: "gold" },
                    { label: "MetalPriceApiClient", sub: "HTTP, retries, vendor errors", tone: "muted" },
                ],
            },
            {
                kind: "flow",
                caption: "Caching proxy: same interface, controlled access. Needs key ownership, TTL and invalidation.",
                steps: [
                    { label: "Caller" },
                    { label: "CacheAsideStore", sub: "checks Redis first", tone: "gold" },
                    { label: "Source of truth", sub: "Prisma on a miss", tone: "muted" },
                ],
            },
            {
                kind: "table",
                head: ["Pattern", "Signal to use it", "In Goldilocks"],
                rows: [
                    ["Strategy", "Several real algorithms for one operation.", "Candidate: market modes, auth providers."],
                    ["Factory", "Construction depends on a validated discriminator.", "`useFactory` providers for config-driven wiring."],
                    ["Adapter", "External shape doesn't match your contract.", "`MetalPriceApiClient`, `OpenAiLlmClient`, `SupabaseAuthProvider`."],
                    ["Facade", "One cohesive operation over a subsystem.", "An exported feature service, e.g. `MarketDataService`."],
                    ["Decorator / Proxy", "Wrap behaviour behind the same interface.", "`CacheAsideStore`; Nest interceptors wrap requests."],
                    ["Observer / events", "A fact happened; independent reactions follow.", "Not used yet; in-process only unless durable."],
                    ["Command", "A named request benefits from a handler or audit trail.", "Not needed; plain services are simpler."],
                    ["Chain of Responsibility", "Ordered processors handle or reject.", "Nest's own guard → pipe → filter chain."],
                    ["Repository", "Collection-like persistence behind the domain.", "`ProductsProvider` plays this role."],
                    ["Unit of Work", "One use case changes several things atomically.", "Planned: audit row + change + cache in one transaction."],
                    ["Transactional outbox", "A DB change and an event must not diverge.", "Phase 2 (hedge, BC writes)."],
                    ["Saga", "A long workflow with compensations.", "Phase 2 only, if partial progress is real."],
                ],
            },
            {
                kind: "md",
                text: "### Before adding any pattern, answer:\n1. What concrete change or failure is hard *today*?\n2. What stays stable and what varies?\n3. Who owns the abstraction?\n4. What new indirection or runtime state appears?\n5. How will tests prove every implementation keeps the contract?\n6. What simpler design was rejected, and why?\n\nNo concrete answers means keep the direct implementation.",
            },
        ],
    },
    {
        id: "smells",
        group: "OOP and SOLID",
        title: "Code smells and refactoring",
        icon: Bug,
        summary: "A smell is a prompt to investigate, not proof of a defect.",
        blocks: [
            {
                kind: "cards",
                cols: 3,
                items: [
                    { title: "God service", tag: "split by change axis", body: "Unrelated dependency clusters, many actors, broad test setup. Candidates on the roadmap: `MetalsProvider`, `KnowledgeService`, `useTradeTools`." },
                    { title: "Leaky adapter", tag: "translate at the edge", body: "SDK response types, ORM errors or HTTP codes inside application code. Convert them to app-owned values at the adapter." },
                    { title: "Shotgun surgery", tag: "find the owner", body: "One rule change edits controllers, services and several modules. Centralise the knowledge in one owner." },
                    { title: "Primitive obsession", tag: "value objects", body: "Repeated parsing, mixed units, currency bugs around one primitive. Wrap only where it protects a real invariant." },
                    { title: "Repeated conditional", tag: "one place", body: "The same `switch` on type/region in many places. Select a strategy in one spot; a single stable switch can stay." },
                    { title: "Circular dependency", tag: "repair ownership", body: "Extract a coordinator, expose a narrow read port, or swap a reverse call for an event. `forwardRef` only as a documented bridge." },
                    { title: "Hidden service locator", tag: "declare it", body: "Business code calling `ModuleRef.get`. Declare constructor dependencies instead." },
                    { title: "Boolean flag arguments", tag: "name the operation", body: "A flag that changes what a method does. Use named operations or strategies if the variants are real." },
                    { title: "Speculative generality", tag: "delete it", body: "Unused interfaces, factories, registries for one imagined consumer. Git keeps the option." },
                ],
            },
            {
                kind: "flow",
                caption: "The safe refactoring loop.",
                steps: [
                    { label: "Pin behaviour", sub: "test or trace" },
                    { label: "One structural change" },
                    { label: "Keep contracts stable" },
                    { label: "Narrow test, then boundary tests", tone: "gold" },
                    { label: "Remove transitional code" },
                ],
            },
            {
                kind: "callout",
                tone: "good",
                text: "Prefer a sequence of reversible refactors over a pattern rewrite. The code-health items in roadmap **0.14** each list their characterisation tests first for exactly this reason.",
            },
        ],
    },
]
