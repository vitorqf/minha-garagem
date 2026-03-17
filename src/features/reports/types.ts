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
