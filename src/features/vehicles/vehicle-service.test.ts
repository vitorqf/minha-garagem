import { describe, expect, it } from "vitest";

import { InMemoryVehicleRepository } from "@/features/vehicles/repositories/in-memory-vehicle-repository";
import {
  createVehicle,
  deleteVehicle,
  listVehicles,
  updateVehicle,
} from "@/features/vehicles/vehicle-service";

describe("vehicle service", () => {
  it("rejects duplicate plate for the same owner", async () => {
    const repository = new InMemoryVehicleRepository();

    const first = await createVehicle(repository, "owner-a", {
      nickname: "Carro A",
      brand: "Fiat",
      model: "Uno",
      plate: "ABC1D23",
      year: 2020,
    });
    expect(first.ok).toBe(true);

    const duplicate = await createVehicle(repository, "owner-a", {
      nickname: "Carro B",
      brand: "VW",
      model: "Gol",
      plate: "ABC1D23",
      year: 2021,
    });

    expect(duplicate.ok).toBe(false);
    if (!duplicate.ok) {
      expect(duplicate.errors?.plate).toContain("Já existe");
    }
  });

  it("allows same plate for different owners", async () => {
    const repository = new InMemoryVehicleRepository();

    const first = await createVehicle(repository, "owner-a", {
      nickname: "Carro A",
      brand: "Fiat",
      model: "Uno",
      plate: "ABC1D23",
      year: 2020,
    });

    const second = await createVehicle(repository, "owner-b", {
      nickname: "Carro B",
      brand: "VW",
      model: "Gol",
      plate: "ABC1D23",
      year: 2021,
    });

    expect(first.ok).toBe(true);
    expect(second.ok).toBe(true);
  });

  it("lists vehicles ordered by newest first", async () => {
    const repository = new InMemoryVehicleRepository();

    const first = await createVehicle(repository, "owner-a", {
      nickname: "Primeiro",
      brand: "Fiat",
      model: "Uno",
      plate: undefined,
      year: 2018,
    });

    await new Promise((resolve) => setTimeout(resolve, 2));

    const second = await createVehicle(repository, "owner-a", {
      nickname: "Segundo",
      brand: "Toyota",
      model: "Corolla",
      plate: undefined,
      year: 2020,
    });

    expect(first.ok).toBe(true);
    expect(second.ok).toBe(true);

    const vehicles = await listVehicles(repository, "owner-a");
    expect(vehicles.map((vehicle) => vehicle.nickname)).toEqual(["Segundo", "Primeiro"]);
  });

  it("updates and deletes a vehicle", async () => {
    const repository = new InMemoryVehicleRepository();

    const created = await createVehicle(repository, "owner-a", {
      nickname: "Carro",
      brand: "Ford",
      model: "Ka",
      plate: "ABC1234",
      year: 2016,
    });

    expect(created.ok).toBe(true);
    if (!created.ok) {
      return;
    }

    const updated = await updateVehicle(repository, "owner-a", created.data.id, {
      nickname: "Carro Atualizado",
      brand: "Ford",
      model: "Ka",
      plate: "ABC1234",
      year: 2017,
    });

    expect(updated.ok).toBe(true);
    if (updated.ok) {
      expect(updated.data.nickname).toBe("Carro Atualizado");
      expect(updated.data.year).toBe(2017);
    }

    const deleted = await deleteVehicle(repository, "owner-a", created.data.id);
    expect(deleted.ok).toBe(true);

    const remaining = await listVehicles(repository, "owner-a");
    expect(remaining).toHaveLength(0);
  });
});
