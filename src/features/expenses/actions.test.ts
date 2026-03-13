import { beforeEach, describe, expect, it, vi } from "vitest";

const mockCreateExpense = vi.fn();
const mockUpdateExpense = vi.fn();
const mockDeleteExpense = vi.fn();
const mockListExpenses = vi.fn();
const mockGetExpenseRepository = vi.fn();
const mockRevalidatePath = vi.fn();

vi.mock("next/cache", () => ({
  revalidatePath: (path: string) => mockRevalidatePath(path),
}));

vi.mock("@/features/expenses/service", () => ({
  createExpense: (...args: unknown[]) => mockCreateExpense(...args),
  updateExpense: (...args: unknown[]) => mockUpdateExpense(...args),
  deleteExpense: (...args: unknown[]) => mockDeleteExpense(...args),
  listExpenses: (...args: unknown[]) => mockListExpenses(...args),
}));

vi.mock("@/features/expenses/repositories", () => ({
  getExpenseRepository: () => mockGetExpenseRepository(),
}));

describe("expense actions", () => {
  beforeEach(() => {
    vi.resetModules();
    mockCreateExpense.mockReset();
    mockUpdateExpense.mockReset();
    mockDeleteExpense.mockReset();
    mockListExpenses.mockReset();
    mockGetExpenseRepository.mockReset();
    mockRevalidatePath.mockReset();
    mockGetExpenseRepository.mockReturnValue({});
  });

  it("maps service errors to pt-BR form state", async () => {
    const formData = new FormData();
    formData.set("vehicleId", "");

    mockCreateExpense.mockResolvedValue({
      ok: false,
      message: "Não foi possível salvar a despesa.",
      errors: { vehicleId: "Veículo é obrigatório." },
    });

    const { createExpenseAction } = await import("@/features/expenses/actions");

    const state = await createExpenseAction(undefined, formData);

    expect(state.status).toBe("error");
    expect(state.message).toContain("despesa");
    expect(state.errors?.vehicleId).toContain("Veículo");
    expect(mockRevalidatePath).not.toHaveBeenCalled();
  });

  it("revalidates /expenses and /vehicles after successful mutations", async () => {
    mockCreateExpense.mockResolvedValue({
      ok: true,
      data: {},
      message: "Despesa cadastrada com sucesso.",
    });

    mockUpdateExpense.mockResolvedValue({
      ok: true,
      data: {},
      message: "Despesa atualizada com sucesso.",
    });

    mockDeleteExpense.mockResolvedValue({
      ok: true,
      data: true,
      message: "Despesa removida com sucesso.",
    });

    const { createExpenseAction, updateExpenseAction, deleteExpenseAction } = await import(
      "@/features/expenses/actions"
    );

    const createData = new FormData();
    createData.set("vehicleId", "vehicle-1");
    createData.set("expenseDate", "2026-03-10");
    createData.set("category", "fuel");
    createData.set("amountInput", "99,90");
    await createExpenseAction(undefined, createData);

    const updateData = new FormData();
    updateData.set("id", "expense-1");
    updateData.set("vehicleId", "vehicle-1");
    updateData.set("expenseDate", "2026-03-10");
    updateData.set("category", "fuel");
    updateData.set("amountInput", "100,00");
    await updateExpenseAction(undefined, updateData);

    const deleteData = new FormData();
    deleteData.set("id", "expense-1");
    await deleteExpenseAction(deleteData);

    expect(mockRevalidatePath).toHaveBeenCalledWith("/expenses");
    expect(mockRevalidatePath).toHaveBeenCalledWith("/vehicles");
  });
});
