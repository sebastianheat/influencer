export function compact(n: number): string {
  return new Intl.NumberFormat("es-ES", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(n);
}

export function money(n: number): string {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(n);
}

/* Chilean pesos: $20.000 */
export function clp(n: number): string {
  return "$" + Math.round(n).toLocaleString("es-CL");
}

/* Social counts in Montu style: 556, 12,8K, 979,1K, 1,8M */
export function socialCount(n: number | null): string {
  if (n === null) return "—";
  if (n === 0) return "0";
  const fmt = (v: number) =>
    v.toLocaleString("es-ES", { maximumFractionDigits: 1 });
  if (n >= 1_000_000) return `${fmt(n / 1_000_000)}M`;
  if (n >= 1_000) return `${fmt(n / 1_000)}K`;
  return String(n);
}

export function dateShort(iso: string): string {
  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(iso));
}

export function daysLeft(iso: string): number {
  const ms = new Date(iso).getTime() - Date.now();
  return Math.max(0, Math.ceil(ms / 86400000));
}
