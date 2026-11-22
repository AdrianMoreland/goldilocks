"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.planRelink = planRelink;
exports.groupChanges = groupChanges;
const shared_types_1 = require("@goldilocks/shared-types");
const metalFits = (row, product) => !!product &&
    (product === row ||
        (product === 'PGM' && (row === 'PLATINUM' || row === 'PALLADIUM')));
function planRelink(rows, spec, full, person, lookups, correct) {
    const counts = {
        rowsChecked: 0,
        fill: 0,
        correct: 0,
        pricingOnlyNoColumn: 0,
        unresolved: 0,
        notProduct: 0,
    };
    const changes = [];
    const memo = new Map();
    const resolve = (data, tag, r) => {
        const metal = r.metal ?? (0, shared_types_1.metalInText)(r.text);
        if (!metal)
            return null;
        const k = [tag, r.text, r.refinery, metal, r.bcItemNo].join('\u0000');
        if (memo.has(k))
            return memo.get(k) ?? null;
        const res = (0, shared_types_1.resolveRowProduct)({
            productText: r.text,
            metal,
            refinery: r.refinery,
            bcItemNo: r.bcItemNo ?? null,
        }, data);
        memo.set(k, res);
        return res;
    };
    for (const r of rows) {
        counts.rowsChecked++;
        const primaryEmpty = spec.hasProductId
            ? r.productId === null
            : r.salesProductId === null;
        const res = resolve(full, 'full', r);
        if (res?.method === 'NOT_PRODUCT') {
            counts.notProduct++;
            continue;
        }
        const targetPid = r.bc?.productId ?? res?.pricingProductId ?? null;
        const targetSp = r.bc?.salesProductId ??
            (res?.salesProductId == null ? null : Number(res.salesProductId));
        if (primaryEmpty && targetPid === null && targetSp === null) {
            counts.unresolved++;
            continue;
        }
        if (!spec.hasProductId &&
            r.salesProductId === null &&
            targetSp === null &&
            targetPid !== null) {
            counts.pricingOnlyNoColumn++;
            continue;
        }
        const corr = {};
        if (!r.bc && res?.method === 'ALIAS') {
            const pr = resolve(person, 'person', r);
            const same = pr?.method === 'ALIAS' &&
                pr.pricingProductId === res.pricingProductId &&
                pr.salesProductId === res.salesProductId;
            const rowMetal = (0, shared_types_1.metalInText)(r.text) ?? r.metal;
            const targetMetal = pr?.salesProductId != null
                ? (lookups.salesMetal.get(Number(pr.salesProductId)) ??
                    (pr.pricingProductId !== null
                        ? lookups.pricingMetal.get(pr.pricingProductId)
                        : null))
                : pr?.pricingProductId != null
                    ? lookups.pricingMetal.get(pr.pricingProductId)
                    : null;
            if (same && pr && rowMetal && metalFits(rowMetal, targetMetal)) {
                const toSp = pr.salesProductId === null
                    ? null
                    : Number(pr.salesProductId);
                const generic = toSp === null && r.salesProductId !== null;
                if (spec.hasProductId &&
                    !generic &&
                    r.productId !== null &&
                    pr.pricingProductId !== null &&
                    r.productId !== pr.pricingProductId)
                    corr.productId = [r.productId, pr.pricingProductId];
                if (toSp !== null &&
                    r.salesProductId !== null &&
                    r.salesProductId !== toSp)
                    corr.salesProductId = [r.salesProductId, toSp];
            }
        }
        const corrects = Object.keys(corr).length > 0;
        if (corrects)
            counts.correct++;
        const fillMetal = (0, shared_types_1.metalInText)(r.text) ?? r.metal;
        const fillTargetMetal = targetSp !== null
            ? (lookups.salesMetal.get(targetSp) ??
                (targetPid !== null
                    ? lookups.pricingMetal.get(targetPid)
                    : null))
            : targetPid !== null
                ? lookups.pricingMetal.get(targetPid)
                : null;
        if (!r.bc &&
            fillMetal &&
            fillTargetMetal &&
            !metalFits(fillMetal, fillTargetMetal) &&
            !corrects) {
            if (primaryEmpty)
                counts.unresolved++;
            continue;
        }
        const fill = {};
        if (spec.hasProductId && r.productId === null && targetPid !== null)
            fill.productId = [null, targetPid];
        if (r.salesProductId === null && targetSp !== null) {
            const pidAfter = correct && corr.productId
                ? corr.productId[1]
                : (fill.productId?.[1] ?? r.productId);
            const consistent = !spec.hasProductId ||
                targetPid === null ||
                pidAfter === targetPid;
            if (consistent)
                fill.salesProductId = [null, targetSp];
        }
        const fills = Object.keys(fill).length > 0;
        if (fills)
            counts.fill++;
        const change = { ...fill, ...(correct ? corr : {}) };
        if (Object.keys(change).length > 0)
            changes.push({ id: r.id, change });
    }
    return { counts, changes };
}
function groupChanges(plan) {
    const groups = new Map();
    for (const { id, change } of plan) {
        const k = [
            change.productId?.join('>'),
            change.salesProductId?.join('>'),
        ]
            .map((p) => p ?? '-')
            .join('|');
        const g = groups.get(k);
        if (g)
            g.ids.push(id);
        else
            groups.set(k, { change, ids: [id] });
    }
    return [...groups.values()];
}
//# sourceMappingURL=product-relink.js.map