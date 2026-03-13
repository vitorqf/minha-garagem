import { expect, test } from "@playwright/test";
import { ensureOwnerLoggedIn } from "./auth-helpers";

test("summaries show totals by vehicle, category and month including zero totals", async ({ page }) => {
  const suffix = Date.now().toString();
  const carANickname = `Carro Sumário A ${suffix}`;
  const carBNickname = `Carro Sumário B ${suffix}`;
  const carALabel = `${carANickname} (Toyota Corolla)`;
  const carBLabel = `${carBNickname} (Honda Fit)`;

  await ensureOwnerLoggedIn(page);
  await page.goto("/vehicles");

  await page.getByLabel("Apelido").fill(carANickname);
  await page.getByLabel("Marca").fill("Toyota");
  await page.getByLabel("Modelo").fill("Corolla");
  await page.getByRole("button", { name: "Adicionar veículo" }).click();
  await expect(page.getByText("Veículo cadastrado com sucesso.")).toBeVisible();

  await page.getByLabel("Apelido").fill(carBNickname);
  await page.getByLabel("Marca").fill("Honda");
  await page.getByLabel("Modelo").fill("Fit");
  await page.getByRole("button", { name: "Adicionar veículo" }).click();
  await expect(page.getByText("Veículo cadastrado com sucesso.")).toBeVisible();

  await page.goto("/expenses");

  const createSection = page.locator("section").filter({
    has: page.getByRole("heading", { name: "Nova despesa" }),
  });
  const createForm = createSection.locator("form").first();

  await createForm.getByLabel("Veículo").selectOption({ label: carALabel });
  await createForm.getByLabel("Data").fill("2026-01-15");
  await createForm.getByLabel("Categoria").selectOption("fuel");
  await createForm.getByLabel("Valor (R$)").fill("100,00");
  await createForm.getByRole("button", { name: "Adicionar despesa" }).click();
  await expect(page.getByText("Despesa cadastrada com sucesso.")).toBeVisible();

  await createForm.getByLabel("Veículo").selectOption({ label: carALabel });
  await createForm.getByLabel("Data").fill("2026-02-20");
  await createForm.getByLabel("Categoria").selectOption("service");
  await createForm.getByLabel("Valor (R$)").fill("250,00");
  await createForm.getByRole("button", { name: "Adicionar despesa" }).click();
  await expect(page.getByText("Despesa cadastrada com sucesso.")).toBeVisible();

  await page.goto("/summaries");

  await page.getByLabel("Mês inicial").fill("2026-01");
  await page.getByLabel("Mês final").fill("2026-02");
  await page.getByRole("button", { name: "Aplicar filtros" }).click();

  const carA = page.locator("[data-testid='summary-card']").filter({
    has: page.getByRole("heading", { name: carALabel }),
  });
  await expect(carA).toHaveCount(1);
  await expect(carA.getByText(/Total:\s*R\$\s?350,00/)).toBeVisible();
  await expect(carA.getByText(/Combustível:\s*R\$\s?100,00/)).toBeVisible();
  await expect(carA.getByText(/Serviços:\s*R\$\s?250,00/)).toBeVisible();
  await expect(carA.getByTestId("month-total-2026-01")).toHaveText(/R\$\s?100,00/);
  await expect(carA.getByTestId("month-total-2026-02")).toHaveText(/R\$\s?250,00/);

  const carB = page.locator("[data-testid='summary-card']").filter({
    has: page.getByRole("heading", { name: carBLabel }),
  });
  await expect(carB).toHaveCount(1);
  await expect(carB.getByText(/Total:\s*R\$\s?0,00/)).toBeVisible();
  await expect(carB.getByTestId("month-total-2026-01")).toHaveText(/R\$\s?0,00/);
  await expect(carB.getByTestId("month-total-2026-02")).toHaveText(/R\$\s?0,00/);
});
