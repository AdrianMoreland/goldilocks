import { z } from 'zod';
import { SessionUserRoleEnum } from './session.schema';

/**
 * Named things a person may see or do, checked on the server for every request. A person's set is their role
 * preset, adjusted by their own overrides (grant or remove, optionally until a date). The admin flag holds every
 * permission. Add a page by adding its key here and to the presets it belongs to; the database stores keys as text,
 * so a removed key is simply ignored.
 */
export const PERMISSION_KEYS = [
  'analytics.pricing',
  'analytics.sales',
  'analytics.orders',
  'analytics.inventory',
  'analytics.customers',
  'analytics.chatbot',
  'analytics.ops',
  'admin.audit',
] as const;

export const PermissionKeySchema = z.enum(PERMISSION_KEYS);
export type PermissionKey = z.infer<typeof PermissionKeySchema>;
export type PermissionRole = z.infer<typeof SessionUserRoleEnum>;

/** What each key means, for the roles matrix and the user sheet. */
export const PERMISSION_LABELS: Record<PermissionKey, { group: string; label: string }> = {
  'analytics.pricing': { group: 'Analytics', label: 'Pricing' },
  'analytics.sales': { group: 'Analytics', label: 'Sales & margin' },
  'analytics.orders': { group: 'Analytics', label: 'Orders' },
  'analytics.inventory': { group: 'Analytics', label: 'Inventory' },
  'analytics.customers': { group: 'Analytics', label: 'Customers & invoices' },
  'analytics.chatbot': { group: 'Analytics', label: 'Chatbot' },
  'analytics.ops': { group: 'Analytics', label: 'Ops' },
  'admin.audit': { group: 'Admin', label: 'Audit log (read)' },
};

const ALL_ANALYTICS = PERMISSION_KEYS.filter((k) => k.startsWith('analytics.'));

/** The starting presets, seeded once by the migration. Admins change them later in Roles & permissions. */
export const DEFAULT_ROLE_PERMISSIONS: Record<PermissionRole, readonly PermissionKey[]> = {
  ADMIN: PERMISSION_KEYS,
  MANAGER: ['analytics.pricing', 'analytics.sales', 'analytics.orders', 'analytics.inventory', 'analytics.customers'],
  SALES: ['analytics.pricing', 'analytics.orders', 'analytics.inventory'],
  ACCOUNTING: ['analytics.sales', 'analytics.customers'],
  AUDITOR: [...ALL_ANALYTICS, 'admin.audit'],
};

export interface RolePermissionRow {
  role: PermissionRole;
  key: string;
}

export interface PermissionOverrideRow {
  key: string;
  granted: boolean;
  /** Null means the override has no end date. */
  expiresAt: Date | null;
}

export interface PermissionSubject {
  role: PermissionRole;
  admin: boolean;
}

const KNOWN = new Set<string>(PERMISSION_KEYS);

/** A person's permissions, sorted. Expired overrides and keys no longer in the list are ignored. */
export function effectivePermissions(
  subject: PermissionSubject,
  presets: readonly RolePermissionRow[],
  overrides: readonly PermissionOverrideRow[],
  now: Date,
): PermissionKey[] {
  if (subject.admin) return [...PERMISSION_KEYS].sort();
  const held = new Set<string>(presets.filter((p) => p.role === subject.role).map((p) => p.key));
  for (const o of overrides) {
    if (o.expiresAt && o.expiresAt.getTime() <= now.getTime()) continue;
    if (o.granted) held.add(o.key);
    else held.delete(o.key);
  }
  return [...held].filter((k): k is PermissionKey => KNOWN.has(k)).sort();
}

export const PermissionListSchema = z.array(PermissionKeySchema);
