import { describe, expect, it } from 'vitest';
import { DEFAULT_ROLE_PERMISSIONS, PERMISSION_KEYS, effectivePermissions } from './permissions';

const NOW = new Date('2026-11-21T12:00:00Z');

describe('DEFAULT_ROLE_PERMISSIONS', () => {
  it('matches the agreed starting matrix', () => {
    const analytics = (role: keyof typeof DEFAULT_ROLE_PERMISSIONS) =>
      DEFAULT_ROLE_PERMISSIONS[role].filter((k) => k.startsWith('analytics.')).sort();
    expect(analytics('SALES')).toEqual(['analytics.inventory', 'analytics.orders', 'analytics.pricing']);
    expect(analytics('ACCOUNTING')).toEqual(['analytics.customers', 'analytics.sales']);
    expect(analytics('MANAGER')).toEqual([
      'analytics.customers',
      'analytics.inventory',
      'analytics.orders',
      'analytics.pricing',
      'analytics.sales',
    ]);
    expect(DEFAULT_ROLE_PERMISSIONS.AUDITOR).toContain('analytics.ops');
    expect(DEFAULT_ROLE_PERMISSIONS.AUDITOR).toContain('admin.audit');
    expect([...DEFAULT_ROLE_PERMISSIONS.ADMIN].sort()).toEqual([...PERMISSION_KEYS].sort());
  });
});

describe('page defaults', () => {
  const pages = (role: keyof typeof DEFAULT_ROLE_PERMISSIONS) =>
    DEFAULT_ROLE_PERMISSIONS[role].filter((k) => k.startsWith('page.')).sort();

  it('keeps unreleased pages admin-only', () => {
    for (const role of ['MANAGER', 'SALES', 'ACCOUNTING', 'AUDITOR'] as const) {
      for (const k of ['page.orders', 'page.import', 'page.customers', 'page.invoices', 'page.tradesheets', 'page.rules', 'page.inventory', 'page.analytics', 'feature.stock-levels'] as const) {
        expect(DEFAULT_ROLE_PERMISSIONS[role]).not.toContain(k);
      }
    }
  });

  it('keeps what managers and everyone already had', () => {
    expect(pages('MANAGER')).toEqual(['page.customer-orders', 'page.dashboard', 'page.knowledge', 'page.stocktake']);
    expect(pages('SALES')).toEqual(['page.dashboard', 'page.knowledge']);
  });
});

describe('effectivePermissions', () => {
  const presets = [
    { role: 'SALES' as const, key: 'analytics.pricing' as const },
    { role: 'SALES' as const, key: 'analytics.orders' as const },
    { role: 'MANAGER' as const, key: 'analytics.sales' as const },
  ];

  it('gives a person the permissions of their role preset only', () => {
    expect(effectivePermissions({ role: 'SALES', admin: false }, presets, [], NOW)).toEqual([
      'analytics.orders',
      'analytics.pricing',
    ]);
  });

  it('adds a grant override and removes a removal override', () => {
    const overrides = [
      { key: 'analytics.chatbot' as const, granted: true, expiresAt: null },
      { key: 'analytics.orders' as const, granted: false, expiresAt: null },
    ];
    expect(effectivePermissions({ role: 'SALES', admin: false }, presets, overrides, NOW)).toEqual([
      'analytics.chatbot',
      'analytics.pricing',
    ]);
  });

  it('ignores an override whose end date has passed', () => {
    const overrides = [
      { key: 'analytics.chatbot' as const, granted: true, expiresAt: new Date('2026-11-20T00:00:00Z') },
      { key: 'analytics.orders' as const, granted: false, expiresAt: new Date('2026-11-21T11:59:59Z') },
    ];
    expect(effectivePermissions({ role: 'SALES', admin: false }, presets, overrides, NOW)).toEqual([
      'analytics.orders',
      'analytics.pricing',
    ]);
  });

  it('keeps an override that ends later', () => {
    const overrides = [{ key: 'analytics.ops' as const, granted: true, expiresAt: new Date('2026-12-12T00:00:00Z') }];
    expect(effectivePermissions({ role: 'SALES', admin: false }, presets, overrides, NOW)).toContain('analytics.ops');
  });

  it('gives the admin flag every permission, whatever the role and overrides say', () => {
    const overrides = [{ key: 'analytics.pricing' as const, granted: false, expiresAt: null }];
    expect(effectivePermissions({ role: 'SALES', admin: true }, presets, overrides, NOW)).toEqual(
      [...PERMISSION_KEYS].sort(),
    );
  });

  it('drops keys that are no longer in the permission list', () => {
    const stale = [...presets, { role: 'SALES' as const, key: 'analytics.removed' as never }];
    expect(effectivePermissions({ role: 'SALES', admin: false }, stale, [], NOW)).toEqual([
      'analytics.orders',
      'analytics.pricing',
    ]);
  });
});
