import type { LlmToolCall, LlmToolSpec } from '../../../infrastructure/llm/llm.port';
import { type AiTool, type AiToolContext } from './ai-tool.port';
export interface ToolOutcome {
    name: string;
    content: string;
    data?: unknown;
    ok: boolean;
}
export declare class ToolRegistry {
    private readonly logger;
    private readonly byName;
    constructor(tools: AiTool[]);
    specs(): LlmToolSpec[];
    execute(call: LlmToolCall, context: AiToolContext): Promise<ToolOutcome>;
    private failure;
}
//# sourceMappingURL=tool.registry.d.ts.map