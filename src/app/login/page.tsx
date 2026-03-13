import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { loginAction } from "@/features/auth/actions";
import { extractOwnerIdFromSession } from "@/features/auth/auth-callbacks";
import { LoginForm } from "@/features/auth/components/login-form";
import { AUTH_COPY } from "@/features/auth/constants";
import { getOwnerUserRepository } from "@/features/auth/repositories";

export const runtime = "nodejs";

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function toSingleValue(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

export default async function LoginPage({ searchParams }: PageProps) {
  const session = await auth();
  const ownerId = extractOwnerIdFromSession(session);
  if (ownerId) {
    redirect("/vehicles");
  }

  const ownerRepository = getOwnerUserRepository();
  const ownerCount = await ownerRepository.count();
  const query = await searchParams;
  const justRegistered = toSingleValue(query?.registered) === "1";

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md items-center px-4 py-10 sm:px-6">
      <section className="w-full rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Entrar</h1>
        <p className="mt-1 text-sm text-zinc-600">
          Acesse sua garagem para gerenciar veículos, despesas e resumos.
        </p>

        <div className="mt-6">
          {ownerCount === 0 ? (
            <div className="space-y-3 rounded-lg border border-dashed border-zinc-300 bg-zinc-50 p-4 text-sm text-zinc-700">
              <p>{AUTH_COPY.noOwnerAccount}</p>
              <Link href="/signup" className="inline-block font-semibold text-emerald-700">
                Criar conta do proprietário
              </Link>
            </div>
          ) : (
            <LoginForm
              loginAction={loginAction}
              notice={justRegistered ? AUTH_COPY.signupSuccess : undefined}
            />
          )}
        </div>
      </section>
    </main>
  );
}
