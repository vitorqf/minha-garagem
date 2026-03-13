"use client";

import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";

import { initialVehicleFormState, type VehicleFormState, type VehicleViewModel } from "@/features/vehicles/types";
import { VehicleFormFields } from "@/features/vehicles/components/vehicle-form-fields";
import { VehiclesList } from "@/features/vehicles/components/vehicles-list";

type VehicleMutationAction = (
  state: VehicleFormState,
  formData: FormData,
) => Promise<VehicleFormState>;

type VehicleDeleteAction = (formData: FormData) => Promise<void>;

type VehiclesPageClientProps = {
  vehicles: VehicleViewModel[];
  createVehicleAction: VehicleMutationAction;
  updateVehicleAction: VehicleMutationAction;
  deleteVehicleAction: VehicleDeleteAction;
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
    >
      {pending ? "Salvando..." : "Adicionar veículo"}
    </button>
  );
}

export function VehiclesPageClient({
  vehicles,
  createVehicleAction,
  updateVehicleAction,
  deleteVehicleAction,
}: VehiclesPageClientProps) {
  const [createState, createFormAction] = useActionState(
    createVehicleAction,
    initialVehicleFormState,
  );
  const createFormRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (createState.status === "success") {
      createFormRef.current?.reset();
    }
  }, [createState.status]);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-6 px-4 py-8 sm:px-6">
      <header className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Minha Garagem</h1>
        <p className="text-sm text-zinc-600">
          Cadastre seus veículos e mantenha tudo pronto para o controle de gastos.
        </p>
      </header>

      <section className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-zinc-900">Novo veículo</h2>

        <form ref={createFormRef} action={createFormAction} className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <VehicleFormFields idPrefix="create-vehicle" errors={createState.errors} />
          </div>

          {createState.message ? (
            <p
              className={`text-sm ${
                createState.status === "success" ? "text-emerald-700" : "text-red-700"
              }`}
            >
              {createState.message}
            </p>
          ) : null}

          <SubmitButton />
        </form>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-zinc-900">Veículos cadastrados</h2>
        <VehiclesList
          vehicles={vehicles}
          updateVehicleAction={updateVehicleAction}
          deleteVehicleAction={deleteVehicleAction}
        />
      </section>
    </main>
  );
}
