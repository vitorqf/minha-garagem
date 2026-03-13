import type { SummaryPeriodInput } from "@/features/summaries/types";

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const monthFormatter = new Intl.DateTimeFormat("pt-BR", {
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

type YearMonthParts = {
  year: number;
  month: number;
};

function parseYearMonth(value: string): YearMonthParts {
  const [yearRaw, monthRaw] = value.split("-");

  return {
    year: Number(yearRaw),
    month: Number(monthRaw),
  };
}

function toYearMonth(value: YearMonthParts): string {
  return `${String(value.year).padStart(4, "0")}-${String(value.month).padStart(2, "0")}`;
}

export function formatSummaryCurrencyFromCents(amountCents: number): string {
  return currencyFormatter.format(amountCents / 100);
}

export function formatSummaryMonthLabel(yearMonth: string): string {
  const { year, month } = parseYearMonth(yearMonth);
  return monthFormatter.format(new Date(Date.UTC(year, month - 1, 1)));
}

export function getCurrentYearMonth(today = new Date()): string {
  const current = {
    year: today.getUTCFullYear(),
    month: today.getUTCMonth() + 1,
  };

  return toYearMonth(current);
}

export function getDefaultSummaryPeriod(today = new Date()): SummaryPeriodInput {
  const currentMonth = getCurrentYearMonth(today);

  return {
    startMonth: currentMonth,
    endMonth: currentMonth,
    vehicleId: "",
  };
}

export function getMonthKeysBetween(startMonth: string, endMonth: string): string[] {
  const start = parseYearMonth(startMonth);
  const end = parseYearMonth(endMonth);

  const keys: string[] = [];
  const current = { ...start };

  while (current.year < end.year || (current.year === end.year && current.month <= end.month)) {
    keys.push(toYearMonth(current));

    current.month += 1;
    if (current.month > 12) {
      current.month = 1;
      current.year += 1;
    }
  }

  return keys;
}

export function toStartDateFromMonth(yearMonth: string): string {
  return `${yearMonth}-01`;
}

export function toEndDateFromMonth(yearMonth: string): string {
  const { year, month } = parseYearMonth(yearMonth);
  const lastDay = new Date(Date.UTC(year, month, 0)).getUTCDate();

  return `${yearMonth}-${String(lastDay).padStart(2, "0")}`;
}
