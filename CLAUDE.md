# CLAUDE.md

Project guide for Claude (and anyone else) working in this repository — code organization, conventions, security practices, and the current deployment setup. Adapted from a general best-practices guide to match what this project actually is and actually uses; where the two disagree, this file wins.

---

## 1. What this project is

**Merrion Gold Pricing Workbook** — an internal pricing/trading dashboard for an Irish bullion dealer, ported from a Google Apps Script tool the business used previously. It shows live metal spot prices, a per-product pricing table (premiums/discounts/VAT), a trade calculator, a portfolio builder, tax reference calculators, and an admin-gated pricing editor.

**⚠️ Scope rule — read this first:** `apps/web` was bootstrapped from a generic shadcn-store admin dashboard template. Only the **`/dashboard`** route (`apps/web/src/app/dashboard/**`), the **Knowledge Center** (`/knowledge`, `apps/web/src/app/knowledge/**`) and the admin-only **Admin Console** (`/admin`, `apps/web/src/app/admin/**`) are this project. Every other page under `apps/web/src/app/*` (mail, tasks, chat, calendar, users, FAQs, pricing, all the `/auth/sign-in-2`/`-3` variants, `/dashboard-2`, the old `apps/web/src/admin/` scaffold, etc.) is unused template filler. **Do not read, "fix", or refactor those pages unless the user explicitly asks about one by name.** Assume the real product is Dashboard + everything it renders (header, cards, chart, product table, the right-hand Pricing Tools panel, and the auth pages that actually gate it: `/auth/sign-in`).

---

## 2. Tech stack

pnpm workspace monorepo, orchestrated with Turborepo (`turbo.json`, root scripts `pnpm dev` / `pnpm build` / `pnpm check-types`).

| Package | Stack |
|---|---|
| `apps/api` | NestJS 11, Prisma 7 (Postgres via Supabase), Redis (cache-aside), `nestjs-zod` for DTOs, Supabase Auth |
| `apps/web` | React + **Vite** (not Next.js, despite the `app/` folder naming), React Router, TanStack Query + TanStack Table, shadcn/ui + Radix, Tailwind CSS v4 |
| `packages/shared-types` | Zod schemas + pure pricing math, built with `tsup` |
| `packages/typescript-config` | Shared `tsconfig` bases |

**`shared-types` is consumed from `dist/`, not `src/`.** Any change there requires `pnpm --filter @goldilocks/shared-types build` before the API or web app will see it. If the API is running with `--watch`, it will not pick up a new `dist/` on its own — it needs a manual restart (webpack doesn't watch `node_modules`).

---

## 3. Code organization

The backend already follows feature-based structure — keep it that way:

```
apps/api/src/modules/
├── auth/
│   ├── auth-provider.port.ts       # interface — see §6
│   ├── providers/supabase-auth.provider.ts
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   └── auth.module.ts
├── products/
├── trade/
├── portfolio/
├── metals/
├── market-data/
├── admin/            # /admin console: health (Terminus), request/login history (Redis hourly buckets), pino log buffer, endpoint catalogue, DB browser
├── knowledge/        # SOPs (roadmap 1.4) — source files in docs/sops/, loaded with `pnpm --filter api kb:import`
└── ai/               # internal assistant (roadmap 1.5) — plan in docs/AI-AGENT-PLAN.md; model behind infrastructure/llm (LlmPort)
```

`pnpm --filter api ai:eval` runs the golden questions (`modules/ai/eval`) through the real model; it spends a few cents, so it is opt-in. The assistant's live lookups live in `modules/ai/tools/` (one class per tool, listed under the `AI_TOOLS` token); they read prices through `MarketDataService.getPricedCatalogue()`, never the providers directly (§2 boundary).

The Knowledge Center's parsing rules (frontmatter, section anchors, `[[slug#section]]` links, `[TODO: …]` detection, search) are pure functions in `packages/shared-types/src/kb-*.ts`, used by the importer and the web reader alike. The SOP file format is specified in `docs/sops/00-README.md`; SOP content is the owners' to edit — don't rewrite it.

Frontend dashboard code mirrors this under `apps/web/src/app/dashboard/components/<feature>/` (`pricing-tools/`, `table/`), with cross-cutting state in `apps/web/src/app/dashboard/context/` (pricing tools panel state, pricing-settings/market-mode state) and `apps/web/src/contexts/` (app-wide: auth, theme, sidebar).

### Naming

- Files: kebab-case with a descriptive suffix — `auth.service.ts`, `jwt-auth.guard.ts`, `use-trade-tools.hook.ts`, `product-columns.tsx`.
- Classes / React components: PascalCase — `AuthService`, `JwtAuthGuard`, `TradeTab`.
- Variables/functions: camelCase. Constants that are truly fixed: `UPPER_SNAKE_CASE` (`GRAMS_PER_TROY_OUNCE`, `PORTFOLIO_MAX_QTY`).

---

## 4. Validation — Zod, not class-validator

This project uses **`nestjs-zod`**, not `class-validator`/`class-transformer`. Every schema lives in `packages/shared-types` (one Zod schema, shared by both apps and the DTO layer) — don't introduce `class-validator` decorators or a parallel validation system.

```ts
// packages/shared-types/src/trade.schema.ts
export const TradeCartRequestSchema = z.object({
  metalType: MetalTypeEnum,
  transactionType: TradeTransactionTypeEnum,
  customSpot: z.number().positive().optional(),
  items: z.array(TradeCartItemSchema),
});
export type TradeCartRequest = z.infer<typeof TradeCartRequestSchema>;
```

```ts
// apps/api/src/common/dto/dtos.ts — one place, wraps every schema as a NestJS DTO
export class TradeCartRequestDto extends createDto(TradeCartRequestSchema, 'TradeCartRequestDto') {}
```

`main.ts` registers `app.useGlobalPipes(new ZodValidationPipe())` globally — a `@Body() body: SomeDto` parameter is validated automatically. Route params are **not** covered by this pipe — always add `ParseIntPipe` explicitly for numeric path params (`@Param('id', ParseIntPipe) id: number`). Forgetting this was a real bug found in this codebase: an unparsed string `id` reached Prisma's `Int` field and threw, surfacing only as a generic 500.

---

## 5. Error handling

Same as any NestJS app — throw specific built-in exceptions, never a bare `Error`:

```ts
if (!product) throw new NotFoundException(`Product ${id} not found.`);
if (!isAdmin) throw new ForbiddenException('Insufficient permissions');
```

Validate business rules in the **service** layer, not the controller (see `TradeService.calculateCart`'s percent validation, `PortfolioService.buildPortfolio`'s empty-catalogue checks).

Auth failures use one generic message regardless of cause (already implemented in `AuthService`/`SupabaseAuthProvider`): `"Invalid email or password"` for bad login, `"This account is not set up for this application."` for a valid Supabase identity with no matching local `User` row — never leak which one it was.

---

## 6. Auth architecture — provider-agnostic by design

There is no OAuth and no public self-registration. This is a closed internal tool with a small, known set of staff accounts, provisioned once via `apps/api/prisma/provision-users.ts` (creates the Supabase Auth identity + a matching Prisma `User` row with the **same id**).

The identity provider is deliberately abstracted so it can be swapped later without touching call sites:

```ts
// apps/api/src/modules/auth/auth-provider.port.ts
export interface AuthProviderPort {
  signInWithPassword(email: string, password: string): Promise<AuthSession>;
  verifyToken(token: string): Promise<AuthIdentity>;
}
export const AUTH_PROVIDER = Symbol('AUTH_PROVIDER');
```

`AuthService` only ever depends on `AUTH_PROVIDER` (`@Inject(AUTH_PROVIDER)`), never on Supabase directly. `SupabaseAuthProvider` is the current implementation (`apps/api/src/modules/auth/providers/supabase-auth.provider.ts`), bound in `auth.module.ts`:

```ts
{ provide: AUTH_PROVIDER, useClass: SupabaseAuthProvider }
```

**To replace the provider later:** write one new class implementing `AuthProviderPort`, change that one binding. Nothing else — not the guards, not the frontend — needs to know.

On the frontend, the same rule holds one level up: `apps/web/src/contexts/auth-context.tsx` calls only this app's own `/auth/login` + `/auth/me`, never Supabase directly. `@supabase/supabase-js` is not and should not become a frontend dependency.

### Role/admin gating

`User.role` (`ADMIN | MANAGER | SALES | ACCOUNTING | AUDITOR`) and `User.admin` (boolean) live on the Prisma `users` table — **not** in a Supabase `profiles` table (an earlier draft of `RolesGuard` assumed one existed; it didn't, and every admin route was silently forbidden until that was fixed). `JwtAuthGuard` attaches the full Prisma `User` row to `request.user`; `RolesGuard` + `@Roles('admin')` check `request.user.admin` directly.

**The server-side guard is the actual security boundary.** The dashboard's admin-mode toggle (shield icon, only rendered for `isAdmin` users) is a UI convenience for *discoverability* — hiding the "⋮" edit menu for non-admins — not the enforcement. A non-admin hitting the endpoint directly gets a real `403`, verified in this codebase via `curl`, not assumed.

### Secrets

- Never expose `password` on a `User` — it's stored as an empty string anyway (Supabase owns the real credential); select it out of any response that isn't strictly internal.
- `.env` is gitignored per app (`apps/api/.gitignore`) — never commit one. There is currently **no root `.gitignore`**; if you add secrets anywhere outside `apps/api` or `apps/web`, check they're covered.
- Supabase now issues two key formats — legacy JWT-style anon/service-role keys, and the newer `sb_publishable_...` / `sb_secret_...` pair. This project uses the new format (`SUPABASE_KEY` / `SUPABASE_ANON_KEY` / `SUPABASE_SERVICE_ROLE_KEY` in `apps/api/.env`). If a Supabase call fails with "Invalid API key," check for a literal placeholder value before assuming code is broken — that was the actual cause once already.

---

## 7. Database (Prisma)

- **Currency and weight fields are `Decimal`, never `Float`** — already correct throughout `schema.prisma` (`spreadBuy`, `spreadSell`, `vatRate`, `weight` are all `@db.Decimal(...)`). Keep it that way for any new numeric pricing field.
- Indexes already exist where they matter: `Product` has `@@index([metalType])`, `@@index([metalType, stock])`, `@@index([sku])`. Add an index when a new query filters/sorts by a field at any real scale.
- Pagination is **not** implemented anywhere and isn't needed yet — the product catalogue is ~150 rows. Revisit if that changes materially.
- Prefer `Promise.all` for independent reads (see `TradeService.getBootstrap`, which fetches spot price and products in parallel).
- Two connection strings are configured on purpose: `DATABASE_URL` (pooled, port 6543, for normal queries) and `DIRECT_URL` (port 5432, for migrations). Don't collapse them to one.

---

## 8. Caching

Redis caching is already implemented via a shared base class, not ad hoc — new cacheable resources should follow the same pattern rather than reinventing it:

```ts
// apps/api/src/common/cache/cache-aside-store.base.ts
export abstract class CacheAsideStore<TKey, TValue> {
  protected abstract cacheKey(key: TKey): string;
  protected abstract fetchFromSource(key: TKey): Promise<TValue>;
  // get() = cache hit or fetch+populate; callers never see the cache directly
}
```

Existing consumers: `ProductCacheStore` (5-minute TTL on the full product list), `SpotPriceCacheStore`. **A write that bypasses the API (a raw Prisma script, a direct DB edit) does not invalidate this cache** — the product list can look stale for up to 5 minutes after such a write. If you ever seed/update products directly against the database, either wait out the TTL or clear the `products:all` Redis key manually.

---

## 9. Frontend conventions

- Server state lives in TanStack Query (`useQuery`/`useMutation`), never duplicated into `useState`. Query keys are centralized in `apps/web/src/lib/query-keys.ts`.
- Cross-cutting UI state (which pricing-tools tab is open, admin mode, selected metal) lives in React Context, not prop-drilled — see `pricing-tools-context.tsx`, `pricing-settings-context.tsx`, `auth-context.tsx`.
- API calls are grouped per resource in `apps/web/src/api/*.api.ts`, each exposing a `useXApi()` hook built on the shared `useApiClient()` (which validates every response against the resource's Zod schema from `shared-types`).
- After any admin write that should be reflected immediately, invalidate the relevant query (`queryClient.invalidateQueries({ queryKey: queryKeys.marketData.all })`) rather than trusting a stale cache to expire on its own.
- Tailwind v4: prefer standard spacing utilities (`top-14`) over the `top-(--css-var)` parenthesis shorthand for positional properties — the latter has produced wrong computed values in this codebase for no clear reason. When something needs to track the real viewport (a chart height, a side panel width) prefer a CSS `clamp()`/`min()` expression over a fixed pixel value, so it degrades instead of breaking on an unusually small or large window.

---

## 10. Testing

**Current state: the API has a Jest suite (`pnpm --filter api exec jest`, ~470 tests) and `packages/shared-types` has specs for the pricing math and the Knowledge Center parsers. The web app has no tests yet.** Run the suite before claiming a backend change works, and don't claim something is "tested" unless a test covers it. The patterns below are the target for new logic.

```ts
describe('TradeService', () => {
  describe('calculateCart', () => {
    it('computes a line total from spot, weight, and premium', async () => { /* Arrange/Act/Assert */ });
    it('rejects a negative discount', async () => {
      await expect(service.calculateCart(badDto)).rejects.toThrow(BadRequestException);
    });
  });
});
```

Mock `PrismaService` at the provider boundary, not deeper:

```ts
const mockPrisma = { product: { findMany: jest.fn(), update: jest.fn() } };
const module = await Test.createTestingModule({
  providers: [ProductsService, { provide: PrismaService, useValue: mockPrisma }],
}).compile();
```

When a real suite exists, aim for: critical pricing math (`pricing-math.ts`, `portfolio-builder-math.ts`) at or near 100%, service-layer business logic ~80%, controllers as thin pass-throughs need the least direct coverage.

---

## 11. Git workflow

**Conventional Commits**, adopted from this point forward (the repo's only prior commit predates this convention — don't rewrite it):

```
feat(trade): add melt calculator category presets
fix(products): parse :id as an integer before the Prisma lookup
docs(readme): document the pricing-sheet sync script
refactor(auth): extract AuthProviderPort so Supabase is swappable
```

Branches: `feature/<name>`, `fix/<name>`, `docs/<name>`, off `master` (this repo's default branch — there is no separate `main`).

Prefer atomic commits — one logical change per commit — over one large "fixed stuff" commit. Only commit when the user asks; this repo's working agreement (see the session history) is that Claude does not commit proactively.

---

## 12. Documentation standards

- Comment the **why**, never the **what** — identifiers should already say what the code does. A comment earns its place by explaining a non-obvious constraint, a workaround, or a decision that would otherwise look arbitrary (see `pricing-settings-context.tsx`'s comment on why Shortage mode moves the discount in the *opposite* direction from Weekend/Volatile — that's a business rule from the source spreadsheet, not obvious from the code alone).
- Swagger is already live at `/docs` (and `/docs-json`) — `ApiTags`/`ApiOperation`/`ApiBearerAuth` are already used on most controllers; keep adding them to new admin/auth endpoints.

---

## 13. Deployment — current setup (simple, for the initial demo)

This section describes what's actually deployed **today**, not a target architecture. It intentionally skips Docker, a secrets manager, Sentry, rate limiting, and API versioning — those are real production concerns for later, once this is more than an internal two-person tool being shown to one stakeholder. See §14 for what "later" should add.

### Platform: Railway, two services in one project

1. **API service** — `apps/api`, built with `pnpm --filter api build`, started with `pnpm --filter api start:prod`.
2. **Web service** — `apps/web`, a static Vite build (`pnpm --filter web build` → serve `dist/`).

### Data & auth: already hosted, nothing new to stand up

- **Postgres + Auth**: Supabase (already configured — `DATABASE_URL`/`DIRECT_URL` point at it, and Supabase Auth holds the two staff accounts). Nothing changes for deployment; the same project serves both dev and this demo.
- **Redis**: `apps/api/.env` currently points at `redis://127.0.0.1:6379` — a **local-only** address that will not resolve on Railway. Before deploying, add Railway's Redis plugin (or reuse an existing Upstash instance) and set `REDIS_URL` to that real address. This is a required step, not optional — the product/spot-price cache-aside store will fail without it.

### Environment variables to set on the API service

```
DATABASE_URL=
DIRECT_URL=
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_KEY=
METALPRICE_API_KEY=
REDIS_URL=              # ← must be a real host, see above
PORT=4000
NODE_ENV=production
SWAGGER_ENABLED=        # optional; /docs is off in production unless this is "true"
AI_ENABLED=             # optional; the AI assistant is off unless this is exactly "true"
OPENAI_API_KEY=         # only required when AI_ENABLED=true; a dedicated project key with a spend limit
AI_MODEL=               # optional; defaults to gpt-4o-mini
AI_MAX_OUTPUT_TOKENS=   # optional; defaults to 600
AI_DAILY_QUOTA_PER_USER= # optional; 50 questions per user per Irish day
AI_PER_MINUTE_LIMIT=    # optional; 5 per user per minute
AI_DAILY_BUDGET_USD=    # optional; 2 — company-wide daily ceiling, then the assistant pauses
AI_LOG_RETENTION_DAYS=  # optional; 90
LOG_LEVEL=              # optional; pino level, defaults to info
SPOT_PRICE_RETENTION_DAYS= # optional; days of metal_spot_prices ticks kept (default 7)
AI_CACHE_TTL_DAYS=      # optional; 7
AI_PRICE_PER_MILLION=   # optional; "input,cachedInput,output" USD per million tokens, for a model the price table doesn't know
```

### Environment variables to set on the Web service (build-time, Vite)

```
VITE_API_URL=https://<the-api-service>.up.railway.app
```

### One real code change needed before this works cross-origin

`apps/api/src/main.ts` currently hardcodes CORS to `http://localhost:5173`:

```ts
app.enableCors({ origin: ['http://localhost:5173'], credentials: true });
```

This must read from an env var (e.g. `FRONTEND_URL`) before the Railway-hosted frontend can call the Railway-hosted API — flag this to the user as a required fix, don't just deploy and let it silently CORS-fail.

### Not doing yet (intentionally)

- No Docker/Dockerfile — Railway builds directly from the repo.
- No secrets manager — Railway's own encrypted environment variables are enough at this scale.
- No health-check endpoints, Sentry, Helmet, or rate limiting yet (see §14).
- No custom domain — Railway's generated `*.up.railway.app` URLs are fine for a demo.

---

## 14. Future hardening (not needed yet — revisit if this becomes customer-facing)

Listed so Claude doesn't add these prematurely, and so they're easy to pick up later:

- **Helmet** (`app.use(helmet())`) for security headers.
- **Rate limiting** (`@nestjs/throttler`) on `/auth/login` at minimum.
- **Sentry** or similar error tracking.
- **API versioning** (`app.enableVersioning(...)`) — irrelevant with one internal client; do this only if a second consumer of the API ever appears.
- A real secrets manager (Railway env vars are fine below a certain team size; revisit if this moves to a platform with more than a couple of people touching production config).
- Health-check endpoints (`GET /health`, `GET /health/db`) if this ever needs uptime monitoring.

---

## 15. Notable pattern worth reusing: DI + strategy pattern

`AuthProviderPort` (§6) is the cleanest example in this codebase of NestJS dependency injection used for its actual purpose — decoupling a concrete integration (Supabase) from the code that depends on it, via an interface + a DI token:

```ts
export const AUTH_PROVIDER = Symbol('AUTH_PROVIDER');

@Injectable()
export class AuthService {
  constructor(@Inject(AUTH_PROVIDER) private readonly authProvider: AuthProviderPort) {}
}

// auth.module.ts
{ provide: AUTH_PROVIDER, useClass: SupabaseAuthProvider }
```

Reach for this shape again anywhere a third-party integration (a metals price API, a payment provider, a notification service) needs to be swappable without a rewrite — not for every dependency, just the ones with a real chance of changing.

---

## 16. Operational notes learned the hard way

- **After editing `packages/shared-types`**, run `pnpm --filter @goldilocks/shared-types build` — consumers read `dist/`, not `src/`. A running `--watch` API process needs a manual restart to see the new `dist/`.
- **A raw script against Prisma bypasses the Redis cache** (§8) — the dashboard can show stale data for up to 5 minutes after a direct DB write until the TTL expires, or until the key is cleared manually.
- **Numeric route params need `ParseIntPipe` explicitly** — the global Zod pipe validates `@Body()`, not `@Param()`. This caused a real, silent 500 on the product-pricing-update endpoint.
- **Tailwind's `top-(--css-var)` shorthand has misbehaved** for positional properties in this codebase (resolved to the wrong value for no clear reason) — prefer a plain utility class or a `clamp()`/`min()` expression instead.

---

## 17. Roadmap — `docs/ROADMAP.md` is the planning source of truth

The full, merged roadmap (Phase 0 harden/polish → Phase 1 internal features + branch rollout → Phase 2 separate customer site/eshop at `apps/site`) lives in [`docs/ROADMAP.md`](docs/ROADMAP.md). Use it like this:

- **When the user asks "what's next", or proposes a feature,** locate it in the roadmap first (by ID, e.g. `1.8 Hedge control`), state its phase/priority/dependencies, and flag if it skips an unmet `← depends:` or 2.0-style prerequisite.
- **Respect the ground rules at the top of the roadmap**, especially: Business Central is the system of record (no invoicing/CRM module in Goldilocks; formal quotes/orders are written to BC via its API); money uses `decimal.js`/`Decimal`; shared pricing logic lives in `packages/shared-types`; AI/market output is labelled and never predictive.
- **Scope rule (§1) still applies:** roadmap items refer to the `/dashboard` product and the API, not the unused template pages.
- **Statuses can lag the repo.** Verify in code before saying an item is done or missing; when you finish or discover a finished item, tick it (`[x]`) in `docs/ROADMAP.md` in the same change and mention it. Do not reorder phases or re-prioritise without the user's say-so.
- New ideas go in the matching section (or the Icebox) with priority + effort tags; keep the Notion-pasteable nested-checkbox format.

---

## 18. NestJS engineering skills (`.claude/skills/nestjs-*`)

Six skills from [amirtaherkhani/nestjs-agent-skills](https://github.com/amirtaherkhani/nestjs-agent-skills) v2.1.0 (MIT) are installed, unmodified except that their `evals/` and Codex-only `agents/` folders were dropped. **`.claude/` is gitignored, so they are local-only** — reinstall with `npx skills add amirtaherkhani/nestjs-agent-skills` (then delete `nestjs-git-commit-pr-message`, see below). Don't edit the skill files; put project-specific overrides here so upstream updates stay clean.

### Which skill owns what

| Task | Skill |
|---|---|
| Implement / fix / refactor anything in `apps/api` or `packages/shared-types` (default lead) | `nestjs-professional-software-engineering` |
| Module boundaries, dependency direction, data/transaction ownership, BC/port boundaries, "should this be a service/worker?" | `nestjs-architecture-principles` |
| Class/provider responsibilities, SOLID, choosing a pattern (strategy, adapter…) | `nestjs-oop-design-patterns` |
| Guards/pipes/filters, error contracts, security, caching, queues (BullMQ), SSE, observability, performance, deployment | `nestjs-features-performance` |
| Read-only whole-API review | `nestjs-code-audit` |
| "Is feature X done per the roadmap?" | `nestjs-feature-audit` |

Typical mapping to the roadmap: 0.6/0.7 (security, reliability) → features-performance; 1.8/1.9 (hedge, audit hub, BC integration) → architecture first, then implementation; Phase 2 `apps/site` and any extraction of `apps/worker` → architecture-principles **before** any code.

### Not installed, on purpose

`nestjs-git-commit-pr-message` conflicts with §11 (Conventional Commits, and Claude commits/pushes **only when asked**). Do not add it back without changing §11.

### Project rules that override skill defaults (CLAUDE.md wins)

- **Validation is Zod via `nestjs-zod` (§4), error handling per §5.** Ignore any skill suggestion of `class-validator`, `class-transformer`, or a different DTO system. Numeric route params still need `ParseIntPipe`.
- **Architecture baseline is the existing modular monolith (§3):** feature modules, Prisma used directly in services, one `AuthProviderPort`-style port only where a third-party integration is genuinely swappable (§15, e.g. BC, Open Banking, hedge platform). Do **not** introduce repositories, CQRS, Clean-Architecture layers or microservices because a skill lists them; the skills' own rule is to justify each from a real constraint, and the roadmap's "Scaling triggers" already define when to split.
- **Scope (§1) still applies:** audits and refactors cover `apps/api`, `packages/shared-types`, and the `/dashboard` frontend only — never the template pages.
- **Business Central is the system of record** (`docs/ROADMAP.md` ground rules): skills must not propose local invoice/customer ledgers.
- **The default branch is `master`**, not `main`. `nestjs-feature-audit` defaults to `main` — always pass `--branch master` (or the branch under review), e.g. `$nestjs-feature-audit "hedge control" --branch master`.
- **Roadmap source for feature audits is `docs/ROADMAP.md`.** It satisfies the skill's roadmap gate; name the section (e.g. `1.8`) so the audit scopes to it. The skill will stop on a dirty worktree instead of switching branches — commit or ask before auditing; it must never stash or reset.
- Audits are **read-only**; fixing findings needs a separate request, and ticking roadmap checkboxes follows §17.

### Running `nestjs-code-audit` here (Windows + pnpm monorepo)

- Target `apps/api`: `node .claude/skills/nestjs-code-audit/scripts/collect-quality-evidence.mjs --root apps/api --run`.
- **The collector cannot launch `eslint.cmd`/`tsc.cmd` on Windows** (Node `EINVAL`), so both gates report "not run". Run them directly instead and report the exact commands/results, both read-only:
  ```
  pnpm --filter api exec tsc --noEmit --pretty false --incremental false
  node apps/api/node_modules/.bin/eslint apps/api/src --no-fix --no-cache
  ```
  Never use the `lint` script for auditing — it passes `--fix`.
- **Baseline when installed (2026-09-30, working tree at that time):** `tsc` passed; ESLint reported ~2,870 problems, ~2,830 of them `prettier/prettier` and ~45 real `@typescript-eslint` findings. The Prettier noise was mostly indentation (code is 4-space, Prettier defaulted to 2), not CRLF. **Resolved the same day:** `apps/api/.prettierrc` now sets `tabWidth: 4` / `endOfLine: auto`, the tree was formatted once, and ESLint reports 0 problems. Any non-zero count is a regression.
- **Run ESLint from `apps/api`** (`cd apps/api && node node_modules/eslint/bin/eslint.js src --no-fix --no-cache`): the flat config lives there, and `node_modules/.bin/eslint` is a shell shim that Node can't execute directly.
- Heuristic candidates seen by the collector (to verify, not findings): 6× `HttpException` imports, 2× `@Global()`, 2× `process.on(uncaughtException|unhandledRejection)`.
