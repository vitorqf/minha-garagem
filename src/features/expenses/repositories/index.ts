import type { ExpenseRepository } from "@/features/expenses/repositories/expense-repository";
import { InMemoryExpenseRepository } from "@/features/expenses/repositories/in-memory-expense-repository";
import { PrismaExpenseRepository } from "@/features/expenses/repositories/prisma-expense-repository";

const memoryRepository = new InMemoryExpenseRepository();
const prismaRepository = new PrismaExpenseRepository();

export function getExpenseRepository(): ExpenseRepository {
  if (process.env.VEHICLE_REPOSITORY === "memory" || process.env.EXPENSE_REPOSITORY === "memory") {
    return memoryRepository;
  }

  return prismaRepository;
}
