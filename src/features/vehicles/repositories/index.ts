import type { VehicleRepository } from "@/features/vehicles/repositories/vehicle-repository";
import { InMemoryVehicleRepository } from "@/features/vehicles/repositories/in-memory-vehicle-repository";
import { PrismaVehicleRepository } from "@/features/vehicles/repositories/prisma-vehicle-repository";

const memoryRepository = new InMemoryVehicleRepository();
const prismaRepository = new PrismaVehicleRepository();

export function getVehicleRepository(): VehicleRepository {
  if (process.env.VEHICLE_REPOSITORY === "memory") {
    return memoryRepository;
  }

  return prismaRepository;
}
