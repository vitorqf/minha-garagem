import { describe, expect, it } from "vitest";

import {
  buildExpensesCsvFilename,
  formatCsvAmountFromCents,
  formatCsvDate,
} from "@/features/reports/format";

describe("reports format helpers", () => {
  it("formats amounts as numeric pt-BR decimal values", () => {
    expect(formatCsvAmountFromCents(15025)).toBe("150,25");
    expect(formatCsvAmountFromCents(0)).toBe("0,00");
    expect(formatCsvAmountFromCents(5)).toBe("0,05");
  });

  it("formats dates as DD/MM/YYYY", () => {
    expect(formatCsvDate(new Date("2026-03-10T00:00:00.000Z"))).toBe("10/03/2026");
  });

  it("builds expenses csv filenames with selected date range", () => {
    expect(buildExpensesCsvFilename("2026-03-01", "2026-03-31")).toBe(
      "despesas-2026-03-01-a-2026-03-31.csv",
    );
  });
});
