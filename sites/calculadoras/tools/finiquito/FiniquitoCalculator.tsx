"use client";

import { buttonClass, fieldClass, labelClass } from "@seo/core/components/ui/button";
import {
  formatEuro,
  formatISODate,
  formatNumber,
  parseSpanishNumber as parseNumero,
} from "@seo/core/lib/format";
import { useId, useState, type FormEvent, type ReactNode } from "react";
import {
  calcularFiniquito,
  type Concepto,
  type DevengoPagas,
  type FiniquitoInput,
  type FiniquitoResult,
  type Indemnizacion,
  type TipoExtincion,
} from "./finiquito";

const TIPOS: { value: TipoExtincion; label: string }[] = [
  { value: "baja-voluntaria", label: "Baja voluntaria (dimisión)" },
  { value: "fin-contrato-temporal", label: "Fin de contrato temporal" },
  { value: "despido-objetivo", label: "Despido objetivo o ERE" },
  { value: "despido-improcedente", label: "Despido improcedente" },
  { value: "despido-disciplinario", label: "Despido disciplinario procedente" },
];

type FormState = {
  tipo: TipoExtincion;
  fechaInicio: string;
  fechaFin: string;
  salarioBrutoAnual: string;
  numeroPagas: "12" | "14";
  devengoPagas: DevengoPagas;
  diasVacacionesAnuales: string;
  diasVacacionesDisfrutadas: string;
  nominaDelMesCobrada: boolean;
  diasPreavisoIncumplidos: string;
};

const INICIAL: FormState = {
  tipo: "despido-improcedente",
  fechaInicio: "",
  fechaFin: "",
  salarioBrutoAnual: "",
  numeroPagas: "14",
  devengoPagas: "anual",
  diasVacacionesAnuales: "30",
  diasVacacionesDisfrutadas: "0",
  nominaDelMesCobrada: false,
  diasPreavisoIncumplidos: "0",
};

const EJEMPLO: FormState = {
  ...INICIAL,
  fechaInicio: "2020-03-15",
  fechaFin: "2026-09-30",
  salarioBrutoAnual: "28000",
  diasVacacionesDisfrutadas: "15",
};

function toInput(form: FormState): FiniquitoInput {
  return {
    tipo: form.tipo,
    fechaInicio: form.fechaInicio,
    fechaFin: form.fechaFin,
    salarioBrutoAnual: parseNumero(form.salarioBrutoAnual),
    numeroPagas: form.numeroPagas === "12" ? 12 : 14,
    devengoPagas: form.devengoPagas,
    diasVacacionesAnuales: parseNumero(form.diasVacacionesAnuales),
    diasVacacionesDisfrutadas: parseNumero(form.diasVacacionesDisfrutadas),
    nominaDelMesCobrada: form.nominaDelMesCobrada,
    diasPreavisoIncumplidos: parseNumero(form.diasPreavisoIncumplidos),
  };
}

function preavisoLabel(tipo: TipoExtincion): string | null {
  if (tipo === "baja-voluntaria") return "Días de preaviso que no diste";
  if (tipo === "despido-objetivo" || tipo === "fin-contrato-temporal") {
    return "Días de preaviso que la empresa no te dio";
  }
  return null;
}

function Field({
  id,
  label,
  hint,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      {children}
      {hint && (
        <p id={`${id}-hint`} className="text-xs text-muted">
          {hint}
        </p>
      )}
    </div>
  );
}

export function FiniquitoCalculator() {
  const id = useId();
  const [form, setForm] = useState<FormState>(INICIAL);
  const [result, setResult] = useState<FiniquitoResult | null>(null);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    setResult(calcularFiniquito(toInput(form)));
  }

  const preaviso = preavisoLabel(form.tipo);

  return (
    <div className="space-y-6">
      <form
        onSubmit={onSubmit}
        noValidate
        className="space-y-5 rounded-lg border border-border bg-surface p-4 sm:p-5"
      >
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm text-muted">Todos los importes en bruto.</p>
          <button
            type="button"
            className="text-sm text-brand hover:underline"
            onClick={() => {
              setForm(EJEMPLO);
              setResult(null);
            }}
          >
            Cargar ejemplo
          </button>
        </div>

        <Field id={`${id}-tipo`} label="Motivo del fin de la relación laboral">
          <select
            id={`${id}-tipo`}
            value={form.tipo}
            onChange={(e) => set("tipo", e.target.value as TipoExtincion)}
            className={fieldClass}
          >
            {TIPOS.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field id={`${id}-inicio`} label="Fecha de inicio" hint="Tu antigüedad en la empresa.">
            <input
              id={`${id}-inicio`}
              type="date"
              value={form.fechaInicio}
              onChange={(e) => set("fechaInicio", e.target.value)}
              className={fieldClass}
              aria-describedby={`${id}-inicio-hint`}
              required
            />
          </Field>
          <Field id={`${id}-fin`} label="Fecha de fin" hint="Último día trabajado.">
            <input
              id={`${id}-fin`}
              type="date"
              value={form.fechaFin}
              onChange={(e) => set("fechaFin", e.target.value)}
              className={fieldClass}
              aria-describedby={`${id}-fin-hint`}
              required
            />
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            id={`${id}-salario`}
            label="Salario bruto anual (€)"
            hint="Incluye las pagas extra. Lo encontrarás en tu contrato o nómina."
          >
            <input
              id={`${id}-salario`}
              type="text"
              inputMode="decimal"
              autoComplete="off"
              placeholder="28000"
              value={form.salarioBrutoAnual}
              onChange={(e) => set("salarioBrutoAnual", e.target.value)}
              className={fieldClass}
              aria-describedby={`${id}-salario-hint`}
              required
            />
          </Field>
          <Field id={`${id}-pagas`} label="Número de pagas">
            <select
              id={`${id}-pagas`}
              value={form.numeroPagas}
              onChange={(e) => set("numeroPagas", e.target.value as FormState["numeroPagas"])}
              className={fieldClass}
            >
              <option value="14">14 pagas (2 pagas extra aparte)</option>
              <option value="12">12 pagas (pagas extra prorrateadas)</option>
            </select>
          </Field>
        </div>

        {form.numeroPagas === "14" && (
          <Field
            id={`${id}-devengo`}
            label="Devengo de las pagas extra"
            hint="Lo fija tu convenio. Si no dice nada, se aplica el anual."
          >
            <select
              id={`${id}-devengo`}
              value={form.devengoPagas}
              onChange={(e) => set("devengoPagas", e.target.value as DevengoPagas)}
              className={fieldClass}
              aria-describedby={`${id}-devengo-hint`}
            >
              <option value="anual">Anual (lo más habitual)</option>
              <option value="semestral">Semestral</option>
            </select>
          </Field>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            id={`${id}-vac-anuales`}
            label="Días de vacaciones al año"
            hint="Días naturales. El mínimo legal es 30."
          >
            <input
              id={`${id}-vac-anuales`}
              type="text"
              inputMode="decimal"
              value={form.diasVacacionesAnuales}
              onChange={(e) => set("diasVacacionesAnuales", e.target.value)}
              className={fieldClass}
              aria-describedby={`${id}-vac-anuales-hint`}
            />
          </Field>
          <Field
            id={`${id}-vac-disfrutadas`}
            label="Vacaciones ya disfrutadas este año"
            hint="Días naturales."
          >
            <input
              id={`${id}-vac-disfrutadas`}
              type="text"
              inputMode="decimal"
              value={form.diasVacacionesDisfrutadas}
              onChange={(e) => set("diasVacacionesDisfrutadas", e.target.value)}
              className={fieldClass}
              aria-describedby={`${id}-vac-disfrutadas-hint`}
            />
          </Field>
        </div>

        {preaviso && (
          <Field
            id={`${id}-preaviso`}
            label={preaviso}
            hint={
              form.tipo === "baja-voluntaria"
                ? "Si no avisaste con la antelación de tu convenio (a menudo 15 días), la empresa puede descontarlos."
                : "La empresa debe avisar con 15 días (en contratos temporales, si duraron más de un año). Si no lo hizo, te los debe pagar."
            }
          >
            <input
              id={`${id}-preaviso`}
              type="text"
              inputMode="numeric"
              value={form.diasPreavisoIncumplidos}
              onChange={(e) => set("diasPreavisoIncumplidos", e.target.value)}
              className={fieldClass}
              aria-describedby={`${id}-preaviso-hint`}
            />
          </Field>
        )}

        <label className="flex items-start gap-3 text-sm">
          <input
            type="checkbox"
            checked={form.nominaDelMesCobrada}
            onChange={(e) => set("nominaDelMesCobrada", e.target.checked)}
            className="mt-0.5 size-4 accent-(--brand)"
          />
          <span>Ya he cobrado la nómina del último mes</span>
        </label>

        <button type="submit" className={`${buttonClass("primary")} w-full sm:w-auto`}>
          Calcular finiquito
        </button>
      </form>

      <div aria-live="polite">{result && <Resultado result={result} />}</div>
    </div>
  );
}

const CONCEPTO_LABEL: Record<Concepto["id"], string> = {
  "salario-pendiente": "Salario de los días trabajados del último mes",
  vacaciones: "Vacaciones no disfrutadas",
  "paga-verano": "Parte proporcional de la paga de verano",
  "paga-navidad": "Parte proporcional de la paga de Navidad",
  preaviso: "Preaviso",
};

function explicacion(c: Concepto): string {
  if (c.periodo) {
    return `${formatEuro(c.base)} × ${c.periodo.devengados} / ${c.periodo.total} días del periodo`;
  }
  const dias = formatNumber(Math.abs(c.dias));
  if (c.id === "vacaciones" && c.dias < 0) {
    return `Has disfrutado ${dias} días más de los generados × ${formatEuro(c.base)}/día`;
  }
  if (c.id === "preaviso" && c.importe < 0)
    return `Descuento: ${dias} días × ${formatEuro(c.base)}/día`;
  return `${dias} días × ${formatEuro(c.base)}/día`;
}

function Resultado({ result }: { result: FiniquitoResult }) {
  if (!result.ok) {
    return (
      <div
        role="alert"
        className="rounded-lg border border-border bg-surface p-4 text-sm text-danger"
      >
        <p className="font-medium">Revisa estos datos:</p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          {result.errores.map((e) => (
            <li key={e}>{e}</li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <section aria-labelledby="resultado" className="space-y-4">
      <h2 id="resultado" className="sr-only">
        Resultado
      </h2>
      <div className="grid gap-3 sm:grid-cols-3">
        <Stat label="Finiquito" value={result.totalFiniquito} />
        <Stat label="Indemnización" value={result.indemnizacion?.importe ?? 0} />
        <Stat label="Total bruto" value={result.total} highlight />
      </div>

      <div className="overflow-x-auto rounded-lg border border-border bg-surface">
        <table className="w-full text-sm">
          <caption className="sr-only">Desglose del finiquito</caption>
          <thead className="bg-surface-muted text-left text-muted">
            <tr>
              <th scope="col" className="px-4 py-2 font-medium">
                Concepto
              </th>
              <th scope="col" className="px-4 py-2 text-right font-medium">
                Importe
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {result.conceptos.map((c) => (
              <tr key={c.id}>
                <td className="px-4 py-3">
                  <p>{CONCEPTO_LABEL[c.id]}</p>
                  <p className="text-xs text-muted">{explicacion(c)}</p>
                </td>
                <td
                  className={`px-4 py-3 text-right tabular-nums ${c.importe < 0 ? "text-danger" : ""}`}
                >
                  {formatEuro(c.importe)}
                </td>
              </tr>
            ))}
            {result.indemnizacion && <FilaIndemnizacion indemnizacion={result.indemnizacion} />}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-muted">
        Importes brutos y orientativos según el Estatuto de los Trabajadores. Tu convenio colectivo
        puede mejorarlos. Los conceptos salariales tributan IRPF y cotizan a la Seguridad Social; la
        indemnización legal por despido está exenta de IRPF dentro de los límites de la ley.
      </p>
    </section>
  );
}

function FilaIndemnizacion({ indemnizacion: ind }: { indemnizacion: Indemnizacion }) {
  return (
    <tr>
      <td className="px-4 py-3">
        <p>Indemnización</p>
        {ind.tramos.map((t) => (
          <p key={t.desde} className="text-xs text-muted">
            {formatISODate(t.desde)} – {formatISODate(t.hasta)}: {t.meses} meses × {t.diasPorAnio}
            /12 = {formatNumber(t.dias)} días
          </p>
        ))}
        {ind.topeAplicado && (
          <p className="text-xs text-muted">
            Se aplica el tope legal de {formatNumber(ind.topeDias!)} días.
          </p>
        )}
        <p className="text-xs text-muted">
          {formatNumber(ind.dias)} días × {formatEuro(ind.salarioDiario)}/día (salario anual / 365)
        </p>
      </td>
      <td className="px-4 py-3 text-right tabular-nums">{formatEuro(ind.importe)}</td>
    </tr>
  );
}

function Stat({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: number;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-lg border p-4 ${highlight ? "border-brand bg-surface" : "border-border bg-surface"}`}
    >
      <p className="text-sm text-muted">{label}</p>
      <p className={`mt-1 text-2xl font-semibold tabular-nums ${highlight ? "text-brand" : ""}`}>
        {formatEuro(value)}
      </p>
    </div>
  );
}
