# DM Forge Design System

**Version:** 1.0.0  
**Effective date:** 2026-07-21  
**Canonical implementation:** `shared/design-system.css`

This document is the visual contract for DM Forge. Tool pages may have specialized layouts, but they may not create near-duplicate brand palettes, typography roles, control sizing, focus behavior, or elevation systems.

## Design goals

1. **Fast at the table.** Controls must remain readable and predictable during a live session.
2. **Fantasy without friction.** The product may look like a fantasy tool without using decorative typography for dense forms, logs, tables, or controls.
3. **Print remains special.** Player handouts and DM reference cards may use editorial serif typography because they are designed as physical artifacts.
4. **Mobile first.** The same task must work on an ordinary phone, tablet, and laptop.
5. **Accessible by default.** WCAG 2.2 AA is the target; focus, reduced motion, text scaling, and touch access are not optional polish.
6. **One source of truth.** Shared tokens live in `shared/design-system.css`. A tool must consume them rather than copying similar values.

## Typography roles

| Role | Canonical stack | Use |
|---|---|---|
| Display | `Cinzel`, Georgia, serif | Product name, page H1, major section headings, card names |
| UI | Inter/system sans | Forms, buttons, labels, navigation, live logs, tables, help text |
| Editorial | Georgia/Times serif | Printed cards, handouts, continuation pages, printable packets |
| Monospace | Cascadia Mono/Segoe UI Mono/Consolas | Room codes, raw identifiers, code-like values |

### Rules

- Product UI body copy must use `--font-ui`.
- Decorative type is limited to headings and brand marks.
- Printed artifacts may use `--font-editorial` for long-form rules text.
- Controls must never use a decorative face.
- New remote font families require a documented design decision and performance review.
- Font size for form controls must remain at least 16 CSS pixels to avoid mobile zoom behavior.

## Canonical color tokens

| Token | Value | Purpose |
|---|---:|---|
| `--dm-bg` | `#140b08` | Application background |
| `--dm-surface` | `#fff9e8` | Primary parchment surface |
| `--dm-surface-raised` | `#fffdf4` | Inputs and raised panels |
| `--dm-surface-muted` | `#f3e1b4` | Secondary parchment |
| `--dm-text` | `#24170f` | Primary text |
| `--dm-text-muted` | `#665346` | Secondary text |
| `--dm-brand` | `#7b2e25` | Primary red |
| `--dm-brand-strong` | `#4b1713` | Dark red |
| `--dm-gold` | `#b98935` | Accent and borders |
| `--dm-info` | `#315c72` | Informational blue |
| `--dm-success` | `#446a45` | Success and healthy state |
| `--dm-warning` | `#9c6b20` | Warning state |
| `--dm-danger` | `#8a2e26` | Destructive action |
| `--dm-focus` | `#087ea4` | Keyboard focus ring |
| `--dm-border` | `#a57c3e` | Standard border |

### Contrast contract

The following primary pairs were checked when version 1.0.0 was introduced:

- Primary text on parchment: greater than 16:1
- Muted text on parchment: greater than 6.9:1
- Light text on brand red: greater than 8.7:1
- Light text on informational blue: greater than 6.8:1
- Light text on success green: greater than 5.8:1
- Dark text on gold: greater than 5.5:1

Any token change must rerun contrast tests. Do not infer accessibility from appearance alone.

## Interaction standards

- Primary controls use a minimum 44-pixel height.
- Every interactive element must show a visible `:focus-visible` indicator.
- No essential function may require hover.
- Buttons that only trigger actions must use `type="button"` unless they intentionally submit a form.
- Destructive actions require clear wording and confirmation when data loss is possible.
- Disabled controls must communicate state visually and programmatically.
- Motion must honor `prefers-reduced-motion`.
- Touch targets must not be crowded together.

## Layout standards

- Use responsive grids with `minmax()` rather than fixed desktop-only columns.
- Keep reading lines reasonably short; dense rules text belongs in cards or expandable regions.
- Sticky regions must become static on narrow screens.
- Mobile layouts must respect safe-area insets.
- Never solve overflow by shrinking body text below a readable size.
- Printable cards must detect overflow and add continuation pages.

## Print exceptions

The following are allowed to differ from product UI:

- Editorial serif body text
- Physical dimensions in inches
- Cut guides and duplex mirroring
- Black-and-white or ink-saving variants
- Card-specific decorative borders

Print exceptions may not override:

- Accurate rules content
- Overflow detection
- Minimum readable print size
- Player-safe versus DM-only separation
- Source and ruleset labels

## Component policy

Preferred shared patterns:

- `.btn`, including `.light`, `.gold`, `.blue`, and `.danger`
- `.panel`
- `.site-header`
- `.eyebrow`
- `.actions`
- `.status` or tool-specific status pills using canonical state colors
- `.shared-context`

A new component should be introduced only when an existing pattern cannot express the task clearly.

## Changing this system

1. Record the proposal in `docs/DECISIONS.md`.
2. Verify contrast and mobile behavior.
3. Update `shared/design-system.css` first.
4. Update this document in the same change set.
5. Run the static, design, accessibility, and browser suites.
6. Inspect representative UI pages and representative printed artifacts.
7. Increment the design-system version when token semantics or behavior change.

## Current exceptions

- Cleric in a Box retains an artifact-specific background treatment, but uses the canonical palette and typography roles.
- Monster, magic-item, NPC, and loot print surfaces retain specialized physical layouts.
- Legacy tool CSS still contains local aliases while migration continues; the shared stylesheet wins at runtime. New local palette definitions are prohibited.
