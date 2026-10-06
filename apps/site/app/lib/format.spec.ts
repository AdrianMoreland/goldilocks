import { describe, expect, it } from "vitest";

import { formatDublinDateTime, formatEuro, formatEuroCents, formatSignedPercent, formatWeight } from "./format";

describe("formatDublinDateTime", () => {
  it("shows Irish winter time as UTC", () => {
    expect(formatDublinDateTime(new Date("2026-01-12T08:45:00Z"))).toBe("12/01/2026 08:45");
  });

  it("shows Irish summer time as UTC+1", () => {
    expect(formatDublinDateTime(new Date("2026-10-12T07:45:00Z"))).toBe("12/10/2026 08:45");
  });

  it("uses midnight as 00:00, not 24:00", () => {
    expect(formatDublinDateTime(new Date("2026-01-12T00:00:00Z"))).toBe("12/01/2026 00:00");
  });
});

describe("prices", () => {
  it("shows an offered price in whole euro and a unit price with cents", () => {
    expect(formatEuro(3849)).toBe("€3,849");
    expect(formatEuroCents(123.7557)).toBe("€123.76");
  });
});

describe("formatWeight", () => {
  it("shows grams below a kilo and kilos from a kilo", () => {
    expect(formatWeight(31.1035)).toBe("31.1 g");
    expect(formatWeight(10)).toBe("10 g");
    expect(formatWeight(1000)).toBe("1 kg");
    expect(formatWeight(2500)).toBe("2.5 kg");
  });
});

describe("formatSignedPercent", () => {
  it("always signs a move and leaves zero unsigned", () => {
    expect(formatSignedPercent(0.5)).toBe("+0.50%");
    expect(formatSignedPercent(-1.234)).toBe("-1.23%");
    expect(formatSignedPercent(0)).toBe("0.00%");
  });
});
