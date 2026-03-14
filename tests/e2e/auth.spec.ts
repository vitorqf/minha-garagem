import { expect, test } from "@playwright/test";
import {
  loginWithCredentials,
  logout,
  signupWithCredentials,
} from "./auth-helpers";

test("redirects unauthenticated users to /login", async ({ page }) => {
  await page.goto("/vehicles");
  await expect(page).toHaveURL(/\/login$/);
});

test("supports signup, login and logout flows", async ({ page }) => {
  const suffix = Date.now().toString();
  const credentials = {
    email: `owner-${suffix}@minha-garagem.dev`,
    password: "12345678",
  };

  await signupWithCredentials(page, {
    email: credentials.email,
    password: credentials.password,
  });
  await loginWithCredentials(page, {
    email: credentials.email,
    password: credentials.password,
  });
  await logout(page);

  await page.goto("/summaries");
  await expect(page).toHaveURL("/login");
});

test("supports multiple independent user accounts and keeps signup open", async ({ page }) => {
  const suffix = Date.now().toString();
  const userA = {
    email: `user-a-${suffix}@minha-garagem.dev`,
    password: "12345678",
  };
  const userB = {
    email: `user-b-${suffix}@minha-garagem.dev`,
    password: "12345678",
  };

  await signupWithCredentials(page, userA);
  await loginWithCredentials(page, userA);
  await logout(page);

  await page.goto("/signup");
  await expect(page).toHaveURL("/signup");
  await expect(page.getByRole("heading", { name: "Criar conta" })).toBeVisible();
  await expect(
    page.getByText("Crie sua conta para acessar a Minha Garagem e gerenciar seus dados."),
  ).toBeVisible();

  await signupWithCredentials(page, userB);
  await loginWithCredentials(page, userB);
  await expect(page).toHaveURL("/vehicles");
});
