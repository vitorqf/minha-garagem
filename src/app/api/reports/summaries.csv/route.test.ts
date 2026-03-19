/** @vitest-environment node */

import { beforeEach, describe, expect, it, vi } from "vitest";

const mockGetCurrentOwnerId = vi.fn();
const mockGetExpenseRepository = vi.fn();
const mockGetVehicleRepository = vi.fn();
const mockBuildSummaryCsvExport = vi.fn();

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
  buildSummaryCsvExport: (...args: unknown[]) => mockBuildSummaryCsvExport(...args),
}));

async function importRouteModule() {
  try {
    return await import("@/app/api/reports/summaries.csv/route");
  } catch (error) {
    throw new Error("Expected /api/reports/summaries.csv route to be implemented.", {
      cause: error,
    });
  }
}

describe("GET /api/reports/summaries.csv", () => {
  beforeEach(() => {
    vi.resetModules();
    mockGetCurrentOwnerId.mockReset();
    mockGetExpenseRepository.mockReset();
    mockGetVehicleRepository.mockReset();
    mockBuildSummaryCsvExport.mockReset();
    mockGetExpenseRepository.mockReturnValue({});
    mockGetVehicleRepository.mockReturnValue({});
  });

  it("returns 401 json when user is not authenticated", async () => {
    mockGetCurrentOwnerId.mockResolvedValue(null);

    const { GET } = await importRouteModule();
    const response = await GET(
      new Request("http://localhost/api/reports/summaries.csv?startMonth=2026-01&endMonth=2026-03"),
    );

    expect(response.status).toBe(401);
    expect(await response.json()).toEqual({
      message: "Você precisa estar autenticado para exportar relatórios.",
    });
    expect(mockBuildSummaryCsvExport).not.toHaveBeenCalled();
  });

  it("returns 400 json with field errors when filters are invalid", async () => {
    mockGetCurrentOwnerId.mockResolvedValue("owner-1");
    mockBuildSummaryCsvExport.mockResolvedValue({
      ok: false,
      message: "Não foi possível gerar o CSV de resumos com os filtros informados.",
      errors: {
        startMonth: "Mês inicial é obrigatório.",
      },
    });

    const { GET } = await importRouteModule();
    const response = await GET(new Request("http://localhost/api/reports/summaries.csv"));

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({
      message: "Não foi possível gerar o CSV de resumos com os filtros informados.",
      errors: {
        startMonth: "Mês inicial é obrigatório.",
      },
    });
  });

  it("returns 200 csv response with expected headers and dynamic month columns", async () => {
    mockGetCurrentOwnerId.mockResolvedValue("owner-1");
    mockBuildSummaryCsvExport.mockResolvedValue({
      ok: true,
      data: {
        appliedFilter: {
          startMonth: "2026-01",
          endMonth: "2026-02",
          vehicleId: "vehicle-1",
        },
        months: ["2026-01", "2026-02"],
        monthLabels: {
          "2026-01": "jan/2026",
          "2026-02": "fev/2026",
        },
        rows: [
          {
            vehicle: "Carro Principal (Toyota Corolla)",
            total: "350,00",
            fuel: "100,00",
            parts: "0,00",
            service: "250,00",
            monthlyTotals: {
              "2026-01": "100,00",
              "2026-02": "250,00",
            },
          },
        ],
      },
    });

    const { GET } = await importRouteModule();
    const response = await GET(
      new Request(
        "http://localhost/api/reports/summaries.csv?startMonth=2026-01&endMonth=2026-02&vehicleId=vehicle-1",
      ),
    );

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toContain("text/csv; charset=utf-8");
    expect(response.headers.get("content-disposition")).toContain(
      'attachment; filename="resumos-2026-01-a-2026-02.csv"',
    );

    const body = await response.text();
    expect(body).toContain(
      "Veículo;Total (R$);Combustível (R$);Peças (R$);Serviços (R$);jan/2026;fev/2026",
    );
    expect(body).toContain(
      "Carro Principal (Toyota Corolla);350,00;100,00;0,00;250,00;100,00;250,00",
    );
    expect(mockBuildSummaryCsvExport).toHaveBeenCalledWith(
      {},
      {},
      "owner-1",
      {
        vehicleId: "vehicle-1",
        startMonth: "2026-01",
        endMonth: "2026-02",
      },
    );
  });
});
