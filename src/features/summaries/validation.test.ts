import { describe, expect, it } from "vitest";

import { parseSummaryPeriod } from "@/features/summaries/validation";

describe("summary validation", () => {
  it("rejects invalid month format", () => {
    const parsed = parseSummaryPeriod({
      startMonth: "2026/01",
      endMonth: "2026-02",
      vehicleId: "",
    });

    expect(parsed.success).toBe(false);
    if (!parsed.success) {
      expect(parsed.error.flatten().fieldErrors.startMonth?.[0]).toContain("Mês");
    }
  });

  it("rejects invalid month range", () => {
    const parsed = parseSummaryPeriod({
      startMonth: "2026-03",
      endMonth: "2026-02",
      vehicleId: "",
    });

    expect(parsed.success).toBe(false);
    if (!parsed.success) {
      expect(parsed.error.flatten().fieldErrors.period?.[0]).toContain("Período");
    }
  });

  it("accepts an inclusive month range", () => {
    const parsed = parseSummaryPeriod({
      startMonth: "2026-02",
      endMonth: "2026-02",
      vehicleId: "vehicle-1",
    });

    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.startMonth).toBe("2026-02");
      expect(parsed.data.endMonth).toBe("2026-02");
      expect(parsed.data.vehicleId).toBe("vehicle-1");
    }
  });
});
