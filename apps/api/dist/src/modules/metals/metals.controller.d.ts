import { MetalsProvider } from './metals.provider';
import { MetalsCron } from './metals.cron';
import { RawSpotPriceResponseDto } from '../../common/dto/dtos';
export declare class MetalsController {
    private readonly metalsProvider;
    private readonly metalsCron;
    constructor(metalsProvider: MetalsProvider, metalsCron: MetalsCron);
    refresh(): Promise<RawSpotPriceResponseDto[]>;
    getCronStatus(): {
        running: boolean;
    };
    toggleCron(): {
        running: boolean;
    };
    clearCache(): Promise<{
        message: string;
    }>;
}
//# sourceMappingURL=metals.controller.d.ts.map