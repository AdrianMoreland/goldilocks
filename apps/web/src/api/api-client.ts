import { z } from 'zod';
import { useApi } from '@/hooks/useApi';

export function useApiClient() {
    const { request } = useApi();

    async function get<TSchema extends z.ZodTypeAny>(
        url: string,
        schema: TSchema,
    ): Promise<z.infer<TSchema>> {
        const result = await request(url);
        return schema.parse(result);
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

        return schema.parse(result);
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

        return schema.parse(result);
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

        return schema.parse(result);
    }

    async function del<TSchema extends z.ZodTypeAny>(
        url: string,
        schema: TSchema,
    ): Promise<z.infer<TSchema>> {
        const result = await request(url, {
            method: 'DELETE',
        });

        return schema.parse(result);
    }

    return {
        get,
        post,
        put,
        patch,
        del,
    };
}