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

## [0.1.0] - 2026-03-13

### Added
- Initial project documentation baseline (`AGENTS.md`, `README.md`, `CHANGELOG.md`).
- Project direction defined as a personal single-user vehicle expense tracker.
