"use client";

import Link from "next/link";
import { useMemo } from "react";
import { CalendarDays, CarFront, CircleDollarSign, PiggyBank, Wallet } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type {
  SummaryKpiViewModel,
  SummaryMonthColumn,
  SummaryPeriodInput,
  SummaryRecentExpenseViewModel,
  SummaryVehicleOption,
  SummaryViewModel,
} from "@/features/summaries/types";

type SummariesPageClientProps = {
  defaultFilters: SummaryPeriodInput;
  vehicles: SummaryVehicleOption[];
  monthColumns: SummaryMonthColumn[];
  summaries: SummaryViewModel[];
  kpis: SummaryKpiViewModel;
  recentExpenses: SummaryRecentExpenseViewModel[];
  filterError?: string;
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
        { key: "fuel", label: "Combustível", amount: totals.fuel, width: Math.round((totals.fuel / max) * 100) },
        { key: "parts", label: "Peças", amount: totals.parts, width: Math.round((totals.parts / max) * 100) },
        { key: "service", label: "Serviços", amount: totals.service, width: Math.round((totals.service / max) * 100) },
      ],
    };
  }, [summaries]);

  const sortedByTotal = useMemo(
    () =>
      [...summaries].sort((a, b) => b.totalSpentCents - a.totalSpentCents),
    [summaries],
  );

  return (
    <div className="space-y-5">
      <Card>
        <CardContent className="space-y-3 p-4 md:p-6">
          <form action="/summaries" className="grid gap-3 lg:grid-cols-[1fr,1fr,1fr,auto,auto]">
            <div>
              <label className="sr-only" htmlFor="summary-vehicleId">
                Veículo
              </label>
              <div className="relative">
                <CarFront className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[#7288A8]" />
                <select
                  id="summary-vehicleId"
                  name="vehicleId"
                  defaultValue={defaultFilters.vehicleId ?? ""}
                  className="h-12 w-full rounded-full border border-[#D3DCEA] bg-[#F8FBFF] py-2 pr-3 pl-9 text-base text-[#1E3658]"
                >
                  <option value="">Todos os veículos</option>
                  {vehicles.map((vehicle) => (
                    <option key={vehicle.id} value={vehicle.id}>
                      {vehicle.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="sr-only" htmlFor="summary-startMonth">
                Mês inicial
              </label>
              <div className="relative">
                <CalendarDays className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[#7288A8]" />
                <input
                  id="summary-startMonth"
                  name="startMonth"
                  type="month"
                  defaultValue={defaultFilters.startMonth}
                  className="h-12 w-full rounded-full border border-[#D3DCEA] bg-[#F8FBFF] py-2 pr-3 pl-9 text-base text-[#1E3658]"
                />
              </div>
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
                className="h-12 w-full rounded-full border border-[#D3DCEA] bg-[#F8FBFF] px-3 py-2 text-base text-[#1E3658]"
              />
            </div>
            <button
              type="submit"
              className="h-12 rounded-full bg-[#2F84EB] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#2676d8]"
            >
              Aplicar filtros
            </button>
            <button
              type="button"
              disabled
              className="h-12 rounded-full border border-[#D3DCEA] bg-white px-4 text-sm font-semibold text-[#778CA8]"
            >
              Exportar CSV (em breve)
            </button>
          </form>
          {filterError ? <p className="text-sm text-[#D94C45]">{filterError}</p> : null}
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardContent className="space-y-2 p-6">
            <div className="flex items-center justify-between">
              <p className="text-xl text-[#5D7290]">Total Gasto</p>
              <span className="grid size-11 place-items-center rounded-full bg-[#E7F0FF] text-[#2F84EB]">
                <Wallet className="size-5" />
              </span>
            </div>
            <p className="text-5xl font-extrabold text-[#101C33]">{kpis.totalSpentLabel}</p>
            <p className="text-sm text-[#7F93AF]">No período selecionado</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-2 p-6">
            <div className="flex items-center justify-between">
              <p className="text-xl text-[#5D7290]">Média Mensal</p>
              <span className="grid size-11 place-items-center rounded-full bg-[#E7F0FF] text-[#2F84EB]">
                <CircleDollarSign className="size-5" />
              </span>
            </div>
            <p className="text-5xl font-extrabold text-[#101C33]">{kpis.monthlyAverageLabel}</p>
            <p className="text-sm text-[#7F93AF]">Média do período filtrado</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-2 p-6">
            <div className="flex items-center justify-between">
              <p className="text-xl text-[#5D7290]">Variação</p>
              <span className="grid size-11 place-items-center rounded-full bg-[#E7F7EF] text-[#1C9E64]">
                <PiggyBank className="size-5" />
              </span>
            </div>
            <p className="text-5xl font-extrabold text-[#101C33]">{kpis.variationLabel}</p>
            <p
              className={`text-sm ${
                kpis.variationDirection === "positive"
                  ? "text-[#17854B]"
                  : kpis.variationDirection === "negative"
                    ? "text-[#D94C45]"
                    : "text-[#7F93AF]"
              }`}
            >
              Comparado ao período anterior equivalente
            </p>
          </CardContent>
        </Card>
      </div>

      {vehicles.length === 0 ? (
        <Card>
          <CardContent className="py-7 text-center">
            <p className="text-base text-[#5E7391]">Cadastre um veículo para visualizar o resumo.</p>
            <Link href="/vehicles" className="mt-2 inline-block text-sm font-semibold text-[#2F84EB]">
              Ir para veículos
            </Link>
          </CardContent>
        </Card>
      ) : summaries.length === 0 ? (
        <Card>
          <CardContent className="py-7 text-center">
            <p className="text-base text-[#5E7391]">Nenhum veículo encontrado para o filtro selecionado.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          <Card>
            <CardContent className="space-y-4 p-6">
              <h2 className="text-4xl font-extrabold text-[#111D36]">Gastos por Categoria</h2>
              <p className="text-xl text-[#6D82A1]">Distribuição no período selecionado</p>
              <div className="space-y-4">
                {categoryTotals.rows.map((row) => (
                  <div key={row.key} className="space-y-1">
                    <div className="flex items-center justify-between text-xl font-semibold text-[#1C2A42]">
                      <span>{row.label}</span>
                      <span>{formatCurrency(row.amount / 100)}</span>
                    </div>
                    <div className="h-3 rounded-full bg-[#E8EEF6]">
                      <div className="h-full rounded-full bg-[#2F84EB]" style={{ width: `${row.width}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="space-y-4 p-6">
              <h2 className="text-4xl font-extrabold text-[#111D36]">Gastos por Veículo</h2>
              <p className="text-xl text-[#6D82A1]">Total acumulado por placa</p>
              <div className="space-y-3">
                {sortedByTotal.map((summary) => (
                  <article
                    key={summary.vehicleId}
                    data-testid="summary-card"
                    className="rounded-3xl border border-[#E0E8F4] bg-[#F9FBFF] p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-2xl font-bold text-[#132039]">{summary.vehicleLabel}</h3>
                        <p className="mt-1 text-base text-[#6D82A1]">Total: {summary.totalSpentLabel}</p>
                      </div>
                      <span className="text-3xl font-extrabold text-[#111D36]">{summary.totalSpentLabel}</span>
                    </div>
                    <div className="mt-3 grid gap-2 text-sm text-[#4F6482] sm:grid-cols-3">
                      <p>Combustível: {summary.categoryBreakdown.fuel}</p>
                      <p>Peças: {summary.categoryBreakdown.parts}</p>
                      <p>Serviços: {summary.categoryBreakdown.service}</p>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2 text-xs">
                      {monthColumns.map((month) => (
                        <span key={month.key} className="rounded-full bg-white px-2 py-1 text-[#5D7290]">
                          {month.label}: <strong data-testid={`month-total-${month.key}`}>{summary.monthlyTotals[month.key]}</strong>
                        </span>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Card>
        <CardContent className="p-0">
          <div className="flex items-center justify-between border-b border-[#E4EAF4] px-6 py-4">
            <h2 className="text-4xl font-extrabold text-[#111D36]">Últimas Despesas</h2>
            <Link href="/expenses" className="text-xl font-bold text-[#2F84EB]">
              Ver todas
            </Link>
          </div>
          {recentExpenses.length === 0 ? (
            <p className="px-6 py-5 text-base text-[#6D82A1]">Sem despesas recentes no período selecionado.</p>
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
                    <TableCell className="font-semibold text-[#14203A]">{expense.vehicleLabel}</TableCell>
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
                    <TableCell className="text-right text-xl font-bold text-[#0F1A32]">
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
