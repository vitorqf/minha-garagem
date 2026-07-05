"use client";

import Link from "next/link";
import { useMemo } from "react";
import { CarFront, CircleDollarSign, PiggyBank, Wallet } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { FILTER_CONTROL_CLASS, FilterField } from "@/components/ui/filter-field";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type {
  SummaryKpiViewModel,
  SummaryMonthColumn,
  SummaryMonthlyTrendViewModel,
  SummaryPeriodInput,
  SummaryRecentExpenseViewModel,
  SummaryTopCostDriverViewModel,
  SummaryVehicleOption,
  SummaryViewModel,
} from "@/features/summaries/types";

type SummariesPageClientProps = {
  defaultFilters: SummaryPeriodInput;
  vehicles: SummaryVehicleOption[];
  monthColumns: SummaryMonthColumn[];
  summaries: SummaryViewModel[];
  monthlyTrends: SummaryMonthlyTrendViewModel[];
  topCostDrivers: SummaryTopCostDriverViewModel[];
  kpis: SummaryKpiViewModel;
  recentExpenses: SummaryRecentExpenseViewModel[];
  filterError?: string;
};

function buildSummaryExportHref(defaultFilters: SummaryPeriodInput): string {
  const searchParams = new URLSearchParams();
  searchParams.set("startMonth", defaultFilters.startMonth);
  searchParams.set("endMonth", defaultFilters.endMonth);

  if (defaultFilters.vehicleId) {
    searchParams.set("vehicleId", defaultFilters.vehicleId);
  }

  return `/api/reports/summaries.csv?${searchParams.toString()}`;
}

const CATEGORY_DOT_CLASS: Record<"fuel" | "parts" | "service", string> = {
  fuel: "bg-fuel",
  parts: "bg-parts",
  service: "bg-service",
};

const DELTA_TEXT_CLASS: Record<"positive" | "negative" | "neutral", string> = {
  positive: "text-success-foreground",
  negative: "text-danger-foreground",
  neutral: "text-subtle",
};

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function SummariesPageClient({
  defaultFilters,
  vehicles,
  monthColumns,
  summaries,
  monthlyTrends,
  topCostDrivers,
  kpis,
  recentExpenses,
  filterError,
}: SummariesPageClientProps) {
  const categoryTotals = useMemo(() => {
    const totals = {
      fuel: 0,
      parts: 0,
      service: 0,
    };

    for (const summary of summaries) {
      totals.fuel += summary.categoryBreakdownCents.fuel;
      totals.parts += summary.categoryBreakdownCents.parts;
      totals.service += summary.categoryBreakdownCents.service;
    }

    const max = Math.max(totals.fuel, totals.parts, totals.service, 1);

    return {
      rows: [
        {
          key: "fuel" as const,
          label: "Combustível",
          amount: totals.fuel,
          width: Math.round((totals.fuel / max) * 100),
        },
        {
          key: "parts" as const,
          label: "Peças",
          amount: totals.parts,
          width: Math.round((totals.parts / max) * 100),
        },
        {
          key: "service" as const,
          label: "Serviços",
          amount: totals.service,
          width: Math.round((totals.service / max) * 100),
        },
      ],
    };
  }, [summaries]);

  const sortedByTotal = useMemo(
    () => [...summaries].sort((a, b) => b.totalSpentCents - a.totalSpentCents),
    [summaries],
  );
  const exportHref = buildSummaryExportHref(defaultFilters);

  return (
    <div className="space-y-5">
      <Card>
        <CardContent className="space-y-3 p-4 md:p-6">
          <form action="/summaries" className="grid gap-3 lg:flex">
            <div>
              <label className="sr-only" htmlFor="summary-vehicleId">
                Veículo
              </label>
              <FilterField icon={CarFront}>
                <select
                  id="summary-vehicleId"
                  name="vehicleId"
                  defaultValue={defaultFilters.vehicleId ?? ""}
                  className={cn(FILTER_CONTROL_CLASS, "w-full")}
                >
                  <option value="">Todos os veículos</option>
                  {vehicles.map((vehicle) => (
                    <option key={vehicle.id} value={vehicle.id}>
                      {vehicle.label}
                    </option>
                  ))}
                </select>
              </FilterField>
            </div>

            <div>
              <label className="sr-only" htmlFor="summary-startMonth">
                Mês inicial
              </label>
              <input
                id="summary-startMonth"
                name="startMonth"
                type="month"
                defaultValue={defaultFilters.startMonth}
                className="h-12 w-full rounded-full border border-line bg-field px-4 py-2 text-sm text-foreground transition-[border-color,box-shadow] hover:border-line-strong focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>

            <div>
              <label className="sr-only" htmlFor="summary-endMonth">
                Mês final
              </label>
              <input
                id="summary-endMonth"
                name="endMonth"
                type="month"
                defaultValue={defaultFilters.endMonth}
                className="h-12 w-full rounded-full border border-line bg-field px-4 py-2 text-sm text-foreground transition-[border-color,box-shadow] hover:border-line-strong focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>

            <button
              type="submit"
              className="h-12 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-xs transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card"
            >
              Aplicar filtros
            </button>
            <a
              href={exportHref}
              className="inline-flex h-12 items-center rounded-full border border-line-strong bg-card px-4 text-sm font-semibold text-foreground transition-colors hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Exportar CSV
            </a>
          </form>
          {filterError ? (
            <p className="text-sm text-danger-foreground">{filterError}</p>
          ) : null}
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardContent className="space-y-2 p-6">
            <div className="flex items-center justify-between">
              <p className="text-base text-muted">Total Gasto</p>
              <span className="grid size-11 place-items-center rounded-full bg-primary-subtle text-primary">
                <Wallet className="size-5" />
              </span>
            </div>
            <p className="text-3xl font-extrabold text-foreground">
              {kpis.totalSpentLabel}
            </p>
            <p className="text-sm text-subtle">No período selecionado</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-2 p-6">
            <div className="flex items-center justify-between">
              <p className="text-base text-muted">Média Mensal</p>
              <span className="grid size-11 place-items-center rounded-full bg-primary-subtle text-primary">
                <CircleDollarSign className="size-5" />
              </span>
            </div>
            <p className="text-3xl font-extrabold text-foreground">
              {kpis.monthlyAverageLabel}
            </p>
            <p className="text-sm text-subtle">Média do período filtrado</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-2 p-6">
            <div className="flex items-center justify-between">
              <p className="text-base text-muted">Variação</p>
              <span className="grid size-11 place-items-center rounded-full bg-success-subtle text-success-foreground">
                <PiggyBank className="size-5" />
              </span>
            </div>
            <p className="text-3xl font-extrabold text-foreground">
              {kpis.variationLabel}
            </p>
            <p className={`text-sm ${DELTA_TEXT_CLASS[kpis.variationDirection]}`}>
              Comparado ao período anterior equivalente
            </p>
          </CardContent>
        </Card>
      </div>

      {vehicles.length === 0 ? (
        <Card>
          <CardContent className="py-7 text-center">
            <p className="text-base text-muted">
              Cadastre um veículo para visualizar o resumo.
            </p>
            <Link
              href="/vehicles"
              className="mt-2 inline-block text-sm font-semibold text-primary hover:text-primary-hover"
            >
              Ir para veículos
            </Link>
          </CardContent>
        </Card>
      ) : summaries.length === 0 ? (
        <Card>
          <CardContent className="py-7 text-center">
            <p className="text-base text-muted">
              Nenhum veículo encontrado para o filtro selecionado.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          <Card>
            <CardContent className="space-y-4 p-6">
              <h2 className="text-2xl font-extrabold text-foreground">
                Gastos por Categoria
              </h2>
              <p className="text-base text-muted">
                Distribuição no período selecionado
              </p>
              <div className="space-y-4">
                {categoryTotals.rows.map((row) => (
                  <div key={row.key} className="space-y-1.5">
                    <div className="flex items-center justify-between text-base font-semibold text-foreground">
                      <span className="flex items-center gap-2">
                        <span className={`size-2.5 rounded-full ${CATEGORY_DOT_CLASS[row.key]}`} />
                        {row.label}
                      </span>
                      <span>{formatCurrency(row.amount / 100)}</span>
                    </div>
                    <div className="h-2.5 overflow-hidden rounded-full bg-surface ring-1 ring-inset ring-line">
                      <div
                        className={`h-full rounded-full transition-[width] duration-500 ${CATEGORY_DOT_CLASS[row.key]}`}
                        style={{ width: `${row.width}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="space-y-4 p-6">
              <h2 className="text-2xl font-extrabold text-foreground">
                Gastos por Veículo
              </h2>
              <p className="text-base text-muted">
                Total acumulado por placa
              </p>
              <div className="space-y-3">
                {sortedByTotal.map((summary) => (
                  <article
                    key={summary.vehicleId}
                    data-testid="summary-card"
                    className="rounded-3xl border border-line bg-surface p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-xl font-bold text-foreground">
                          {summary.vehicleLabel}
                        </h3>
                        <p className="mt-1 text-base text-muted">
                          Total: {summary.totalSpentLabel}
                        </p>
                      </div>
                      <span className="text-xl font-extrabold text-foreground">
                        {summary.totalSpentLabel}
                      </span>
                    </div>
                    <div className="mt-3 grid gap-2 text-sm text-muted sm:grid-cols-3">
                      <p>Combustível: {summary.categoryBreakdown.fuel}</p>
                      <p>Peças: {summary.categoryBreakdown.parts}</p>
                      <p>Serviços: {summary.categoryBreakdown.service}</p>
                    </div>
                    <p
                      className={`mt-3 text-sm ${
                        summary.costPerKm.status === "available"
                          ? "text-foreground"
                          : "text-subtle"
                      }`}
                    >
                      Custo por km:{" "}
                      <strong data-testid={`cost-per-km-${summary.vehicleId}`}>
                        {summary.costPerKm.label}
                      </strong>
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2 text-xs">
                      {monthColumns.map((month) => (
                        <span
                          key={month.key}
                          className="rounded-full bg-card px-2.5 py-1 text-muted ring-1 ring-inset ring-line"
                        >
                          {month.label}:{" "}
                          <strong data-testid={`month-total-${month.key}`}>
                            {summary.monthlyTotals[month.key]}
                          </strong>
                        </span>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="space-y-4 p-6">
              <h2 className="text-2xl font-extrabold text-foreground">
                Tendência mensal
              </h2>
              <p className="text-base text-muted">
                Variação de gastos mês a mês no período filtrado
              </p>
              {monthlyTrends.length === 0 ? (
                <p className="text-sm text-muted">
                  Sem dados suficientes para tendência mensal.
                </p>
              ) : (
                <div className="space-y-3">
                  {monthlyTrends.map((trend) => {
                    const deltaClass = DELTA_TEXT_CLASS[trend.deltaDirection];

                    return (
                      <div
                        key={trend.monthKey}
                        data-testid={`trend-row-${trend.monthKey}`}
                        className="rounded-2xl border border-line bg-surface p-3"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-sm font-semibold text-foreground">{trend.monthLabel}</p>
                          <p className="text-sm font-bold text-foreground">{trend.totalSpentLabel}</p>
                        </div>
                        <div className="mt-1 flex items-center justify-between gap-3 text-sm">
                          <p className={deltaClass}>{trend.deltaLabel}</p>
                          <p className={deltaClass}>{trend.deltaPercentLabel}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="space-y-4 p-6">
              <h2 className="text-2xl font-extrabold text-foreground">
                Top fatores de custo
              </h2>
              <p className="text-base text-muted">
                Maiores combinações veículo e categoria no período
              </p>
              {topCostDrivers.length === 0 ? (
                <p className="text-sm text-muted">
                  Nenhum fator de custo no período selecionado.
                </p>
              ) : (
                <ol className="space-y-2">
                  {topCostDrivers.map((driver, index) => (
                    <li
                      key={driver.key}
                      data-testid="top-driver-row"
                      className="rounded-2xl border border-line bg-surface p-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <p className="text-sm font-semibold text-foreground">
                          {index + 1}. {driver.vehicleLabel} • {driver.categoryLabel}
                        </p>
                        <p className="text-sm font-bold text-foreground">{driver.amountLabel}</p>
                      </div>
                      <p className="mt-1 text-xs text-muted">{driver.shareLabel} do total</p>
                    </li>
                  ))}
                </ol>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      <Card>
        <CardContent className="p-0">
          <div className="flex items-center justify-between border-b border-line px-6 py-4">
            <h2 className="text-2xl font-extrabold text-foreground">
              Últimas Despesas
            </h2>
            <Link
              href="/expenses"
              className="text-base font-bold text-primary hover:text-primary-hover"
            >
              Ver todas
            </Link>
          </div>
          {recentExpenses.length === 0 ? (
            <p className="px-6 py-5 text-base text-muted">
              Sem despesas recentes no período selecionado.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Veículo</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentExpenses.map((expense) => (
                  <TableRow key={expense.id}>
                    <TableCell>{expense.dateLabel}</TableCell>
                    <TableCell className="font-semibold text-foreground">
                      {expense.vehicleLabel}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          expense.categoryLabel === "Combustível"
                            ? "fuel"
                            : expense.categoryLabel === "Peças"
                              ? "parts"
                              : "service"
                        }
                      >
                        {expense.categoryLabel}
                      </Badge>
                    </TableCell>
                    <TableCell>{expense.notesLabel}</TableCell>
                    <TableCell className="text-right text-lg font-bold text-foreground">
                      {expense.amountLabel}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
