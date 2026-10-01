"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiCatalogueService = void 0;
const common_1 = require("@nestjs/common");
const METHODS = ['get', 'post', 'put', 'patch', 'delete'];
const MAX_DEPTH = 5;
let ApiCatalogueService = class ApiCatalogueService {
    document = null;
    setDocument(document) {
        this.document = document;
    }
    list() {
        const doc = this.document;
        if (!doc)
            return [];
        const endpoints = [];
        for (const [path, item] of Object.entries(doc.paths ?? {})) {
            for (const method of METHODS) {
                const op = item[method];
                if (!op)
                    continue;
                const parameters = (op.parameters ?? []).flatMap((p) => {
                    const param = this.resolve(doc, p);
                    if (!['path', 'query', 'header'].includes(param.in)) {
                        return [];
                    }
                    const schema = param.schema
                        ? this.resolve(doc, param.schema)
                        : {};
                    return [
                        {
                            name: param.name,
                            in: param.in,
                            required: param.in === 'path' || !!param.required,
                            type: schema.type ?? 'string',
                            options: schema.enum?.map(String),
                            description: param.description,
                        },
                    ];
                });
                const bodySchema = op.requestBody?.content?.['application/json']?.schema;
                endpoints.push({
                    method: method.toUpperCase(),
                    path,
                    summary: op.summary ?? '',
                    description: op.description,
                    tag: op.tags?.[0] ?? 'other',
                    requiresAuth: (op.security?.length ?? 0) > 0,
                    parameters,
                    bodyExample: bodySchema
                        ? this.example(doc, bodySchema, 0)
                        : null,
                });
            }
        }
        return endpoints.sort((a, b) => a.tag.localeCompare(b.tag) ||
            a.path.localeCompare(b.path) ||
            a.method.localeCompare(b.method));
    }
    resolve(doc, node) {
        let current = node;
        for (let i = 0; i < MAX_DEPTH && current?.$ref; i++) {
            const target = current.$ref
                .replace(/^#\//, '')
                .split('/')
                .reduce((acc, key) => acc?.[key], doc);
            if (!target)
                break;
            current = target;
        }
        return current;
    }
    example(doc, node, depth) {
        const schema = this.resolve(doc, node);
        if (!schema || depth > MAX_DEPTH)
            return null;
        if (schema.example !== undefined)
            return schema.example;
        if (schema.default !== undefined)
            return schema.default;
        if (schema.enum?.length)
            return schema.enum[0];
        const composed = schema.allOf ?? schema.oneOf ?? schema.anyOf;
        if (composed?.length)
            return this.example(doc, composed[0], depth + 1);
        switch (schema.type) {
            case 'object': {
                const out = {};
                for (const [key, child] of Object.entries(schema.properties ?? {})) {
                    out[key] = this.example(doc, child, depth + 1);
                }
                return out;
            }
            case 'array':
                return schema.items
                    ? [this.example(doc, schema.items, depth + 1)]
                    : [];
            case 'integer':
            case 'number':
                return 0;
            case 'boolean':
                return false;
            default:
                return '';
        }
    }
};
exports.ApiCatalogueService = ApiCatalogueService;
exports.ApiCatalogueService = ApiCatalogueService = __decorate([
    (0, common_1.Injectable)()
], ApiCatalogueService);
//# sourceMappingURL=api-catalogue.service.js.map