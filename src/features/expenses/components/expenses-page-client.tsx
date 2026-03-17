"use client";

import Link from "next/link";
import { useActionState, useEffect, useMemo, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { CalendarDays, CarFront, Filter } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ExpenseFormFields } from "@/features/expenses/components/expense-form-fields";
import { ExpensesList } from "@/features/expenses/components/expenses-list";
import {
  initialExpenseFormState,
  type ExpenseFilterState,
  type ExpenseFormState,
  type ExpenseViewModel,
  type VehicleOption,
} from "@/features/expenses/types";

const OPEN_CREATE_EVENT = "open-create-expense";

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
  defaultFilters: { startDate: string; endDate: string; vehicleId?: string; category?: string };
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
  category?: string;
}): string {
  const searchParams = new URLSearchParams();
  searchParams.set("startDate", defaultFilters.startDate);
  searchParams.set("endDate", defaultFilters.endDate);

  if (defaultFilters.vehicleId) {
    searchParams.set("vehicleId", defaultFilters.vehicleId);
  }

  if (defaultFilters.category) {
    searchParams.set("category", defaultFilters.category);
  }

  return `/api/reports/expenses.csv?${searchParams.toString()}`;
}

function formatCurrencyFromCents(amountCents: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(amountCents / 100);
}

function CreateSubmitButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending || disabled} className="h-12 min-w-44 text-base font-bold">
      {pending ? "Salvando..." : "Salvar Gasto"}
    </Button>
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
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const createFormRef = useRef<HTMLFormElement>(null);
  const [createState, createFormAction] = useActionState(
    async (previousState: ExpenseFormState, formData: FormData) => {
      const result = await createExpenseAction(previousState, formData);
      if (result.status === "success") {
        createFormRef.current?.reset();
        setIsCreateOpen(false);
      }

      return result;
    },
    initialCreateState,
  );
  const canCreateExpenses = vehicles.length > 0;
  const exportHref = buildExpenseExportHref(defaultFilters);
  const totalPeriod = useMemo(
    () => expenses.reduce((acc, expense) => acc + expense.amountCents, 0),
    [expenses],
  );

  useEffect(() => {
    const openModal = () => setIsCreateOpen(true);
    window.addEventListener(OPEN_CREATE_EVENT, openModal);
    return () => window.removeEventListener(OPEN_CREATE_EVENT, openModal);
  }, []);

  return (
    <div className="space-y-5">
      <Card>
        <CardContent className="space-y-4 p-4 md:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <form action="/expenses" className="flex flex-wrap items-center gap-2 md:gap-3">
              <label className="sr-only" htmlFor="filters-vehicleId">
                Veículo
              </label>
              <div className="relative">
                <CarFront className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[#7085A4]" />
                <select
                  id="filters-vehicleId"
                  name="vehicleId"
                  defaultValue={defaultFilters.vehicleId ?? ""}
                  className="h-12 rounded-full border border-[#D3DCEA] bg-[#F8FBFF] py-2 pr-3 pl-9 text-sm text-[#1E3658]"
                >
                  <option value="">Todos os Veículos</option>
                  {vehicles.map((vehicle) => (
                    <option key={vehicle.id} value={vehicle.id}>
                      {vehicle.label}
                    </option>
                  ))}
                </select>
              </div>

              <label className="sr-only" htmlFor="filters-startDate">
                Data inicial
              </label>
              <div className="relative">
                <CalendarDays className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[#7085A4]" />
                <input
                  id="filters-startDate"
                  name="startDate"
                  type="date"
                  defaultValue={defaultFilters.startDate}
                  className="h-12 rounded-full border border-[#D3DCEA] bg-[#F8FBFF] py-2 pr-3 pl-9 text-sm text-[#1E3658]"
                />
              </div>

              <label className="sr-only" htmlFor="filters-endDate">
                Data final
              </label>
              <input
                id="filters-endDate"
                name="endDate"
                type="date"
                defaultValue={defaultFilters.endDate}
                className="h-12 rounded-full border border-[#D3DCEA] bg-[#F8FBFF] px-3 py-2 text-sm text-[#1E3658]"
              />

              <label className="sr-only" htmlFor="filters-category">
                Categoria
              </label>
              <div className="relative">
                <Filter className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[#7085A4]" />
                <select
                  id="filters-category"
                  name="category"
                  defaultValue={defaultFilters.category ?? ""}
                  className="h-12 rounded-full border border-[#D3DCEA] bg-[#F8FBFF] py-2 pr-3 pl-9 text-sm text-[#1E3658]"
                >
                  <option value="">Todas as Categorias</option>
                  <option value="fuel">Combustível</option>
                  <option value="parts">Peças</option>
                  <option value="service">Serviço</option>
                </select>
              </div>

              <Button type="submit" variant="outline" className="h-12 rounded-full">
                Aplicar filtros
              </Button>
            </form>

            <div className="flex flex-col items-end gap-2">
              <p className="text-base text-[#5E7391]">
                Total no período:{" "}
                <strong className="text-2xl font-extrabold text-[#101C33]">{formatCurrencyFromCents(totalPeriod)}</strong>
              </p>
              <a
                href={exportHref}
                className="inline-flex h-11 items-center rounded-full border border-[#D3DCEA] bg-white px-4 text-sm font-semibold text-[#2A3E5B] transition-colors hover:bg-[#F4F8FF]"
              >
                Exportar CSV
              </a>
            </div>
          </div>
        </CardContent>
      </Card>

      {createState.message ? (
        <p
          className={`rounded-xl border px-4 py-2 text-sm ${
            createState.status === "success"
              ? "border-[#BFE8CF] bg-[#F1FCF5] text-[#17854B]"
              : "border-[#F2C4C0] bg-[#FFF3F2] text-[#C24740]"
          }`}
        >
          {createState.message}
        </p>
      ) : null}

      {!canCreateExpenses ? (
        <Card>
          <CardContent className="space-y-2 py-6 text-center">
            <p className="text-base text-[#5E7391]">Cadastre um veículo antes de lançar despesas.</p>
            <Link href="/vehicles" className="text-sm font-semibold text-[#2F84EB]">
              Ir para veículos
            </Link>
          </CardContent>
        </Card>
      ) : null}

      <Card>
        <CardContent className="overflow-hidden p-0">
          <ExpensesList
            expenses={expenses}
            vehicles={vehicles}
            updateExpenseAction={updateExpenseAction}
            deleteExpenseAction={deleteExpenseAction}
          />
        </CardContent>
      </Card>

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-2xl">Adicionar Gasto</DialogTitle>
            <DialogDescription>Preencha os dados abaixo para registrar a despesa.</DialogDescription>
          </DialogHeader>

          <form ref={createFormRef} action={createFormAction} className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <ExpenseFormFields
                idPrefix="create-expense"
                vehicles={vehicles}
                errors={createState.errors}
                disabled={!canCreateExpenses}
              />
            </div>

            <DialogFooter className="justify-between sm:justify-between">
              <Button type="button" variant="outline" className="h-12 min-w-44 text-base" onClick={() => setIsCreateOpen(false)}>
                Cancelar
              </Button>
              <CreateSubmitButton disabled={!canCreateExpenses} />
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
