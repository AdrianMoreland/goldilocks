import { ConfigService } from '@nestjs/config';
export declare class AppService {
    private configService;
    constructor(configService: ConfigService);
    getStatus(): {
        name: string;
        status: string;
        port: number;
    };
}
//# sourceMappingURL=app.service.d.ts.map