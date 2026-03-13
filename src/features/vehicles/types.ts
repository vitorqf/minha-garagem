export type Vehicle = {
  id: string;
  ownerId: string;
  nickname: string;
  brand: string;
  model: string;
  plate: string | null;
  year: number | null;
  createdAt: Date;
  updatedAt: Date;
};

export type VehicleInput = {
  nickname: string;
  brand: string;
  model: string;
  plate?: string | null;
  year?: number | string | null;
};

export type VehicleUpdateInput = VehicleInput & {
  id: string;
};

export type VehicleFormState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: Partial<Record<"nickname" | "brand" | "model" | "plate" | "year" | "form", string>>;
};

export const initialVehicleFormState: VehicleFormState = {
  status: "idle",
  errors: {},
};

export type VehicleViewModel = {
  id: string;
  nickname: string;
  brand: string;
  model: string;
  plate: string | null;
  year: number | null;
  createdAt: string;
  updatedAt: string;
};
