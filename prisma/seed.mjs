import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { hash } from "bcryptjs";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required to run prisma seed.");
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: databaseUrl,
  }),
});

const PRIMARY_ACCOUNT = {
  email: "seed@minhagaragem.dev",
  password: "12345678",
};

const ISOLATION_ACCOUNT = {
  email: "seed-isolation@minhagaragem.dev",
  password: "12345678",
};

function toDate(date) {
  return new Date(`${date}T00:00:00.000Z`);
}

function expense(data) {
  return {
    ownerId: data.ownerId,
    vehicleId: data.vehicleId,
    expenseDate: toDate(data.expenseDate),
    category: data.category,
    amountCents: data.amountCents,
    mileage: data.mileage ?? null,
    notes: data.notes ?? null,
  };
}

async function upsertUser(email, password) {
  const passwordHash = await hash(password, 12);

  return prisma.user.upsert({
    where: { email },
    update: { passwordHash },
    create: { email, passwordHash },
  });
}

async function resetOwnerData(ownerIds) {
  await prisma.expense.deleteMany({
    where: {
      ownerId: {
        in: ownerIds,
      },
    },
  });

  await prisma.vehicle.deleteMany({
    where: {
      ownerId: {
        in: ownerIds,
      },
    },
  });
}

async function main() {
  const primaryUser = await upsertUser(PRIMARY_ACCOUNT.email, PRIMARY_ACCOUNT.password);
  const isolationUser = await upsertUser(ISOLATION_ACCOUNT.email, ISOLATION_ACCOUNT.password);

  await resetOwnerData([primaryUser.id, isolationUser.id]);

  const carA = await prisma.vehicle.create({
    data: {
      ownerId: primaryUser.id,
      nickname: "Carro Principal",
      brand: "Toyota",
      model: "Corolla",
      plate: "ABC1D23",
      year: 2020,
    },
  });

  const carB = await prisma.vehicle.create({
    data: {
      ownerId: primaryUser.id,
      nickname: "Carro Reserva",
      brand: "Honda",
      model: "Fit",
      plate: "DEF2G34",
      year: 2018,
    },
  });

  const bikeC = await prisma.vehicle.create({
    data: {
      ownerId: primaryUser.id,
      nickname: "Moto Entregas",
      brand: "Honda",
      model: "CG 160",
      plate: "GHI3J45",
      year: 2022,
    },
  });

  const isolationVehicle = await prisma.vehicle.create({
    data: {
      ownerId: isolationUser.id,
      nickname: "Carro Isolado",
      brand: "Volkswagen",
      model: "Gol",
      plate: "JKL4M56",
      year: 2016,
    },
  });

  const primaryExpenses = [
    // Carro Principal: strong monthly variation + valid mileage basis for cost/km.
    expense({ ownerId: primaryUser.id, vehicleId: carA.id, expenseDate: "2025-11-05", category: "fuel", amountCents: 19000, mileage: 9800, notes: "Abastecimento estrada" }),
    expense({ ownerId: primaryUser.id, vehicleId: carA.id, expenseDate: "2025-11-20", category: "service", amountCents: 42000, mileage: 9950, notes: "Revisao preventiva" }),
    expense({ ownerId: primaryUser.id, vehicleId: carA.id, expenseDate: "2025-12-07", category: "fuel", amountCents: 20500, mileage: 10120, notes: "Abastecimento urbano" }),
    expense({ ownerId: primaryUser.id, vehicleId: carA.id, expenseDate: "2025-12-21", category: "parts", amountCents: 18000, mileage: 10280, notes: "Troca de filtros" }),
    expense({ ownerId: primaryUser.id, vehicleId: carA.id, expenseDate: "2026-01-10", category: "fuel", amountCents: 23000, mileage: 10430, notes: "Gasolina aditivada" }),
    expense({ ownerId: primaryUser.id, vehicleId: carA.id, expenseDate: "2026-01-25", category: "service", amountCents: 61000, mileage: 10610, notes: "Reparo de freio" }),
    expense({ ownerId: primaryUser.id, vehicleId: carA.id, expenseDate: "2026-02-08", category: "fuel", amountCents: 24000, mileage: 10820, notes: "Abastecimento viagem" }),
    expense({ ownerId: primaryUser.id, vehicleId: carA.id, expenseDate: "2026-02-26", category: "parts", amountCents: 22000, mileage: 11010, notes: "Pastilhas" }),
    expense({ ownerId: primaryUser.id, vehicleId: carA.id, expenseDate: "2026-03-12", category: "fuel", amountCents: 22500, mileage: 11230, notes: "Abastecimento" }),
    expense({ ownerId: primaryUser.id, vehicleId: carA.id, expenseDate: "2026-03-27", category: "service", amountCents: 54000, mileage: 11400, notes: "Alinhamento e balanceamento" }),
    expense({ ownerId: primaryUser.id, vehicleId: carA.id, expenseDate: "2026-04-09", category: "fuel", amountCents: 25000, mileage: 11610, notes: "Abastecimento" }),
    expense({ ownerId: primaryUser.id, vehicleId: carA.id, expenseDate: "2026-04-23", category: "parts", amountCents: 19500, mileage: 11770, notes: "Filtro de oleo" }),
    expense({ ownerId: primaryUser.id, vehicleId: carA.id, expenseDate: "2026-05-11", category: "fuel", amountCents: 23800, mileage: 11990, notes: "Abastecimento" }),
    expense({ ownerId: primaryUser.id, vehicleId: carA.id, expenseDate: "2026-05-24", category: "service", amountCents: 47000, mileage: 12180, notes: "Limpeza de bicos" }),
    expense({ ownerId: primaryUser.id, vehicleId: carA.id, expenseDate: "2026-06-06", category: "fuel", amountCents: 25500, mileage: 12410, notes: "Abastecimento" }),
    expense({ ownerId: primaryUser.id, vehicleId: carA.id, expenseDate: "2026-06-22", category: "parts", amountCents: 21000, mileage: 12590, notes: "Troca de velas" }),

    // Carro Reserva: one mileage point only (insufficient cost/km).
    expense({ ownerId: primaryUser.id, vehicleId: carB.id, expenseDate: "2025-11-09", category: "fuel", amountCents: 13000, notes: "Abastecimento" }),
    expense({ ownerId: primaryUser.id, vehicleId: carB.id, expenseDate: "2025-11-18", category: "parts", amountCents: 9000, notes: "Palheta" }),
    expense({ ownerId: primaryUser.id, vehicleId: carB.id, expenseDate: "2025-12-04", category: "fuel", amountCents: 12800, notes: "Abastecimento" }),
    expense({ ownerId: primaryUser.id, vehicleId: carB.id, expenseDate: "2025-12-19", category: "service", amountCents: 26000, notes: "Troca de oleo" }),
    expense({ ownerId: primaryUser.id, vehicleId: carB.id, expenseDate: "2026-01-06", category: "fuel", amountCents: 14000, notes: "Abastecimento" }),
    expense({ ownerId: primaryUser.id, vehicleId: carB.id, expenseDate: "2026-01-29", category: "parts", amountCents: 11000, notes: "Bateria" }),
    expense({ ownerId: primaryUser.id, vehicleId: carB.id, expenseDate: "2026-02-13", category: "fuel", amountCents: 14200, mileage: 54000, notes: "Abastecimento" }),
    expense({ ownerId: primaryUser.id, vehicleId: carB.id, expenseDate: "2026-02-24", category: "service", amountCents: 28000, notes: "Limpeza de arrefecimento" }),
    expense({ ownerId: primaryUser.id, vehicleId: carB.id, expenseDate: "2026-03-05", category: "fuel", amountCents: 13600, notes: "Abastecimento" }),
    expense({ ownerId: primaryUser.id, vehicleId: carB.id, expenseDate: "2026-03-20", category: "parts", amountCents: 9800, notes: "Lampada" }),
    expense({ ownerId: primaryUser.id, vehicleId: carB.id, expenseDate: "2026-04-07", category: "fuel", amountCents: 14500, notes: "Abastecimento" }),
    expense({ ownerId: primaryUser.id, vehicleId: carB.id, expenseDate: "2026-04-28", category: "service", amountCents: 30000, notes: "Revisao" }),
    expense({ ownerId: primaryUser.id, vehicleId: carB.id, expenseDate: "2026-05-09", category: "fuel", amountCents: 15000, notes: "Abastecimento" }),
    expense({ ownerId: primaryUser.id, vehicleId: carB.id, expenseDate: "2026-05-25", category: "parts", amountCents: 10500, notes: "Pastilha" }),
    expense({ ownerId: primaryUser.id, vehicleId: carB.id, expenseDate: "2026-06-03", category: "fuel", amountCents: 15200, notes: "Abastecimento" }),
    expense({ ownerId: primaryUser.id, vehicleId: carB.id, expenseDate: "2026-06-18", category: "service", amountCents: 32000, notes: "Retifica" }),

    // Moto Entregas: lower absolute costs + valid mileage basis.
    expense({ ownerId: primaryUser.id, vehicleId: bikeC.id, expenseDate: "2025-11-14", category: "fuel", amountCents: 4500, mileage: 3200, notes: "Abastecimento" }),
    expense({ ownerId: primaryUser.id, vehicleId: bikeC.id, expenseDate: "2025-12-15", category: "fuel", amountCents: 4800, mileage: 3600, notes: "Abastecimento" }),
    expense({ ownerId: primaryUser.id, vehicleId: bikeC.id, expenseDate: "2026-01-16", category: "service", amountCents: 15000, mileage: 4100, notes: "Revisao corrente" }),
    expense({ ownerId: primaryUser.id, vehicleId: bikeC.id, expenseDate: "2026-02-17", category: "fuel", amountCents: 5200, mileage: 4550, notes: "Abastecimento" }),
    expense({ ownerId: primaryUser.id, vehicleId: bikeC.id, expenseDate: "2026-03-18", category: "parts", amountCents: 7600, mileage: 5000, notes: "Pneu traseiro" }),
    expense({ ownerId: primaryUser.id, vehicleId: bikeC.id, expenseDate: "2026-04-19", category: "fuel", amountCents: 5400, mileage: 5480, notes: "Abastecimento" }),
    expense({ ownerId: primaryUser.id, vehicleId: bikeC.id, expenseDate: "2026-05-20", category: "service", amountCents: 17200, mileage: 6020, notes: "Relacao completa" }),
    expense({ ownerId: primaryUser.id, vehicleId: bikeC.id, expenseDate: "2026-06-21", category: "fuel", amountCents: 5900, mileage: 6500, notes: "Abastecimento" }),
  ];

  const isolationExpenses = [
    expense({ ownerId: isolationUser.id, vehicleId: isolationVehicle.id, expenseDate: "2026-01-10", category: "fuel", amountCents: 22000, mileage: 78000, notes: "Conta isolada" }),
    expense({ ownerId: isolationUser.id, vehicleId: isolationVehicle.id, expenseDate: "2026-02-10", category: "parts", amountCents: 18000, mileage: 78200, notes: "Conta isolada" }),
    expense({ ownerId: isolationUser.id, vehicleId: isolationVehicle.id, expenseDate: "2026-03-10", category: "service", amountCents: 35000, mileage: 78500, notes: "Conta isolada" }),
    expense({ ownerId: isolationUser.id, vehicleId: isolationVehicle.id, expenseDate: "2026-04-10", category: "fuel", amountCents: 21000, mileage: 78800, notes: "Conta isolada" }),
  ];

  await prisma.expense.createMany({
    data: [...primaryExpenses, ...isolationExpenses],
  });

  console.log("Seed completed successfully.");
  console.log(`Primary account: ${PRIMARY_ACCOUNT.email} / ${PRIMARY_ACCOUNT.password}`);
  console.log(`Isolation account: ${ISOLATION_ACCOUNT.email} / ${ISOLATION_ACCOUNT.password}`);
  console.log(`Primary vehicles: 3 | Primary expenses: ${primaryExpenses.length}`);
  console.log(`Isolation vehicles: 1 | Isolation expenses: ${isolationExpenses.length}`);
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
