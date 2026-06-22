import {ApiProperty} from "@nestjs/swagger";

export default class AuthResponse {
    @ApiProperty()
    accessToken!: string;

    @ApiProperty()
    refreshToken!: string;

    @ApiProperty()
    user!: {
        id: number;
        email: string;
        username: string;
        updatedAt: string;
        createdAt: string;
    };
}