import { z } from "zod";

import { SUMMARY_COPY } from "@/features/summaries/constants";
import type { SummaryPeriodInput } from "@/features/summaries/types";

const monthPattern = /^\d{4}-\d{2}$/;

function isValidYearMonth(value: string): boolean {
  if (!monthPattern.test(value)) {
    return false;
  }

  const [yearRaw, monthRaw] = value.split("-");
  const year = Number(yearRaw);
  const month = Number(monthRaw);

  return Number.isInteger(year) && year >= 1900 && Number.isInteger(month) && month >= 1 && month <= 12;
}

const startMonthSchema = z
  .string()
  .trim()
  .min(1, SUMMARY_COPY.requiredStartMonth)
  .refine((value) => isValidYearMonth(value), {
    message: SUMMARY_COPY.invalidStartMonth,
  });

const endMonthSchema = z
  .string()
  .trim()
  .min(1, SUMMARY_COPY.requiredEndMonth)
  .refine((value) => isValidYearMonth(value), {
    message: SUMMARY_COPY.invalidEndMonth,
  });

export const summaryPeriodSchema = z
  .object({
    startMonth: startMonthSchema,
    endMonth: endMonthSchema,
    vehicleId: z.string().trim().optional().or(z.literal("")),
  })
  .refine((value) => value.startMonth <= value.endMonth, {
    message: SUMMARY_COPY.invalidPeriod,
    path: ["period"],
  });

export function parseSummaryPeriod(input: SummaryPeriodInput) {
  return summaryPeriodSchema.safeParse(input);
}

export function toSummaryErrorMap(error: z.ZodError): Record<string, string> {
  const fieldErrors = error.flatten().fieldErrors;

  return {
    startMonth: fieldErrors.startMonth?.[0] ?? "",
    endMonth: fieldErrors.endMonth?.[0] ?? "",
    vehicleId: fieldErrors.vehicleId?.[0] ?? "",
    period: fieldErrors.period?.[0] ?? "",
  };
}
