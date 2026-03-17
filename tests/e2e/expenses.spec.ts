import { expect, test, type Page } from "@playwright/test";
import {
  ensureOwnerLoggedIn,
  loginWithCredentials,
  logout,
  signupWithCredentials,
} from "./auth-helpers";

async function createVehicle(page: Page, nickname: string, brand = "Toyota", model = "Corolla") {
  await page.goto("/vehicles");
  await page.getByRole("button", { name: /\+?\s*Cadastrar Veículo/i }).click();
  await page.getByLabel("Apelido").fill(nickname);
  await page.getByLabel("Marca").fill(brand);
  await page.getByLabel("Modelo").fill(model);
  await page.getByRole("dialog").getByRole("button", { name: "Cadastrar Veículo" }).click();
  await expect(page.getByText("Veículo cadastrado com sucesso.")).toBeVisible();
}

async function openCreateExpenseModal(page: Page) {
  await page.goto("/expenses");
  await page.getByRole("button", { name: /\+?\s*Adicionar Gasto/i }).click();
}

test("expense create/update and filtering by vehicle/date", async ({ page }) => {
  const suffix = Date.now().toString();
  const nickname = `Carro E2E ${suffix}`;
  const vehicleLabel = `${nickname} (Toyota Corolla)`;
  const fuelNote = `Abastecimento inicial ${suffix}`;
  const serviceNote = `Revisão inicial ${suffix}`;

  await ensureOwnerLoggedIn(page);
  await createVehicle(page, nickname);

  await openCreateExpenseModal(page);

  await page.getByLabel("Selecionar Veículo").selectOption({ label: vehicleLabel });
  await page.getByLabel("Data", { exact: true }).fill("2026-03-10");
  await page.getByLabel("Valor (R$)").fill("150,25");
  await page.getByLabel("Quilometragem (KM)").fill("12500");
  await page.getByLabel("Observações").fill(fuelNote);
  await page.getByRole("button", { name: "Salvar Gasto" }).click();

  await expect(page.getByText("Despesa cadastrada com sucesso.")).toBeVisible();
  const createdRow = page.locator("tr[data-testid='expense-row']").filter({
    hasText: fuelNote,
  });
  await expect(createdRow).toHaveCount(1);
  await expect(createdRow).toContainText(/R\$\s?150,25/);

  await openCreateExpenseModal(page);
  await page.getByLabel("Selecionar Veículo").selectOption({ label: vehicleLabel });
  await page.locator('input[name="category"][value="service"]').check({ force: true });
  await page.getByLabel("Data", { exact: true }).fill("2026-03-12");
  await page.getByLabel("Valor (R$)").fill("380,00");
  await page.getByLabel("Observações").fill(serviceNote);
  await page.getByRole("button", { name: "Salvar Gasto" }).click();
  await expect(page.getByText("Despesa cadastrada com sucesso.")).toBeVisible();
  await expect(
    page.locator("tr[data-testid='expense-row']").filter({ hasText: serviceNote }),
  ).toHaveCount(1);

  await createdRow.getByRole("button", { name: /Ações da despesa/ }).click();
  await page.getByRole("menuitem", { name: "Editar" }).click();
  await page.getByLabel("Valor (R$)").fill("200,00");
  await page.getByRole("button", { name: "Salvar Gasto" }).click();

  await expect(createdRow).toContainText(/R\$\s?200,00/);

  await page.getByLabel("Data inicial").fill("2026-03-01");
  await page.getByLabel("Data final").fill("2026-03-31");
  await page.getByLabel("Categoria", { exact: true }).selectOption("service");
  await page.getByRole("button", { name: "Aplicar filtros" }).click();

  await expect(page.getByText(serviceNote)).toBeVisible();
  await expect(page.getByText(fuelNote)).not.toBeVisible();

  await expect(page.getByRole("button", { name: /\+?\s*Adicionar Gasto/i })).toBeVisible();
});

test("exports expenses csv using active filters", async ({ page }) => {
  const suffix = Date.now().toString();
  const nickname = `Carro CSV ${suffix}`;
  const vehicleLabel = `${nickname} (Toyota Corolla)`;
  const note = `Exportação CSV ${suffix}`;

  await ensureOwnerLoggedIn(page);
  await createVehicle(page, nickname);
  await openCreateExpenseModal(page);

  await page.getByLabel("Selecionar Veículo").selectOption({ label: vehicleLabel });
  await page.getByLabel("Data", { exact: true }).fill("2026-03-10");
  await page.getByLabel("Valor (R$)").fill("150,25");
  await page.getByLabel("Quilometragem (KM)").fill("12500");
  await page.getByLabel("Observações").fill(note);
  await page.getByRole("button", { name: "Salvar Gasto" }).click();
  await expect(page.getByText("Despesa cadastrada com sucesso.")).toBeVisible();

  await page.getByLabel("Veículo", { exact: true }).selectOption({ label: vehicleLabel });
  await page.getByLabel("Data inicial").fill("2026-03-01");
  await page.getByLabel("Data final").fill("2026-03-31");
  await page.getByRole("button", { name: "Aplicar filtros" }).click();

  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("link", { name: "Exportar CSV" }).click();
  const download = await downloadPromise;

  expect(download.suggestedFilename()).toBe("despesas-2026-03-01-a-2026-03-31.csv");

  const stream = await download.createReadStream();
  expect(stream).not.toBeNull();

  let content = "";
  for await (const chunk of stream!) {
    content += chunk.toString();
  }

  expect(content).toContain("\uFEFFID;Data;Veículo;Categoria;Valor (R$);Quilometragem (km);Observações");
  expect(content).toContain("10/03/2026");
  expect(content).toContain("Combustível");
  expect(content).toContain("150,25");
  expect(content).toContain(note);
});

test("keeps vehicles, expenses, summaries and csv exports isolated between users", async ({
  page,
}) => {
  const suffix = Date.now().toString();
  const userA = {
    email: `isolation-a-${suffix}@minha-garagem.dev`,
    password: "12345678",
  };
  const userB = {
    email: `isolation-b-${suffix}@minha-garagem.dev`,
    password: "12345678",
  };
  const vehicleNickname = `Carro Privado ${suffix}`;
  const vehicleLabel = `${vehicleNickname} (Toyota Corolla)`;
  const note = `Despesa privada ${suffix}`;

  await signupWithCredentials(page, userA);
  await loginWithCredentials(page, userA);

  await createVehicle(page, vehicleNickname);
  await openCreateExpenseModal(page);
  await page.getByLabel("Selecionar Veículo").selectOption({ label: vehicleLabel });
  await page.getByLabel("Data", { exact: true }).fill("2026-03-10");
  await page.getByLabel("Valor (R$)").fill("120,00");
  await page.getByLabel("Observações").fill(note);
  await page.getByRole("button", { name: "Salvar Gasto" }).click();
  await expect(page.getByText("Despesa cadastrada com sucesso.")).toBeVisible();
  await expect(page.getByText(note)).toBeVisible();

  await logout(page);

  await signupWithCredentials(page, userB);
  await loginWithCredentials(page, userB);

  await page.goto("/vehicles");
  await expect(page.getByText(vehicleNickname)).not.toBeVisible();

  await page.goto("/expenses");
  await expect(page.getByText(note)).not.toBeVisible();
  await expect(page.getByText("Cadastre um veículo antes de lançar despesas.")).toBeVisible();

  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("link", { name: "Exportar CSV" }).click();
  const download = await downloadPromise;
  const stream = await download.createReadStream();
  expect(stream).not.toBeNull();

  let content = "";
  for await (const chunk of stream!) {
    content += chunk.toString();
  }

  expect(content).toContain("\uFEFFID;Data;Veículo;Categoria;Valor (R$);Quilometragem (km);Observações");
  expect(content).not.toContain(note);

  await page.goto("/summaries");
  await expect(page.getByText("Cadastre um veículo para visualizar o resumo.")).toBeVisible();
});
