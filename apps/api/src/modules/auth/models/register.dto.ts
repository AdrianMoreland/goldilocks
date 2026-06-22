// src/auth/dto/register.dto.ts
import {IsString} from "class-validator";
import LoginDTO from "./Login.dto";

export class RegisterDTO extends LoginDTO {
    @IsString()
    username!: string;
}
