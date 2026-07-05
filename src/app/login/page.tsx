import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { loginAction } from "@/features/auth/actions";
import { extractOwnerIdFromSession } from "@/features/auth/auth-callbacks";
import { AuthCardLayout } from "@/features/auth/components/auth-card-layout";
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
    redirect("/summaries");
  }

  const ownerRepository = getOwnerUserRepository();
  const ownerCount = await ownerRepository.count();
  const query = await searchParams;
  const justRegistered = toSingleValue(query?.registered) === "1";

  return (
    <AuthCardLayout
      title="Bem-vindo de volta"
      description="Acesse sua conta para gerenciar seus veículos"
    >
      {ownerCount === 0 ? (
        <div className="space-y-3 rounded-2xl border border-dashed border-line-strong bg-surface p-4 text-base text-muted">
          <p>{AUTH_COPY.noOwnerAccount}</p>
          <Link href="/signup" className="inline-block font-semibold text-primary hover:text-primary-hover">
            Criar conta
          </Link>
        </div>
      ) : (
        <LoginForm loginAction={loginAction} notice={justRegistered ? AUTH_COPY.signupSuccess : undefined} />
      )}
    </AuthCardLayout>
  );
}
