import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { signupAction } from "@/features/auth/actions";
import { extractOwnerIdFromSession } from "@/features/auth/auth-callbacks";
import { SignupForm } from "@/features/auth/components/signup-form";

export const runtime = "nodejs";

export default async function SignupPage() {
  const session = await auth();
  const ownerId = extractOwnerIdFromSession(session);
  if (ownerId) {
    redirect("/vehicles");
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md items-center px-4 py-10 sm:px-6">
      <section className="w-full rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Criar conta</h1>
        <p className="mt-1 text-sm text-zinc-600">
          Crie sua conta para acessar a Minha Garagem e gerenciar seus dados.
        </p>

        <div className="mt-6">
          <SignupForm signupAction={signupAction} />
        </div>
      </section>
    </main>
  );
}
