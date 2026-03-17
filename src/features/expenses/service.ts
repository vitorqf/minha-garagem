import { EXPENSE_COPY } from "@/features/expenses/constants";
import type { ExpenseRepository } from "@/features/expenses/repositories/expense-repository";
import type {
  Expense,
  ExpenseCategory,
  ExpenseFilterInput,
  ExpenseInput,
  ExpenseUpdateData,
  ExpenseCreateData,
} from "@/features/expenses/types";
import type { VehicleRepository } from "@/features/vehicles/repositories/vehicle-repository";
import {
  parseExpenseFilter,
  parseExpenseInput,
  toExpenseErrorMap,
} from "@/features/expenses/validation";

export type ExpenseServiceSuccess<T> = {
  ok: true;
  data: T;
  message?: string;
};

export type ExpenseServiceFailure = {
  ok: false;
  message: string;
  errors?: Record<string, string>;
};

export type ExpenseServiceResult<T> = ExpenseServiceSuccess<T> | ExpenseServiceFailure;

const byNewest = (a: Expense, b: Expense) => {
  const byDate = b.expenseDate.getTime() - a.expenseDate.getTime();
  if (byDate !== 0) {
    return byDate;
  }
  return b.createdAt.getTime() - a.createdAt.getTime();
};

function toExpenseCategory(value: string | undefined): ExpenseCategory | undefined {
  if (value === "fuel" || value === "parts" || value === "service") {
    return value;
  }

  return undefined;
}

function buildCreateData(ownerId: string, input: ExpenseInput): ExpenseServiceResult<ExpenseCreateData> {
  const parsed = parseExpenseInput(input);
  if (!parsed.success) {
    return {
      ok: false,
      message: EXPENSE_COPY.genericError,
      errors: toExpenseErrorMap(parsed.error),
    };
  }

  return {
    ok: true,
    data: {
      ownerId,
      vehicleId: parsed.data.vehicleId,
      expenseDate: parsed.data.expenseDate,
      category: parsed.data.category,
      amountCents: parsed.data.amountInput.cents,
      mileage: parsed.data.mileage,
      notes: parsed.data.notes,
    },
  };
}

function buildUpdateData(input: ExpenseInput): ExpenseServiceResult<ExpenseUpdateData> {
  const parsed = parseExpenseInput(input);
  if (!parsed.success) {
    return {
      ok: false,
      message: EXPENSE_COPY.genericError,
      errors: toExpenseErrorMap(parsed.error),
    };
  }

  return {
    ok: true,
    data: {
      vehicleId: parsed.data.vehicleId,
      expenseDate: parsed.data.expenseDate,
      category: parsed.data.category,
      amountCents: parsed.data.amountInput.cents,
      mileage: parsed.data.mileage,
      notes: parsed.data.notes,
    },
  };
}

export async function createExpense(
  expenseRepository: ExpenseRepository,
  vehicleRepository: VehicleRepository,
  ownerId: string,
  input: ExpenseInput,
): Promise<ExpenseServiceResult<Expense>> {
  const built = buildCreateData(ownerId, input);
  if (!built.ok) {
    return built;
  }

  const vehicle = await vehicleRepository.findById(built.data.vehicleId, ownerId);
  if (!vehicle) {
    return {
      ok: false,
      message: EXPENSE_COPY.vehicleNotFound,
      errors: {
        vehicleId: EXPENSE_COPY.vehicleNotFound,
      },
    };
  }

  const expense = await expenseRepository.create(built.data);

  return {
    ok: true,
    data: expense,
    message: EXPENSE_COPY.created,
  };
}

export async function updateExpense(
  expenseRepository: ExpenseRepository,
  vehicleRepository: VehicleRepository,
  ownerId: string,
  id: string,
  input: ExpenseInput,
): Promise<ExpenseServiceResult<Expense>> {
  const built = buildUpdateData(input);
  if (!built.ok) {
    return built;
  }

  const vehicle = await vehicleRepository.findById(built.data.vehicleId, ownerId);
  if (!vehicle) {
    return {
      ok: false,
      message: EXPENSE_COPY.vehicleNotFound,
      errors: {
        vehicleId: EXPENSE_COPY.vehicleNotFound,
      },
    };
  }

  const updated = await expenseRepository.update(id, ownerId, built.data);
  if (!updated) {
    return {
      ok: false,
      message: EXPENSE_COPY.notFound,
    };
  }

  return {
    ok: true,
    data: updated,
    message: EXPENSE_COPY.updated,
  };
}

export async function deleteExpense(
  repository: ExpenseRepository,
  ownerId: string,
  id: string,
): Promise<ExpenseServiceResult<boolean>> {
  const deleted = await repository.delete(id, ownerId);
  if (!deleted) {
    return {
      ok: false,
      message: EXPENSE_COPY.notFound,
    };
  }

  return {
    ok: true,
    data: true,
    message: EXPENSE_COPY.deleted,
  };
}

export async function listExpenses(
  repository: ExpenseRepository,
  ownerId: string,
  filterInput: ExpenseFilterInput,
): Promise<ExpenseServiceResult<Expense[]>> {
  const parsedFilter = parseExpenseFilter(filterInput);
  if (!parsedFilter.success) {
    return {
      ok: false,
      message: EXPENSE_COPY.invalidPeriod,
      errors: toExpenseErrorMap(parsedFilter.error),
    };
  }

  const expenses = await repository.listByFilter({
    ownerId,
    vehicleId: parsedFilter.data.vehicleId || undefined,
    category: toExpenseCategory(parsedFilter.data.category),
    startDate: parsedFilter.data.startDate,
    endDate: parsedFilter.data.endDate,
  });

  return {
    ok: true,
    data: expenses.sort(byNewest),
  };
}

export async function vehicleHasExpenses(
  repository: ExpenseRepository,
  ownerId: string,
  vehicleId: string,
): Promise<boolean> {
  return repository.hasVehicleExpenses(ownerId, vehicleId);
}
