import type { VehicleFormState } from "@/features/vehicles/types";

type VehicleFormValues = {
  nickname?: string;
  brand?: string;
  model?: string;
  plate?: string;
  year?: number | null;
};

type VehicleFormFieldsProps = {
  idPrefix: string;
  values?: VehicleFormValues;
  errors?: VehicleFormState["errors"];
};

export function VehicleFormFields({
  idPrefix,
  values,
  errors,
}: VehicleFormFieldsProps) {
  return (
    <>
      <div>
        <label className="mb-1 block text-sm font-medium" htmlFor={`${idPrefix}-nickname`}>
          Apelido
        </label>
        <input
          id={`${idPrefix}-nickname`}
          name="nickname"
          defaultValue={values?.nickname ?? ""}
          className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
          placeholder="Ex.: Sedan Prata"
        />
        {errors?.nickname ? <p className="mt-1 text-xs text-red-700">{errors.nickname}</p> : null}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium" htmlFor={`${idPrefix}-brand`}>
          Marca
        </label>
        <input
          id={`${idPrefix}-brand`}
          name="brand"
          defaultValue={values?.brand ?? ""}
          className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
          placeholder="Ex.: Toyota"
        />
        {errors?.brand ? <p className="mt-1 text-xs text-red-700">{errors.brand}</p> : null}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium" htmlFor={`${idPrefix}-model`}>
          Modelo
        </label>
        <input
          id={`${idPrefix}-model`}
          name="model"
          defaultValue={values?.model ?? ""}
          className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
          placeholder="Ex.: Corolla"
        />
        {errors?.model ? <p className="mt-1 text-xs text-red-700">{errors.model}</p> : null}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium" htmlFor={`${idPrefix}-plate`}>
          Placa (opcional)
        </label>
        <input
          id={`${idPrefix}-plate`}
          name="plate"
          defaultValue={values?.plate ?? ""}
          className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm uppercase"
          placeholder="AAA1A23 ou AAA1234"
        />
        {errors?.plate ? <p className="mt-1 text-xs text-red-700">{errors.plate}</p> : null}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium" htmlFor={`${idPrefix}-year`}>
          Ano (opcional)
        </label>
        <input
          id={`${idPrefix}-year`}
          name="year"
          defaultValue={values?.year ?? ""}
          type="number"
          className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
          placeholder="Ex.: 2020"
        />
        {errors?.year ? <p className="mt-1 text-xs text-red-700">{errors.year}</p> : null}
      </div>
    </>
  );
}
