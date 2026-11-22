"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemTraceService = void 0;
const common_1 = require("@nestjs/common");
const shared_types_1 = require("@goldilocks/shared-types");
const prisma_service_1 = require("../../infrastructure/prisma/prisma.service");
const iso = (d) => (d ? d.toISOString().slice(0, 10) : null);
let ItemTraceService = class ItemTraceService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async trace(serial) {
        const key = (0, shared_types_1.serialKey)(serial);
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
        if (!item)
            throw new common_1.NotFoundException('No bar with that serial.');
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
};
exports.ItemTraceService = ItemTraceService;
exports.ItemTraceService = ItemTraceService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ItemTraceService);
//# sourceMappingURL=item-trace.service.js.map