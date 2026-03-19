import type { Metadata } from "next";
import { IBM_Plex_Mono, Manrope } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/app/_components/app-shell";
import { auth } from "@/auth";
import { logoutAction } from "@/features/auth/actions";
import { getCurrentOwnerId } from "@/features/auth/session";
import { Analytics } from "@vercel/analytics/next";

const manrope = Manrope({
  variable: "--font-geist-sans",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700", "800"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Minha Garagem",
  description:
    "Aplicativo pessoal para cadastro de veículos e controle de gastos.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const ownerId = await getCurrentOwnerId();
  const session = ownerId ? await auth() : null;
  const userEmail = session?.user?.email ?? undefined;

  return (
    <html lang="pt-BR">
      <body
        className={`${manrope.variable} ${ibmPlexMono.variable} antialiased`}
      >
        {ownerId ? (
          <AppShell logoutAction={logoutAction} userEmail={userEmail}>
            {children}
            <Analytics />
          </AppShell>
        ) : (
          children
        )}
      </body>
    </html>
  );
}
