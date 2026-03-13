import { describe, expect, it } from "vitest";

import { InMemoryExpenseRepository } from "@/features/expenses/repositories/in-memory-expense-repository";
import { InMemoryVehicleRepository } from "@/features/vehicles/repositories/in-memory-vehicle-repository";
import { getVehicleSummaries } from "@/features/summaries/service";

describe("summary service", () => {
  it("aggregates totals by vehicle, month and category including zero-total vehicles", async () => {
    const ownerId = "owner-1";
    const vehicleRepository = new InMemoryVehicleRepository();
    const expenseRepository = new InMemoryExpenseRepository();

    const vehicleA = await vehicleRepository.create({
      ownerId,
      nickname: "Carro A",
      brand: "Toyota",
      model: "Corolla",
      plate: undefined,
      year: 2020,
    });

    const vehicleB = await vehicleRepository.create({
      ownerId,
      nickname: "Carro B",
      brand: "Honda",
      model: "Fit",
      plate: undefined,
      year: 2018,
    });

    await expenseRepository.create({
      ownerId,
      vehicleId: vehicleA.id,
      expenseDate: "2026-01-10",
      category: "fuel",
      amountCents: 10000,
      mileage: 12000,
      notes: "Janeiro",
    });

    await expenseRepository.create({
      ownerId,
      vehicleId: vehicleA.id,
      expenseDate: "2026-02-05",
      category: "service",
      amountCents: 25000,
      mileage: 12100,
      notes: "Fevereiro",
    });

    const result = await getVehicleSummaries(
      vehicleRepository,
      expenseRepository,
      ownerId,
      {
        startMonth: "2026-01",
        endMonth: "2026-02",
        vehicleId: "",
      },
    );

    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }

    expect(result.data.months).toEqual(["2026-01", "2026-02"]);
    expect(result.data.vehicles).toHaveLength(2);

    const summaryA = result.data.summaries.find((item) => item.vehicleId === vehicleA.id);
    const summaryB = result.data.summaries.find((item) => item.vehicleId === vehicleB.id);

    expect(summaryA).toBeDefined();
    expect(summaryA?.totalSpentCents).toBe(35000);
    expect(summaryA?.categoryBreakdown).toEqual({
      fuel: 10000,
      parts: 0,
      service: 25000,
    });
    expect(summaryA?.monthlyTotals).toEqual({
      "2026-01": 10000,
      "2026-02": 25000,
    });

    expect(summaryB).toBeDefined();
    expect(summaryB?.totalSpentCents).toBe(0);
    expect(summaryB?.categoryBreakdown).toEqual({
      fuel: 0,
      parts: 0,
      service: 0,
    });
    expect(summaryB?.monthlyTotals).toEqual({
      "2026-01": 0,
      "2026-02": 0,
    });
  });

  it("supports optional vehicle filter", async () => {
    const ownerId = "owner-1";
    const vehicleRepository = new InMemoryVehicleRepository();
    const expenseRepository = new InMemoryExpenseRepository();

    const vehicleA = await vehicleRepository.create({
      ownerId,
      nickname: "Carro A",
      brand: "Toyota",
      model: "Corolla",
      plate: undefined,
      year: 2020,
    });

    const vehicleB = await vehicleRepository.create({
      ownerId,
      nickname: "Carro B",
      brand: "Honda",
      model: "Fit",
      plate: undefined,
      year: 2018,
    });

    await expenseRepository.create({
      ownerId,
      vehicleId: vehicleA.id,
      expenseDate: "2026-02-05",
      category: "parts",
      amountCents: 8000,
      mileage: undefined,
      notes: undefined,
    });

    await expenseRepository.create({
      ownerId,
      vehicleId: vehicleB.id,
      expenseDate: "2026-02-08",
      category: "fuel",
      amountCents: 4000,
      mileage: undefined,
      notes: undefined,
    });

    const result = await getVehicleSummaries(
      vehicleRepository,
      expenseRepository,
      ownerId,
      {
        startMonth: "2026-02",
        endMonth: "2026-02",
        vehicleId: vehicleA.id,
      },
    );

    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }

    expect(result.data.summaries).toHaveLength(1);
    expect(result.data.summaries[0]?.vehicleId).toBe(vehicleA.id);
    expect(result.data.summaries[0]?.totalSpentCents).toBe(8000);
  });
});
