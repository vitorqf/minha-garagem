import { describe, expect, it } from "vitest";

import {
  isValidBrazilianPlate,
  normalizePlate,
  parseVehicleFormData,
  parseVehicleInput,
  toErrorMap,
} from "@/features/vehicles/validation";

describe("vehicle validation", () => {
  it("normalizes plate by trimming, uppercasing and removing hyphen", () => {
    expect(normalizePlate(" abc-1d23 ")).toBe("ABC1D23");
  });

  it("accepts legacy and mercosul brazilian formats", () => {
    expect(isValidBrazilianPlate("ABC1234")).toBe(true);
    expect(isValidBrazilianPlate("ABC1D23")).toBe(true);
  });

  it("rejects invalid plate formats", () => {
    expect(isValidBrazilianPlate("AB123")).toBe(false);

    const invalid = parseVehicleInput({
      nickname: "Meu carro",
      brand: "Toyota",
      model: "Corolla",
      plate: "AB123",
      year: 2020,
    });

    expect(invalid.success).toBe(false);
    if (!invalid.success) {
      expect(invalid.error.flatten().fieldErrors.plate?.[0]).toContain("Placa inválida");
    }
  });

  it("enforces required fields", () => {
    const result = parseVehicleInput({
      nickname: "",
      brand: "",
      model: "",
      plate: undefined,
      year: undefined,
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.nickname?.[0]).toContain("Apelido");
      expect(result.error.flatten().fieldErrors.brand?.[0]).toContain("Marca");
      expect(result.error.flatten().fieldErrors.model?.[0]).toContain("Modelo");
    }
  });

  it("enforces year range", () => {
    const tooOld = parseVehicleInput({
      nickname: "Fusca",
      brand: "VW",
      model: "1300",
      plate: undefined,
      year: 1800,
    });

    expect(tooOld.success).toBe(false);

    const nextYear = new Date().getFullYear() + 2;
    const tooFuture = parseVehicleInput({
      nickname: "Futuro",
      brand: "Marca",
      model: "Modelo",
      plate: undefined,
      year: nextYear,
    });

    expect(tooFuture.success).toBe(false);
  });

  it("rejects non-numeric year values", () => {
    const result = parseVehicleInput({
      nickname: "Teste",
      brand: "Marca",
      model: "Modelo",
      plate: undefined,
      year: "abc",
    });

    expect(result.success).toBe(false);
  });

  it("parses form data preserving optional empty fields as undefined", () => {
    const formData = new FormData();
    formData.set("nickname", "Meu carro");
    formData.set("brand", "Toyota");
    formData.set("model", "Corolla");
    formData.set("plate", " ");
    formData.set("year", "");

    expect(parseVehicleFormData(formData)).toEqual({
      nickname: "Meu carro",
      brand: "Toyota",
      model: "Corolla",
      plate: undefined,
      year: undefined,
    });
  });

  it("maps zod validation errors to field error map", () => {
    const parsed = parseVehicleInput({
      nickname: "",
      brand: "",
      model: "",
      plate: "invalid",
      year: 1800,
    });

    expect(parsed.success).toBe(false);
    if (!parsed.success) {
      const errors = toErrorMap(parsed.error);
      expect(errors.nickname).toContain("Apelido");
      expect(errors.brand).toContain("Marca");
      expect(errors.model).toContain("Modelo");
      expect(errors.plate).toContain("Placa");
      expect(errors.year).toContain("Ano");
    }
  });
});
