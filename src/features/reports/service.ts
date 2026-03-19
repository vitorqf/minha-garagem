import { EXPENSE_CATEGORY_LABELS } from "@/features/expenses/constants";
import type { ExpenseRepository } from "@/features/expenses/repositories/expense-repository";
import { listExpenses } from "@/features/expenses/service";
import {
  parseExpenseFilter,
  toExpenseErrorMap,
} from "@/features/expenses/validation";
import { REPORT_COPY } from "@/features/reports/constants";
import { formatCsvAmountFromCents, formatCsvDate, formatCsvMonthLabel } from "@/features/reports/format";
import type {
  ExpenseCsvExportData,
  ReportExpenseExportFilter,
  ReportSummaryExportFilter,
  SummaryCsvExportData,
} from "@/features/reports/types";
import { getVehicleSummaries } from "@/features/summaries/service";
import { parseSummaryPeriod, toSummaryErrorMap } from "@/features/summaries/validation";
import type { VehicleRepository } from "@/features/vehicles/repositories/vehicle-repository";
import { listVehicles } from "@/features/vehicles/vehicle-service";

type ReportServiceSuccess<T> = {
  ok: true;
  data: T;
};

type ReportServiceFailure = {
  ok: false;
  message: string;
  errors?: Record<string, string>;
};

export type ReportServiceResult<T> = ReportServiceSuccess<T> | ReportServiceFailure;

const MAX_EXPENSE_EXPORT_RANGE_DAYS = 366;
const MAX_SUMMARY_EXPORT_RANGE_MONTHS = 24;

function toUtcDate(value: string): Date {
  return new Date(`${value}T00:00:00.000Z`);
}

function getInclusiveDayRange(startDate: string, endDate: string): number {
  const millisecondsPerDay = 24 * 60 * 60 * 1000;
  const start = toUtcDate(startDate);
  const end = toUtcDate(endDate);
  return Math.floor((end.getTime() - start.getTime()) / millisecondsPerDay) + 1;
}

function getInclusiveMonthRange(startMonth: string, endMonth: string): number {
  const [startYearRaw, startMonthRaw] = startMonth.split("-");
  const [endYearRaw, endMonthRaw] = endMonth.split("-");
  const startYear = Number(startYearRaw);
  const startMonthValue = Number(startMonthRaw);
  const endYear = Number(endYearRaw);
  const endMonthValue = Number(endMonthRaw);

  return (endYear - startYear) * 12 + (endMonthValue - startMonthValue) + 1;
}

export async function buildExpenseCsvExport(
  vehicleRepository: VehicleRepository,
  expenseRepository: ExpenseRepository,
  ownerId: string,
  filterInput: ReportExpenseExportFilter,
): Promise<ReportServiceResult<ExpenseCsvExportData>> {
  const parsedFilter = parseExpenseFilter(filterInput);
  if (!parsedFilter.success) {
    return {
      ok: false,
      message: REPORT_COPY.invalidExpenseFilters,
      errors: toExpenseErrorMap(parsedFilter.error),
    };
  }

  const appliedFilter = {
    vehicleId: parsedFilter.data.vehicleId || "",
    category: parsedFilter.data.category || "",
    startDate: parsedFilter.data.startDate,
    endDate: parsedFilter.data.endDate,
  };

  const dayRange = getInclusiveDayRange(appliedFilter.startDate, appliedFilter.endDate);
  if (dayRange > MAX_EXPENSE_EXPORT_RANGE_DAYS) {
    return {
      ok: false,
      message: REPORT_COPY.invalidExpenseFilters,
      errors: {
        period: REPORT_COPY.expenseRangeTooLarge,
      },
    };
  }

  const [vehicles, expensesResult] = await Promise.all([
    listVehicles(vehicleRepository, ownerId),
    listExpenses(expenseRepository, ownerId, appliedFilter),
  ]);

  if (!expensesResult.ok) {
    return {
      ok: false,
      message: expensesResult.message,
      errors: expensesResult.errors,
    };
  }

  const vehicleLabels = new Map(
    vehicles.map((vehicle) => [vehicle.id, `${vehicle.nickname} (${vehicle.brand} ${vehicle.model})`]),
  );

  const rows = expensesResult.data.map((expense) => ({
    id: expense.id,
    date: formatCsvDate(expense.expenseDate),
    vehicle: vehicleLabels.get(expense.vehicleId) ?? expense.vehicleId,
    category: EXPENSE_CATEGORY_LABELS[expense.category] ?? expense.category,
    amount: formatCsvAmountFromCents(expense.amountCents),
    mileage: expense.mileage === null ? "" : String(expense.mileage),
    notes: expense.notes ?? "",
  }));

  return {
    ok: true,
    data: {
      appliedFilter,
      rows,
    },
  };
}

export async function buildSummaryCsvExport(
  vehicleRepository: VehicleRepository,
  expenseRepository: ExpenseRepository,
  ownerId: string,
  filterInput: ReportSummaryExportFilter,
): Promise<ReportServiceResult<SummaryCsvExportData>> {
  const parsedPeriod = parseSummaryPeriod({
    startMonth: filterInput.startMonth,
    endMonth: filterInput.endMonth,
    vehicleId: filterInput.vehicleId ?? "",
  });

  if (!parsedPeriod.success) {
    return {
      ok: false,
      message: REPORT_COPY.invalidSummaryFilters,
      errors: toSummaryErrorMap(parsedPeriod.error),
    };
  }

  const monthRange = getInclusiveMonthRange(parsedPeriod.data.startMonth, parsedPeriod.data.endMonth);
  if (monthRange > MAX_SUMMARY_EXPORT_RANGE_MONTHS) {
    return {
      ok: false,
      message: REPORT_COPY.invalidSummaryFilters,
      errors: {
        period: REPORT_COPY.summaryRangeTooLarge,
      },
    };
  }

  const summaryResult = await getVehicleSummaries(
    vehicleRepository,
    expenseRepository,
    ownerId,
    {
      startMonth: parsedPeriod.data.startMonth,
      endMonth: parsedPeriod.data.endMonth,
      vehicleId: parsedPeriod.data.vehicleId ?? "",
    },
  );

  if (!summaryResult.ok) {
    return {
      ok: false,
      message: REPORT_COPY.invalidSummaryFilters,
      errors: summaryResult.errors,
    };
  }

  const appliedFilter = {
    startMonth: summaryResult.data.period.startMonth,
    endMonth: summaryResult.data.period.endMonth,
    vehicleId: summaryResult.data.period.vehicleId ?? "",
  };

  const monthLabels = Object.fromEntries(
    summaryResult.data.months.map((month) => [month, formatCsvMonthLabel(month)]),
  );
  const vehicleLabels = new Map(
    summaryResult.data.vehicles.map((vehicle) => [vehicle.id, `${vehicle.nickname} (${vehicle.brand} ${vehicle.model})`]),
  );

  const rows = summaryResult.data.summaries
    .filter((summary) => summary.totalSpentCents > 0)
    .map((summary) => ({
      vehicle: vehicleLabels.get(summary.vehicleId) ?? summary.vehicleId,
      total: formatCsvAmountFromCents(summary.totalSpentCents),
      fuel: formatCsvAmountFromCents(summary.categoryBreakdown.fuel),
      parts: formatCsvAmountFromCents(summary.categoryBreakdown.parts),
      service: formatCsvAmountFromCents(summary.categoryBreakdown.service),
      monthlyTotals: Object.fromEntries(
        summaryResult.data.months.map((month) => [
          month,
          formatCsvAmountFromCents(summary.monthlyTotals[month] ?? 0),
        ]),
      ),
    }));

  return {
    ok: true,
    data: {
      appliedFilter,
      months: summaryResult.data.months,
      monthLabels,
      rows,
    },
  };
}
