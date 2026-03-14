"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Eye, Lock, Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
    <Button type="submit" disabled={pending} className="h-12 w-full rounded-2xl text-base font-bold">
      {pending ? "Entrando..." : "Entrar"}
    </Button>
  );
}

export function LoginForm({ loginAction, initialState = initialLoginFormState, notice }: LoginFormProps) {
  const [state, formAction] = useActionState(loginAction, initialState);

  return (
    <form action={formAction} className="space-y-5">
      {notice ? (
        <p className="rounded-xl border border-[#CFE7D8] bg-[#ECF9F0] px-3 py-2 text-sm text-[#17854B]">{notice}</p>
      ) : null}

      <div className="space-y-2">
        <Label htmlFor="login-email">E-mail</Label>
        <div className="relative">
          <Mail className="pointer-events-none absolute top-1/2 left-3 size-5 -translate-y-1/2 text-[#8CA0BC]" />
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
        {state.errors?.email ? <p className="text-sm text-[#D94C45]">{state.errors.email}</p> : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="login-password">Senha</Label>
        <div className="relative">
          <Lock className="pointer-events-none absolute top-1/2 left-3 size-5 -translate-y-1/2 text-[#8CA0BC]" />
          <Input
            id="login-password"
            name="password"
            type="password"
            autoComplete="current-password"
            className="px-11"
            required
          />
          <Eye className="pointer-events-none absolute top-1/2 right-3 size-5 -translate-y-1/2 text-[#8CA0BC]" />
        </div>
        {state.errors?.password ? <p className="text-sm text-[#D94C45]">{state.errors.password}</p> : null}
      </div>

      <div className="flex items-center justify-between">
        <label className="inline-flex items-center gap-2 text-sm text-[#4F6482]">
          <input
            type="checkbox"
            name="rememberMe"
            className="size-5 rounded-full border border-[#C7D3E6] accent-[#2F84EB]"
          />
          Lembrar de mim
        </label>
        <a
          href="#"
          aria-disabled="true"
          className="pointer-events-none text-base font-semibold text-[#2F84EB] opacity-80"
        >
          Esqueci minha senha
        </a>
      </div>

      {state.message ? (
        <p className={`text-sm ${state.status === "success" ? "text-[#17854B]" : "text-[#D94C45]"}`}>
          {state.message}
        </p>
      ) : null}

      <SubmitButton />

      <p className="border-t border-[#E4EBF6] pt-5 text-center text-base text-[#7288A8]">
        Não tem uma conta?{" "}
        <Link href="/signup" className="font-bold text-[#2F84EB]">
          Cadastre-se agora
        </Link>
      </p>
    </form>
  );
}
