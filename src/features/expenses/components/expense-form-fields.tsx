import { Fuel, HandPlatter, Wrench } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { VehicleOption, ExpenseFormState } from "@/features/expenses/types";

type ExpenseFieldValues = {
  vehicleId?: string;
  expenseDate?: string;
  category?: string;
  amountInput?: string;
  mileage?: number | string | null;
  notes?: string | null;
};

type ExpenseFormFieldsProps = {
  idPrefix: string;
  vehicles: VehicleOption[];
  disabled?: boolean;
  values?: ExpenseFieldValues;
  errors?: ExpenseFormState["errors"];
};

export function ExpenseFormFields({
  idPrefix,
  vehicles,
  disabled = false,
  values,
  errors,
}: ExpenseFormFieldsProps) {
  const selectedCategory = values?.category ?? "fuel";

  return (
    <>
      <div className="space-y-2 sm:col-span-2">
        <Label htmlFor={`${idPrefix}-vehicleId`}>Selecionar Veículo</Label>
        <select
          id={`${idPrefix}-vehicleId`}
          name="vehicleId"
          disabled={disabled}
          defaultValue={values?.vehicleId ?? ""}
          className="h-12 w-full rounded-xl border border-line bg-field px-3.5 text-base text-foreground transition-[border-color,box-shadow] hover:border-line-strong focus-visible:border-primary focus-visible:bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="">Escolha um veículo da sua garagem</option>
          {vehicles.map((vehicle) => (
            <option key={vehicle.id} value={vehicle.id}>
              {vehicle.label}
            </option>
          ))}
        </select>
        {errors?.vehicleId ? <p className="mt-1.5 text-sm font-medium text-danger-foreground">{errors.vehicleId}</p> : null}
      </div>

      <div className="space-y-2 sm:col-span-2">
        <Label>Categoria</Label>
        <div className="grid grid-cols-3 gap-1 rounded-2xl bg-surface p-1 ring-1 ring-inset ring-line">
          {[
            { key: "fuel", label: "Combustível", icon: Fuel },
            { key: "parts", label: "Peças", icon: Wrench },
            { key: "service", label: "Serviço", icon: HandPlatter },
          ].map((option) => {
            const Icon = option.icon;
            const isActive = selectedCategory === option.key;

            return (
              <label
                key={option.key}
                className={cn(
                  "flex cursor-pointer items-center justify-center gap-2 rounded-xl px-2 py-2 text-sm font-semibold transition-colors",
                  isActive
                    ? "bg-card text-primary shadow-sm"
                    : "text-muted hover:text-foreground",
                )}
              >
                <input
                  type="radio"
                  className="sr-only"
                  name="category"
                  value={option.key}
                  disabled={disabled}
                  defaultChecked={isActive}
                />
                <Icon className="size-4" />
                {option.label}
              </label>
            );
          })}
        </div>
        {errors?.category ? <p className="mt-1.5 text-sm font-medium text-danger-foreground">{errors.category}</p> : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor={`${idPrefix}-amountInput`}>Valor (R$)</Label>
        <Input
          id={`${idPrefix}-amountInput`}
          name="amountInput"
          disabled={disabled}
          defaultValue={values?.amountInput ?? ""}
          placeholder="R$ 0,00"
        />
        {errors?.amountInput ? <p className="mt-1.5 text-sm font-medium text-danger-foreground">{errors.amountInput}</p> : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor={`${idPrefix}-expenseDate`}>Data</Label>
        <Input
          id={`${idPrefix}-expenseDate`}
          name="expenseDate"
          type="date"
          disabled={disabled}
          defaultValue={values?.expenseDate ?? ""}
        />
        {errors?.expenseDate ? <p className="mt-1.5 text-sm font-medium text-danger-foreground">{errors.expenseDate}</p> : null}
      </div>

      <div className="space-y-2 sm:col-span-2">
        <Label htmlFor={`${idPrefix}-mileage`}>Quilometragem (KM)</Label>
        <Input
          id={`${idPrefix}-mileage`}
          name="mileage"
          type="number"
          disabled={disabled}
          defaultValue={values?.mileage ?? ""}
          placeholder="Ex: 45000"
        />
        {errors?.mileage ? <p className="mt-1.5 text-sm font-medium text-danger-foreground">{errors.mileage}</p> : null}
      </div>

      <div className="space-y-2 sm:col-span-2">
        <Label htmlFor={`${idPrefix}-notes`}>Observações</Label>
        <textarea
          id={`${idPrefix}-notes`}
          name="notes"
          disabled={disabled}
          defaultValue={values?.notes ?? ""}
          className="min-h-24 w-full rounded-xl border border-line bg-field px-3.5 py-2.5 text-base text-foreground transition-[border-color,box-shadow] placeholder:text-subtle hover:border-line-strong focus-visible:border-primary focus-visible:bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="Detalhes adicionais sobre o gasto..."
        />
        {errors?.notes ? <p className="mt-1.5 text-sm font-medium text-danger-foreground">{errors.notes}</p> : null}
      </div>
    </>
  );
}
