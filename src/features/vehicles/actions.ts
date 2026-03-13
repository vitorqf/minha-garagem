"use server";

import { revalidatePath } from "next/cache";

import { requireAuthenticatedOwnerId } from "@/features/auth/session";
import { VEHICLE_COPY } from "@/features/vehicles/constants";
import { getExpenseRepository } from "@/features/expenses/repositories";
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
  const ownerId = await requireAuthenticatedOwnerId();
  const repository = getVehicleRepository();
  const input = parseVehicleFormData(formData);
  const result = await createVehicle(repository, ownerId, input);

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
  const ownerId = await requireAuthenticatedOwnerId();
  const id = String(formData.get("id") ?? "").trim();
  if (!id) {
    return toFailureState(VEHICLE_COPY.notFound, { form: VEHICLE_COPY.notFound });
  }

  const repository = getVehicleRepository();
  const input = parseVehicleFormData(formData);
  const result = await updateVehicle(repository, ownerId, id, input);

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

export async function deleteVehicleAction(
  previousState: VehicleFormState = initialVehicleFormState,
  formData: FormData,
): Promise<VehicleFormState> {
  void previousState;
  const ownerId = await requireAuthenticatedOwnerId();
  const id = String(formData.get("id") ?? "").trim();
  if (!id) {
    return toFailureState(VEHICLE_COPY.notFound, { form: VEHICLE_COPY.notFound });
  }

  const repository = getVehicleRepository();
  const expenseRepository = getExpenseRepository();
  const deletion = await deleteVehicle(repository, ownerId, id, {
    hasRelatedExpenses: expenseRepository.hasVehicleExpenses.bind(expenseRepository),
  });

  if (!deletion.ok) {
    return toFailureState(deletion.message, deletion.errors);
  }

  revalidatePath("/vehicles");
  revalidatePath("/expenses");

  return {
    status: "success",
    message: deletion.message,
    errors: {},
  };
}
