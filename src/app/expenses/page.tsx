import {
  applyExpenseFiltersAction,
  createExpenseAction,
  deleteExpenseAction,
  updateExpenseAction,
} from "@/features/expenses/actions";
import { requireAuthenticatedOwnerId } from "@/features/auth/session";
import { ExpensesPageClient } from "@/features/expenses/components/expenses-page-client";
import { formatBrlFromCents, getDefaultExpenseRange } from "@/features/expenses/format";
import { getExpenseRepository } from "@/features/expenses/repositories";
import { listExpenses } from "@/features/expenses/service";
import type { ExpenseFilterInput, ExpenseViewModel, VehicleOption } from "@/features/expenses/types";
import { getVehicleRepository } from "@/features/vehicles/repositories";
import { listVehicles } from "@/features/vehicles/vehicle-service";

export const runtime = "nodejs";

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function toSingleValue(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

function buildFilters(
  query: Record<string, string | string[] | undefined> | undefined,
): ExpenseFilterInput {
  const defaults = getDefaultExpenseRange();

  return {
    vehicleId: toSingleValue(query?.vehicleId) ?? "",
    startDate: toSingleValue(query?.startDate) ?? defaults.startDate,
    endDate: toSingleValue(query?.endDate) ?? defaults.endDate,
  };
}

function toVehicleOptions(
  vehicles: Awaited<ReturnType<typeof listVehicles>>,
): VehicleOption[] {
  return vehicles.map((vehicle) => ({
    id: vehicle.id,
    label: `${vehicle.nickname} (${vehicle.brand} ${vehicle.model})`,
  }));
}

function toExpenseViewModels(
  expenses: Awaited<ReturnType<typeof listExpenses>>,
  vehicleOptions: VehicleOption[],
): ExpenseViewModel[] {
  if (!expenses.ok) {
    return [];
  }

  const labels = new Map(vehicleOptions.map((vehicle) => [vehicle.id, vehicle.label]));

  return expenses.data.map((expense) => ({
    id: expense.id,
    vehicleId: expense.vehicleId,
    vehicleLabel: labels.get(expense.vehicleId) ?? expense.vehicleId,
    expenseDate: expense.expenseDate.toISOString().slice(0, 10),
    category: expense.category,
    amountCents: expense.amountCents,
    amountLabel: formatBrlFromCents(expense.amountCents),
    mileage: expense.mileage,
    notes: expense.notes,
    createdAt: expense.createdAt.toISOString(),
  }));
}

export default async function ExpensesPage({ searchParams }: PageProps) {
  const ownerId = await requireAuthenticatedOwnerId();
  const query = await searchParams;
  const filters = buildFilters(query);

  const vehicleRepository = getVehicleRepository();
  const expenseRepository = getExpenseRepository();

  const [vehicles, expenses] = await Promise.all([
    listVehicles(vehicleRepository, ownerId),
    listExpenses(expenseRepository, ownerId, filters),
  ]);

  const vehicleOptions = toVehicleOptions(vehicles);
  const expenseViewModels = toExpenseViewModels(expenses, vehicleOptions);

  return (
    <ExpensesPageClient
      vehicles={vehicleOptions}
      expenses={expenseViewModels}
      defaultFilters={filters}
      createExpenseAction={createExpenseAction}
      updateExpenseAction={updateExpenseAction}
      applyExpenseFiltersAction={applyExpenseFiltersAction}
      deleteExpenseAction={deleteExpenseAction}
    />
  );
}
