# Minha Garagem

Personal single-user vehicle expense tracker.

## Status
- Current increment: Slice 3 (Summaries) implemented.
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

## Slice 3 Delivered
- Dedicated `/summaries` screen.
- Read-only summary flow with inclusive month range filters (`startMonth`, `endMonth`).
- Default summary period set to current month.
- Optional vehicle filter for focused per-vehicle analysis.
- Per-vehicle total spend with category breakdown (`fuel`, `parts`, `service`).
- Monthly totals keyed by year-month with `pt-BR` month labels.
- Vehicles with zero expenses in selected period are still listed with explicit `R$ 0,00`.
- Shared top navigation across `/vehicles`, `/expenses`, and `/summaries`.

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
9. Summaries flow is available at [http://localhost:3000/summaries](http://localhost:3000/summaries).

## Quality Gates
Run before considering an increment complete:
```bash
pnpm lint
pnpm test
pnpm build
pnpm test:e2e
```

## Testing Notes
- Unit + component tests run with Vitest (`pnpm test`).
- E2E smoke tests run with Playwright (`pnpm test:e2e`).
- Playwright web server uses in-memory repositories (`VEHICLE_REPOSITORY=memory`) for deterministic smoke coverage without requiring a live DB in CI/test runs.
- Slice 3 followed strict TDD order: failing tests first, then implementation.

## CI/CD and Security Pipeline
- `ci / quality`: runs on pull requests and pushes to `main` with `pnpm install --frozen-lockfile`, `pnpm prisma:generate`, `pnpm lint`, `pnpm test`, and `pnpm build`.
- `ci / e2e-main`: runs only on pushes to `main` and blocks production branch changes when Playwright smoke tests fail.
- `security / dependency-review`: runs on pull requests with `actions/dependency-review-action`.
- `security / audit`: runs `pnpm audit --audit-level high`.
- `security / secret-scan`: runs gitleaks against full git history (`fetch-depth: 0`).
- `codeql / analyze`: runs CodeQL (`javascript-typescript`) on pull requests, pushes to `main`, and weekly schedule.
- Dependabot (`.github/dependabot.yml`) updates npm and GitHub Actions dependencies weekly.

## Manual Platform Configuration
Set these once in your GitHub/Vercel project settings:
1. Configure GitHub branch protection for `main` to require pull requests, require up-to-date branches, and require these checks: `ci / quality`, `security / dependency-review`, `security / audit`, `security / secret-scan`, `codeql / analyze`.
2. Keep `ci / e2e-main` out of required pull request checks because it runs only after push to `main`.
3. Configure Vercel Git integration: connect this repository, set production branch to `main`, keep preview deployments for pull requests, and keep production deploys on merges to `main`.

## Out of Scope (v0)
- Reminders and alerts
- OCR receipt parsing
- Bank synchronization
- Billing and third-party integrations

## Next Milestone
Stabilize v0 and prepare the next increment after summary usage feedback.
