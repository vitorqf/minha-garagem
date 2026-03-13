import {
  createVehicleAction,
  deleteVehicleAction,
  updateVehicleAction,
} from "@/features/vehicles/actions";
import { STUB_OWNER_ID } from "@/features/vehicles/constants";
import { VehiclesPageClient } from "@/features/vehicles/components/vehicles-page-client";
import { getVehicleRepository } from "@/features/vehicles/repositories";
import { listVehicles } from "@/features/vehicles/vehicle-service";
import type { VehicleViewModel } from "@/features/vehicles/types";

export const runtime = "nodejs";

function toVehicleViewModel(input: Awaited<ReturnType<typeof listVehicles>>): VehicleViewModel[] {
  return input.map((vehicle) => ({
    id: vehicle.id,
    nickname: vehicle.nickname,
    brand: vehicle.brand,
    model: vehicle.model,
    plate: vehicle.plate,
    year: vehicle.year,
    createdAt: vehicle.createdAt.toISOString(),
    updatedAt: vehicle.updatedAt.toISOString(),
  }));
}

export default async function VehiclesPage() {
  const repository = getVehicleRepository();
  const vehicles = await listVehicles(repository, STUB_OWNER_ID);

  return (
    <VehiclesPageClient
      vehicles={toVehicleViewModel(vehicles)}
      createVehicleAction={createVehicleAction}
      updateVehicleAction={updateVehicleAction}
      deleteVehicleAction={deleteVehicleAction}
    />
  );
}
