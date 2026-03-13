import { expect, test } from "@playwright/test";

test("expense CRUD and filtering by vehicle/date", async ({ page }) => {
  await page.goto("/vehicles");

  await page.getByLabel("Apelido").fill("Carro E2E");
  await page.getByLabel("Marca").fill("Toyota");
  await page.getByLabel("Modelo").fill("Corolla");
  await page.getByRole("button", { name: "Adicionar veículo" }).click();
  await expect(page.getByText("Veículo cadastrado com sucesso.")).toBeVisible();

  await page.goto("/expenses");

  const createSection = page.locator("section").filter({
    has: page.getByRole("heading", { name: "Nova despesa" }),
  });
  const createForm = createSection.locator("form").first();

  await createForm.getByLabel("Veículo").selectOption({ label: "Carro E2E (Toyota Corolla)" });
  await createForm.getByLabel("Data").fill("2026-03-10");
  await createForm.getByLabel("Categoria").selectOption("fuel");
  await createForm.getByLabel("Valor (R$)").fill("150,25");
  await createForm.getByLabel("Quilometragem").fill("12500");
  await createForm.getByLabel("Observações").fill("Abastecimento inicial");
  await createForm.getByRole("button", { name: "Adicionar despesa" }).click();

  await expect(page.getByText("Despesa cadastrada com sucesso.")).toBeVisible();
  await expect(page.getByText(/R\$\s?150,25/)).toBeVisible();

  const firstRow = page.locator("li[data-testid='expense-row']").first();
  await firstRow.getByRole("button", { name: "Editar" }).click();
  await firstRow.getByLabel("Valor (R$)").fill("200,00");
  await firstRow.getByRole("button", { name: "Salvar" }).click();

  await expect(page.getByText(/R\$\s?200,00/)).toBeVisible();

  const filterSection = page.locator("section").filter({
    has: page.getByRole("heading", { name: "Filtros" }),
  });
  await filterSection.getByLabel("Data inicial").fill("2026-03-01");
  await filterSection.getByLabel("Data final").fill("2026-03-31");
  await filterSection.getByRole("button", { name: "Aplicar filtros" }).click();

  await expect(page.getByText(/R\$\s?200,00/)).toBeVisible();

  await firstRow.getByRole("button", { name: "Excluir" }).click();
  await expect(page.getByText(/R\$\s?200,00/)).not.toBeVisible();
});
