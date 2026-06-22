import { z } from 'zod';

// ============================================================================
// ENUMS & BASIC TYPES
// ============================================================================

export const UserRole = z.enum(['ADMIN', 'USER', 'MANAGER']);
export const UserStatus = z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED']);
export const Platform = z.enum(['web', 'mobile', 'admin']);

// ============================================================================
// CORE SCHEMAS
// ============================================================================

export const UserSchema = z.object({
    id: z.string(),
    email: z.email('Invalid email format'),
    username: z.string()
        .min(3, 'Username must be at least 3 characters')
        .max(20, 'Username must be less than 20 characters')
        .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
    role: UserRole,
    status: UserStatus,
    createdAt: z.date(),
    updatedAt: z.date(),
});

// ============================================================================
// INPUT SCHEMAS
// ============================================================================

export const LoginSchema = z.object({
    email: z.email('Please enter a valid email'),
    password: z.string().min(1, 'Password is required'),
    platform: Platform,
    rememberMe: z.boolean().optional().default(false),
});

export const RegisterSchema = z.object({
    email: z.email('Please enter a valid email'),
    username: z.string()
        .min(3, 'Username must be at least 3 characters')
        .max(20, 'Username must be less than 20 characters')
        .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
    password: z.string()
        .min(8, 'Password must be at least 8 characters')
        .max(100, 'Password must be less than 100 characters')
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one lowercase letter, one uppercase letter, and one number'),
    confirmPassword: z.string(),
    platform: Platform,
}).refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
});

export const ChangePasswordSchema = z.object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string()
        .min(8, 'New password must be at least 8 characters')
        .max(100, 'New password must be less than 100 characters'),
    confirmNewPassword: z.string(),
}).refine(data => data.newPassword === data.confirmNewPassword, {
    message: 'New passwords do not match',
    path: ['confirmNewPassword'],
});

// ============================================================================
// RESPONSE SCHEMAS
// ============================================================================

export const AuthResponseSchema = z.object({
    accessToken: z.string(),
    refreshToken: z.string(),
    user: UserSchema.omit({ createdAt: true, updatedAt: true }),
    expiresIn: z.number(),
});

export const UserProfileSchema = z.object({
    id: z.uuid(),
    email: z.email(),
    username: z.string(),
    role: UserRole,
    status: UserStatus,
    createdAt: z.iso.datetime(),
});

export const MessageResponseSchema = z.object({
    message: z.string(),
});

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type LoginInput = z.infer<typeof LoginSchema>;
export type RegisterInput = z.infer<typeof RegisterSchema>;
export type ChangePasswordInput = z.infer<typeof ChangePasswordSchema>;
export type AuthResponse = z.infer<typeof AuthResponseSchema>;
export type UserProfile = z.infer<typeof UserProfileSchema>;
export type MessageResponse = z.infer<typeof MessageResponseSchema>;
export type User = z.infer<typeof UserSchema>;
export type UserRoleType = z.infer<typeof UserRole>;
export type UserStatusType = z.infer<typeof UserStatus>;
export type PlatformType = z.infer<typeof Platform>;