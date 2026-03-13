import { expect, test } from "@playwright/test";

test("vehicle CRUD flow and invalid plate feedback", async ({ page }) => {
  await page.goto("/vehicles");

  await expect(page.getByRole("heading", { name: "Minha Garagem" })).toBeVisible();

  await page.getByLabel("Apelido").fill("Carro Principal");
  await page.getByLabel("Marca").fill("Toyota");
  await page.getByLabel("Modelo").fill("Corolla");
  await page.getByLabel("Placa (opcional)").fill("ABC1D23");
  await page.getByLabel("Ano (opcional)").fill("2020");
  await page.getByRole("button", { name: "Adicionar veículo" }).click();

  await expect(page.getByText("Veículo cadastrado com sucesso.")).toBeVisible();
  await expect(page.getByText("Carro Principal (Toyota Corolla)")).toBeVisible();

  const firstVehicleRow = page.locator("li").first();
  await firstVehicleRow.getByRole("button", { name: "Editar" }).click();
  await firstVehicleRow.getByLabel("Apelido").fill("Carro Principal Atualizado");
  await firstVehicleRow.getByRole("button", { name: "Salvar" }).click();

  await expect(page.getByText("Carro Principal Atualizado (Toyota Corolla)")).toBeVisible();

  await firstVehicleRow.getByRole("button", { name: "Editar" }).click();
  await firstVehicleRow.getByLabel("Apelido").fill("Carro Inválido");
  await firstVehicleRow.getByLabel("Placa (opcional)").fill("ZZ-12");
  await firstVehicleRow.getByRole("button", { name: "Salvar" }).click();

  await expect(page.getByText("Placa inválida. Use um formato brasileiro válido.")).toBeVisible();

  await firstVehicleRow.getByRole("button", { name: "Cancelar" }).click();
  await firstVehicleRow.getByRole("button", { name: "Excluir" }).click();

  await expect(page.getByText("Carro Principal Atualizado (Toyota Corolla)")).not.toBeVisible();
});
