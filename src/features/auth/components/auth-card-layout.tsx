import { CarFront } from "lucide-react";

type AuthCardLayoutProps = {
  title: string;
  description: string;
  children: React.ReactNode;
};

export function AuthCardLayout({ title, description, children }: AuthCardLayoutProps) {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <section className="w-full max-w-[680px] overflow-hidden rounded-3xl border border-[#D8E0EC] bg-white shadow-[0_24px_60px_rgba(22,47,86,0.08)]">
        <div
          className="relative h-40 border-b border-[#DCE5F2] bg-cover bg-center"
          style={{ backgroundImage: "url('/auth-cover.svg')" }}
          aria-hidden
        >
          <div className="absolute inset-0 bg-[#F0F5FD]/75" />
          <div className="absolute inset-x-0 bottom-[-30px] flex justify-center">
            <div className="grid size-16 place-items-center rounded-full bg-[#2F84EB] text-white shadow-lg">
              <CarFront className="size-8" />
            </div>
          </div>
        </div>

        <div className="px-6 pt-12 pb-7 sm:px-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-[#0F1A32]">{title}</h1>
          <p className="mt-2 text-lg text-[#6D82A1]">{description}</p>
          <div className="mt-7">{children}</div>
        </div>
      </section>
    </main>
  );
}
