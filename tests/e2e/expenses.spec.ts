import { expect, test } from "@playwright/test";
import {
  ensureOwnerLoggedIn,
  loginWithCredentials,
  logout,
  signupWithCredentials,
} from "./auth-helpers";

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

test("exports expenses csv using active filters", async ({ page }) => {
  const suffix = Date.now().toString();
  const nickname = `Carro CSV ${suffix}`;
  const vehicleLabel = `${nickname} (Toyota Corolla)`;
  const note = `Exportação CSV ${suffix}`;

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

  const filterSection = page.locator("section").filter({
    has: page.getByRole("heading", { name: "Filtros" }),
  });
  await filterSection.getByLabel("Veículo").selectOption({ label: vehicleLabel });
  await filterSection.getByLabel("Data inicial").fill("2026-03-01");
  await filterSection.getByLabel("Data final").fill("2026-03-31");
  await filterSection.getByRole("button", { name: "Aplicar filtros" }).click();

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

  await page.goto("/vehicles");
  await page.getByLabel("Apelido").fill(vehicleNickname);
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
  await createForm.getByLabel("Valor (R$)").fill("120,00");
  await createForm.getByLabel("Observações").fill(note);
  await createForm.getByRole("button", { name: "Adicionar despesa" }).click();
  await expect(page.getByText("Despesa cadastrada com sucesso.")).toBeVisible();
  await expect(page.getByText(note)).toBeVisible();

  await logout(page);

  await signupWithCredentials(page, userB);
  await loginWithCredentials(page, userB);

  await page.goto("/vehicles");
  await expect(page.getByText(vehicleNickname)).not.toBeVisible();
  await expect(page.getByText("Nenhum veículo cadastrado ainda.")).toBeVisible();

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
