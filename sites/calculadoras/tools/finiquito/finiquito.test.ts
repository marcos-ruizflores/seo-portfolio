import { parseISODate } from "@seo/core/lib/dates";
import { describe, expect, it } from "vitest";
import {
  calcularFiniquito,
  calcularIndemnizacion,
  mesesDeServicio,
  type FiniquitoInput,
} from "./finiquito";

const d = (iso: string) => parseISODate(iso)!;

function input(overrides: Partial<FiniquitoInput> = {}): FiniquitoInput {
  return {
    tipo: "despido-improcedente",
    fechaInicio: "2020-03-15",
    fechaFin: "2026-09-30",
    salarioBrutoAnual: 28_000,
    numeroPagas: 14,
    devengoPagas: "anual",
    diasVacacionesAnuales: 30,
    diasVacacionesDisfrutadas: 15,
    nominaDelMesCobrada: false,
    diasPreavisoIncumplidos: 0,
    ...overrides,
  };
}

function importe(result: ReturnType<typeof calcularFiniquito>, id: string) {
  if (!result.ok) throw new Error(result.errores.join(", "));
  return result.conceptos.find((c) => c.id === id)?.importe;
}

describe("mesesDeServicio (fracción de mes = mes completo)", () => {
  it.each([
    ["2025-01-01", "2025-12-31", 12], // año exacto
    ["2025-01-01", "2026-01-01", 13], // 1 año y 1 día → 13 meses
    ["2025-01-10", "2026-02-11", 14], // 1 año, 1 mes y 2 días → 1 año y 2 meses (ejemplo del TS)
    ["2026-09-01", "2026-09-01", 1], // un solo día
    ["2020-03-15", "2026-09-30", 79], // 78 meses completos + 16 días
    ["2023-01-01", "2026-01-31", 37], // 37 meses exactos
  ])("%s → %s = %i meses", (desde, hasta, meses) => {
    expect(mesesDeServicio(d(desde), d(hasta))).toBe(meses);
  });
});

describe("indemnización", () => {
  it("improcedente posterior a 2012: 33 días/año", () => {
    // 79 meses × 33/12 = 217,25 días × (28.000 / 365) = 16.665,75 €
    const r = calcularIndemnizacion(
      "despido-improcedente",
      d("2020-03-15"),
      d("2026-09-30"),
      28_000,
    )!;
    expect(r.dias).toBeCloseTo(217.25, 10);
    expect(r.importe).toBe(16_665.75);
    expect(r.topeAplicado).toBe(false);
  });

  it("improcedente anterior a 2012: dos tramos y tope de 720 días", () => {
    // Tramo 1: 2005-01-10 → 2012-02-11 = 86 meses × 45/12 = 322,5 días
    // Tramo 2: 2012-02-12 → 2026-06-30 = 173 meses × 33/12 = 475,75 días
    // Total 798,25 > 720 y el tramo 1 no llega a 720 → tope 720 × 100 €/día
    const r = calcularIndemnizacion(
      "despido-improcedente",
      d("2005-01-10"),
      d("2026-06-30"),
      36_500,
    )!;
    expect(r.tramos.map((t) => [t.meses, t.dias])).toEqual([
      [86, 322.5],
      [173, 475.75],
    ]);
    expect(r.topeDias).toBe(720);
    expect(r.topeAplicado).toBe(true);
    expect(r.importe).toBe(72_000);
  });

  it("improcedente anterior a 2012 con primer tramo > 720 días: ese tramo es el tope", () => {
    // Tramo 1: 1990-01-01 → 2012-02-11 = 266 meses × 3,75 = 997,5 días (> 720, < 1260)
    const r = calcularIndemnizacion(
      "despido-improcedente",
      d("1990-01-01"),
      d("2026-06-30"),
      36_500,
    )!;
    expect(r.tramos[0]!.dias).toBe(997.5);
    expect(r.topeDias).toBe(997.5);
    expect(r.importe).toBe(99_750);
  });

  it("improcedente: el tope nunca supera 42 mensualidades (1260 días)", () => {
    // Tramo 1: 1970-01-01 → 2012-02-11 = 506 meses × 3,75 = 1897,5 días → tope 1260
    const r = calcularIndemnizacion(
      "despido-improcedente",
      d("1970-01-01"),
      d("2026-06-30"),
      36_500,
    )!;
    expect(r.topeDias).toBe(1260);
    expect(r.importe).toBe(126_000);
  });

  it("objetivo: 20 días/año", () => {
    // 37 meses × 20/12 = 61,666… días × (30.000 / 365) = 5.068,49 €
    const r = calcularIndemnizacion("despido-objetivo", d("2023-01-01"), d("2026-01-31"), 30_000)!;
    expect(r.importe).toBe(5_068.49);
  });

  it("objetivo: tope de 12 mensualidades (360 días)", () => {
    const r = calcularIndemnizacion("despido-objetivo", d("2000-01-01"), d("2026-06-30"), 36_500)!;
    expect(r.topeAplicado).toBe(true);
    expect(r.importe).toBe(36_000);
  });

  it("fin de contrato temporal: 12 días/año sin tope", () => {
    // 2025-10-01 → 2026-09-30 = 12 meses × 12/12 = 12 días × 100 €/día
    const r = calcularIndemnizacion(
      "fin-contrato-temporal",
      d("2025-10-01"),
      d("2026-09-30"),
      36_500,
    )!;
    expect(r.importe).toBe(1_200);
  });

  it("baja voluntaria y despido disciplinario no tienen indemnización", () => {
    expect(
      calcularIndemnizacion("baja-voluntaria", d("2020-01-01"), d("2026-01-01"), 30_000),
    ).toBeNull();
    expect(
      calcularIndemnizacion("despido-disciplinario", d("2020-01-01"), d("2026-01-01"), 30_000),
    ).toBeNull();
  });
});

describe("finiquito", () => {
  it("caso completo: 14 pagas con devengo anual", () => {
    // Salario mensual 28.000 / 14 = 2.000 €; diario 2.000 / 30 = 66,67 €
    const r = calcularFiniquito(input());
    // Salario de septiembre: mes completo = 30 días × 66,666… = 2.000 €
    expect(importe(r, "salario-pendiente")).toBe(2_000);
    // Vacaciones: 30 × 273/365 = 22,438 devengadas − 15 = 7,438 días × 66,666… = 495,89 €
    expect(importe(r, "vacaciones")).toBe(495.89);
    // Navidad (1 ene–31 dic): 2.000 × 273/365 = 1.495,89 €
    expect(importe(r, "paga-navidad")).toBe(1_495.89);
    // Verano (1 jul 2026–30 jun 2027): 2.000 × 92/365 = 504,11 €
    expect(importe(r, "paga-verano")).toBe(504.11);
    if (!r.ok) return;
    expect(r.totalFiniquito).toBe(4_495.89);
    expect(r.indemnizacion?.importe).toBe(16_665.75);
    expect(r.total).toBe(21_161.64);
  });

  it("devengo semestral: solo la paga del semestre en curso", () => {
    // Navidad (1 jul–31 dic, 184 días): 2.000 × 92/184 = 1.000 €; verano ya cobrada
    const r = calcularFiniquito(input({ devengoPagas: "semestral" }));
    expect(importe(r, "paga-navidad")).toBe(1_000);
    expect(importe(r, "paga-verano")).toBeUndefined();
  });

  it("baja voluntaria, 12 pagas prorrateadas y preaviso incumplido", () => {
    // Mensual 24.000 / 12 = 2.000 €; diario 66,666…
    const r = calcularFiniquito(
      input({
        tipo: "baja-voluntaria",
        fechaInicio: "2025-06-01",
        fechaFin: "2026-02-10",
        salarioBrutoAnual: 24_000,
        numeroPagas: 12,
        diasVacacionesDisfrutadas: 0,
        diasPreavisoIncumplidos: 5,
      }),
    );
    expect(importe(r, "salario-pendiente")).toBe(666.67); // 10 días
    expect(importe(r, "vacaciones")).toBe(224.66); // 30 × 41/365 = 3,37 días
    expect(importe(r, "paga-navidad")).toBeUndefined(); // prorrateadas
    expect(importe(r, "preaviso")).toBe(-333.33); // 5 días descontados
    if (!r.ok) return;
    expect(r.totalFiniquito).toBe(558);
    expect(r.indemnizacion).toBeNull();
  });

  it("empezar a mitad del último mes cuenta solo esos días", () => {
    const r = calcularFiniquito(input({ fechaInicio: "2026-09-16", fechaFin: "2026-09-30" }));
    expect(importe(r, "salario-pendiente")).toBe(1_000); // 15 días × 66,666…
  });

  it("febrero completo cuenta como 30 días", () => {
    const r = calcularFiniquito(input({ fechaFin: "2026-02-28" }));
    expect(importe(r, "salario-pendiente")).toBe(2_000);
  });

  it("vacaciones disfrutadas de más se descuentan", () => {
    // 30 × 31/365 = 2,548 devengadas − 10 = −7,452 días × 66,666… = −496,80 €
    const r = calcularFiniquito(input({ fechaFin: "2026-01-31", diasVacacionesDisfrutadas: 10 }));
    expect(importe(r, "vacaciones")).toBe(-496.8);
  });

  it("no incluye la nómina si ya se cobró", () => {
    expect(
      importe(calcularFiniquito(input({ nominaDelMesCobrada: true })), "salario-pendiente"),
    ).toBeUndefined();
  });

  it("valida las entradas", () => {
    const r = calcularFiniquito(
      input({
        fechaInicio: "2026-10-01",
        fechaFin: "2026-09-30",
        salarioBrutoAnual: 0,
        diasPreavisoIncumplidos: 1.5,
      }),
    );
    expect(r.ok).toBe(false);
    if (r.ok) return;
    expect(r.errores).toHaveLength(3);
  });
});
