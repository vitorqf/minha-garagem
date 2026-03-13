import { getExpenseRepository } from "@/features/expenses/repositories";
import {
  formatSummaryCurrencyFromCents,
  formatSummaryMonthLabel,
  getDefaultSummaryPeriod,
} from "@/features/summaries/format";
import { getVehicleSummaries } from "@/features/summaries/service";
import type {
  SummaryData,
  SummaryMonthColumn,
  SummaryPeriodInput,
  SummaryVehicleOption,
  SummaryViewModel,
} from "@/features/summaries/types";
import { SummariesPageClient } from "@/features/summaries/components/summaries-page-client";
import { STUB_OWNER_ID } from "@/features/vehicles/constants";
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
): SummaryViewModel[] {
  const labels = new Map(vehicleOptions.map((vehicle) => [vehicle.id, vehicle.label]));

  return summaries.map((summary) => ({
    vehicleId: summary.vehicleId,
    vehicleLabel: labels.get(summary.vehicleId) ?? summary.vehicleId,
    totalSpentLabel: formatSummaryCurrencyFromCents(summary.totalSpentCents),
    categoryBreakdown: {
      fuel: formatSummaryCurrencyFromCents(summary.categoryBreakdown.fuel),
      parts: formatSummaryCurrencyFromCents(summary.categoryBreakdown.parts),
      service: formatSummaryCurrencyFromCents(summary.categoryBreakdown.service),
    },
    monthlyTotals: Object.fromEntries(
      months.map((month) => [
        month,
        formatSummaryCurrencyFromCents(summary.monthlyTotals[month] ?? 0),
      ]),
    ),
  }));
}

export default async function SummariesPage({ searchParams }: PageProps) {
  const query = await searchParams;
  const initialFilters = buildFilters(query);

  const vehicleRepository = getVehicleRepository();
  const expenseRepository = getExpenseRepository();

  let filterError: string | undefined;
  let activeFilters = initialFilters;
  let result = await getVehicleSummaries(
    vehicleRepository,
    expenseRepository,
    STUB_OWNER_ID,
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
      STUB_OWNER_ID,
      activeFilters,
    );

    if (!result.ok) {
      throw new Error(result.message);
    }
  }

  const vehicleOptions = toVehicleOptions(result.data.vehicles);
  const monthColumns = toMonthColumns(result.data.months);
  const summaryViewModels = toSummaryViewModels(
    result.data.summaries,
    vehicleOptions,
    result.data.months,
  );

  return (
    <SummariesPageClient
      defaultFilters={activeFilters}
      vehicles={vehicleOptions}
      monthColumns={monthColumns}
      summaries={summaryViewModels}
      filterError={filterError}
    />
  );
}
