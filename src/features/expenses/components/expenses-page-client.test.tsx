import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ExpensesPageClient } from "@/features/expenses/components/expenses-page-client";
import type { ExpenseFormState, ExpenseFilterState } from "@/features/expenses/types";

const noopFormAction = async (): Promise<ExpenseFormState> => ({ status: "idle", errors: {} });
const noopFilterAction = async (): Promise<ExpenseFilterState> => ({
  status: "idle",
  errors: {},
  filters: {},
});
const noopDeleteAction = async (): Promise<void> => {};

describe("ExpensesPageClient", () => {
  it("renders expense form and list", () => {
    render(
      <ExpensesPageClient
        vehicles={[
          { id: "vehicle-1", label: "Carro Principal (Toyota Corolla)" },
        ]}
        expenses={[
          {
            id: "expense-2",
            vehicleId: "vehicle-1",
            vehicleLabel: "Carro Principal (Toyota Corolla)",
            expenseDate: "2026-03-10",
            category: "service",
            amountCents: 25000,
            amountLabel: "R$ 250,00",
            mileage: 13000,
            notes: "Revisão",
            createdAt: "2026-03-10T10:00:00.000Z",
          },
          {
            id: "expense-1",
            vehicleId: "vehicle-1",
            vehicleLabel: "Carro Principal (Toyota Corolla)",
            expenseDate: "2026-03-01",
            category: "fuel",
            amountCents: 10000,
            amountLabel: "R$ 100,00",
            mileage: 12000,
            notes: "Posto",
            createdAt: "2026-03-01T10:00:00.000Z",
          },
        ]}
        defaultFilters={{ startDate: "2026-03-01", endDate: "2026-03-31", vehicleId: "" }}
        createExpenseAction={noopFormAction}
        updateExpenseAction={noopFormAction}
        applyExpenseFiltersAction={noopFilterAction}
        deleteExpenseAction={noopDeleteAction}
      />,
    );

    expect(screen.getByRole("heading", { name: "Despesas" })).toBeInTheDocument();
    expect(screen.getAllByLabelText("Veículo").length).toBeGreaterThan(0);
    expect(screen.getByText(/R\$\s?250,00/)).toBeInTheDocument();
    expect(screen.getByText(/R\$\s?100,00/)).toBeInTheDocument();

    const rows = screen.getAllByTestId("expense-row-title").map((item) => item.textContent);
    expect(rows[0]).toContain("2026-03-10");
    expect(rows[1]).toContain("2026-03-01");
  });

  it("shows disabled state and CTA when no vehicles exist", () => {
    render(
      <ExpensesPageClient
        vehicles={[]}
        expenses={[]}
        defaultFilters={{ startDate: "2026-03-01", endDate: "2026-03-31", vehicleId: "" }}
        createExpenseAction={noopFormAction}
        updateExpenseAction={noopFormAction}
        applyExpenseFiltersAction={noopFilterAction}
        deleteExpenseAction={noopDeleteAction}
      />,
    );

    expect(screen.getByText("Cadastre um veículo antes de lançar despesas.")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Ir para veículos" })).toHaveAttribute(
      "href",
      "/vehicles",
    );
    expect(screen.getByRole("button", { name: "Adicionar despesa" })).toBeDisabled();
  });

  it("renders pt-BR validation errors", () => {
    render(
      <ExpensesPageClient
        vehicles={[{ id: "vehicle-1", label: "Carro" }]}
        expenses={[]}
        defaultFilters={{ startDate: "2026-03-01", endDate: "2026-03-31", vehicleId: "" }}
        createExpenseAction={noopFormAction}
        updateExpenseAction={noopFormAction}
        applyExpenseFiltersAction={noopFilterAction}
        deleteExpenseAction={noopDeleteAction}
        initialCreateState={{
          status: "error",
          message: "Não foi possível salvar a despesa.",
          errors: { amountInput: "Valor é obrigatório." },
        }}
      />,
    );

    expect(screen.getByText("Valor é obrigatório.")).toBeInTheDocument();
  });
});
