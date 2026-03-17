import type { ExpenseCategory } from "@/features/expenses/types";
import type { Vehicle } from "@/features/vehicles/types";

export type SummaryPeriodInput = {
  startMonth: string;
  endMonth: string;
  vehicleId?: string;
};

export type VehicleSummary = {
  vehicleId: string;
  totalSpentCents: number;
  monthlyTotals: Record<string, number>;
  categoryBreakdown: Record<ExpenseCategory, number>;
};

export type SummaryData = {
  period: {
    startMonth: string;
    endMonth: string;
    vehicleId?: string;
  };
  months: string[];
  vehicles: Vehicle[];
  summaries: VehicleSummary[];
};

export type SummaryVehicleOption = {
  id: string;
  label: string;
};

export type SummaryMonthColumn = {
  key: string;
  label: string;
};

export type SummaryViewModel = {
  vehicleId: string;
  vehicleLabel: string;
  totalSpentCents: number;
  totalSpentLabel: string;
  categoryBreakdownCents: Record<ExpenseCategory, number>;
  categoryBreakdown: Record<ExpenseCategory, string>;
  monthlyTotalsCents: Record<string, number>;
  monthlyTotals: Record<string, string>;
};

export type SummaryKpiViewModel = {
  totalSpentLabel: string;
  monthlyAverageLabel: string;
  variationLabel: string;
  variationDirection: "positive" | "negative" | "neutral";
};

export type SummaryRecentExpenseViewModel = {
  id: string;
  dateLabel: string;
  vehicleLabel: string;
  categoryLabel: string;
  notesLabel: string;
  amountLabel: string;
};
