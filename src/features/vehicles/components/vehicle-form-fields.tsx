import type { VehicleFormState } from "@/features/vehicles/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
      <div className="space-y-2">
        <Label htmlFor={`${idPrefix}-nickname`}>
          Apelido
        </Label>
        <Input
          id={`${idPrefix}-nickname`}
          name="nickname"
          defaultValue={values?.nickname ?? ""}
          placeholder="Ex: Meu Carro do Dia a Dia"
        />
        {errors?.nickname ? <p className="text-sm text-[#D94C45]">{errors.nickname}</p> : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor={`${idPrefix}-brand`}>
          Marca
        </Label>
        <Input
          id={`${idPrefix}-brand`}
          name="brand"
          defaultValue={values?.brand ?? ""}
          placeholder="Ex.: Toyota"
        />
        {errors?.brand ? <p className="text-sm text-[#D94C45]">{errors.brand}</p> : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor={`${idPrefix}-model`}>
          Modelo
        </Label>
        <Input
          id={`${idPrefix}-model`}
          name="model"
          defaultValue={values?.model ?? ""}
          placeholder="Ex.: Corolla"
        />
        {errors?.model ? <p className="text-sm text-[#D94C45]">{errors.model}</p> : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor={`${idPrefix}-plate`}>
          Placa (opcional)
        </Label>
        <Input
          id={`${idPrefix}-plate`}
          name="plate"
          defaultValue={values?.plate ?? ""}
          className="uppercase"
          placeholder="AAA1A23 ou AAA1234"
        />
        {errors?.plate ? <p className="text-sm text-[#D94C45]">{errors.plate}</p> : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor={`${idPrefix}-year`}>
          Ano (opcional)
        </Label>
        <Input
          id={`${idPrefix}-year`}
          name="year"
          defaultValue={values?.year ?? ""}
          type="number"
          placeholder="Ex.: 2020"
        />
        {errors?.year ? <p className="text-sm text-[#D94C45]">{errors.year}</p> : null}
      </div>
    </>
  );
}
