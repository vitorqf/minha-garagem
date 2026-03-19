const UTF8_BOM = "\uFEFF";
const CSV_DELIMITER = ";";
const CSV_LINE_ENDING = "\r\n";

type CsvValue = string | number | null | undefined;

function sanitizeSpreadsheetFormula(value: string): string {
  if (/^[=+\-@]/.test(value)) {
    return `'${value}`;
  }

  return value;
}

export type CsvTable = {
  headers: string[];
  rows: CsvValue[][];
};

function escapeCsvCell(value: CsvValue): string {
  const normalized = value === null || value === undefined ? "" : sanitizeSpreadsheetFormula(String(value));
  const escaped = normalized.replaceAll('"', '""');

  if (/[";\n\r]/.test(normalized)) {
    return `"${escaped}"`;
  }

  return escaped;
}

export function serializeCsv(table: CsvTable): string {
  const headerLine = table.headers.map((header) => escapeCsvCell(header)).join(CSV_DELIMITER);
  const dataLines = table.rows.map((row) => row.map((value) => escapeCsvCell(value)).join(CSV_DELIMITER));
  const allLines = [headerLine, ...dataLines].join(CSV_LINE_ENDING);

  return `${UTF8_BOM}${allLines}${CSV_LINE_ENDING}`;
}
