import { EXPENSE_CATEGORY_LABELS } from "@/features/expenses/constants";
import type { ExpenseCategory, Expense } from "@/features/expenses/types";
import {
  formatSummaryCurrencyFromCents,
  formatSummaryMonthLabel,
} from "@/features/summaries/format";
import type {
  SummaryCostPerKmViewModel,
  SummaryMonthlyTrendViewModel,
  SummaryTopCostDriverViewModel,
} from "@/features/summaries/types";

const CATEGORY_KEYS: ExpenseCategory[] = ["fuel", "parts", "service"];

const plainCurrencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const percentFormatter = new Intl.NumberFormat("pt-BR", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

function insufficientCostPerKm(): SummaryCostPerKmViewModel {
  return {
    status: "insufficient",
    label: "Dados insuficientes",
  };
}

function formatCostPerKmFromCents(centsPerKm: number): string {
  return `${plainCurrencyFormatter.format(centsPerKm / 100)}/km`;
}

function formatSignedCurrencyFromCents(amountCents: number): string {
  if (amountCents === 0) {
    return formatSummaryCurrencyFromCents(0);
  }

  const sign = amountCents > 0 ? "+" : "-";
  return `${sign}${formatSummaryCurrencyFromCents(Math.abs(amountCents))}`;
}

function formatSignedPercent(value: number): string {
  const sign = value > 0 ? "+" : value < 0 ? "-" : "";
  return `${sign}${percentFormatter.format(Math.abs(value))}%`;
}

export function buildCostPerKmByVehicle(
  summaries: Array<{ vehicleId: string; totalSpentCents: number }>,
  expenses: Expense[],
): Record<string, SummaryCostPerKmViewModel> {
  const mileagesByVehicle = new Map<string, number[]>();

  for (const expense of expenses) {
    if (expense.mileage === null) {
      continue;
    }

    const existing = mileagesByVehicle.get(expense.vehicleId) ?? [];
    existing.push(expense.mileage);
    mileagesByVehicle.set(expense.vehicleId, existing);
  }

  return Object.fromEntries(
    summaries.map((summary) => {
      const mileages = mileagesByVehicle.get(summary.vehicleId) ?? [];
      if (mileages.length < 2) {
        return [summary.vehicleId, insufficientCostPerKm()];
      }

      const minMileage = Math.min(...mileages);
      const maxMileage = Math.max(...mileages);
      const mileageDelta = maxMileage - minMileage;

      if (mileageDelta <= 0) {
        return [summary.vehicleId, insufficientCostPerKm()];
      }

      const costPerKmCents = summary.totalSpentCents / mileageDelta;

      return [
        summary.vehicleId,
        {
          status: "available",
          label: formatCostPerKmFromCents(costPerKmCents),
        },
      ];
    }),
  );
}

export function buildMonthlyTrendRows(
  months: string[],
  summaries: Array<{ vehicleId: string; monthlyTotalsCents: Record<string, number> }>,
): SummaryMonthlyTrendViewModel[] {
  const totals = months.map((month) =>
    summaries.reduce((acc, summary) => acc + (summary.monthlyTotalsCents[month] ?? 0), 0),
  );

  return months.map((month, index) => {
    const totalSpentCents = totals[index] ?? 0;

    if (index === 0) {
      return {
        monthKey: month,
        monthLabel: formatSummaryMonthLabel(month),
        totalSpentCents,
        totalSpentLabel: formatSummaryCurrencyFromCents(totalSpentCents),
        deltaLabel: "—",
        deltaPercentLabel: "—",
        deltaDirection: "neutral",
      };
    }

    const previousTotal = totals[index - 1] ?? 0;
    const deltaCents = totalSpentCents - previousTotal;

    return {
      monthKey: month,
      monthLabel: formatSummaryMonthLabel(month),
      totalSpentCents,
      totalSpentLabel: formatSummaryCurrencyFromCents(totalSpentCents),
      deltaLabel: formatSignedCurrencyFromCents(deltaCents),
      deltaPercentLabel:
        previousTotal > 0 ? formatSignedPercent((deltaCents / previousTotal) * 100) : "—",
      deltaDirection: deltaCents > 0 ? "negative" : deltaCents < 0 ? "positive" : "neutral",
    };
  });
}

export function buildTopCostDrivers(
  summaries: Array<{
    vehicleId: string;
    vehicleLabel: string;
    categoryBreakdownCents: Record<ExpenseCategory, number>;
  }>,
  limit = 3,
): SummaryTopCostDriverViewModel[] {
  const rows = summaries.flatMap((summary) =>
    CATEGORY_KEYS.map((category) => {
      const amountCents = summary.categoryBreakdownCents[category] ?? 0;

      return {
        key: `${summary.vehicleId}-${category}`,
        vehicleLabel: summary.vehicleLabel,
        categoryLabel: EXPENSE_CATEGORY_LABELS[category] ?? category,
        amountCents,
      };
    }),
  ).filter((row) => row.amountCents > 0);

  rows.sort((a, b) => {
    if (b.amountCents !== a.amountCents) {
      return b.amountCents - a.amountCents;
    }

    const vehicleOrder = a.vehicleLabel.localeCompare(b.vehicleLabel, "pt-BR");
    if (vehicleOrder !== 0) {
      return vehicleOrder;
    }

    return a.categoryLabel.localeCompare(b.categoryLabel, "pt-BR");
  });

  const totalAmountCents = rows.reduce((acc, row) => acc + row.amountCents, 0);

  return rows.slice(0, limit).map((row) => ({
    key: row.key,
    vehicleLabel: row.vehicleLabel,
    categoryLabel: row.categoryLabel,
    amountCents: row.amountCents,
    amountLabel: formatSummaryCurrencyFromCents(row.amountCents),
    shareLabel:
      totalAmountCents > 0
        ? `${percentFormatter.format((row.amountCents / totalAmountCents) * 100)}%`
        : "0,0%",
  }));
}
