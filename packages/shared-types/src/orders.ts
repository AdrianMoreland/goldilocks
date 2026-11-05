import type { CptyKind } from './tradesheet-import';

/**
 * The order lifecycle staff see, derived from what the tradesheet shows plus the steps Goldilocks has recorded.
 * The tradesheet stays the source of truth: nothing here is written back to it. Each recorded step instead leaves
 * sheet tasks (the exact value to paste), and an import that shows the change closes them.
 */
export const ORDER_LIFECYCLE = ['QUOTE', 'PAID', 'ORDERED', 'ARRIVED', 'ALLOCATED', 'MATCHED', 'COLLECTED', 'POSTED'] as const;
export type OrderLifecycle = (typeof ORDER_LIFECYCLE)[number];

export const ORDER_LIFECYCLE_LABELS: Record<OrderLifecycle, string> = {
  QUOTE: 'Quote',
  PAID: 'Paid',
  ORDERED: 'Ordered',
  ARRIVED: 'Arrived',
  ALLOCATED: 'Allocated',
  MATCHED: 'Matched',
  COLLECTED: 'Collected',
  POSTED: 'Posted in BC',
};

/** Steps Goldilocks records. Quote and Paid come from the tradesheet. */
export const ORDER_STEPS = ['ORDERED', 'ARRIVED', 'ALLOCATED', 'MATCHED', 'COLLECTED', 'POSTED'] as const;
export type OrderStep = (typeof ORDER_STEPS)[number];

/**
 * Where the goods come from. A supplier invoice in CPTY means the whole order was sent to a supplier. A P-line in
 * CPTY means it was filled from stock. With neither, nobody has decided yet.
 */
export type OrderSource = 'STOCK' | 'SUPPLIER' | 'UNDECIDED' | 'NEEDS_ORDER';

export type OrderQueue =
  | 'order' // paid, to be ordered
  | 'arrive' // ordered, awaiting arrival
  | 'alloc' // paid or arrived, to be allocated
  | 'pline' // hedged without a P-line
  | 'nopost' // collected, not posted in BC
  | 'tsmark' // collected, but the tradesheet does not say so
  | 'bcanom' // BC prepayment or match anomaly
  | 'over' // P-line over-allocated
  | 'defer' // deferred placeholder
  | 'quote';

export interface OrderFacts {
  cptyKind: CptyKind;
  /** The Collected cell on the tradesheet (value or green fill). */
  collected: boolean;
  /** CPTY names a purchase line that exists. */
  hasLot: boolean;
  supplierInvoice: string | null;
  /** Steps recorded in Goldilocks for this order. */
  steps: readonly OrderStep[];
  /** In the latest BC "Orders Awaiting Collection": true open, false absent (posted), null no report or no link. */
  bcOpen: boolean | null;
  /** Set by the service from BC and lot data. */
  bcAnomaly?: boolean;
  lotOverAllocated?: boolean;
}

export interface DerivedOrder {
  lifecycle: OrderLifecycle;
  source: OrderSource;
  queues: OrderQueue[];
}

const rank = (l: OrderLifecycle) => ORDER_LIFECYCLE.indexOf(l);

export function orderSource(f: OrderFacts): OrderSource {
  if (f.cptyKind === 'DEFERRED') return 'NEEDS_ORDER';
  if (f.hasLot || f.cptyKind === 'LOT_REF') return 'STOCK';
  if (f.supplierInvoice || f.cptyKind === 'SUPPLIER_INVOICE' || f.steps.includes('ORDERED')) return 'SUPPLIER';
  if (f.steps.includes('ALLOCATED')) return 'STOCK';
  return 'UNDECIDED';
}

/** The furthest stage any fact supports. */
export function orderLifecycle(f: OrderFacts): OrderLifecycle {
  if (f.cptyKind === 'QUOTE_ONLY') return 'QUOTE';
  let best = 'PAID' as OrderLifecycle;
  const reach = (l: OrderLifecycle) => {
    if (rank(l) > rank(best)) best = l;
  };
  if (f.supplierInvoice || f.cptyKind === 'SUPPLIER_INVOICE' || f.steps.includes('ORDERED')) reach('ORDERED');
  if (f.steps.includes('ARRIVED')) reach('ARRIVED');
  if (f.steps.includes('ALLOCATED')) reach('ALLOCATED');
  if (f.hasLot || f.steps.includes('MATCHED')) reach('MATCHED');
  if (f.collected || f.steps.includes('COLLECTED')) reach('COLLECTED');
  const collected = best === 'COLLECTED';
  if (f.steps.includes('POSTED') || (collected && f.bcOpen === false)) reach('POSTED');
  return best;
}

export function deriveOrder(f: OrderFacts): DerivedOrder {
  const lifecycle = orderLifecycle(f);
  const source = orderSource(f);
  const q: OrderQueue[] = [];
  if (f.cptyKind === 'DEFERRED') q.push('defer');
  else if (lifecycle === 'QUOTE') q.push('quote');
  else {
    if (lifecycle === 'PAID' && source === 'NEEDS_ORDER') q.push('order');
    if (lifecycle === 'ORDERED') q.push('arrive');
    if (lifecycle === 'ARRIVED' || (lifecycle === 'PAID' && source !== 'NEEDS_ORDER')) q.push('alloc');
    const noLine = !f.hasLot && source !== 'SUPPLIER' && (f.cptyKind === 'HEDGED' || f.cptyKind === 'EMPTY');
    if (noLine && rank(lifecycle) >= rank('PAID') && rank(lifecycle) <= rank('ALLOCATED')) q.push('pline');
    if (lifecycle === 'COLLECTED' && f.bcOpen === true) q.push('nopost');
    if ((lifecycle === 'COLLECTED' || lifecycle === 'POSTED') && !f.collected) q.push('tsmark');
    if (f.bcAnomaly) q.push('bcanom');
    if (f.lotOverAllocated) q.push('over');
  }
  return { lifecycle, source, queues: q };
}

/** Open means staff still have something to do. Collected counts as open only while BC lists it or a queue needs it. */
export function isOpenOrder(d: DerivedOrder, bcOpen: boolean | null): boolean {
  switch (d.lifecycle) {
    case 'QUOTE':
      return false;
    case 'COLLECTED':
      return bcOpen === true || d.queues.length > 0;
    case 'POSTED':
      return d.queues.includes('tsmark');
    default:
      return true;
  }
}

export type OrderRole = 'broker' | 'manager';

export interface NextAction {
  code: string;
  label: string;
  /** Who does it: brokers allocate; managers order, hedge, post and sign off. Null when nothing is needed. */
  who: OrderRole | null;
  /** The step that button records, if any. */
  step: OrderStep | null;
}

export function nextAction(lifecycle: OrderLifecycle, source: OrderSource, queues: readonly OrderQueue[]): NextAction {
  if (queues.includes('defer')) return { code: 'DEFERRED', label: 'Open the rows named in the notes and track those', who: 'manager', step: null };
  switch (lifecycle) {
    case 'QUOTE':
      return { code: 'NONE', label: 'Nothing: a quote reserves no stock', who: null, step: null };
    case 'PAID':
      if (source === 'NEEDS_ORDER') return { code: 'ORDER', label: 'Order the whole order from the supplier', who: 'manager', step: 'ORDERED' };
      return { code: 'ALLOCATE_OR_ORDER', label: 'Check stock: allocate it, or order the whole order', who: 'broker', step: 'ALLOCATED' };
    case 'ORDERED':
      return { code: 'ARRIVE', label: 'Mark arrived when the delivery is here', who: 'manager', step: 'ARRIVED' };
    case 'ARRIVED':
      return { code: 'ALLOCATE', label: 'Allocate it', who: 'broker', step: 'ALLOCATED' };
    case 'ALLOCATED':
      if (source === 'SUPPLIER') return { code: 'READY', label: 'Ready for collection', who: null, step: null };
      return { code: 'MATCH', label: 'Find the P-line, then write it in CPTY', who: 'broker', step: 'MATCHED' };
    case 'MATCHED':
      return { code: 'COLLECT', label: 'Ready for collection', who: 'manager', step: 'COLLECTED' };
    case 'COLLECTED':
      if (queues.includes('tsmark')) return { code: 'TICK', label: 'Tick Collected on the tradesheet', who: 'manager', step: null };
      return { code: 'POST', label: 'Post, Ship and Invoice in BC', who: 'manager', step: 'POSTED' };
    case 'POSTED':
      if (queues.includes('tsmark')) return { code: 'TICK', label: 'Tick Collected on the tradesheet', who: 'manager', step: null };
      return { code: 'DONE', label: 'Done', who: null, step: null };
  }
}

/** Steps that may be recorded from a stage. Allocation and ordering are both possible from Paid: stock decides. */
export function allowedSteps(lifecycle: OrderLifecycle, source: OrderSource): OrderStep[] {
  switch (lifecycle) {
    case 'PAID':
      return source === 'NEEDS_ORDER' ? ['ORDERED'] : ['ALLOCATED', 'ORDERED'];
    case 'ORDERED':
      return ['ARRIVED'];
    case 'ARRIVED':
      return ['ALLOCATED'];
    case 'ALLOCATED':
      return source === 'SUPPLIER' ? ['COLLECTED'] : ['MATCHED', 'COLLECTED'];
    case 'MATCHED':
      return ['COLLECTED'];
    case 'COLLECTED':
      return ['POSTED'];
    default:
      return [];
  }
}

/** The role that may record a step. */
export const STEP_ROLE: Record<OrderStep, OrderRole> = {
  ORDERED: 'manager',
  ARRIVED: 'manager',
  ALLOCATED: 'broker',
  MATCHED: 'broker',
  COLLECTED: 'manager',
  POSTED: 'manager',
};

export const SHEETS = ['Tradesheet', 'Purchase tab', 'Stock sheet', 'Customer safe sheet'] as const;
export type SheetName = (typeof SHEETS)[number];

/** How an import can tell a task is done. MANUAL means only a person can tick it. */
export type TaskCheck = 'TRADE_COLLECTED' | 'TRADE_CPTY' | 'MANUAL';

export interface SheetTaskDraft {
  sheet: SheetName;
  what: string;
  value: string;
  check: TaskCheck;
}

export interface StepContext {
  client: string;
  reference: string;
  /** For example "1oz Krugerrand". */
  product: string;
  qty: number | null;
  supplierInvoice?: string | null;
  /** The purchase line chosen for a sale, for example DU-GP20261028. */
  pline?: string | null;
  /** Running "N sold" text for that purchase line's Comments. */
  soldComment?: string | null;
  serials?: readonly string[];
  refinery?: string | null;
  /** Text for the stock sheet, for example "Coins: 1oz Krugerrand 42 -> 37". */
  stockChange?: string | null;
  date?: string | null;
}

/** The tab-separated row for the customer safe sheet. */
export function customerSafeRow(c: StepContext): string {
  return ['Allocated', 'DU', c.date ?? '', c.client, c.reference, c.qty ?? '', c.product, c.refinery ?? '', (c.serials ?? []).join(', ')].join('\t');
}

/** What recording a step asks staff to change in the sheets. Goldilocks never edits a sheet itself. */
export function sheetTasksForStep(step: OrderStep, c: StepContext): SheetTaskDraft[] {
  switch (step) {
    case 'ORDERED':
      return [{ sheet: 'Tradesheet', what: 'Put the supplier invoice in CPTY', value: c.supplierInvoice ?? 'The supplier invoice number', check: 'TRADE_CPTY' }];
    case 'ALLOCATED': {
      const t: SheetTaskDraft[] = [];
      if (c.stockChange) t.push({ sheet: 'Stock sheet', what: 'Change the stock sheet', value: c.stockChange, check: 'MANUAL' });
      t.push({ sheet: 'Customer safe sheet', what: 'Add the customer safe row', value: customerSafeRow(c), check: 'MANUAL' });
      return t;
    }
    case 'MATCHED': {
      const t: SheetTaskDraft[] = [{ sheet: 'Tradesheet', what: 'Write the P-line in CPTY', value: c.pline ?? 'The P-line reference', check: 'TRADE_CPTY' }];
      if (c.soldComment) t.push({ sheet: 'Purchase tab', what: 'Type into that P-line’s Comments', value: c.soldComment, check: 'MANUAL' });
      return t;
    }
    case 'COLLECTED':
      return [
        { sheet: 'Tradesheet', what: 'Tick Collected (C or the date)', value: 'C', check: 'TRADE_COLLECTED' },
        { sheet: 'Customer safe sheet', what: 'Set the status to Collected', value: 'Collected', check: 'MANUAL' },
      ];
    default:
      return [];
  }
}

/** Whether the imported trade now shows what a task asked for. Only tasks with a check can close by import. */
export function taskShowsDone(task: { check: TaskCheck; value: string }, trade: { collected: boolean; cptyRaw: string | null }): boolean {
  if (task.check === 'TRADE_COLLECTED') return trade.collected;
  if (task.check === 'TRADE_CPTY') {
    const have = (trade.cptyRaw ?? '').trim().toLowerCase();
    const want = task.value.trim().toLowerCase();
    return want.length > 0 && have.length > 0 && have.includes(want);
  }
  return false;
}

/** Cash of 10,000 euro or more triggers the cash transactions procedure. */
export const CASH_AML_THRESHOLD = 10_000;
export const isCashOverThreshold = (mode: string, amount: number): boolean => mode.trim().toLowerCase() === 'cash' && amount >= CASH_AML_THRESHOLD;
