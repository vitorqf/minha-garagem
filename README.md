# Minha Garagem

Personal single-user vehicle expense tracker.

## Status
- Phase: v0 specification and scaffolding.
- Source of truth: `AGENTS.md`.

## Product Goal
Track vehicle spending with clarity and confidence.

The app focuses on:
- Registering personal vehicles.
- Recording expenses per vehicle.
- Monitoring totals per vehicle and per month.

This is not a customer-selling SaaS in v0.

## v0 Scope
Delivery order:
1. Vehicles
2. Expenses
3. Summaries

Core expense categories:
- `fuel`
- `parts`
- `service`

Required expense fields:
- `date`
- `vehicle`
- `category`
- `amount`

Optional expense fields:
- `mileage`
- `notes`

## Out of Scope (v0)
- Reminders and alerts
- OCR receipt parsing
- Bank synchronization
- Billing and third-party integrations

## Language and Locale
- User-facing content: Portuguese (Brazil) (`pt-BR`)
- Code and technical documentation: English
- Currency default: BRL

## Technical Baseline
- Next.js + TypeScript
- PostgreSQL
- Vercel + managed PostgreSQL
- Responsive UI for desktop and mobile

## Engineering Rules
- TDD is mandatory (`Red -> Green -> Refactor`).
- Definition of Done for each increment: tests passing, lint passing, and documentation updated.

Required test stack:
- Vitest
- Testing Library
- Playwright (smoke tests)

## Documentation Workflow
For every feature increment, update:
- `AGENTS.md` when scope/contracts/rules change
- `README.md` when setup/usage changes
- `CHANGELOG.md` with visible technical or product updates

## Next Milestone
Start Slice 1 (Vehicles) with failing tests first, then implement the minimum behavior to pass.
