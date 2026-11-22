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
  // Whole pages. A role without the key neither sees the page in the menu nor gets its API calls answered.
  'page.dashboard',
  'page.inventory',
  'page.analytics',
  'page.knowledge',
  'page.stocktake',
  'page.customer-orders',
  'page.orders',
  'page.import',
  'page.customers',
  'page.invoices',
  'page.tradesheets',
  'page.rules',
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
  'page.dashboard': { group: 'Pages', label: 'Pricing workbook' },
  'page.inventory': { group: 'Pages', label: 'Inventory' },
  'page.analytics': { group: 'Pages', label: 'Analytics' },
  'page.knowledge': { group: 'Pages', label: 'SOP library' },
  'page.stocktake': { group: 'Pages', label: 'Stocktake' },
  'page.customer-orders': { group: 'Pages', label: 'Customer orders' },
  'page.orders': { group: 'Pages', label: 'Orders' },
  'page.import': { group: 'Pages', label: 'Import' },
  'page.customers': { group: 'Pages', label: 'Customers' },
  'page.invoices': { group: 'Pages', label: 'Invoices' },
  'page.tradesheets': { group: 'Pages', label: 'Trade sheets' },
  'page.rules': { group: 'Pages', label: 'Rules' },
};

/**
 * Pages that can never be handed to anyone but an admin, so they are not in the matrix: the admin console can read
 * and edit the database, and the roadmap is the private plan. Both stay behind the admin flag on the server.
 */
export const ADMIN_ONLY_PAGES = ['Admin console', 'Project (roadmap)'] as const;

const ALL_ANALYTICS = PERMISSION_KEYS.filter((k) => k.startsWith('analytics.'));

/** Pages every signed-in role has always had. */
const EVERYONE_PAGES: PermissionKey[] = ['page.dashboard', 'page.knowledge'];

/** The starting presets, seeded once by the migration. Admins change them later in Roles & permissions. */
export const DEFAULT_ROLE_PERMISSIONS: Record<PermissionRole, readonly PermissionKey[]> = {
  ADMIN: PERMISSION_KEYS,
  // Everything built but not yet released (inventory, analytics, orders, import, customers, invoices, trade sheets,
  // rules) starts admin-only: an admin turns it on for a role in Roles & permissions.
  MANAGER: ['analytics.pricing', 'analytics.sales', 'analytics.orders', 'analytics.inventory', 'analytics.customers', ...EVERYONE_PAGES, 'page.stocktake', 'page.customer-orders'],
  SALES: ['analytics.pricing', 'analytics.orders', 'analytics.inventory', ...EVERYONE_PAGES],
  ACCOUNTING: ['analytics.sales', 'analytics.customers', ...EVERYONE_PAGES],
  AUDITOR: [...ALL_ANALYTICS, 'admin.audit', ...EVERYONE_PAGES],
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
