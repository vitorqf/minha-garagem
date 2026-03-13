import type { Vehicle, VehicleInput, VehicleUpdateInput } from "@/features/vehicles/types";

export type VehicleCreateData = VehicleInput & {
  ownerId: string;
};

export interface VehicleRepository {
  listByOwner(ownerId: string): Promise<Vehicle[]>;
  findById(id: string, ownerId: string): Promise<Vehicle | null>;
  findByOwnerAndPlate(ownerId: string, plate: string): Promise<Vehicle | null>;
  create(data: VehicleCreateData): Promise<Vehicle>;
  update(id: string, ownerId: string, data: VehicleInput): Promise<Vehicle | null>;
  delete(id: string, ownerId: string): Promise<boolean>;
}

export function toUpdateInput(payload: VehicleUpdateInput): VehicleInput {
  return {
    nickname: payload.nickname,
    brand: payload.brand,
    model: payload.model,
    plate: payload.plate,
    year: payload.year,
  };
}
