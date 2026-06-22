// File: `backend/src/lib/auth/login.dto.ts`
import {IsEmail, IsNotEmpty, IsString, MinLength} from 'class-validator';
import {ApiProperty} from "@nestjs/swagger";

/**
 * Login DTO
 * @property {string} username - The user's username (required)
 * @property {string} password - The plain password of the user (required)
 */
export default class LoginDTO {
    @ApiProperty({example: "user@example.com"})
    @IsEmail()
    email!: string;
    @ApiProperty({example: "password123"})
    @IsString()
    @MinLength(8)
    password!: string;
}