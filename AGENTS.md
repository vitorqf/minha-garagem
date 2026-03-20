# AGENTS.md - Project Specification v0 (`minha-garagem`)

## Canonical Source
- This root file (`/Users/vitorferreira/Documents/Workspace/minha-garagem/AGENTS.md`) is the single source of truth for project direction and execution rules.
- If any other `AGENTS.md` exists in auxiliary folders, this root file takes precedence.

## Product Definition
- Product type: personal multi-account vehicle expense tracker with isolated user data.
- Positioning: this is not a customer-selling SaaS at v0.
- Primary user: independent garage/workshop users tracking their own vehicles and costs.
- Main objective: register vehicles and track spending by vehicle with confidence and historical clarity.

## Language and Locale Policy
- User-facing content: Brazilian Portuguese (`pt-BR`).
- Code, code comments, commit messages, technical docs: English.
- Currency and locale defaults: BRL + `pt-BR`.

## Working Model
- Build in small increments, keeping the first version intentionally simple.
- Deliver using vertical slices (end-to-end value per increment).
- Avoid over-engineering and speculative abstractions.
- Keep documentation updated continuously with each feature increment.

## v0 Scope and Sequencing
- Required delivery sequence: `Authentication -> Vehicles -> Expenses -> Summaries`.
- v0 includes:
- Credentials authentication (evolved to multi-account in v1 Increment 2).
- Vehicle registry.
- Expense tracking by vehicle.
- Per-vehicle totals and monthly summary.

## Explicit Non-Goals for v0
- Reminders/alerts.
- OCR receipt parsing.
- Bank synchronization.
- Billing and third-party integrations.
- Compliance-ready legal/security programs beyond basic protection.

## Core Domain Contracts (Initial)

### `OwnerUser`
- Purpose: represent one authenticated app account (owner-scoped data identity).
- Minimum fields:
- `id` (stable identifier used as `ownerId` in domain records).
- `email` (unique login identifier).
- `passwordHash`.
- `createdAt`.
- `updatedAt`.

### `Vehicle`
- Purpose: represent one tracked vehicle.
- Minimum fields:
- `id` (stable identifier).
- `plate` or `nickname` (human identification).
- `brand`.
- `model`.
- `year` (optional in first increment if needed to simplify onboarding).

### `Expense`
- Purpose: represent one spending event tied to a vehicle.
- Required fields:
- `id`.
- `vehicleId`.
- `date`.
- `category` in `fuel | parts | service`.
- `amount` (BRL).
- Optional fields:
- `mileage`.
- `notes`.

### `VehicleSummary`
- Purpose: aggregated spending view for decisions.
- Minimum fields:
- `vehicleId`.
- `totalSpent`.
- `monthlyTotals` (keyed by year-month).
- `categoryBreakdown` (fuel/parts/service totals).

## API Capability Targets (Behavioral)
- Authentication API:
- Sign up account (`email`, `password`, `confirmPassword`) with unique email.
- Login with credentials.
- Logout.
- Resolve current authenticated owner session.
- Vehicle API:
- Create, read, update, delete vehicles.
- Expense API:
- Create, read, update, delete expenses.
- List expenses filtered by vehicle and period.
- Summary API:
- Query totals by vehicle.
- Query monthly totals for a selected month or month range.

## Technical Baseline
- Frontend/app: Next.js + TypeScript.
- Database: PostgreSQL from day one.
- Deployment baseline: Vercel + managed PostgreSQL.
- UI baseline: responsive support for desktop and mobile.

## Authentication and Privacy Baseline
- Auth model for current v1: multi-account credentials login (email + password).
- Account creation rule: multiple independent accounts are allowed.
- Signup rule: `/signup` is available for unauthenticated users.
- Route protection: unauthenticated access to `/vehicles`, `/expenses`, `/summaries`, and `/` redirects to `/login`.
- Data access model: owner-scoped per authenticated account.
- Password policy baseline: minimum 8 characters.
- Auth non-goals in v0:
- No forgot-password email flow.
- No social login providers.
- No collaborative shared-workspace model in v1 (accounts are isolated).
- Privacy/security baseline:
- Use basic protection controls suitable for an MVP.
- Do not claim advanced regulatory compliance in v0.

## Engineering Process and Quality Gates
- Development model: mandatory TDD.
- Required TDD cycle for each feature and bugfix:
- `Red`: write a failing automated test first.
- `Green`: implement the minimum code to pass.
- `Refactor`: improve code while keeping tests green.
- Required test stack:
- Vitest for unit/domain tests.
- Testing Library for component behavior tests.
- Playwright for basic end-to-end smoke coverage.
- Definition of Done for each increment:
- Relevant tests added/updated and passing.
- Lint checks passing.
- Documentation updated.

## Required Documentation Updates per Increment
- Update this file (`AGENTS.md`) when scope/rules/contracts change.
- Update `README.md` with setup and usage changes.
- Update `CHANGELOG.md` with user-visible and technical changes.

## v0 Feature Acceptance Criteria (TDD-First)

### Slice 0: Authentication
- Start with failing tests for signup/login validation and owner-session guard behavior.
- Confirm signup/login core credentials flow and session guard behavior.
- Confirm login/logout flow works with session-based owner identity.
- Confirm authenticated owner id is propagated to vehicles/expenses/summaries flows (no stub owner context).
- Confirm protected routes redirect unauthenticated users to `/login`.

### Slice 1: Vehicles
- Start with failing tests for vehicle CRUD and validation rules.
- Implement only the code needed to pass tests.
- Confirm owner can register, list, edit, and remove vehicles.

### Slice 2: Expenses
- Start with failing tests for expense creation and filtering.
- Ensure required fields (`date`, `vehicle`, `category`, `amount`) are enforced.
- Ensure `mileage` remains optional.
- Confirm expenses can be managed per vehicle with period filtering.

### Slice 3: Summaries
- Start with failing tests for per-vehicle totals and monthly summary aggregation.
- Confirm totals match registered expenses by category and month.
- Confirm output is clear for quick spending analysis.

## v1 Proposal (In Progress)
- Status: v1 Increment 4 implemented (`Summaries Export + Finalization`) + post-increment hardening patch implemented + decision-grade summaries insights patch implemented.

### Summary
- v1 focus: CSV exports plus multi-account authentication with strict data isolation and a high-fidelity responsive UI redesign.
- Objective: each authenticated account manages only its own vehicles/expenses/summaries with improved usability and visual consistency.
- Delivery model: 5 milestones (`Foundation -> Expenses Export -> Multi-User Auth -> Visual Reimplementation -> Summaries Export`).
- Increment 1 delivered:
- Shared `reports` domain module with CSV serializer, formatting helpers, and expenses export service contracts.
- `GET /api/reports/expenses.csv` endpoint with owner-scoped data retrieval.
- `Exportar CSV` action in `/expenses` filter section using active filters.
- Increment 2 delivered:
- Signup now supports multiple independent accounts (unique email + open signup for unauthenticated users).
- Single-owner signup guards removed from signup service/page.
- Server-side expense create/update now enforces vehicle ownership by authenticated account.
- Cross-user isolation validated in e2e across vehicles, expenses, summaries, and expenses CSV export.
- Increment 3 delivered:
- Complete visual reimplementation for `/login`, `/signup`, authenticated shell, `/vehicles`, `/expenses`, `/summaries`, and create/edit modals.
- New reusable UI primitives (`Dialog`, `DropdownMenu`, `AlertDialog`, `Select`, `Sheet`, `Button`, `Input`, `Badge`, `Card`) with shared theme tokens.
- Successful login and authenticated access to `/` now redirect to `/summaries`.
- Non-scope controls remain visual placeholders (`Buscar`, notification bell, pagination/search placeholders, summaries export placeholder).
- Increment 4 delivered:
- `GET /api/reports/summaries.csv` endpoint with owner-scoped summary aggregation.
- Functional `Exportar CSV` action in `/summaries` using active month/vehicle filters.
- Dynamic month columns in CSV output (`jan/2026`, `fev/2026`, etc.) with fixed totals/category columns.
- Post-increment hardening delivered:
- Login attempt throttling for credentials auth flow.
- Strict calendar-date validation for expense inputs/filters (invalid dates like `2026-02-31` are rejected).
- CSV formula neutralization for exported cell values to reduce spreadsheet formula injection risk.
- Export period guardrails for CSV endpoints (despesas: up to 12 months; resumos: up to 24 months).
- Database integrity hardening with owner foreign keys and owner-scoped expense-to-vehicle composite relation constraints.
- Post-increment decision-grade insights delivered:
- Per-vehicle `custo por km` on `/summaries` computed from filtered period spend divided by filtered mileage delta (`maxMileage - minMileage`).
- Global monthly trend rows with absolute and percent deltas versus previous month (increase in spend treated as negative signal).
- Top cost drivers ranking on `/summaries` as Top 3 `Veículo • Categoria` pairs with amount and share.

### Public API and Contract Targets
- Implemented authenticated endpoint:
- `GET /api/reports/expenses.csv?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD&vehicleId=<optional>&category=<optional>`.
- Implemented authenticated endpoint:
- `GET /api/reports/summaries.csv?startMonth=YYYY-MM&endMonth=YYYY-MM&vehicleId=<optional>`.
- Behavioral routing updates:
- Successful login redirects to `/summaries` (previously `/vehicles`).
- Authenticated access to `/` redirects to `/summaries`.
- Signup behavior:
- Multi-account signup enabled for unauthenticated users.
- Unique email is enforced.
- Auth behavior:
- Unauthenticated request returns `401` JSON with pt-BR message.
- Validation behavior:
- Invalid filters return `400` JSON with pt-BR message and field error map.
- CSV export period constraints:
- Expenses export allows up to 12 months per request.
- Summaries export allows up to 24 months per request.
- Success behavior:
- `200` with `Content-Type: text/csv; charset=utf-8`.
- `Content-Disposition: attachment; filename="<report>-<period>.csv"`.
- CSV payload starts with UTF-8 BOM for Excel compatibility.
- CSV format contract:
- Delimiter `;`.
- Headers in pt-BR.
- Currency in BRL-friendly numeric representation (for example `150,25`, without `R$` symbol in data cells).
- Dates in `DD/MM/YYYY`.
- Empty datasets export header row without hard error.
- Expenses filename contract:
- `despesas-YYYY-MM-DD-a-YYYY-MM-DD.csv`.
- Summaries filename contract:
- `resumos-YYYY-MM-a-YYYY-MM.csv`.
- Schema/API stability:
- No public HTTP contract changes beyond redirect destination behavior.
- Prisma schema now includes owner-integrity constraints for `Vehicle` and owner-scoped composite relation integrity for `Expense -> Vehicle`.
- No persisted `Report` entity.

### v1 Domain/Type Additions
- Implemented:
- `ReportExpenseExportFilter`.
- `ExpenseCsvRow`.
- `ReportSummaryExportFilter`.
- `SummaryCsvRow`.
- Internal summaries view-model expansion to support KPI cards and recent-expenses rendering without changing persistence contracts.
- Additional internal summaries view-model expansion to support `custo por km`, monthly trend deltas, and top cost drivers without changing persistence or HTTP contracts.

### Milestone Status
1. Milestone 1 (Foundation / Week 1)
- Status: completed.
- `reports` domain module now provides reusable CSV serialization and pt-BR export formatting.

2. Milestone 2 (Expenses Export / Week 2)
- Status: completed.
- `GET /api/reports/expenses.csv` implemented.
- `/expenses` now exposes `Exportar CSV` using active filters.
- Delivered columns: `ID`, `Data`, `Veículo`, `Categoria`, `Valor (R$)`, `Quilometragem (km)`, `Observações`.

3. Milestone 3 (Multi-User Auth / Week 3)
- Status: completed.
- Multi-account signup enabled.
- Single-owner signup restrictions removed.
- Expense create/update ownership checks enforced server-side.

4. Milestone 4 (Visual Reimplementation / Week 4)
- Status: completed.
- Full responsive UI redesign implemented across auth, shell, vehicles, expenses, and summaries.
- Existing domain rules and backend contracts preserved.
- Modal-first CRUD interactions and dashboard layout delivered with placeholder-only out-of-scope controls.

5. Milestone 5 (Summaries Export + Finalization / Week 5)
- Status: completed.
- `GET /api/reports/summaries.csv` implemented.
- `/summaries` now exposes functional `Exportar CSV` using active resolved filters.
- Delivered columns: `Veículo`, `Total (R$)`, `Combustível (R$)`, `Peças (R$)`, `Serviços (R$)`, plus dynamic month columns.
- Post-finalization analytics patch delivered in `/summaries` UI only (no CSV/API contract changes).

### v1 Test Targets and Coverage
- Implemented in Increment 1:
- Unit coverage for CSV serialization (delimiter, quoting, BOM, newline behavior).
- Unit coverage for report formatting helpers (currency/date/filename).
- Service coverage for owner scoping, expense filter application, and empty dataset behavior.
- Route/API coverage for `401`, `400`, and `200` CSV responses.
- Component coverage for `/expenses` export action query propagation.
- Playwright smoke coverage for expenses CSV download filename/content shape.
- Implemented in Increment 2:
- Auth service coverage for multi-account signup + duplicate email rejection.
- Expense service coverage for owner vehicle ownership enforcement on create/update.
- Playwright coverage for multi-account signup/login and cross-user data isolation.
- Implemented in Increment 3:
- Component coverage update for redesigned auth, vehicles, expenses, and summaries UIs.
- Playwright smoke update for modal/menu flows and authenticated landing on `/summaries`.
- Summary rendering coverage now includes KPI cards, per-category breakdown, vehicle ranking, recent expenses block, per-vehicle `custo por km`, monthly trend deltas, and top cost drivers ranking.
- Implemented in Increment 4:
- Service coverage for summaries CSV export owner scoping, validation, dynamic month range, and empty dataset behavior.
- Route/API coverage for summaries CSV `401`, `400`, and `200` responses with dynamic month headers.
- Component coverage for `/summaries` export action query propagation.
- Implemented in post-increment hardening patch:
- Unit coverage for login rate limiter behavior (block/unblock/reset).
- Validation coverage for strict calendar date rejection in expenses.
- Service coverage for CSV export period guardrails (expenses and summaries).
- Unit coverage for CSV formula neutralization behavior.
- Service coverage for mapping Prisma unique-constraint races to domain validation messages (auth + vehicles).
- Implemented in decision-grade insights patch:
- Unit coverage for summaries insights builders (`custo por km`, monthly trend deltas, top cost drivers ranking).
- Component coverage for new `/summaries` insights blocks and insufficient-data rendering.
- Playwright coverage update for `/summaries` validating `custo por km`, trend deltas, and top cost drivers ordering.

### v1 Assumptions Locked
- CSV-only in v1 (no PDF).
- On-demand generation only (no saved snapshots/history).
- Export entry points remain on existing screens (no dedicated `/reports` page).
- Multi-user means independent accounts only (no shared collaborative workspace).
- No roles/permissions matrix in v1.
- Expense categories remain fixed (`fuel | parts | service`) for this v1 slice.
- Placeholder-only controls are acceptable in v1 visual increment when explicitly marked as out-of-scope.

## Specification Validation Checklist
- [x] Product framed as personal independent-account tracker (not sales SaaS).
- [x] Scope sequencing fixed as `Authentication -> Vehicles -> Expenses -> Summaries`.
- [x] Non-goals explicitly listed (reminders, OCR, bank sync, billing/integrations).
- [x] Core contracts documented: `OwnerUser`, `Vehicle`, `Expense`, `VehicleSummary`.
- [x] API behavioral targets documented for auth/vehicle/expense/summary flows.
- [x] Language policy explicit: user content `pt-BR`; docs/code in English.
- [x] Locale defaults explicit: BRL + `pt-BR`.
- [x] Technical baseline explicit: Next.js + TypeScript + PostgreSQL.
- [x] Deployment baseline explicit: Vercel + managed Postgres.
- [x] Responsive requirement explicit: desktop + mobile.
- [x] TDD Red-Green-Refactor marked as mandatory.
- [x] Test stack explicit: Vitest + Testing Library + Playwright smoke.
- [x] Definition of Done explicit: tests + lint + docs update.
- [x] Required docs update set: `AGENTS.md`, `README.md`, `CHANGELOG.md`.
- [x] Basic privacy/security baseline explicit without compliance claims.

## Assumptions Locked
- Root `AGENTS.md` is canonical.
- v1 authentication is multi-account credentials with isolated owner-scoped data.
- Existing development data can be reset when introducing authentication.
- Iterative delivery and documentation continuity are mandatory.
