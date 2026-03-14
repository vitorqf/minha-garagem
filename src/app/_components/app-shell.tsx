"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  Car,
  CarFront,
  ChartColumn,
  Menu,
  Receipt,
  Search,
  Settings,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/summaries", label: "Resumos", icon: ChartColumn },
  { href: "/vehicles", label: "Veículos", icon: CarFront },
  { href: "/expenses", label: "Despesas", icon: Receipt },
] as const;

const PAGE_META = {
  "/summaries": {
    title: "Resumos",
    searchPlaceholder: undefined,
    ctaLabel: undefined,
    ctaEvent: undefined,
  },
  "/vehicles": {
    title: "Meus veículos",
    searchPlaceholder: "Buscar placa ou modelo...",
    ctaLabel: "Cadastrar Veículo",
    ctaEvent: "open-create-vehicle",
  },
  "/expenses": {
    title: "Gastos",
    searchPlaceholder: "Pesquisar gastos...",
    ctaLabel: "Adicionar Gasto",
    ctaEvent: "open-create-expense",
  },
} as const;

type AppShellProps = {
  children: React.ReactNode;
  userEmail?: string;
  logoutAction: (formData: FormData) => void | Promise<void>;
};

type PageMeta = {
  title: string;
  searchPlaceholder?: string;
  ctaLabel?: string;
  ctaEvent?: string;
};

function resolvePageMeta(pathname: string): PageMeta {
  if (pathname.startsWith("/vehicles")) {
    return PAGE_META["/vehicles"];
  }

  if (pathname.startsWith("/expenses")) {
    return PAGE_META["/expenses"];
  }

  return PAGE_META["/summaries"];
}

function InitialsAvatar({ userEmail }: { userEmail?: string }) {
  const initials = userEmail ? userEmail.slice(0, 2).toUpperCase() : "MG";

  return (
    <div className="grid size-11 place-items-center rounded-full bg-gradient-to-br from-[#2676D8] to-[#4EA0FF] font-bold text-white">
      {initials}
    </div>
  );
}

function SideNav({
  pathname,
  userEmail,
  logoutAction,
}: {
  pathname: string;
  userEmail?: string;
  logoutAction: AppShellProps["logoutAction"];
}) {
  return (
    <aside className="flex h-screen w-[290px] shrink-0 flex-col border-r border-[#D6DFEC] bg-[#F6F8FC]">
      <div className="px-6 pt-7">
        <Link href="/summaries" className="flex items-center gap-3">
          <div className="grid size-10 place-items-center rounded-full bg-[#2F84EB] text-white">
            <Car className="size-5" />
          </div>
          <div>
            <p className="text-[40px]/none font-extrabold text-[#111D36]">Minha Garagem</p>
            <p className="text-sm text-[#7B8EAA]">Gestão de Frota</p>
          </div>
        </Link>
      </div>

      <nav className="mt-8 flex-1 space-y-2 px-5" aria-label="Navegação principal">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-2xl px-4 py-3 text-2xl font-semibold text-[#3D4E67] transition-colors",
                isActive ? "bg-[#DCEBFF] text-[#1D73D2]" : "hover:bg-[#EDF3FC]",
              )}
            >
              <Icon className="size-6" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-[#D6DFEC] px-5 py-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <InitialsAvatar userEmail={userEmail} />
            <div>
              <p className="text-2xl font-bold text-[#111D36]">
                {userEmail?.split("@")[0] ?? "Conta"}
              </p>
              <p className="text-lg text-[#6D82A1]">Plano Premium</p>
            </div>
          </div>
          <Settings className="size-5 text-[#8DA0BC]" aria-hidden />
        </div>

        <form action={logoutAction} className="mt-4">
          <Button type="submit" variant="outline" className="w-full">
            Sair
          </Button>
        </form>
      </div>
    </aside>
  );
}

export function AppShell({ children, userEmail, logoutAction }: AppShellProps) {
  const pathname = usePathname();
  const pageMeta = resolvePageMeta(pathname);

  return (
    <div className="min-h-screen bg-[#F1F4F9] text-[#101C33]">
      <div className="flex">
        <div className="hidden xl:block">
          <SideNav pathname={pathname} userEmail={userEmail} logoutAction={logoutAction} />
        </div>

        <div className="flex min-h-screen min-w-0 flex-1 flex-col">
          <header className="border-b border-[#D6DFEC] bg-[#F7F9FD]">
            <div className="flex h-20 items-center justify-between gap-3 px-4 sm:px-6">
              <div className="flex items-center gap-3">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="icon" className="xl:hidden" aria-label="Abrir menu">
                      <Menu className="size-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-[290px] p-0">
                    <SheetTitle className="sr-only">Menu principal</SheetTitle>
                    <SideNav pathname={pathname} userEmail={userEmail} logoutAction={logoutAction} />
                  </SheetContent>
                </Sheet>

                <h1 className="text-4xl font-extrabold tracking-tight text-[#111D36]">{pageMeta.title}</h1>
              </div>

              <div className="flex min-w-0 items-center gap-3">
                {pageMeta.searchPlaceholder ? (
                  <div className="relative hidden w-full min-w-64 max-w-md md:block">
                    <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[#8FA1BC]" />
                    <Input
                      aria-label="Busca (em breve)"
                      placeholder={pageMeta.searchPlaceholder}
                      disabled
                      className="pl-9"
                    />
                  </div>
                ) : null}

                <button
                  type="button"
                  disabled
                  aria-label="Notificações (em breve)"
                  className="grid size-11 place-items-center rounded-full text-[#6E83A2] transition-colors hover:bg-[#E9EFF8] disabled:opacity-70"
                >
                  <Bell className="size-5" />
                </button>

                {pageMeta.ctaLabel ? (
                  <Button
                    type="button"
                    onClick={() => {
                      if (!pageMeta.ctaEvent) {
                        return;
                      }

                      window.dispatchEvent(new CustomEvent(pageMeta.ctaEvent));
                    }}
                    className="h-12 rounded-full px-5"
                  >
                    + {pageMeta.ctaLabel}
                  </Button>
                ) : null}
              </div>
            </div>
          </header>

          <main className="p-4 sm:p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
