import type { z } from 'zod';
import type { RecalculateOverrides } from '@goldilocks/shared-types';

/** What a tool may know about the request it is serving. */
export interface AiToolContext {
    /** The spot the staff member's product table is quoting from, where they froze or typed one. */
    spotOverrides: RecalculateOverrides;
    now: Date;
}

/**
 * A read-only lookup the model may ask for (docs/AI-AGENT-PLAN.md §6). The
 * Zod schema is the single definition of its arguments: it validates what the
 * model wrote, and is also what the model is shown. A tool returns finished
 * figures from the application's own code — the model quotes them, it never
 * does price arithmetic.
 */
export interface AiTool<TArgs = unknown> {
    readonly name: string;
    readonly description: string;
    readonly schema: z.ZodType<TArgs>;
    run(args: TArgs, context: AiToolContext): Promise<unknown>;
}

/** Multi-provider token: every tool class registered under it is offered to the model. Adding a tool is adding one class here. */
export const AI_TOOLS = Symbol('AI_TOOLS');
