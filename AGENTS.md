# AGENTS.md - Project Specification v0 (`minha-garagem`)

## Canonical Source
- This root file (`/Users/vitorferreira/Documents/Workspace/minha-garagem/AGENTS.md`) is the single source of truth for project direction and execution rules.
- If any other `AGENTS.md` exists in auxiliary folders, this root file takes precedence.

## Product Definition
- Product type: personal single-user vehicle expense tracker.
- Positioning: this is not a customer-selling SaaS at v0.
- Primary user: garage/workshop owner tracking their own vehicles and costs.
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
- Single-owner authentication (credentials).
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
- Purpose: represent the single authenticated workspace owner.
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
- Sign up owner (`email`, `password`, `confirmPassword`) when no owner exists.
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
- Auth model for v0: single workspace owner credentials login (email + password).
- Account creation rule: only one owner account is allowed.
- Signup rule: `/signup` is available only while no owner account exists; afterwards redirect to `/login`.
- Route protection: unauthenticated access to `/vehicles`, `/expenses`, `/summaries`, and `/` redirects to `/login`.
- Data access model: only owner-scoped data.
- Password policy baseline: minimum 8 characters.
- Auth non-goals in v0:
- No forgot-password email flow.
- No social login providers.
- No multi-user workspace support.
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
- Confirm signup enforces single-owner rule and blocks additional registrations.
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

## Specification Validation Checklist
- [x] Product framed as personal single-user tracker (not sales SaaS).
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
- v0 authentication is single-owner credentials with one-account-only signup.
- Existing development data can be reset when introducing authentication.
- Iterative delivery and documentation continuity are mandatory.
