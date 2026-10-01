# Internal AI agent — implementation plan (roadmap 1.5)

Status: **phases 1 and 2 built, and phase 3 partly (live prices and reply drafts; branch data not yet)** (core, a dev chat box, quotas, cost and question log, scrubber, answer cache, SSE endpoint; open to all signed-in staff since 2026-10-01, behind `AI_ENABLED`). The evaluation passes 13–15 of 15 cases per run on gpt-4o-mini, varying run to run, so the model choice is still open. Phases 3–5 not started. Depends on 1.4 (Knowledge Center), which is done.
Written 2026-09-30. Read with `CLAUDE.md` (§4 validation, §5 errors, §15 ports, §18 skills) and `docs/ROADMAP.md` ground rules.

---

## 1. What we're building

A staff assistant inside the Knowledge Center that answers a question **only from approved SOPs**, **always cites the section** it used, and can look up live spot, a product's current Price/Buyback, and a branch's details through read-only tools. Every answer is labelled AI-generated.

Not in scope now: multi-turn chat, RAG/vector search (seam left for it), customer-facing use, writing anything back to BC or the database from a tool.

## 2. Decisions

| # | Question | Decision |
|---|---|---|
| 1 | Model and key | A **new dedicated OpenAI project key**, with a monthly spend limit set in OpenAI's dashboard first. Start with a **small model**. Default `gpt-4o-mini` (non-reasoning, so cost is predictable); `gpt-5-nano` is cheaper but reasoning models bill hidden reasoning tokens — evaluate it later. Model is an env var, not code. |
| 2 | Conversation | **Single question → single answer.** No history is sent. Follow-ups are a later extension. |
| 3 | Storing answers | Store answers so identical questions can be served from cache, **but** customer names are scrubbed before anything is stored and **live prices are never stored** (§7). |
| 4 | `getBranch` data | **Add phone, opening hours and region to the `branches` table** (migration + admin form). The tool reads the database; the branch-directory SOP stays the human-readable fallback. |
| 5 | Throttling | **Redis-based limiter inside `QuotaService`**, not `@nestjs/throttler` (§8 explains why). Revisit the throttler with roadmap 0.6. |
| 6 | OpenAI terms | Confirmed by the owner: the current API data-retention and training terms are acceptable for internal use. |

## 3. Architecture

Baseline: a NestJS modular monolith; Prisma used directly in services; one port per swappable integration (`AUTH_PROVIDER`, `METAL_PRICE_API`). The AI feature follows that shape.

**Not a microservice, not a new package.** No independent deploy, scaling, data or failure boundary exists: it is an I/O-bound layer over one external API, with one internal client. Revisit only if (a) customer-facing AI appears (roadmap 2.x), (b) long-lived streams start to load the API process, or (c) AI outages must be isolated from pricing. Only the request/stream-event schemas go in `packages/shared-types`, because the web app consumes them.

```
apps/api/src/
  infrastructure/llm/
    llm.port.ts               LlmPort + LLM_PROVIDER token + event types   (DIP: policy depends on this)
    openai-llm.client.ts      the only file that imports the OpenAI SDK     (Adapter)
    llm.module.ts
  modules/ai/
    ai.controller.ts          POST /ai/ask (SSE), POST /ai/feedback, GET /ai/admin/…   (thin adapter)
    ask.service.ts            the use case: limits → cache → context → model loop → validate → log
    sop-context.provider.ts   SopContext port + FullCorpusContext (RAG later = 2nd implementation)
    prompt.builder.ts         pure, deterministic
    citation.validator.ts     pure
    privacy-scrubber.ts       pure (§7)
    cost.calculator.ts        pure (tokens → cost from a price table in config)
    quota.service.ts          Redis counters; fails closed
    answer-cache.service.ts   exact-match cache keyed by corpus hash
    question-log.service.ts   AiQuestionLog
    tools/                    ai-tool.port.ts · get-spot.tool.ts · get-product-price.tool.ts
                              · get-branch.tool.ts · tool.registry.ts
    ai.module.ts
packages/shared-types/src/ai.schema.ts   AskRequest, stream events, feedback
apps/web/…/knowledge/                     Ask panel (designed separately with the Impeccable skill)
```

**Dependency direction** (nothing depends on `AiModule`):
`AiModule → LlmModule, KnowledgeModule, MarketDataModule, BranchesModule, RedisModule, PrismaModule`.

**Write ownership:** `AiModule` owns `AiQuestionLog` and `AiAnswerCache`. `KnowledgeModule` owns SOPs; the AI reads them through a new `KnowledgeService.listApproved()`, never the table.

**Boundary rule to respect:** `MarketDataService` is the only place that knows both Metals and Products. `GetProductPriceTool` therefore calls a new `MarketDataService.priceProduct()`; it does not import both providers.

**SOLID in practice**
- *SRP:* the pure pieces (prompt, citations, scrubber, cost) are separate and unit-tested with no mocks; `AskService` only coordinates.
- *OCP:* a new tool = one new class registered in the `AI_TOOLS` multi-provider. A new retrieval strategy = a second `SopContext`.
- *LSP/ISP:* `LlmPort` is small (stream a completion with messages, tool definitions and limits → async events: text delta, tool call, usage). Tools expose only `name`, `description`, a Zod `schema`, and `run(args)`.
- *DIP:* swapping OpenAI for another vendor is one binding; nothing else knows the SDK exists.
- No repositories, CQRS or layers (CLAUDE.md §18).

## 4. Request flow

```
POST /ai/ask {question}            (global JwtAuthGuard; any signed-in user)
 1. Zod-validate (1–500 chars)                      → 400
 2. QuotaService.check(user)   minute + daily + one open stream      → 429 (fails closed if Redis is down)
 3. Global daily spend breaker                                       → 503 "assistant paused"
 4. Scrub the question (§7); AnswerCache.get(scrubbed, corpusHash)   → hit: stream cached answer, log as 'cached'
 5. SopContext → approved SOPs only → PromptBuilder (deterministic prefix)
 6. LlmPort.stream(...)  tool loop ≤ 3 rounds, output cap, 30 s deadline, AbortController tied to the client
 7. Stream `delta` events to the browser as they arrive
 8. CitationValidator: every [[slug#section]] must exist in the corpus
 9. `done` event {logId, citations, status, cached}; log tokens/cost; store answer only if eligible (§7)
```

**SSE over POST.** `EventSource` cannot POST or send an `Authorization` header, so the endpoint writes `text/event-stream` on a normal POST response and the web app reads it with `fetch`. `AllExceptionsFilter` already guards `headersSent`. Closing the panel aborts the upstream call, so a cancelled answer stops costing tokens.

**Stream events:** `delta {text}` · `tool {name}` · `done {logId, citations[], status, cached}` · `error {code, message}`.

## 5. Answer rules (enforced in code, not only in the prompt)

- Context is **approved SOPs only**. `draft` and `retired` are excluded. Today that is 10 of 12; `limit-orders` and `branch-directory` are drafts until their TODOs are resolved, so the assistant says "not approved yet — ask {owner}".
- A section containing `[TODO]` is given to the model as `NOT CONFIRMED — ask {owner}`, never as content (README rule). "Proposed controls" are labelled as proposals.
- Every answer must cite `[[slug#section]]`. The server validates citations against the corpus; an answer with no valid citation is stored as `uncited`, shown with a warning, and counted in the unanswered report.
- **The model never does arithmetic on prices.** Tools return finished Price/Buyback figures from our own pricing code, with the spot's "as of" time and a stale flag; the model quotes them verbatim (the "Stale Is Loud" principle).
- No predictions or price targets (customer-market-questions SOP). Vocabulary is **Price / Buyback**.
- Questions are untrusted input: tools are read-only, arguments are Zod-validated, the key never leaves the API, output is rendered as sanitised Markdown, citations come from the server's validation.
- Missing knowledge is reported honestly — e.g. `kyc-aml` isn't written yet, so the assistant says so instead of inventing.

## 6. Tools (read-only)

| Tool | Returns | Source |
|---|---|---|
| `getSpot(metal)` | EUR/oz, as-of time, stale flag | `MetalsProvider` (cache-first, no vendor call) |
| `getProductPrice(query)` | Price, Buyback, VAT treatment, spot used, as-of | `MarketDataService.priceProduct()` |
| `getBranch(name)` | address, phone, opening hours, region | `BranchesService` (new columns, §9) |

A question that calls a price tool is **never cached or stored as an answer** (§7).

## 7. Storing answers: privacy and correctness

Purpose: cache repeat questions and feed the unanswered/feedback reports, without keeping customer data or volatile prices.

**PrivacyScrubber** (pure, unit-tested) runs on the question *before* anything is stored or used as a cache key, and again on the answer before it is stored:
- removes email addresses, phone numbers, IBAN-like strings and titles (Mr/Mrs/…);
- replaces capitalised words that are not known vocabulary (built from the SOP text, product names and branch names) with `[customer]`. It over-scrubs on purpose; over-scrubbing is harmless.
- **Numbers are kept.** SOP thresholds matter: "a payout over €50,000" has a different answer from "€5,000". Stripping numbers would make different questions share a cache key and serve a wrong answer.

**What is stored**
- `AiQuestionLog`: scrubbed question, status, cited sections, tool names used (never their results), tokens in/cached/out, cost, latency, model, corpus hash, feedback. Retention default **90 days** (configurable; adjust if the owner wants otherwise).
- `AiAnswerCache`: scrubbed-question key + corpus hash → answer, citations, hit count, TTL 7 days.
- **Never stored:** live prices or any tool output; answers produced with tool calls; the raw question.

**Cache correctness**
- Exact match on the normalised, scrubbed question (lower-case, trimmed, punctuation/whitespace collapsed). No semantic/"similar question" matching yet: a near-match can be the wrong answer.
- The key includes a **corpus hash** (SOP slugs + versions + content hashes), so approving or editing any SOP invalidates the cache automatically.
- Honest expectation: with ~6 users the exact-match hit rate will be modest. The larger saving comes from OpenAI's automatic prompt caching (§8).

## 8. Cost and abuse controls

**Why the cost is low.** The whole approved SOP library is about 6,200 tokens, well under the point where retrieval pays off. Prompt caching is automatic, but only for an **identical prefix**, so the prompt is built in a fixed order: rules → SOP corpus (sorted by slug, no timestamps) → tool definitions → question last.

**Estimate** (6 users × 40 questions/day × 22 days ≈ 5,300/month; ~7,300 tokens in and ~400 out per question). Prices read from OpenAI's pricing page on 2026-09-30 — re-verify before committing:

| Model | Uncached | With prompt caching |
|---|---|---|
| gpt-5-nano ($0.05 in / $0.005 cached / $0.40 out per 1M) | ~$3/mo | ~$1/mo |
| **gpt-4o-mini ($0.15 / $0.075 / $0.60)** | ~$7/mo | ~$5/mo |
| gpt-5.1 ($1.25 / $0.125 / $10) | ~$69/mo | ~$32/mo |
| gpt-4o ($2.50 / $1.25 / $10) | ~$117/mo | ~$77/mo |

Reasoning-style models can add hidden output tokens (billed as output) and tool rounds add a second call; the first evaluation run must measure real usage before we trust these figures.

**Layers of protection**
1. OpenAI dashboard hard monthly limit, on the dedicated project key (set **before** any code runs).
2. Per-user daily quota and per-minute limit, and one open stream per user.
3. Question ≤ 500 chars; output token cap; tool rounds ≤ 3; 30 s deadline; abort on disconnect.
4. Global daily spend breaker computed from the cost log (pauses the assistant, not the app).
5. Cost log on every call; the answer cache serves repeats at zero cost.
6. `AI_ENABLED` feature flag, off by default; the key is only required when it is on.

**Why a Redis limiter instead of `@nestjs/throttler` (decision 5).** We need three things at once — a per-minute window, a per-user *daily* counter, and a concurrent-stream cap — all keyed by user, all sharing state across API replicas. The throttler covers only the first, needs a custom per-user tracker, and adds a dependency. `QuotaService` on Redis does all three with atomic `INCR`/`EXPIRE`. This needs two small methods added to `RedisService` (`incr`, `expire`). If Redis is unavailable the assistant **refuses** rather than running unmetered. Adopt the throttler globally (login, etc.) under roadmap 0.6.

## 9. Data model changes

Two additive migrations (same careful process as the Knowledge Center: idempotent SQL, apply, verify the schema diff is empty, then record with `migrate resolve` — **not** `migrate deploy`, because the migration history table is out of sync with the database).

1. `branches`: add `region` (text), `phone` (text), `openingHours` (text), all nullable. Extend the shared schema, the admin "add branch" form and its API; seed Dublin and Belfast from the branch-directory SOP. (Overlaps roadmap 0.8, multi-branch data model; do not duplicate it.)
2. `ai_question_logs`, `ai_answer_cache` (fields in §7). Indexes on `(createdAt)`, `(userId, createdAt)`, and the cache key.

## 10. Configuration

```
AI_ENABLED=false
OPENAI_API_KEY=            # dedicated project key; API env only, never the web app
AI_MODEL=gpt-4o-mini
AI_MAX_OUTPUT_TOKENS=600
AI_DAILY_QUOTA_PER_USER=50
AI_PER_MINUTE_LIMIT=5
AI_DAILY_BUDGET_USD=2
AI_LOG_RETENTION_DAYS=90
```
New dependency: the official `openai` SDK, used only inside `openai-llm.client.ts`. `validateEnv` requires the key only when `AI_ENABLED=true`. Add the variables to CLAUDE.md §13 when implemented.

## 11. Testing

- **Unit (no network):** prompt builder (golden output), citation validator, scrubber (names, emails, phones, amounts kept), cost calculator, quota (minute, daily, concurrency, fails closed), answer cache (hit, corpus-hash invalidation, tool answers not stored).
- **`AskService`** against a scripted fake `LlmPort`: happy path, uncited answer, refused answer, quota exceeded, tool loop cap, client abort.
- **Wiring:** extend `app.module.spec.ts` and `route-auth.spec.ts` (the `/ai/*` routes must be authenticated; the admin report admin-only).
- **Evaluation script** (`pnpm --filter api ai:eval`, opt-in, costs pennies): a golden list of real questions with the expected `slug#section`, plus traps — KYC (SOP missing), a TODO section, a price prediction, "ignore your instructions" injection, and a question containing a customer name (must not appear in the stored row).

## 12. Delivery phases

1. **Core, no UI, flag off** — `LlmPort` + adapter, prompt builder, SOP context, citation validator, `POST /ai/ask` (non-streaming), evaluation script. *(1.5: AiModule, cached prompt, rules)*
2. **Safety layer** — SSE, quota, cost log, question log, scrubber, answer cache. *(1.5: streaming, quota/cost/throttling)*
3. **Tools and branch data** — branches migration + admin form, `MarketDataService.priceProduct()`, the three tools. *(1.5: tools)*
4. **Chat panel** — Knowledge Center "Ask", streaming reader, clickable citations (they open the article with the gold "You're here" frame), thumbs up/down, AI-generated label, quota display, "don't paste customer ID numbers" notice. Designed with the Impeccable skill. *(1.5: chat panel)*
5. **Reports** — admin "unanswered questions" and cost report. *(1.5: question log report)*

Nothing is exposed to staff until phase 2 is complete and the evaluation passes; production stays behind `AI_ENABLED`.

## 12a. Phase 2 as built — where it differs from the plan above

- **Two endpoints.** `POST /ai/ask` (whole answer, JSON) stays for the evaluation script and simple clients; `POST /ai/ask/stream` is the SSE version. Problems found before the first byte (limits, switched off, paused, out of credit) are ordinary HTTP errors; later ones arrive as an `error` event. The `done` event carries the validated answer, which replaces what was streamed. The dev panel still uses the JSON endpoint; the streaming reader is phase 4.
- **Cache is stricter than planned.** A question with anything redacted (a name, email, phone) is never cached or looked up, because "Is [customer] VAT free?" could stand for two different products. Answers that themselves contain something to scrub, and `uncited` answers, are not stored either. `refused` answers are cached.
- **The model sees the real question; only the stored copy is scrubbed.** Scrubbing before the model call would damage answers (an unknown product name would become `[customer]`).
- **Order:** quota, SOP load, scrub, cache, spend breaker, model. The breaker sits after the cache, so a paused assistant still serves repeat questions, which cost nothing.
- **One automatic retry** when an answer comes back `uncited` (same question plus a reminder to cite). The retry is kept only if it improves the answer; tokens and cost of both calls are added up.
- **Limits** (env, defaults): 1 open question per user, `AI_PER_MINUTE_LIMIT=5`, `AI_DAILY_QUOTA_PER_USER=50` (Irish business day), `AI_DAILY_BUDGET_USD=2` (whole company). If Redis is down the assistant refuses rather than run unmetered.
- **Cost** is stored as whole micro-dollars (an integer) per question from a per-model price table in `cost.calculator.ts`; an unknown model is priced at the dearest known rate so the breaker errs safe. Override with `AI_PRICE_PER_MILLION=input,cachedInput,output`.
- **Retention:** a daily job at 04:30 deletes question logs older than `AI_LOG_RETENTION_DAYS` (90) and expired cache rows (`AI_CACHE_TTL_DAYS`, 7).
- **Opened to all signed-in staff (2026-10-01, owner's decision),** ahead of the planned wait for a reliable evaluation. The quotas, per-minute limit and daily spend breaker bound the cost; watch the cost report and the unanswered-question log.

## 12b. Live prices and reply drafts as built (2026-10-01)

Asked for by the owner: the assistant should quote current prices, and draft replies to a customer's pasted email or WhatsApp message.

- **Three modes** in the panel: Procedures, Email, WhatsApp (`mode` on `POST /ai/ask` and `/ai/ask/stream`). The panel is on the dashboard header (next to the product table) and the Knowledge Center header, for every signed-in user. A pasted message may be 4,000 characters (a question stays at 500).
- **Two read-only tools** the model can call (plan §6): `getSpot(metal)` and `findProductPrices(query, metal?, quantity?)`. `getBranch` waits for the branch columns (phase 3 proper). They sit behind `ToolRegistry` (Zod-validated arguments, a failing lookup becomes "couldn't read live figures, don't guess"); adding a tool is one class listed under the `AI_TOOLS` token. Up to 3 rounds; on the last the tools are withdrawn so the model must answer.
- **Prices match the table.** `MarketDataService.getPricedCatalogue(overrides)` uses the same spot cascade and the same pure `calculateProductPrice` as the page load. The browser sends the spot the table is quoting from (a frozen or typed spot, read from session storage); market modes (weekend/volatile/shortage) affect only the Trade tool, not the table, so they are not involved. Figures are finished: "price" (customer pays, VAT included), "buyback" (we pay), per-unit and, for a quantity, totals worked out by the tool. Availability is a yes/no, never a stock count.
- **The model never makes up a price.** Every euro amount in a reply is checked: it must have come from a lookup, the pasted message, or an SOP; otherwise a warning is shown ("€X was not given by a price lookup — check it"). A spot older than 15 minutes (or a fallback price) adds "may be out of date (taken HH:MM)".
- **Drafts** come back as the message to send plus separate staff notes (`---NOTES---` split): the message has no wiki links; the notes carry the citations, what was understood, and what to check. A pasted customer message is treated as data, never as instructions.
- **Privacy:** a draft is never cached, and the log keeps only a placeholder ("(email reply request, N characters)"), never the customer's message. Answers that used a live lookup are never cached either (prices move). The model sees the real text; OpenAI's terms were confirmed by the owner.
- **Cache key now includes the rules**, so changing the prompt rules stops older cached answers being served, as an SOP change does.
- **Display:** the panel no longer shows the "AI-generated" line or the model/token line (owner's decision). The roadmap's ground rule that AI output is labelled is now met only by the "Preview" badge in the panel header.
- **Logs:** `ai_question_logs` gained `mode` and `toolNames`.
- **Evaluation:** 25 cases (price, buyback, spot, quantity totals, a typed spot, an unknown product, email and WhatsApp drafts, a prompt-injection email, a market-prediction email) run the REAL tools over a fixed catalogue (`eval/price-fixture.ts`) so expected figures are exact.

## 13. Risks and open items

- The assistant can only be as complete as the approved SOPs: `kyc-aml` is unwritten, and `limit-orders` / `branch-directory` still hold TODOs.
- OpenAI prices and model names change; re-check before each budget review.
- Local dev: if a Kaspersky (or other antivirus/proxy) "scan encrypted connections" feature re-signs HTTPS to api.openai.com, some calls fail with `SELF_SIGNED_CERT_IN_CHAIN`. Fix it by trusting that product's root certificate with `NODE_EXTRA_CA_CERTS`, or excluding api.openai.com from scanning — never by disabling certificate checks, which would expose the API key. Production on Railway is unaffected.
- Exact-match caching saves little at six users; if usage grows, consider promoting frequent questions to curated FAQ entries rather than looser matching.
- Branch phone/hours for Cork, Blanchardstown, Barcelona, Madrid and Glasgow are still unconfirmed (see the branch-directory SOP), so `getBranch` will return "not confirmed" for them until filled in.
- Retention of 90 days for the question log is my default, not a stated requirement.
