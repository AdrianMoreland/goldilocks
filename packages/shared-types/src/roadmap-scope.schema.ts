import { z } from 'zod';

/** The scope files a roadmap is made of, in the order they are bundled. */
export const ROADMAP_SCOPE_FILES = [
  { key: 'features', path: 'docs/roadmap/features.md', required: true },
  { key: 'fixes', path: 'docs/roadmap/fixes.md', required: true },
  { key: 'ops', path: 'docs/roadmap/ops.md', required: true },
  { key: 'decisions', path: 'docs/roadmap/decisions.md', required: true },
  { key: 'now', path: 'docs/NOW.md', required: false },
] as const;

export const RoadmapScopeKeySchema = z.enum(['features', 'fixes', 'ops']);

export const RoadmapScopeTaskSchema = z.object({
  checked: z.boolean(),
  text: z.string(),
  /** 0 for a top-level subtask, 1 for one nested under it, and so on. */
  depth: z.number().int().nonnegative(),
});

/** One open item of a scope file (`### F-02 · Title` block). */
export const RoadmapScopeItemSchema = z.object({
  id: z.string(),
  scope: RoadmapScopeKeySchema,
  title: z.string(),
  priority: z.enum(['P0', 'P1', 'P2', 'P3']),
  effort: z.enum(['S', 'M', 'L', 'XL']),
  status: z.enum(['idea', 'planned', 'next', 'doing', 'done', 'dropped']),
  after: z.array(z.string()),
  flags: z.array(z.string()),
  /** Commit the evidence was last checked at, null when never verified. */
  verified: z.string().nullable(),
  /** Number in an older numbering, for example `1.8`. */
  was: z.string().nullable(),
  evidence: z.array(z.string()),
  spec: z.string().nullable(),
  deadline: z.string().nullable(),
  /** Prose lines of the block that are not metadata or subtasks. */
  body: z.string(),
  tasks: z.array(RoadmapScopeTaskSchema),
});

/** A finished item: one line of the `## Done` list. */
export const RoadmapScopeDoneSchema = z.object({
  id: z.string(),
  scope: RoadmapScopeKeySchema,
  text: z.string(),
});

export const RoadmapScopeDecisionSchema = z.object({
  id: z.string(),
  /** Open decisions have a title; settled ones carry their whole line in `text`. */
  title: z.string(),
  settled: z.boolean(),
  default: z.string().nullable(),
  blocks: z.string().nullable(),
  text: z.string(),
});

export const RoadmapScopeViewSchema = z.object({
  items: z.array(RoadmapScopeItemSchema),
  done: z.array(RoadmapScopeDoneSchema),
  decisions: z.array(RoadmapScopeDecisionSchema),
  /** The generated "what next" page, verbatim, or null. */
  now: z.string().nullable(),
});

/** `GET /roadmap/scope`: the stored view and where it came from. */
export const RoadmapScopeSchema = z.object({
  /** True when ROADMAP_SOURCE=scope on the API. */
  enabled: z.boolean(),
  /** True when a token is configured and a roadmap repository is named. */
  configured: z.boolean(),
  /** Nothing has been pulled yet. */
  empty: z.boolean(),
  repo: z.string().nullable(),
  branch: z.string().nullable(),
  commit: z.string().nullable(),
  version: z.number().int().nonnegative(),
  syncedAt: z.iso.datetime().nullable(),
  syncedBy: z.string().nullable(),
  view: RoadmapScopeViewSchema,
});

export const RoadmapScopeRefreshSchema = z.object({
  /** False when the repository already matched what is stored. */
  changed: z.boolean(),
  commit: z.string(),
  version: z.number().int().nonnegative(),
  items: z.number().int().nonnegative(),
  decisions: z.number().int().nonnegative(),
});

export type RoadmapScopeKey = z.infer<typeof RoadmapScopeKeySchema>;
export type RoadmapScopeTask = z.infer<typeof RoadmapScopeTaskSchema>;
export type RoadmapScopeItem = z.infer<typeof RoadmapScopeItemSchema>;
export type RoadmapScopeDone = z.infer<typeof RoadmapScopeDoneSchema>;
export type RoadmapScopeDecision = z.infer<typeof RoadmapScopeDecisionSchema>;
export type RoadmapScopeView = z.infer<typeof RoadmapScopeViewSchema>;
export type RoadmapScope = z.infer<typeof RoadmapScopeSchema>;
export type RoadmapScopeRefresh = z.infer<typeof RoadmapScopeRefreshSchema>;
