import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppNavigation } from "@/app/_components/app-navigation";
import { logoutAction } from "@/features/auth/actions";
import { getCurrentOwnerId } from "@/features/auth/session";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Minha Garagem",
  description: "Aplicativo pessoal para cadastro de veículos e controle de gastos.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const ownerId = await getCurrentOwnerId();

  return (
    <html lang="pt-BR">
      <body className={`${geistSans.variable} ${geistMono.variable} bg-zinc-50 text-zinc-900 antialiased`}>
        <div className="min-h-screen">
          {ownerId ? <AppNavigation logoutAction={logoutAction} /> : null}
          {children}
        </div>
      </body>
    </html>
  );
}
