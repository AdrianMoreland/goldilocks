# CLAUDE.md

Project guide for Claude (and anyone else) working in this repository — code organization, conventions, security practices, and the current deployment setup. Adapted from a general best-practices guide to match what this project actually is and actually uses; where the two disagree, this file wins.

---

## 1. What this project is

**Merrion Gold Pricing Workbook** — an internal pricing/trading dashboard for an Irish bullion dealer, ported from a Google Apps Script tool the business used previously. It shows live metal spot prices, a per-product pricing table (premiums/discounts/VAT), a trade calculator, a portfolio builder, tax reference calculators, and an admin-gated pricing editor.

**⚠️ Scope rule — read this first:** `apps/web` was bootstrapped from a generic shadcn-store admin dashboard template. Only the **`/dashboard`** route (`apps/web/src/app/dashboard/**`) is this project. Every other page under `apps/web/src/app/*` (mail, tasks, chat, calendar, users, FAQs, pricing, all the `/auth/sign-in-2`/`-3` variants, `/dashboard-2`, the `admin/` scaffold, etc.) is unused template filler. **Do not read, "fix", or refactor those pages unless the user explicitly asks about one by name.** Assume the real product is Dashboard + everything it renders (header, cards, chart, product table, the right-hand Pricing Tools panel, and the auth pages that actually gate it: `/auth/sign-in`).

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
└── market-data/
```

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

**Current state: there is no automated test suite in this repo.** Treat the patterns below as the target to write *toward* as new logic is added — don't assume a suite exists that you can run, and don't claim something is "tested" unless you wrote the test yourself in the same change.

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
