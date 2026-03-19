import { describe, expect, it } from "vitest";

import { serializeCsv } from "@/features/reports/csv";

describe("reports csv serializer", () => {
  it("serializes csv with utf-8 bom, semicolon delimiter and crlf endings", () => {
    const csv = serializeCsv({
      headers: ["ID", "Valor"],
      rows: [["expense-1", "150,25"]],
    });

    expect(csv).toBe("\uFEFFID;Valor\r\nexpense-1;150,25\r\n");
  });

  it("escapes quotes, delimiters and new lines safely", () => {
    const csv = serializeCsv({
      headers: ["Observações", "Categoria"],
      rows: [["Peça \"A\"; linha 1\nlinha 2", "service"]],
    });

    expect(csv).toContain('"Peça ""A""; linha 1\nlinha 2";service');
  });

  it("returns header-only csv when rows are empty", () => {
    const csv = serializeCsv({
      headers: ["ID", "Data"],
      rows: [],
    });

    expect(csv).toBe("\uFEFFID;Data\r\n");
  });

  it("neutralizes spreadsheet formula cells", () => {
    const csv = serializeCsv({
      headers: ["Observações"],
      rows: [["=2+2"], ["+cmd"], ["-10"], ["@SUM(A1:A2)"]],
    });

    expect(csv).toContain("'=2+2");
    expect(csv).toContain("'+cmd");
    expect(csv).toContain("'-10");
    expect(csv).toContain("'@SUM(A1:A2)");
  });
});
