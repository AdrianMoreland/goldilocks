# Slice 2 design: pull master's roadmap into the app

Status: for the owner's review. **Nothing in this PR touches the database or the code.** The migration SQL below is inside this document on purpose: a file in `apps/api/prisma/migrations/` would be applied by Railway's pre-deploy step as soon as it merged.
Date: 2026-11-01. Part of roadmap 1.20 (`docs/ROADMAP-TOOL-PLAN.md`, slice 2).

## 1. What slice 2 delivers

The app's roadmap follows `docs/ROADMAP.md` on master, and nothing the app has that master lacks is ever lost.

- A **Sync from GitHub** button on `/project2` with a preview ("what would change") before anything is written.
- The **first run replaces the stale copy** (version 28, 361 lines that exist nowhere else) after a confirmation. A snapshot of the old text is kept first.
- A **webhook**: every push to `master` makes GitHub call the API, which pulls.
- A **pull on API start-up**, so a fresh deploy never serves a stale roadmap.
- Every pull is audited in the same transaction as the change.

Not in slice 2: pushing app changes to GitHub, the daily schedule, the inbox and the backlog (slices 3 to 5). Until slice 3, ticks made in the app stay in the app; the pull never discards them.

## 2. The key idea: the base is "the last agreed text"

A three-way merge needs a base. The rule that keeps it simple and correct:

> After every pull, `newBase = mergeRoadmap(oldBase, masterNow, oldBase).forApp`

That is the old base with master's changes absorbed. Master's deletions are flagged and kept, exactly as the app side treats them. Properties:

- What differs between the app and `newBase` is exactly the app's own pending edits. Slice 3 pushes those, and nothing else.
- Lines master deleted stay in `newBase`, so a later push cannot resurrect them, and a later pull reports them again until the app deletes them too.
- It works whether or not a sync PR is open: a PR that is not merged is not part of master, so it is not absorbed. After it merges, app and master agree and the next pull is quiet.
- A pull with nothing new (same commit as `baseCommit`) does nothing and costs one GitHub call.

The pull itself: `result = mergeRoadmap(base, master, app)`; the app's text becomes `result.forApp`.

The merge compares changes by which base lines they touch, so edits on neighbouring lines (the app ticks one task, master deletes the next) merge independently and only edits to the same lines conflict. This was checked against the real function while writing this design; the first version of the merge treated neighbouring lines as one conflict and would have undone master's deletion, so that was fixed first (separate PR) and is covered by tests, including a seeded random check.

## 3. First run ("adopt master")

There is no base yet, so a three-way merge is impossible. The first pull is a separate, explicit step:

1. **Preview** (no writes): counts of lines that differ each way, plus the list of **tasks that exist only in the app** (title, section, ticked or not) and any task **ticked in the app but unticked on master**. From the earlier check, all 78 app ticks are ticked on master too, so that second list should be empty. If it is not, the owner sees exactly what would be lost.
2. **Confirm**: a checkbox in the dialog ("I have seen what will be replaced; a snapshot is kept"). The API refuses the replace without `confirmReplace: true`.
3. **Apply**, in one transaction: write a snapshot of the app's text; replace `roadmap_document` with master's text (`version + 1`, `updatedBy: 'sync'`); store `roadmap_sync_state` with `base = master`; add the audit entry.

The webhook and the start-up pull never run this step. They only run a merge pull once a state row exists.

## 4. Data (additive: two new tables, no existing table changes)

```sql
-- CreateTable
CREATE TABLE "roadmap_sync_state" (
    "id" INTEGER NOT NULL,
    "baseCommit" TEXT NOT NULL,
    "baseMarkdown" TEXT NOT NULL,
    "syncedAt" TIMESTAMPTZ(6) NOT NULL,
    "syncedBy" TEXT NOT NULL,

    CONSTRAINT "roadmap_sync_state_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roadmap_snapshot" (
    "id" SERIAL NOT NULL,
    "markdown" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "roadmap_snapshot_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "roadmap_snapshot_createdAt_idx" ON "roadmap_snapshot"("createdAt" DESC);

-- Row level security: the API connects as `postgres` (which bypasses it); Supabase's own REST roles get nothing.
ALTER TABLE "roadmap_sync_state" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "roadmap_snapshot" ENABLE ROW LEVEL SECURITY;
```

Prisma models (`apps/api/prisma/schema.prisma`, next to `RoadmapDocument`):

```prisma
/// The text the app and master last agreed on (docs/ROADMAP-SYNC-PULL-DESIGN.md). One row, id = 1.
model RoadmapSyncState {
  id           Int      @id
  baseCommit   String
  baseMarkdown String
  syncedAt     DateTime @db.Timestamptz(6)
  syncedBy     String

  @@map("roadmap_sync_state")
}

/// The app's roadmap text as it was just before a sync replaced or changed it. Append-only: nothing updates or deletes a row.
model RoadmapSnapshot {
  id        Int      @id @default(autoincrement())
  markdown  String
  version   Int
  reason    String
  createdBy String
  createdAt DateTime @default(now()) @db.Timestamptz(6)

  @@index([createdAt(sort: Desc)])
  @@map("roadmap_snapshot")
}
```

- **Why two tables.** `roadmap_sync_state` is the base for the merge. `roadmap_snapshot` is the safety net: it replaces the manual "export a backup first" step with one that cannot be forgotten, and it covers every later pull that changes the app's text too. Each snapshot is about 80 KB; a pull writes one only when the app's text actually changes.
- **Safe to apply:** new tables only, nothing references them, no data is touched. Rollback is `DROP TABLE "roadmap_snapshot"; DROP TABLE "roadmap_sync_state";` (the sync then reports "not set up" again).
- Applied the usual way (Prisma migration, Railway pre-deploy `prisma migrate deploy`) **only after the owner approves**. The migration file is added in the slice 2 PR, not in this one.
- **Row level security** is switched on for both new tables in the same migration (decision 5). Checked read-only against the database on 2026-11-01: the API connects as `postgres`, which bypasses RLS, so this cannot affect it; `anon` and `authenticated` have no privileges on any `public` table and `public` has no default grants, so a new table is not reachable through Supabase's REST API either way. RLS is the second lock. The same switch for the 26 existing tables is a separate plan: `docs/RLS-PLAN.md`.

## 5. API

| Endpoint | Purpose |
|---|---|
| `POST /roadmap/sync/pull` (admin) | body `{ dryRun?: boolean, confirmReplace?: boolean }`. `dryRun` returns the preview and writes nothing. A first run without `confirmReplace` is refused. Throttled to 6 a minute |
| `POST /roadmap/sync/webhook` (public route, signature checked) | GitHub push events from master |

Response of a pull, in `shared-types`: `{ mode: 'adopt' | 'merge' | 'nothing', applied, commit, appChanged, log (the merge log), appOnlyTasks, conflicts, snapshotId }`. Everything the preview shows is the same object the real run returns, so what you confirm is what happens.

Writes use the same guard as today's edits: `updateMany` with `where { version }` inside the transaction. If someone ticks a task on `/project` between the read and the write, the pull loses cleanly (409) and is simply run again; nothing is overwritten.

## 6. The webhook (new public endpoint, so the risks are listed)

- The API protects every route by default (`APP_GUARD` `JwtAuthGuard`), so the route is marked `@Public()` and does its own check: the `X-Hub-Signature-256` header must equal HMAC-SHA256 of the **raw body** with `GITHUB_WEBHOOK_SECRET`, compared in constant time. No valid signature, or no secret configured: `401`, no work done.
- HMAC needs the raw bytes, so `NestFactory.create(AppModule, { rawBody: true })` in `main.ts` (one option; Nest keeps `req.rawBody` for every route and parses JSON as before).
- Only `push` events to `refs/heads/master` act; `ping` answers `200`; anything else is ignored with `202`. The handler answers immediately and pulls in the background, so GitHub's 10 second limit is never hit. A failed pull is logged and shows on the banner, nothing more.
- Request limit: the signature is the protection, not the limit; the route gets a generous per-IP throttle only.
- Idempotent: two pushes close together, or two API replicas, run two pulls; the version guard lets the second one find nothing to do.
- The webhook itself was added in GitHub by the owner (Active can be switched off until this ships). Its deliveries returning `404` until slice 2 deploys is expected.

## 7. Web (`/project2`, Goldilocks design system)

- The banner gets a **Sync from GitHub** button (primary only when something differs).
- Clicking it runs `dryRun`, then opens a `Dialog` with: the mode ("Replace the app's copy with master" for the first run, "Merge" afterwards); counts; the merge log in plain words ("2 tasks ticked on master brought in", "1 task deleted on master kept in the app and flagged"); on the first run the list of app-only tasks and the confirmation checkbox. **Apply** is disabled until the checkbox is ticked on a first run.
- The diff preview gets its missing legend ("+ only in the app, − only on master").
- Status dots, hairline borders, 6px controls, no tinted backgrounds, as in `DESIGN.md`.

## 8. Other pieces

- `pnpm --filter api roadmap:snapshot [id] [--out file]`: lists snapshots, or prints/writes one, so an old text can always be recovered by hand. No restore button in this slice.
- Start-up pull: `OnApplicationBootstrap`, in the background and never blocking boot (the same rule as the metals backfill), skipped if there is no state row or no token.
- The old `roadmap:import` / `roadmap:export` scripts stay. After an import the app's text equals master's, so the next pull finds nothing to do.
- The old `/project` page keeps editing the same row. Ticks made there are app changes like any other: merged, never lost.

## 9. Tests

- `shared-types`: already covers the merge. Add tests for the `newBase` rule (flagged deletions survive it; app-only edits stay visible against it).
- API (fake `GithubPort`): first run refused without confirmation; first run snapshots then replaces; a merge pull applies file changes and keeps app-only edits; a pull with the same commit does nothing; a version race returns 409 and writes nothing; audit and snapshot are written in the same transaction as the change; webhook accepts a valid signature, rejects a bad or missing one, ignores other branches and events.
- Web: summary text for each result; dialog disables Apply until confirmed.

## 10. Size and order

About a medium slice: shared-types rule + tests, Prisma models and migration, service, controller and webhook, `main.ts` option, snapshot script, dialog. One PR, with the migration as its own commit so it can be reviewed first. Nothing is applied to the database until you approve it.

## 11. Decisions (owner, 2026-11-01)

1. **Two tables approved** (`roadmap_sync_state`, `roadmap_snapshot`) as written in section 4.
2. **First run:** preview, confirmation checkbox and automatic snapshot are enough. A manual export of the old text can come later if wanted.
3. **Webhook approved:** a public endpoint that checks GitHub's signature, plus the `rawBody` option in `main.ts`.
4. **Start-up pull approved, on by default** (it only merges, never adopts).
5. **Row level security:** on for the two new tables in this migration; the 26 existing tables are handled by `docs/RLS-PLAN.md`, as its own change with its own approval.
