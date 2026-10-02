import { z } from 'zod';

/** The roadmap Markdown as stored in the database. `version` is bumped on every save (optimistic locking). */
export const RoadmapDocumentSchema = z.object({
  markdown: z.string(),
  version: z.number().int().nonnegative(),
  updatedBy: z.string().nullable(),
  updatedAt: z.iso.datetime().nullable(),
});

const TaskText = z.string().trim().min(1, 'Task text is required').max(500).refine((t) => !/[\r\n]/.test(t), 'Task text must be one line');
const Line = z.number().int().nonnegative();

/**
 * One change to the roadmap. Lines are 0-based indexes into the version the client is looking at;
 * `text` repeats the task's current text so a stale index is refused instead of hitting the wrong task.
 */
export const RoadmapEditSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('toggle'), line: Line, text: z.string(), checked: z.boolean() }),
  z.object({ type: z.literal('add'), sectionLine: Line, parentLine: Line.optional(), text: TaskText }),
  z.object({ type: z.literal('delete'), line: Line, text: z.string() }),
  z.object({ type: z.literal('edit'), line: Line, text: z.string(), newText: TaskText }),
]);

export const RoadmapEditRequestSchema = z.object({
  /** The document version the edit was made against. */
  version: z.number().int().nonnegative(),
  edit: RoadmapEditSchema,
});

export type RoadmapDocument = z.infer<typeof RoadmapDocumentSchema>;
export type RoadmapEdit = z.infer<typeof RoadmapEditSchema>;
export type RoadmapEditRequest = z.infer<typeof RoadmapEditRequestSchema>;
