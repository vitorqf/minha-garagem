import { prisma } from "@/lib/prisma";
import type {
  VehicleRepository,
  VehicleCreateData,
} from "@/features/vehicles/repositories/vehicle-repository";
import type { Vehicle, VehicleInput } from "@/features/vehicles/types";

function normalizeYear(value: VehicleInput["year"]): number | null {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  if (typeof value === "number") {
    return value;
  }

  const parsed = Number(value);
  return Number.isInteger(parsed) ? parsed : null;
}

export class PrismaVehicleRepository implements VehicleRepository {
  async listByOwner(ownerId: string): Promise<Vehicle[]> {
    return prisma.vehicle.findMany({
      where: { ownerId },
      orderBy: { createdAt: "desc" },
    });
  }

  async findById(id: string, ownerId: string): Promise<Vehicle | null> {
    return prisma.vehicle.findFirst({
      where: { id, ownerId },
    });
  }

  async findByOwnerAndPlate(ownerId: string, plate: string): Promise<Vehicle | null> {
    return prisma.vehicle.findFirst({
      where: {
        ownerId,
        plate,
      },
    });
  }

  async create(data: VehicleCreateData): Promise<Vehicle> {
    return prisma.vehicle.create({
      data: {
        ownerId: data.ownerId,
        nickname: data.nickname,
        brand: data.brand,
        model: data.model,
        plate: data.plate ?? null,
        year: normalizeYear(data.year),
      },
    });
  }

  async update(id: string, ownerId: string, data: VehicleInput): Promise<Vehicle | null> {
    const found = await prisma.vehicle.findFirst({
      where: { id, ownerId },
      select: { id: true },
    });

    if (!found) {
      return null;
    }

    return prisma.vehicle.update({
      where: { id: found.id },
      data: {
        nickname: data.nickname,
        brand: data.brand,
        model: data.model,
        plate: data.plate ?? null,
        year: normalizeYear(data.year),
      },
    });
  }

  async delete(id: string, ownerId: string): Promise<boolean> {
    const found = await prisma.vehicle.findFirst({
      where: { id, ownerId },
      select: { id: true },
    });

    if (!found) {
      return false;
    }

    await prisma.vehicle.delete({
      where: { id: found.id },
    });

    return true;
  }
}
