import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { signupAction } from "@/features/auth/actions";
import { extractOwnerIdFromSession } from "@/features/auth/auth-callbacks";
import { AuthCardLayout } from "@/features/auth/components/auth-card-layout";
import { SignupForm } from "@/features/auth/components/signup-form";

export const runtime = "nodejs";

export default async function SignupPage() {
  const session = await auth();
  const ownerId = extractOwnerIdFromSession(session);
  if (ownerId) {
    redirect("/summaries");
  }

  return (
    <AuthCardLayout
      title="Criar conta"
      description="Preencha os dados abaixo para começar"
    >
      <SignupForm signupAction={signupAction} />
    </AuthCardLayout>
  );
}
