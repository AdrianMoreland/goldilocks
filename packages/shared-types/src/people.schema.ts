import { z } from 'zod';
import { SessionBranchSchema } from './branch.schema';
import { PERMISSION_KEYS, PermissionKeySchema, type PermissionKey, type PermissionRole } from './permissions';
import { SessionUserRoleEnum } from './session.schema';

/**
 * Admin → People and Roles & permissions. Every change carries a reason, which goes to the audit log with
 * the before and after of each field or matrix cell.
 */
const Reason = z.string().trim().min(3, 'Say why, in a few words').max(300);
const ROLES = SessionUserRoleEnum.options;

export const PermissionOverrideSchema = z.object({
  key: PermissionKeySchema,
  granted: z.boolean(),
  /** ISO date-time; null means no end date. */
  expiresAt: z.string().datetime().nullable(),
});
export type PermissionOverride = z.infer<typeof PermissionOverrideSchema>;

export const AdminUserSchema = z.object({
  id: z.string(),
  email: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  role: SessionUserRoleEnum,
  admin: z.boolean(),
  isActive: z.boolean(),
  branch: SessionBranchSchema.nullable(),
  lastLoginAt: z.string().nullable(),
  overrides: z.array(
    PermissionOverrideSchema.extend({ reason: z.string(), createdBy: z.string(), createdAt: z.string() }),
  ),
  /** What the person can use right now: role preset plus live overrides (admins hold everything). */
  permissions: z.array(PermissionKeySchema),
});
export type AdminUser = z.infer<typeof AdminUserSchema>;
export const AdminUserListSchema = z.array(AdminUserSchema);

export const UpdateUserRequestSchema = z
  .object({
    role: SessionUserRoleEnum.optional(),
    admin: z.boolean().optional(),
    isActive: z.boolean().optional(),
    branchId: z.number().int().positive().nullable().optional(),
    reason: Reason,
  })
  .refine((v) => v.role !== undefined || v.admin !== undefined || v.isActive !== undefined || v.branchId !== undefined, {
    message: 'Nothing to change',
  });
export type UpdateUserRequest = z.infer<typeof UpdateUserRequestSchema>;

export const SetOverridesRequestSchema = z.object({
  /** The person's full set of overrides after the change (replaces what they had). */
  overrides: z.array(PermissionOverrideSchema).refine((o) => new Set(o.map((x) => x.key)).size === o.length, {
    message: 'One override per permission',
  }),
  reason: Reason,
});
export type SetOverridesRequest = z.infer<typeof SetOverridesRequestSchema>;

export const PermissionMatrixSchema = z.object(
  Object.fromEntries(ROLES.map((r) => [r, z.array(PermissionKeySchema)])) as Record<PermissionRole, z.ZodArray<typeof PermissionKeySchema>>,
);
export type PermissionMatrix = Record<PermissionRole, readonly PermissionKey[]>;

/** Only the cells the admin toggled, so two admins editing at once never undo each other's work. */
export const UpdatePermissionMatrixRequestSchema = z.object({
  changes: z
    .array(z.object({ role: SessionUserRoleEnum, key: PermissionKeySchema, granted: z.boolean() }))
    .min(1, 'Nothing to change'),
  reason: Reason,
});
export type UpdatePermissionMatrixRequest = z.infer<typeof UpdatePermissionMatrixRequestSchema>;

/** Admin: create an account and email the person a link to set their own password. */
export const InviteUserRequestSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  role: SessionUserRoleEnum,
  admin: z.boolean().default(false),
  branchId: z.number().int().positive().nullable().default(null),
});
export type InviteUserRequest = z.infer<typeof InviteUserRequestSchema>;

export function diffPermissionMatrix(
  before: PermissionMatrix,
  after: PermissionMatrix,
): { role: PermissionRole; key: PermissionKey; granted: boolean }[] {
  const out: { role: PermissionRole; key: PermissionKey; granted: boolean }[] = [];
  for (const role of ROLES) {
    const was = new Set(before[role]);
    const now = new Set(after[role]);
    for (const key of PERMISSION_KEYS) {
      if (was.has(key) !== now.has(key)) out.push({ role, key, granted: now.has(key) });
    }
  }
  return out;
}

type UserFields = { role: PermissionRole; admin: boolean; isActive: boolean; branchId: number | null };

export function diffUserChanges(
  before: UserFields,
  patch: Partial<UserFields>,
): { field: keyof UserFields; from: UserFields[keyof UserFields]; to: UserFields[keyof UserFields] }[] {
  return (['role', 'admin', 'isActive', 'branchId'] as const)
    .filter((f) => patch[f] !== undefined && patch[f] !== before[f])
    .map((field) => ({ field, from: before[field], to: patch[field] as UserFields[typeof field] }));
}

const describeOverride = (o: PermissionOverride) =>
  `${o.granted ? 'grant' : 'remove'}${o.expiresAt ? ` until ${o.expiresAt.slice(0, 10)}` : ''}`;
// Compared on the full timestamp; the date-only text is just for the audit message.
const overrideIdentity = (o: PermissionOverride) =>
  `${o.granted}|${o.expiresAt ? new Date(o.expiresAt).toISOString() : ''}`;

/** Each permission whose override was added, changed or removed, sorted by key, for the audit log. */
export function diffOverrides(
  before: PermissionOverride[],
  after: PermissionOverride[],
): { key: PermissionKey; from: string | null; to: string | null }[] {
  const a = new Map(before.map((o) => [o.key, o]));
  const b = new Map(after.map((o) => [o.key, o]));
  const id = (o?: PermissionOverride) => (o ? overrideIdentity(o) : null);
  const text = (o?: PermissionOverride) => (o ? describeOverride(o) : null);
  return [...new Set([...a.keys(), ...b.keys()])]
    .sort()
    .filter((k) => id(a.get(k)) !== id(b.get(k)))
    .map((key) => ({ key, from: text(a.get(key)), to: text(b.get(key)) }));
}
