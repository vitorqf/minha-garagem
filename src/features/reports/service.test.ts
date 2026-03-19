import { describe, expect, it } from "vitest";

import { InMemoryExpenseRepository } from "@/features/expenses/repositories/in-memory-expense-repository";
import { InMemoryVehicleRepository } from "@/features/vehicles/repositories/in-memory-vehicle-repository";
import { buildExpenseCsvExport } from "@/features/reports/service";
import * as reportsService from "@/features/reports/service";

type SummaryCsvExportResult =
  | {
      ok: true;
      data: {
        appliedFilter: {
          startMonth: string;
          endMonth: string;
          vehicleId: string;
        };
        months: string[];
        rows: Array<{
          vehicle: string;
          total: string;
          fuel: string;
          parts: string;
          service: string;
          monthlyTotals: Record<string, string>;
        }>;
      };
    }
  | {
      ok: false;
      message: string;
      errors?: Record<string, string>;
    };

type BuildSummaryCsvExport = (
  vehicleRepository: InMemoryVehicleRepository,
  expenseRepository: InMemoryExpenseRepository,
  ownerId: string,
  filter: {
    startMonth: string;
    endMonth: string;
    vehicleId?: string;
  },
) => Promise<SummaryCsvExportResult>;

function getBuildSummaryCsvExport(): BuildSummaryCsvExport {
  const candidate = (reportsService as Record<string, unknown>).buildSummaryCsvExport;
  if (typeof candidate !== "function") {
    throw new Error("Expected buildSummaryCsvExport() to be implemented.");
  }

  return candidate as BuildSummaryCsvExport;
}

describe("reports service", () => {
  it("builds owner-scoped expense csv rows using filters and pt-BR formatting", async () => {
    const ownerId = "owner-1";
    const otherOwnerId = "owner-2";
    const vehicleRepository = new InMemoryVehicleRepository();
    const expenseRepository = new InMemoryExpenseRepository();

    const ownerVehicle = await vehicleRepository.create({
      ownerId,
      nickname: "Carro Principal",
      brand: "Toyota",
      model: "Corolla",
      plate: undefined,
      year: 2020,
    });

    await vehicleRepository.create({
      ownerId,
      nickname: "Carro Secundário",
      brand: "Honda",
      model: "Fit",
      plate: undefined,
      year: 2018,
    });

    const otherVehicle = await vehicleRepository.create({
      ownerId: otherOwnerId,
      nickname: "Carro Outro Dono",
      brand: "Fiat",
      model: "Uno",
      plate: undefined,
      year: 2014,
    });

    await expenseRepository.create({
      ownerId,
      vehicleId: ownerVehicle.id,
      expenseDate: "2026-03-10",
      category: "fuel",
      amountCents: 15025,
      mileage: 12500,
      notes: "Abastecimento março",
    });

    await expenseRepository.create({
      ownerId,
      vehicleId: ownerVehicle.id,
      expenseDate: "2026-04-05",
      category: "service",
      amountCents: 35000,
      mileage: undefined,
      notes: "Fora do período",
    });

    await expenseRepository.create({
      ownerId: otherOwnerId,
      vehicleId: otherVehicle.id,
      expenseDate: "2026-03-10",
      category: "fuel",
      amountCents: 9999,
      mileage: undefined,
      notes: "Outro dono",
    });

    const result = await buildExpenseCsvExport(vehicleRepository, expenseRepository, ownerId, {
      startDate: "2026-03-01",
      endDate: "2026-03-31",
      vehicleId: ownerVehicle.id,
      category: "fuel",
    });

    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }

    expect(result.data.appliedFilter).toEqual({
      startDate: "2026-03-01",
      endDate: "2026-03-31",
      vehicleId: ownerVehicle.id,
      category: "fuel",
    });

    expect(result.data.rows).toHaveLength(1);
    expect(result.data.rows[0]).toMatchObject({
      date: "10/03/2026",
      vehicle: "Carro Principal (Toyota Corolla)",
      category: "Combustível",
      amount: "150,25",
      mileage: "12500",
      notes: "Abastecimento março",
    });
  });

  it("returns field errors when filters are invalid", async () => {
    const ownerId = "owner-1";
    const vehicleRepository = new InMemoryVehicleRepository();
    const expenseRepository = new InMemoryExpenseRepository();

    const result = await buildExpenseCsvExport(vehicleRepository, expenseRepository, ownerId, {
      startDate: "2026-03-31",
      endDate: "2026-03-01",
      vehicleId: "",
      category: "",
    });

    expect(result.ok).toBe(false);
    if (result.ok) {
      return;
    }

    expect(result.errors?.period).toContain("Período");
  });

  it("returns header-ready empty rows for periods without expenses", async () => {
    const ownerId = "owner-1";
    const vehicleRepository = new InMemoryVehicleRepository();
    const expenseRepository = new InMemoryExpenseRepository();

    await vehicleRepository.create({
      ownerId,
      nickname: "Carro Sem Despesas",
      brand: "VW",
      model: "Gol",
      plate: undefined,
      year: 2016,
    });

    const result = await buildExpenseCsvExport(vehicleRepository, expenseRepository, ownerId, {
      startDate: "2026-03-01",
      endDate: "2026-03-31",
      vehicleId: "",
      category: "",
    });

    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }

    expect(result.data.rows).toEqual([]);
  });

  it("builds owner-scoped summary csv rows with dynamic months and category totals", async () => {
    const buildSummaryCsvExport = getBuildSummaryCsvExport();

    const ownerId = "owner-1";
    const otherOwnerId = "owner-2";
    const vehicleRepository = new InMemoryVehicleRepository();
    const expenseRepository = new InMemoryExpenseRepository();

    const ownerVehicle = await vehicleRepository.create({
      ownerId,
      nickname: "Carro Principal",
      brand: "Toyota",
      model: "Corolla",
      plate: undefined,
      year: 2020,
    });

    await vehicleRepository.create({
      ownerId,
      nickname: "Carro Secundário",
      brand: "Honda",
      model: "Fit",
      plate: undefined,
      year: 2018,
    });

    const otherOwnerVehicle = await vehicleRepository.create({
      ownerId: otherOwnerId,
      nickname: "Carro Outro Dono",
      brand: "Fiat",
      model: "Uno",
      plate: undefined,
      year: 2012,
    });

    await expenseRepository.create({
      ownerId,
      vehicleId: ownerVehicle.id,
      expenseDate: "2026-01-10",
      category: "fuel",
      amountCents: 10000,
      mileage: undefined,
      notes: "Combustível janeiro",
    });

    await expenseRepository.create({
      ownerId,
      vehicleId: ownerVehicle.id,
      expenseDate: "2026-02-15",
      category: "service",
      amountCents: 25000,
      mileage: undefined,
      notes: "Revisão fevereiro",
    });

    await expenseRepository.create({
      ownerId: otherOwnerId,
      vehicleId: otherOwnerVehicle.id,
      expenseDate: "2026-01-12",
      category: "fuel",
      amountCents: 9999,
      mileage: undefined,
      notes: "Outro dono",
    });

    const result = await buildSummaryCsvExport(
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

    expect(result.data.appliedFilter).toEqual({
      startMonth: "2026-01",
      endMonth: "2026-02",
      vehicleId: "",
    });
    expect(result.data.months).toEqual(["2026-01", "2026-02"]);

    const ownerVehicleRow = result.data.rows.find(
      (row) => row.vehicle === "Carro Principal (Toyota Corolla)",
    );
    expect(ownerVehicleRow).toEqual({
      vehicle: "Carro Principal (Toyota Corolla)",
      total: "350,00",
      fuel: "100,00",
      parts: "0,00",
      service: "250,00",
      monthlyTotals: {
        "2026-01": "100,00",
        "2026-02": "250,00",
      },
    });
  });

  it("returns field errors when summary filters are invalid", async () => {
    const buildSummaryCsvExport = getBuildSummaryCsvExport();

    const ownerId = "owner-1";
    const vehicleRepository = new InMemoryVehicleRepository();
    const expenseRepository = new InMemoryExpenseRepository();

    const result = await buildSummaryCsvExport(
      vehicleRepository,
      expenseRepository,
      ownerId,
      {
        startMonth: "2026-03",
        endMonth: "2026-01",
        vehicleId: "",
      },
    );

    expect(result.ok).toBe(false);
    if (result.ok) {
      return;
    }

    expect(result.errors?.period).toContain("Período");
  });

  it("returns header-ready empty summary rows when period has no expenses", async () => {
    const buildSummaryCsvExport = getBuildSummaryCsvExport();

    const ownerId = "owner-1";
    const vehicleRepository = new InMemoryVehicleRepository();
    const expenseRepository = new InMemoryExpenseRepository();

    await vehicleRepository.create({
      ownerId,
      nickname: "Carro Sem Despesas",
      brand: "VW",
      model: "Gol",
      plate: undefined,
      year: 2016,
    });

    const result = await buildSummaryCsvExport(
      vehicleRepository,
      expenseRepository,
      ownerId,
      {
        startMonth: "2026-01",
        endMonth: "2026-01",
        vehicleId: "",
      },
    );

    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }

    expect(result.data.months).toEqual(["2026-01"]);
    expect(result.data.rows).toEqual([]);
  });
});
