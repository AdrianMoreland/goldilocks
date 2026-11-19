import { Injectable, NotFoundException } from '@nestjs/common';
import { serialKey, type ItemTrace } from '@goldilocks/shared-types';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';

const iso = (d: Date | null) => (d ? d.toISOString().slice(0, 10) : null);

/** Reads one bar's history. Customers are shown by their redaction code, never by name. */
@Injectable()
export class ItemTraceService {
    constructor(private readonly prisma: PrismaService) {}

    async trace(serial: string): Promise<ItemTrace> {
        const key = serialKey(serial);
        const item = key
            ? await this.prisma.item.findUnique({
                  where: { serialKey: key },
                  include: {
                      product: { select: { name: true } },
                      events: {
                          orderBy: [{ date: 'asc' }, { id: 'asc' }],
                          include: {
                              customer: { select: { redactionCode: true } },
                              trade: { select: { reference: true } },
                          },
                      },
                  },
              })
            : null;
        if (!item) throw new NotFoundException('No bar with that serial.');
        return {
            serial: item.serial,
            bcItemNo: item.bcItemNo,
            product: item.product?.name ?? null,
            status: item.status,
            locationCode: item.locationCode,
            events: item.events.map((e) => ({
                kind: e.kind,
                date: iso(e.date),
                source: e.source,
                sourceRef: e.sourceRef,
                locationCode: e.locationCode,
                partyNo: e.partyNo,
                customerCode: e.customer?.redactionCode ?? null,
                tradeReference: e.trade?.reference ?? null,
                quantity: Number(e.quantity),
                amount: e.amount === null ? null : Number(e.amount),
            })),
        };
    }
}
