import type { BranchRegion } from './branch.schema';
import type { PermissionRole } from './permissions';

/**
 * "View as": lets an admin see the app the way another kind of person does, without signing in again. The browser
 * sends the choice in this header; the API honours it only for a real admin, and then treats that request as a
 * non-admin of that role and region (so every guard, permission and branch rule applies for real). Writes an admin
 * could make are refused while viewing as someone else, which is what a check needs.
 */
export const VIEW_AS_HEADER = 'x-view-as';

export interface ViewAsOption {
  value: string;
  label: string;
  role: Exclude<PermissionRole, 'ADMIN'>;
  region: BranchRegion;
}

export const VIEW_AS_OPTIONS: readonly ViewAsOption[] = [
  { value: 'MANAGER', label: 'Manager', role: 'MANAGER', region: 'IE' },
  { value: 'SALES', label: 'Sales', role: 'SALES', region: 'IE' },
  { value: 'ACCOUNTING', label: 'Accounting', role: 'ACCOUNTING', region: 'IE' },
  { value: 'AUDITOR', label: 'Auditor', role: 'AUDITOR', region: 'IE' },
  { value: 'SALES:UK', label: 'UK branch staff', role: 'SALES', region: 'UK' },
];

/** The option a header value names, or null when it is empty or unknown (an unknown value never grants anything). */
export function parseViewAs(raw: string | string[] | undefined | null): ViewAsOption | null {
  const value = Array.isArray(raw) ? raw[0] : raw;
  if (!value) return null;
  return VIEW_AS_OPTIONS.find((o) => o.value === value) ?? null;
}
