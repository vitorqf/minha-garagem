import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { AppShell } from "@/app/_components/app-shell";

vi.mock("next/navigation", () => ({
  usePathname: () => "/summaries",
}));

describe("AppShell", () => {
  it("keeps desktop sidebar sticky while main content scrolls", () => {
    render(
      <AppShell logoutAction={async () => {}} userEmail="owner@minha-garagem.dev">
        <div>Resumo</div>
      </AppShell>,
    );

    const sideNav = screen.getByLabelText("Navegação principal").closest("aside");

    expect(sideNav).not.toBeNull();
    expect(sideNav).toHaveClass("xl:sticky");
    expect(sideNav).toHaveClass("xl:top-0");
  });
});
