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
  await page.getByLabel("E-mail", { exact: true }).fill(credentials.email);
  await page.getByLabel("Confirmar E-mail", { exact: true }).fill(credentials.email);
  await page.getByLabel("Senha", { exact: true }).fill(credentials.password);
  await page.getByLabel("Confirmar Senha").fill(credentials.password);
  await page.getByRole("button", { name: "Entrar" }).click();
  await expect(page).toHaveURL(/\/login(\?.*)?$/);
}

export async function loginWithCredentials(
  page: Page,
  credentials: UserCredentials,
): Promise<void> {
  await page.goto("/login");
  await expect(page).toHaveURL(/\/login(\?.*)?$/);
  await page.getByLabel("E-mail", { exact: true }).fill(credentials.email);
  await page.getByLabel("Senha", { exact: true }).fill(credentials.password);
  await page.getByRole("button", { name: "Entrar" }).click();
  await expect(page).toHaveURL("/summaries");
}

export async function logout(page: Page): Promise<void> {
  const logoutButton = page.getByRole("button", { name: "Sair" });
  if (await logoutButton.isVisible()) {
    await logoutButton.click();
    await expect(page).toHaveURL("/login");
    return;
  }

  const openMenuButton = page.getByRole("button", { name: "Abrir menu" });
  if (await openMenuButton.isVisible()) {
    await openMenuButton.click();
    await page.getByRole("button", { name: "Sair" }).click();
    await expect(page).toHaveURL("/login");
    return;
  }

  await page.goto("/summaries");
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
    await page.getByLabel("E-mail", { exact: true }).fill(ownerCredentials.email);
    await page.getByLabel("Senha", { exact: true }).fill(ownerCredentials.password);
    await loginButton.click();
    try {
      await expect(page).toHaveURL("/summaries", { timeout: 1500 });
      return;
    } catch {
      // Fallback to signup if credentials are not registered in this test run.
    }
  }

  await signupWithCredentials(page, ownerCredentials);
  await loginWithCredentials(page, ownerCredentials);
}
