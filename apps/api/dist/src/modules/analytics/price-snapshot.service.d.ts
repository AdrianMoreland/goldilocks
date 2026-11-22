import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { MarketDataService } from '../market-data/market-data.service';
export declare class PriceSnapshotService {
    private readonly prisma;
    private readonly marketData;
    private readonly logger;
    constructor(prisma: PrismaService, marketData: MarketDataService);
    run(): Promise<void>;
    capture(now: Date): Promise<number>;
}
//# sourceMappingURL=price-snapshot.service.d.ts.map