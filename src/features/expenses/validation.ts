import { z } from "zod";

import { EXPENSE_COPY } from "@/features/expenses/constants";
import type { ExpenseFilterInput, ExpenseInput } from "@/features/expenses/types";

const expenseCategorySchema = z.enum(["fuel", "parts", "service"], {
  error: EXPENSE_COPY.invalidCategory,
});

const dateStringSchema = z
  .string()
  .trim()
  .min(1, EXPENSE_COPY.requiredDate)
  .regex(/^\d{4}-\d{2}-\d{2}$/, EXPENSE_COPY.requiredDate)
  .refine((value) => !Number.isNaN(Date.parse(`${value}T00:00:00.000Z`)), {
    message: EXPENSE_COPY.requiredDate,
  });

export function parseMonetaryInputToCents(input: string): number {
  const trimmed = input.trim();
  if (!trimmed) {
    return Number.NaN;
  }

  const normalized = trimmed.replace(/\s/g, "");
  let decimal = normalized;

  if (normalized.includes(",") && normalized.includes(".")) {
    decimal = normalized.replace(/\./g, "").replace(/,/g, ".");
  } else if (normalized.includes(",")) {
    decimal = normalized.replace(/,/g, ".");
  }

  const parsed = Number(decimal);
  if (!Number.isFinite(parsed)) {
    return Number.NaN;
  }

  return Math.round(parsed * 100);
}

const amountSchema = z
  .string()
  .trim()
  .min(1, EXPENSE_COPY.requiredAmount)
  .transform((value) => ({ raw: value, cents: parseMonetaryInputToCents(value) }))
  .refine((value) => Number.isInteger(value.cents) && value.cents > 0, {
    message: EXPENSE_COPY.invalidAmount,
  });

const mileageSchema = z
  .string()
  .trim()
  .optional()
  .or(z.literal(""))
  .transform((value) => {
    if (!value) {
      return undefined;
    }

    const parsed = Number(value);
    if (!Number.isInteger(parsed) || parsed <= 0) {
      return Number.NaN;
    }

    return parsed;
  })
  .refine((value) => value === undefined || Number.isInteger(value), {
    message: EXPENSE_COPY.invalidMileage,
  });

const notesSchema = z
  .string()
  .trim()
  .optional()
  .or(z.literal(""))
  .transform((value) => (value ? value : undefined))
  .refine((value) => value === undefined || value.length <= 500, {
    message: EXPENSE_COPY.invalidNotes,
  });

export const expenseInputSchema = z.object({
  vehicleId: z.string().trim().min(1, EXPENSE_COPY.requiredVehicle),
  expenseDate: dateStringSchema,
  category: z
    .string()
    .trim()
    .min(1, EXPENSE_COPY.requiredCategory)
    .pipe(expenseCategorySchema),
  amountInput: amountSchema,
  mileage: mileageSchema,
  notes: notesSchema,
});

export const expenseFilterSchema = z
  .object({
    vehicleId: z.string().trim().optional().or(z.literal("")),
    startDate: dateStringSchema,
    endDate: dateStringSchema,
  })
  .refine((value) => value.startDate <= value.endDate, {
    message: EXPENSE_COPY.invalidPeriod,
    path: ["period"],
  });

export function parseExpenseInput(input: ExpenseInput) {
  return expenseInputSchema.safeParse(input);
}

export function parseExpenseFilter(input: ExpenseFilterInput) {
  return expenseFilterSchema.safeParse(input);
}

export function parseExpenseFormData(formData: FormData): ExpenseInput {
  return {
    vehicleId: String(formData.get("vehicleId") ?? ""),
    expenseDate: String(formData.get("expenseDate") ?? ""),
    category: String(formData.get("category") ?? ""),
    amountInput: String(formData.get("amountInput") ?? ""),
    mileage: String(formData.get("mileage") ?? ""),
    notes: String(formData.get("notes") ?? ""),
  };
}

export function parseExpenseFilterFormData(formData: FormData): ExpenseFilterInput {
  return {
    vehicleId: String(formData.get("vehicleId") ?? ""),
    startDate: String(formData.get("startDate") ?? ""),
    endDate: String(formData.get("endDate") ?? ""),
  };
}

export function toExpenseErrorMap(error: z.ZodError): Record<string, string> {
  const fieldErrors = error.flatten().fieldErrors as Record<string, string[] | undefined>;
  const getFieldError = (field: string) => fieldErrors[field]?.[0] ?? "";

  return {
    vehicleId: getFieldError("vehicleId"),
    expenseDate: getFieldError("expenseDate"),
    category: getFieldError("category"),
    amountInput: getFieldError("amountInput"),
    mileage: getFieldError("mileage"),
    notes: getFieldError("notes"),
    period: getFieldError("period"),
  };
}
