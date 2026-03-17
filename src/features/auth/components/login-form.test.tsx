import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { LoginForm } from "@/features/auth/components/login-form";

describe("LoginForm", () => {
  const noopAction = async () => ({
    status: "idle" as const,
    errors: {},
  });

  it("renders login fields and submit button", () => {
    render(<LoginForm loginAction={noopAction} />);

    expect(screen.getByLabelText("E-mail")).toBeInTheDocument();
    expect(screen.getByLabelText("Senha")).toBeInTheDocument();
    // expect(screen.getByRole("checkbox", { name: "Lembrar de mim" })).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Esqueci minha senha" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Entrar" })).toBeInTheDocument();
  });

  it("renders notice and form feedback from initial state", () => {
    render(
      <LoginForm
        loginAction={noopAction}
        notice="Conta criada com sucesso. Faça login para continuar."
        initialState={{
          status: "error",
          message: "E-mail ou senha inválidos.",
          errors: {
            email: "E-mail inválido.",
          },
        }}
      />,
    );

    expect(
      screen.getByText("Conta criada com sucesso. Faça login para continuar."),
    ).toBeInTheDocument();
    expect(screen.getByText("E-mail ou senha inválidos.")).toBeInTheDocument();
    expect(screen.getByText("E-mail inválido.")).toBeInTheDocument();
  });
});
