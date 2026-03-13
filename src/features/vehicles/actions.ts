"use server";

import { revalidatePath } from "next/cache";

import { STUB_OWNER_ID, VEHICLE_COPY } from "@/features/vehicles/constants";
import { getVehicleRepository } from "@/features/vehicles/repositories";
import {
  createVehicle,
  deleteVehicle,
  updateVehicle,
} from "@/features/vehicles/vehicle-service";
import { parseVehicleFormData } from "@/features/vehicles/validation";
import {
  initialVehicleFormState,
  type VehicleFormState,
} from "@/features/vehicles/types";

function toFailureState(
  message: string,
  errors?: VehicleFormState["errors"],
): VehicleFormState {
  return {
    status: "error",
    message,
    errors,
  };
}

export async function createVehicleAction(
  previousState: VehicleFormState = initialVehicleFormState,
  formData: FormData,
): Promise<VehicleFormState> {
  void previousState;
  const repository = getVehicleRepository();
  const input = parseVehicleFormData(formData);
  const result = await createVehicle(repository, STUB_OWNER_ID, input);

  if (!result.ok) {
    return toFailureState(result.message, result.errors);
  }

  revalidatePath("/vehicles");

  return {
    status: "success",
    message: result.message,
    errors: {},
  };
}

export async function updateVehicleAction(
  previousState: VehicleFormState = initialVehicleFormState,
  formData: FormData,
): Promise<VehicleFormState> {
  void previousState;
  const id = String(formData.get("id") ?? "").trim();
  if (!id) {
    return toFailureState(VEHICLE_COPY.notFound, { form: VEHICLE_COPY.notFound });
  }

  const repository = getVehicleRepository();
  const input = parseVehicleFormData(formData);
  const result = await updateVehicle(repository, STUB_OWNER_ID, id, input);

  if (!result.ok) {
    return toFailureState(result.message, result.errors);
  }

  revalidatePath("/vehicles");

  return {
    status: "success",
    message: result.message,
    errors: {},
  };
}

export async function deleteVehicleAction(formData: FormData): Promise<void> {
  const id = String(formData.get("id") ?? "").trim();
  if (!id) {
    return;
  }

  const repository = getVehicleRepository();
  const result = await deleteVehicle(repository, STUB_OWNER_ID, id);

  if (result.ok) {
    revalidatePath("/vehicles");
  }
}
