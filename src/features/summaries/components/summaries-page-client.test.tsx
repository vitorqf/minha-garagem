import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { SummariesPageClient } from "@/features/summaries/components/summaries-page-client";

describe("SummariesPageClient", () => {
  it("renders filters and summary cards", () => {
    render(
      <SummariesPageClient
        defaultFilters={{ startMonth: "2026-01", endMonth: "2026-02", vehicleId: "" }}
        vehicles={[
          { id: "vehicle-1", label: "Carro Principal (Toyota Corolla)" },
          { id: "vehicle-2", label: "Carro Reserva (Honda Fit)" },
        ]}
        monthColumns={[
          { key: "2026-01", label: "jan/2026" },
          { key: "2026-02", label: "fev/2026" },
        ]}
        summaries={[
          {
            vehicleId: "vehicle-1",
            vehicleLabel: "Carro Principal (Toyota Corolla)",
            totalSpentLabel: "R$ 350,00",
            categoryBreakdown: {
              fuel: "R$ 100,00",
              parts: "R$ 0,00",
              service: "R$ 250,00",
            },
            monthlyTotals: {
              "2026-01": "R$ 100,00",
              "2026-02": "R$ 250,00",
            },
          },
        ]}
      />,
    );

    expect(screen.getByRole("heading", { name: "Resumo de gastos" })).toBeInTheDocument();
    expect(screen.getByLabelText("Mês inicial")).toHaveValue("2026-01");
    expect(screen.getByLabelText("Mês final")).toHaveValue("2026-02");

    const summaryCard = screen.getByTestId("summary-card");
    expect(within(summaryCard).getByText("Carro Principal (Toyota Corolla)")).toBeInTheDocument();
    expect(within(summaryCard).getByText(/R\$\s?350,00/)).toBeInTheDocument();
    expect(within(summaryCard).getByTestId("month-total-2026-01")).toHaveTextContent(/R\$\s?100,00/);
    expect(within(summaryCard).getByTestId("month-total-2026-02")).toHaveTextContent(/R\$\s?250,00/);
  });

  it("shows empty-state when no vehicles are registered", () => {
    render(
      <SummariesPageClient
        defaultFilters={{ startMonth: "2026-03", endMonth: "2026-03", vehicleId: "" }}
        vehicles={[]}
        monthColumns={[{ key: "2026-03", label: "mar/2026" }]}
        summaries={[]}
      />,
    );

    expect(screen.getByText("Cadastre um veículo para visualizar o resumo."))
      .toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Ir para veículos" })).toHaveAttribute("href", "/vehicles");
  });

  it("renders zero totals explicitly", () => {
    render(
      <SummariesPageClient
        defaultFilters={{ startMonth: "2026-01", endMonth: "2026-02", vehicleId: "" }}
        vehicles={[{ id: "vehicle-2", label: "Carro Reserva (Honda Fit)" }]}
        monthColumns={[
          { key: "2026-01", label: "jan/2026" },
          { key: "2026-02", label: "fev/2026" },
        ]}
        summaries={[
          {
            vehicleId: "vehicle-2",
            vehicleLabel: "Carro Reserva (Honda Fit)",
            totalSpentLabel: "R$ 0,00",
            categoryBreakdown: {
              fuel: "R$ 0,00",
              parts: "R$ 0,00",
              service: "R$ 0,00",
            },
            monthlyTotals: {
              "2026-01": "R$ 0,00",
              "2026-02": "R$ 0,00",
            },
          },
        ]}
      />,
    );

    const summaryCard = screen.getByTestId("summary-card");
    expect(within(summaryCard).getByText(/Total:\s*R\$\s?0,00/)).toBeInTheDocument();
    expect(within(summaryCard).getByTestId("month-total-2026-01")).toHaveTextContent(/R\$\s?0,00/);
    expect(within(summaryCard).getByTestId("month-total-2026-02")).toHaveTextContent(/R\$\s?0,00/);
  });
});
