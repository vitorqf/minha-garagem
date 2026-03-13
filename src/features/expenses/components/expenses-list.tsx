"use client";

import { useActionState, useMemo, useState } from "react";
import { useFormStatus } from "react-dom";

import { ExpenseFormFields } from "@/features/expenses/components/expense-form-fields";
import {
  initialExpenseFormState,
  type ExpenseFormState,
  type ExpenseViewModel,
  type VehicleOption,
} from "@/features/expenses/types";

type ExpenseMutationAction = (
  state: ExpenseFormState,
  formData: FormData,
) => Promise<ExpenseFormState>;

type ExpenseDeleteAction = (formData: FormData) => Promise<void>;

type ExpensesListProps = {
  expenses: ExpenseViewModel[];
  vehicles: VehicleOption[];
  updateExpenseAction: ExpenseMutationAction;
  deleteExpenseAction: ExpenseDeleteAction;
};

function SubmitButton({
  label,
  pendingLabel,
  className,
}: {
  label: string;
  pendingLabel: string;
  className: string;
}) {
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending} className={className}>
      {pending ? pendingLabel : label}
    </button>
  );
}

function EditableExpenseRow({
  expense,
  vehicles,
  updateExpenseAction,
  deleteExpenseAction,
}: {
  expense: ExpenseViewModel;
  vehicles: VehicleOption[];
  updateExpenseAction: ExpenseMutationAction;
  deleteExpenseAction: ExpenseDeleteAction;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [updateState, updateFormAction] = useActionState(
    async (previousState: ExpenseFormState, formData: FormData) => {
      const result = await updateExpenseAction(previousState, formData);
      if (result.status === "success") {
        setIsEditing(false);
      }
      return result;
    },
    initialExpenseFormState,
  );

  return (
    <li data-testid="expense-row" className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
      {!isEditing ? (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <p data-testid="expense-row-title" className="text-base font-semibold text-zinc-900">
              {expense.expenseDate} · {expense.vehicleLabel}
            </p>
            <p className="text-sm text-zinc-600">
              {expense.amountLabel} · {expense.category}
              {expense.mileage ? ` · ${expense.mileage} km` : ""}
            </p>
            {expense.notes ? <p className="text-sm text-zinc-600">{expense.notes}</p> : null}
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="rounded-lg border border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-800"
            >
              Editar
            </button>

            <form action={deleteExpenseAction}>
              <input type="hidden" name="id" value={expense.id} />
              <SubmitButton
                label="Excluir"
                pendingLabel="Excluindo..."
                className="rounded-lg bg-red-700 px-3 py-2 text-sm font-medium text-white"
              />
            </form>
          </div>
        </div>
      ) : (
        <form action={updateFormAction} className="space-y-3">
          <input type="hidden" name="id" value={expense.id} />
          <div className="grid gap-3 sm:grid-cols-2">
            <ExpenseFormFields
              idPrefix={`edit-${expense.id}`}
              vehicles={vehicles}
              values={{
                vehicleId: expense.vehicleId,
                expenseDate: expense.expenseDate,
                category: expense.category,
                amountInput: (expense.amountCents / 100).toFixed(2).replace(".", ","),
                mileage: expense.mileage,
                notes: expense.notes,
              }}
              errors={updateState.errors}
            />
          </div>

          {updateState.message ? (
            <p
              className={`text-sm ${
                updateState.status === "success" ? "text-emerald-700" : "text-red-700"
              }`}
            >
              {updateState.message}
            </p>
          ) : null}

          <div className="flex gap-2">
            <SubmitButton
              label="Salvar"
              pendingLabel="Salvando..."
              className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white"
            />
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-800"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}
    </li>
  );
}

export function ExpensesList({
  expenses,
  vehicles,
  updateExpenseAction,
  deleteExpenseAction,
}: ExpensesListProps) {
  const sortedExpenses = useMemo(
    () =>
      [...expenses].sort((a, b) => {
        const dateDiff = Date.parse(b.expenseDate) - Date.parse(a.expenseDate);
        if (dateDiff !== 0) {
          return dateDiff;
        }
        return Date.parse(b.createdAt) - Date.parse(a.createdAt);
      }),
    [expenses],
  );

  if (sortedExpenses.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-zinc-300 bg-white p-6 text-center">
        <p className="text-sm text-zinc-600">Nenhuma despesa encontrada no período selecionado.</p>
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {sortedExpenses.map((expense) => (
        <EditableExpenseRow
          key={expense.id}
          expense={expense}
          vehicles={vehicles}
          updateExpenseAction={updateExpenseAction}
          deleteExpenseAction={deleteExpenseAction}
        />
      ))}
    </ul>
  );
}
