import { LiveStockService } from './live-stock.service';
import type { PrismaService } from '../../infrastructure/prisma/prisma.service';
import type { AuditLogService } from '../audit-log/audit-log.service';

describe('LiveStockService.productLevels', () => {
    function setup() {
        const productFindMany = jest.fn().mockResolvedValue([
            { id: 1, name: '1oz Gold Bar', metalType: 'GOLD' },
            { id: 2, name: '1oz Platinum Bar', metalType: 'PLATINUM' },
        ]);
        const lineFindMany = jest.fn().mockResolvedValue([
            {
                metal: 'GOLD',
                kind: 'BAR',
                family: 'Bar',
                variant: '1oz',
                refinery: 'VALCAMBI SUISSE',
                qty: 4,
                lowThreshold: null,
                branchCode: 'DU',
                branch: { name: 'Dublin' },
            },
        ]);
        const prisma = {
            product: { findMany: productFindMany },
            liveStockLine: { findMany: lineFindMany },
        } as unknown as PrismaService;
        const service = new LiveStockService(
            prisma,
            {} as unknown as AuditLogService,
        );
        return { service, productFindMany, lineFindMany };
    }

    it('reads only live, undeleted products and gold and silver lines', async () => {
        const { service, productFindMany, lineFindMany } = setup();
        await service.productLevels();
        expect(productFindMany).toHaveBeenCalledWith(
            expect.objectContaining({
                where: { isActive: true, deletedAt: null },
            }),
        );
        expect(lineFindMany).toHaveBeenCalledWith(
            expect.objectContaining({
                where: { metal: { in: ['GOLD', 'SILVER'] } },
            }),
        );
    });

    it('returns a level per matched product with branch names, and none for platinum', async () => {
        const { service } = setup();
        await expect(service.productLevels()).resolves.toEqual([
            {
                productId: 1,
                total: 4,
                state: 'IN',
                branches: [{ code: 'DU', name: 'Dublin', qty: 4 }],
            },
        ]);
    });
});
