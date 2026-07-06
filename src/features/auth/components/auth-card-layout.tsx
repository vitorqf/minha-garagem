import { CarFront } from "lucide-react";

type AuthCardLayoutProps = {
  title: string;
  description: string;
  children: React.ReactNode;
};

export function AuthCardLayout({ title, description, children }: AuthCardLayoutProps) {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <section className="w-full max-w-[520px] rounded-2xl border border-line bg-card p-6 shadow-sm sm:p-8">
        <div className="flex items-center gap-3">
          <div className="grid size-11 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground">
            <CarFront className="size-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-foreground">{title}</h1>
            <p className="text-sm text-muted">{description}</p>
          </div>
        </div>
        <div className="mt-7">{children}</div>
      </section>
    </main>
  );
}
