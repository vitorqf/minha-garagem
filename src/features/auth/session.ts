import "server-only";

import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { extractOwnerIdFromSession } from "@/features/auth/auth-callbacks";

export async function getCurrentOwnerId(): Promise<string | null> {
  const session = await auth();
  return extractOwnerIdFromSession(session);
}

export async function requireAuthenticatedOwnerId(): Promise<string> {
  const ownerId = await getCurrentOwnerId();
  if (!ownerId) {
    redirect("/login");
  }

  return ownerId;
}

export async function redirectIfAuthenticated(): Promise<void> {
  const ownerId = await getCurrentOwnerId();
  if (ownerId) {
    redirect("/summaries");
  }
}
