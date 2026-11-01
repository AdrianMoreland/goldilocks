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
});

export type RoadmapSyncStatus = z.infer<typeof RoadmapSyncStatusSchema>;
