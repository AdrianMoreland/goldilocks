import { Inject, Injectable, Logger } from '@nestjs/common';
import { z } from 'zod';
import type {
    LlmToolCall,
    LlmToolSpec,
} from '../../../infrastructure/llm/llm.port';
import { AI_TOOLS, type AiTool, type AiToolContext } from './ai-tool.port';

/** A tool result is read by a language model; keep one from flooding the prompt. */
const MAX_RESULT_CHARS = 6000;

export interface ToolOutcome {
    name: string;
    /** JSON text sent back to the model. */
    content: string;
    /** The same result as data, for the figure check and the stale-price warning. Undefined when the lookup failed. */
    data?: unknown;
    ok: boolean;
}

/**
 * The tools the model is offered, and the one place that runs them. What the
 * model writes as arguments is untrusted: it is parsed and validated against
 * the tool's Zod schema, and a bad call or a failing lookup becomes an error
 * message the model can relay, never an exception that ends the conversation.
 */
@Injectable()
export class ToolRegistry {
    private readonly logger = new Logger(ToolRegistry.name);
    private readonly byName: Map<string, AiTool>;

    constructor(@Inject(AI_TOOLS) tools: AiTool[]) {
        this.byName = new Map(tools.map((tool) => [tool.name, tool]));
    }

    /** What the model is told it may call. Stable order and content, so it stays part of the cacheable prompt prefix. */
    specs(): LlmToolSpec[] {
        return [...this.byName.values()]
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((tool) => {
                const { $schema: _ignored, ...parameters } = z.toJSONSchema(
                    tool.schema,
                    { io: 'input' },
                ) as Record<string, unknown>;
                return {
                    name: tool.name,
                    description: tool.description,
                    parameters,
                };
            });
    }

    async execute(
        call: LlmToolCall,
        context: AiToolContext,
    ): Promise<ToolOutcome> {
        const tool = this.byName.get(call.name);
        if (!tool) {
            return this.failure(call.name, 'There is no such tool.');
        }

        let raw: unknown;
        try {
            raw = call.arguments ? JSON.parse(call.arguments) : {};
        } catch {
            return this.failure(
                call.name,
                'The arguments were not valid JSON.',
            );
        }

        const parsed = tool.schema.safeParse(raw);
        if (!parsed.success) {
            return this.failure(
                call.name,
                `Invalid arguments: ${parsed.error.issues.map((i) => `${i.path.join('.') || 'arguments'}: ${i.message}`).join('; ')}`,
            );
        }

        try {
            const result = await tool.run(parsed.data, context);
            const content = JSON.stringify(result);
            return {
                name: call.name,
                ...(content.length > MAX_RESULT_CHARS
                    ? {
                          content: JSON.stringify({
                              error: 'The result was too large to return. Ask for something narrower.',
                          }),
                      }
                    : { content, data: result }),
                ok: true,
            };
        } catch (error) {
            this.logger.warn(
                `Tool ${call.name} failed: ${error instanceof Error ? error.message : String(error)}`,
            );
            return this.failure(
                call.name,
                'The lookup failed. Tell the staff member the live figures could not be read, and do not guess them.',
            );
        }
    }

    private failure(name: string, message: string): ToolOutcome {
        return { name, content: JSON.stringify({ error: message }), ok: false };
    }
}
