export type ExpenseCategory = "fuel" | "parts" | "service";

export type Expense = {
  id: string;
  ownerId: string;
  vehicleId: string;
  expenseDate: Date;
  category: ExpenseCategory;
  amountCents: number;
  mileage: number | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type ExpenseInput = {
  vehicleId: string;
  expenseDate: string;
  category: string;
  amountInput: string;
  mileage?: string | null;
  notes?: string | null;
};

export type ExpenseFilterInput = {
  vehicleId?: string;
  startDate: string;
  endDate: string;
};

export type ExpenseCreateData = {
  ownerId: string;
  vehicleId: string;
  expenseDate: string;
  category: ExpenseCategory;
  amountCents: number;
  mileage?: number;
  notes?: string;
};

export type ExpenseUpdateData = Omit<ExpenseCreateData, "ownerId">;

export type ExpenseFormState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: Partial<
    Record<
      "vehicleId" | "expenseDate" | "category" | "amountInput" | "mileage" | "notes" | "form",
      string
    >
  >;
};

export type ExpenseFilterState = {
  status: "idle" | "success" | "error";
  message?: string;
  filters: {
    vehicleId?: string;
    startDate?: string;
    endDate?: string;
  };
  errors?: Partial<Record<"startDate" | "endDate" | "period", string>>;
};

export const initialExpenseFormState: ExpenseFormState = {
  status: "idle",
  errors: {},
};

export const initialExpenseFilterState: ExpenseFilterState = {
  status: "idle",
  filters: {},
  errors: {},
};

export type VehicleOption = {
  id: string;
  label: string;
};

export type ExpenseViewModel = {
  id: string;
  vehicleId: string;
  vehicleLabel: string;
  expenseDate: string;
  category: ExpenseCategory;
  amountCents: number;
  amountLabel: string;
  mileage: number | null;
  notes: string | null;
  createdAt: string;
};
