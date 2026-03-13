"use server";

import { revalidatePath } from "next/cache";

import { STUB_OWNER_ID } from "@/features/vehicles/constants";
import { EXPENSE_COPY } from "@/features/expenses/constants";
import { getExpenseRepository } from "@/features/expenses/repositories";
import {
  createExpense,
  deleteExpense,
  updateExpense,
} from "@/features/expenses/service";
import {
  parseExpenseFilter,
  parseExpenseFilterFormData,
  parseExpenseFormData,
  toExpenseErrorMap,
} from "@/features/expenses/validation";
import {
  initialExpenseFilterState,
  initialExpenseFormState,
  type ExpenseFilterState,
  type ExpenseFormState,
} from "@/features/expenses/types";

function toFormFailureState(
  message: string,
  errors?: ExpenseFormState["errors"],
): ExpenseFormState {
  return {
    status: "error",
    message,
    errors,
  };
}

export async function createExpenseAction(
  previousState: ExpenseFormState = initialExpenseFormState,
  formData: FormData,
): Promise<ExpenseFormState> {
  void previousState;
  const repository = getExpenseRepository();
  const input = parseExpenseFormData(formData);
  const result = await createExpense(repository, STUB_OWNER_ID, input);

  if (!result.ok) {
    return toFormFailureState(result.message, result.errors);
  }

  revalidatePath("/expenses");
  revalidatePath("/vehicles");

  return {
    status: "success",
    message: result.message,
    errors: {},
  };
}

export async function updateExpenseAction(
  previousState: ExpenseFormState = initialExpenseFormState,
  formData: FormData,
): Promise<ExpenseFormState> {
  void previousState;
  const id = String(formData.get("id") ?? "").trim();
  if (!id) {
    return toFormFailureState(EXPENSE_COPY.notFound, { form: EXPENSE_COPY.notFound });
  }

  const repository = getExpenseRepository();
  const input = parseExpenseFormData(formData);
  const result = await updateExpense(repository, STUB_OWNER_ID, id, input);

  if (!result.ok) {
    return toFormFailureState(result.message, result.errors);
  }

  revalidatePath("/expenses");
  revalidatePath("/vehicles");

  return {
    status: "success",
    message: result.message,
    errors: {},
  };
}

export async function deleteExpenseAction(formData: FormData): Promise<void> {
  const id = String(formData.get("id") ?? "").trim();
  if (!id) {
    return;
  }

  const repository = getExpenseRepository();
  const result = await deleteExpense(repository, STUB_OWNER_ID, id);

  if (result.ok) {
    revalidatePath("/expenses");
    revalidatePath("/vehicles");
  }
}

export async function applyExpenseFiltersAction(
  previousState: ExpenseFilterState = initialExpenseFilterState,
  formData: FormData,
): Promise<ExpenseFilterState> {
  void previousState;

  const filterInput = parseExpenseFilterFormData(formData);
  const parsed = parseExpenseFilter({
    vehicleId: filterInput.vehicleId,
    startDate: filterInput.startDate,
    endDate: filterInput.endDate,
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: EXPENSE_COPY.invalidPeriod,
      errors: {
        startDate: toExpenseErrorMap(parsed.error).startDate,
        endDate: toExpenseErrorMap(parsed.error).endDate,
        period: toExpenseErrorMap(parsed.error).period,
      },
      filters: {
        vehicleId: filterInput.vehicleId,
        startDate: filterInput.startDate,
        endDate: filterInput.endDate,
      },
    };
  }

  return {
    status: "success",
    filters: {
      vehicleId: parsed.data.vehicleId || "",
      startDate: parsed.data.startDate,
      endDate: parsed.data.endDate,
    },
    errors: {},
  };
}
