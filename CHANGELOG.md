# Changelog

All notable changes to this project will be documented in this file.

The format is based on Keep a Changelog and this project follows Semantic Versioning.

## [Unreleased]

### Added
- v1 Increment 4 (`Summaries Export + Finalization`) implementation with end-to-end summaries CSV download flow from `/summaries`.
- New authenticated API endpoint `GET /api/reports/summaries.csv` with owner-scoped aggregation and filename strategy `resumos-YYYY-MM-a-YYYY-MM.csv`.
- Summaries CSV response contract: `text/csv; charset=utf-8`, pt-BR headers, fixed category/total columns plus dynamic month columns derived from selected range.
- `/summaries` filters section now includes functional `Exportar CSV` action using active summary filters.
- Report service support for summaries CSV export with month labels, category totals, period totals, and owner-scoped filtering.
- Coverage for summaries CSV export contracts:
- Service tests for owner scoping, validation errors, dynamic months, and empty-period behavior.
- Route tests for `401`, `400`, and `200` CSV responses with dynamic headers.
- Component test for summaries export link query propagation.
- v1 Increment 3 (`Complete Visual Reimplementation Before Summaries CSV`) delivery with high-fidelity responsive redesign for auth, shell, vehicles, expenses, summaries, and modal workflows.
- New reusable UI foundation with Radix/shadcn-style primitives (`Dialog`, `DropdownMenu`, `AlertDialog`, `Select`, `Sheet`, `Button`, `Input`, `Badge`, `Card`) and shared design tokens in `globals.css`.
- New authenticated `AppShell` with desktop sidebar, mobile drawer, contextual header CTA, and placeholder topbar controls aligned with the approved mocks.
- Vehicle cards now include local static cover placeholders, plate badges, action menus, and modal edit/delete interactions.
- Summaries dashboard now includes KPI cards, category distribution block, per-vehicle ranking cards, and recent expenses table loaded from real owner-scoped data.
- Expanded component and Playwright coverage for redesigned modal/menu navigation flows and `/summaries` authenticated landing behavior.
- v1 Increment 2 (`Multi-User Authentication - Independent Accounts`) implementation with open multi-account signup and isolated owner-scoped data access.
- Signup flow update: unauthenticated users can always access `/signup`; account creation now enforces only unique-email constraints.
- Playwright multi-user coverage validating:
- Multiple independent account signup/login flows.
- Cross-user data isolation in vehicles, expenses, summaries, and expenses CSV export.
- Expense service authorization tests ensuring create/update reject vehicle ids not owned by the authenticated user.
- v1 Increment 1 (`Foundation + Expenses CSV Export`) delivery with end-to-end CSV download flow from `/expenses`.
- New reports feature module with reusable CSV serializer (UTF-8 BOM, `;` delimiter, deterministic line endings, escaping), export formatting helpers, and expenses export service contracts.
- New authenticated API endpoint `GET /api/reports/expenses.csv` with owner-scoped data export and filename strategy `despesas-YYYY-MM-DD-a-YYYY-MM-DD.csv`.
- Expenses CSV response contract: `text/csv; charset=utf-8`, pt-BR headers, `DD/MM/YYYY` dates, numeric BRL-like values (`150,25`), and header-only output for empty datasets.
- `/expenses` filters section now includes `Exportar CSV` action using active query filters.
- Test coverage for reports foundation and expenses export:
- Unit tests for CSV serialization and formatting helpers.
- Service tests for owner scoping/filter application/empty dataset behavior.
- Route tests for `401`, `400`, and `200` CSV responses.
- Component test for export link query propagation.
- Playwright e2e smoke for expenses CSV download filename/content shape.
- Slice 0 (Authentication) implementation with Auth.js Credentials (`next-auth`) and hashed password storage (`bcryptjs`).
- Owner `User` model (`id`, `email`, `passwordHash`, `createdAt`, `updatedAt`) plus Prisma migration `20260313181000_authentication_slice0`.
- Authentication routes and flows in `pt-BR`: `/login`, `/signup`, `/api/auth/[...nextauth]`, and navigation logout action.
- Single-owner signup guard: owner registration allowed only while no user exists; further signup attempts are blocked and redirected to login UX.
- Protected-route enforcement for `/`, `/vehicles`, `/expenses`, and `/summaries` with unauthenticated redirect to `/login`.
- Session owner propagation into vehicles/expenses/summaries pages and server actions (replacing hardcoded owner stub usage).
- Auth test coverage across validation, service, callbacks/session extraction, action state mapping, and form components.
- Playwright auth smoke coverage for unauthenticated redirect behavior plus signup/login/logout flows.
- Shared Playwright auth helper and test-run auth env defaults (`USER_REPOSITORY=memory`, `AUTH_SECRET`, `AUTH_TRUST_HOST`).
- `.env.example` auth baseline variables (`AUTH_SECRET`, `AUTH_TRUST_HOST`).
- Documentation update for authentication-first sequence in `AGENTS.md` and setup/usage changes in `README.md`.
- Slice 1 (Vehicles) implementation with Next.js App Router, Tailwind, Server Actions, and Prisma setup.
- Vehicle CRUD at `/vehicles` with owner-scoped model (`ownerId` stub) and newest-first listing.
- Strict Brazilian plate validation (Legacy + Mercosul) with normalization and per-owner uniqueness checks.
- Prisma schema/migration for `Vehicle` model and PostgreSQL baseline configuration.
- TDD baseline with Vitest unit/component tests and Playwright e2e CRUD smoke coverage.
- Slice 2 (Expenses) implementation with dedicated `/expenses` route, server actions, filtering, and BRL formatting.
- Expense schema and migration with owner scope, vehicle relation (`ON DELETE RESTRICT`), fixed categories, and indexed period queries.
- Expense CRUD with required `date/vehicle/category/amount`, optional `mileage/notes`, and integer-cents storage model.
- Date-range and vehicle filtering (`startDate`, `endDate`, optional `vehicleId`) with newest-first ordering.
- Vehicle deletion guard that blocks removal when related expenses exist, returning clear `pt-BR` feedback.
- Strict TDD execution for Slice 2 (failing tests first across validation/service/actions/components/e2e).
- Updated `README.md` with Slice 2 setup and usage details.
- Slice 3 (Summaries) implementation with dedicated `/summaries` route and owner-scoped server-side aggregation.
- Inclusive month-range filtering (`startMonth`, `endMonth`) with current-month defaults and optional vehicle scoping.
- Per-vehicle aggregated totals including category breakdown (`fuel`, `parts`, `service`) and monthly totals (`YYYY-MM`).
- Summary UI with explicit zero-total vehicle visibility, BRL formatting, and `pt-BR` month labels.
- Shared top navigation for direct access between `/vehicles`, `/expenses`, and `/summaries`.
- Slice 3 TDD coverage across validation/service/component/e2e smoke tests.
- GitHub CI workflow (`.github/workflows/ci.yml`) with `quality` gates for install, Prisma client generation, lint, unit/component tests, and production build.
- Main-branch-only Playwright gate (`ci / e2e-main`) with failure artifact upload (`playwright-report`, `test-results`).
- Security workflow (`.github/workflows/security.yml`) with dependency review, high-severity dependency audit, and gitleaks secret scan.
- CodeQL workflow (`.github/workflows/codeql.yml`) for JavaScript/TypeScript security and quality analysis.
- Dependabot weekly update policy for npm and GitHub Actions (`.github/dependabot.yml`).
- README CI/CD documentation including required status checks and manual GitHub/Vercel configuration steps.

### Changed
- Successful login redirect target changed from `/vehicles` to `/summaries`.
- Authenticated access to `/` now redirects to `/summaries`.
- Vehicles and expenses creation/editing UX moved from inline forms to modal-first interactions while preserving existing backend/domain rules.
- Out-of-scope controls are intentionally visual placeholders in this increment (`Buscar`, notification bell, pagination visuals).

### Fixed
- Expenses filter now supports functional category selection in `/expenses`, including owner-scoped list filtering and active-filter propagation to expenses CSV export links/API.
- Desktop sidebar now remains sticky in authenticated pages while scrolling long content (for example `/summaries`).
- Server-side expense authorization hardened: create/update now verifies vehicle ownership before persisting, preventing cross-account vehicle binding.
- In-memory repository consistency across Next.js module contexts by persisting memory repositories in `globalThis`, preventing CSV export route/state divergence during Playwright smoke tests.
- Login/signup e2e selector ambiguity by using exact label matching for `Senha` and `Confirmar senha`.
- `pnpm build` TypeScript blockers in validation layers by normalizing Zod flattened field errors into typed lookup helpers (vehicles, expenses, summaries).
- Vehicle repository year normalization for mixed raw input types (`number | string | null`) to keep in-memory and Prisma repositories type-safe and consistent.
- Playwright smoke test stability by using unique per-run test data in vehicles/expenses/summaries flows and row-scoped selectors to avoid strict-locator collisions.
- Prisma 7 configuration migration: datasource `url` removed from schema, `DATABASE_URL` centralized in `prisma.config.ts`, and Prisma Client initialized with PostgreSQL driver adapter (`@prisma/adapter-pg`).
- Vercel build stability with Prisma 7 by generating Prisma Client automatically on `pnpm build` via `prebuild`.
- Security workflow hardening by scoping dependency-review to runtime severity and upgrading Prisma-toolchain transitive packages (`hono`, `@hono/node-server`) to patched versions through pnpm overrides.

## [0.1.0] - 2026-03-13

### Added
- Initial project documentation baseline (`AGENTS.md`, `README.md`, `CHANGELOG.md`).
- Project direction defined as a personal single-user vehicle expense tracker.
