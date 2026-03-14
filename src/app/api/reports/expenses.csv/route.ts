import { getCurrentOwnerId } from "@/features/auth/session";
import { getExpenseRepository } from "@/features/expenses/repositories";
import { REPORT_COPY } from "@/features/reports/constants";
import { serializeCsv } from "@/features/reports/csv";
import { buildExpensesCsvFilename } from "@/features/reports/format";
import { buildExpenseCsvExport } from "@/features/reports/service";
import type { ReportExpenseExportFilter } from "@/features/reports/types";
import { getVehicleRepository } from "@/features/vehicles/repositories";

export const runtime = "nodejs";

const EXPENSE_CSV_HEADERS = [
  "ID",
  "Data",
  "Veículo",
  "Categoria",
  "Valor (R$)",
  "Quilometragem (km)",
  "Observações",
] as const;

function parseFilterFromRequest(request: Request): ReportExpenseExportFilter {
  const { searchParams } = new URL(request.url);

  return {
    vehicleId: searchParams.get("vehicleId") ?? "",
    startDate: searchParams.get("startDate") ?? "",
    endDate: searchParams.get("endDate") ?? "",
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

  const result = await buildExpenseCsvExport(
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
    headers: [...EXPENSE_CSV_HEADERS],
    rows: result.data.rows.map((row) => [
      row.id,
      row.date,
      row.vehicle,
      row.category,
      row.amount,
      row.mileage,
      row.notes,
    ]),
  });

  const filename = buildExpensesCsvFilename(
    result.data.appliedFilter.startDate,
    result.data.appliedFilter.endDate,
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
