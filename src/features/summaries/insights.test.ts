import { describe, expect, it } from "vitest";

import type { Expense } from "@/features/expenses/types";
import {
  buildCostPerKmByVehicle,
  buildMonthlyTrendRows,
  buildTopCostDrivers,
} from "@/features/summaries/insights";

describe("summary insights", () => {
  it("builds cost per km by vehicle and marks insufficient mileage basis", () => {
    const expenses: Expense[] = [
      {
        id: "expense-1",
        ownerId: "owner-1",
        vehicleId: "vehicle-1",
        expenseDate: new Date("2026-01-05T00:00:00.000Z"),
        category: "fuel",
        amountCents: 10000,
        mileage: 12000,
        notes: null,
        createdAt: new Date("2026-01-05T00:00:00.000Z"),
        updatedAt: new Date("2026-01-05T00:00:00.000Z"),
      },
      {
        id: "expense-2",
        ownerId: "owner-1",
        vehicleId: "vehicle-1",
        expenseDate: new Date("2026-02-05T00:00:00.000Z"),
        category: "service",
        amountCents: 25000,
        mileage: 12200,
        notes: null,
        createdAt: new Date("2026-02-05T00:00:00.000Z"),
        updatedAt: new Date("2026-02-05T00:00:00.000Z"),
      },
      {
        id: "expense-3",
        ownerId: "owner-1",
        vehicleId: "vehicle-2",
        expenseDate: new Date("2026-02-08T00:00:00.000Z"),
        category: "parts",
        amountCents: 8000,
        mileage: 5000,
        notes: null,
        createdAt: new Date("2026-02-08T00:00:00.000Z"),
        updatedAt: new Date("2026-02-08T00:00:00.000Z"),
      },
    ];

    const result = buildCostPerKmByVehicle(
      [
        { vehicleId: "vehicle-1", totalSpentCents: 35000 },
        { vehicleId: "vehicle-2", totalSpentCents: 8000 },
      ],
      expenses,
    );

    expect(result["vehicle-1"]).toEqual({
      status: "available",
      label: expect.stringMatching(/R\$\s?1,75\/km/),
    });
    expect(result["vehicle-2"]).toEqual({
      status: "insufficient",
      label: "Dados insuficientes",
    });
  });

  it("marks cost per km as insufficient when mileage range is non-increasing", () => {
    const expenses: Expense[] = [
      {
        id: "expense-1",
        ownerId: "owner-1",
        vehicleId: "vehicle-1",
        expenseDate: new Date("2026-01-05T00:00:00.000Z"),
        category: "fuel",
        amountCents: 10000,
        mileage: 12000,
        notes: null,
        createdAt: new Date("2026-01-05T00:00:00.000Z"),
        updatedAt: new Date("2026-01-05T00:00:00.000Z"),
      },
      {
        id: "expense-2",
        ownerId: "owner-1",
        vehicleId: "vehicle-1",
        expenseDate: new Date("2026-01-06T00:00:00.000Z"),
        category: "parts",
        amountCents: 5000,
        mileage: 12000,
        notes: null,
        createdAt: new Date("2026-01-06T00:00:00.000Z"),
        updatedAt: new Date("2026-01-06T00:00:00.000Z"),
      },
    ];

    const result = buildCostPerKmByVehicle([{ vehicleId: "vehicle-1", totalSpentCents: 15000 }], expenses);

    expect(result["vehicle-1"]).toEqual({
      status: "insufficient",
      label: "Dados insuficientes",
    });
  });

  it("builds monthly trend deltas and percentage labels", () => {
    const rows = buildMonthlyTrendRows(
      ["2026-01", "2026-02", "2026-03"],
      [
        {
          vehicleId: "vehicle-1",
          monthlyTotalsCents: {
            "2026-01": 10000,
            "2026-02": 25000,
            "2026-03": 10000,
          },
        },
        {
          vehicleId: "vehicle-2",
          monthlyTotalsCents: {
            "2026-01": 0,
            "2026-02": 5000,
            "2026-03": 0,
          },
        },
      ],
    );

    expect(rows).toHaveLength(3);
    expect(rows[0]).toMatchObject({
      monthKey: "2026-01",
      monthLabel: "jan. de 2026",
      totalSpentCents: 10000,
      deltaLabel: "—",
      deltaPercentLabel: "—",
      deltaDirection: "neutral",
    });
    expect(rows[0]?.totalSpentLabel).toMatch(/R\$\s?100,00/);

    expect(rows[1]).toMatchObject({
      monthKey: "2026-02",
      monthLabel: "fev. de 2026",
      totalSpentCents: 30000,
      deltaPercentLabel: "+200,0%",
      deltaDirection: "negative",
    });
    expect(rows[1]?.totalSpentLabel).toMatch(/R\$\s?300,00/);
    expect(rows[1]?.deltaLabel).toMatch(/\+R\$\s?200,00/);

    expect(rows[2]).toMatchObject({
      monthKey: "2026-03",
      monthLabel: "mar. de 2026",
      totalSpentCents: 10000,
      deltaPercentLabel: "-66,7%",
      deltaDirection: "positive",
    });
    expect(rows[2]?.totalSpentLabel).toMatch(/R\$\s?100,00/);
    expect(rows[2]?.deltaLabel).toMatch(/-R\$\s?200,00/);
  });

  it("builds top cost drivers with ranking, share and top-3 limit", () => {
    const rows = buildTopCostDrivers(
      [
        {
          vehicleId: "vehicle-a",
          vehicleLabel: "Carro A (Toyota Corolla)",
          categoryBreakdownCents: {
            fuel: 10000,
            parts: 0,
            service: 30000,
          },
        },
        {
          vehicleId: "vehicle-b",
          vehicleLabel: "Carro B (Honda Fit)",
          categoryBreakdownCents: {
            fuel: 10000,
            parts: 20000,
            service: 0,
          },
        },
      ],
      3,
    );

    expect(rows).toHaveLength(3);
    expect(rows[0]).toMatchObject({
      key: "vehicle-a-service",
      vehicleLabel: "Carro A (Toyota Corolla)",
      categoryLabel: "Serviços",
      amountCents: 30000,
      shareLabel: "42,9%",
    });
    expect(rows[0]?.amountLabel).toMatch(/R\$\s?300,00/);
    expect(rows[1]).toMatchObject({
      key: "vehicle-b-parts",
      vehicleLabel: "Carro B (Honda Fit)",
      categoryLabel: "Peças",
      amountCents: 20000,
      shareLabel: "28,6%",
    });
    expect(rows[1]?.amountLabel).toMatch(/R\$\s?200,00/);
    expect(rows[2]).toMatchObject({
      key: "vehicle-a-fuel",
      vehicleLabel: "Carro A (Toyota Corolla)",
      categoryLabel: "Combustível",
      amountCents: 10000,
      shareLabel: "14,3%",
    });
    expect(rows[2]?.amountLabel).toMatch(/R\$\s?100,00/);
  });
});
