import { z } from 'zod';

/**
 * Where the app's roadmap stands against `docs/ROADMAP.md` on master (GET /roadmap/sync). Read only:
 * slice 1 of docs/ROADMAP-TOOL-PLAN.md shows the gap; nothing is written to the app or to GitHub.
 */
export const RoadmapSyncStatusSchema = z.object({
  /** `unconfigured` no GitHub token; `in-sync` same text; `differs` the app and master disagree; `unavailable` GitHub could not be reached. */
  state: z.enum(['unconfigured', 'in-sync', 'differs', 'unavailable']),
  /** `owner/name` the status was read from. */
  repo: z.string(),
  branch: z.string(),
  /** Commit of the branch tip the file was read at. */
  masterCommit: z.string().nullable(),
  appVersion: z.number().int().nonnegative(),
  appUpdatedAt: z.iso.datetime().nullable(),
  /** Lines in the app's copy that master does not have. */
  appOnlyLines: z.number().int().nonnegative(),
  /** Lines on master that the app's copy does not have. */
  masterOnlyLines: z.number().int().nonnegative(),
  /** A short `+`/`-` preview of the difference (app against master), capped. */
  preview: z.array(z.string()),
  /** The open `[roadmap-sync]` pull request, if there is one. */
  openSyncPr: z.object({ number: z.number().int(), title: z.string(), url: z.string() }).nullable(),
  /** When the GitHub token expires, as GitHub reports it. */
  tokenExpiresAt: z.iso.datetime().nullable(),
  /** Why the state is `unavailable`. */
  error: z.string().nullable(),
  /** App edits a push would send to GitHub; null when sync is not set up or could not be worked out. */
  appEditsToPush: z.number().int().nonnegative().nullable(),
});

export type RoadmapSyncStatus = z.infer<typeof RoadmapSyncStatusSchema>;

/** What a pull may be asked to do (POST /roadmap/sync/pull). */
export const RoadmapPullRequestSchema = z.object({
  /** Show what would change and write nothing. */
  dryRun: z.boolean().optional(),
  /** The first pull replaces the app's copy; it is refused unless this is true. */
  confirmReplace: z.boolean().optional(),
});

const MergeEntrySchema = z.object({
  kind: z.enum(['to-file', 'to-app', 'conflict-app-wins', 'kept-file-edit', 'missing-from-file', 'both-added']),
  baseLine: z.number().int(),
  text: z.string(),
});

const TaskRefSchema = z.object({
  /** Section key, e.g. `1.12`. */
  section: z.string(),
  title: z.string(),
  checked: z.boolean(),
});

/**
 * The outcome of a pull, or of its preview: what the dry run shows is what the real run returns.
 * `adopt` is the first run (replaces the app's copy with master's), `merge` every later one, `nothing`
 * when master has not moved since the last pull.
 */
export const RoadmapPullResultSchema = z.object({
  mode: z.enum(['adopt', 'merge', 'nothing']),
  /** False for a dry run. */
  applied: z.boolean(),
  /** Master commit the pull read. */
  commit: z.string(),
  /** Whether the app's text changes (or changed). */
  appChanged: z.boolean(),
  /** The merge log: what was brought in, kept, flagged or decided in the app's favour. */
  log: z.array(MergeEntrySchema),
  /** First run only: tasks that exist only in the app, so would be replaced. Capped at 50. */
  appOnlyTasks: z.array(TaskRefSchema),
  appOnlyTaskCount: z.number().int().nonnegative(),
  /** First run only: tasks ticked in the app but not on master. Capped at 50. */
  ticksOnlyInApp: z.array(TaskRefSchema),
  ticksOnlyInAppCount: z.number().int().nonnegative(),
  /** Lines only in the app and only on master (first run). */
  appOnlyLines: z.number().int().nonnegative(),
  masterOnlyLines: z.number().int().nonnegative(),
  /** The snapshot of the app's previous text, when one was taken. */
  snapshotId: z.number().int().nullable(),
  /** The app's roadmap version after the pull. */
  appVersion: z.number().int().nonnegative(),
});

/** What a push may be asked to do (POST /roadmap/sync/push). */
export const RoadmapPushRequestSchema = z.object({
  /** Show what would be sent and write nothing. */
  dryRun: z.boolean().optional(),
});

/** The outcome of a push, or of its preview: what the dry run shows is what the real run returns. */
export const RoadmapPushResultSchema = z.object({
  mode: z.enum(['push', 'nothing']),
  /** False for a dry run. */
  applied: z.boolean(),
  /** Master commit the push was built on. */
  commit: z.string(),
  /** The app's edits being sent (the merge log's `to-file` entries). */
  edits: z.array(MergeEntrySchema),
  /** A short `+`/`-` preview of master against the new file, capped. */
  diffPreview: z.array(z.string()),
  /** The pull request opened or updated; null for a dry run or when there was nothing to push. */
  prNumber: z.number().int().nullable(),
  prUrl: z.string().nullable(),
});

export type RoadmapPullRequest = z.infer<typeof RoadmapPullRequestSchema>;
export type RoadmapPullResult = z.infer<typeof RoadmapPullResultSchema>;
export type RoadmapPushRequest = z.infer<typeof RoadmapPushRequestSchema>;
export type RoadmapPushResult = z.infer<typeof RoadmapPushResultSchema>;
