"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/vehicles", label: "Veículos" },
  { href: "/expenses", label: "Despesas" },
  { href: "/summaries", label: "Resumo" },
] as const;

type AppNavigationProps = {
  logoutAction: (formData: FormData) => void | Promise<void>;
};

export function AppNavigation({ logoutAction }: AppNavigationProps) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-10 border-b border-zinc-200/80 bg-white/90 backdrop-blur">
      <nav
        className="mx-auto flex w-full max-w-6xl items-center justify-between gap-2 px-4 py-3 sm:px-6"
        aria-label="Navegação principal"
      >
        <div className="flex gap-2">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive ? "bg-zinc-900 text-white" : "text-zinc-700 hover:bg-zinc-100"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        <form action={logoutAction}>
          <button
            type="submit"
            className="rounded-lg border border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100"
          >
            Sair
          </button>
        </form>
      </nav>
    </header>
  );
}
