# Minha Garagem

Personal single-user vehicle expense tracker.

## Status
- Current increment: Slice 1 (Vehicles) implemented.
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
```
6. Run development server:
```bash
pnpm dev
```
7. Open [http://localhost:3000/vehicles](http://localhost:3000/vehicles).

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
- Playwright web server uses in-memory vehicle repository (`VEHICLE_REPOSITORY=memory`) for deterministic smoke coverage without requiring a live DB in CI/test runs.

## Out of Scope (v0)
- Reminders and alerts
- OCR receipt parsing
- Bank synchronization
- Billing and third-party integrations

## Next Milestone
Slice 2 (Expenses): implement expense CRUD per vehicle with date/category/amount requirements and period filtering.
