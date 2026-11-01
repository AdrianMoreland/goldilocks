# Roadmap sync tool

Keeps `docs/ROADMAP.md` and the Goldilocks Backlog page (a task board kept outside this repo) in step. Plain Node, no dependencies.

```
node tools/roadmap-sync/sync-tool.js export docs/ROADMAP.md sections.json [out.md]
node tools/roadmap-sync/sync-tool.js merge  docs/ROADMAP.md sections.json
```

`sections.json` is an array of the page's roadmap section documents (each with a `key`).

- **export** applies what was done in the page to a copy of the file: ticks `[ ]` to `[x]`, and appends tasks added in the page (with their subtasks) after their siblings. It never deletes or rewrites an existing line, and it does not export unticks. It prints what it changed.
- **merge** shows how changes in the file would merge into the page's sections, keeping the page's ticks, notes and edits, and flagging tasks that disappeared from the file instead of deleting them.

Tasks are matched by title, so rewording a task in the file shows up as a new task plus a flagged old one.

## Pull requests made by the sync

- Branch `roadmap-sync/YYYY-MM-DD`
- Title `[roadmap-sync] ...`
- Commit message `roadmap-sync: ...`
- Only `docs/ROADMAP.md` changes, and the PR is merged by hand.
