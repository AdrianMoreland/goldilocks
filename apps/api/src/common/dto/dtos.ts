import {createZodDto} from 'nestjs-zod';
import {
    AuthResponseSchema,
    ChangePasswordSchema,
    LoginSchema,
    MessageResponseSchema,
    RegisterSchema,
    UserProfileSchema,
} from '@goldilocks/shared-types';
import {
    ApiSuccessResponseSchema, MarketDataResponseSchema,
    CreateProductDtoSchema,
    CreateSpotPriceDtoSchema,
    HealthCheckSchema,
    ProductSchema,
    SpotPriceSchema,
    UpdateProductFullDtoSchema
} from "@goldilocks/shared-types";
import {createDto} from "./dto-generator";

// ============================================================================
// AUTHENTICATION DTOs
// ============================================================================

/** Login request DTO - validates email, password, and platform */
export class LoginDto extends createZodDto(LoginSchema) {}

/** Registration request DTO - validates user registration data */
export class RegisterDto extends createZodDto(RegisterSchema) {}

/** Change password request DTO - validates password change */
export class ChangePasswordDto extends createZodDto(ChangePasswordSchema) {}

/** Authentication response DTO - contains tokens and user info */
export class AuthResponseDto extends createZodDto(
    ApiSuccessResponseSchema(AuthResponseSchema)
) {}

/** User profile response DTO - contains user profile information */
export class UserProfileDto extends createZodDto(
    ApiSuccessResponseSchema(UserProfileSchema)
) {}

/** Message response DTO - contains success/info messages */
export class MessageResponseDto extends createZodDto(
    ApiSuccessResponseSchema(MessageResponseSchema)
) {}

// ============================================================================
// HEALTH DTOs
// ============================================================================

/** Health check response DTO */
export class HealthCheckDto extends createZodDto(HealthCheckSchema) {}

// ============================================================================
// SPOT PRICE DTOs
// ============================================================================

export class SpotPriceResponseDto extends createDto(SpotPriceSchema, 'SpotPriceResponseDto') {}

export class CreateSpotPriceDto extends createDto(CreateSpotPriceDtoSchema, 'CreateSpotPriceDto') {}

// ============================================================================
// PRODUCT DTOs
// ============================================================================

export class CreateProductDto extends createDto(CreateProductDtoSchema, 'CreateProductDto') {}

export class ProductResponseDto extends createDto(ProductSchema, 'ProductResponseDto') {}

export class UpdateProductDto extends createDto(UpdateProductFullDtoSchema, 'UpdateProductDto') {}

export class MarketDataResponseDto extends createDto(MarketDataResponseSchema, 'MarketDataResponseDto') {}