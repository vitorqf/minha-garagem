import type {
  Expense,
  ExpenseCreateData,
  ExpenseUpdateData,
} from "@/features/expenses/types";

export type ExpenseListFilter = {
  ownerId: string;
  vehicleId?: string;
  startDate: string;
  endDate: string;
};

export interface ExpenseRepository {
  create(data: ExpenseCreateData): Promise<Expense>;
  update(id: string, ownerId: string, data: ExpenseUpdateData): Promise<Expense | null>;
  delete(id: string, ownerId: string): Promise<boolean>;
  listByFilter(filter: ExpenseListFilter): Promise<Expense[]>;
  hasVehicleExpenses(ownerId: string, vehicleId: string): Promise<boolean>;
}
