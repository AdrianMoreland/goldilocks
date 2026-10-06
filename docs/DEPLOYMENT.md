# Deployment and future hardening

Split out of `docs/ENGINEERING.md` (§13 and §14) so the engineering guide that is read in every session stays short. Section numbers are kept so existing references still resolve.

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
TRUST_PROXY_HOPS=       # optional; proxies in front of the API (Railway: 1, the default). The rate limiter keys on the client IP, so a wrong value either throttles everyone together or lets a client forge its address
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

Listed so they aren't added prematurely, and so they're easy to pick up later:

- **Helmet** (`app.use(helmet())`) for security headers.
- **Rate limiting** (`@nestjs/throttler`) on `/auth/login` at minimum.
- **Sentry** or similar error tracking.
- **API versioning** (`app.enableVersioning(...)`) — irrelevant with one internal client; do this only if a second consumer of the API ever appears.
- A real secrets manager (Railway env vars are fine below a certain team size; revisit if this moves to a platform with more than a couple of people touching production config).
- Health-check endpoints (`GET /health`, `GET /health/db`) if this ever needs uptime monitoring.

---
