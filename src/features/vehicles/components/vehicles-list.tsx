"use client";

import { useActionState, useMemo, useState } from "react";
import { useFormStatus } from "react-dom";

import { initialVehicleFormState, type VehicleFormState, type VehicleViewModel } from "@/features/vehicles/types";
import { VehicleFormFields } from "@/features/vehicles/components/vehicle-form-fields";

type VehicleMutationAction = (
  state: VehicleFormState,
  formData: FormData,
) => Promise<VehicleFormState>;

type VehicleDeleteAction = (
  state: VehicleFormState,
  formData: FormData,
) => Promise<VehicleFormState>;

type VehiclesListProps = {
  vehicles: VehicleViewModel[];
  updateVehicleAction: VehicleMutationAction;
  deleteVehicleAction: VehicleDeleteAction;
};

function SubmitButton({
  label,
  pendingLabel,
  className,
}: {
  label: string;
  pendingLabel: string;
  className: string;
}) {
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending} className={className}>
      {pending ? pendingLabel : label}
    </button>
  );
}

function formatVehicleLabel(vehicle: VehicleViewModel) {
  return `${vehicle.nickname} (${vehicle.brand} ${vehicle.model})`;
}

function EditableVehicleRow({
  vehicle,
  updateVehicleAction,
  deleteVehicleAction,
}: {
  vehicle: VehicleViewModel;
  updateVehicleAction: VehicleMutationAction;
  deleteVehicleAction: VehicleDeleteAction;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [updateState, updateFormAction] = useActionState(
    async (previousState: VehicleFormState, formData: FormData) => {
      const result = await updateVehicleAction(previousState, formData);
      if (result.status === "success") {
        setIsEditing(false);
      }
      return result;
    },
    initialVehicleFormState,
  );
  const [deleteState, deleteFormAction] = useActionState(
    deleteVehicleAction,
    initialVehicleFormState,
  );

  return (
    <li className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
      {!isEditing ? (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p data-testid="vehicle-title" className="text-base font-semibold text-zinc-900">
              {formatVehicleLabel(vehicle)}
            </p>
            <p className="text-sm text-zinc-600">
              {vehicle.plate ? `Placa: ${vehicle.plate}` : "Placa: não informada"}
              {" · "}
              {vehicle.year ? `Ano: ${vehicle.year}` : "Ano: não informado"}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="rounded-lg border border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-800"
            >
              Editar
            </button>
            <form action={deleteFormAction}>
              <input type="hidden" name="id" value={vehicle.id} />
              <SubmitButton
                label="Excluir"
                pendingLabel="Excluindo..."
                className="rounded-lg bg-red-700 px-3 py-2 text-sm font-medium text-white"
              />
            </form>
          </div>
        </div>
      ) : (
        <form action={updateFormAction} className="space-y-3">
          <input type="hidden" name="id" value={vehicle.id} />
          <div className="grid gap-3 sm:grid-cols-2">
            <VehicleFormFields
              idPrefix={`edit-${vehicle.id}`}
              values={{
                nickname: vehicle.nickname,
                brand: vehicle.brand,
                model: vehicle.model,
                plate: vehicle.plate ?? "",
                year: vehicle.year,
              }}
              errors={updateState.errors}
            />
          </div>

          {updateState.message ? (
            <p
              className={`text-sm ${
                updateState.status === "success" ? "text-emerald-700" : "text-red-700"
              }`}
            >
              {updateState.message}
            </p>
          ) : null}

          <div className="flex gap-2">
            <SubmitButton
              label="Salvar"
              pendingLabel="Salvando..."
              className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white"
            />
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-800"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}
      {deleteState.message ? (
        <p className={`mt-2 text-sm ${deleteState.status === "success" ? "text-emerald-700" : "text-red-700"}`}>
          {deleteState.message}
        </p>
      ) : null}
    </li>
  );
}

export function VehiclesList({
  vehicles,
  updateVehicleAction,
  deleteVehicleAction,
}: VehiclesListProps) {
  const sortedVehicles = useMemo(
    () => [...vehicles].sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)),
    [vehicles],
  );

  if (sortedVehicles.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-zinc-300 bg-white p-6 text-center">
        <p className="text-sm text-zinc-600">Nenhum veículo cadastrado ainda.</p>
      </div>
    );
  }

  return (
    <ul className="space-y-3" data-testid="vehicles-list">
      {sortedVehicles.map((vehicle) => (
        <EditableVehicleRow
          key={vehicle.id}
          vehicle={vehicle}
          updateVehicleAction={updateVehicleAction}
          deleteVehicleAction={deleteVehicleAction}
        />
      ))}
    </ul>
  );
}
