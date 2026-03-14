"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { initialVehicleFormState, type VehicleFormState, type VehicleViewModel } from "@/features/vehicles/types";
import { VehicleFormFields } from "@/features/vehicles/components/vehicle-form-fields";
import { VehiclesList } from "@/features/vehicles/components/vehicles-list";

const OPEN_CREATE_EVENT = "open-create-vehicle";

type VehicleMutationAction = (
  state: VehicleFormState,
  formData: FormData,
) => Promise<VehicleFormState>;

type VehicleDeleteAction = (
  state: VehicleFormState,
  formData: FormData,
) => Promise<VehicleFormState>;

type VehiclesPageClientProps = {
  vehicles: VehicleViewModel[];
  createVehicleAction: VehicleMutationAction;
  updateVehicleAction: VehicleMutationAction;
  deleteVehicleAction: VehicleDeleteAction;
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} className="h-12 min-w-44 text-lg font-bold">
      {pending ? "Salvando..." : "Cadastrar Veículo"}
    </Button>
  );
}

export function VehiclesPageClient({
  vehicles,
  createVehicleAction,
  updateVehicleAction,
  deleteVehicleAction,
}: VehiclesPageClientProps) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const createFormRef = useRef<HTMLFormElement>(null);
  const [createState, createFormAction] = useActionState(
    async (previousState: VehicleFormState, formData: FormData) => {
      const result = await createVehicleAction(previousState, formData);
      if (result.status === "success") {
        createFormRef.current?.reset();
        setIsCreateOpen(false);
      }

      return result;
    },
    initialVehicleFormState,
  );

  useEffect(() => {
    const openModal = () => setIsCreateOpen(true);
    window.addEventListener(OPEN_CREATE_EVENT, openModal);
    return () => window.removeEventListener(OPEN_CREATE_EVENT, openModal);
  }, []);

  return (
    <>
      {createState.message ? (
        <p
          className={`mb-4 rounded-xl border px-4 py-2 text-sm ${
            createState.status === "success"
              ? "border-[#BFE8CF] bg-[#F1FCF5] text-[#17854B]"
              : "border-[#F2C4C0] bg-[#FFF3F2] text-[#C24740]"
          }`}
        >
          {createState.message}
        </p>
      ) : null}

      <VehiclesList
        vehicles={vehicles}
        updateVehicleAction={updateVehicleAction}
        deleteVehicleAction={deleteVehicleAction}
        onCreateRequest={() => setIsCreateOpen(true)}
      />

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-5xl">Cadastrar Veículo</DialogTitle>
            <DialogDescription>
              Preencha os dados abaixo para adicionar um novo veículo à Minha Garagem.
            </DialogDescription>
          </DialogHeader>

          <form ref={createFormRef} action={createFormAction} className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <VehicleFormFields idPrefix="create-vehicle" errors={createState.errors} />
              </div>
            </div>

            <DialogFooter className="justify-between sm:justify-between">
              <Button type="button" variant="outline" className="h-12 min-w-44 text-lg" onClick={() => setIsCreateOpen(false)}>
                Cancelar
              </Button>
              <SubmitButton />
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
