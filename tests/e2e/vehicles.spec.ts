import { expect, test } from "@playwright/test";
import { ensureOwnerLoggedIn } from "./auth-helpers";

test("vehicle CRUD flow and invalid plate feedback", async ({ page }) => {
  const suffix = Date.now().toString();
  const initialNickname = `Carro Principal ${suffix}`;
  const updatedNickname = `Carro Principal Atualizado ${suffix}`;
  const invalidNickname = `Carro Inválido ${suffix}`;

  await ensureOwnerLoggedIn(page);
  await page.goto("/vehicles");

  await expect(page.getByRole("heading", { name: "Meus veículos" })).toBeVisible();

  await page.getByRole("button", { name: /\+?\s*Cadastrar Veículo/i }).click();
  await page.getByLabel("Apelido").fill(initialNickname);
  await page.getByLabel("Marca").fill("Toyota");
  await page.getByLabel("Modelo").fill("Corolla");
  await page.getByLabel("Placa (opcional)").fill("ABC1D23");
  await page.getByLabel("Ano (opcional)").fill("2020");
  await page.getByRole("dialog").getByRole("button", { name: "Cadastrar Veículo" }).click();

  await expect(page.getByText("Veículo cadastrado com sucesso.")).toBeVisible();
  await expect(page.getByText(initialNickname)).toBeVisible();

  const firstVehicleCard = page.locator("article").filter({ hasText: initialNickname }).first();
  await firstVehicleCard.locator("button[aria-label^='Ações do veículo']").first().click();
  await page.getByRole("menuitem", { name: "Editar" }).click();
  await page.getByLabel("Apelido").fill(updatedNickname);
  await page.getByRole("button", { name: "Salvar" }).click();

  await expect(page.getByText(updatedNickname)).toBeVisible();

  const updatedVehicleCard = page.locator("article").filter({ hasText: updatedNickname }).first();
  await updatedVehicleCard.locator("button[aria-label^='Ações do veículo']").first().click();
  await page.getByRole("menuitem", { name: "Editar" }).click();
  await page.getByLabel("Apelido").fill(invalidNickname);
  await page.getByLabel("Placa (opcional)").fill("ZZ-12");
  await page.getByRole("button", { name: "Salvar" }).click();

  await expect(page.getByText("Placa inválida. Use um formato brasileiro válido.")).toBeVisible();

  await page.getByRole("button", { name: "Cancelar" }).click();
  await updatedVehicleCard.locator("button[aria-label^='Ações do veículo']").first().click();
  await page.getByRole("menuitem", { name: "Excluir" }).click();
  await page.getByRole("button", { name: "Excluir" }).click();

  await expect(page.getByText(updatedNickname)).not.toBeVisible();
});
