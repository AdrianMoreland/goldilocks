import { z } from 'zod';
import { SessionBranchSchema } from './branch.schema';

// ============================================================================
// SESSION / LOGIN - deliberately separate from auth.schemas.ts, whose
// UserSchema/UserRole/Platform don't match this app's actual Prisma User
// model (username+status vs firstName/lastName+isActive, different role
// enum). These mirror the real shape instead of forcing a fit.
// ============================================================================

export const SessionUserRoleEnum = z.enum(['ADMIN', 'MANAGER', 'SALES', 'ACCOUNTING', 'AUDITOR']);

/**
 * The look a person chose, saved on their account so it follows them to any browser: light or dark, and the theme
 * editor's settings (theme, colours, font, text size, density) as the web app stores them. The web app checks the look
 * field by field when it reads it back, so the server only bounds its size.
 */
export const UI_SETTINGS_MAX_BYTES = 16_000;
export const ColorModeEnum = z.enum(['dark', 'light']);
export type ColorMode = z.infer<typeof ColorModeEnum>;
export const UiSettingsSchema = z
  .object({
    mode: ColorModeEnum,
    look: z.record(z.string(), z.unknown()).nullable(),
  })
  .refine((v) => JSON.stringify(v).length <= UI_SETTINGS_MAX_BYTES, {
    message: 'Those display settings are too large to save.',
  });
export type UiSettings = z.infer<typeof UiSettingsSchema>;

export const SessionUserSchema = z.object({
  id: z.string(),
  email: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  role: SessionUserRoleEnum,
  admin: z.boolean(),
  // Defaults to null so a web build deployed before the API still parses the old response shape.
  branch: SessionBranchSchema.nullable().default(null),
  /** Null until the person first changes their look; the app then uses its defaults (dark). */
  uiSettings: UiSettingsSchema.nullable().default(null),
});
export type SessionUser = z.infer<typeof SessionUserSchema>;

export const LoginRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});
export type LoginRequest = z.infer<typeof LoginRequestSchema>;

// `refreshToken` is null when the identity provider doesn't issue one. It defaults to null (not
// required) so a web build that is deployed before the API still parses the old response shape.
export const LoginResponseSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string().nullable().default(null),
  user: SessionUserSchema,
});
export type LoginResponse = z.infer<typeof LoginResponseSchema>;

export const RefreshRequestSchema = z.object({
  refreshToken: z.string().min(1),
});
export type RefreshRequest = z.infer<typeof RefreshRequestSchema>;

// ============================================================================
// ADMIN - creating a new staff account. This is a closed internal tool (no
// public self-registration - see docs/ENGINEERING.md §6), so the only way a new
// account gets created is an admin doing it from the Admin panel.
// ============================================================================

export const CreateUserRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(10, 'Password must be at least 10 characters'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  role: SessionUserRoleEnum,
  admin: z.boolean().default(false),
  branchId: z.number().int().positive().nullable().default(null),
});
export type CreateUserRequest = z.infer<typeof CreateUserRequestSchema>;

/** Admin: move a staff member to another branch (or clear it). */
export const SetUserBranchRequestSchema = z.object({
  branchId: z.number().int().positive().nullable(),
});
export type SetUserBranchRequest = z.infer<typeof SetUserBranchRequestSchema>;
