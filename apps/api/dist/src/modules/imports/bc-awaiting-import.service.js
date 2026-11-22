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
exports.BcAwaitingImportService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../infrastructure/prisma/prisma.service");
const workbook_import_service_1 = require("./workbook-import.service");
const MIN_CORE = 6;
let BcAwaitingImportService = class BcAwaitingImportService {
    prisma;
    workbook;
    constructor(prisma, workbook) {
        this.prisma = prisma;
        this.workbook = workbook;
    }
    preview(dto) {
        return this.run(dto, this.prisma, 'preview', true);
    }
    commit(dto, actor) {
        return this.prisma.$transaction((tx) => this.run(dto, tx, actor, false), {
            timeout: 120_000,
            maxWait: 10_000,
        });
    }
    async run(dto, db, actor, dry) {
        const chunk = {
            fileName: dto.fileName,
            schemaVersion: dto.schemaVersion,
            table: 'bc_sales_orders',
            rows: dto.rows,
            lastOfTable: false,
            complete: true,
        };
        const loaded = await this.workbook.loadChunk(chunk, db, actor, dry);
        const orders = db;
        const newCores = new Set(dto.rows
            .map((r) => typeof r['ext_doc_core'] === 'string'
            ? r['ext_doc_core']
            : '')
            .filter(Boolean));
        const newKeys = new Set(dto.rows.map((r) => String(r['id'])));
        const earlier = await orders['bcSalesOrder'].findMany({
            where: dry
                ? { missingFromImport: false }
                : {
                    missingFromImport: false,
                    importBatchId: { not: loaded.batchId },
                },
        });
        const gone = earlier.filter((o) => !newKeys.has(String(o['sourceKey'])));
        if (!dry && gone.length) {
            await orders['bcSalesOrder'].updateMany({
                where: { id: { in: gone.map((o) => o['id']) } },
                data: { missingFromImport: true },
            });
        }
        let posted = 0;
        let alreadyPosted = 0;
        let noTrade = 0;
        for (const order of gone) {
            const core = typeof order['extDocCore'] === 'string'
                ? order['extDocCore']
                : '';
            if (newCores.has(core))
                continue;
            if (core.length < MIN_CORE) {
                noTrade++;
                continue;
            }
            const trades = await orders['trade'].findMany({
                where: { referenceKey: { endsWith: core } },
            });
            if (trades.length === 0) {
                noTrade++;
                continue;
            }
            for (const trade of trades) {
                const done = await orders['orderEvent'].findMany({
                    where: { tradeId: trade['id'], step: 'POSTED' },
                });
                if (done.length) {
                    alreadyPosted++;
                    continue;
                }
                posted++;
                if (!dry) {
                    await orders['orderEvent'].createMany({
                        data: [
                            {
                                tradeId: trade['id'],
                                step: 'POSTED',
                                by: 'import',
                                note: 'No longer in the Business Central awaiting-collection report.',
                            },
                        ],
                    });
                }
            }
        }
        return {
            batchId: loaded.batchId,
            added: loaded.added,
            changed: loaded.changed,
            unchanged: loaded.unchanged,
            gone: gone.length,
            posted,
            alreadyPosted,
            noTrade,
        };
    }
};
exports.BcAwaitingImportService = BcAwaitingImportService;
exports.BcAwaitingImportService = BcAwaitingImportService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        workbook_import_service_1.WorkbookImportService])
], BcAwaitingImportService);
//# sourceMappingURL=bc-awaiting-import.service.js.map