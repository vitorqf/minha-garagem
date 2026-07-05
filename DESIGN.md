---
name: Minha Garagem
description: Petrol-teal vehicle expense tracker, sharp instrument-panel structure over SaaS gradient noise
colors:
  background: "oklch(0.966 0.005 220)"
  surface: "oklch(0.984 0.004 220)"
  card: "oklch(0.995 0.002 220)"
  overlay: "oklch(0.25 0.03 240 / 0.45)"
  sidebar: "oklch(0.935 0.017 205)"
  sidebar-active: "oklch(0.885 0.026 205)"
  foreground: "oklch(0.26 0.026 245)"
  muted: "oklch(0.5 0.024 240)"
  subtle: "oklch(0.64 0.026 240)"
  line: "oklch(0.905 0.008 225)"
  line-strong: "oklch(0.84 0.012 225)"
  field: "oklch(0.978 0.005 220)"
  primary: "oklch(0.53 0.125 205)"
  primary-hover: "oklch(0.47 0.125 205)"
  primary-active: "oklch(0.41 0.115 205)"
  primary-foreground: "oklch(0.99 0.012 205)"
  primary-subtle: "oklch(0.93 0.045 205)"
  primary-subtle-foreground: "oklch(0.38 0.1 205)"
  ring: "oklch(0.53 0.125 205 / 0.4)"
  success: "oklch(0.62 0.13 152)"
  success-subtle: "oklch(0.91 0.075 152)"
  success-foreground: "oklch(0.36 0.1 152)"
  fuel: "oklch(0.62 0.13 152)"
  fuel-subtle: "oklch(0.91 0.075 152)"
  fuel-foreground: "oklch(0.36 0.1 152)"
  parts: "oklch(0.7 0.13 66)"
  parts-subtle: "oklch(0.9 0.085 72)"
  parts-foreground: "oklch(0.42 0.1 58)"
  service: "oklch(0.6 0.13 250)"
  service-subtle: "oklch(0.9 0.065 250)"
  service-foreground: "oklch(0.38 0.12 250)"
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
  sm: "0.375rem"
  md: "0.5rem"
  lg: "0.625rem"
  xl: "0.75rem"
  2xl: "1rem"
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
    rounded: "{rounded.xl}"
    padding: "1.5rem"
---

# Design System: Minha Garagem

## 1. Overview

**Creative North Star: "The Garage Ledger"**

Minha Garagem reads like the notebook a careful car owner keeps in the glovebox, digitized: petrol-teal ink, category tabs colored like tags on a parts shelf, numbers set in a mono label face so R$ amounts line up and stay honest. It is instrument-panel structure, not dashboard-hype: no gradients, no glass, no stacked identical cards pretending to be insights. Every surface is a warm, barely-there grey-blue tint (never pure white, never pure black), because a garage ledger has been touched, not shrink-wrapped.

This system explicitly rejects generic SaaS gradient hero treatment, cookie-cutter identical card grids, and the fintech-corporate cold-navy look. It is personal and pt-BR direct, built for someone checking spend on their own car, not a fleet manager staring at a KPI wall.

**Key Characteristics:**
- Petrol-teal primary, committed enough to own the sidebar's active state and the hero KPI, still never a full-page wash.
- Three expense categories (fuel/parts/service) each get their own hue, consistently: base, subtle background, on-subtle text — pushed a step past pastel so they read as color, not tint.
- Tight, structural radii (0.375rem–1rem); corners define shape, they don't dominate it.
- Elevation is scarce and meaningful: resting cards carry a border, not a shadow. Shadow is reserved for things actually floating above the canvas (dialogs, sheets, dropdowns, hover lift).
- A second neutral layer (the sidebar) is visibly teal-tinted, not gray, so navigation chrome reads as part of the brand instead of generic app shell.
- Manrope for reading, IBM Plex Mono for numbers and labels that need to line up.

## 2. Colors

Restrained-leaning-Committed: tinted neutrals still carry most of the interface, but petrol-teal now owns the sidebar's active state and the page's single most important number, and the three category hues are saturated enough to be identified by color alone, not just position.

### Primary
- **Petrol Teal** (oklch(0.53 0.125 205)): buttons, active nav (solid fill, not a pale wash), focus rings, the hero KPI value. Instrument-gauge teal, not SaaS blue.

### Secondary (category system)
- **Fuel Green** (oklch(0.62 0.13 152)): fuel expense category, tags, filters, category badges.
- **Parts Amber** (oklch(0.7 0.13 66)): parts expense category.
- **Service Blue-Violet** (oklch(0.6 0.13 250)): service expense category.

Each category color ships as a trio: base (icon/badge border), `-subtle` (badge background, now punchy enough to read as color at a glance), `-foreground` (badge text on the subtle background). Never mix a base color's text against a different category's subtle background.

### Neutral
- **Canvas Grey-Teal** (oklch(0.966 0.005 220), `background`): the app shell behind cards.
- **Surface** (oklch(0.984 0.004 220)): raised sections that aren't full cards.
- **Sidebar** (oklch(0.935 0.017 205)): the second neutral layer for nav chrome — visibly teal-tinted against the white card layer, not a flat gray panel. `Sidebar Active` (oklch(0.885 0.026 205)) is its hover state.
- **Card White** (oklch(0.995 0.002 220)): card and field-on-card backgrounds. Barely off white, never `#fff`.
- **Ink** (oklch(0.26 0.026 245), `foreground`): primary text.
- **Muted** (oklch(0.5 0.024 240)) / **Subtle** (oklch(0.64 0.026 240)): secondary text, placeholders.
- **Line** (oklch(0.905 0.008 225)) / **Line Strong** (oklch(0.84 0.012 225)): borders and dividers. Cards now use `line-strong` since they no longer lean on shadow for definition.
- **Field** (oklch(0.978 0.005 220)): input backgrounds, distinct from card white so fields read as "editable" at a glance.

### Named Rules
**The Committed Teal Rule.** Primary petrol-teal fills the sidebar's active nav item and the hero KPI — real color, not a pale tint — but still never becomes a section background wash or hero gradient. One filled moment per screen, not ambient color everywhere.

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

Structural, not floaty. Resting cards are defined by a `line-strong` border and a fill color, never a resting shadow — the previous "whisper shadow on every card" made every panel look like it was hovering, which read as generic and gray. Shadow now only appears on things that are genuinely elevated above the canvas: dialogs, sheets, dropdowns, and hover-lift on interactive cards.

### Shadow Vocabulary
- **xs** (`0 1px 2px oklch(0.4 0.03 245 / 0.08)`): resting buttons, small floating pills (e.g. the plate badge).
- **sm** (`0 2px 6px -2px oklch(0.4 0.03 245 / 0.14)`): hover-lift on interactive cards only. Never a resting card.
- **md** (`0 10px 24px -8px oklch(0.4 0.03 245 / 0.2), 0 3px 8px -3px oklch(0.4 0.03 245 / 0.12)`): dropdowns, select menus.
- **lg** (`0 24px 48px -14px oklch(0.32 0.04 245 / 0.3), 0 8px 18px -8px oklch(0.32 0.04 245 / 0.14)`): modals, dialogs, sheets.

### Named Rules
**The Earned Shadow Rule.** A resting card never carries a shadow. Shadow only appears on elements that are actually layered above the page (modals, menus) or actively lifting on hover. If it's sitting flat on the canvas, it gets a border, not a shadow.

## 5. Components

### Buttons
- **Shape:** rounded-xl (0.75rem) at default/lg sizes; `sm` size drops to rounded-lg (0.625rem).
- **Primary:** petrol-teal background, primary-foreground text, `shadow-xs` at rest, darkens through `hover` → `active` in three fixed steps (no opacity fades).
- **Outline:** card background, line-strong border, hover fills to `surface`.
- **Ghost:** transparent, hover fills `primary-subtle` with `primary-subtle-foreground` text — the category-badge palette reused for low-emphasis actions.
- **Destructive:** danger background, same foreground/hover pattern as primary.
- **Sizes:** default h-10, sm h-9 (tighter radius), lg h-12, icon size-10 square.

### Cards / Containers
- **Corner Style:** rounded-xl (0.75rem) — tight and structural, not a bubble.
- **Background:** card white, `line-strong` border carries definition alone.
- **Shadow Strategy:** no shadow at rest (The Earned Shadow Rule). `shadow-sm` only on hover for genuinely interactive cards (e.g. a clickable vehicle card).
- **Internal Padding:** header/content/footer all use 1.5rem horizontal, header/footer 1.5rem vertical.

### Inputs / Fields
- **Style:** field background (distinct from card white), line border, rounded-xl, h-12.
- **Focus:** border shifts to primary, background lifts to card white, 2px `ring` halo in primary at 40% alpha — never a glow-only or color-only focus state, always both border and ring.
- **Disabled:** 50% opacity, pointer-events removed.

### Navigation
Shared side navigation across `/vehicles`, `/expenses`, `/summaries`, rendered on the `sidebar` neutral layer (teal-tinted, not gray). The active route gets a solid petrol-teal fill with `primary-foreground` text — the single most committed color moment in the shell — keeping the three-step product flow (Vehicles → Expenses → Summaries) visible at a glance.

## 6. Do's and Don'ts

### Do:
- **Do** fill the sidebar's active nav item and the hero KPI with solid petrol-teal (The Committed Teal Rule) — that's the one deliberate color commitment per screen.
- **Do** ship every expense category as a base/subtle/foreground trio, saturated enough to read as color (The Category Trio Rule).
- **Do** set currency, dates, and mileage in IBM Plex Mono, right-aligned (The Ledger Alignment Rule).
- **Do** define resting cards with a `line-strong` border only, never a resting shadow (The Earned Shadow Rule).
- **Do** keep the tone pt-BR direct and personal, "minha garagem," not "gestão de frota."

### Don't:
- **Don't** use gradient hero sections or gradient text — this is a SaaS-genérico anti-reference straight from PRODUCT.md.
- **Don't** repeat identical icon+heading+text cards across a screen; each summary card should earn its own layout.
- **Don't** put a resting shadow on a card that isn't actually floating (dialogs/sheets/dropdowns only) — flat cards read as generic "AI dashboard" gray.
- **Don't** use pure `#000` or `#fff` anywhere; every neutral is tinted oklch hue 220–245.
- **Don't** read as cold corporate fintech (navy, gold, glass) — the anti-reference is "SaaS genérico com gradiente," but overcorrecting into enterprise-fleet-management coldness is equally wrong per PRODUCT.md.
- **Don't** use `border-left`/`border-right` accent stripes on cards or list items; category identity is carried by the subtle-background badge trio, not a colored edge.
