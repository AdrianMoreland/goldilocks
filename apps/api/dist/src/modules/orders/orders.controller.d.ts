import { type Handover, type LatestHandover, type OrderDetail, type OrderListResponse, type ReconcileResult, type SheetTask } from '@goldilocks/shared-types';
import { OrdersService } from './orders.service';
import { SheetTasksService } from './sheet-tasks.service';
import type { RequestWithUser } from '../../common/guards/jwt-auth.guard';
import { RecordStepRequestDto, SaveHandoverRequestDto } from '../../common/dto/dtos';
export declare class OrdersController {
    private readonly service;
    constructor(service: OrdersService);
    list(query: Record<string, string>): Promise<OrderListResponse>;
    get(id: number): Promise<OrderDetail>;
    step(id: number, step: string, body: RecordStepRequestDto, req: RequestWithUser): Promise<OrderDetail>;
}
export declare class SheetTasksController {
    private readonly service;
    constructor(service: SheetTasksService);
    list(query: Record<string, string>): Promise<SheetTask[]>;
    reconcile(req: RequestWithUser): Promise<ReconcileResult>;
    done(id: number, req: RequestWithUser): Promise<SheetTask>;
}
export declare class HandoverController {
    private readonly service;
    constructor(service: SheetTasksService);
    latest(): Promise<LatestHandover>;
    save(body: SaveHandoverRequestDto, req: RequestWithUser): Promise<Handover>;
}
//# sourceMappingURL=orders.controller.d.ts.map