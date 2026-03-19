import { describe, expect, it } from "vitest";

import {
  formatSummaryCurrencyFromCents,
  formatSummaryMonthLabel,
  getCurrentYearMonth,
  getDefaultSummaryPeriod,
  getMonthKeysBetween,
  toEndDateFromMonth,
  toStartDateFromMonth,
} from "@/features/summaries/format";

describe("summaries format", () => {
  it("formats currency from cents", () => {
    const formatted = formatSummaryCurrencyFromCents(12345);

    expect(formatted).toContain("123,45");
  });

  it("formats month labels in pt-BR", () => {
    const label = formatSummaryMonthLabel("2026-02");

    expect(label.toLowerCase()).toContain("2026");
  });

  it("builds current and default period from a given date", () => {
    const today = new Date(Date.UTC(2026, 2, 19));

    expect(getCurrentYearMonth(today)).toBe("2026-03");
    expect(getDefaultSummaryPeriod(today)).toEqual({
      startMonth: "2026-03",
      endMonth: "2026-03",
      vehicleId: "",
    });
  });

  it("builds month keys between start and end with year rollover", () => {
    expect(getMonthKeysBetween("2025-12", "2026-02")).toEqual([
      "2025-12",
      "2026-01",
      "2026-02",
    ]);
  });

  it("builds inclusive month date boundaries", () => {
    expect(toStartDateFromMonth("2026-03")).toBe("2026-03-01");
    expect(toEndDateFromMonth("2026-03")).toBe("2026-03-31");
    expect(toEndDateFromMonth("2024-02")).toBe("2024-02-29");
  });
});
