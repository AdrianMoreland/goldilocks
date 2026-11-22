import { z } from 'zod';

/**
 * Analytics: one route per tab, each behind its own permission. Every route takes the same period and returns
 * the period it used plus the previous period of the same length, so KPI tiles can show the change.
 */
export const ANALYTICS_PRESETS = ['30d', '90d', '12m', 'ytd'] as const;
export const AnalyticsPresetSchema = z.enum(ANALYTICS_PRESETS);
export type AnalyticsPreset = z.infer<typeof AnalyticsPresetSchema>;

export const AnalyticsQuerySchema = z.object({
  preset: AnalyticsPresetSchema.default('90d'),
});
export type AnalyticsQuery = z.infer<typeof AnalyticsQuerySchema>;

export interface AnalyticsRange {
  from: string;
  to: string;
}

export interface AnalyticsPeriod {
  preset: AnalyticsPreset;
  current: AnalyticsRange;
  previous: AnalyticsRange;
}

/** Days are counted in Dublin time; `today` is passed in so the rule is testable. Ranges are inclusive. */
export function resolveAnalyticsPeriod(preset: AnalyticsPreset, today: string): AnalyticsPeriod {
  const end = new Date(`${today}T00:00:00Z`);
  const start = new Date(end);
  if (preset === '30d') start.setUTCDate(start.getUTCDate() - 29);
  else if (preset === '90d') start.setUTCDate(start.getUTCDate() - 89);
  else if (preset === '12m') {
    // Day after the same date a year earlier; on 29 February that date is 28 February, so the start is 1 March.
    const yearAgo = new Date(Date.UTC(end.getUTCFullYear() - 1, end.getUTCMonth(), 1));
    const lastDay = new Date(Date.UTC(yearAgo.getUTCFullYear(), yearAgo.getUTCMonth() + 1, 0)).getUTCDate();
    yearAgo.setUTCDate(Math.min(end.getUTCDate(), lastDay) + 1);
    start.setTime(yearAgo.getTime());
  } else start.setUTCMonth(0, 1);
  const days = Math.round((end.getTime() - start.getTime()) / 86_400_000) + 1;
  const prevEnd = new Date(start);
  prevEnd.setUTCDate(prevEnd.getUTCDate() - 1);
  const prevStart = new Date(prevEnd);
  prevStart.setUTCDate(prevStart.getUTCDate() - (days - 1));
  const iso = (d: Date) => d.toISOString().slice(0, 10);
  return {
    preset,
    current: { from: iso(start), to: iso(end) },
    previous: { from: iso(prevStart), to: iso(prevEnd) },
  };
}

export type KpiUnit = 'eur' | 'pct' | 'count' | 'seconds' | 'ms' | 'hours';

export interface AnalyticsKpi {
  key: string;
  label: string;
  unit: KpiUnit;
  /** Null when there is no data for the period. */
  value: number | null;
  /** Same figure for the previous period; null when it cannot be compared (no data, or not a period figure). */
  previous: number | null;
  hint?: string;
}

/** A visible warning about the data behind a chart, shown under it. */
export interface AnalyticsNote {
  chart: string;
  text: string;
}

export interface LabelValue {
  label: string;
  value: number;
}

export interface HeatCell {
  /** 0 = Monday ... 6 = Sunday. */
  weekday: number;
  hour: number;
  value: number;
}

export interface DayValue {
  day: string;
  value: number;
}

export interface FlowLink {
  from: string;
  to: string;
  value: number;
}

interface AnalyticsBase {
  period: AnalyticsPeriod;
  kpis: AnalyticsKpi[];
  notes: AnalyticsNote[];
}

export type AnalyticsMetal = 'GOLD' | 'SILVER' | 'PLATINUM' | 'PALLADIUM';

export interface PricingAnalytics extends AnalyticsBase {
  /** Daily close per metal, EUR/oz. */
  spot: { day: string; GOLD: number | null; SILVER: number | null; PLATINUM: number | null; PALLADIUM: number | null }[];
  /** First and last close of the period per metal, for the slope chart. */
  change: { metal: AnalyticsMetal; start: number; end: number }[];
  /** Each active product's Price premium (spreadSell) by metal and category. */
  premiums: { productId: number; name: string; metal: AnalyticsMetal; category: string | null; premium: number; buyback: number }[];
  /** Average Price premium per metal per day from the daily snapshot; empty until the snapshot has run. */
  premiumHistory: { day: string; metal: AnalyticsMetal; premium: number }[];
  snapshotSince: string | null;
  marketMode: { weekend: boolean; volatile: boolean; shortage: boolean; updatedBy: string | null; updatedAt: string | null };
}

export interface SalesAnalytics extends AnalyticsBase {
  /** Gross profit and margin per month (invoiced trades), split by metal. */
  byMonth: { month: string; goldProfit: number; silverProfit: number; margin: number | null; trades: number }[];
  byBranch: LabelValue[];
  /** Profit per day for the calendar heatmap. */
  byDay: DayValue[];
  topProducts: { product: string; trades: number; qty: number; revenue: number; margin: number | null }[];
  /** When trades are written, Monday to Sunday by hour. */
  tradeHours: HeatCell[];
}

export interface OrdersAnalytics extends AnalyticsBase {
  tradeStates: LabelValue[];
  orderItemStatus: LabelValue[];
  /** Average hours spent going from one recorded step to the next. */
  stepHours: { from: string; to: string; hours: number; orders: number }[];
  /** Orders moving between steps, for the flow chart. */
  flow: FlowLink[];
  /** Open orders by the latest step they reached, with how many days they have been waiting there. */
  waiting: { step: string; orders: { reference: string; days: number }[] }[];
}

export interface InventoryAnalytics extends AnalyticsBase {
  byBranch: { branch: string; gold: number; silver: number }[];
  /** Metal, then product family, by pieces: for the treemap. */
  tree: { metal: string; family: string; qty: number }[];
  low: { branch: string; product: string; qty: number; threshold: number }[];
  movementsByDay: { day: string; in: number; out: number }[];
  movementsSince: string | null;
}

export interface CustomersAnalytics extends AnalyticsBase {
  byMonth: { month: string; total: number; invoices: number }[];
  status: LabelValue[];
  topCustomers: LabelValue[];
  byDay: DayValue[];
  invoicesUntil: string | null;
}

export interface ChatbotAnalytics extends AnalyticsBase {
  byDay: DayValue[];
  outcome: LabelValue[];
  byMode: LabelValue[];
  latencyByMode: LabelValue[];
  hours: HeatCell[];
  feedback: { helpful: number; notHelpful: number; since: string | null };
  /** Procedure questions show their text; reply requests show only their length, since they hold customer messages. */
  recent: { at: string; text: string; status: string; seconds: number }[];
}

export interface OpsAnalytics extends AnalyticsBase {
  /** Failed price-feed fetches, Monday to Sunday by hour (Dublin time). */
  feedFailures: HeatCell[];
  feedByDay: { day: string; ok: number; failed: number }[];
  imports: { at: string; kind: string; file: string; by: string; status: string }[];
  importsByKind: LabelValue[];
}

export const AiFeedbackRequestSchema = z.object({ helpful: z.boolean() });
export type AiFeedbackRequest = z.infer<typeof AiFeedbackRequestSchema>;
