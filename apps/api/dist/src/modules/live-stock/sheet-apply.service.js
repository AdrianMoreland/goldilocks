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
exports.SheetApplyService = void 0;
const common_1 = require("@nestjs/common");
const shared_types_1 = require("@goldilocks/shared-types");
const client_1 = require("../../../prisma/generated/client");
const prisma_service_1 = require("../../infrastructure/prisma/prisma.service");
const audit_log_service_1 = require("../audit-log/audit-log.service");
const live_stock_service_1 = require("./live-stock.service");
const day = (d) => d.toISOString().slice(0, 10);
const keyOf = (kind, referenceKey, occurrence) => `${kind}|${referenceKey}|${occurrence}`;
const lineLabel = (l) => l.kind === 'BAR'
    ? `${l.variant} bar${l.refinery ? ' ' + l.refinery.toLowerCase() : ''}`
    : `${l.family} ${l.variant}`;
let SheetApplyService = class SheetApplyService {
    prisma;
    stock;
    audit;
    constructor(prisma, stock, audit) {
        this.prisma = prisma;
        this.stock = stock;
        this.audit = audit;
    }
    async gather() {
        const branches = await this.prisma.liveStockBranch.findMany();
        const cutovers = new Map(branches.map((b) => [
            b.code,
            b.cutoverDate ? day(b.cutoverDate) : null,
        ]));
        const dates = [...cutovers.values()].filter((d) => d !== null);
        if (dates.length === 0)
            throw new common_1.BadRequestException('Load the stock sheet first: sheet rows only apply after a baseline.');
        const earliest = new Date(`${dates.sort()[0]}T00:00:00.000Z`);
        const apps = await this.prisma.sheetApplication.findMany();
        const priors = new Map();
        for (const a of apps)
            priors.set(keyOf(a.kind, a.referenceKey, a.occurrence), {
                id: a.id,
                status: a.status,
                appliedQty: a.appliedQty,
                lineId: a.lineId,
                reason: a.reason,
                branchCode: a.branchCode,
            });
        const known = (kind) => apps.filter((a) => a.kind === kind).map((a) => a.referenceKey);
        const [trades, lots] = await Promise.all([
            this.prisma.trade.findMany({
                where: {
                    cptyKind: 'LOT_REF',
                    OR: [
                        { date: { gt: earliest } },
                        { referenceKey: { in: known('SALE') } },
                    ],
                },
            }),
            this.prisma.purchaseLot.findMany({
                where: {
                    OR: [
                        { received: { gt: earliest } },
                        { referenceKey: { in: known('PURCHASE') } },
                    ],
                },
            }),
        ]);
        const rows = [
            ...trades.map((t) => ({
                kind: 'SALE',
                reference: t.reference,
                referenceKey: t.referenceKey,
                occurrence: t.occurrence,
                branchCode: t.branchCode,
                metal: t.metal,
                productText: t.productText,
                qty: t.qty,
                date: t.date ? day(t.date) : null,
                eligible: t.cptyKind === 'LOT_REF' &&
                    t.state !== 'QUOTE' &&
                    t.state !== 'DEFERRED' &&
                    !t.missingFromImport &&
                    t.occurrence === 1 &&
                    t.issues.length === 0,
            })),
            ...lots.map((l) => ({
                kind: 'PURCHASE',
                reference: l.reference,
                referenceKey: l.referenceKey,
                occurrence: l.occurrence,
                branchCode: l.branchCode,
                metal: l.metal,
                productText: l.productText,
                qty: l.qty,
                date: l.received ? day(l.received) : null,
                eligible: !l.melt &&
                    !l.missingFromImport &&
                    l.occurrence === 1 &&
                    l.issues.length === 0,
            })),
        ].sort((a, b) => (a.date ?? '').localeCompare(b.date ?? '') ||
            a.reference.localeCompare(b.reference));
        const lineRows = await this.prisma.liveStockLine.findMany();
        const manual = await this.prisma.liveStockMovement.findMany({
            where: { source: 'MANUAL', at: { gte: earliest } },
            select: { id: true, lineId: true, at: true },
        });
        const undone = new Set((await this.prisma.liveStockMovement.findMany({
            where: { reversesId: { not: null } },
            select: { reversesId: true },
        })).map((m) => m.reversesId));
        const lastManual = new Map();
        for (const m of manual) {
            if (undone.has(m.id))
                continue;
            const d = day(m.at);
            if (d > (lastManual.get(m.lineId) ?? ''))
                lastManual.set(m.lineId, d);
        }
        const lines = lineRows.map((l) => ({
            lineId: l.id,
            kind: l.kind,
            family: l.family,
            variant: l.variant,
            refinery: l.refinery,
            qty: l.qty,
            lastManualOn: lastManual.get(l.id) ?? null,
        }));
        const lineBranch = new Map(lineRows.map((l) => [
            l.id,
            { branchCode: l.branchCode, metal: l.metal },
        ]));
        return { rows, priors, cutovers, lines, lineBranch };
    }
    candidatesFor(g, branchCode, metal) {
        return g.lines.filter((l) => {
            const b = g.lineBranch.get(l.lineId);
            return b?.branchCode === branchCode && b.metal === metal;
        });
    }
    opt(l) {
        return { lineId: l.lineId, label: lineLabel(l), qty: l.qty };
    }
    toItem(r, plan, g, applicationId) {
        const base = {
            key: keyOf(r.kind, r.referenceKey, r.occurrence),
            applicationId,
            kind: r.kind,
            reference: r.reference,
            branchCode: r.branchCode ?? '',
            metal: r.metal,
            productText: r.productText,
            date: r.date,
        };
        const byId = (id) => g.lines.find((l) => l.lineId === id);
        switch (plan.type) {
            case 'SKIP':
                return null;
            case 'APPLY': {
                const l = byId(plan.lineId);
                return {
                    ...base,
                    delta: plan.delta,
                    line: l ? this.opt(l) : null,
                    outcome: 'APPLY',
                    message: '',
                    options: [],
                };
            }
            case 'CREATE_AND_APPLY':
                return {
                    ...base,
                    delta: plan.delta,
                    line: null,
                    outcome: 'CREATE',
                    message: `Starts a new line: ${lineLabel(plan.create)}.`,
                    options: [],
                };
            case 'ASK_COUNTED': {
                const l = byId(plan.lineId);
                return {
                    ...base,
                    delta: plan.delta,
                    line: l ? this.opt(l) : null,
                    outcome: 'ASK_COUNTED',
                    message: `This line was changed by hand on or after ${r.date}. Is the sale already in that count?`,
                    options: [],
                };
            }
            case 'PICK_LINE':
                return {
                    ...base,
                    delta: plan.delta,
                    line: null,
                    outcome: 'PICK_LINE',
                    message: 'Which one was it?',
                    options: plan.lineIds
                        .map(byId)
                        .filter((l) => Boolean(l))
                        .map((l) => this.opt(l)),
                };
            case 'UNMATCHED':
                return {
                    ...base,
                    delta: plan.delta,
                    line: null,
                    outcome: 'UNMATCHED',
                    message: plan.message,
                    options: this.candidatesFor(g, r.branchCode ?? '', r.metal)
                        .filter((l) => (plan.delta < 0 ? l.qty > 0 : true))
                        .map((l) => this.opt(l)),
                };
            case 'WITHDRAWN': {
                const l = plan.lineId ? byId(plan.lineId) : undefined;
                return {
                    ...base,
                    delta: plan.appliedQty,
                    line: l ? this.opt(l) : null,
                    outcome: 'WITHDRAWN',
                    message: 'Applied before, but this row is now a quote, deferred, repeated or gone. Reverse it, or keep the stock as it is?',
                    options: [],
                };
            }
        }
    }
    plans(g) {
        const out = [];
        const skipped = {};
        for (const row of g.rows) {
            const prior = g.priors.get(keyOf(row.kind, row.referenceKey, row.occurrence)) ?? null;
            const plan = (0, shared_types_1.planRow)(row, prior, {
                cutoverDate: row.branchCode
                    ? (g.cutovers.get(row.branchCode) ?? null)
                    : null,
                candidates: row.branchCode
                    ? this.candidatesFor(g, row.branchCode, row.metal)
                    : [],
            });
            if (plan.type === 'SKIP') {
                if (plan.reason !== 'INELIGIBLE' && plan.reason !== 'UNCHANGED')
                    skipped[plan.reason] = (skipped[plan.reason] ?? 0) + 1;
                else if (plan.reason === 'UNCHANGED')
                    skipped.UNCHANGED = (skipped.UNCHANGED ?? 0) + 1;
                continue;
            }
            out.push({ row, plan, prior });
        }
        return { out, skipped };
    }
    async preview(user) {
        this.assertAdmin(user);
        const g = await this.gather();
        const { out, skipped } = this.plans(g);
        const willApply = [];
        const needsDecision = [];
        for (const { row, plan, prior } of out) {
            const item = this.toItem(row, plan, g, prior?.id ?? null);
            if (!item)
                continue;
            (plan.type === 'APPLY' || plan.type === 'CREATE_AND_APPLY'
                ? willApply
                : needsDecision).push(item);
        }
        return {
            cutovers: Object.fromEntries(g.cutovers),
            willApply,
            needsDecision,
            pending: await this.pending(user, g),
            skipped,
        };
    }
    async pending(user, gathered) {
        const apps = await this.prisma.sheetApplication.findMany({
            where: { status: 'NEEDS_DECISION' },
            orderBy: { id: 'asc' },
        });
        if (apps.length === 0)
            return [];
        const g = gathered ?? (await this.gather());
        const items = [];
        for (const a of apps) {
            const row = g.rows.find((r) => r.kind === a.kind &&
                r.referenceKey === a.referenceKey &&
                r.occurrence === a.occurrence);
            if (!row)
                continue;
            const l = a.lineId
                ? g.lines.find((x) => x.lineId === a.lineId)
                : undefined;
            const product = (0, shared_types_1.readProduct)(row.productText);
            let options = [];
            if (a.reason === 'PICK_LINE' && product)
                options = (0, shared_types_1.matchLines)(product, this.candidatesFor(g, a.branchCode, row.metal))
                    .filter((x) => (a.kind === 'SALE' ? x.qty > 0 : true))
                    .map((x) => this.opt(x));
            else if (a.reason === 'UNMATCHED' || a.reason === 'NEGATIVE')
                options = this.candidatesFor(g, a.branchCode, row.metal)
                    .filter((x) => (a.kind === 'SALE' ? x.qty > 0 : true))
                    .map((x) => this.opt(x));
            const outcome = a.reason === 'COUNTED_ASK'
                ? 'ASK_COUNTED'
                : a.reason === 'PICK_LINE'
                    ? 'PICK_LINE'
                    : a.reason === 'WITHDRAWN'
                        ? 'WITHDRAWN'
                        : a.reason === 'NEGATIVE'
                            ? 'NEGATIVE'
                            : 'UNMATCHED';
            items.push({
                key: keyOf(a.kind, a.referenceKey, a.occurrence),
                applicationId: a.id,
                kind: a.kind,
                reference: row.reference,
                branchCode: a.branchCode,
                metal: row.metal,
                productText: row.productText,
                date: row.date,
                delta: a.reason === 'WITHDRAWN'
                    ? a.appliedQty
                    : (a.kind === 'SALE' ? -1 : 1) * (row.qty ?? 0),
                line: l ? this.opt(l) : null,
                outcome,
                message: a.note ?? '',
                options,
            });
        }
        void user;
        return items;
    }
    async apply(user) {
        this.assertAdmin(user);
        const g = await this.gather();
        const { out, skipped } = this.plans(g);
        let applied = 0;
        let units = 0;
        let waiting = 0;
        const failed = [];
        for (const { row, plan, prior } of out) {
            const source = row.kind === 'SALE'
                ? 'SHEET_SALE'
                : 'SHEET_PURCHASE';
            const common = {
                kind: row.kind,
                referenceKey: row.referenceKey,
                occurrence: row.occurrence,
                branchCode: row.branchCode ?? '',
                rowDate: row.date
                    ? new Date(`${row.date}T00:00:00.000Z`)
                    : null,
                rowQty: row.qty ?? 0,
            };
            try {
                if (plan.type === 'APPLY' || plan.type === 'CREATE_AND_APPLY') {
                    await this.prisma.$transaction(async (tx) => {
                        let lineId;
                        if (plan.type === 'CREATE_AND_APPLY') {
                            const line = await tx.liveStockLine.upsert({
                                where: {
                                    branchCode_metal_kind_family_variant_refinery: {
                                        branchCode: row.branchCode ?? '',
                                        metal: row.metal,
                                        kind: plan.create.kind,
                                        family: plan.create.family,
                                        variant: plan.create.variant,
                                        refinery: plan.create.refinery,
                                    },
                                },
                                update: {},
                                create: {
                                    branchCode: row.branchCode ?? '',
                                    metal: row.metal,
                                    ...plan.create,
                                },
                            });
                            lineId = line.id;
                        }
                        else
                            lineId = plan.lineId;
                        if (prior)
                            await tx.sheetApplication.update({
                                where: { id: prior.id },
                                data: {
                                    appliedQty: { increment: plan.delta },
                                    rowQty: common.rowQty,
                                    rowDate: common.rowDate,
                                    status: 'APPLIED',
                                },
                            });
                        else
                            await tx.sheetApplication.create({
                                data: {
                                    ...common,
                                    lineId,
                                    appliedQty: plan.delta,
                                    status: 'APPLIED',
                                },
                            });
                        await this.stock.move(tx, lineId, plan.delta, {
                            source,
                            reference: row.reference,
                            reason: `Sheet ${row.kind.toLowerCase()} ${row.reference}`,
                            actor: user.email,
                        });
                    });
                    applied += 1;
                    units += Math.abs(plan.delta);
                }
                else {
                    await this.park(row, plan, common, prior);
                    waiting += 1;
                }
            }
            catch (e) {
                if (e instanceof client_1.Prisma.PrismaClientKnownRequestError &&
                    e.code === 'P2002')
                    continue;
                if (e instanceof common_1.BadRequestException &&
                    !prior &&
                    (plan.type === 'APPLY' || plan.type === 'CREATE_AND_APPLY')) {
                    await this.park(row, {
                        type: 'UNMATCHED',
                        delta: plan.delta,
                        message: e.message,
                    }, common, null, 'NEGATIVE', plan.type === 'APPLY' ? plan.lineId : null);
                    waiting += 1;
                    continue;
                }
                failed.push({
                    reference: row.reference,
                    message: e instanceof Error ? e.message : 'Failed',
                });
            }
        }
        await this.audit.record(user.email, 'live-stock.sheet-apply', `${applied} rows applied (${units} units), ${waiting} waiting, ${failed.length} failed`);
        return { applied, units, waiting, failed, skipped };
    }
    async park(row, plan, common, prior, forceReason, forceLine) {
        let reason;
        let lineId = null;
        let note = null;
        switch (plan.type) {
            case 'ASK_COUNTED':
                reason = 'COUNTED_ASK';
                lineId = plan.lineId;
                break;
            case 'PICK_LINE':
                reason = 'PICK_LINE';
                break;
            case 'WITHDRAWN':
                reason = 'WITHDRAWN';
                lineId = plan.lineId;
                break;
            case 'UNMATCHED':
                reason = forceReason ?? 'UNMATCHED';
                lineId = forceLine ?? null;
                note = plan.message;
                break;
            default:
                return;
        }
        if (prior)
            await this.prisma.sheetApplication.update({
                where: { id: prior.id },
                data: { status: 'NEEDS_DECISION', reason, note },
            });
        else
            await this.prisma.sheetApplication.create({
                data: {
                    ...common,
                    lineId,
                    appliedQty: 0,
                    status: 'NEEDS_DECISION',
                    reason,
                    note,
                },
            });
        void row;
    }
    async resolve(user, applicationId, dto) {
        const app = await this.prisma.sheetApplication.findUnique({
            where: { id: applicationId },
        });
        if (!app)
            throw new common_1.NotFoundException('That row was not found.');
        const branch = await this.prisma.liveStockBranch.findUnique({
            where: { code: app.branchCode },
        });
        if (!branch || !this.stock.canEditBranch(user, branch))
            throw new common_1.ForbiddenException('Only admins and managers settle rows.');
        if (app.status !== 'NEEDS_DECISION')
            throw new common_1.BadRequestException('That row is not waiting for a decision.');
        const sign = app.kind === 'SALE' ? -1 : 1;
        const source = app.kind === 'SALE'
            ? 'SHEET_SALE'
            : 'SHEET_PURCHASE';
        const reference = app.referenceKey;
        return this.prisma.$transaction(async (tx) => {
            const done = async (status, reason, data = {}) => {
                await tx.sheetApplication.update({
                    where: { id: app.id },
                    data: { status, reason, decidedBy: user.email, ...data },
                });
                await this.audit.record(user.email, 'live-stock.sheet-decision', `${app.kind} ${reference} (${app.branchCode}): ${dto.choice}`, tx);
                return { status };
            };
            if (dto.choice === 'DISMISS')
                return done('DISMISSED', 'DISMISSED', {
                    appliedQty: app.reason === 'WITHDRAWN' ? app.appliedQty : 0,
                });
            if (app.reason === 'WITHDRAWN') {
                if (dto.choice === 'KEEP')
                    return done('DISMISSED', 'KEPT');
                if (dto.choice !== 'REVERSE')
                    throw new common_1.BadRequestException('Choose Reverse or Keep.');
                if (app.lineId === null)
                    throw new common_1.BadRequestException('That row has no line to reverse on.');
                await this.stock.move(tx, app.lineId, -app.appliedQty, {
                    source,
                    reference,
                    reason: `Sheet ${app.kind.toLowerCase()} ${reference} withdrawn`,
                    actor: user.email,
                });
                return done('DISMISSED', 'REVERSED', { appliedQty: 0 });
            }
            if (dto.choice === 'KEEP' || dto.choice === 'REVERSE')
                throw new common_1.BadRequestException('That choice is for withdrawn rows.');
            const current = app.kind === 'SALE'
                ? await tx.trade.findUnique({
                    where: {
                        referenceKey_occurrence: {
                            referenceKey: app.referenceKey,
                            occurrence: app.occurrence,
                        },
                    },
                    select: { qty: true },
                })
                : await tx.purchaseLot.findUnique({
                    where: {
                        referenceKey_occurrence: {
                            referenceKey: app.referenceKey,
                            occurrence: app.occurrence,
                        },
                    },
                    select: { qty: true },
                });
            const target = sign * (current?.qty ?? app.rowQty);
            const lineId = dto.choice === 'LINE' ? dto.lineId : (dto.lineId ?? app.lineId);
            if (lineId === undefined || lineId === null)
                throw new common_1.BadRequestException('Pick the line this belongs to.');
            const line = await this.stock.lineOrThrow(tx, lineId);
            if (line.branchCode !== app.branchCode)
                throw new common_1.BadRequestException('That line is at a different branch.');
            if (dto.choice === 'COUNTED')
                return done('APPLIED', 'COUNTED', {
                    lineId,
                    appliedQty: target,
                });
            await this.stock.move(tx, lineId, target, {
                source,
                reference,
                reason: `Sheet ${app.kind.toLowerCase()} ${reference}`,
                actor: user.email,
            });
            return done('APPLIED', null, { lineId, appliedQty: target });
        });
    }
    assertAdmin(user) {
        if (!user.admin)
            throw new common_1.ForbiddenException('Only admins apply the tradesheet to stock.');
    }
};
exports.SheetApplyService = SheetApplyService;
exports.SheetApplyService = SheetApplyService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        live_stock_service_1.LiveStockService,
        audit_log_service_1.AuditLogService])
], SheetApplyService);
//# sourceMappingURL=sheet-apply.service.js.map