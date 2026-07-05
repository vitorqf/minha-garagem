---
name: Minha Garagem
description: Petrol-teal vehicle expense tracker, instrument-panel calm over SaaS gradient noise
colors:
  background: "oklch(0.966 0.005 220)"
  surface: "oklch(0.984 0.004 220)"
  card: "oklch(0.995 0.002 220)"
  overlay: "oklch(0.25 0.03 240 / 0.45)"
  foreground: "oklch(0.26 0.026 245)"
  muted: "oklch(0.5 0.024 240)"
  subtle: "oklch(0.64 0.026 240)"
  line: "oklch(0.905 0.008 225)"
  line-strong: "oklch(0.84 0.012 225)"
  field: "oklch(0.978 0.005 220)"
  primary: "oklch(0.56 0.098 205)"
  primary-hover: "oklch(0.5 0.098 205)"
  primary-active: "oklch(0.44 0.09 205)"
  primary-foreground: "oklch(0.99 0.012 205)"
  primary-subtle: "oklch(0.945 0.032 205)"
  primary-subtle-foreground: "oklch(0.42 0.088 205)"
  ring: "oklch(0.56 0.098 205 / 0.35)"
  success: "oklch(0.62 0.13 152)"
  success-subtle: "oklch(0.945 0.045 152)"
  success-foreground: "oklch(0.44 0.11 152)"
  fuel: "oklch(0.62 0.13 152)"
  fuel-subtle: "oklch(0.945 0.045 152)"
  fuel-foreground: "oklch(0.44 0.11 152)"
  parts: "oklch(0.7 0.13 66)"
  parts-subtle: "oklch(0.94 0.052 72)"
  parts-foreground: "oklch(0.5 0.11 58)"
  service: "oklch(0.6 0.13 250)"
  service-subtle: "oklch(0.94 0.04 250)"
  service-foreground: "oklch(0.46 0.13 250)"
  danger: "oklch(0.58 0.17 26)"
  danger-hover: "oklch(0.52 0.17 26)"
  danger-subtle: "oklch(0.945 0.04 26)"
  danger-foreground: "oklch(0.48 0.16 26)"
typography:
  body:
    fontFamily: "Manrope, ui-sans-serif, system-ui"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
  title:
    fontFamily: "Manrope, ui-sans-serif, system-ui"
    fontSize: "1.25rem"
    fontWeight: 700
    lineHeight: 1.3
  label:
    fontFamily: "IBM Plex Mono, ui-monospace, monospace"
    fontSize: "0.8125rem"
    fontWeight: 500
    lineHeight: 1.2
rounded:
  sm: "0.625rem"
  md: "0.875rem"
  lg: "1.125rem"
  xl: "1.5rem"
  2xl: "1.75rem"
spacing:
  card-padding: "1.5rem"
  input-height: "3rem"
  button-height: "2.5rem"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    rounded: "{rounded.xl}"
    padding: "0 1rem"
    height: "2.5rem"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
  button-primary-active:
    backgroundColor: "{colors.primary-active}"
  button-outline:
    backgroundColor: "{colors.card}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.xl}"
  button-ghost:
    backgroundColor: "{colors.primary-subtle}"
    textColor: "{colors.primary-subtle-foreground}"
    rounded: "{rounded.xl}"
  button-destructive:
    backgroundColor: "{colors.danger}"
    textColor: "{colors.primary-foreground}"
    rounded: "{rounded.xl}"
  input:
    backgroundColor: "{colors.field}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.xl}"
    height: "3rem"
  card:
    backgroundColor: "{colors.card}"
    rounded: "{rounded.2xl}"
    padding: "1.5rem"
---

# Design System: Minha Garagem

## 1. Overview

**Creative North Star: "The Garage Ledger"**

Minha Garagem reads like the notebook a careful car owner keeps in the glovebox, digitized: petrol-teal ink, category tabs colored like tags on a parts shelf, numbers set in a mono label face so R$ amounts line up and stay honest. It is instrument-panel calm, not dashboard-hype: no gradients, no glass, no stacked identical cards pretending to be insights. Every surface is a warm, barely-there grey-blue tint (never pure white, never pure black), because a garage ledger has been touched, not shrink-wrapped.

This system explicitly rejects generic SaaS gradient hero treatment, cookie-cutter identical card grids, and the fintech-corporate cold-navy look. It is personal and pt-BR direct, built for someone checking spend on their own car, not a fleet manager staring at a KPI wall.

**Key Characteristics:**
- Petrol-teal primary, used sparingly, never as a background wash.
- Three expense categories (fuel/parts/service) each get their own hue, consistently: base, subtle background, on-subtle text.
- Large, soft, tinted radii everywhere (0.625rem–1.75rem); nothing sharp-cornered.
- Elevation is a whisper: shadows tinted toward ink, never flat black, never dramatic.
- Manrope for reading, IBM Plex Mono for numbers and labels that need to line up.

## 2. Colors

Restrained strategy: tinted neutrals carry the interface, one petrol-teal accent does the persuading, three category hues do the sorting.

### Primary
- **Petrol Teal** (oklch(0.56 0.098 205)): buttons, active states, focus rings, links. Instrument-gauge teal, not SaaS blue — the comment in the codebase says so directly. Never used as a large background fill.

### Secondary (category system)
- **Fuel Green** (oklch(0.62 0.13 152)): fuel expense category, tags, filters, category badges.
- **Parts Amber** (oklch(0.7 0.13 66)): parts expense category.
- **Service Blue-Violet** (oklch(0.6 0.13 250)): service expense category.

Each category color ships as a trio: base (icon/badge border), `-subtle` (badge background), `-foreground` (badge text on the subtle background). Never mix a base color's text against a different category's subtle background.

### Neutral
- **Canvas Grey-Teal** (oklch(0.966 0.005 220), `background`): the app shell behind cards.
- **Surface** (oklch(0.984 0.004 220)): raised sections that aren't full cards.
- **Card White** (oklch(0.995 0.002 220)): card and field-on-card backgrounds. Barely off white, never `#fff`.
- **Ink** (oklch(0.26 0.026 245), `foreground`): primary text.
- **Muted** (oklch(0.5 0.024 240)) / **Subtle** (oklch(0.64 0.026 240)): secondary text, placeholders.
- **Line** (oklch(0.905 0.008 225)) / **Line Strong** (oklch(0.84 0.012 225)): borders and dividers, two weights.
- **Field** (oklch(0.978 0.005 220)): input backgrounds, distinct from card white so fields read as "editable" at a glance.

### Named Rules
**The Rare Teal Rule.** Primary petrol-teal appears on buttons, focus rings, and active/selected states only — never as a section background or hero wash. If more than one in ten pixels on a screen is teal, pull it back.

**The Category Trio Rule.** Every expense category (fuel/parts/service) must ship all three of its tones together (base, subtle, foreground). Never invent a fourth category color without adding its trio to `globals.css` first.

## 3. Typography

**Body Font:** Manrope (with ui-sans-serif, system-ui fallback)
**Label/Mono Font:** IBM Plex Mono (with ui-monospace fallback)

**Character:** Manrope is warm and slightly rounded, never sharp corporate sans; it carries the "caseiro" (homey) tone from PRODUCT.md. IBM Plex Mono is reserved for anything that must align as a column: currency, dates, plate numbers.

### Hierarchy
- **Title** (700, 1.25rem, 1.3 line-height): card titles, screen section headers.
- **Body** (400, 0.875rem, 1.5 line-height): form labels, table cells, descriptions. Cap prose blocks at 65–75ch.
- **Label** (500, 0.8125rem, 1.2 line-height, IBM Plex Mono): currency amounts, plate numbers, dates in tables and summaries — anywhere digits need to line up.

### Named Rules
**The Ledger Alignment Rule.** Any value the user compares across rows (R$ amounts, dates, mileage) renders in IBM Plex Mono, right-aligned in tables. Prose never does.

## 4. Elevation

Soft and tangible, never flat, never dramatic. Every shadow is tinted toward ink (oklch hue ~245, not neutral grey, and never pure black), so depth reads as ambient light rather than a hard drop-shadow. Radius scales from 0.625rem (small controls) up to 1.75rem (cards), reinforcing the "held object" feel over sharp app-chrome edges.

### Shadow Vocabulary
- **xs** (`0 1px 2px oklch(0.4 0.03 245 / 0.06)`): resting buttons, subtle definition only.
- **sm** (`0 1px 3px oklch(0.4 0.03 245 / 0.08), 0 1px 2px oklch(0.4 0.03 245 / 0.04)`): default card at rest.
- **md** (`0 6px 16px -6px oklch(0.4 0.03 245 / 0.14), 0 2px 6px -2px oklch(0.4 0.03 245 / 0.08)`): hovered/raised cards, dropdowns.
- **lg** (`0 18px 40px -12px oklch(0.35 0.04 245 / 0.22), 0 6px 14px -6px oklch(0.35 0.04 245 / 0.1)`): modals, dialogs, sheets.

### Named Rules
**The Whisper Shadow Rule.** No shadow may use pure black or an un-tinted grey. Every `box-shadow` color is `oklch` hue 240–245, so elevation always reads as "lifted paper," never "app chrome."

## 5. Components

### Buttons
- **Shape:** rounded-xl (1.5rem) at default/lg sizes; `sm` size drops to rounded-lg (0.875rem).
- **Primary:** petrol-teal background, primary-foreground text, `shadow-xs` at rest, darkens through `hover` → `active` in three fixed steps (no opacity fades).
- **Outline:** card background, line-strong border, hover fills to `surface`.
- **Ghost:** transparent, hover fills `primary-subtle` with `primary-subtle-foreground` text — the category-badge palette reused for low-emphasis actions.
- **Destructive:** danger background, same foreground/hover pattern as primary.
- **Sizes:** default h-10, sm h-9 (tighter radius), lg h-12, icon size-10 square.

### Cards / Containers
- **Corner Style:** rounded-3xl (1.75rem) — the largest radius in the system, reserved for the outermost card shell.
- **Background:** card white, line-weight border (not shadow-only separation).
- **Shadow Strategy:** `shadow-sm` at rest per the Elevation section; do not add `shadow-md` to a static card, only on hover/interactive lift.
- **Internal Padding:** header/content/footer all use 1.5rem horizontal, header/footer 1.5rem vertical.

### Inputs / Fields
- **Style:** field background (distinct from card white), line border, rounded-xl, h-12.
- **Focus:** border shifts to primary, background lifts to card white, 2px `ring` halo in primary at 35% alpha — never a glow-only or color-only focus state, always both border and ring.
- **Disabled:** 50% opacity, pointer-events removed.

### Navigation
Shared top navigation across `/vehicles`, `/expenses`, `/summaries`; keeps the three-step product flow (Vehicles → Expenses → Summaries) always visible so the user never loses their place in the incremental workflow.

## 6. Do's and Don'ts

### Do:
- **Do** keep petrol-teal to buttons, focus rings, and active/selected states (The Rare Teal Rule).
- **Do** ship every expense category as a base/subtle/foreground trio (The Category Trio Rule).
- **Do** set currency, dates, and mileage in IBM Plex Mono, right-aligned (The Ledger Alignment Rule).
- **Do** tint every shadow toward ink oklch hue ~245, never neutral grey or black (The Whisper Shadow Rule).
- **Do** keep the tone pt-BR direct and personal, "minha garagem," not "gestão de frota."

### Don't:
- **Don't** use gradient hero sections or gradient text — this is a SaaS-genérico anti-reference straight from PRODUCT.md.
- **Don't** repeat identical icon+heading+text cards across a screen; each summary card should earn its own layout.
- **Don't** use pure `#000` or `#fff` anywhere; every neutral is tinted oklch hue 220–245.
- **Don't** read as cold corporate fintech (navy, gold, glass) — the anti-reference is "SaaS genérico com gradiente," but overcorrecting into enterprise-fleet-management coldness is equally wrong per PRODUCT.md.
- **Don't** use `border-left`/`border-right` accent stripes on cards or list items; category identity is carried by the subtle-background badge trio, not a colored edge.
