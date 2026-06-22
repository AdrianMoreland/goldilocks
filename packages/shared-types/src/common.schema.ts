import { z } from 'zod';

// ============================================================================
// API RESPONSE WRAPPERS
// ============================================================================

export const ApiSuccessResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
    z.object({
        success: z.literal(true),
        data: dataSchema,
        message: z.string().optional(),
    });

export const ApiErrorResponseSchema = z.object({
    success: z.literal(false),
    error: z.object({
        code: z.string(),
        message: z.string(),
        details: z.any().optional(),
    }),
    timestamp: z.iso.datetime(),
});

// ============================================================================
// PAGINATION & UTILITIES
// ============================================================================

export const PaginationSchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
});

export const HealthCheckSchema = z.object({
    status: z.literal('ok'),
    timestamp: z.iso.datetime(),
    uptime: z.number(),
    environment: z.string(),
});

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type Pagination = z.infer<typeof PaginationSchema>;
export type HealthCheck = z.infer<typeof HealthCheckSchema>;
export type ApiSuccessResponse<T> = z.infer<ReturnType<typeof ApiSuccessResponseSchema<z.ZodType<T>>>>;
export type ApiErrorResponse = z.infer<typeof ApiErrorResponseSchema>;