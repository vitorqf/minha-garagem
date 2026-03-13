import { expect, type Page } from "@playwright/test";

const OWNER_EMAIL = "owner@minha-garagem.dev";
const OWNER_PASSWORD = "12345678";

export async function ensureOwnerLoggedIn(page: Page): Promise<void> {
  await page.goto("/signup");

  if (page.url().includes("/signup")) {
    await page.getByLabel("E-mail").fill(OWNER_EMAIL);
    await page.getByLabel("Senha", { exact: true }).fill(OWNER_PASSWORD);
    await page.getByLabel("Confirmar senha").fill(OWNER_PASSWORD);
    await page.getByRole("button", { name: "Criar conta" }).click();
    await expect(page).toHaveURL(/\/login(\?.*)?$/);
  }

  await page.goto("/login");
  await page.getByLabel("E-mail").fill(OWNER_EMAIL);
  await page.getByLabel("Senha", { exact: true }).fill(OWNER_PASSWORD);
  await page.getByRole("button", { name: "Entrar" }).click();
  await expect(page).toHaveURL("/vehicles");
}
