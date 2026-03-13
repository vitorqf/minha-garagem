import { expect, test } from "@playwright/test";

const OWNER_EMAIL = "owner@minha-garagem.dev";
const OWNER_PASSWORD = "12345678";

test("redirects unauthenticated users to /login", async ({ page }) => {
  await page.goto("/vehicles");
  await expect(page).toHaveURL(/\/login$/);
});

test("supports signup, login and logout flows", async ({ page }) => {
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

  await page.getByRole("button", { name: "Sair" }).click();
  await expect(page).toHaveURL("/login");

  await page.goto("/summaries");
  await expect(page).toHaveURL("/login");
});
