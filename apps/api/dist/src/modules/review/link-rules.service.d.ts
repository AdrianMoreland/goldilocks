import type { SettleResult } from '@goldilocks/shared-types';
import type { Prisma } from '../../../prisma/generated/client';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { type Verdict } from './link-rules';
type Db = Prisma.TransactionClient | PrismaService;
interface PendingLink {
    id: number;
    linkType: string;
    fromKey: string;
    toKey: string;
}
export declare const RULED_LINK_TYPES: readonly ["trade_lot", "invoice_line_trade"];
export declare class LinkRulesService {
    judge(db: Db, links: PendingLink[]): Promise<Map<number, Verdict>>;
    settle(db: Db): Promise<SettleResult>;
}
export {};
//# sourceMappingURL=link-rules.service.d.ts.map