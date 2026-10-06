const euroWhole = new Intl.NumberFormat("en-IE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
const euroCents = new Intl.NumberFormat("en-IE", { style: "currency", currency: "EUR", minimumFractionDigits: 2, maximumFractionDigits: 2 });

/** An offered price: whole euro (GLOSSARY.md, Sell price). */
export const formatEuro = (value: number) => euroWhole.format(value);

/** A reference figure such as price per gram: cent precision, never rounded to the euro (Unit price). */
export const formatEuroCents = (value: number) => euroCents.format(value);

const trim = (n: number) => String(Number(n.toFixed(2)));

export function formatWeight(grams: number): string {
  return grams >= 1000 ? `${trim(grams / 1000)} kg` : `${trim(grams)} g`;
}

export function formatSignedPercent(value: number): string {
  const sign = value > 0 ? "+" : value < 0 ? "-" : "";
  return `${sign}${Math.abs(value).toFixed(2)}%`;
}

const dublinParts = new Intl.DateTimeFormat("en-IE", {
  timeZone: "Europe/Dublin",
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

/** dd/mm/yyyy hh:mm in Irish time, the format of the market-closed warning. */
export function formatDublinDateTime(date: Date): string {
  const part = (type: Intl.DateTimeFormatPartTypes) => dublinParts.formatToParts(date).find((p) => p.type === type)?.value ?? "";
  return `${part("day")}/${part("month")}/${part("year")} ${part("hour")}:${part("minute")}`;
}
