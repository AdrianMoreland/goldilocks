import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

/**
 * The magic function that converts Zod schemas to NestJS DTOs
 * with automatic Swagger documentation
 */
export function createDto<T extends z.ZodTypeAny>(
    schema: T,
    className: string
) {
    const DtoClass = createZodDto(schema);

    // Set the class name for better debugging and documentation
    Object.defineProperty(DtoClass, 'name', { value: className });

    return DtoClass;
}