import { getCurrentOwnerId } from "@/features/auth/session";
import { getExpenseRepository } from "@/features/expenses/repositories";
import { REPORT_COPY } from "@/features/reports/constants";
import { serializeCsv } from "@/features/reports/csv";
import { buildSummariesCsvFilename } from "@/features/reports/format";
import { buildSummaryCsvExport } from "@/features/reports/service";
import type { ReportSummaryExportFilter } from "@/features/reports/types";
import { getVehicleRepository } from "@/features/vehicles/repositories";

export const runtime = "nodejs";

const SUMMARY_CSV_HEADERS = [
  "Veículo",
  "Total (R$)",
  "Combustível (R$)",
  "Peças (R$)",
  "Serviços (R$)",
] as const;

function parseFilterFromRequest(request: Request): ReportSummaryExportFilter {
  const { searchParams } = new URL(request.url);

  return {
    vehicleId: searchParams.get("vehicleId") ?? "",
    startMonth: searchParams.get("startMonth") ?? "",
    endMonth: searchParams.get("endMonth") ?? "",
  };
}

export async function GET(request: Request): Promise<Response> {
  const ownerId = await getCurrentOwnerId();
  if (!ownerId) {
    return Response.json(
      {
        message: REPORT_COPY.unauthorized,
      },
      {
        status: 401,
      },
    );
  }

  const result = await buildSummaryCsvExport(
    getVehicleRepository(),
    getExpenseRepository(),
    ownerId,
    parseFilterFromRequest(request),
  );

  if (!result.ok) {
    return Response.json(
      {
        message: result.message,
        errors: result.errors ?? {},
      },
      {
        status: 400,
      },
    );
  }

  const csv = serializeCsv({
    headers: [
      ...SUMMARY_CSV_HEADERS,
      ...result.data.months.map((month) => result.data.monthLabels[month] ?? month),
    ],
    rows: result.data.rows.map((row) => [
      row.vehicle,
      row.total,
      row.fuel,
      row.parts,
      row.service,
      ...result.data.months.map((month) => row.monthlyTotals[month] ?? "0,00"),
    ]),
  });

  const filename = buildSummariesCsvFilename(
    result.data.appliedFilter.startMonth,
    result.data.appliedFilter.endMonth,
  );

  return new Response(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
