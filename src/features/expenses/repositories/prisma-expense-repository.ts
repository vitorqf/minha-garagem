import { prisma } from "@/lib/prisma";
import type {
  Expense,
  ExpenseCreateData,
  ExpenseUpdateData,
} from "@/features/expenses/types";
import type {
  ExpenseListFilter,
  ExpenseRepository,
} from "@/features/expenses/repositories/expense-repository";

export class PrismaExpenseRepository implements ExpenseRepository {
  async create(data: ExpenseCreateData): Promise<Expense> {
    return prisma.expense.create({
      data: {
        ownerId: data.ownerId,
        vehicleId: data.vehicleId,
        expenseDate: new Date(`${data.expenseDate}T00:00:00.000Z`),
        category: data.category,
        amountCents: data.amountCents,
        mileage: data.mileage ?? null,
        notes: data.notes ?? null,
      },
    });
  }

  async update(id: string, ownerId: string, data: ExpenseUpdateData): Promise<Expense | null> {
    const existing = await prisma.expense.findFirst({
      where: { id, ownerId },
      select: { id: true },
    });

    if (!existing) {
      return null;
    }

    return prisma.expense.update({
      where: { id: existing.id },
      data: {
        vehicleId: data.vehicleId,
        expenseDate: new Date(`${data.expenseDate}T00:00:00.000Z`),
        category: data.category,
        amountCents: data.amountCents,
        mileage: data.mileage ?? null,
        notes: data.notes ?? null,
      },
    });
  }

  async delete(id: string, ownerId: string): Promise<boolean> {
    const existing = await prisma.expense.findFirst({
      where: { id, ownerId },
      select: { id: true },
    });

    if (!existing) {
      return false;
    }

    await prisma.expense.delete({
      where: { id: existing.id },
    });

    return true;
  }

  async listByFilter(filter: ExpenseListFilter): Promise<Expense[]> {
    return prisma.expense.findMany({
      where: {
        ownerId: filter.ownerId,
        vehicleId: filter.vehicleId || undefined,
        category: filter.category || undefined,
        expenseDate: {
          gte: new Date(`${filter.startDate}T00:00:00.000Z`),
          lte: new Date(`${filter.endDate}T23:59:59.999Z`),
        },
      },
      orderBy: [{ expenseDate: "desc" }, { createdAt: "desc" }],
    });
  }

  async hasVehicleExpenses(ownerId: string, vehicleId: string): Promise<boolean> {
    const count = await prisma.expense.count({
      where: { ownerId, vehicleId },
    });

    return count > 0;
  }
}
