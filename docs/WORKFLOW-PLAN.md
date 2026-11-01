# Workflow plan: roadmap, issues, CI and post-merge automation

Draft, 2026-11-01. Decisions taken with the owner: the Goldilocks app becomes the single home for roadmap tasks (F11); GitHub Actions do the mechanical work; Claude is used on request; the owner merges by hand.

## 1. Target picture

```
phone Shortcut / quick add ──> GitHub issue (label roadmap) ──┐
                                                              v
                        Goldilocks /project (single editing home)
                          inbox · roadmap tree · backlog · bugs · decisions
                                  │ API opens [roadmap-sync] PR (docs/ROADMAP.md only)
                                  v
 PR (Roadmap: 1.12 in body) ──> ci ──> owner merges (squash, branch deleted)
                                  │
                  post-merge workflow: tick items · migration check · smoke test · release notes
```

`docs/ROADMAP.md` stays the record. Until the app tool exists (phase C), the claude.ai page and the existing daily sync keep running.

## 2. Phases (each its own PR, in this order)

### A. Repo hygiene (S, now, no dependencies)
- `.github/pull_request_template.md`: sections Summary / Roadmap (`Roadmap: 1.12, 0.10`, or `Roadmap: none`) / Migration (yes/no) / Test notes.
- Issue forms: `idea.yml`, `bug.yml` (both auto-label `roadmap`/`bug`). Keep the Shortcut posting to the same label.
- Repo settings: squash merge only, delete branch on merge, allow auto-merge (off by default). The `protect-master` ruleset is active (confirmed via the rulesets API); verify it requires the `ci` check, and add `post-merge` as non-required.
- `CODEOWNERS` is not needed (solo).
- Clean-up of test leftovers (task "Testing mobile 3", issue 38, branch `docs/roadmap-sync-test`).

### B. Post-merge workflow `.github/workflows/post-merge.yml` (M)
Trigger: `push` to master. Jobs run independently so one failure does not hide others. Every job skips for docs-only pushes except the tick job.

| Job | What it does | Notes |
|---|---|---|
| `roadmap-tick` | Reads `Roadmap:` IDs from the merged PR body, ticks matching items in `docs/ROADMAP.md`, opens or updates one `[roadmap-sync]` PR on `roadmap-sync/auto` | Deterministic script in `tools/`. Only flips `[ ]` to `[x]` on lines whose ID matches. Never merges. Uses `GITHUB_TOKEN` with `contents`+`pull-requests` write. Note: PRs opened by `GITHUB_TOKEN` do not trigger `ci`; use a fine-grained PAT or GitHub App token so the required check runs. |
| `migration-check` | If `apps/api/prisma/migrations/**` changed, post a commit comment/issue "migration needs applying: `pnpm prisma:deploy`" and verify Railway pre-deploy is set | Dev and production share one Supabase DB, so this is a reminder, not an auto-apply. Optional later: `prisma migrate status` against a read-only role. |
| `smoke` | After a wait/poll for the Railway deploy, call API `/health` and the web root; open (or comment on) an issue labelled `deploy-failed` on failure | Skipped when Railway Watch Paths would not have deployed. Needs `API_URL` and `WEB_URL` repo variables. |
| `release-notes` | Weekly (`schedule`, Mondays) rather than per merge: build a changelog of merged PRs since the last tag, create a GitHub release draft | Saving to Drive is done by `gl-drive save` on request; an Action cannot reach the Drive connector. |

### C. Roadmap tool inside the app (XL, plan PR first)
Follows the F11 slices in the requirements file: (1) read-only roadmap view fed from the file, (2) tables + editing with audit rows, (3) GitHub sync done by the API (token in Railway, opens `[roadmap-sync]` PR, pulls file changes on a schedule), (4) inbox, backlog, quick add. Rules that carry over: three-way merge (base, file, app), page wins on conflict and is logged, nothing deleted silently, only `docs/ROADMAP.md` changes in a sync PR. Migrations are additive and approved before touching the shared database. Open a plan PR (`docs/ROADMAP-TOOL-PLAN.md`) before any code.

### D. Retire the old pieces (S, after C slice 3 works for two weeks)
- Turn the claude.ai page and the scheduled daily sync off; keep the weekly drift report until the app has its own check.
- Overwrite the stale in-app roadmap (backup first) or let the API pull the file on first run.
- Make the Project page roadmap read-only until slice 2 lands.

## 3. Claude Code setup (local only, not committed)
Claude files (`CLAUDE.md`, `.claude/`) are kept out of the repo. The owner already has a local `CLAUDE.md`; add to it:
- PR rule: always put `Roadmap: <id>` (or `Roadmap: none`) in the PR body; no AI traces in commits or PR bodies; never merge unless told; migrations need approval first.
- The pre-push checks list from the README.
- For cloud sessions, install dependencies and build `shared-types` through the environment's setup script (claude.ai environment settings), not a hook committed to the repo.
- Slash commands/skills: `/roadmap-update <PR>` after a major change; `gl-drive save` for plans, handoffs and reports.
- Subscribe to PR activity on every PR Claude opens so CI failures get fixed without being asked.

## 4. Decisions (settled 2026-11-01)
1. **Token for Actions-created PRs:** fine-grained PAT, repo-scoped, 90-day expiry, calendar reminder to renew. Stored as a repo secret.
2. **Auto-merge:** only for `[roadmap-sync]` tick-only PRs, after about two weeks of clean runs. Off until then.
3. **Smoke test:** report only. It never blocks a merge or a deploy.
4. **No Claude Code traces in the repo:** no commit trailers and no "Generated by Claude Code" footer in PR bodies or comments.

## 5. Suggested order
A (today) → B `roadmap-tick` + `migration-check` → B `smoke` + release notes → C plan PR → C slices → D.
