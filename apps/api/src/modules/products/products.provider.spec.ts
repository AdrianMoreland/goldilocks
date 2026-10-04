import { ProductsProvider } from './products.provider';

const row = (over: Record<string, unknown> = {}) => ({
    id: 1,
    sku: 'GB-1OZ',
    name: '1oz Gold Bar',
    metalType: 'GOLD',
    weight: 31.1,
    spreadBuy: 1.5,
    spreadSell: 2,
    vatRate: 0,
    stock: 3,
    isActive: true,
    category: null,
    description: null,
    deletedAt: null,
    createdAt: new Date('2026-10-01T00:00:00Z'),
    updatedAt: new Date('2026-10-01T00:00:00Z'),
    ...over,
});

function build() {
    const tx = {
        product: {
            create: jest.fn(),
            findUniqueOrThrow: jest.fn().mockResolvedValue(row()),
            update: jest.fn(),
        },
    };
    const order: string[] = [];
    const prisma = {
        product: { findMany: jest.fn().mockResolvedValue([]) },
        $transaction: jest.fn(async (run: (t: unknown) => unknown) => {
            const result = await run(tx);
            order.push('commit');
            return result;
        }),
    };
    const cache = {
        set: jest.fn(() => {
            order.push('cache');
            return Promise.resolve();
        }),
    };
    const audit = {
        record: jest.fn(() => {
            order.push('audit');
            return Promise.resolve();
        }),
    };
    const provider = new ProductsProvider(
        prisma as never,
        cache as never,
        audit as never,
    );
    return { provider, tx, audit, order };
}

describe('ProductsProvider writes', () => {
    it('audits a premium change with old → new inside the transaction, then refreshes the cache', async () => {
        const { provider, tx, audit, order } = build();
        tx.product.update.mockResolvedValue(row({ spreadSell: 2.5 }));

        await provider.update(1, { spreadSell: 2.5 }, 'boss@example.com');

        expect(audit.record).toHaveBeenCalledWith(
            'boss@example.com',
            'product',
            'edited GB-1OZ: spreadSell 2 → 2.5',
            tx,
        );
        expect(order).toEqual(['audit', 'commit', 'cache']);
    });

    it('does not rebuild the cache when the audit insert fails', async () => {
        const { provider, tx, audit, order } = build();
        tx.product.update.mockResolvedValue(row({ stock: 9 }));
        audit.record.mockRejectedValueOnce(new Error('audit down'));

        await expect(provider.updateStock(1, 9, 'a@b.c')).rejects.toThrow(
            'audit down',
        );
        expect(order).not.toContain('cache');
    });

    it('records soft delete and restore under their own verbs', async () => {
        const { provider, tx, audit } = build();
        tx.product.update.mockResolvedValue(row({ deletedAt: new Date() }));
        await provider.softDelete(1, 'a@b.c');
        tx.product.update.mockResolvedValue(row());
        await provider.restore(1, 'a@b.c');

        const details = audit.record.mock.calls.map((c: unknown[]) => c[2]);
        expect(details).toEqual(['deleted GB-1OZ', 'restored GB-1OZ']);
    });

    it('audits a created product', async () => {
        const { provider, tx, audit } = build();
        tx.product.create.mockResolvedValue(row());

        await provider.create(
            {
                sku: 'GB-1OZ',
                name: '1oz Gold Bar',
                metalType: 'GOLD',
                weight: 31.1,
                spreadSell: 2,
                spreadBuy: 1.5,
                vatRate: 0,
                stock: 3,
            },
            'boss@example.com',
        );

        expect(audit.record).toHaveBeenCalledWith(
            'boss@example.com',
            'product',
            'created GB-1OZ (1oz Gold Bar)',
            tx,
        );
    });
});
