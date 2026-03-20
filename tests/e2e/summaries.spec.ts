import { expect, test, type Page } from "@playwright/test";
import { ensureOwnerLoggedIn } from "./auth-helpers";

async function createVehicle(page: Page, nickname: string, brand: string, model: string) {
  await page.goto("/vehicles");
  await page.getByRole("button", { name: /\+?\s*Cadastrar Veículo/i }).click();
  await page.getByLabel("Apelido").fill(nickname);
  await page.getByLabel("Marca").fill(brand);
  await page.getByLabel("Modelo").fill(model);
  await page.getByRole("dialog").getByRole("button", { name: "Cadastrar Veículo" }).click();
  await expect(page.getByText("Veículo cadastrado com sucesso.")).toBeVisible();
}

async function createExpense(
  page: Page,
  vehicleLabel: string,
  date: string,
  categoryLabel: "Combustível" | "Peças" | "Serviço",
  amount: string,
  mileage?: string,
) {
  const categoryMap = {
    Combustível: "fuel",
    Peças: "parts",
    Serviço: "service",
  } as const;

  await page.goto("/expenses");
  await page.getByRole("button", { name: /\+?\s*Adicionar Gasto/i }).click();
  await page.getByLabel("Selecionar Veículo").selectOption({ label: vehicleLabel });
  await page.getByLabel("Data", { exact: true }).fill(date);
  await page.locator(`input[name="category"][value="${categoryMap[categoryLabel]}"]`).check({ force: true });
  await page.getByLabel("Valor (R$)").fill(amount);
  if (mileage) {
    await page.getByLabel("Quilometragem (KM)").fill(mileage);
  }
  await page.getByRole("button", { name: "Salvar Gasto" }).click();
  await expect(page.getByText("Despesa cadastrada com sucesso.")).toBeVisible();
}

test("summaries show totals by vehicle, category and month including zero totals", async ({ page }) => {
  const suffix = Date.now().toString();
  const carANickname = `Carro Sumário A ${suffix}`;
  const carBNickname = `Carro Sumário B ${suffix}`;
  const carALabel = `${carANickname} (Toyota Corolla)`;
  const carBLabel = `${carBNickname} (Honda Fit)`;

  await ensureOwnerLoggedIn(page);

  await createVehicle(page, carANickname, "Toyota", "Corolla");
  await createVehicle(page, carBNickname, "Honda", "Fit");

  await createExpense(page, carALabel, "2026-01-15", "Combustível", "100,00", "10000");
  await createExpense(page, carALabel, "2026-02-20", "Serviço", "300,00", "10200");
  await createExpense(page, carBLabel, "2026-02-10", "Peças", "50,00", "5000");

  await page.goto("/summaries");

  await page.getByLabel("Mês inicial").fill("2026-01");
  await page.getByLabel("Mês final").fill("2026-02");
  await page.getByRole("button", { name: "Aplicar filtros" }).click();

  const carA = page.locator("[data-testid='summary-card']").filter({
    has: page.getByRole("heading", { name: carALabel }),
  });
  await expect(carA).toHaveCount(1);
  await expect(carA.getByText(/Total:\s*R\$\s?400,00/)).toBeVisible();
  await expect(carA.getByText(/Combustível:\s*R\$\s?100,00/)).toBeVisible();
  await expect(carA.getByText(/Serviços:\s*R\$\s?300,00/)).toBeVisible();
  await expect(carA.getByText(/Custo por km:\s*R\$\s?2,00\/km/)).toBeVisible();
  await expect(carA.getByTestId("month-total-2026-01")).toHaveText(/R\$\s?100,00/);
  await expect(carA.getByTestId("month-total-2026-02")).toHaveText(/R\$\s?300,00/);

  const carB = page.locator("[data-testid='summary-card']").filter({
    has: page.getByRole("heading", { name: carBLabel }),
  });
  await expect(carB).toHaveCount(1);
  await expect(carB.getByText(/Total:\s*R\$\s?50,00/)).toBeVisible();
  await expect(carB.getByText(/Custo por km:\s*Dados insuficientes/)).toBeVisible();
  await expect(carB.getByTestId("month-total-2026-01")).toHaveText(/R\$\s?0,00/);
  await expect(carB.getByTestId("month-total-2026-02")).toHaveText(/R\$\s?50,00/);

  const febTrend = page.getByTestId("trend-row-2026-02");
  await expect(febTrend).toContainText("R$ 350,00");
  await expect(febTrend).toContainText("+R$ 250,00");
  await expect(febTrend).toContainText("+250,0%");

  const topDrivers = page.getByTestId("top-driver-row");
  await expect(topDrivers).toHaveCount(3);
  await expect(topDrivers.nth(0)).toContainText(`${carANickname} (Toyota Corolla) • Serviços`);
  await expect(topDrivers.nth(0)).toContainText("R$ 300,00");
  await expect(topDrivers.nth(1)).toContainText(`${carANickname} (Toyota Corolla) • Combustível`);
  await expect(topDrivers.nth(2)).toContainText(`${carBNickname} (Honda Fit) • Peças`);
});
