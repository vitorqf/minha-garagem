import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { VehiclesList } from "@/features/vehicles/components/vehicles-list";
import { initialVehicleFormState, type VehicleFormState } from "@/features/vehicles/types";

const noopUpdateAction = async (): Promise<VehicleFormState> => initialVehicleFormState;
const noopDeleteAction = async (): Promise<VehicleFormState> => initialVehicleFormState;

describe("VehiclesList", () => {
  it("renders newest vehicles first", () => {
    render(
      <VehiclesList
        updateVehicleAction={noopUpdateAction}
        deleteVehicleAction={noopDeleteAction}
        vehicles={[
          {
            id: "old",
            nickname: "Carro Antigo",
            brand: "Fiat",
            model: "Uno",
            plate: null,
            year: 2010,
            createdAt: "2024-01-10T10:00:00.000Z",
            updatedAt: "2024-01-10T10:00:00.000Z",
          },
          {
            id: "new",
            nickname: "Carro Novo",
            brand: "Toyota",
            model: "Corolla",
            plate: "ABC1D23",
            year: 2024,
            createdAt: "2025-01-10T10:00:00.000Z",
            updatedAt: "2025-01-10T10:00:00.000Z",
          },
        ]}
      />,
    );

    const titles = screen.getAllByTestId("vehicle-title").map((element) => element.textContent);

    expect(titles).toEqual([
      "Carro Novo (Toyota Corolla)",
      "Carro Antigo (Fiat Uno)",
    ]);
  });
});
