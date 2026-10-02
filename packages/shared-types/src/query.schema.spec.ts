import { describe, expect, it } from 'vitest';
import {
  AdminLogsQuerySchema,
  AuditQuerySchema,
  BackfillHistoryQuerySchema,
  DbRowsQuerySchema,
  ErrorLogQuerySchema,
  FetchLogQuerySchema,
} from './query.schema';

describe('limit-style query schemas', () => {
  it.each([
    ['audit', AuditQuerySchema, 100, 500],
    ['errors', ErrorLogQuerySchema, 100, 500],
    ['fetch-log', FetchLogQuerySchema, 20, 100],
  ])('%s: defaults, coerces text and enforces the cap', (_name, schema, fallback, max) => {
    expect(schema.parse({})).toEqual({ limit: fallback });
    expect(schema.parse({ limit: '7' })).toEqual({ limit: 7 });
    expect(schema.safeParse({ limit: String(max + 1) }).success).toBe(false);
  });

  it.each(['abc', '', '0', '-5', '1.5', 'NaN'])('rejects limit=%j instead of falling back', (limit) => {
    expect(AuditQuerySchema.safeParse({ limit }).success).toBe(false);
  });
});

describe('AdminLogsQuerySchema', () => {
  it('defaults to the 200 newest info-and-above lines', () => {
    expect(AdminLogsQuerySchema.parse({})).toEqual({ limit: 200, level: 'info' });
  });

  it('accepts a known level and a search term', () => {
    expect(AdminLogsQuerySchema.parse({ level: 'error', q: 'prisma', limit: '50' })).toEqual({
      limit: 50,
      level: 'error',
      q: 'prisma',
    });
  });

  it('rejects an unknown level rather than silently showing everything', () => {
    expect(AdminLogsQuerySchema.safeParse({ level: 'loud' }).success).toBe(false);
  });
});

describe('DbRowsQuerySchema', () => {
  it('defaults to page 1, 50 rows, newest first', () => {
    expect(DbRowsQuerySchema.parse({})).toEqual({ page: 1, pageSize: 50, dir: 'desc' });
  });

  it('caps the page size at 200 and rejects a page below 1', () => {
    expect(DbRowsQuerySchema.safeParse({ pageSize: '201' }).success).toBe(false);
    expect(DbRowsQuerySchema.safeParse({ page: '0' }).success).toBe(false);
  });

  it('only allows asc or desc', () => {
    expect(DbRowsQuerySchema.parse({ dir: 'asc' }).dir).toBe('asc');
    expect(DbRowsQuerySchema.safeParse({ dir: 'sideways' }).success).toBe(false);
  });
});

describe('BackfillHistoryQuerySchema', () => {
  it('defaults to 5 years and allows 1 to 10', () => {
    expect(BackfillHistoryQuerySchema.parse({})).toEqual({ years: 5 });
    expect(BackfillHistoryQuerySchema.parse({ years: '10' })).toEqual({ years: 10 });
    expect(BackfillHistoryQuerySchema.safeParse({ years: '11' }).success).toBe(false);
    expect(BackfillHistoryQuerySchema.safeParse({ years: '0' }).success).toBe(false);
  });
});
