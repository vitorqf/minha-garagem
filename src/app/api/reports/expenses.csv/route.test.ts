/** @vitest-environment node */

import { beforeEach, describe, expect, it, vi } from "vitest";

const mockGetCurrentOwnerId = vi.fn();
const mockGetExpenseRepository = vi.fn();
const mockGetVehicleRepository = vi.fn();
const mockBuildExpenseCsvExport = vi.fn();

vi.mock("@/features/auth/session", () => ({
  getCurrentOwnerId: () => mockGetCurrentOwnerId(),
}));

vi.mock("@/features/expenses/repositories", () => ({
  getExpenseRepository: () => mockGetExpenseRepository(),
}));

vi.mock("@/features/vehicles/repositories", () => ({
  getVehicleRepository: () => mockGetVehicleRepository(),
}));

vi.mock("@/features/reports/service", () => ({
  buildExpenseCsvExport: (...args: unknown[]) => mockBuildExpenseCsvExport(...args),
}));

describe("GET /api/reports/expenses.csv", () => {
  beforeEach(() => {
    vi.resetModules();
    mockGetCurrentOwnerId.mockReset();
    mockGetExpenseRepository.mockReset();
    mockGetVehicleRepository.mockReset();
    mockBuildExpenseCsvExport.mockReset();
    mockGetExpenseRepository.mockReturnValue({});
    mockGetVehicleRepository.mockReturnValue({});
  });

  it("returns 401 json when user is not authenticated", async () => {
    mockGetCurrentOwnerId.mockResolvedValue(null);

    const { GET } = await import("@/app/api/reports/expenses.csv/route");
    const response = await GET(
      new Request("http://localhost/api/reports/expenses.csv?startDate=2026-03-01&endDate=2026-03-31"),
    );

    expect(response.status).toBe(401);
    expect(await response.json()).toEqual({
      message: "Você precisa estar autenticado para exportar relatórios.",
    });
    expect(mockBuildExpenseCsvExport).not.toHaveBeenCalled();
  });

  it("returns 400 json with field errors when filters are invalid", async () => {
    mockGetCurrentOwnerId.mockResolvedValue("owner-1");
    mockBuildExpenseCsvExport.mockResolvedValue({
      ok: false,
      message: "Não foi possível gerar o CSV de despesas com os filtros informados.",
      errors: {
        startDate: "Data é obrigatória.",
      },
    });

    const { GET } = await import("@/app/api/reports/expenses.csv/route");
    const response = await GET(new Request("http://localhost/api/reports/expenses.csv"));

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({
      message: "Não foi possível gerar o CSV de despesas com os filtros informados.",
      errors: {
        startDate: "Data é obrigatória.",
      },
    });
  });

  it("returns 200 csv response with expected headers and body", async () => {
    mockGetCurrentOwnerId.mockResolvedValue("owner-1");
    mockBuildExpenseCsvExport.mockResolvedValue({
      ok: true,
      data: {
        appliedFilter: {
          startDate: "2026-03-01",
          endDate: "2026-03-31",
          vehicleId: "vehicle-1",
        },
        rows: [
          {
            id: "expense-1",
            date: "10/03/2026",
            vehicle: "Carro Principal (Toyota Corolla)",
            category: "Combustível",
            amount: "150,25",
            mileage: "12500",
            notes: "Abastecimento",
          },
        ],
      },
    });

    const { GET } = await import("@/app/api/reports/expenses.csv/route");
    const response = await GET(
      new Request(
        "http://localhost/api/reports/expenses.csv?startDate=2026-03-01&endDate=2026-03-31&vehicleId=vehicle-1",
      ),
    );

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toContain("text/csv; charset=utf-8");
    expect(response.headers.get("content-disposition")).toContain(
      'attachment; filename="despesas-2026-03-01-a-2026-03-31.csv"',
    );

    const body = await response.text();
    expect(body).toContain("ID;Data;Veículo;Categoria;Valor (R$);Quilometragem (km);Observações");
    expect(body).toContain("expense-1;10/03/2026;Carro Principal (Toyota Corolla);Combustível;150,25;12500;Abastecimento");
  });
});
