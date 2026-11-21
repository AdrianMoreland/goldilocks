import { describe, expect, it } from 'vitest';
import {
  UpdateUserRequestSchema,
  diffOverrides,
  diffPermissionMatrix,
  diffUserChanges,
} from './people.schema';

describe('diffPermissionMatrix', () => {
  it('lists each cell that changed, as granted or removed, roles in their usual order', () => {
    const before = { ADMIN: [], MANAGER: ['analytics.sales'], SALES: ['analytics.pricing'], ACCOUNTING: [], AUDITOR: [] } as const;
    const after = { ADMIN: [], MANAGER: [], SALES: ['analytics.pricing', 'analytics.ops'], ACCOUNTING: [], AUDITOR: [] } as const;
    expect(diffPermissionMatrix(before, after)).toEqual([
      { role: 'MANAGER', key: 'analytics.sales', granted: false },
      { role: 'SALES', key: 'analytics.ops', granted: true },
    ]);
  });

  it('is empty when nothing changed, whatever the order of keys', () => {
    const m = { ADMIN: [], MANAGER: ['analytics.sales', 'analytics.orders'], SALES: [], ACCOUNTING: [], AUDITOR: [] } as const;
    const same = { ...m, MANAGER: ['analytics.orders', 'analytics.sales'] } as const;
    expect(diffPermissionMatrix(m, same)).toEqual([]);
  });
});

describe('diffUserChanges', () => {
  const before = { role: 'SALES' as const, admin: false, isActive: true, branchId: 1 };

  it('lists only the fields that really change', () => {
    expect(diffUserChanges(before, { role: 'MANAGER', admin: false, branchId: 2 })).toEqual([
      { field: 'role', from: 'SALES', to: 'MANAGER' },
      { field: 'branchId', from: 1, to: 2 },
    ]);
  });

  it('is empty when the patch repeats the current values', () => {
    expect(diffUserChanges(before, { isActive: true })).toEqual([]);
  });
});

describe('diffOverrides', () => {
  it('describes added, changed and removed overrides', () => {
    const before = [
      { key: 'analytics.ops' as const, granted: true, expiresAt: null },
      { key: 'analytics.sales' as const, granted: false, expiresAt: null },
    ];
    const after = [
      { key: 'analytics.ops' as const, granted: true, expiresAt: '2026-12-12T00:00:00.000Z' },
      { key: 'analytics.chatbot' as const, granted: true, expiresAt: null },
    ];
    expect(diffOverrides(before, after)).toEqual([
      { key: 'analytics.chatbot', from: null, to: 'grant' },
      { key: 'analytics.ops', from: 'grant', to: 'grant until 2026-12-12' },
      { key: 'analytics.sales', from: 'remove', to: null },
    ]);
  });
});

describe('diffOverrides on the time of day', () => {
  it('sees a change in the expiry time even on the same date', () => {
    const at = (iso: string) => [{ key: 'analytics.ops' as const, granted: true, expiresAt: iso }];
    expect(diffOverrides(at('2026-12-12T00:00:00.000Z'), at('2026-12-12T18:00:00.000Z'))).toHaveLength(1);
    expect(diffOverrides(at('2026-12-12T18:00:00Z'), at('2026-12-12T18:00:00.000Z'))).toHaveLength(0);
  });
});

describe('UpdateUserRequestSchema', () => {
  it('needs a reason and at least one change', () => {
    expect(UpdateUserRequestSchema.safeParse({ role: 'SALES', reason: 'moved desk' }).success).toBe(true);
    expect(UpdateUserRequestSchema.safeParse({ role: 'SALES' }).success).toBe(false);
    expect(UpdateUserRequestSchema.safeParse({ reason: 'nothing' }).success).toBe(false);
    expect(UpdateUserRequestSchema.safeParse({ role: 'SALES', reason: '  ' }).success).toBe(false);
  });
});
