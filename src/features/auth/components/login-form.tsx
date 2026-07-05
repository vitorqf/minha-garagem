"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Eye, Lock, Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  initialLoginFormState,
  type LoginFormState,
} from "@/features/auth/types";

type LoginAction = (
  state: LoginFormState,
  formData: FormData,
) => Promise<LoginFormState>;

type LoginFormProps = {
  loginAction: LoginAction;
  initialState?: LoginFormState;
  notice?: string;
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      disabled={pending}
      className="h-12 w-full rounded-2xl text-base font-bold"
    >
      {pending ? "Entrando..." : "Entrar"}
    </Button>
  );
}

export function LoginForm({
  loginAction,
  initialState = initialLoginFormState,
  notice,
}: LoginFormProps) {
  const [state, formAction] = useActionState(loginAction, initialState);

  return (
    <form action={formAction} className="space-y-5">
      {notice ? (
        <p className="rounded-xl border border-success/25 bg-success-subtle px-3.5 py-2.5 text-sm font-medium text-success-foreground">
          {notice}
        </p>
      ) : null}

      <div className="space-y-2">
        <Label htmlFor="login-email">E-mail</Label>
        <div className="relative">
          <Mail className="pointer-events-none absolute top-1/2 left-3 size-5 -translate-y-1/2 text-subtle" />
          <Input
            id="login-email"
            name="email"
            type="email"
            autoComplete="email"
            className="pl-11"
            placeholder="seu@email.com.br"
            required
          />
        </div>
        {state.errors?.email ? (
          <p className="mt-1.5 text-sm font-medium text-danger-foreground">{state.errors.email}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="login-password">Senha</Label>
        <div className="relative">
          <Lock className="pointer-events-none absolute top-1/2 left-3 size-5 -translate-y-1/2 text-subtle" />
          <Input
            id="login-password"
            name="password"
            type="password"
            autoComplete="current-password"
            className="px-11"
            required
          />
          <Eye className="pointer-events-none absolute top-1/2 right-3 size-5 -translate-y-1/2 text-subtle" />
        </div>
        {state.errors?.password ? (
          <p className="mt-1.5 text-sm font-medium text-danger-foreground">{state.errors.password}</p>
        ) : null}
      </div>

      {state.message ? (
        <p
          className={`text-sm font-medium ${state.status === "success" ? "text-success-foreground" : "text-danger-foreground"}`}
        >
          {state.message}
        </p>
      ) : null}

      <SubmitButton />

      <p className="border-t border-line pt-5 text-center text-base text-muted">
        Não tem uma conta?{" "}
        <Link href="/signup" className="font-bold text-primary hover:text-primary-hover">
          Cadastre-se agora
        </Link>
      </p>
    </form>
  );
}
