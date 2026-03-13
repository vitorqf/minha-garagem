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
  totalSpentLabel: string;
  categoryBreakdown: Record<ExpenseCategory, string>;
  monthlyTotals: Record<string, string>;
};
