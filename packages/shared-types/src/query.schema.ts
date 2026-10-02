import { z } from 'zod';
import { LogLevelEnum } from './admin.schema';

// Query strings arrive as text. `Number(x) || fallback` used to turn "abc", "" and "0" into the
// fallback without a word; these reject them with a 400 instead, so a typo in a URL is visible.

/** A positive whole number from a query string, with a default and an upper bound. */
const boundedInt = (defaultValue: number, max: number) =>
  z.coerce.number().int().min(1).max(max).default(defaultValue);

/** `?limit=` — the newest N rows of a log-style list. */
export const limitQuery = (defaultValue: number, max: number) =>
  z.object({ limit: boundedInt(defaultValue, max) });

export const AdminLogsQuerySchema = z.object({
  limit: boundedInt(200, 1000),
  level: LogLevelEnum.default('info'),
  q: z.string().optional(),
});
export type AdminLogsQuery = z.infer<typeof AdminLogsQuerySchema>;

export const AuditQuerySchema = limitQuery(100, 500);
export const ErrorLogQuerySchema = limitQuery(100, 500);
export const FetchLogQuerySchema = limitQuery(20, 100);

export const DbRowsQuerySchema = z.object({
  page: boundedInt(1, 1_000_000),
  pageSize: boundedInt(50, 200),
  sort: z.string().optional(),
  dir: z.enum(['asc', 'desc']).default('desc'),
  q: z.string().optional(),
});
export type DbRowsQuery = z.infer<typeof DbRowsQuerySchema>;

export const BackfillHistoryQuerySchema = z.object({
  years: boundedInt(5, 10),
});
export type BackfillHistoryQuery = z.infer<typeof BackfillHistoryQuerySchema>;
