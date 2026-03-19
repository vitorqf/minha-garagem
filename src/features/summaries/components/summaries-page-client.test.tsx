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
            totalSpentCents: 35000,
            totalSpentLabel: "R$ 350,00",
            categoryBreakdownCents: {
              fuel: 10000,
              parts: 0,
              service: 25000,
            },
            categoryBreakdown: {
              fuel: "R$ 100,00",
              parts: "R$ 0,00",
              service: "R$ 250,00",
            },
            monthlyTotalsCents: {
              "2026-01": 10000,
              "2026-02": 25000,
            },
            monthlyTotals: {
              "2026-01": "R$ 100,00",
              "2026-02": "R$ 250,00",
            },
          },
        ]}
        kpis={{
          totalSpentLabel: "R$ 350,00",
          monthlyAverageLabel: "R$ 175,00",
          variationLabel: "+5,0%",
          variationDirection: "positive",
        }}
        recentExpenses={[
          {
            id: "expense-1",
            dateLabel: "10 mar 2026",
            vehicleLabel: "Carro Principal (Toyota Corolla)",
            categoryLabel: "Combustível",
            notesLabel: "Posto",
            amountLabel: "R$ 100,00",
          },
        ]}
      />,
    );

    expect(screen.getByRole("heading", { name: "Gastos por Veículo" })).toBeInTheDocument();
    expect(screen.getByLabelText("Mês inicial")).toHaveValue("2026-01");
    expect(screen.getByLabelText("Mês final")).toHaveValue("2026-02");

    const summaryCard = screen.getByTestId("summary-card");
    expect(within(summaryCard).getByText("Carro Principal (Toyota Corolla)")).toBeInTheDocument();
    expect(within(summaryCard).getAllByText(/R\$\s?350,00/).length).toBeGreaterThan(0);
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
        kpis={{
          totalSpentLabel: "R$ 0,00",
          monthlyAverageLabel: "R$ 0,00",
          variationLabel: "—",
          variationDirection: "neutral",
        }}
        recentExpenses={[]}
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
            totalSpentCents: 0,
            totalSpentLabel: "R$ 0,00",
            categoryBreakdownCents: {
              fuel: 0,
              parts: 0,
              service: 0,
            },
            categoryBreakdown: {
              fuel: "R$ 0,00",
              parts: "R$ 0,00",
              service: "R$ 0,00",
            },
            monthlyTotalsCents: {
              "2026-01": 0,
              "2026-02": 0,
            },
            monthlyTotals: {
              "2026-01": "R$ 0,00",
              "2026-02": "R$ 0,00",
            },
          },
        ]}
        kpis={{
          totalSpentLabel: "R$ 0,00",
          monthlyAverageLabel: "R$ 0,00",
          variationLabel: "—",
          variationDirection: "neutral",
        }}
        recentExpenses={[]}
      />,
    );

    const summaryCard = screen.getByTestId("summary-card");
    expect(within(summaryCard).getByText(/Total:\s*R\$\s?0,00/)).toBeInTheDocument();
    expect(within(summaryCard).getByTestId("month-total-2026-01")).toHaveTextContent(/R\$\s?0,00/);
    expect(within(summaryCard).getByTestId("month-total-2026-02")).toHaveTextContent(/R\$\s?0,00/);
  });

  it("renders csv export link using active summary filters", () => {
    render(
      <SummariesPageClient
        defaultFilters={{ startMonth: "2026-01", endMonth: "2026-02", vehicleId: "vehicle-1" }}
        vehicles={[{ id: "vehicle-1", label: "Carro Principal (Toyota Corolla)" }]}
        monthColumns={[
          { key: "2026-01", label: "jan/2026" },
          { key: "2026-02", label: "fev/2026" },
        ]}
        summaries={[]}
        kpis={{
          totalSpentLabel: "R$ 0,00",
          monthlyAverageLabel: "R$ 0,00",
          variationLabel: "—",
          variationDirection: "neutral",
        }}
        recentExpenses={[]}
      />,
    );

    expect(screen.getByRole("link", { name: "Exportar CSV" })).toHaveAttribute(
      "href",
      "/api/reports/summaries.csv?startMonth=2026-01&endMonth=2026-02&vehicleId=vehicle-1",
    );
  });
});
