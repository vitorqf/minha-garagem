"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Eye, Lock, Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { initialSignupFormState, type SignupFormState } from "@/features/auth/types";

type SignupAction = (state: SignupFormState, formData: FormData) => Promise<SignupFormState>;

type SignupFormProps = {
  signupAction: SignupAction;
  initialState?: SignupFormState;
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} className="h-12 w-full rounded-2xl text-xl font-bold">
      {pending ? "Criando conta..." : "Entrar"}
    </Button>
  );
}

export function SignupForm({ signupAction, initialState = initialSignupFormState }: SignupFormProps) {
  const [state, formAction] = useActionState(signupAction, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="signup-email">E-mail</Label>
        <div className="relative">
          <Mail className="pointer-events-none absolute top-1/2 left-3 size-5 -translate-y-1/2 text-[#8CA0BC]" />
          <Input
            id="signup-email"
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
        <Label htmlFor="signup-confirmEmail">Confirmar E-mail</Label>
        <div className="relative">
          <Mail className="pointer-events-none absolute top-1/2 left-3 size-5 -translate-y-1/2 text-[#8CA0BC]" />
          <Input
            id="signup-confirmEmail"
            name="confirmEmail"
            type="email"
            autoComplete="email"
            className="pl-11"
            placeholder="Repita seu e-mail"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="signup-password">Senha</Label>
        <div className="relative">
          <Lock className="pointer-events-none absolute top-1/2 left-3 size-5 -translate-y-1/2 text-[#8CA0BC]" />
          <Input
            id="signup-password"
            name="password"
            type="password"
            autoComplete="new-password"
            className="px-11"
            placeholder="Mínimo 8 caracteres"
            required
          />
          <Eye className="pointer-events-none absolute top-1/2 right-3 size-5 -translate-y-1/2 text-[#8CA0BC]" />
        </div>
        {state.errors?.password ? <p className="text-sm text-[#D94C45]">{state.errors.password}</p> : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="signup-confirmPassword">Confirmar Senha</Label>
        <div className="relative">
          <Lock className="pointer-events-none absolute top-1/2 left-3 size-5 -translate-y-1/2 text-[#8CA0BC]" />
          <Input
            id="signup-confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            className="px-11"
            placeholder="Repita sua senha"
            required
          />
          <Eye className="pointer-events-none absolute top-1/2 right-3 size-5 -translate-y-1/2 text-[#8CA0BC]" />
        </div>
        {state.errors?.confirmPassword ? (
          <p className="text-sm text-[#D94C45]">{state.errors.confirmPassword}</p>
        ) : null}
      </div>

      {state.message ? (
        <p className={`text-sm ${state.status === "success" ? "text-[#17854B]" : "text-[#D94C45]"}`}>
          {state.message}
        </p>
      ) : null}

      <SubmitButton />

      <p className="border-t border-[#E4EBF6] pt-5 text-center text-[22px] text-[#7288A8]">
        Já tem uma conta?{" "}
        <Link href="/login" className="font-bold text-[#2F84EB]">
          Entre aqui
        </Link>
      </p>
    </form>
  );
}
