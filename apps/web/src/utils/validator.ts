import { z } from 'zod';

export async function requestValidated<TSchema extends z.ZodTypeAny>(
    schema: TSchema,
    url: string,
    request: <T>(url: string, options?: RequestInit) => Promise<T>,
    options?: RequestInit,
): Promise<z.infer<TSchema>> {
    const data = await request<unknown>(url, options);

    return schema.parse(data);
}