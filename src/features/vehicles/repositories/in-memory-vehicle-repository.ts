import type {
  VehicleRepository,
  VehicleCreateData,
} from "@/features/vehicles/repositories/vehicle-repository";
import type { Vehicle, VehicleInput } from "@/features/vehicles/types";

const byNewest = (a: Vehicle, b: Vehicle) => b.createdAt.getTime() - a.createdAt.getTime();

export class InMemoryVehicleRepository implements VehicleRepository {
  private readonly vehicles: Vehicle[] = [];

  async listByOwner(ownerId: string): Promise<Vehicle[]> {
    return this.vehicles
      .filter((vehicle) => vehicle.ownerId === ownerId)
      .sort(byNewest)
      .map((vehicle) => ({ ...vehicle }));
  }

  async findById(id: string, ownerId: string): Promise<Vehicle | null> {
    const vehicle = this.vehicles.find((item) => item.id === id && item.ownerId === ownerId);
    return vehicle ? { ...vehicle } : null;
  }

  async findByOwnerAndPlate(ownerId: string, plate: string): Promise<Vehicle | null> {
    const vehicle = this.vehicles.find(
      (item) => item.ownerId === ownerId && item.plate !== null && item.plate === plate,
    );

    return vehicle ? { ...vehicle } : null;
  }

  async create(data: VehicleCreateData): Promise<Vehicle> {
    const now = new Date();
    const vehicle: Vehicle = {
      id: crypto.randomUUID(),
      ownerId: data.ownerId,
      nickname: data.nickname,
      brand: data.brand,
      model: data.model,
      plate: data.plate ?? null,
      year: data.year ?? null,
      createdAt: now,
      updatedAt: now,
    };

    this.vehicles.push(vehicle);
    return { ...vehicle };
  }

  async update(id: string, ownerId: string, data: VehicleInput): Promise<Vehicle | null> {
    const targetIndex = this.vehicles.findIndex((item) => item.id === id && item.ownerId === ownerId);
    if (targetIndex === -1) {
      return null;
    }

    const previous = this.vehicles[targetIndex];
    const updated: Vehicle = {
      ...previous,
      nickname: data.nickname,
      brand: data.brand,
      model: data.model,
      plate: data.plate ?? null,
      year: data.year ?? null,
      updatedAt: new Date(),
    };

    this.vehicles[targetIndex] = updated;
    return { ...updated };
  }

  async delete(id: string, ownerId: string): Promise<boolean> {
    const previousLength = this.vehicles.length;
    const filtered = this.vehicles.filter((item) => !(item.id === id && item.ownerId === ownerId));

    if (filtered.length === previousLength) {
      return false;
    }

    this.vehicles.splice(0, this.vehicles.length, ...filtered);
    return true;
  }
}
