"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Car, CarFront, ChartColumn, Menu, Receipt, Settings } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/summaries", label: "Resumos", icon: ChartColumn },
  { href: "/vehicles", label: "Veículos", icon: CarFront },
  { href: "/expenses", label: "Despesas", icon: Receipt },
] as const;

const PAGE_META = {
  "/summaries": {
    title: "Resumos",
    ctaLabel: undefined,
    ctaEvent: undefined,
  },
  "/vehicles": {
    title: "Meus veículos",
    ctaLabel: "Cadastrar Veículo",
    ctaEvent: "open-create-vehicle",
  },
  "/expenses": {
    title: "Gastos",
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
    <div className="grid size-11 place-items-center rounded-full bg-primary font-bold text-primary-foreground">
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
    <aside className="flex h-screen w-72.5 shrink-0 flex-col border-r border-line bg-surface xl:sticky xl:top-0">
      <div className="px-6 pt-7">
        <Link href="/summaries" className="flex items-center gap-3">
          <div className="grid size-10 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
            <Car className="size-5" />
          </div>
          <div>
            <p className="text-lg font-extrabold leading-none text-foreground">
              Minha Garagem
            </p>
            <p className="text-sm text-muted">Controle da sua frota</p>
          </div>
        </Link>
      </div>

      <nav
        className="mt-8 flex-1 space-y-1 px-4"
        aria-label="Navegação principal"
      >
        {NAV_ITEMS.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-2xl px-4 py-3 text-base font-medium transition-colors",
                isActive
                  ? "bg-primary-subtle text-primary-subtle-foreground"
                  : "text-muted hover:bg-primary-subtle/50 hover:text-foreground",
              )}
            >
              <Icon className={cn("size-5", isActive ? "text-primary" : "text-subtle")} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-line px-5 py-5">
        <div className="flex items-center justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <InitialsAvatar userEmail={userEmail} />
            <div className="min-w-0">
              <p className="truncate text-base font-bold text-foreground">
                {userEmail?.split("@")[0] ?? "Conta"}
              </p>
              <p className="truncate text-sm text-muted">Conta pessoal</p>
            </div>
          </div>
          <Settings className="size-5 shrink-0 text-subtle" aria-hidden />
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
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex">
        <div className="hidden xl:block">
          <SideNav
            pathname={pathname}
            userEmail={userEmail}
            logoutAction={logoutAction}
          />
        </div>

        <div className="flex min-h-screen min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 border-b border-line bg-card/85 backdrop-blur-md">
            <div className="flex h-20 items-center justify-between gap-3 px-4 sm:px-6">
              <div className="flex items-center gap-3">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="xl:hidden"
                      aria-label="Abrir menu"
                    >
                      <Menu className="size-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-72.5 p-0">
                    <SheetTitle className="sr-only">Menu principal</SheetTitle>
                    <SideNav
                      pathname={pathname}
                      userEmail={userEmail}
                      logoutAction={logoutAction}
                    />
                  </SheetContent>
                </Sheet>

                <h1 className="text-xl font-extrabold tracking-tight text-foreground sm:text-2xl">
                  {pageMeta.title}
                </h1>
              </div>

              <div className="flex min-w-0 items-center gap-3">
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
