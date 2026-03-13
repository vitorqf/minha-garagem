import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { SignupForm } from "@/features/auth/components/signup-form";

describe("SignupForm", () => {
  const noopAction = async () => ({
    status: "idle" as const,
    errors: {},
  });

  it("renders signup fields and submit button", () => {
    render(<SignupForm signupAction={noopAction} />);

    expect(screen.getByLabelText("E-mail")).toBeInTheDocument();
    expect(screen.getByLabelText("Senha")).toBeInTheDocument();
    expect(screen.getByLabelText("Confirmar senha")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Criar conta" })).toBeInTheDocument();
  });

  it("renders validation feedback from initial state", () => {
    render(
      <SignupForm
        signupAction={noopAction}
        initialState={{
          status: "error",
          message: "Revise os campos informados.",
          errors: {
            confirmPassword: "As senhas não coincidem.",
          },
        }}
      />,
    );

    expect(screen.getByText("Revise os campos informados.")).toBeInTheDocument();
    expect(screen.getByText("As senhas não coincidem.")).toBeInTheDocument();
  });
});
