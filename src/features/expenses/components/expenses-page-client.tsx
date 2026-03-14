"use client";

import Link from "next/link";
import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";

import { ExpenseFormFields } from "@/features/expenses/components/expense-form-fields";
import { ExpensesList } from "@/features/expenses/components/expenses-list";
import {
  initialExpenseFormState,
  type ExpenseFilterState,
  type ExpenseFormState,
  type ExpenseViewModel,
  type VehicleOption,
} from "@/features/expenses/types";

type ExpenseMutationAction = (
  state: ExpenseFormState,
  formData: FormData,
) => Promise<ExpenseFormState>;

type ExpenseFilterAction = (
  state: ExpenseFilterState,
  formData: FormData,
) => Promise<ExpenseFilterState>;

type ExpenseDeleteAction = (formData: FormData) => Promise<void>;

type ExpensesPageClientProps = {
  vehicles: VehicleOption[];
  expenses: ExpenseViewModel[];
  defaultFilters: { startDate: string; endDate: string; vehicleId?: string };
  createExpenseAction: ExpenseMutationAction;
  updateExpenseAction: ExpenseMutationAction;
  applyExpenseFiltersAction: ExpenseFilterAction;
  deleteExpenseAction: ExpenseDeleteAction;
  initialCreateState?: ExpenseFormState;
};

function buildExpenseExportHref(defaultFilters: {
  startDate: string;
  endDate: string;
  vehicleId?: string;
}): string {
  const searchParams = new URLSearchParams();
  searchParams.set("startDate", defaultFilters.startDate);
  searchParams.set("endDate", defaultFilters.endDate);

  if (defaultFilters.vehicleId) {
    searchParams.set("vehicleId", defaultFilters.vehicleId);
  }

  return `/api/reports/expenses.csv?${searchParams.toString()}`;
}

function CreateSubmitButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending || disabled}
      className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
    >
      {pending ? "Salvando..." : "Adicionar despesa"}
    </button>
  );
}

export function ExpensesPageClient({
  vehicles,
  expenses,
  defaultFilters,
  createExpenseAction,
  updateExpenseAction,
  applyExpenseFiltersAction,
  deleteExpenseAction,
  initialCreateState = initialExpenseFormState,
}: ExpensesPageClientProps) {
  void applyExpenseFiltersAction;
  const [createState, createFormAction] = useActionState(
    createExpenseAction,
    initialCreateState,
  );
  const createFormRef = useRef<HTMLFormElement>(null);
  const canCreateExpenses = vehicles.length > 0;
  const exportHref = buildExpenseExportHref(defaultFilters);

  useEffect(() => {
    if (createState.status === "success") {
      createFormRef.current?.reset();
    }
  }, [createState.status]);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6">
      <header className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Despesas</h1>
        <p className="text-sm text-zinc-600">
          Registre gastos dos veículos e acompanhe os lançamentos por período.
        </p>
      </header>

      <section className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-zinc-900">Filtros</h2>

        <form action="/expenses" className="grid gap-3 sm:grid-cols-4">
          <div>
            <label className="mb-1 block text-sm font-medium" htmlFor="filters-vehicleId">
              Veículo
            </label>
            <select
              id="filters-vehicleId"
              name="vehicleId"
              defaultValue={defaultFilters.vehicleId ?? ""}
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
            >
              <option value="">Todos</option>
              {vehicles.map((vehicle) => (
                <option key={vehicle.id} value={vehicle.id}>
                  {vehicle.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium" htmlFor="filters-startDate">
              Data inicial
            </label>
            <input
              id="filters-startDate"
              name="startDate"
              type="date"
              defaultValue={defaultFilters.startDate}
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium" htmlFor="filters-endDate">
              Data final
            </label>
            <input
              id="filters-endDate"
              name="endDate"
              type="date"
              defaultValue={defaultFilters.endDate}
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="w-full rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white"
            >
              Aplicar filtros
            </button>
          </div>
        </form>

        <div className="mt-3 flex justify-end">
          <a
            href={exportHref}
            className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-800 transition-colors hover:bg-zinc-100"
          >
            Exportar CSV
          </a>
        </div>
      </section>

      <section className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-zinc-900">Nova despesa</h2>

        {!canCreateExpenses ? (
          <div className="rounded-lg border border-dashed border-zinc-300 bg-zinc-50 p-4">
            <p className="text-sm text-zinc-700">Cadastre um veículo antes de lançar despesas.</p>
            <Link href="/vehicles" className="mt-2 inline-block text-sm font-semibold text-emerald-700">
              Ir para veículos
            </Link>
          </div>
        ) : null}

        <form ref={createFormRef} action={createFormAction} className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <ExpenseFormFields
              idPrefix="create-expense"
              vehicles={vehicles}
              errors={createState.errors}
              disabled={!canCreateExpenses}
            />
          </div>

          {createState.message ? (
            <p
              className={`text-sm ${
                createState.status === "success" ? "text-emerald-700" : "text-red-700"
              }`}
            >
              {createState.message}
            </p>
          ) : null}

          <CreateSubmitButton disabled={!canCreateExpenses} />
        </form>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-zinc-900">Lançamentos</h2>
        <ExpensesList
          expenses={expenses}
          vehicles={vehicles}
          updateExpenseAction={updateExpenseAction}
          deleteExpenseAction={deleteExpenseAction}
        />
      </section>
    </main>
  );
}
