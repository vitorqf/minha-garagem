"use client";

import Link from "next/link";

import type {
  SummaryMonthColumn,
  SummaryPeriodInput,
  SummaryVehicleOption,
  SummaryViewModel,
} from "@/features/summaries/types";

type SummariesPageClientProps = {
  defaultFilters: SummaryPeriodInput;
  vehicles: SummaryVehicleOption[];
  monthColumns: SummaryMonthColumn[];
  summaries: SummaryViewModel[];
  filterError?: string;
};

export function SummariesPageClient({
  defaultFilters,
  vehicles,
  monthColumns,
  summaries,
  filterError,
}: SummariesPageClientProps) {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6">
      <header className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Resumo de gastos</h1>
        <p className="text-sm text-zinc-600">
          Acompanhe totais por veículo com quebra por categoria e por mês.
        </p>
      </header>

      <section className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-zinc-900">Filtros</h2>

        <form action="/summaries" className="grid gap-3 sm:grid-cols-4">
          <div>
            <label className="mb-1 block text-sm font-medium" htmlFor="summary-vehicleId">
              Veículo
            </label>
            <select
              id="summary-vehicleId"
              name="vehicleId"
              defaultValue={defaultFilters.vehicleId ?? ""}
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
            >
              <option value="">Todos</option>
              {vehicles.map((vehicle) => (
                <option key={vehicle.id} value={vehicle.id}>
                  {vehicle.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium" htmlFor="summary-startMonth">
              Mês inicial
            </label>
            <input
              id="summary-startMonth"
              name="startMonth"
              type="month"
              defaultValue={defaultFilters.startMonth}
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium" htmlFor="summary-endMonth">
              Mês final
            </label>
            <input
              id="summary-endMonth"
              name="endMonth"
              type="month"
              defaultValue={defaultFilters.endMonth}
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="w-full rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white"
            >
              Aplicar filtros
            </button>
          </div>
        </form>

        {filterError ? <p className="mt-3 text-sm text-red-700">{filterError}</p> : null}
      </section>

      {vehicles.length === 0 ? (
        <section className="rounded-xl border border-dashed border-zinc-300 bg-white p-6 text-center">
          <p className="text-sm text-zinc-700">Cadastre um veículo para visualizar o resumo.</p>
          <Link href="/vehicles" className="mt-2 inline-block text-sm font-semibold text-emerald-700">
            Ir para veículos
          </Link>
        </section>
      ) : summaries.length === 0 ? (
        <section className="rounded-xl border border-dashed border-zinc-300 bg-white p-6 text-center">
          <p className="text-sm text-zinc-700">Nenhum veículo encontrado para o filtro selecionado.</p>
        </section>
      ) : (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-900">Totais por veículo</h2>
          <ul className="space-y-3" data-testid="summary-list">
            {summaries.map((summary) => (
              <li
                key={summary.vehicleId}
                data-testid="summary-card"
                className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm"
              >
                <h3 className="text-base font-semibold text-zinc-900">{summary.vehicleLabel}</h3>
                <p className="mt-1 text-sm text-zinc-800">Total: {summary.totalSpentLabel}</p>

                <div className="mt-3 grid gap-2 text-sm text-zinc-700 sm:grid-cols-3">
                  <p>Combustível: {summary.categoryBreakdown.fuel}</p>
                  <p>Peças: {summary.categoryBreakdown.parts}</p>
                  <p>Serviços: {summary.categoryBreakdown.service}</p>
                </div>

                <div className="mt-4 overflow-x-auto">
                  <table className="w-full min-w-[360px] border-collapse text-sm">
                    <thead>
                      <tr className="text-left text-zinc-600">
                        {monthColumns.map((month) => (
                          <th key={month.key} className="border-b border-zinc-200 px-2 py-1 font-medium">
                            {month.label}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="text-zinc-800">
                        {monthColumns.map((month) => (
                          <td
                            key={`${summary.vehicleId}-${month.key}`}
                            data-testid={`month-total-${month.key}`}
                            className="border-b border-zinc-100 px-2 py-2"
                          >
                            {summary.monthlyTotals[month.key]}
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
