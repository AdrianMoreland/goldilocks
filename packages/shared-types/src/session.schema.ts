import { z } from 'zod';

// ============================================================================
// SESSION / LOGIN — deliberately separate from auth.schemas.ts, whose
// UserSchema/UserRole/Platform don't match this app's actual Prisma User
// model (username+status vs firstName/lastName+isActive, different role
// enum). These mirror the real shape instead of forcing a fit.
// ============================================================================

export const SessionUserRoleEnum = z.enum(['ADMIN', 'MANAGER', 'SALES', 'ACCOUNTING', 'AUDITOR']);

export const SessionUserSchema = z.object({
  id: z.string(),
  email: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  role: SessionUserRoleEnum,
  admin: z.boolean(),
});
export type SessionUser = z.infer<typeof SessionUserSchema>;

export const LoginRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});
export type LoginRequest = z.infer<typeof LoginRequestSchema>;

export const LoginResponseSchema = z.object({
  accessToken: z.string(),
  user: SessionUserSchema,
});
export type LoginResponse = z.infer<typeof LoginResponseSchema>;
