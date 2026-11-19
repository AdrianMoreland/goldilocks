import { parseBarWeight, parseCoinName, parseWeight, type LiveKind, type LiveMetal } from './live-stock';

/**
 * Deciding what one tradesheet row does to live stock. Pure: the service gathers the rows, the stock lines and the
 * earlier applications, and acts on what this returns. Every rule that keeps a sale from being counted twice is here.
 *
 * A sale takes stock out, a purchase puts it in. The row's `date` has no time of day, so "this edit came before that
 * sale" can only be told apart by the day: an edit on or after the sale's day might already include it, and then a
 * person is asked rather than the system guessing.
 */

export type SheetKind = 'SALE' | 'PURCHASE';

export interface ApplyRow {
  kind: SheetKind;
  referenceKey: string;
  occurrence: number;
  branchCode: string | null;
  metal: LiveMetal;
  productText: string;
  qty: number | null;
  /** YYYY-MM-DD, or null when the sheet has no date. */
  date: string | null;
  /** False for a quote, deferred, repeated or flagged row, or one the importer no longer finds. */
  eligible: boolean;
}

/** A stock line the row could land on, as the service read it. */
export interface LineCandidate {
  lineId: number;
  kind: LiveKind;
  family: string;
  variant: string;
  refinery: string;
  qty: number;
  /** The day of the newest manual count change on this line that was not undone; null when none since cut-over. */
  lastManualOn: string | null;
}

export type ApplicationStatus = 'APPLIED' | 'NEEDS_DECISION' | 'DISMISSED';

export interface PriorApplication {
  id: number;
  status: ApplicationStatus;
  /** Signed: negative for a sale, positive for a purchase. What has been taken from or put into stock so far. */
  appliedQty: number;
  lineId: number | null;
  reason: string | null;
}

export type SkipReason = 'CUTOVER' | 'NO_DATE' | 'NO_BRANCH' | 'NO_QTY' | 'INELIGIBLE' | 'DISMISSED' | 'UNCHANGED' | 'PENDING';

export type RowPlan =
  | { type: 'SKIP'; reason: SkipReason }
  /** Change the line by `delta` and record it. `create` is set when no line exists yet (a purchase). */
  | { type: 'APPLY'; delta: number; lineId: number; create?: undefined }
  | { type: 'CREATE_AND_APPLY'; delta: number; create: NewLine }
  /** A manual edit on or after the sale's day may already include it. Ask. */
  | { type: 'ASK_COUNTED'; delta: number; lineId: number }
  /** More than one line fits (bars from several refineries). Ask which. */
  | { type: 'PICK_LINE'; delta: number; lineIds: number[] }
  /** No line fits, or none has stock to take from. */
  | { type: 'UNMATCHED'; delta: number; message: string }
  /** Applied earlier, but the row is now a quote, deferred, repeated or gone. A person decides. */
  | { type: 'WITHDRAWN'; appliedQty: number; lineId: number | null };

export interface NewLine {
  kind: LiveKind;
  family: string;
  variant: string;
  refinery: string;
}

export interface PlanContext {
  /** Sheet rows dated on or before this day are already in the baseline. Null: that branch has no baseline yet. */
  cutoverDate: string | null;
  candidates: LineCandidate[];
}

/** What the product text is: a bar of some weight, or a coin family and variant. Null when it cannot be read. */
export function readProduct(
  text: string
): { kind: 'BAR'; variant: string } | { kind: 'COIN'; family: string; variant: string; weight: string | null } | null {
  const isBar = /\bbars?\b/i.test(text);
  if (isBar) {
    const w = parseBarWeight(text);
    return w.grams === null ? null : { kind: 'BAR', variant: w.variant };
  }
  const coin = parseCoinName(text);
  if (coin.family === 'Other') return null;
  return { kind: 'COIN', family: coin.family, variant: coin.variant, weight: parseWeight(text)?.label ?? null };
}

/** The lines a row's product could mean: the exact variant first, then variants that start with the same weight. */
export function matchLines(product: NonNullable<ReturnType<typeof readProduct>>, lines: LineCandidate[]): LineCandidate[] {
  if (product.kind === 'BAR') return lines.filter((l) => l.kind === 'BAR' && l.variant === product.variant);
  const sameFamily = lines.filter((l) => l.kind === 'COIN' && l.family.toLowerCase() === product.family.toLowerCase());
  const exact = sameFamily.filter((l) => l.variant.toLowerCase() === product.variant.toLowerCase());
  if (exact.length) return exact;
  if (!product.weight) return [];
  return sameFamily.filter((l) => l.variant.toLowerCase().startsWith(product.weight!.toLowerCase()));
}

export function planRow(row: ApplyRow, prior: PriorApplication | null, ctx: PlanContext): RowPlan {
  if (!row.eligible) {
    if (prior && prior.status === 'APPLIED' && prior.appliedQty !== 0) {
      return { type: 'WITHDRAWN', appliedQty: prior.appliedQty, lineId: prior.lineId };
    }
    return { type: 'SKIP', reason: 'INELIGIBLE' };
  }
  if (!row.branchCode || ctx.cutoverDate === null) return { type: 'SKIP', reason: 'NO_BRANCH' };
  if (prior?.status === 'DISMISSED') return { type: 'SKIP', reason: 'DISMISSED' };
  if (!row.date) return { type: 'SKIP', reason: 'NO_DATE' };
  if (row.date <= ctx.cutoverDate) return { type: 'SKIP', reason: 'CUTOVER' };
  if (!row.qty || row.qty <= 0) return { type: 'SKIP', reason: 'NO_QTY' };

  const sign = row.kind === 'SALE' ? -1 : 1;
  const target = sign * row.qty;

  if (prior) {
    if (prior.status === 'NEEDS_DECISION') return { type: 'SKIP', reason: 'PENDING' };
    const diff = target - prior.appliedQty;
    if (diff === 0) return { type: 'SKIP', reason: 'UNCHANGED' };
    if (prior.lineId === null) return { type: 'SKIP', reason: 'PENDING' };
    return { type: 'APPLY', delta: diff, lineId: prior.lineId };
  }

  const product = readProduct(row.productText);
  if (!product) return { type: 'UNMATCHED', delta: target, message: `Cannot tell what “${row.productText}” is.` };
  let found = matchLines(product, ctx.candidates);
  // A sale needs stock to take from; among several lines only those holding some are real choices.
  if (row.kind === 'SALE') {
    const stocked = found.filter((l) => l.qty > 0);
    if (stocked.length === 0) {
      return {
        type: 'UNMATCHED',
        delta: target,
        message: found.length ? 'The matching line has no stock on record.' : 'No stock line matches this product at this branch.',
      };
    }
    found = stocked;
  }
  if (found.length === 0) {
    // A purchase of something not yet on the board creates its line.
    const create: NewLine =
      product.kind === 'BAR'
        ? { kind: 'BAR', family: 'Bar', variant: product.variant, refinery: '' }
        : { kind: 'COIN', family: product.family, variant: product.variant, refinery: '' };
    return { type: 'CREATE_AND_APPLY', delta: target, create };
  }
  if (found.length > 1) return { type: 'PICK_LINE', delta: target, lineIds: found.map((l) => l.lineId) };
  const only = found[0]!;
  // A person changed this count on or after the sale's day: the edit may already include the sale.
  if (only.lastManualOn !== null && only.lastManualOn >= row.date) {
    return { type: 'ASK_COUNTED', delta: target, lineId: only.lineId };
  }
  return { type: 'APPLY', delta: target, lineId: only.lineId };
}
