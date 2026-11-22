import type { InventoryBarsResponse, InventoryCoinsResponse, InventoryPosition } from '@goldilocks/shared-types';
import { InventoryService } from './inventory.service';
export declare class InventoryController {
    private readonly inventory;
    constructor(inventory: InventoryService);
    position(stocktakeId?: string): Promise<InventoryPosition>;
    bars(query: Record<string, string>): Promise<InventoryBarsResponse>;
    coins(query: Record<string, string>): Promise<InventoryCoinsResponse>;
}
//# sourceMappingURL=inventory.controller.d.ts.map