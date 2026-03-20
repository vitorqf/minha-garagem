import { EXPENSE_CATEGORY_LABELS } from "@/features/expenses/constants";
import { getExpenseRepository } from "@/features/expenses/repositories";
import { listExpenses } from "@/features/expenses/service";
import { requireAuthenticatedOwnerId } from "@/features/auth/session";
import {
  formatSummaryCurrencyFromCents,
  formatSummaryMonthLabel,
  getDefaultSummaryPeriod,
  toEndDateFromMonth,
  toStartDateFromMonth,
} from "@/features/summaries/format";
import {
  buildCostPerKmByVehicle,
  buildMonthlyTrendRows,
  buildTopCostDrivers,
} from "@/features/summaries/insights";
import { getVehicleSummaries } from "@/features/summaries/service";
import type {
  SummaryCostPerKmViewModel,
  SummaryData,
  SummaryKpiViewModel,
  SummaryMonthColumn,
  SummaryMonthlyTrendViewModel,
  SummaryPeriodInput,
  SummaryRecentExpenseViewModel,
  SummaryTopCostDriverViewModel,
  SummaryVehicleOption,
  SummaryViewModel,
} from "@/features/summaries/types";
import { SummariesPageClient } from "@/features/summaries/components/summaries-page-client";
import { getVehicleRepository } from "@/features/vehicles/repositories";

export const runtime = "nodejs";

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function toSingleValue(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

function buildFilters(query: Record<string, string | string[] | undefined> | undefined): SummaryPeriodInput {
  const defaults = getDefaultSummaryPeriod();

  return {
    startMonth: toSingleValue(query?.startMonth) ?? defaults.startMonth,
    endMonth: toSingleValue(query?.endMonth) ?? defaults.endMonth,
    vehicleId: toSingleValue(query?.vehicleId) ?? defaults.vehicleId,
  };
}

function toVehicleOptions(vehicles: SummaryData["vehicles"]): SummaryVehicleOption[] {
  return vehicles.map((vehicle) => ({
    id: vehicle.id,
    label: `${vehicle.nickname} (${vehicle.brand} ${vehicle.model})`,
  }));
}

function toMonthColumns(months: string[]): SummaryMonthColumn[] {
  return months.map((month) => ({
    key: month,
    label: formatSummaryMonthLabel(month),
  }));
}

function toSummaryViewModels(
  summaries: SummaryData["summaries"],
  vehicleOptions: SummaryVehicleOption[],
  months: string[],
  costPerKmByVehicle: Record<string, SummaryCostPerKmViewModel>,
): SummaryViewModel[] {
  const labels = new Map(vehicleOptions.map((vehicle) => [vehicle.id, vehicle.label]));

  return summaries.map((summary) => ({
    vehicleId: summary.vehicleId,
    vehicleLabel: labels.get(summary.vehicleId) ?? summary.vehicleId,
    totalSpentCents: summary.totalSpentCents,
    totalSpentLabel: formatSummaryCurrencyFromCents(summary.totalSpentCents),
    costPerKm: costPerKmByVehicle[summary.vehicleId] ?? {
      status: "insufficient",
      label: "Dados insuficientes",
    },
    categoryBreakdownCents: {
      fuel: summary.categoryBreakdown.fuel,
      parts: summary.categoryBreakdown.parts,
      service: summary.categoryBreakdown.service,
    },
    categoryBreakdown: {
      fuel: formatSummaryCurrencyFromCents(summary.categoryBreakdown.fuel),
      parts: formatSummaryCurrencyFromCents(summary.categoryBreakdown.parts),
      service: formatSummaryCurrencyFromCents(summary.categoryBreakdown.service),
    },
    monthlyTotalsCents: Object.fromEntries(
      months.map((month) => [month, summary.monthlyTotals[month] ?? 0]),
    ),
    monthlyTotals: Object.fromEntries(
      months.map((month) => [
        month,
        formatSummaryCurrencyFromCents(summary.monthlyTotals[month] ?? 0),
      ]),
    ),
  }));
}

function shiftYearMonth(yearMonth: string, deltaMonths: number): string {
  const [yearRaw, monthRaw] = yearMonth.split("-");
  const baseDate = new Date(Date.UTC(Number(yearRaw), Number(monthRaw) - 1, 1));
  baseDate.setUTCMonth(baseDate.getUTCMonth() + deltaMonths);

  return `${baseDate.getUTCFullYear()}-${String(baseDate.getUTCMonth() + 1).padStart(2, "0")}`;
}

function buildSummaryKpis(
  currentTotalCents: number,
  previousTotalCents: number | null,
  monthCount: number,
): SummaryKpiViewModel {
  const monthlyAverageCents = monthCount > 0 ? Math.round(currentTotalCents / monthCount) : 0;

  let variationLabel = "—";
  let variationDirection: SummaryKpiViewModel["variationDirection"] = "neutral";

  if (previousTotalCents && previousTotalCents > 0) {
    const variationPercent = ((currentTotalCents - previousTotalCents) / previousTotalCents) * 100;
    const signedValue = `${variationPercent >= 0 ? "+" : ""}${variationPercent.toFixed(1)}%`;
    variationLabel = signedValue.replace(".", ",");
    variationDirection = variationPercent >= 0 ? "positive" : "negative";
  }

  return {
    totalSpentLabel: formatSummaryCurrencyFromCents(currentTotalCents),
    monthlyAverageLabel: formatSummaryCurrencyFromCents(monthlyAverageCents),
    variationLabel,
    variationDirection,
  };
}

const recentExpenseDateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

function toRecentExpenseViewModels(
  expenses: Awaited<ReturnType<typeof listExpenses>>,
  vehicles: SummaryVehicleOption[],
): SummaryRecentExpenseViewModel[] {
  if (!expenses.ok) {
    return [];
  }

  const vehicleLabels = new Map(vehicles.map((vehicle) => [vehicle.id, vehicle.label]));

  return expenses.data.slice(0, 5).map((expense) => ({
    id: expense.id,
    dateLabel: recentExpenseDateFormatter.format(expense.expenseDate).replace(".", ""),
    vehicleLabel: vehicleLabels.get(expense.vehicleId) ?? expense.vehicleId,
    categoryLabel: EXPENSE_CATEGORY_LABELS[expense.category] ?? expense.category,
    notesLabel: expense.notes ?? "Sem observações",
    amountLabel: formatSummaryCurrencyFromCents(expense.amountCents),
  }));
}

function toMonthlyTrendViewModels(
  months: string[],
  summaries: SummaryViewModel[],
): SummaryMonthlyTrendViewModel[] {
  return buildMonthlyTrendRows(months, summaries);
}

function toTopCostDrivers(summaries: SummaryViewModel[]): SummaryTopCostDriverViewModel[] {
  return buildTopCostDrivers(summaries, 3);
}

export default async function SummariesPage({ searchParams }: PageProps) {
  const ownerId = await requireAuthenticatedOwnerId();
  const query = await searchParams;
  const initialFilters = buildFilters(query);

  const vehicleRepository = getVehicleRepository();
  const expenseRepository = getExpenseRepository();

  let filterError: string | undefined;
  let activeFilters = initialFilters;
  let result = await getVehicleSummaries(
    vehicleRepository,
    expenseRepository,
    ownerId,
    initialFilters,
  );

  if (!result.ok) {
    filterError = result.message;
    activeFilters = {
      ...getDefaultSummaryPeriod(),
      vehicleId: initialFilters.vehicleId ?? "",
    };

    result = await getVehicleSummaries(
      vehicleRepository,
      expenseRepository,
      ownerId,
      activeFilters,
    );

    if (!result.ok) {
      throw new Error(result.message);
    }
  }

  const vehicleOptions = toVehicleOptions(result.data.vehicles);
  const monthColumns = toMonthColumns(result.data.months);
  const expensesResult = await listExpenses(expenseRepository, ownerId, {
    startDate: toStartDateFromMonth(activeFilters.startMonth),
    endDate: toEndDateFromMonth(activeFilters.endMonth),
    vehicleId: activeFilters.vehicleId,
  });
  const costsPerKm = buildCostPerKmByVehicle(
    result.data.summaries,
    expensesResult.ok ? expensesResult.data : [],
  );
  const summaryViewModels = toSummaryViewModels(
    result.data.summaries,
    vehicleOptions,
    result.data.months,
    costsPerKm,
  );
  const monthlyTrends = toMonthlyTrendViewModels(result.data.months, summaryViewModels);
  const topCostDrivers = toTopCostDrivers(summaryViewModels);
  const currentTotalCents = summaryViewModels.reduce(
    (acc, summary) => acc + summary.totalSpentCents,
    0,
  );
  const monthCount = result.data.months.length;
  const previousPeriod = {
    startMonth: shiftYearMonth(activeFilters.startMonth, -monthCount),
    endMonth: shiftYearMonth(activeFilters.endMonth, -monthCount),
    vehicleId: activeFilters.vehicleId ?? "",
  };
  const previousResult = await getVehicleSummaries(
    vehicleRepository,
    expenseRepository,
    ownerId,
    previousPeriod,
  );
  const previousTotalCents = previousResult.ok
    ? previousResult.data.summaries.reduce((acc, summary) => acc + summary.totalSpentCents, 0)
    : null;
  const kpis = buildSummaryKpis(currentTotalCents, previousTotalCents, monthCount);
  const recentExpenses = toRecentExpenseViewModels(expensesResult, vehicleOptions);

  return (
    <SummariesPageClient
      defaultFilters={activeFilters}
      vehicles={vehicleOptions}
      monthColumns={monthColumns}
      summaries={summaryViewModels}
      monthlyTrends={monthlyTrends}
      topCostDrivers={topCostDrivers}
      kpis={kpis}
      recentExpenses={recentExpenses}
      filterError={filterError}
    />
  );
}
