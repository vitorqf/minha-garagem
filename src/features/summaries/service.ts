import type { ExpenseCategory } from "@/features/expenses/types";
import type { ExpenseRepository } from "@/features/expenses/repositories/expense-repository";
import { SUMMARY_COPY } from "@/features/summaries/constants";
import {
  getMonthKeysBetween,
  toEndDateFromMonth,
  toStartDateFromMonth,
} from "@/features/summaries/format";
import type { SummaryData, SummaryPeriodInput, VehicleSummary } from "@/features/summaries/types";
import { parseSummaryPeriod, toSummaryErrorMap } from "@/features/summaries/validation";
import { listVehicles } from "@/features/vehicles/vehicle-service";
import type { VehicleRepository } from "@/features/vehicles/repositories/vehicle-repository";

type SummaryServiceSuccess<T> = {
  ok: true;
  data: T;
};

type SummaryServiceFailure = {
  ok: false;
  message: string;
  errors?: Record<string, string>;
};

type SummaryServiceResult<T> = SummaryServiceSuccess<T> | SummaryServiceFailure;

const CATEGORY_KEYS: ExpenseCategory[] = ["fuel", "parts", "service"];

function createEmptyCategoryBreakdown(): Record<ExpenseCategory, number> {
  return {
    fuel: 0,
    parts: 0,
    service: 0,
  };
}

function createEmptyMonthlyTotals(months: string[]): Record<string, number> {
  return Object.fromEntries(months.map((month) => [month, 0]));
}

export async function getVehicleSummaries(
  vehicleRepository: VehicleRepository,
  expenseRepository: ExpenseRepository,
  ownerId: string,
  input: SummaryPeriodInput,
): Promise<SummaryServiceResult<SummaryData>> {
  const parsed = parseSummaryPeriod(input);

  if (!parsed.success) {
    return {
      ok: false,
      message: SUMMARY_COPY.invalidFilters,
      errors: toSummaryErrorMap(parsed.error),
    };
  }

  const normalizedVehicleId = parsed.data.vehicleId?.trim() || undefined;
  const months = getMonthKeysBetween(parsed.data.startMonth, parsed.data.endMonth);

  const [vehicles, expenses] = await Promise.all([
    listVehicles(vehicleRepository, ownerId),
    expenseRepository.listByFilter({
      ownerId,
      vehicleId: normalizedVehicleId,
      startDate: toStartDateFromMonth(parsed.data.startMonth),
      endDate: toEndDateFromMonth(parsed.data.endMonth),
    }),
  ]);

  const scopedVehicles = normalizedVehicleId
    ? vehicles.filter((vehicle) => vehicle.id === normalizedVehicleId)
    : vehicles;

  const summaryByVehicle = new Map<string, VehicleSummary>(
    scopedVehicles.map((vehicle) => [
      vehicle.id,
      {
        vehicleId: vehicle.id,
        totalSpentCents: 0,
        monthlyTotals: createEmptyMonthlyTotals(months),
        categoryBreakdown: createEmptyCategoryBreakdown(),
      },
    ]),
  );

  for (const expense of expenses) {
    const summary = summaryByVehicle.get(expense.vehicleId);
    if (!summary) {
      continue;
    }

    summary.totalSpentCents += expense.amountCents;

    for (const categoryKey of CATEGORY_KEYS) {
      if (categoryKey === expense.category) {
        summary.categoryBreakdown[categoryKey] += expense.amountCents;
      }
    }

    const monthKey = expense.expenseDate.toISOString().slice(0, 7);
    if (Object.hasOwn(summary.monthlyTotals, monthKey)) {
      summary.monthlyTotals[monthKey] += expense.amountCents;
    }
  }

  return {
    ok: true,
    data: {
      period: {
        startMonth: parsed.data.startMonth,
        endMonth: parsed.data.endMonth,
        vehicleId: normalizedVehicleId,
      },
      months,
      vehicles,
      summaries: scopedVehicles.map((vehicle) => summaryByVehicle.get(vehicle.id) as VehicleSummary),
    },
  };
}
