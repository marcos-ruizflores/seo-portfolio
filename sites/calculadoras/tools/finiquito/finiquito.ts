import {
  addDays,
  addMonths,
  compareDates,
  daysInclusive,
  daysInYear,
  isLastDayOfMonth,
  maxDate,
  minDate,
  parseISODate,
  type CalendarDate,
} from "@seo/core/lib/dates";

/*
 * Cálculo orientativo de finiquito e indemnización (España, normativa vigente a 2026).
 * Todos los importes son brutos. Supuestos generales (el convenio puede mejorarlos):
 * - Mes comercial de 30 días para salario y vacaciones: salario diario = mensual / 30.
 * - Salario diario de la indemnización = salario bruto anual (con pagas) / 365.
 * - Con 14 pagas, cada paga extra equivale a una mensualidad ordinaria (anual / 14).
 */

export type TipoExtincion =
  | "baja-voluntaria"
  | "fin-contrato-temporal"
  | "despido-objetivo"
  | "despido-improcedente"
  | "despido-disciplinario";

export type DevengoPagas = "anual" | "semestral";

export type FiniquitoInput = {
  tipo: TipoExtincion;
  /** AAAA-MM-DD: inicio de la relación laboral (antigüedad). */
  fechaInicio: string;
  /** AAAA-MM-DD: último día trabajado (fecha de efectos). */
  fechaFin: string;
  salarioBrutoAnual: number;
  numeroPagas: 12 | 14;
  devengoPagas: DevengoPagas;
  /** Vacaciones anuales en días naturales (mínimo legal: 30, art. 38 ET). */
  diasVacacionesAnuales: number;
  /** Días naturales de vacaciones ya disfrutados en el año de la baja. */
  diasVacacionesDisfrutadas: number;
  nominaDelMesCobrada: boolean;
  /** Días de preaviso no respetados (por el trabajador o por la empresa, según el tipo). */
  diasPreavisoIncumplidos: number;
};

export type ConceptoId =
  "salario-pendiente" | "vacaciones" | "paga-verano" | "paga-navidad" | "preaviso";

export type Concepto = {
  id: ConceptoId;
  importe: number;
  /** Días (o fracción) sobre los que se calcula. */
  dias: number;
  /** Importe por día, o importe completo de la paga en las pagas extra. */
  base: number;
  /** Para pagas extra: días devengados sobre días del periodo. */
  periodo?: { devengados: number; total: number };
};

export type TramoIndemnizacion = {
  desde: string;
  hasta: string;
  meses: number;
  diasPorAnio: number;
  dias: number;
};

export type Indemnizacion = {
  importe: number;
  dias: number;
  salarioDiario: number;
  tramos: TramoIndemnizacion[];
  /** Días máximos que permite la ley, o null si no hay tope. */
  topeDias: number | null;
  topeAplicado: boolean;
};

export type FiniquitoResult =
  | {
      ok: true;
      conceptos: Concepto[];
      totalFiniquito: number;
      indemnizacion: Indemnizacion | null;
      total: number;
    }
  | { ok: false; errores: string[] };

/** Fecha de entrada en vigor de la reforma laboral de 2012 (RDL 3/2012). */
export const REFORMA_2012: CalendarDate = { year: 2012, month: 2, day: 12 };

export function round2(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

/**
 * Meses de servicio entre dos fechas (ambas incluidas), contando cualquier
 * fracción de mes como mes completo (doctrina del Tribunal Supremo sobre el
 * prorrateo "por meses" de los arts. 53 y 56 ET).
 */
export function mesesDeServicio(desde: CalendarDate, hasta: CalendarDate): number {
  if (compareDates(hasta, desde) < 0) return 0;
  const limite = addDays(hasta, 1);
  let meses = (limite.year - desde.year) * 12 + (limite.month - desde.month);
  while (meses > 0 && compareDates(addMonths(desde, meses), limite) > 0) meses--;
  while (compareDates(addMonths(desde, meses + 1), limite) <= 0) meses++;
  const hayFraccion = compareDates(addMonths(desde, meses), limite) < 0;
  return meses + (hayFraccion ? 1 : 0);
}

function tramo(desde: CalendarDate, hasta: CalendarDate, diasPorAnio: number): TramoIndemnizacion {
  const meses = mesesDeServicio(desde, hasta);
  const fmt = (d: CalendarDate) =>
    `${d.year}-${String(d.month).padStart(2, "0")}-${String(d.day).padStart(2, "0")}`;
  return {
    desde: fmt(desde),
    hasta: fmt(hasta),
    meses,
    diasPorAnio,
    dias: (meses * diasPorAnio) / 12,
  };
}

export function calcularIndemnizacion(
  tipo: TipoExtincion,
  inicio: CalendarDate,
  fin: CalendarDate,
  salarioBrutoAnual: number,
): Indemnizacion | null {
  const salarioDiario = salarioBrutoAnual / 365;
  let tramos: TramoIndemnizacion[];
  let topeDias: number | null;

  switch (tipo) {
    case "baja-voluntaria":
    case "despido-disciplinario":
      return null;
    case "fin-contrato-temporal":
      // Art. 49.1.c ET: 12 días por año de servicio.
      tramos = [tramo(inicio, fin, 12)];
      topeDias = null;
      break;
    case "despido-objetivo":
      // Art. 53.1.b ET: 20 días por año, máximo 12 mensualidades.
      tramos = [tramo(inicio, fin, 20)];
      topeDias = 360;
      break;
    case "despido-improcedente": {
      // Art. 56.1 ET: 33 días por año, máximo 24 mensualidades (720 días).
      // DT 11.ª ET: contratos anteriores al 12/02/2012 → 45 días por año hasta
      // esa fecha y 33 después; tope de 720 días salvo que el primer tramo ya
      // lo supere, con un máximo absoluto de 42 mensualidades (1260 días).
      if (compareDates(inicio, REFORMA_2012) >= 0) {
        tramos = [tramo(inicio, fin, 33)];
        topeDias = 720;
        break;
      }
      const finPrimerTramo = minDate(fin, addDays(REFORMA_2012, -1));
      const primero = tramo(inicio, finPrimerTramo, 45);
      tramos = [primero];
      if (compareDates(fin, REFORMA_2012) >= 0) tramos.push(tramo(REFORMA_2012, fin, 33));
      topeDias = primero.dias > 720 ? Math.min(primero.dias, 1260) : 720;
      break;
    }
  }

  const diasSinTope = tramos.reduce((sum, t) => sum + t.dias, 0);
  const topeAplicado = topeDias !== null && diasSinTope > topeDias;
  const dias = topeAplicado ? topeDias! : diasSinTope;

  return {
    importe: round2(dias * salarioDiario),
    dias,
    salarioDiario,
    tramos,
    topeDias,
    topeAplicado,
  };
}

function periodoPaga(
  paga: "verano" | "navidad",
  devengo: DevengoPagas,
  fin: CalendarDate,
): { desde: CalendarDate; hasta: CalendarDate } | null {
  const y = fin.year;
  const antesDeJulio = fin.month <= 6;
  if (devengo === "anual") {
    if (paga === "navidad")
      return { desde: { year: y, month: 1, day: 1 }, hasta: { year: y, month: 12, day: 31 } };
    return antesDeJulio
      ? { desde: { year: y - 1, month: 7, day: 1 }, hasta: { year: y, month: 6, day: 30 } }
      : { desde: { year: y, month: 7, day: 1 }, hasta: { year: y + 1, month: 6, day: 30 } };
  }
  // Semestral: verano se devenga de enero a junio y Navidad de julio a diciembre.
  // La paga del semestre ya terminado se da por cobrada.
  if (paga === "verano") {
    return antesDeJulio
      ? { desde: { year: y, month: 1, day: 1 }, hasta: { year: y, month: 6, day: 30 } }
      : null;
  }
  return antesDeJulio
    ? null
    : { desde: { year: y, month: 7, day: 1 }, hasta: { year: y, month: 12, day: 31 } };
}

export function validar(input: FiniquitoInput): string[] {
  const errores: string[] = [];
  const inicio = parseISODate(input.fechaInicio);
  const fin = parseISODate(input.fechaFin);
  if (!inicio) errores.push("Indica una fecha de inicio válida.");
  if (!fin) errores.push("Indica una fecha de fin válida.");
  if (inicio && fin && compareDates(fin, inicio) < 0) {
    errores.push("La fecha de fin no puede ser anterior a la de inicio.");
  }
  if (!Number.isFinite(input.salarioBrutoAnual) || input.salarioBrutoAnual <= 0) {
    errores.push("Indica tu salario bruto anual.");
  } else if (input.salarioBrutoAnual > 10_000_000) {
    errores.push("El salario bruto anual parece demasiado alto. Revísalo.");
  }
  if (
    !Number.isFinite(input.diasVacacionesAnuales) ||
    input.diasVacacionesAnuales < 0 ||
    input.diasVacacionesAnuales > 60
  ) {
    errores.push("Los días de vacaciones al año deben estar entre 0 y 60.");
  }
  if (
    !Number.isFinite(input.diasVacacionesDisfrutadas) ||
    input.diasVacacionesDisfrutadas < 0 ||
    input.diasVacacionesDisfrutadas > 60
  ) {
    errores.push("Los días de vacaciones disfrutados deben estar entre 0 y 60.");
  }
  if (
    !Number.isInteger(input.diasPreavisoIncumplidos) ||
    input.diasPreavisoIncumplidos < 0 ||
    input.diasPreavisoIncumplidos > 90
  ) {
    errores.push("Los días de preaviso deben ser un número entero entre 0 y 90.");
  }
  return errores;
}

export function calcularFiniquito(input: FiniquitoInput): FiniquitoResult {
  const errores = validar(input);
  if (errores.length > 0) return { ok: false, errores };

  const inicio = parseISODate(input.fechaInicio)!;
  const fin = parseISODate(input.fechaFin)!;
  const salarioMensual = input.salarioBrutoAnual / input.numeroPagas;
  const salarioDiario = salarioMensual / 30;
  const conceptos: Concepto[] = [];

  // 1. Salario de los días trabajados en el último mes (mes comercial de 30 días).
  if (!input.nominaDelMesCobrada) {
    const inicioMes: CalendarDate = { year: fin.year, month: fin.month, day: 1 };
    const desde = maxDate(inicio, inicioMes);
    const mesCompleto = isLastDayOfMonth(fin) && desde.day === 1;
    const dias = mesCompleto ? 30 : Math.min(30, daysInclusive(desde, fin));
    conceptos.push({
      id: "salario-pendiente",
      dias,
      base: salarioDiario,
      importe: round2(dias * salarioDiario),
    });
  }

  // 2. Vacaciones devengadas y no disfrutadas en el año natural (art. 38 ET).
  const inicioAnio: CalendarDate = { year: fin.year, month: 1, day: 1 };
  const diasTrabajadosAnio = daysInclusive(maxDate(inicio, inicioAnio), fin);
  const vacacionesDevengadas =
    (input.diasVacacionesAnuales * diasTrabajadosAnio) / daysInYear(fin.year);
  const vacacionesPendientes = vacacionesDevengadas - input.diasVacacionesDisfrutadas;
  if (vacacionesPendientes !== 0) {
    conceptos.push({
      id: "vacaciones",
      dias: vacacionesPendientes,
      base: salarioDiario,
      importe: round2(vacacionesPendientes * salarioDiario),
    });
  }

  // 3. Parte proporcional de pagas extra no prorrateadas (art. 31 ET).
  if (input.numeroPagas === 14) {
    const paga = input.salarioBrutoAnual / 14;
    for (const nombre of ["verano", "navidad"] as const) {
      const periodo = periodoPaga(nombre, input.devengoPagas, fin);
      if (!periodo) continue;
      const devengados = daysInclusive(maxDate(inicio, periodo.desde), fin);
      const total = daysInclusive(periodo.desde, periodo.hasta);
      if (devengados === 0) continue;
      conceptos.push({
        id: nombre === "verano" ? "paga-verano" : "paga-navidad",
        dias: devengados,
        base: paga,
        periodo: { devengados, total },
        importe: round2((paga * devengados) / total),
      });
    }
  }

  // 4. Preaviso: lo descuenta la empresa si el trabajador no avisó (baja voluntaria)
  // o lo abona si ella no concedió los 15 días (despido objetivo, art. 53.1.c;
  // fin de contrato temporal de más de un año, art. 49.1.c).
  if (input.diasPreavisoIncumplidos > 0) {
    const signo =
      input.tipo === "baja-voluntaria"
        ? -1
        : input.tipo === "despido-objetivo" || input.tipo === "fin-contrato-temporal"
          ? 1
          : 0;
    if (signo !== 0) {
      conceptos.push({
        id: "preaviso",
        dias: input.diasPreavisoIncumplidos,
        base: salarioDiario,
        importe: round2(signo * input.diasPreavisoIncumplidos * salarioDiario),
      });
    }
  }

  const totalFiniquito = round2(conceptos.reduce((sum, c) => sum + c.importe, 0));
  const indemnizacion = calcularIndemnizacion(input.tipo, inicio, fin, input.salarioBrutoAnual);

  return {
    ok: true,
    conceptos,
    totalFiniquito,
    indemnizacion,
    total: round2(totalFiniquito + (indemnizacion?.importe ?? 0)),
  };
}
