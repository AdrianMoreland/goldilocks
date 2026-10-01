import { AppService } from './app.service';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    getStatus(): {
        name: string;
        status: string;
    };
    getHealth(): Promise<{
        status: string;
        db: string;
        redis: string;
        lastSuccessfulMetalsApiCall: string | null;
    }>;
}
//# sourceMappingURL=app.controller.d.ts.map