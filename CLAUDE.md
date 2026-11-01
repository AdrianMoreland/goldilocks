# Goldilocks - notes for Claude sessions

Read `docs/ENGINEERING.md` first (architecture, conventions, §17 roadmap rules) and the ground rules at the top of `docs/ROADMAP.md`.

## Pull requests
- Branch from `master`, one task per PR. Never push to `master`; it is protected and needs the `ci` check.
- Put `Roadmap: <id>[, <id>]` (or `Roadmap: none`) in the PR body. A post-merge job uses it to tick roadmap items.
- Do not add AI-tool traces to the repo: no `Co-Authored-By` or session trailers in commits, no "Generated with" footer in PR bodies or comments.
- Never merge a PR or enable auto-merge unless told to.
- Database migrations are additive and need approval first: dev and production share one Supabase database.

## Checks to run before pushing (same as CI)
```bash
pnpm --filter @goldilocks/shared-types build
pnpm --filter api exec tsc --noEmit
(cd apps/api && node node_modules/eslint/bin/eslint.js src --no-fix --no-cache --max-warnings 0)
pnpm --filter api exec jest --ci
pnpm --filter @goldilocks/shared-types test
pnpm --filter web lint && pnpm --filter web test && pnpm --filter web build
```
`shared-types` is consumed from `dist/`: rebuild it after changing it.

## Roadmap
`docs/ROADMAP.md` is the record. Verify in code before claiming an item is done; tick it in the same PR when you finish one. Do not reorder or re-prioritise without being asked.
