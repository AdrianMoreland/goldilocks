import { z } from 'zod';
import { toast } from 'sonner';
import { ApiError, useApi } from '@/hooks/useApi';
import { recordClientError } from '@/lib/error-log';

/**
 * Validates a response against its schema. A mismatch means the API and the
 * web app disagree about a shape (usually a deploy of one without the
 * other) — recorded and sent to the error log with the exact Zod issues,
 * instead of surfacing as a confusing crash further down.
 */
function parseResponse<TSchema extends z.ZodTypeAny>(schema: TSchema, result: unknown, method: string, url: string): z.infer<TSchema> {
    const parsed = schema.safeParse(result);
    if (parsed.success) return parsed.data;

    const issues = parsed.error.issues
        .slice(0, 10)
        .map((issue) => `${issue.path.join('.') || '(root)'}: ${issue.message}`)
        .join('\n');
    const reference = recordClientError({
        kind: 'response',
        message: `Unexpected response from ${method} ${url}`,
        detail: issues,
        method,
        path: url,
    });
    toast.error("The server sent data the app didn't expect.", { description: `Ref ${reference} — details in Admin panel → Error log.` });
    throw new ApiError('Unexpected response shape', null, reference);
}

export function useApiClient() {
    const { request } = useApi();

    async function get<TSchema extends z.ZodTypeAny>(
        url: string,
        schema: TSchema,
    ): Promise<z.infer<TSchema>> {
        const result = await request(url);
        return parseResponse(schema, result, 'GET', url);
    }

    async function post<TSchema extends z.ZodTypeAny>(
        url: string,
        body: unknown,
        schema: TSchema,
    ): Promise<z.infer<TSchema>> {
        const result = await request(url, {
            method: 'POST',
            body: JSON.stringify(body),
        });

        return parseResponse(schema, result, 'POST', url);
    }

    async function put<TSchema extends z.ZodTypeAny>(
        url: string,
        body: unknown,
        schema: TSchema,
    ): Promise<z.infer<TSchema>> {
        const result = await request(url, {
            method: 'PUT',
            body: JSON.stringify(body),
        });

        return parseResponse(schema, result, 'PUT', url);
    }

    async function patch<TSchema extends z.ZodTypeAny>(
        url: string,
        body: unknown,
        schema: TSchema,
    ): Promise<z.infer<TSchema>> {
        const result = await request(url, {
            method: 'PATCH',
            body: JSON.stringify(body),
        });

        return parseResponse(schema, result, 'PATCH', url);
    }

    async function del<TSchema extends z.ZodTypeAny>(
        url: string,
        schema: TSchema,
        body?: unknown,
    ): Promise<z.infer<TSchema>> {
        const result = await request(url, {
            method: 'DELETE',
            ...(body !== undefined && { body: JSON.stringify(body) }),
        });

        return parseResponse(schema, result, 'DELETE', url);
    }

    return {
        get,
        post,
        put,
        patch,
        del,
    };
}