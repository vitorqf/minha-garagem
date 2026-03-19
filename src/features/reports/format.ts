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

const monthShortFormatter = new Intl.DateTimeFormat("pt-BR", {
  month: "short",
  timeZone: "UTC",
});

export function formatCsvMonthLabel(yearMonth: string): string {
  const [yearRaw, monthRaw] = yearMonth.split("-");
  const year = Number(yearRaw);
  const month = Number(monthRaw);

  if (!Number.isInteger(year) || !Number.isInteger(month) || month < 1 || month > 12) {
    return yearMonth;
  }

  const monthLabel = monthShortFormatter
    .format(new Date(Date.UTC(year, month - 1, 1)))
    .replace(".", "");

  return `${monthLabel}/${year}`;
}

export function buildExpensesCsvFilename(startDate: string, endDate: string): string {
  return `despesas-${startDate}-a-${endDate}.csv`;
}

export function buildSummariesCsvFilename(startMonth: string, endMonth: string): string {
  return `resumos-${startMonth}-a-${endMonth}.csv`;
}
