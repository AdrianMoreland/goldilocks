import { z } from 'zod';

// ============================================================================
// ERROR LOG — what went wrong, where, and for whom. Server-side failures are
// recorded by the API's global exception filter; the web app reports its own
// failures (network drops, bad responses, crashes) via POST /errors/client.
// Surfaced in the Admin panel's Error log.
// ============================================================================

export const ErrorLogSourceEnum = z.enum(['server', 'client']);
export const ErrorLogSeverityEnum = z.enum(['error', 'warning']);

/**
 * Machine-readable category, so the Admin panel can group and explain:
 *  - database      Prisma / Postgres failure
 *  - http          an API request answered with an error status
 *  - network       the browser couldn't reach the API at all
 *  - external-api  the metal-price vendor failed
 *  - response      the API answered, but not in the shape the app expects
 *  - crash         an unhandled exception (server or browser)
 */
export const ErrorLogKindEnum = z.enum(['database', 'http', 'network', 'external-api', 'response', 'crash']);

export const ErrorLogEntrySchema = z.object({
    id: z.string(),
    /** Short code shown to staff in the error toast ("ref E-7F3K2"), to find the matching entry. */
    reference: z.string(),
    at: z.string(),
    source: ErrorLogSourceEnum,
    severity: ErrorLogSeverityEnum,
    kind: ErrorLogKindEnum,
    message: z.string(),
    detail: z.string().nullable().optional(),
    statusCode: z.number().nullable().optional(),
    method: z.string().nullable().optional(),
    path: z.string().nullable().optional(),
    /** Vendor/driver error code, e.g. Prisma's "P1001". */
    code: z.string().nullable().optional(),
    stack: z.string().nullable().optional(),
    user: z.string().nullable().optional(),
    userAgent: z.string().nullable().optional(),
});

/** What the web app sends for a browser-side failure. Bounded so a bug can't flood Redis. */
export const ClientErrorReportSchema = z.object({
    reference: z.string().max(20),
    occurredAt: z.string().max(40),
    severity: ErrorLogSeverityEnum,
    kind: ErrorLogKindEnum,
    message: z.string().max(500),
    detail: z.string().max(4000).optional(),
    statusCode: z.number().int().optional(),
    method: z.string().max(10).optional(),
    path: z.string().max(500).optional(),
    stack: z.string().max(4000).optional(),
});

export const ClientErrorReportBatchSchema = z.object({
    reports: z.array(ClientErrorReportSchema).max(50),
});

export type ErrorLogSource = z.infer<typeof ErrorLogSourceEnum>;
export type ErrorLogSeverity = z.infer<typeof ErrorLogSeverityEnum>;
export type ErrorLogKind = z.infer<typeof ErrorLogKindEnum>;
export type ErrorLogEntry = z.infer<typeof ErrorLogEntrySchema>;
export type ClientErrorReport = z.infer<typeof ClientErrorReportSchema>;
export type ClientErrorReportBatch = z.infer<typeof ClientErrorReportBatchSchema>;

/** "E-7F3K2" — short enough to read out over the phone. */
export function createErrorReference(): string {
    const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let out = '';
    for (let i = 0; i < 5; i++) out += alphabet[Math.floor(Math.random() * alphabet.length)];
    return `E-${out}`;
}
