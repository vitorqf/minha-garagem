"use client";

import { useActionState, useMemo, useState } from "react";
import { useFormStatus } from "react-dom";
import { CirclePlus, MoreVertical } from "lucide-react";

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { initialVehicleFormState, type VehicleFormState, type VehicleViewModel } from "@/features/vehicles/types";
import { VehicleFormFields } from "@/features/vehicles/components/vehicle-form-fields";

const COVER_IMAGES = [
  "/vehicle-cover-1.svg",
  "/vehicle-cover-2.svg",
  "/vehicle-cover-3.svg",
] as const;

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
  onCreateRequest: () => void;
};

function hashToCoverIndex(vehicleId: string): number {
  let hash = 0;
  for (const char of vehicleId) {
    hash = (hash + char.charCodeAt(0)) % COVER_IMAGES.length;
  }

  return hash;
}

function SubmitButton({
  label,
  pendingLabel,
  className,
  variant = "default",
}: {
  label: string;
  pendingLabel: string;
  className?: string;
  variant?: "default" | "outline" | "ghost" | "destructive";
}) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" variant={variant} className={className} disabled={pending}>
      {pending ? pendingLabel : label}
    </Button>
  );
}

export function VehiclesList({
  vehicles,
  updateVehicleAction,
  deleteVehicleAction,
  onCreateRequest,
}: VehiclesListProps) {
  const [editingVehicle, setEditingVehicle] = useState<VehicleViewModel | null>(null);
  const [deleteVehicle, setDeleteVehicle] = useState<VehicleViewModel | null>(null);
  const [updateState, updateFormAction] = useActionState(
    async (previousState: VehicleFormState, formData: FormData) => {
      const result = await updateVehicleAction(previousState, formData);
      if (result.status === "success") {
        setEditingVehicle(null);
      }
      return result;
    },
    initialVehicleFormState,
  );
  const [deleteState, deleteFormAction] = useActionState(
    async (previousState: VehicleFormState, formData: FormData) => {
      const result = await deleteVehicleAction(previousState, formData);
      if (result.status === "success") {
        setDeleteVehicle(null);
      }
      return result;
    },
    initialVehicleFormState,
  );

  const sortedVehicles = useMemo(
    () => [...vehicles].sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)),
    [vehicles],
  );

  return (
    <div className="space-y-4">
      {deleteState.message ? (
        <p
          className={`rounded-xl border px-4 py-2.5 text-sm font-medium ${
            deleteState.status === "success"
              ? "border-success/25 bg-success-subtle text-success-foreground"
              : "border-danger/25 bg-danger-subtle text-danger-foreground"
          }`}
        >
          {deleteState.message}
        </p>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {sortedVehicles.map((vehicle) => {
          const cover = COVER_IMAGES[hashToCoverIndex(vehicle.id)];

          return (
            <article
              key={vehicle.id}
              className="group overflow-hidden rounded-3xl border border-line bg-card shadow-sm transition-shadow duration-200 hover:shadow-md"
            >
              <div
                className="relative h-40 bg-cover bg-center"
                style={{ backgroundImage: `url('${cover}')` }}
                aria-hidden
              >
                <span className="absolute top-3 right-3 rounded-xl bg-card/90 px-3 py-1 font-mono text-sm font-semibold tracking-wide text-foreground shadow-xs ring-1 ring-line backdrop-blur-sm">
                  {vehicle.plate ?? "SEM-PLACA"}
                </span>
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p data-testid="vehicle-title" className="truncate text-xl font-extrabold text-foreground">
                      {vehicle.nickname}
                    </p>
                    <p className="mt-1 text-base text-muted">
                      {vehicle.brand} {vehicle.model}
                      {vehicle.year ? ` • ${vehicle.year}` : ""}
                    </p>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        type="button"
                        aria-label={`Ações do veículo ${vehicle.nickname}`}
                        className="grid size-9 shrink-0 place-items-center rounded-full text-subtle transition-colors hover:bg-surface hover:text-foreground"
                      >
                        <MoreVertical className="size-5" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onSelect={() => setEditingVehicle(vehicle)}>
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => setDeleteVehicle(vehicle)}>
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </article>
          );
        })}

        <button
          type="button"
          onClick={onCreateRequest}
          className="group flex min-h-72 flex-col items-center justify-center gap-4 rounded-3xl border-2 border-dashed border-line-strong bg-surface p-6 text-center transition-colors hover:border-primary/40 hover:bg-primary-subtle/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <div className="grid size-16 place-items-center rounded-2xl bg-primary-subtle text-primary transition-transform duration-200 group-hover:scale-105">
            <CirclePlus className="size-8" />
          </div>
          <div>
            <p className="text-xl font-bold text-foreground">Adicionar novo</p>
            <p className="mt-2 text-base text-muted">Cadastre um novo veículo na sua garagem</p>
          </div>
        </button>
      </div>

      <Dialog open={Boolean(editingVehicle)} onOpenChange={(open) => !open && setEditingVehicle(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-2xl">Editar Veículo</DialogTitle>
            <DialogDescription>Atualize as informações do veículo selecionado.</DialogDescription>
          </DialogHeader>
          {editingVehicle ? (
            <form action={updateFormAction} className="space-y-4">
              <input type="hidden" name="id" value={editingVehicle.id} />
              <VehicleFormFields
                idPrefix={`edit-${editingVehicle.id}`}
                values={{
                  nickname: editingVehicle.nickname,
                  brand: editingVehicle.brand,
                  model: editingVehicle.model,
                  plate: editingVehicle.plate ?? "",
                  year: editingVehicle.year,
                }}
                errors={updateState.errors}
              />

              <DialogFooter className="justify-between sm:justify-between">
                <Button type="button" variant="outline" className="h-12 min-w-44 text-base" onClick={() => setEditingVehicle(null)}>
                  Cancelar
                </Button>
                <SubmitButton
                  label="Salvar"
                  pendingLabel="Salvando..."
                  className="h-12 min-w-44 text-base font-bold"
                />
              </DialogFooter>
            </form>
          ) : null}
        </DialogContent>
      </Dialog>

      <AlertDialog open={Boolean(deleteVehicle)} onOpenChange={(open) => !open && setDeleteVehicle(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir veículo</AlertDialogTitle>
            <AlertDialogDescription>
              Essa ação remove o veículo selecionado da sua garagem.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {deleteVehicle ? (
            <form action={deleteFormAction} className="space-y-2">
              <input type="hidden" name="id" value={deleteVehicle.id} />
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction asChild>
                  <SubmitButton
                    label="Excluir"
                    pendingLabel="Excluindo..."
                    variant="destructive"
                  />
                </AlertDialogAction>
              </AlertDialogFooter>
            </form>
          ) : null}
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
