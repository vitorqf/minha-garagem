import { VEHICLE_COPY } from "@/features/vehicles/constants";
import type { VehicleRepository } from "@/features/vehicles/repositories/vehicle-repository";
import { parseVehicleInput, toErrorMap } from "@/features/vehicles/validation";
import type { Vehicle, VehicleInput } from "@/features/vehicles/types";
import { isPrismaUniqueConstraintError } from "@/lib/prisma-errors";

type ServiceSuccess<T> = {
  ok: true;
  data: T;
  message?: string;
};

type ServiceFailure = {
  ok: false;
  message: string;
  errors?: Record<string, string>;
};

type ServiceResult<T> = ServiceSuccess<T> | ServiceFailure;

const byNewest = (a: Vehicle, b: Vehicle) => b.createdAt.getTime() - a.createdAt.getTime();

export async function listVehicles(
  repository: VehicleRepository,
  ownerId: string,
): Promise<Vehicle[]> {
  const vehicles = await repository.listByOwner(ownerId);
  return vehicles.sort(byNewest);
}

export async function createVehicle(
  repository: VehicleRepository,
  ownerId: string,
  input: VehicleInput,
): Promise<ServiceResult<Vehicle>> {
  const parsed = parseVehicleInput(input);

  if (!parsed.success) {
    return {
      ok: false,
      message: VEHICLE_COPY.genericError,
      errors: toErrorMap(parsed.error),
    };
  }

  if (parsed.data.plate) {
    const existing = await repository.findByOwnerAndPlate(ownerId, parsed.data.plate);
    if (existing) {
      return {
        ok: false,
        message: VEHICLE_COPY.duplicatePlate,
        errors: { plate: VEHICLE_COPY.duplicatePlate },
      };
    }
  }

  let vehicle: Vehicle;

  try {
    vehicle = await repository.create({
      ownerId,
      nickname: parsed.data.nickname,
      brand: parsed.data.brand,
      model: parsed.data.model,
      plate: parsed.data.plate,
      year: parsed.data.year,
    });
  } catch (error) {
    if (isPrismaUniqueConstraintError(error)) {
      return {
        ok: false,
        message: VEHICLE_COPY.duplicatePlate,
        errors: { plate: VEHICLE_COPY.duplicatePlate },
      };
    }

    throw error;
  }

  return {
    ok: true,
    data: vehicle,
    message: VEHICLE_COPY.created,
  };
}

export async function updateVehicle(
  repository: VehicleRepository,
  ownerId: string,
  id: string,
  input: VehicleInput,
): Promise<ServiceResult<Vehicle>> {
  const parsed = parseVehicleInput(input);

  if (!parsed.success) {
    return {
      ok: false,
      message: VEHICLE_COPY.genericError,
      errors: toErrorMap(parsed.error),
    };
  }

  const existingVehicle = await repository.findById(id, ownerId);
  if (!existingVehicle) {
    return {
      ok: false,
      message: VEHICLE_COPY.notFound,
    };
  }

  if (parsed.data.plate) {
    const plateOwner = await repository.findByOwnerAndPlate(ownerId, parsed.data.plate);
    if (plateOwner && plateOwner.id !== id) {
      return {
        ok: false,
        message: VEHICLE_COPY.duplicatePlate,
        errors: { plate: VEHICLE_COPY.duplicatePlate },
      };
    }
  }

  let vehicle: Vehicle | null;

  try {
    vehicle = await repository.update(id, ownerId, parsed.data);
  } catch (error) {
    if (isPrismaUniqueConstraintError(error)) {
      return {
        ok: false,
        message: VEHICLE_COPY.duplicatePlate,
        errors: { plate: VEHICLE_COPY.duplicatePlate },
      };
    }

    throw error;
  }
  if (!vehicle) {
    return {
      ok: false,
      message: VEHICLE_COPY.notFound,
    };
  }

  return {
    ok: true,
    data: vehicle,
    message: VEHICLE_COPY.updated,
  };
}

export async function deleteVehicle(
  repository: VehicleRepository,
  ownerId: string,
  id: string,
  options?: {
    hasRelatedExpenses?: (ownerId: string, vehicleId: string) => Promise<boolean>;
  },
): Promise<ServiceResult<boolean>> {
  if (options?.hasRelatedExpenses) {
    const hasRelatedExpenses = await options.hasRelatedExpenses(ownerId, id);
    if (hasRelatedExpenses) {
      return {
        ok: false,
        message: VEHICLE_COPY.vehicleHasExpenses,
        errors: { form: VEHICLE_COPY.vehicleHasExpenses },
      };
    }
  }

  const deleted = await repository.delete(id, ownerId);

  if (!deleted) {
    return {
      ok: false,
      message: VEHICLE_COPY.notFound,
    };
  }

  return {
    ok: true,
    data: true,
    message: VEHICLE_COPY.deleted,
  };
}
