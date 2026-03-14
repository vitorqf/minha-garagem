export function formatCsvAmountFromCents(amountCents: number): string {
  const normalized = Number.isFinite(amountCents) ? Math.trunc(amountCents) : 0;
  const signal = normalized < 0 ? "-" : "";
  const absolute = Math.abs(normalized);
  const wholePart = Math.floor(absolute / 100);
  const decimalPart = String(absolute % 100).padStart(2, "0");

  return `${signal}${wholePart},${decimalPart}`;
}

export function formatCsvDate(date: Date): string {
  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const year = String(date.getUTCFullYear());

  return `${day}/${month}/${year}`;
}

export function buildExpensesCsvFilename(startDate: string, endDate: string): string {
  return `despesas-${startDate}-a-${endDate}.csv`;
}
