import { expect, type Page } from "@playwright/test";

const OWNER_EMAIL = "owner@minha-garagem.dev";
const OWNER_PASSWORD = "12345678";

export type UserCredentials = {
  email: string;
  password: string;
};

export async function signupWithCredentials(
  page: Page,
  credentials: UserCredentials,
): Promise<void> {
  await page.goto("/signup");
  await expect(page).toHaveURL(/\/signup$/);
  await page.getByLabel("E-mail").fill(credentials.email);
  await page.getByLabel("Senha", { exact: true }).fill(credentials.password);
  await page.getByLabel("Confirmar senha").fill(credentials.password);
  await page.getByRole("button", { name: "Criar conta" }).click();
  await expect(page).toHaveURL(/\/login(\?.*)?$/);
}

export async function loginWithCredentials(
  page: Page,
  credentials: UserCredentials,
): Promise<void> {
  await page.goto("/login");
  await expect(page).toHaveURL(/\/login(\?.*)?$/);
  await page.getByLabel("E-mail").fill(credentials.email);
  await page.getByLabel("Senha", { exact: true }).fill(credentials.password);
  await page.getByRole("button", { name: "Entrar" }).click();
  await expect(page).toHaveURL("/vehicles");
}

export async function logout(page: Page): Promise<void> {
  await page.getByRole("button", { name: "Sair" }).click();
  await expect(page).toHaveURL("/login");
}

export async function ensureOwnerLoggedIn(page: Page): Promise<void> {
  const ownerCredentials = {
    email: OWNER_EMAIL,
    password: OWNER_PASSWORD,
  };

  await page.goto("/login");

  const loginButton = page.getByRole("button", { name: "Entrar" });
  if (await loginButton.isVisible()) {
    await page.getByLabel("E-mail").fill(ownerCredentials.email);
    await page.getByLabel("Senha", { exact: true }).fill(ownerCredentials.password);
    await loginButton.click();
    await expect(page).toHaveURL("/vehicles");
    return;
  }

  await signupWithCredentials(page, ownerCredentials);
  await loginWithCredentials(page, ownerCredentials);
}
