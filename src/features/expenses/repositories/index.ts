import type { ExpenseRepository } from "@/features/expenses/repositories/expense-repository";
import { InMemoryExpenseRepository } from "@/features/expenses/repositories/in-memory-expense-repository";
import { PrismaExpenseRepository } from "@/features/expenses/repositories/prisma-expense-repository";

const globalForExpenseRepository = globalThis as unknown as {
  expenseMemoryRepository: InMemoryExpenseRepository | undefined;
  expensePrismaRepository: PrismaExpenseRepository | undefined;
};

const memoryRepository =
  globalForExpenseRepository.expenseMemoryRepository ?? new InMemoryExpenseRepository();
const prismaRepository =
  globalForExpenseRepository.expensePrismaRepository ?? new PrismaExpenseRepository();

if (process.env.NODE_ENV !== "production") {
  globalForExpenseRepository.expenseMemoryRepository = memoryRepository;
  globalForExpenseRepository.expensePrismaRepository = prismaRepository;
}

export function getExpenseRepository(): ExpenseRepository {
  if (process.env.VEHICLE_REPOSITORY === "memory" || process.env.EXPENSE_REPOSITORY === "memory") {
    return memoryRepository;
  }

  return prismaRepository;
}
