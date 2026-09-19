import { describe, expect, it } from "vitest";
import {
  addDays,
  addMonths,
  daysInclusive,
  daysInYear,
  isLastDayOfMonth,
  parseISODate,
  toISODate,
} from "./dates";

const d = (iso: string) => parseISODate(iso)!;

describe("parseISODate", () => {
  it("acepta fechas reales y rechaza el resto", () => {
    expect(parseISODate("2024-02-29")).toEqual({ year: 2024, month: 2, day: 29 });
    expect(parseISODate("2026-02-29")).toBeNull();
    expect(parseISODate("2026-13-01")).toBeNull();
    expect(parseISODate("2026-1-01")).toBeNull();
    expect(parseISODate("")).toBeNull();
  });
});

describe("aritmética de fechas", () => {
  it("cuenta días incluyendo ambos extremos", () => {
    expect(daysInclusive(d("2026-01-01"), d("2026-01-01"))).toBe(1);
    expect(daysInclusive(d("2026-01-01"), d("2026-09-30"))).toBe(273);
    expect(daysInclusive(d("2026-01-02"), d("2026-01-01"))).toBe(0);
  });

  it("no se desplaza con el cambio de hora", () => {
    expect(daysInclusive(d("2026-03-28"), d("2026-03-30"))).toBe(3);
    expect(toISODate(addDays(d("2026-10-24"), 2))).toBe("2026-10-26");
  });

  it("suma meses ajustando a fin de mes", () => {
    expect(toISODate(addMonths(d("2026-01-31"), 1))).toBe("2026-02-28");
    expect(toISODate(addMonths(d("2024-01-31"), 1))).toBe("2024-02-29");
    expect(toISODate(addMonths(d("2025-11-15"), 3))).toBe("2026-02-15");
  });

  it("años bisiestos y fin de mes", () => {
    expect(daysInYear(2028)).toBe(366);
    expect(daysInYear(2100)).toBe(365);
    expect(isLastDayOfMonth(d("2026-02-28"))).toBe(true);
    expect(isLastDayOfMonth(d("2024-02-28"))).toBe(false);
  });
});
