import { z } from 'zod';
import { RecalculateOverridesSchema } from './market-data.schema';

/**
 * Internal AI assistant (roadmap 1.5; plan in docs/AI-AGENT-PLAN.md).
 * One question in, one answer out — no conversation history is sent.
 */

/**
 * What the staff member wants from the assistant:
 *  procedures — answer a question about how the desk works (from the approved SOPs)
 *  email      — they pasted a customer's email; draft a reply to send back
 *  whatsapp   — the same, for a WhatsApp message (shorter, less formal)
 */
export const AiModeEnum = z.enum(['procedures', 'email', 'whatsapp']);
export type AiMode = z.infer<typeof AiModeEnum>;

/** Long enough for a real question, short enough that nobody pastes a document (and its tokens) into it. */
export const AI_QUESTION_MAX_LENGTH = 500;
/** A pasted customer message is longer than a question, but still bounded. */
export const AI_MESSAGE_MAX_LENGTH = 4000;

export function aiInputLimit(mode: AiMode): number {
  return mode === 'procedures' ? AI_QUESTION_MAX_LENGTH : AI_MESSAGE_MAX_LENGTH;
}

export const AskRequestSchema = z
  .object({
    /** A question (procedures) or the customer's pasted message (email, whatsapp). */
    question: z.string().trim().min(1).max(AI_MESSAGE_MAX_LENGTH),
    mode: AiModeEnum.default('procedures'),
    /**
     * The spot the product table is quoting from, when the user has frozen or typed one — otherwise
     * the live spot is used. Sent so a price the assistant quotes matches the price on screen.
     */
    spotOverrides: RecalculateOverridesSchema.optional(),
  })
  .refine((request) => request.question.length <= aiInputLimit(request.mode), {
    path: ['question'],
    message: 'That is too long for a question. Keep it under 500 characters.',
  });
export type AskRequest = z.infer<typeof AskRequestSchema>;
/** What a client sends: `mode` may be left out and defaults to "procedures". */
export type AskRequestInput = z.input<typeof AskRequestSchema>;

/**
 * answered — answered from the SOPs, with at least one valid citation
 * refused  — the approved SOPs don't cover it (or it isn't confirmed), and the assistant said so
 * uncited  — the model answered but cited nothing the library recognises; shown with a warning
 */
export const AiAnswerStatusEnum = z.enum(['answered', 'refused', 'uncited']);
export type AiAnswerStatus = z.infer<typeof AiAnswerStatusEnum>;

/** A section of a SOP the answer relied on. `anchor` is null for a citation of a whole SOP. */
export const AiCitationSchema = z.object({
  slug: z.string(),
  anchor: z.string().nullable(),
  title: z.string(),
  heading: z.string().nullable(),
});
export type AiCitation = z.infer<typeof AiCitationSchema>;

export const AiUsageSchema = z.object({
  inputTokens: z.number().int(),
  /** The part of the input served from OpenAI's prompt cache (billed at a fraction). */
  cachedInputTokens: z.number().int(),
  outputTokens: z.number().int(),
});
export type AiUsage = z.infer<typeof AiUsageSchema>;

export const AskResponseSchema = z.object({
  /** Markdown. Citations are left in as `[[slug#section]]`, which the reader turns into links. */
  answer: z.string(),
  mode: AiModeEnum,
  status: AiAnswerStatusEnum,
  citations: z.array(AiCitationSchema),
  model: z.string(),
  usage: AiUsageSchema,
  latencyMs: z.number().int(),
  /** Which SOPs the answer was based on — the audit trail for "what did it know when it said that?". */
  corpus: z.object({ documents: z.number().int(), hash: z.string() }),
  /** Served from the answer cache: no model call, so usage is zero. */
  cached: z.boolean(),
  /** Email/WhatsApp only: notes for the staff member (what the reply assumes, what to check), apart from the message to send. `answer` is the message itself. */
  notes: z.string().nullable(),
  /** Things to check before relying on the answer, e.g. a figure that did not come from a price lookup, or prices that may be out of date. */
  warnings: z.array(z.string()),
  /** Which live lookups the answer used (getSpot, findProductPrices). Empty for a pure SOP answer. */
  toolsUsed: z.array(z.string()),
});
export type AskResponse = z.infer<typeof AskResponseSchema>;

export const AiStatusSchema = z.object({
  enabled: z.boolean(),
  model: z.string(),
});
export type AiStatus = z.infer<typeof AiStatusSchema>;

/**
 * What POST /ai/ask/stream sends, one JSON object per server-sent event:
 *  delta — a piece of the answer as the model writes it (shown live, may still be corrected)
 *  tool  — the assistant is looking something up (e.g. a price); no text yet
 *  done  — the final, validated answer; the reader replaces whatever it streamed with this
 *  error — the question could not be answered; `status` is the HTTP status it would have had
 */
export const AskStreamEventSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('delta'), text: z.string() }),
  z.object({ type: z.literal('tool'), name: z.string() }),
  z.object({ type: z.literal('done'), response: AskResponseSchema }),
  z.object({ type: z.literal('error'), status: z.number().int(), message: z.string() }),
]);
export type AskStreamEvent = z.infer<typeof AskStreamEventSchema>;
