import type { HistoricSpot } from '@goldilocks/shared-types';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { type MetalPriceApiPort } from '../../infrastructure/metal-price-api/metal-price-api.port';
export interface BackfillWindowReport {
    from: string;
    to: string;
    status: 'stored' | 'skipped' | 'refused';
    inserted: number;
}
export declare class HistoricSpotService {
    private readonly prisma;
    private readonly metalPriceApi;
    private readonly logger;
    constructor(prisma: PrismaService, metalPriceApi: MetalPriceApiPort);
    getHistoricSpots(): Promise<HistoricSpot[]>;
    getLatestHistoricDate(): Promise<Date | null>;
    fetchAndStoreHistoricClose(date: string): Promise<void>;
    seedHistoricPrices(): Promise<void>;
    backfillYears(years: number): Promise<BackfillWindowReport[]>;
    private fetchTimeframe;
    private readFromDb;
}
//# sourceMappingURL=historic-spot.service.d.ts.map