# Slice 3 design: send the app's roadmap edits to GitHub

Status: for the owner's review. Design only: no code and no migration in this PR.
Date: 2026-11-01. Part of roadmap 1.20 (`docs/ROADMAP-TOOL-PLAN.md`, slice 3). Builds on `docs/ROADMAP-SYNC-PULL-DESIGN.md` (slice 2, live).

## 1. What slice 3 delivers

When you tick, add, edit or delete roadmap tasks in the app, one click opens (or updates) a pull request that changes **only `docs/ROADMAP.md`** and **only with your edits**. You merge it by hand; the webhook then pulls it back and the app, master and the stored base all agree again. The app never merges anything.

- **Button** "Send app edits to GitHub" on `/project2`, with a preview first (same pattern as the pull dialog).
- **Pending count** on the banner: "N edits in the app are not on GitHub yet".
- **Daily schedule** (06:15 Europe/Dublin): a safety-net pull, and, only if switched on, an automatic push.
- No database migration: the state table from slice 2 already holds the base.

Edits are made today on the current `/project` page (tick, add, edit, delete through `POST /roadmap/edit`); `/project2` has no editing yet. Both write the same `roadmap_document` row, so slice 3 works with either.

## 2. The algorithm (nothing new to invent)

`result = mergeRoadmap(state.baseMarkdown, masterNow, app.markdown)`; the push writes **`result.forFile`**.

- `base` is the "last agreed text" from slice 2, so what differs between the app and it is exactly your edits.
- Master's own newer changes are carried along (three-way), and lines master deleted stay deleted (the flagged rule), so a push can never resurrect or revert anything.
- Nothing to push when `result.fileChanged` is false.
- Pushing never changes the app's text or the base. After the PR merges, the webhook pull sees master equal to the app, and the base moves forward by the existing rule.

Safety checks before anything is written (cheap, no new machinery):
1. Sync must be set up (a state row exists) and the app must have a roadmap; otherwise refuse with "do the first pull".
2. `forFile` must be at least 90% as long as master's file; otherwise refuse ("this would delete more than 10% of the roadmap").
3. One push at a time per API process (a simple in-memory flag; answers 409 if busy).

## 3. GitHub side

One fixed bot branch, **`roadmap-sync/app`** (the Action already uses the fixed `roadmap-sync/auto`; fixed names need no clean-up). Each push:

1. Find an open PR whose head is `roadmap-sync/app` (`listOpenPullRequests`, already built).
2. Put the branch at master's current commit: create it if missing, otherwise move it there with a forced ref update. It is a bot-only branch.
3. Commit the new `docs/ROADMAP.md` to it with the contents API, as the token's owner, with message `roadmap-sync: app edits`. No trailers or AI footers.
4. If no PR is open from the branch, open one: title `[roadmap-sync] app edits`, base `master`. If one is open, update its body.

PR body: `Roadmap: none`, a line "Sent from the app's Project page by <email>", counts, and the changed lines (`+` and `-`, capped at 40) so the PR is readable on a phone. Merge stays yours.

New `GithubPort` methods (the client uses `fetch`, a 10 second timeout, no retry on writes, exactly like the read calls): `writeFileOnBranch({ branch, baseCommit, path, content, message })` and `openPullRequest` / `updatePullRequest`. The token already has Contents and Pull requests read/write. PRs opened with a personal token do trigger the required `ci` check.

## 4. API

| Endpoint | What |
|---|---|
| `POST /roadmap/sync/push` (admin, 6 a minute) | body `{ dryRun?: boolean }`. Dry run returns the preview and writes nothing. Result: `{ mode: 'push' \| 'nothing', applied, commit, edits (the merge log's to-file entries), diffPreview, prNumber, prUrl }` |
| `GET /roadmap/sync` (existing) | gains `appEditsToPush: number \| null` (null when sync is not set up), from the same merge |

Every real push writes an audit entry (`push: opened PR #N, 3 edit(s)` or `push: updated PR #N`); no row is changed, so no transaction is needed.

## 5. Daily schedule

`@Cron('15 6 * * *', { timeZone: 'Europe/Dublin' })`, following `metals.cron.ts`. It always runs the safety-net pull (one GitHub call; the webhook normally has done it already). It runs the push **only if `ROADMAP_DAILY_PUSH=true`** on the API service, default off. Recommendation: use the button for a week, then switch it on. The 06:47 Claude sync for the claude.ai page keeps running; the app's run is earlier so the two do not meet.

## 6. Web (`/project2`, Goldilocks design system)

- Banner: when `appEditsToPush > 0`, a line with a dot and the count, and a **Send app edits to GitHub** button (gold only when there is something to send).
- Dialog like the pull one: the server's dry run in plain words (reusing `describeEntry`), the diff preview, and **Apply**. After applying: a toast and a link to the PR.

## 7. Tests (small and focused)

- API service with a fake port: refuses without sync state; "nothing to push"; creates branch, commit and PR; updates an existing PR; resets the branch to master; the 90% guard; dry run writes nothing; busy flag gives 409; audit entry written.
- Client with a mocked `fetch`: URLs, base64 body, branch create versus forced update, the 422 and 404 cases turned into readable errors.
- Web helpers: the pending-count wording and Apply enablement.

## 8. Size and order (one PR, four commits, no migration)

1. `shared-types`: push request and result schemas; `appEditsToPush` on the status schema.
2. `GithubPort` write methods, client, tests.
3. Push service, endpoint, cron, status count, tests.
4. Web: banner line and dialog, helper tests.

## 9. Known edges (documented, not built)

- If the Action's tick PR (`roadmap-sync/auto`) and the app's PR touch the same line differently, the second to merge shows a conflict on GitHub; resolve it there or close it, and the next push rebuilds from master.
- Two API replicas could race the daily push; today there is one.
- Branch protection could reject the branch name; the ruleset covers `master` only, as checked for `roadmap-sync/auto`.

## 10. Decisions needed from the owner

1. **Fixed branch `roadmap-sync/app`**, reset to master on each push (simplest), instead of a dated branch per day?
2. **Daily push off by default**, switched on later with `ROADMAP_DAILY_PUSH=true`?
3. **90% length guard** as the only sanity check?
4. **Pending count in the status call** (one extra database read and one merge per status check), or only compute it inside the dialog?
