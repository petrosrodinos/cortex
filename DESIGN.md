---
name: Cortex
description: AI business operating system — unified workspace for enterprise ops teams
colors:
  signal-teal: "oklch(0.72 0.145 164)"
  signal-teal-light: "oklch(0.55 0.135 164)"
  background: "oklch(0.145 0.018 248)"
  surface: "oklch(0.185 0.020 248)"
  surface-secondary: "oklch(0.225 0.022 248)"
  surface-tertiary: "oklch(0.265 0.024 248)"
  foreground: "oklch(0.94 0.012 248)"
  muted: "oklch(0.64 0.016 248)"
  border: "oklch(0.31 0.020 248)"
  field-bg: "oklch(0.205 0.021 248)"
  field-border: "oklch(0.335 0.026 248)"
  field-placeholder: "oklch(0.52 0.014 248)"
typography:
  title:
    fontFamily: "system-ui, \"Segoe UI\", sans-serif"
    fontSize: "0.875rem"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "normal"
  body:
    fontFamily: "system-ui, \"Segoe UI\", sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.45
    letterSpacing: "normal"
  label:
    fontFamily: "system-ui, \"Segoe UI\", sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1
    letterSpacing: "normal"
  caption:
    fontFamily: "system-ui, \"Segoe UI\", sans-serif"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1.3
    letterSpacing: "normal"
  mono:
    fontFamily: "ui-monospace, Consolas, monospace"
    fontSize: "0.8125rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
rounded:
  sm: "4px"
  md: "6px"
  lg: "8px"
  xl: "12px"
  2xl: "16px"
spacing:
  1: "4px"
  1.5: "6px"
  2: "8px"
  2.5: "10px"
  3: "12px"
  4: "16px"
  5: "20px"
  6: "24px"
components:
  button-primary:
    backgroundColor: "{colors.foreground}"
    textColor: "{colors.background}"
    rounded: "{rounded.md}"
    padding: "0 16px"
    height: "40px"
  button-primary-hover:
    backgroundColor: "{colors.muted}"
    textColor: "{colors.background}"
    rounded: "{rounded.md}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.foreground}"
    rounded: "{rounded.md}"
    padding: "0 16px"
    height: "40px"
  button-ghost-hover:
    backgroundColor: "{colors.surface-secondary}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.md}"
  nav-item-active:
    backgroundColor: "{colors.surface-secondary}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.xl}"
    padding: "8px 10px"
  input-default:
    backgroundColor: "{colors.field-bg}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.md}"
    padding: "0 12px"
    height: "40px"
  card-default:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.xl}"
    padding: "16px"
---

# Design System: Cortex

## 1. Overview

**Creative North Star: "The Integrated Layer"**

Cortex's visual system is designed to disappear. It is not a UI that announces itself; it is a surface that earns trust by staying out of the way while keeping everything present. The dominant mode is dark, not as an aesthetic choice but a functional one: enterprise operations teams working across multiple systems in long sessions need an environment that doesn't fatigue the eye or fragment attention. The Indigo Depth backgrounds create dimensional space without darkness for its own sake. Signal Teal activates selectively — a current flowing through the system to mark what matters.

The aesthetic philosophy is calibrated density. There is no whitespace inflation. Surfaces layer tonally through the background → surface → surface-secondary → surface-tertiary progression, each step a quiet signal that something has elevated, without a shadow announcing it. When shadows do appear, they carry an accent tint: the system's warmth surfacing at points of structure. The floating sidebar and navbar — rounded, bounded, gently shadowed — make the chrome feel like it belongs inside the space rather than framing it from the outside.

Every decision enforces the product's core promise: scattered systems feel like one. Navigation is always visible. The accent lives only where it must. Complexity is underneath; the surface is calm.

This system explicitly rejects two failure modes named in the product brief. First: generic SaaS dashboard aesthetics — white cards on white backgrounds, blue primary buttons, identical icon-heading-text grids, hero-metric templates with big numbers and gradient accents. If it looks like a Figma community template, it has failed. Second: AI hype aesthetics — purple-to-blue gradients, neural network particle backgrounds, glowing orbs, "powered by AI" badges on every feature. Cortex is intelligent; it demonstrates that through what it does, not through how loudly it labels itself.

**Key Characteristics:**
- Dark-first with tonal depth through surface layering, not shadows at rest
- One accent, rarely used, always meaningful
- Floating, rounded chrome (sidebar and navbar) that sits inside the viewport
- Single system font family — legibility over personality
- Accent-tinted shadows on primary structural surfaces

## 2. Colors: The Indigo Depth Palette

Two hue families, one job each. Indigo Depth (hue 248, blue-slate) builds every neutral and surface. Signal Teal (hue 164, cyan-green) is the single accent. Chroma steps up incrementally as surfaces elevate from background — the system has texture without noise.

### Primary
- **Signal Teal** (`oklch(0.72 0.145 164)`, dark theme): The only accent. Active navigation, focus rings, success states, current selection indicators. The chroma (0.145) is deliberately high so it reads against dark neutrals without needing to shout. In dark mode, this is the single non-neutral hue in the interface at any given moment.
- **Signal Teal (Light Theme)** (`oklch(0.55 0.135 164)`): Signal Teal stepped down in lightness and slightly desaturated for sufficient contrast on light surfaces. Same role, same meaning, different register.

### Neutral
- **Indigo Depth / Background** (`oklch(0.145 0.018 248)`): The root background. Nothing sits below this layer. The faint blue bias (chroma 0.018) prevents it from reading as pure graphite.
- **Surface** (`oklch(0.185 0.020 248)`): Primary panel background. The sidebar, main content area, cards. The first step up from background.
- **Surface Secondary** (`oklch(0.225 0.022 248)`): Hover states, secondary panels, toolbar backgrounds. Where surfaces become interactive.
- **Surface Tertiary** (`oklch(0.265 0.024 248)`): Third elevation layer. Selected states, popovers-within-panels, table row highlights.
- **Foreground** (`oklch(0.94 0.012 248)`): Primary text and icons. Not pure white — tinted toward the system hue. Everything important is this color.
- **Muted** (`oklch(0.64 0.016 248)`): Secondary text, inactive navigation labels, supporting copy. Low contrast against surface; high contrast against background.
- **Border** (`oklch(0.31 0.020 248)`): Structural edges between surfaces. Low contrast; it defines without competing.
- **Field Background** (`oklch(0.205 0.021 248)`): Form input fills. Sits between Surface and Surface Secondary — slightly elevated above the panel it lives on.
- **Field Border** (`oklch(0.335 0.026 248)`): Input stroke borders. More prominent than the default border so fields are clearly interactive.
- **Field Placeholder** (`oklch(0.52 0.014 248)`): Placeholder text in inputs. Clearly secondary; never confused with entered content.

### Named Rules
**The One Signal Rule.** Signal Teal appears on ≤10% of any screen at a time. Accent backgrounds use `color-mix(in oklch, var(--accent) 12–16%, transparent)`. Accent borders use `color-mix(in oklch, var(--accent) 22–48%, transparent)`. Full-saturation accent is reserved for the active nav icon, focus rings, and explicit success states. Its scarcity is structural, not accidental — the moment it appears, it means something.

**The Tonal Progression Rule.** Surfaces step up in both lightness and chroma together: background (0.145/0.018) → surface (0.185/0.020) → surface-secondary (0.225/0.022) → surface-tertiary (0.265/0.024). The progression is systematic. Breaking it — skipping a level, reversing direction, inventing a fifth layer — signals an error, not a design decision.

**The Warm Shadow Rule.** All primary chrome surfaces (sidebar, navbar) use `color-mix(in oklch, var(--accent) 30–35%, transparent)` blended with black as their shadow color. Pure black shadows are reserved for floating panels (dialogs, dropdowns). The accent's warmth follows the structure.

## 3. Typography

**Display/Body/Label Font:** system-ui, "Segoe UI", sans-serif
**Mono Font:** ui-monospace, Consolas, monospace

**Character:** A single-family system stack throughout — no editorial display font, no pairing tension. The voice is the operating system's own: native, legible, professional. Hierarchy is carried entirely by scale and weight. Monospace appears only for technical content (API keys, IDs, code references) — never decoratively.

### Hierarchy
- **Title** (semibold 600, 14px / 0.875rem, leading 1.3): Page titles, section headings, dialog headings. Tight leading creates density appropriate to an enterprise tool.
- **Body** (regular 400, 16px / 1rem, leading 1.45): Primary content, descriptions, prose. The one role where line length matters: cap at 65–75ch in reading contexts.
- **Label** (medium 500, 14px / 0.875rem, leading 1): Navigation items, button labels, form labels, table headers. Compact, functional, the majority of visible text.
- **Caption** (regular 400, 12px / 0.75rem, leading 1.3): Timestamps, meta text, secondary identifiers, status strings. Supporting cast only.
- **Mono** (regular 400, 13px / 0.8125rem, leading 1.5): API keys, integration IDs, code references, technical values. The visual signal that a value is literal and copyable.

### Named Rules
**The No-Display Rule.** No editorial, serif, or variable font appears in this product. Every element — heading, label, button, data cell — uses the same system sans. Size and weight carry hierarchy; the typeface does not.

**The Three-Weight Rule.** Three weights only: 400 (body, captions), 500 (labels, buttons, active navigation), 600 (headings, titles). Weight contrast of at least 100 between adjacent hierarchy levels. Four weights or more creates noise; two weights creates flatness.

## 4. Elevation

The system uses tonal layering as the primary depth mechanism. Surfaces elevate through incremental lightness — each layer is lighter and slightly more chromatic than the one below, creating spatial hierarchy without shadows at rest. The result is a system that reads as dimensional without looking heavy.

Shadows appear only as a response to elevated state: hover on interactive surfaces, floating panels (dropdowns, modals, popovers), and the primary chrome (sidebar, navbar) that floats inside the viewport. When shadows appear on chrome surfaces, they carry an accent tint that introduces warmth.

### Shadow Vocabulary
- **Panel Shadow (Dark)** (`oklch(0 0 0 / 0.4) 0 10px 15px -3px, oklch(0 0 0 / 0.25) 0 4px 6px -2px`): Floating containers — dropdowns, modals, tooltips. Two-layer: deep spread plus tight ambient.
- **Panel Shadow (Light)** (`oklch(0 0 0 / 0.08) 0 10px 15px -3px, oklch(0 0 0 / 0.05) 0 4px 6px -2px`): Same role on light backgrounds. Substantially lighter to suit the context.
- **Chrome Shadow** (custom per surface): Sidebar and navbar. Blends Signal Teal (30–35%) with black for warmth: `color-mix(in oklch, var(--accent) 30%, oklch(0 0 0 / 0.45))` layered across multiple shadow stops.
- **Avatar Glow** (`0 1px 4px color-mix(in oklch, var(--accent) 35%, transparent)`): Tight ambient under accent-tinted avatar badges. The smallest use of accent shadow — marks identity elements as alive.

### Named Rules
**The State-Only Rule.** Shadows appear only as a response to state or structural role. A surface at rest is flat. A surface that floats (dropdown, dialog, sidebar chrome) has a shadow. No decorative box-shadows on content cards or list items at rest.

## 5. Components

### Buttons
Tactile and confident: clear boundaries, immediate feedback, no ambiguity about the action.
- **Shape:** Gently rounded (6px, `rounded-md`). Not a pill, not a square — a functional middle ground.
- **Primary:** `foreground` color background (`oklch(0.94 0.012 248)`), `background` color text — the highest-contrast inversion of the surface palette. Padding: 16px horizontal, 0 vertical (height fixed at 40px). Label weight: medium 500.
- **Hover:** Background steps from `foreground` toward `muted` — slightly lower lightness, same hue. `transition-colors 150ms ease-out`.
- **Focus:** 2px Signal Teal ring (`var(--accent)`) at 2px offset. Keyboard navigation is first-class; the focus ring is never suppressed.
- **Disabled:** 50% opacity, `cursor-not-allowed`. No alternative color treatment — opacity is the universal disabled signal.
- **Loading:** Spinner icon precedes or replaces label. Button dimensions stay fixed to prevent layout shift.
- **Ghost:** Transparent background, `foreground` text. Hover: `surface-secondary` background tint. Used for secondary actions, icon buttons, and cancel patterns — never for primary CTAs.
- **Destructive (Dialogs Only):** `bg-red-500/90` background, white text. Red is reserved for irreversible actions confirmed in dialog context; it does not appear as a general variant.

### Inputs / Fields
- **Style:** Stroke variant — `field-border` stroke, `field-bg` fill, `rounded-md` (6px), 40px height, 12px horizontal padding.
- **Focus:** Border transitions to Signal Teal (`var(--accent)`). A 1px inset ring in the same color reinforces the state. The background does not change on focus — only the edge activates.
- **Placeholder:** `field-placeholder` color (`oklch(0.52 0.014 248)`) — clearly secondary, never confused with real content.
- **Error:** `FormLabel` and `FormMessage` in `text-red-500`. The border does not change to red by default — the label and message carry the signal. Red is an output, not an input state.
- **Disabled:** 50% opacity. Matches button disabled treatment — the vocabulary is consistent.

### Cards / Containers
Cards are not the default answer. Use them when boundary is the right affordance; not because sections need containment.
- **Corner Style:** `rounded-xl` (12px) for standard containers; `rounded-2xl` (16px) for floating chrome (sidebar, navbar).
- **Background:** `surface` (`oklch(0.185 0.020 248)`). Never raw `background` — a card always floats above the floor.
- **Border:** `border border-border` on every container — structural, low contrast, defines the edge.
- **Shadow:** State-only. Content cards are flat at rest. Dialogs and dropdowns receive Panel Shadow.
- **Internal Padding:** `p-4` (16px) standard; `p-5` (20px) for dialogs and focused content panels.
- **Nested Cards:** Prohibited. A card within a card uses `surface-secondary` as background, no border, no shadow — it becomes a section, not a nested container.

### Navigation (Sidebar)
The sidebar is the system's primary chrome — floating, rounded, accent-aware. It is the most visually distinctive surface in the product.
- **Container:** `rounded-2xl` (16px), `bg-surface`, `border border-border`, floated `my-3 ml-3` off the viewport edge. Width: 220px (expanded) / 64px (collapsed). Chrome shadow with Signal Teal tint.
- **Nav Item (Default):** `text-muted`, transparent background. The resting state is quiet.
- **Nav Item (Hover):** `text-foreground`, `bg-surface-secondary`. `transition-all duration-200`. Icon scales to 107% on hover.
- **Nav Item (Active):** `text-foreground`, `color-mix(in oklch, var(--accent) 12%, transparent)` background, `inset 0 0 0 1px color-mix(in oklch, var(--accent) 22%, transparent)` inner border. The accent tint makes the active state unmistakable without being aggressive.
- **Section Header:** `text-muted`, `text-xs`, uppercase, `font-medium`. Structural label, not a nav item.

### Organization Switcher
The workspace-switcher is a signature interaction: the entry point to the product's "whole stays visible" promise.
- **Button:** Full-width, `rounded-xl`, no border at rest. Hover: `surface-secondary` tint. Text: org name in `label` weight, muted chevron.
- **Avatar Badge:** `h-8 w-8`, `rounded-lg` (8px), `color-mix(in oklch, var(--accent) 14%, transparent)` background, `inset 0 0 0 1px color-mix(in oklch, var(--accent) 24%, transparent)` border, Signal Teal text. The most accent-saturated persistent element in the sidebar.
- **Dropdown:** `rounded-xl`, `bg-surface`, `border border-border`, `p-2`. Panel Shadow. Items: `rounded-lg`, `px-2 py-2`, `text-sm`. Width: `min(260px, calc(100vw - 32px))` — respects narrow viewports.

### Dialogs / Overlays
Modals are a last resort. Exhaust inline and progressive disclosure alternatives first. When a dialog is warranted:
- **Backdrop:** `color-mix(in oklch, black 42%, transparent)` — translucent, contextualizes rather than obliterates.
- **Container:** `max-w-[420px]`, `rounded-lg` (8px), `border border-border`, `bg-surface`, `p-5`. Deep accent-tinted Panel Shadow.
- **Destructive Confirmation:** Red alert icon (`bg-red-500/10 text-red-300`), confirm button `bg-red-500/90 text-white`, cancel button `border border-border ghost`. The color escalation signals gravity.

## 6. Do's and Don'ts

### Do:
- **Do** use the tonal surface system for elevation: background → surface → surface-secondary → surface-tertiary in that order. The progression is normative; preserve it across every new surface.
- **Do** reserve Signal Teal for state: active selection, focus rings, current nav item, success indicators. Use `color-mix(in oklch, var(--accent) 12–24%, transparent)` for tinted backgrounds and inner borders. Full-saturation accent as a fill is for focus rings and icons only.
- **Do** float the sidebar and navbar: `my-3 ml-3`, `rounded-2xl`, `border border-border`, warm chrome shadow. The chrome lives inside the viewport, not flush to the edge.
- **Do** use `rounded-xl` (12px) for panels and content containers; `rounded-2xl` (16px) for chrome; `rounded-md` (6px) for interactive controls (buttons, inputs, chips).
- **Do** use skeleton states (`animate-pulse bg-surface-secondary`) for loading content in situ. Never a centered spinner in the middle of a content area.
- **Do** ensure both dark and light themes meet WCAG 2.1 AA contrast for all text and interactive elements. Both themes are production; neither is a draft.
- **Do** add accent-tinted shadows (`color-mix(in oklch, var(--accent) 30–35%, transparent)` blended with black) on structural chrome. Plain black shadows are for floating panels only.

### Don't:
- **Don't** build identical card grids: icon + heading + text, repeated at identical sizes. PRODUCT.md calls this the "generic SaaS dashboard" failure — if it looks like a Figma community template, it has failed.
- **Don't** use the hero-metric template: big number, small label, gradient accent, supporting stats. This is named explicitly in PRODUCT.md as an anti-reference. Every time it appears on a screen, the product has failed its brief.
- **Don't** use purple-to-blue gradients, neural network backgrounds, glowing orbs, particle animations, or "powered by AI" / "AI-powered" badges. Cortex demonstrates intelligence through behavior, not through labeling.
- **Don't** use `border-left` or `border-right` greater than 1px as a colored accent stripe on cards, list items, alerts, or callouts. Rewrite with full borders, background tints, or nothing.
- **Don't** use `background-clip: text` with a gradient fill (gradient text). Emphasis is weight or size; never a gradient.
- **Don't** use modal dialogs as a first thought for secondary actions. Exhaust inline and progressive disclosure alternatives before reaching for a dialog.
- **Don't** use decorative motion — entrance choreography, scroll-driven sequences, bounce or elastic easings. All transitions are 150–250ms, ease-out-quart or similar, and convey state change only.
- **Don't** use Signal Teal as a large background fill. It is a signal, not a surface. A component where Signal Teal fills more than a small icon, ring, or tinted wash has overstepped.
- **Don't** apply display fonts, serif typefaces, or editorial font pairings to UI labels, buttons, navigation items, or data. The Three-Weight Rule governs all hierarchy; the typeface does not.
- **Don't** nest cards. A container inside a container becomes a section (different background, no border, no shadow) — never a card with a card's full treatment inside it.
