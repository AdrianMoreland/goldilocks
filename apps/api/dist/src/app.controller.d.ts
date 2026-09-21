import { AppService } from './app.service';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    getStatus(): {
        name: string;
        status: string;
        port: number;
    };
}
//# sourceMappingURL=app.controller.d.ts.map