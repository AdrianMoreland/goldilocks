import type { z } from 'zod';
import type { RecalculateOverrides } from '@goldilocks/shared-types';
export interface AiToolContext {
    spotOverrides: RecalculateOverrides;
    now: Date;
}
export interface AiTool<TArgs = unknown> {
    readonly name: string;
    readonly description: string;
    readonly schema: z.ZodType<TArgs>;
    run(args: TArgs, context: AiToolContext): Promise<unknown>;
}
export declare const AI_TOOLS: unique symbol;
//# sourceMappingURL=ai-tool.port.d.ts.map