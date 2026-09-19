const euro = new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" });

export function formatEuro(value: number): string {
  return euro.format(value);
}

export function formatNumber(value: number, maxDecimals = 2): string {
  return new Intl.NumberFormat("es-ES", { maximumFractionDigits: maxDecimals }).format(value);
}

/** "2026-09-30" → "30/09/2026" */
export function formatISODate(iso: string): string {
  const [year, month, day] = iso.split("-");
  return `${day}/${month}/${year}`;
}

/** Lee números escritos en formato español o internacional: "28.000", "28000,50", "28.000,50", "28000.50". */
export function parseSpanishNumber(value: string): number {
  const clean = value.trim().replace(/\s/g, "");
  if (clean === "") return NaN;
  if (/,\d{1,2}$/.test(clean)) return Number(clean.replace(/\./g, "").replace(",", "."));
  if (/^-?\d{1,3}(\.\d{3})+$/.test(clean)) return Number(clean.replace(/\./g, ""));
  return Number(clean.replace(",", "."));
}
