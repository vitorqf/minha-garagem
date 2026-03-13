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
- Updated `README.md` with real setup, migration, run, lint, unit, and e2e commands.

## [0.1.0] - 2026-03-13

### Added
- Initial project documentation baseline (`AGENTS.md`, `README.md`, `CHANGELOG.md`).
- Project direction defined as a personal single-user vehicle expense tracker.
