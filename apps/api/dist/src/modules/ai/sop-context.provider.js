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
Object.defineProperty(exports, "__esModule", { value: true });
exports.FullCorpusContext = exports.SOP_CONTEXT = void 0;
const common_1 = require("@nestjs/common");
const knowledge_service_1 = require("../knowledge/knowledge.service");
const prompt_builder_1 = require("./prompt-builder");
exports.SOP_CONTEXT = Symbol('SOP_CONTEXT');
let FullCorpusContext = class FullCorpusContext {
    knowledge;
    constructor(knowledge) {
        this.knowledge = knowledge;
    }
    async load() {
        return (0, prompt_builder_1.buildPrompt)(await this.knowledge.listApproved());
    }
};
exports.FullCorpusContext = FullCorpusContext;
exports.FullCorpusContext = FullCorpusContext = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [knowledge_service_1.KnowledgeService])
], FullCorpusContext);
//# sourceMappingURL=sop-context.provider.js.map