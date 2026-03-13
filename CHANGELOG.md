# Changelog

All notable changes to this project will be documented in this file.

The format is based on Keep a Changelog and this project follows Semantic Versioning.

## [Unreleased]

### Added
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

### Fixed
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
