import type { VehicleRepository } from "@/features/vehicles/repositories/vehicle-repository";
import { InMemoryVehicleRepository } from "@/features/vehicles/repositories/in-memory-vehicle-repository";
import { PrismaVehicleRepository } from "@/features/vehicles/repositories/prisma-vehicle-repository";

const globalForVehicleRepository = globalThis as unknown as {
  vehicleMemoryRepository: InMemoryVehicleRepository | undefined;
  vehiclePrismaRepository: PrismaVehicleRepository | undefined;
};

const memoryRepository =
  globalForVehicleRepository.vehicleMemoryRepository ?? new InMemoryVehicleRepository();
const prismaRepository =
  globalForVehicleRepository.vehiclePrismaRepository ?? new PrismaVehicleRepository();

if (process.env.NODE_ENV !== "production") {
  globalForVehicleRepository.vehicleMemoryRepository = memoryRepository;
  globalForVehicleRepository.vehiclePrismaRepository = prismaRepository;
}

export function getVehicleRepository(): VehicleRepository {
  if (process.env.VEHICLE_REPOSITORY === "memory") {
    return memoryRepository;
  }

  return prismaRepository;
}
