# Roadmap sync tool

Keeps `docs/ROADMAP.md` and the Goldilocks Backlog page (a task board kept outside this repo) in step. Plain Node, no dependencies.

```
node tools/roadmap-sync/sync-tool.js sync   docs/ROADMAP.md sections.json out.md base.md
node tools/roadmap-sync/sync-tool.js export docs/ROADMAP.md sections.json [out.md]
node tools/roadmap-sync/sync-tool.js merge  docs/ROADMAP.md sections.json
```

`sections.json` is an array of the page's roadmap section documents (each with a `key`).

## sync (the normal one)

A three-way compare of the file as it was at the last sync (`base.md`), the file now, and the page now. Whichever side changed a task since the base wins, so a tick or an untick in the page is not mistaken for a stale value:

- **page changed, file did not:** the change goes into `out.md` (tick, untick, rename, a task added in the page, a task deleted in the page).
- **file changed, page did not:** the page picks it up (tick, untick, rename, a new task, which is placed in file order).
- **both changed:** the page wins, and the log says so.
- A task that disappears from the file is flagged in the page, never deleted from it.
- A task deleted in the page is removed from the file only if the file has not changed that task since the base.
- A rename is applied only when the old title appears verbatim in the line; otherwise it is reported for a hand edit.

It prints a log of everything it decided, and writes the new file text to `out.md` when the file would change.

`export` and `merge` are the older one-way commands, kept for reference: `export` only ticks and appends, `merge` only brings file changes into the page.

Tasks are matched by title, so rewording a task in the file shows up as a new task plus a flagged old one.

## Pull requests made by the sync

- Branch `roadmap-sync/YYYY-MM-DD`
- Title `[roadmap-sync] ...`
- Commit message `roadmap-sync: ...`
- Only `docs/ROADMAP.md` changes, and the PR is merged by hand.
