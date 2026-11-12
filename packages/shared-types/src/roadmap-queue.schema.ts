import { z } from 'zod';

/** Where a queued note came from. Queue notes only ever add a line to docs/INBOX.md; they carry no ID, priority or effort. */
export const RoadmapQueueSourceSchema = z.enum(['phone', 'web']);

export const ROADMAP_QUEUE_MAX_TEXT = 500;

/** A note typed in the app or sent from the phone shortcut. Whitespace is collapsed on the server. */
export const RoadmapQueueRequestSchema = z.object({
  text: z.string().trim().min(1, 'Note is required').max(ROADMAP_QUEUE_MAX_TEXT * 2),
});

export const RoadmapQueueEntrySchema = z.object({
  id: z.number().int().positive(),
  text: z.string(),
  source: RoadmapQueueSourceSchema,
  /** `new` until a laptop session has filed it into docs/INBOX.md, then `filed`. */
  status: z.enum(['new', 'filed']),
  /** The INBOX line this note becomes: `- YYYY-MM-DD (source): text`. */
  line: z.string(),
  createdAt: z.iso.datetime(),
  filedAt: z.iso.datetime().nullable(),
});

export const RoadmapQueueListSchema = z.object({
  entries: z.array(RoadmapQueueEntrySchema),
});

export const RoadmapQueueAppendedSchema = z.object({
  id: z.number().int().positive(),
  line: z.string(),
});

export const RoadmapQueueFiledRequestSchema = z.object({
  ids: z.array(z.number().int().positive()).min(1).max(200),
});

export const RoadmapQueueFiledResultSchema = z.object({
  filed: z.number().int().nonnegative(),
});

export type RoadmapQueueSource = z.infer<typeof RoadmapQueueSourceSchema>;
export type RoadmapQueueRequest = z.infer<typeof RoadmapQueueRequestSchema>;
export type RoadmapQueueEntry = z.infer<typeof RoadmapQueueEntrySchema>;
export type RoadmapQueueList = z.infer<typeof RoadmapQueueListSchema>;
export type RoadmapQueueAppended = z.infer<typeof RoadmapQueueAppendedSchema>;
export type RoadmapQueueFiledRequest = z.infer<typeof RoadmapQueueFiledRequestSchema>;
export type RoadmapQueueFiledResult = z.infer<typeof RoadmapQueueFiledResultSchema>;
