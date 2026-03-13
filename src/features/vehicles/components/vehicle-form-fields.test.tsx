import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { VehicleFormFields } from "@/features/vehicles/components/vehicle-form-fields";

describe("VehicleFormFields", () => {
  it("renders expected fields for /vehicles form", () => {
    render(<VehicleFormFields idPrefix="create" />);

    expect(screen.getByLabelText("Apelido")).toBeInTheDocument();
    expect(screen.getByLabelText("Marca")).toBeInTheDocument();
    expect(screen.getByLabelText("Modelo")).toBeInTheDocument();
    expect(screen.getByLabelText("Placa (opcional)")).toBeInTheDocument();
    expect(screen.getByLabelText("Ano (opcional)")).toBeInTheDocument();
  });

  it("shows pt-BR validation messages", () => {
    render(
      <VehicleFormFields
        idPrefix="create"
        errors={{
          nickname: "Apelido é obrigatório.",
          plate: "Placa inválida. Use um formato brasileiro válido.",
        }}
      />,
    );

    expect(screen.getByText("Apelido é obrigatório.")).toBeInTheDocument();
    expect(
      screen.getByText("Placa inválida. Use um formato brasileiro válido."),
    ).toBeInTheDocument();
  });
});
