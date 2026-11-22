"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LlmModule = exports.LLM_PROVIDER_KEY = void 0;
exports.resolveLlmProvider = resolveLlmProvider;
exports.llmModelMismatch = llmModelMismatch;
exports.createLlmClient = createLlmClient;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const anthropic_llm_client_1 = require("./anthropic-llm.client");
const llm_port_1 = require("./llm.port");
const openai_llm_client_1 = require("./openai-llm.client");
function resolveLlmProvider(config) {
    const raw = (config.get('AI_PROVIDER') ?? '').trim().toLowerCase();
    if (raw === 'anthropic' || raw === 'openai')
        return raw;
    if (raw) {
        throw new Error(`AI_PROVIDER must be "anthropic" or "openai", not "${raw}".`);
    }
    return config.get('OPENAI_API_KEY') &&
        !config.get('ANTHROPIC_API_KEY')
        ? 'openai'
        : 'anthropic';
}
exports.LLM_PROVIDER_KEY = {
    anthropic: 'ANTHROPIC_API_KEY',
    openai: 'OPENAI_API_KEY',
};
function llmModelMismatch(config) {
    const model = (config.get('AI_MODEL') ?? '').trim().toLowerCase();
    if (!model)
        return null;
    const provider = resolveLlmProvider(config);
    if (provider === 'anthropic' && !model.startsWith('claude')) {
        return `AI_MODEL "${model}" is not a Claude model, but AI_PROVIDER is anthropic.`;
    }
    if (provider === 'openai' && model.startsWith('claude')) {
        return `AI_MODEL "${model}" is a Claude model, but AI_PROVIDER is openai.`;
    }
    return null;
}
function createLlmClient(config) {
    return resolveLlmProvider(config) === 'openai'
        ? new openai_llm_client_1.OpenAiLlmClient(config)
        : new anthropic_llm_client_1.AnthropicLlmClient(config);
}
let LlmModule = class LlmModule {
};
exports.LlmModule = LlmModule;
exports.LlmModule = LlmModule = __decorate([
    (0, common_1.Module)({
        imports: [config_1.ConfigModule],
        providers: [
            {
                provide: llm_port_1.LLM_PROVIDER,
                useFactory: createLlmClient,
                inject: [config_1.ConfigService],
            },
        ],
        exports: [llm_port_1.LLM_PROVIDER],
    })
], LlmModule);
//# sourceMappingURL=llm.module.js.map