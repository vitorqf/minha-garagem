import type {
  ExpenseCreateData,
  ExpenseUpdateData,
  Expense,
} from "@/features/expenses/types";
import type {
  ExpenseListFilter,
  ExpenseRepository,
} from "@/features/expenses/repositories/expense-repository";

const byNewest = (a: Expense, b: Expense) => {
  const byDate = b.expenseDate.getTime() - a.expenseDate.getTime();
  if (byDate !== 0) {
    return byDate;
  }
  return b.createdAt.getTime() - a.createdAt.getTime();
};

export class InMemoryExpenseRepository implements ExpenseRepository {
  private readonly expenses: Expense[] = [];

  async create(data: ExpenseCreateData): Promise<Expense> {
    const now = new Date();
    const expense: Expense = {
      id: crypto.randomUUID(),
      ownerId: data.ownerId,
      vehicleId: data.vehicleId,
      expenseDate: new Date(`${data.expenseDate}T00:00:00.000Z`),
      category: data.category,
      amountCents: data.amountCents,
      mileage: data.mileage ?? null,
      notes: data.notes ?? null,
      createdAt: now,
      updatedAt: now,
    };

    this.expenses.push(expense);
    return { ...expense };
  }

  async update(id: string, ownerId: string, data: ExpenseUpdateData): Promise<Expense | null> {
    const index = this.expenses.findIndex((item) => item.id === id && item.ownerId === ownerId);
    if (index === -1) {
      return null;
    }

    const previous = this.expenses[index];
    const updated: Expense = {
      ...previous,
      vehicleId: data.vehicleId,
      expenseDate: new Date(`${data.expenseDate}T00:00:00.000Z`),
      category: data.category,
      amountCents: data.amountCents,
      mileage: data.mileage ?? null,
      notes: data.notes ?? null,
      updatedAt: new Date(),
    };

    this.expenses[index] = updated;
    return { ...updated };
  }

  async delete(id: string, ownerId: string): Promise<boolean> {
    const previousLength = this.expenses.length;
    const filtered = this.expenses.filter((item) => !(item.id === id && item.ownerId === ownerId));

    if (filtered.length === previousLength) {
      return false;
    }

    this.expenses.splice(0, this.expenses.length, ...filtered);
    return true;
  }

  async listByFilter(filter: ExpenseListFilter): Promise<Expense[]> {
    const start = new Date(`${filter.startDate}T00:00:00.000Z`).getTime();
    const end = new Date(`${filter.endDate}T23:59:59.999Z`).getTime();

    return this.expenses
      .filter((item) => {
        if (item.ownerId !== filter.ownerId) {
          return false;
        }

        if (filter.vehicleId && item.vehicleId !== filter.vehicleId) {
          return false;
        }

        if (filter.category && item.category !== filter.category) {
          return false;
        }

        const expenseTime = item.expenseDate.getTime();
        return expenseTime >= start && expenseTime <= end;
      })
      .sort(byNewest)
      .map((item) => ({ ...item }));
  }

  async hasVehicleExpenses(ownerId: string, vehicleId: string): Promise<boolean> {
    return this.expenses.some((item) => item.ownerId === ownerId && item.vehicleId === vehicleId);
  }
}
