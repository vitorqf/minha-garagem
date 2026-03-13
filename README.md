# Minha Garagem

Personal single-user vehicle expense tracker.

## Status
- Current increment: Slice 2 (Expenses) implemented.
- Source of truth: `AGENTS.md`.

## Product Goal
Track spending per vehicle with a clear, incremental workflow:
1. Vehicles
2. Expenses
3. Summaries

## Slice 1 Delivered
- Dedicated `/vehicles` screen.
- Vehicle CRUD (create, list, update, hard delete).
- Owner-scoped data model with a stubbed owner context.
- Validation in `pt-BR`:
- Required: `nickname`, `brand`, `model`.
- Optional: `plate`, `year`.
- Strict Brazilian plate support (Legacy `AAA9999` + Mercosul `AAA9A99`).
- Plate uniqueness per owner when provided.
- Vehicles listed by newest first.

## Slice 2 Delivered
- Dedicated `/expenses` screen.
- Expense CRUD (create, list, update, hard delete) scoped to owner and vehicle.
- Fixed categories: `fuel`, `parts`, `service`.
- Required expense fields: `expenseDate`, `vehicleId`, `category`, `amount`.
- Optional fields: `mileage`, `notes` (max 500 chars).
- Amount input accepted as BRL decimal and stored as integer cents.
- Default filters: all vehicles, last 30 days, newest date first.
- Filtering by vehicle and date range (`startDate` + `endDate`).
- Vehicle deletion now blocked when related expenses exist.

## Tech Baseline
- Next.js App Router + TypeScript + Tailwind CSS.
- Prisma ORM + PostgreSQL.
- Server Actions for mutations.
- Vitest + Testing Library + Playwright smoke tests.

## Prerequisites
- Node.js 24+
- Corepack enabled (for `pnpm`)
- PostgreSQL running locally or remotely

## Setup
1. Enable package manager:
```bash
corepack enable
corepack prepare pnpm@latest --activate
```
2. Install dependencies:
```bash
pnpm install
```
3. Configure environment:
```bash
cp .env.example .env
```
4. Edit `.env` with your PostgreSQL `DATABASE_URL`.
5. Generate Prisma client and apply migrations:
```bash
pnpm prisma:generate
pnpm prisma:migrate:dev --name init
pnpm prisma:migrate:dev --name expenses_slice2
```
6. Run development server:
```bash
pnpm dev
```
7. Open [http://localhost:3000/vehicles](http://localhost:3000/vehicles).
8. Expenses flow is available at [http://localhost:3000/expenses](http://localhost:3000/expenses).

## Quality Gates
Run before considering an increment complete:
```bash
pnpm lint
pnpm test
pnpm test:e2e
```

## Testing Notes
- Unit + component tests run with Vitest (`pnpm test`).
- E2E smoke tests run with Playwright (`pnpm test:e2e`).
- Playwright web server uses in-memory repositories (`VEHICLE_REPOSITORY=memory`) for deterministic smoke coverage without requiring a live DB in CI/test runs.
- Slice 2 followed strict TDD order: failing tests first, then implementation.

## Out of Scope (v0)
- Reminders and alerts
- OCR receipt parsing
- Bank synchronization
- Billing and third-party integrations

## Next Milestone
Slice 3 (Summaries): aggregate totals by vehicle and by month with category breakdown.
