import { describe, expect, it } from "vitest";
import { formatEuro, formatISODate, parseSpanishNumber } from "./format";

describe("parseSpanishNumber", () => {
  it.each([
    ["28000", 28000],
    ["28.000", 28000],
    ["1.234.567", 1234567],
    ["28000,5", 28000.5],
    ["28.000,50", 28000.5],
    ["28000.50", 28000.5],
    [" 30 ", 30],
    ["2,5", 2.5],
  ])("%j → %d", (input, expected) => {
    expect(parseSpanishNumber(input)).toBe(expected);
  });

  it("devuelve NaN si no es un número", () => {
    expect(parseSpanishNumber("")).toBeNaN();
    expect(parseSpanishNumber("abc")).toBeNaN();
  });
});

describe("formato", () => {
  it("euros y fechas en formato español", () => {
    expect(formatEuro(16665.75).replace(/\s/g, " ")).toBe("16.665,75 €");
    expect(formatISODate("2026-09-30")).toBe("30/09/2026");
  });
});
