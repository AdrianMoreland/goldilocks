import { type InventoryBarsResponse, type InventoryCoinsResponse, type InventoryPosition } from '@goldilocks/shared-types';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
export declare class InventoryService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private ref;
    private pick;
    private heldSerials;
    position(rawStocktakeId?: string): Promise<InventoryPosition>;
    bars(raw: Record<string, unknown>): Promise<InventoryBarsResponse>;
    coins(raw: Record<string, unknown>): Promise<InventoryCoinsResponse>;
}
//# sourceMappingURL=inventory.service.d.ts.map