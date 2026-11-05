import { NotFoundException } from '@nestjs/common';
import { CustomerRecordsService } from './customer-records.service';

const date = (s: string) => new Date(`${s}T00:00:00.000Z`);

function setup() {
    const prisma = {
        customer: {
            count: jest.fn(),
            findMany: jest.fn(),
            findUnique: jest.fn(),
        },
        trade: { groupBy: jest.fn(), findMany: jest.fn(), count: jest.fn() },
        zohoInvoice: {
            groupBy: jest.fn(),
            findMany: jest.fn(),
            findUnique: jest.fn(),
            count: jest.fn(),
            aggregate: jest.fn(),
        },
        zohoInvoiceLine: { groupBy: jest.fn() },
        zohoPayment: { findMany: jest.fn() },
        quote: { findMany: jest.fn() },
        entityLink: { findMany: jest.fn() },
    };
    return { prisma, service: new CustomerRecordsService(prisma as never) };
}

describe('CustomerRecordsService', () => {
    describe('customers', () => {
        it('lists customers with open orders, last order, lifetime and since', async () => {
            const { service, prisma } = setup();
            prisma.customer.count.mockResolvedValue(1);
            prisma.customer.findMany.mockResolvedValue([
                {
                    id: 4,
                    name: 'Fake Person',
                    status: 'Active',
                    currency: 'EUR',
                },
            ]);
            prisma.trade.groupBy
                .mockResolvedValueOnce([{ customerId: 4, _count: { _all: 2 } }])
                .mockResolvedValueOnce([
                    {
                        customerId: 4,
                        _max: { date: date('2026-10-05') },
                        _min: { date: date('2025-03-01') },
                    },
                ]);
            prisma.zohoInvoice.groupBy.mockResolvedValue([
                {
                    customerId: 4,
                    _sum: {
                        total: {
                            toNumber: () => 1200.5,
                            valueOf: () => 1200.5,
                        },
                    },
                    _min: { date: date('2024-01-10') },
                    _max: { date: date('2026-10-20') },
                },
            ]);

            const res = await service.customers({ q: 'fake' });
            expect(prisma.customer.findMany).toHaveBeenCalledWith(
                expect.objectContaining({
                    where: {
                        missingFromImport: false,
                        name: { contains: 'fake', mode: 'insensitive' },
                    },
                    take: 50,
                    skip: 0,
                }),
            );
            expect(res.rows[0]).toEqual({
                id: 4,
                name: 'Fake Person',
                status: 'Active',
                currency: 'EUR',
                openOrders: 2,
                lastOrder: '2026-10-20',
                lifetime: 1200.5,
                since: '2024-01-10',
            });
        });

        it('leaves out draft and void invoices from the lifetime figure', async () => {
            const { service, prisma } = setup();
            prisma.customer.count.mockResolvedValue(0);
            prisma.customer.findMany.mockResolvedValue([]);
            prisma.trade.groupBy.mockResolvedValue([]);
            prisma.zohoInvoice.groupBy.mockResolvedValue([]);
            await service.customers({});
            expect(prisma.zohoInvoice.groupBy).toHaveBeenCalledWith(
                expect.objectContaining({
                    where: expect.objectContaining({
                        status: { notIn: ['Draft', 'Void'] },
                    }),
                }),
            );
        });
    });

    describe('customer', () => {
        it('says so when the customer is missing or flagged missing', async () => {
            const { service, prisma } = setup();
            prisma.customer.findUnique.mockResolvedValue(null);
            await expect(service.customer(9)).rejects.toBeInstanceOf(
                NotFoundException,
            );
            prisma.customer.findUnique.mockResolvedValue({
                id: 9,
                missingFromImport: true,
            });
            await expect(service.customer(9)).rejects.toBeInstanceOf(
                NotFoundException,
            );
        });

        it('returns the profile with orders, invoices, payments and quotes', async () => {
            const { service, prisma } = setup();
            prisma.customer.findUnique.mockResolvedValue({
                id: 4,
                name: 'Fake Person',
                status: 'Active',
                currency: 'EUR',
                zohoNumber: 'Z1',
                missingFromImport: false,
            });
            prisma.trade.findMany.mockResolvedValue([
                {
                    id: 1,
                    reference: 'DU-G1',
                    date: date('2026-10-05'),
                    qty: 2,
                    productText: '1oz Bar',
                    state: 'HEDGED',
                    collected: false,
                    branchCode: 'DU',
                },
                {
                    id: 2,
                    reference: 'DU-G0',
                    date: date('2025-03-01'),
                    qty: 1,
                    productText: '1oz Bar',
                    state: 'INVOICED',
                    collected: true,
                    branchCode: 'DU',
                },
            ]);
            prisma.trade.count.mockResolvedValue(1);
            prisma.zohoInvoice.findMany.mockResolvedValue([
                {
                    id: 7,
                    sourceKey: 'INV-1',
                    date: date('2026-10-20'),
                    total: 500,
                    status: 'Closed',
                },
            ]);
            prisma.zohoInvoice.aggregate.mockResolvedValue({
                _sum: { total: 500 },
                _min: { date: date('2024-01-10') },
                _max: { date: date('2026-10-20') },
            });
            prisma.zohoPayment.findMany.mockResolvedValue([
                {
                    id: 3,
                    date: date('2026-10-21'),
                    amount: 500,
                    mode: 'Bank Transfer',
                    invoice: { sourceKey: 'INV-1' },
                },
            ]);
            prisma.quote.findMany.mockResolvedValue([]);
            prisma.zohoInvoiceLine.groupBy.mockResolvedValue([
                { invoiceId: 7, collectedFlag: 'YES', _count: { _all: 2 } },
                { invoiceId: 7, collectedFlag: 'NO', _count: { _all: 1 } },
            ]);

            const p = await service.customer(4);
            expect(p).toMatchObject({
                id: 4,
                name: 'Fake Person',
                openOrders: 1,
                lifetime: 500,
                since: '2024-01-10',
                lastOrder: '2026-10-20',
            });
            expect(p.orders).toHaveLength(2);
            expect(p.invoices[0]).toEqual({
                id: 7,
                number: 'INV-1',
                date: '2026-10-20',
                total: 500,
                status: 'Closed',
                collected: 'PARTIAL',
            });
            expect(p.payments[0]).toMatchObject({
                amount: 500,
                invoiceNumber: 'INV-1',
            });
        });
    });

    describe('invoices', () => {
        it('searches by number, customer name or serial and says whether it was collected', async () => {
            const { service, prisma } = setup();
            prisma.zohoInvoice.count.mockResolvedValue(1);
            prisma.zohoInvoice.findMany.mockResolvedValue([
                {
                    id: 7,
                    sourceKey: 'INV-1',
                    date: date('2026-10-20'),
                    customerId: 4,
                    customer: { name: 'Fake Person' },
                    total: 500,
                    status: 'Closed',
                    lineCount: 1,
                },
            ]);
            prisma.zohoInvoiceLine.groupBy.mockResolvedValue([
                { invoiceId: 7, collectedFlag: 'YES', _count: { _all: 1 } },
            ]);

            const res = await service.invoices({
                q: 'AB-123456',
                status: 'Closed',
                limit: 20,
            });
            const where = prisma.zohoInvoice.findMany.mock.calls[0]![0].where;
            expect(where.status).toBe('Closed');
            expect(where.OR).toEqual(
                expect.arrayContaining([
                    {
                        sourceKey: {
                            contains: 'AB-123456',
                            mode: 'insensitive',
                        },
                    },
                    {
                        customer: {
                            name: {
                                contains: 'AB-123456',
                                mode: 'insensitive',
                            },
                        },
                    },
                    {
                        lines: {
                            some: {
                                serials: {
                                    some: {
                                        serialNorm: { contains: 'AB123456' },
                                    },
                                },
                            },
                        },
                    },
                ]),
            );
            expect(res.rows[0]).toMatchObject({
                number: 'INV-1',
                customerName: 'Fake Person',
                collected: 'YES',
            });
        });

        it('skips the serial search for a short text', async () => {
            const { service, prisma } = setup();
            prisma.zohoInvoice.count.mockResolvedValue(0);
            prisma.zohoInvoice.findMany.mockResolvedValue([]);
            prisma.zohoInvoiceLine.groupBy.mockResolvedValue([]);
            await service.invoices({ q: 'abc' });
            expect(
                prisma.zohoInvoice.findMany.mock.calls[0]![0].where.OR,
            ).toHaveLength(2);
        });

        it('returns an invoice with its lines, serials, payments and the sale each line was matched to', async () => {
            const { service, prisma } = setup();
            prisma.zohoInvoice.findUnique.mockResolvedValue({
                id: 7,
                sourceKey: 'INV-1',
                date: date('2026-10-20'),
                status: 'Closed',
                total: 500,
                customerId: 4,
                missingFromImport: false,
                customer: { name: 'Fake Person' },
                lines: [
                    {
                        id: 11,
                        sourceKey: 'L11',
                        itemName: '1oz Gold Bar',
                        refinery: 'VALCAMBI',
                        qty: 1,
                        unitPrice: 500,
                        lineTotal: 500,
                        serials: [{ serial: 'AB123456' }],
                        collectedFlag: 'YES',
                        collectedDate: date('2026-10-22'),
                        deliveredBrinks: null,
                        soldBack: null,
                    },
                ],
                payments: [
                    {
                        id: 3,
                        date: date('2026-10-21'),
                        amount: 500,
                        mode: 'Cash',
                    },
                ],
            });
            prisma.entityLink.findMany.mockResolvedValue([
                {
                    linkType: 'invoice_line_trade',
                    confidence: 'PROBABLE',
                    status: 'PENDING',
                    toKey: 'T1',
                },
            ]);
            prisma.trade.findMany.mockResolvedValue([
                { sourceKey: 'T1', reference: 'DU-G20260941' },
            ]);

            const inv = await service.invoice(7);
            expect(prisma.entityLink.findMany).toHaveBeenCalledWith({
                where: {
                    fromTable: 'invoice_lines',
                    fromKey: { in: ['L11'] },
                    status: { not: 'REJECTED' },
                },
            });
            expect(inv.lines[0]).toMatchObject({
                product: '1oz Gold Bar',
                serials: ['AB123456'],
                collectedFlag: 'YES',
                collectedDate: '2026-10-22',
            });
            expect(inv.links).toEqual([
                {
                    linkType: 'invoice_line_trade',
                    confidence: 'PROBABLE',
                    status: 'PENDING',
                    trade: 'DU-G20260941',
                },
            ]);
            expect(inv.payments[0]).toMatchObject({
                amount: 500,
                mode: 'Cash',
            });
        });

        it('says so when the invoice is missing', async () => {
            const { service, prisma } = setup();
            prisma.zohoInvoice.findUnique.mockResolvedValue(null);
            await expect(service.invoice(1)).rejects.toBeInstanceOf(
                NotFoundException,
            );
        });
    });
});
