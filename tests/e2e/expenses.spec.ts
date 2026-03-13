import { expect, test } from "@playwright/test";
import { ensureOwnerLoggedIn } from "./auth-helpers";

test("expense CRUD and filtering by vehicle/date", async ({ page }) => {
  const suffix = Date.now().toString();
  const nickname = `Carro E2E ${suffix}`;
  const vehicleLabel = `${nickname} (Toyota Corolla)`;
  const note = `Abastecimento inicial ${suffix}`;

  await ensureOwnerLoggedIn(page);
  await page.goto("/vehicles");

  await page.getByLabel("Apelido").fill(nickname);
  await page.getByLabel("Marca").fill("Toyota");
  await page.getByLabel("Modelo").fill("Corolla");
  await page.getByRole("button", { name: "Adicionar veículo" }).click();
  await expect(page.getByText("Veículo cadastrado com sucesso.")).toBeVisible();

  await page.goto("/expenses");

  const createSection = page.locator("section").filter({
    has: page.getByRole("heading", { name: "Nova despesa" }),
  });
  const createForm = createSection.locator("form").first();

  await createForm.getByLabel("Veículo").selectOption({ label: vehicleLabel });
  await createForm.getByLabel("Data").fill("2026-03-10");
  await createForm.getByLabel("Categoria").selectOption("fuel");
  await createForm.getByLabel("Valor (R$)").fill("150,25");
  await createForm.getByLabel("Quilometragem").fill("12500");
  await createForm.getByLabel("Observações").fill(note);
  await createForm.getByRole("button", { name: "Adicionar despesa" }).click();

  await expect(page.getByText("Despesa cadastrada com sucesso.")).toBeVisible();
  const createdRow = page.locator("li[data-testid='expense-row']").filter({
    hasText: note,
  });
  await expect(createdRow).toHaveCount(1);
  await expect(createdRow).toContainText(/R\$\s?150,25/);

  await createdRow.getByRole("button", { name: "Editar" }).click();
  await createdRow.getByLabel("Valor (R$)").fill("200,00");
  await createdRow.getByRole("button", { name: "Salvar" }).click();

  await expect(createdRow).toContainText(/R\$\s?200,00/);

  const filterSection = page.locator("section").filter({
    has: page.getByRole("heading", { name: "Filtros" }),
  });
  await filterSection.getByLabel("Data inicial").fill("2026-03-01");
  await filterSection.getByLabel("Data final").fill("2026-03-31");
  await filterSection.getByRole("button", { name: "Aplicar filtros" }).click();

  await expect(createdRow).toContainText(/R\$\s?200,00/);

  await createdRow.getByRole("button", { name: "Excluir" }).click();
  await expect(createdRow).toHaveCount(0);
});
