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

/**
 * Batch create DTOs from multiple schemas
 */
export function createDtos<T extends Record<string, z.ZodTypeAny>>(
    schemas: T
): { [K in keyof T]: ReturnType<typeof createDto<T[K]>> } {
    const dtos = {} as any;

    for (const [key, schema] of Object.entries(schemas)) {
        const className = key.replace(/Schema$/, 'Dto');
        dtos[key] = createDto(schema, className);
    }

    return dtos;
}