# Minha Garagem

Personal multi-account vehicle expense tracker with isolated user data.

## Status
- Current increment: Slice 0 (Authentication) + Slices 1-3 implemented + v1 Increment 1 (Foundation + Expenses CSV Export) + v1 Increment 2 (Multi-User Authentication) + v1 Increment 3 (Complete Visual Reimplementation) + v1 Increment 4 (Summaries CSV Export) implemented.
- Source of truth: `AGENTS.md`.

## Product Goal
Track spending per vehicle with a clear, incremental workflow:
1. Authentication
2. Vehicles
3. Expenses
4. Summaries

## Slice 0 Delivered
- Dedicated `/login` and `/signup` authentication flows in `pt-BR`.
- Credentials model (email + password), evolved in v1 Increment 2 to multi-account signup.
- Auth.js Credentials + Prisma `User` model (`id`, `email`, `passwordHash`, timestamps).
- Protected routes: unauthenticated access to `/`, `/vehicles`, `/expenses`, `/summaries` redirects to `/login`.
- Successful login and authenticated access to `/` now redirect to `/summaries`.
- Session owner id now drives owner-scoped data access (stub owner context removed).
- Logout action available in the authenticated navigation.
- TDD coverage for auth validation/service/actions/session mapping and e2e auth smoke.

## Slice 1 Delivered
- Dedicated `/vehicles` screen.
- Vehicle CRUD (create, list, update, hard delete).
- Owner-scoped data model with authenticated owner context.
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
- Filtering by vehicle, category, and date range (`vehicleId`, `category`, `startDate`, `endDate`).
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

## v1 Increment 1 Delivered (Foundation + Expenses CSV Export)
- New authenticated endpoint: `GET /api/reports/expenses.csv?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD&vehicleId=<optional>&category=<optional>`.
- `/expenses` now includes an `Exportar CSV` action in the filters section, bound to active filter query params.
- CSV response contract:
- `Content-Type: text/csv; charset=utf-8`.
- `Content-Disposition: attachment; filename=\"despesas-YYYY-MM-DD-a-YYYY-MM-DD.csv\"`.
- UTF-8 BOM for Excel compatibility.
- Semicolon (`;`) delimiter and `pt-BR` headers.
- Date format `DD/MM/YYYY`.
- Amount format `150,25` (numeric `pt-BR`, without currency symbol in data cells).
- Empty result sets export header-only CSV.
- Validation/auth behavior:
- `401` JSON for unauthenticated requests.
- `400` JSON with pt-BR `message` and field `errors` map for invalid filters.

## v1 Increment 2 Delivered (Multi-User Authentication)
- Signup now supports multiple independent accounts with unique email enforcement.
- `/signup` remains available for unauthenticated users (no single-owner redirect lock).
- Signup/login copy updated to generic account wording (no “proprietário único” assumption).
- Expense create/update now validates vehicle ownership server-side to prevent cross-account binding by crafted requests.
- Cross-user isolation validated in e2e:
- User A data is not visible to User B in `/vehicles`, `/expenses`, `/summaries`, and expenses CSV export.

## v1 Increment 3 Delivered (Complete Visual Reimplementation)
- Full responsive redesign of `/login`, `/signup`, authenticated shell, `/vehicles`, `/expenses`, and `/summaries`.
- New reusable app shell with desktop sidebar, mobile drawer, topbar search placeholder, notification placeholder, and contextual CTA.
- Vehicles flow updated to card gallery with cover placeholders, plate badge, row menus, modal create/edit, and delete confirmation dialog.
- Expenses flow updated to mock-aligned filters + table layout with row action menus, modal create/edit, and delete confirmation dialog.
- Summaries flow updated to dashboard layout (KPI cards, category distribution, ranking by vehicle, recent expenses list with real data).
- Out-of-scope controls remain visual placeholders (`Buscar`, paginação visual, notification bell).
- New UI foundation with shadcn-style primitives, shared design tokens in `globals.css`, and expressive typography via `next/font`.
- Existing backend/domain contracts preserved (no API or Prisma schema changes for this redesign).

## v1 Increment 4 Delivered (Summaries CSV Export)
- New authenticated endpoint: `GET /api/reports/summaries.csv?startMonth=YYYY-MM&endMonth=YYYY-MM&vehicleId=<optional>`.
- `/summaries` now includes a functional `Exportar CSV` action bound to active summary filters.
- Summaries CSV response contract:
- `Content-Type: text/csv; charset=utf-8`.
- `Content-Disposition: attachment; filename=\"resumos-YYYY-MM-a-YYYY-MM.csv\"`.
- UTF-8 BOM for Excel compatibility.
- Semicolon (`;`) delimiter and `pt-BR` headers.
- Fixed columns: `Veículo`, `Total (R$)`, `Combustível (R$)`, `Peças (R$)`, `Serviços (R$)`.
- Dynamic month columns appended based on the selected period (`jan/2026`, `fev/2026`, ...).
- Category/month values exported as numeric BRL-like values (`150,25`, without `R$` in data cells).
- Empty result sets export header-only CSV.
- Validation/auth behavior:
- `401` JSON for unauthenticated requests.
- `400` JSON with pt-BR `message` and field `errors` map for invalid filters.

## Tech Baseline
- Next.js App Router + TypeScript + Tailwind CSS.
- Prisma ORM + PostgreSQL.
- Server Actions for mutations.
- Radix/shadcn-style UI primitives + `lucide-react`.
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
4. Edit `.env` with your Prisma datasource URL:
```bash
# Runtime URL (recommended: Supabase pooler URL in production/serverless)
DATABASE_URL="postgresql://postgres.<project-ref>:<url-encoded-password>@<pooler-host>:6543/postgres?sslmode=require&pgbouncer=true&connection_limit=1"

# Auth.js secret (minimum 32 characters)
AUTH_SECRET="replace-with-a-strong-random-secret"

# Trust host headers in local/dev and proxy environments
AUTH_TRUST_HOST="true"
```
5. Generate Prisma client and apply all migrations:
```bash
pnpm prisma:generate
pnpm prisma:migrate:dev
```
6. Run development server:
```bash
pnpm dev
```
7. Open [http://localhost:3000/login](http://localhost:3000/login) and create/login with your account.
8. Vehicles flow is available at [http://localhost:3000/vehicles](http://localhost:3000/vehicles).
9. Expenses flow is available at [http://localhost:3000/expenses](http://localhost:3000/expenses).
10. Summaries flow is available at [http://localhost:3000/summaries](http://localhost:3000/summaries).

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
- Playwright web server uses in-memory repositories (`VEHICLE_REPOSITORY=memory`, `USER_REPOSITORY=memory`) for deterministic smoke coverage without requiring a live DB in CI/test runs.
- Auth e2e smoke validates signup/login/logout and protected-route redirects before feature flows.
- Auth e2e smoke now also validates multi-account signup/login behavior and open signup access.
- Auth e2e smoke validates authenticated landing at `/summaries` after login.
- Expenses e2e smoke now validates CSV export download (filename + content shape) from `/expenses`.
- E2E smoke covers redesigned modal/menu flows across vehicles, expenses, and summaries.
- Expenses e2e smoke validates cross-user isolation across list/summaries/export flows.
- Unit and component coverage now also includes summaries CSV export service/route/filter-link contracts.

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
Define post-v1 roadmap priorities after CSV exports (for example reminders or richer analytics) while preserving owner-scoped isolation.
