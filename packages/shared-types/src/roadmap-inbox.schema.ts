import { z } from 'zod';

/** One captured idea: a GitHub issue labelled `roadmap`, copied into the app to triage (roadmap 1.20 slice 4). */
export const RoadmapInboxItemSchema = z.object({
  id: z.number().int(),
  issueNumber: z.number().int(),
  title: z.string(),
  body: z.string(),
  /** Idea, Task or Fix when the issue says so; otherwise null. */
  kind: z.string().nullable(),
  url: z.string(),
  status: z.enum(['new', 'promoted', 'dismissed']),
  issueCreatedAt: z.iso.datetime(),
  handledAt: z.iso.datetime().nullable(),
  handledBy: z.string().nullable(),
});

export const RoadmapInboxSchema = z.object({
  items: z.array(RoadmapInboxItemSchema),
  /** False when no GitHub token is set, so nothing can be fetched. */
  configured: z.boolean(),
});

/** What a refresh found. */
export const RoadmapInboxRefreshSchema = z.object({
  added: z.number().int().nonnegative(),
  /** Items that were new here but have since been closed on GitHub, now marked dismissed. */
  closedOnGithub: z.number().int().nonnegative(),
});

/** Turn an item into a task in a section: the heading line of the section, the task text, and the roadmap version on screen. */
export const RoadmapInboxPromoteSchema = z.object({
  sectionLine: z.number().int().nonnegative(),
  text: z.string().trim().min(1).max(500).refine((t) => !/[\r\n]/.test(t), 'Task text must be one line'),
  version: z.number().int().nonnegative(),
});

export type RoadmapInboxItem = z.infer<typeof RoadmapInboxItemSchema>;
export type RoadmapInbox = z.infer<typeof RoadmapInboxSchema>;
export type RoadmapInboxRefresh = z.infer<typeof RoadmapInboxRefreshSchema>;
export type RoadmapInboxPromote = z.infer<typeof RoadmapInboxPromoteSchema>;
