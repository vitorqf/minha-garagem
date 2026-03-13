import { z } from "zod";

import { VEHICLE_COPY } from "@/features/vehicles/constants";
import type { VehicleInput } from "@/features/vehicles/types";

const currentYear = new Date().getFullYear();

const legacyPlatePattern = /^[A-Z]{3}[0-9]{4}$/;
const mercosulPlatePattern = /^[A-Z]{3}[0-9][A-Z][0-9]{2}$/;

export function normalizePlate(plate: string): string {
  return plate.trim().toUpperCase().replace(/[\s-]/g, "");
}

export function isValidBrazilianPlate(plate: string): boolean {
  return legacyPlatePattern.test(plate) || mercosulPlatePattern.test(plate);
}

const normalizedPlateSchema = z
  .string()
  .transform((value) => normalizePlate(value))
  .refine((value) => isValidBrazilianPlate(value), {
    message: VEHICLE_COPY.invalidPlate,
  });

const yearSchema = z
  .number({
    error: VEHICLE_COPY.invalidYear,
  })
  .int({ error: VEHICLE_COPY.invalidYear })
  .min(1900, { message: VEHICLE_COPY.invalidYear })
  .max(currentYear + 1, { message: VEHICLE_COPY.invalidYear });

export const vehicleInputSchema = z.object({
  nickname: z.string().trim().min(1, VEHICLE_COPY.requiredNickname),
  brand: z.string().trim().min(1, VEHICLE_COPY.requiredBrand),
  model: z.string().trim().min(1, VEHICLE_COPY.requiredModel),
  plate: z
    .string()
    .trim()
    .optional()
    .or(z.literal(""))
    .transform((value) => {
      if (!value) {
        return undefined;
      }
      return value;
    })
    .pipe(normalizedPlateSchema.optional()),
  year: z
    .preprocess((value) => {
      if (value === undefined || value === null || value === "") {
        return undefined;
      }

      if (typeof value === "string") {
        return Number(value);
      }

      return value;
    }, yearSchema.optional())
    .nullable(),
});

export function parseVehicleInput(input: VehicleInput) {
  return vehicleInputSchema.safeParse(input);
}

export function parseVehicleFormData(formData: FormData): VehicleInput {
  const nickname = String(formData.get("nickname") ?? "");
  const brand = String(formData.get("brand") ?? "");
  const model = String(formData.get("model") ?? "");
  const plateValue = String(formData.get("plate") ?? "").trim();
  const yearRaw = String(formData.get("year") ?? "").trim();

  return {
    nickname,
    brand,
    model,
    plate: plateValue.length > 0 ? plateValue : undefined,
    year: yearRaw.length > 0 ? yearRaw : undefined,
  };
}

export function toErrorMap(error: z.ZodError): Record<string, string> {
  const fieldErrors = error.flatten().fieldErrors as Record<string, string[] | undefined>;
  const getFieldError = (field: string) => fieldErrors[field]?.[0] ?? "";

  return {
    nickname: getFieldError("nickname"),
    brand: getFieldError("brand"),
    model: getFieldError("model"),
    plate: getFieldError("plate"),
    year: getFieldError("year"),
  };
}
