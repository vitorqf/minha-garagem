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
            costPerKm: {
              status: "available",
              label: "R$ 1,75/km",
            },
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
        monthlyTrends={[
          {
            monthKey: "2026-01",
            monthLabel: "jan. de 2026",
            totalSpentCents: 10000,
            totalSpentLabel: "R$ 100,00",
            deltaLabel: "—",
            deltaPercentLabel: "—",
            deltaDirection: "neutral",
          },
          {
            monthKey: "2026-02",
            monthLabel: "fev. de 2026",
            totalSpentCents: 25000,
            totalSpentLabel: "R$ 250,00",
            deltaLabel: "+R$ 150,00",
            deltaPercentLabel: "+150,0%",
            deltaDirection: "negative",
          },
        ]}
        topCostDrivers={[
          {
            key: "vehicle-1-service",
            vehicleLabel: "Carro Principal (Toyota Corolla)",
            categoryLabel: "Serviços",
            amountCents: 25000,
            amountLabel: "R$ 250,00",
            shareLabel: "71,4%",
          },
          {
            key: "vehicle-1-fuel",
            vehicleLabel: "Carro Principal (Toyota Corolla)",
            categoryLabel: "Combustível",
            amountCents: 10000,
            amountLabel: "R$ 100,00",
            shareLabel: "28,6%",
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
    expect(within(summaryCard).getByTestId("cost-per-km-vehicle-1")).toHaveTextContent(
      /R\$\s?1,75\/km/,
    );
    expect(within(summaryCard).getByTestId("month-total-2026-01")).toHaveTextContent(/R\$\s?100,00/);
    expect(within(summaryCard).getByTestId("month-total-2026-02")).toHaveTextContent(/R\$\s?250,00/);

    expect(screen.getByRole("heading", { name: "Tendência mensal" })).toBeInTheDocument();
    expect(screen.getByTestId("trend-row-2026-02")).toHaveTextContent("+R$ 150,00");
    expect(screen.getByTestId("trend-row-2026-02")).toHaveTextContent("+150,0%");
    expect(screen.getByRole("heading", { name: "Top fatores de custo" })).toBeInTheDocument();
    expect(screen.getAllByTestId("top-driver-row")).toHaveLength(2);
    expect(screen.getByText(/Carro Principal \(Toyota Corolla\) • Serviços/)).toBeInTheDocument();
  });

  it("shows empty-state when no vehicles are registered", () => {
    render(
      <SummariesPageClient
        defaultFilters={{ startMonth: "2026-03", endMonth: "2026-03", vehicleId: "" }}
        vehicles={[]}
        monthColumns={[{ key: "2026-03", label: "mar/2026" }]}
        summaries={[]}
        monthlyTrends={[]}
        topCostDrivers={[]}
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
            costPerKm: {
              status: "insufficient",
              label: "Dados insuficientes",
            },
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
        monthlyTrends={[
          {
            monthKey: "2026-01",
            monthLabel: "jan. de 2026",
            totalSpentCents: 0,
            totalSpentLabel: "R$ 0,00",
            deltaLabel: "—",
            deltaPercentLabel: "—",
            deltaDirection: "neutral",
          },
          {
            monthKey: "2026-02",
            monthLabel: "fev. de 2026",
            totalSpentCents: 0,
            totalSpentLabel: "R$ 0,00",
            deltaLabel: "R$ 0,00",
            deltaPercentLabel: "—",
            deltaDirection: "neutral",
          },
        ]}
        topCostDrivers={[]}
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
    expect(within(summaryCard).getByTestId("cost-per-km-vehicle-2")).toHaveTextContent(
      "Dados insuficientes",
    );
    expect(within(summaryCard).getByTestId("month-total-2026-01")).toHaveTextContent(/R\$\s?0,00/);
    expect(within(summaryCard).getByTestId("month-total-2026-02")).toHaveTextContent(/R\$\s?0,00/);
    expect(screen.getByText("Nenhum fator de custo no período selecionado.")).toBeInTheDocument();
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
        monthlyTrends={[]}
        topCostDrivers={[]}
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
