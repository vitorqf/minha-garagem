import { CarFront } from "lucide-react";

type AuthCardLayoutProps = {
  title: string;
  description: string;
  children: React.ReactNode;
};

export function AuthCardLayout({ title, description, children }: AuthCardLayoutProps) {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <section className="w-full max-w-[680px] overflow-hidden rounded-3xl border border-line bg-card shadow-lg">
        <div
          className="relative h-40 border-b border-line bg-cover bg-center"
          style={{ backgroundImage: "url('/auth-cover.svg')" }}
          aria-hidden
        >
          <div className="absolute inset-0 bg-primary/10" />
          <div className="absolute inset-x-0 bottom-[-30px] flex justify-center">
            <div className="grid size-16 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-md ring-4 ring-card">
              <CarFront className="size-8" />
            </div>
          </div>
        </div>

        <div className="px-6 pt-12 pb-7 sm:px-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">{title}</h1>
          <p className="mt-2 text-lg text-muted">{description}</p>
          <div className="mt-7">{children}</div>
        </div>
      </section>
    </main>
  );
}
