# Deployment and future hardening

Split out of `docs/ENGINEERING.md` (§13 and §14) so the engineering guide that is read in every session stays short. Section numbers are kept so existing references still resolve.

---

## 13. Deployment — current setup (simple, for the initial demo)

This section describes what's actually deployed **today**, not a target architecture. It intentionally skips Docker, a secrets manager, Sentry and API versioning — those are real production concerns for later, once this is more than an internal two-person tool being shown to one stakeholder. See §14 for what "later" should add.

### Platform: Railway, services in one project

1. **API service** — `apps/api`, built with `pnpm --filter api build`, started with `pnpm --filter api start:prod`.
2. **Web service** — `apps/web`, a static Vite build (`pnpm --filter web build` → serve `dist/`).
3. **Redis** — Railway's Redis service; its address is the API's `REDIS_URL`.

### Data & auth: already hosted, nothing new to stand up

- **Postgres + Auth**: Supabase (already configured — `DATABASE_URL`/`DIRECT_URL` point at it, and Supabase Auth holds the two staff accounts). Nothing changes for deployment; the same project serves both dev and this demo.
- **Redis**: a local `apps/api/.env` points at `redis://127.0.0.1:6379`, which will not resolve on Railway. The API service must have `REDIS_URL` set to the Railway Redis address; the product and spot-price cache-aside stores fail without it.

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
FRONTEND_URL=           # allowed CORS origin(s), comma-separated; defaults to http://localhost:5173
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

### CORS

`apps/api/src/main.ts` reads the allowed origin(s) from `FRONTEND_URL` (comma-separated, default `http://localhost:5173`). Set it on the API service to the web service's URL, or the browser blocks every call from the deployed frontend.

### Not doing yet (intentionally)

- No Docker/Dockerfile — Railway builds directly from the repo.
- No secrets manager — Railway's own encrypted environment variables are enough at this scale.
- No Sentry yet (see §14). Helmet, rate limiting (`@nestjs/throttler`, per user) and `GET /health` already exist.
- No custom domain — Railway's generated `*.up.railway.app` URLs are fine for a demo.

---

## 14. Future hardening (not needed yet — revisit if this becomes customer-facing)

Helmet, rate limiting and `GET /health` are already done (see §13). Still open:

- **Sentry** or similar error tracking.
- **API versioning** (`app.enableVersioning(...)`) — irrelevant with one internal client; do this only if a second consumer of the API ever appears.
- A real secrets manager (Railway env vars are fine below a certain team size; revisit if this moves to a platform with more than a couple of people touching production config).
- A database health check (`GET /health/db`) and external uptime monitoring, if this needs them; `GET /health` already exists.
