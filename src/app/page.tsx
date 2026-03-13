import { redirect } from "next/navigation";
import { getCurrentOwnerId } from "@/features/auth/session";

export default async function Home() {
  const ownerId = await getCurrentOwnerId();

  if (!ownerId) {
    redirect("/login");
  }

  redirect("/vehicles");
}
