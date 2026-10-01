/**
 * SOP review cadence (README: "Review every 6 months"). Pure date maths, used
 * by the reader to show when a procedure is next due and by the admin view to
 * list what is overdue. Dates are whole days in UTC, matching how SOPs are
 * dated, so the answer never shifts with the viewer's time zone.
 */
export const KB_REVIEW_MONTHS = 6;
/** How far ahead a review counts as "due soon". */
export const KB_REVIEW_WARNING_DAYS = 30;

export type KbReviewState = 'ok' | 'due-soon' | 'overdue';

export interface KbReviewStatus {
  /** YYYY-MM-DD the next review is due. */
  dueOn: string;
  state: KbReviewState;
  /** Negative once overdue. */
  daysUntilDue: number;
}

const DAY_MS = 24 * 60 * 60 * 1000;

function parseDay(day: string): Date {
  return new Date(`${day}T00:00:00.000Z`);
}

/** The date six months on, clamped to the month's end (31 Aug → 28 Feb, never "3 Mar"). */
export function kbReviewDueOn(contentUpdatedOn: string, months: number = KB_REVIEW_MONTHS): string {
  const start = parseDay(contentUpdatedOn);
  const year = start.getUTCFullYear();
  const month = start.getUTCMonth() + months;
  const lastDayOfTarget = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const due = new Date(Date.UTC(year, month, Math.min(start.getUTCDate(), lastDayOfTarget)));
  return due.toISOString().slice(0, 10);
}

export function kbReviewStatus(contentUpdatedOn: string, now: Date = new Date()): KbReviewStatus {
  const dueOn = kbReviewDueOn(contentUpdatedOn);
  const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  const daysUntilDue = Math.round((parseDay(dueOn).getTime() - today) / DAY_MS);

  return {
    dueOn,
    daysUntilDue,
    state: daysUntilDue < 0 ? 'overdue' : daysUntilDue <= KB_REVIEW_WARNING_DAYS ? 'due-soon' : 'ok',
  };
}
