"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { initialLoginFormState, type LoginFormState } from "@/features/auth/types";

type LoginAction = (state: LoginFormState, formData: FormData) => Promise<LoginFormState>;

type LoginFormProps = {
  loginAction: LoginAction;
  initialState?: LoginFormState;
  notice?: string;
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
    >
      {pending ? "Entrando..." : "Entrar"}
    </button>
  );
}

export function LoginForm({ loginAction, initialState = initialLoginFormState, notice }: LoginFormProps) {
  const [state, formAction] = useActionState(loginAction, initialState);

  return (
    <form action={formAction} className="space-y-4">
      {notice ? <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800">{notice}</p> : null}

      <div>
        <label className="mb-1 block text-sm font-medium" htmlFor="login-email">
          E-mail
        </label>
        <input
          id="login-email"
          name="email"
          type="email"
          autoComplete="email"
          className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
          required
        />
        {state.errors?.email ? <p className="mt-1 text-xs text-red-700">{state.errors.email}</p> : null}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium" htmlFor="login-password">
          Senha
        </label>
        <input
          id="login-password"
          name="password"
          type="password"
          autoComplete="current-password"
          className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
          required
        />
        {state.errors?.password ? <p className="mt-1 text-xs text-red-700">{state.errors.password}</p> : null}
      </div>

      {state.message ? (
        <p className={`text-sm ${state.status === "success" ? "text-emerald-700" : "text-red-700"}`}>
          {state.message}
        </p>
      ) : null}

      <SubmitButton />

      <p className="text-sm text-zinc-600">
        Primeiro acesso?{" "}
        <Link href="/signup" className="font-semibold text-emerald-700">
          Criar conta
        </Link>
      </p>
    </form>
  );
}
