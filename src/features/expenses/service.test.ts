import { describe, expect, it, vi } from "vitest";

import {
  createExpense,
  deleteExpense,
  listExpenses,
  updateExpense,
} from "@/features/expenses/service";
import type { ExpenseRepository } from "@/features/expenses/repositories/expense-repository";
import type { VehicleRepository } from "@/features/vehicles/repositories/vehicle-repository";

describe("expense service", () => {
  it("creates expense and converts amount to cents", async () => {
    const repository: ExpenseRepository = {
      create: vi.fn().mockResolvedValue({
        id: "expense-1",
        ownerId: "owner-1",
        vehicleId: "vehicle-1",
        expenseDate: new Date("2026-03-01T00:00:00.000Z"),
        category: "fuel",
        amountCents: 12345,
        mileage: 12000,
        notes: "Abastecimento",
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
      update: vi.fn(),
      delete: vi.fn(),
      listByFilter: vi.fn(),
      hasVehicleExpenses: vi.fn(),
    };
    const vehicleRepository: VehicleRepository = {
      listByOwner: vi.fn(),
      findById: vi.fn().mockResolvedValue({
        id: "vehicle-1",
        ownerId: "owner-1",
        nickname: "Carro",
        brand: "Toyota",
        model: "Corolla",
        plate: null,
        year: 2020,
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
      findByOwnerAndPlate: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };

    const result = await createExpense(repository, vehicleRepository, "owner-1", {
      vehicleId: "vehicle-1",
      expenseDate: "2026-03-01",
      category: "fuel",
      amountInput: "123,45",
      mileage: "12000",
      notes: "Abastecimento",
    });

    expect(result.ok).toBe(true);
    expect(repository.create).toHaveBeenCalledWith({
      ownerId: "owner-1",
      vehicleId: "vehicle-1",
      expenseDate: "2026-03-01",
      category: "fuel",
      amountCents: 12345,
      mileage: 12000,
      notes: "Abastecimento",
    });
  });

  it("fails with validation errors for invalid input", async () => {
    const repository: ExpenseRepository = {
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      listByFilter: vi.fn(),
      hasVehicleExpenses: vi.fn(),
    };
    const vehicleRepository: VehicleRepository = {
      listByOwner: vi.fn(),
      findById: vi.fn(),
      findByOwnerAndPlate: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };

    const result = await createExpense(repository, vehicleRepository, "owner-1", {
      vehicleId: "",
      expenseDate: "",
      category: "",
      amountInput: "",
      mileage: undefined,
      notes: undefined,
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors?.vehicleId).toContain("Veículo");
      expect(result.errors?.expenseDate).toContain("Data");
      expect(result.errors?.category).toContain("Categoria");
      expect(result.errors?.amountInput).toContain("Valor");
    }
    expect(repository.create).not.toHaveBeenCalled();
  });

  it("updates and deletes an expense", async () => {
    const repository: ExpenseRepository = {
      create: vi.fn(),
      update: vi.fn().mockResolvedValue({
        id: "expense-1",
        ownerId: "owner-1",
        vehicleId: "vehicle-1",
        expenseDate: new Date("2026-03-01T00:00:00.000Z"),
        category: "parts",
        amountCents: 30000,
        mileage: 13000,
        notes: "Troca",
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
      delete: vi.fn().mockResolvedValue(true),
      listByFilter: vi.fn(),
      hasVehicleExpenses: vi.fn(),
    };
    const vehicleRepository: VehicleRepository = {
      listByOwner: vi.fn(),
      findById: vi.fn().mockResolvedValue({
        id: "vehicle-1",
        ownerId: "owner-1",
        nickname: "Carro",
        brand: "Toyota",
        model: "Corolla",
        plate: null,
        year: 2020,
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
      findByOwnerAndPlate: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };

    const updated = await updateExpense(repository, vehicleRepository, "owner-1", "expense-1", {
      vehicleId: "vehicle-1",
      expenseDate: "2026-03-01",
      category: "parts",
      amountInput: "300,00",
      mileage: "13000",
      notes: "Troca",
    });

    expect(updated.ok).toBe(true);
    expect(repository.update).toHaveBeenCalled();

    const deleted = await deleteExpense(repository, "owner-1", "expense-1");
    expect(deleted.ok).toBe(true);
    expect(repository.delete).toHaveBeenCalledWith("expense-1", "owner-1");
  });

  it("rejects create when vehicle does not belong to authenticated user", async () => {
    const repository: ExpenseRepository = {
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      listByFilter: vi.fn(),
      hasVehicleExpenses: vi.fn(),
    };
    const vehicleRepository: VehicleRepository = {
      listByOwner: vi.fn(),
      findById: vi.fn().mockResolvedValue(null),
      findByOwnerAndPlate: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };

    const result = await createExpense(repository, vehicleRepository, "owner-1", {
      vehicleId: "vehicle-2",
      expenseDate: "2026-03-01",
      category: "fuel",
      amountInput: "100,00",
      mileage: "",
      notes: "",
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors?.vehicleId).toContain("Veículo");
    }
    expect(repository.create).not.toHaveBeenCalled();
  });

  it("rejects update when target vehicle does not belong to authenticated user", async () => {
    const repository: ExpenseRepository = {
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      listByFilter: vi.fn(),
      hasVehicleExpenses: vi.fn(),
    };
    const vehicleRepository: VehicleRepository = {
      listByOwner: vi.fn(),
      findById: vi.fn().mockResolvedValue(null),
      findByOwnerAndPlate: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };

    const result = await updateExpense(repository, vehicleRepository, "owner-1", "expense-1", {
      vehicleId: "vehicle-2",
      expenseDate: "2026-03-01",
      category: "fuel",
      amountInput: "100,00",
      mileage: "",
      notes: "",
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors?.vehicleId).toContain("Veículo");
    }
    expect(repository.update).not.toHaveBeenCalled();
  });

  it("lists expenses by vehicle and date range (newest first)", async () => {
    const repository: ExpenseRepository = {
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      listByFilter: vi.fn().mockResolvedValue([
        {
          id: "expense-1",
          ownerId: "owner-1",
          vehicleId: "vehicle-1",
          expenseDate: new Date("2026-03-01T00:00:00.000Z"),
          category: "fuel",
          amountCents: 10000,
          mileage: null,
          notes: null,
          createdAt: new Date("2026-03-01T10:00:00.000Z"),
          updatedAt: new Date("2026-03-01T10:00:00.000Z"),
        },
        {
          id: "expense-2",
          ownerId: "owner-1",
          vehicleId: "vehicle-1",
          expenseDate: new Date("2026-03-10T00:00:00.000Z"),
          category: "service",
          amountCents: 25000,
          mileage: null,
          notes: null,
          createdAt: new Date("2026-03-10T10:00:00.000Z"),
          updatedAt: new Date("2026-03-10T10:00:00.000Z"),
        },
      ]),
      hasVehicleExpenses: vi.fn(),
    };

    const result = await listExpenses(repository, "owner-1", {
      vehicleId: "vehicle-1",
      category: "",
      startDate: "2026-03-01",
      endDate: "2026-03-31",
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.map((expense) => expense.id)).toEqual(["expense-2", "expense-1"]);
    }

    expect(repository.listByFilter).toHaveBeenCalledWith({
      ownerId: "owner-1",
      vehicleId: "vehicle-1",
      startDate: "2026-03-01",
      endDate: "2026-03-31",
    });
  });

  it("passes category filter to repository list", async () => {
    const repository: ExpenseRepository = {
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      listByFilter: vi.fn().mockResolvedValue([]),
      hasVehicleExpenses: vi.fn(),
    };

    const result = await listExpenses(repository, "owner-1", {
      vehicleId: "",
      category: "service",
      startDate: "2026-03-01",
      endDate: "2026-03-31",
    });

    expect(result.ok).toBe(true);
    expect(repository.listByFilter).toHaveBeenCalledWith({
      ownerId: "owner-1",
      vehicleId: undefined,
      category: "service",
      startDate: "2026-03-01",
      endDate: "2026-03-31",
    });
  });
});
