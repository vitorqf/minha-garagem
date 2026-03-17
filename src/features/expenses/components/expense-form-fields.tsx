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
          className="h-12 w-full rounded-xl border border-[#D3DCEA] bg-[#F8FBFF] px-3 text-base text-[#101C33] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3A8DFF]/30"
        >
          <option value="">Escolha um veículo da sua garagem</option>
          {vehicles.map((vehicle) => (
            <option key={vehicle.id} value={vehicle.id}>
              {vehicle.label}
            </option>
          ))}
        </select>
        {errors?.vehicleId ? <p className="text-sm text-[#D94C45]">{errors.vehicleId}</p> : null}
      </div>

      <div className="space-y-2 sm:col-span-2">
        <Label>Categoria</Label>
        <div className="grid grid-cols-3 gap-1 rounded-2xl bg-[#ECF1F8] p-1">
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
                  "flex cursor-pointer items-center justify-center gap-2 rounded-xl px-2 py-2 text-sm font-semibold text-[#5D7290] transition-colors",
                  isActive && "bg-white text-[#2F84EB] shadow-[0_1px_3px_rgba(14,23,38,0.12)]",
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
        {errors?.category ? <p className="text-sm text-[#D94C45]">{errors.category}</p> : null}
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
        {errors?.amountInput ? <p className="text-sm text-[#D94C45]">{errors.amountInput}</p> : null}
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
        {errors?.expenseDate ? <p className="text-sm text-[#D94C45]">{errors.expenseDate}</p> : null}
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
        {errors?.mileage ? <p className="text-sm text-[#D94C45]">{errors.mileage}</p> : null}
      </div>

      <div className="space-y-2 sm:col-span-2">
        <Label htmlFor={`${idPrefix}-notes`}>Observações</Label>
        <textarea
          id={`${idPrefix}-notes`}
          name="notes"
          disabled={disabled}
          defaultValue={values?.notes ?? ""}
          className="min-h-24 w-full rounded-xl border border-[#D3DCEA] bg-[#F8FBFF] px-3 py-2 text-base text-[#101C33] placeholder:text-[#8CA0BC] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3A8DFF]/30"
          placeholder="Detalhes adicionais sobre o gasto..."
        />
        {errors?.notes ? <p className="text-sm text-[#D94C45]">{errors.notes}</p> : null}
      </div>
    </>
  );
}
