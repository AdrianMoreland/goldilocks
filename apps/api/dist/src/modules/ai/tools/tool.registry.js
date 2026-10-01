"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var ToolRegistry_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToolRegistry = void 0;
const common_1 = require("@nestjs/common");
const zod_1 = require("zod");
const ai_tool_port_1 = require("./ai-tool.port");
const MAX_RESULT_CHARS = 6000;
let ToolRegistry = ToolRegistry_1 = class ToolRegistry {
    logger = new common_1.Logger(ToolRegistry_1.name);
    byName;
    constructor(tools) {
        this.byName = new Map(tools.map((tool) => [tool.name, tool]));
    }
    specs() {
        return [...this.byName.values()]
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((tool) => {
            const { $schema: _ignored, ...parameters } = zod_1.z.toJSONSchema(tool.schema, { io: 'input' });
            return {
                name: tool.name,
                description: tool.description,
                parameters,
            };
        });
    }
    async execute(call, context) {
        const tool = this.byName.get(call.name);
        if (!tool) {
            return this.failure(call.name, 'There is no such tool.');
        }
        let raw;
        try {
            raw = call.arguments ? JSON.parse(call.arguments) : {};
        }
        catch {
            return this.failure(call.name, 'The arguments were not valid JSON.');
        }
        const parsed = tool.schema.safeParse(raw);
        if (!parsed.success) {
            return this.failure(call.name, `Invalid arguments: ${parsed.error.issues.map((i) => `${i.path.join('.') || 'arguments'}: ${i.message}`).join('; ')}`);
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
        }
        catch (error) {
            this.logger.warn(`Tool ${call.name} failed: ${error instanceof Error ? error.message : String(error)}`);
            return this.failure(call.name, 'The lookup failed. Tell the staff member the live figures could not be read, and do not guess them.');
        }
    }
    failure(name, message) {
        return { name, content: JSON.stringify({ error: message }), ok: false };
    }
};
exports.ToolRegistry = ToolRegistry;
exports.ToolRegistry = ToolRegistry = ToolRegistry_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(ai_tool_port_1.AI_TOOLS)),
    __metadata("design:paramtypes", [Array])
], ToolRegistry);
//# sourceMappingURL=tool.registry.js.map