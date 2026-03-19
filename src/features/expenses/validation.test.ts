import { describe, expect, it } from "vitest";

import {
  parseExpenseFilter,
  parseExpenseInput,
  parseMonetaryInputToCents,
} from "@/features/expenses/validation";

describe("expense validation", () => {
  it("requires date, vehicleId, category and amount", () => {
    const parsed = parseExpenseInput({
      expenseDate: "",
      vehicleId: "",
      category: "",
      amountInput: "",
      mileage: undefined,
      notes: undefined,
    });

    expect(parsed.success).toBe(false);
    if (!parsed.success) {
      expect(parsed.error.flatten().fieldErrors.expenseDate?.[0]).toContain("Data");
      expect(parsed.error.flatten().fieldErrors.vehicleId?.[0]).toContain("Veículo");
      expect(parsed.error.flatten().fieldErrors.category?.[0]).toContain("Categoria");
      expect(parsed.error.flatten().fieldErrors.amountInput?.[0]).toContain("Valor");
    }
  });

  it("rejects impossible calendar dates", () => {
    const invalidExpenseDate = parseExpenseInput({
      expenseDate: "2026-02-31",
      vehicleId: "vehicle-1",
      category: "fuel",
      amountInput: "120,00",
      mileage: undefined,
      notes: undefined,
    });

    expect(invalidExpenseDate.success).toBe(false);
    if (!invalidExpenseDate.success) {
      expect(invalidExpenseDate.error.flatten().fieldErrors.expenseDate?.[0]).toContain("Data");
    }

    const invalidFilterDate = parseExpenseFilter({
      vehicleId: "",
      category: "",
      startDate: "2026-02-31",
      endDate: "2026-03-01",
    });

    expect(invalidFilterDate.success).toBe(false);
    if (!invalidFilterDate.success) {
      expect(invalidFilterDate.error.flatten().fieldErrors.startDate?.[0]).toContain("Data");
    }
  });

  it("converts BRL decimal input to cents", () => {
    expect(parseMonetaryInputToCents("123,45")).toBe(12345);
    expect(parseMonetaryInputToCents(" 1.234,56 ")).toBe(123456);
    expect(parseMonetaryInputToCents("99.90")).toBe(9990);
  });

  it("rejects unsupported category", () => {
    const parsed = parseExpenseInput({
      expenseDate: "2026-03-01",
      vehicleId: "vehicle-1",
      category: "insurance",
      amountInput: "100,00",
      mileage: undefined,
      notes: undefined,
    });

    expect(parsed.success).toBe(false);
    if (!parsed.success) {
      expect(parsed.error.flatten().fieldErrors.category?.[0]).toContain("Categoria");
    }
  });

  it("validates period range with inclusive start and end", () => {
    const invalidRange = parseExpenseFilter({
      vehicleId: "",
      category: "",
      startDate: "2026-03-31",
      endDate: "2026-03-01",
    });

    expect(invalidRange.success).toBe(false);

    const validRange = parseExpenseFilter({
      vehicleId: "",
      category: "fuel",
      startDate: "2026-03-01",
      endDate: "2026-03-31",
    });

    expect(validRange.success).toBe(true);
  });

  it("accepts supported category and rejects unsupported category in filters", () => {
    const validCategory = parseExpenseFilter({
      vehicleId: "",
      category: "parts",
      startDate: "2026-03-01",
      endDate: "2026-03-31",
    });

    expect(validCategory.success).toBe(true);

    const invalidCategory = parseExpenseFilter({
      vehicleId: "",
      category: "insurance",
      startDate: "2026-03-01",
      endDate: "2026-03-31",
    });

    expect(invalidCategory.success).toBe(false);
    if (!invalidCategory.success) {
      expect(invalidCategory.error.flatten().fieldErrors.category?.[0]).toContain("Categoria");
    }
  });

  it("enforces mileage positive integer and notes max 500 chars", () => {
    const invalidMileage = parseExpenseInput({
      expenseDate: "2026-03-01",
      vehicleId: "vehicle-1",
      category: "fuel",
      amountInput: "120,00",
      mileage: "-1",
      notes: "ok",
    });

    expect(invalidMileage.success).toBe(false);

    const longNotes = parseExpenseInput({
      expenseDate: "2026-03-01",
      vehicleId: "vehicle-1",
      category: "fuel",
      amountInput: "120,00",
      mileage: "12345",
      notes: "x".repeat(501),
    });

    expect(longNotes.success).toBe(false);
  });
});
