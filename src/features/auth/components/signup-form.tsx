"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { initialSignupFormState, type SignupFormState } from "@/features/auth/types";

type SignupAction = (state: SignupFormState, formData: FormData) => Promise<SignupFormState>;

type SignupFormProps = {
  signupAction: SignupAction;
  initialState?: SignupFormState;
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
    >
      {pending ? "Criando conta..." : "Criar conta"}
    </button>
  );
}

export function SignupForm({ signupAction, initialState = initialSignupFormState }: SignupFormProps) {
  const [state, formAction] = useActionState(signupAction, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium" htmlFor="signup-email">
          E-mail
        </label>
        <input
          id="signup-email"
          name="email"
          type="email"
          autoComplete="email"
          className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
          required
        />
        {state.errors?.email ? <p className="mt-1 text-xs text-red-700">{state.errors.email}</p> : null}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium" htmlFor="signup-password">
          Senha
        </label>
        <input
          id="signup-password"
          name="password"
          type="password"
          autoComplete="new-password"
          className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
          required
        />
        {state.errors?.password ? <p className="mt-1 text-xs text-red-700">{state.errors.password}</p> : null}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium" htmlFor="signup-confirmPassword">
          Confirmar senha
        </label>
        <input
          id="signup-confirmPassword"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
          required
        />
        {state.errors?.confirmPassword ? (
          <p className="mt-1 text-xs text-red-700">{state.errors.confirmPassword}</p>
        ) : null}
      </div>

      {state.message ? (
        <p className={`text-sm ${state.status === "success" ? "text-emerald-700" : "text-red-700"}`}>
          {state.message}
        </p>
      ) : null}

      <SubmitButton />

      <p className="text-sm text-zinc-600">
        Já tem conta?{" "}
        <Link href="/login" className="font-semibold text-zinc-900">
          Entrar
        </Link>
      </p>
    </form>
  );
}
