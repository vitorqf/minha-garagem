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
  return (
    <>
      <div>
        <label className="mb-1 block text-sm font-medium" htmlFor={`${idPrefix}-vehicleId`}>
          Veículo
        </label>
        <select
          id={`${idPrefix}-vehicleId`}
          name="vehicleId"
          disabled={disabled}
          defaultValue={values?.vehicleId ?? ""}
          className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
        >
          <option value="">Selecione</option>
          {vehicles.map((vehicle) => (
            <option key={vehicle.id} value={vehicle.id}>
              {vehicle.label}
            </option>
          ))}
        </select>
        {errors?.vehicleId ? <p className="mt-1 text-xs text-red-700">{errors.vehicleId}</p> : null}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium" htmlFor={`${idPrefix}-expenseDate`}>
          Data
        </label>
        <input
          id={`${idPrefix}-expenseDate`}
          name="expenseDate"
          type="date"
          disabled={disabled}
          defaultValue={values?.expenseDate ?? ""}
          className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
        />
        {errors?.expenseDate ? <p className="mt-1 text-xs text-red-700">{errors.expenseDate}</p> : null}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium" htmlFor={`${idPrefix}-category`}>
          Categoria
        </label>
        <select
          id={`${idPrefix}-category`}
          name="category"
          disabled={disabled}
          defaultValue={values?.category ?? ""}
          className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
        >
          <option value="">Selecione</option>
          <option value="fuel">Combustível</option>
          <option value="parts">Peças</option>
          <option value="service">Serviços</option>
        </select>
        {errors?.category ? <p className="mt-1 text-xs text-red-700">{errors.category}</p> : null}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium" htmlFor={`${idPrefix}-amountInput`}>
          Valor (R$)
        </label>
        <input
          id={`${idPrefix}-amountInput`}
          name="amountInput"
          disabled={disabled}
          defaultValue={values?.amountInput ?? ""}
          className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
          placeholder="Ex.: 150,25"
        />
        {errors?.amountInput ? <p className="mt-1 text-xs text-red-700">{errors.amountInput}</p> : null}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium" htmlFor={`${idPrefix}-mileage`}>
          Quilometragem
        </label>
        <input
          id={`${idPrefix}-mileage`}
          name="mileage"
          type="number"
          disabled={disabled}
          defaultValue={values?.mileage ?? ""}
          className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
          placeholder="Opcional"
        />
        {errors?.mileage ? <p className="mt-1 text-xs text-red-700">{errors.mileage}</p> : null}
      </div>

      <div className="sm:col-span-2">
        <label className="mb-1 block text-sm font-medium" htmlFor={`${idPrefix}-notes`}>
          Observações
        </label>
        <textarea
          id={`${idPrefix}-notes`}
          name="notes"
          disabled={disabled}
          defaultValue={values?.notes ?? ""}
          className="min-h-20 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
          placeholder="Opcional"
        />
        {errors?.notes ? <p className="mt-1 text-xs text-red-700">{errors.notes}</p> : null}
      </div>
    </>
  );
}
