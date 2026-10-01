import { Injectable } from '@nestjs/common';
import type { OpenAPIObject } from '@nestjs/swagger';
import type {
    ApiEndpoint,
    ApiEndpointParameter,
} from '@goldilocks/shared-types';

type Schema = {
    $ref?: string;
    type?: string;
    properties?: Record<string, Schema>;
    items?: Schema;
    enum?: unknown[];
    example?: unknown;
    default?: unknown;
    allOf?: Schema[];
    oneOf?: Schema[];
    anyOf?: Schema[];
    format?: string;
};

const METHODS = ['get', 'post', 'put', 'patch', 'delete'] as const;
const MAX_DEPTH = 5;

/**
 * The list of routes the endpoint tester offers. Built from the same OpenAPI
 * document Swagger uses — but held here, so the tester keeps working in
 * production where the public /docs page is switched off.
 */
@Injectable()
export class ApiCatalogueService {
    private document: OpenAPIObject | null = null;

    setDocument(document: OpenAPIObject): void {
        this.document = document;
    }

    list(): ApiEndpoint[] {
        const doc = this.document;
        if (!doc) return [];

        const endpoints: ApiEndpoint[] = [];
        for (const [path, item] of Object.entries(doc.paths ?? {})) {
            for (const method of METHODS) {
                const op = item[method];
                if (!op) continue;

                const parameters = (op.parameters ?? []).flatMap(
                    (p): ApiEndpointParameter[] => {
                        const param = this.resolve(doc, p) as {
                            name: string;
                            in: string;
                            required?: boolean;
                            description?: string;
                            schema?: Schema;
                        };
                        if (!['path', 'query', 'header'].includes(param.in)) {
                            return [];
                        }
                        const schema = param.schema
                            ? (this.resolve(doc, param.schema) as Schema)
                            : {};
                        return [
                            {
                                name: param.name,
                                in: param.in as 'path' | 'query' | 'header',
                                required:
                                    param.in === 'path' || !!param.required,
                                type: schema.type ?? 'string',
                                options: schema.enum?.map(String),
                                description: param.description,
                            },
                        ];
                    },
                );

                const bodySchema = (
                    op.requestBody as
                        | {
                              content?: Record<string, { schema?: Schema }>;
                          }
                        | undefined
                )?.content?.['application/json']?.schema;

                endpoints.push({
                    method: method.toUpperCase() as ApiEndpoint['method'],
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

        return endpoints.sort(
            (a, b) =>
                a.tag.localeCompare(b.tag) ||
                a.path.localeCompare(b.path) ||
                a.method.localeCompare(b.method),
        );
    }

    private resolve(doc: OpenAPIObject, node: unknown): unknown {
        let current = node as Schema;
        for (let i = 0; i < MAX_DEPTH && current?.$ref; i++) {
            const target = current.$ref
                .replace(/^#\//, '')
                .split('/')
                .reduce<unknown>(
                    (acc, key) => (acc as Record<string, unknown>)?.[key],
                    doc,
                );
            if (!target) break;
            current = target;
        }
        return current;
    }

    /** A starter value for a schema — enough to see the field names and types, not a valid fixture. */
    private example(doc: OpenAPIObject, node: Schema, depth: number): unknown {
        const schema = this.resolve(doc, node) as Schema;
        if (!schema || depth > MAX_DEPTH) return null;
        if (schema.example !== undefined) return schema.example;
        if (schema.default !== undefined) return schema.default;
        if (schema.enum?.length) return schema.enum[0];

        const composed = schema.allOf ?? schema.oneOf ?? schema.anyOf;
        if (composed?.length) return this.example(doc, composed[0], depth + 1);

        switch (schema.type) {
            case 'object': {
                const out: Record<string, unknown> = {};
                for (const [key, child] of Object.entries(
                    schema.properties ?? {},
                )) {
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
}
