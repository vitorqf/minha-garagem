export type ReportExpenseExportFilter = {
  vehicleId?: string;
  category?: string;
  startDate: string;
  endDate: string;
};

export type NormalizedReportExpenseExportFilter = {
  vehicleId: string;
  category: string;
  startDate: string;
  endDate: string;
};

export type ExpenseCsvRow = {
  id: string;
  date: string;
  vehicle: string;
  category: string;
  amount: string;
  mileage: string;
  notes: string;
};

export type ExpenseCsvExportData = {
  appliedFilter: NormalizedReportExpenseExportFilter;
  rows: ExpenseCsvRow[];
};

export type ReportSummaryExportFilter = {
  vehicleId?: string;
  startMonth: string;
  endMonth: string;
};

export type NormalizedReportSummaryExportFilter = {
  vehicleId: string;
  startMonth: string;
  endMonth: string;
};

export type SummaryCsvRow = {
  vehicle: string;
  total: string;
  fuel: string;
  parts: string;
  service: string;
  monthlyTotals: Record<string, string>;
};

export type SummaryCsvExportData = {
  appliedFilter: NormalizedReportSummaryExportFilter;
  months: string[];
  monthLabels: Record<string, string>;
  rows: SummaryCsvRow[];
};
