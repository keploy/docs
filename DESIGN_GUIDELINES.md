# Keploy Docs — Design Guidelines

> **Version:** 1.0.0 | **Purpose:** AI-powered PR review agent reference + human contributor handbook
> 
> This document is the single source of truth for all design decisions in the Keploy documentation website. It is intended to power an automated PR review agent that flags design inconsistencies, enforces standards, and ensures every contribution maintains a coherent, accessible, developer-first experience.

---

## Table of Contents

1. [Philosophy & Principles](#1-philosophy--principles)
2. [Design Tokens](#2-design-tokens)
   - [Color System](#21-color-system)
   - [Typography](#22-typography)
   - [Spacing](#23-spacing)
   - [Border Radius](#24-border-radius)
   - [Shadows & Elevation](#25-shadows--elevation)
   - [Transitions & Animations](#26-transitions--animations)
3. [Layout System](#3-layout-system)
4. [Component Guidelines](#4-component-guidelines)
5. [Content & Typography Rules](#5-content--typography-rules)
6. [Theming (Light / Dark Mode)](#6-theming-light--dark-mode)
7. [Interaction Design](#7-interaction-design)
8. [Accessibility Standards](#8-accessibility-standards)
9. [Performance Considerations](#9-performance-considerations)
10. [Design Best Practices & Laws of UX](#10-design-best-practices--laws-of-ux)
11. [PR Review Checklist](#11-pr-review-checklist)

---

## 1. Philosophy & Principles

### What This Site Is

The Keploy Docs site is a **developer documentation platform** — not a marketing page. Every design decision must serve **clarity, speed, and comprehension** for developers reading technical content.

### Core Design Principles

| Principle | Description |
|-----------|-------------|
| **Developer-first UX** | Prioritize code blocks, information hierarchy, and navigability over visual decoration |
| **Radical clarity** | Every element must earn its place. No decoration for decoration's sake |
| **Consistent rhythm** | Predictable spacing, sizing, and colour usage throughout — no surprises |
| **Accessible by default** | Sufficient contrast, keyboard navigation, and semantic HTML are non-negotiable |
| **Content-forward** | The reading experience is the product. Typography and whitespace are primary design tools |
| **Theme parity** | Dark and light modes must be equally polished — neither is an afterthought |

### Technology Stack

| Layer | Technology |
|-------|-----------|
| Framework | Docusaurus v3 (Classic theme) |
| Design tokens | Infima CSS variables |
| Utility CSS | Tailwind CSS 3.0.1 |
| Custom overrides | `src/css/custom.css` (3200+ lines) |
| Fonts | `DM Sans` (Google Fonts), `Aeonik` (custom), `Roboto` (local woff2) |
| Code highlighting | Prism.js — `vsLight` (light mode), `dracula` (dark mode) |

---

## 2. Design Tokens

### 2.1 Color System

All UI-facing colors should resolve through CSS custom properties or existing theme tokens.

> **Token-definition exception:** Hard-coded hex/RGB values are acceptable **only when defining design tokens or CSS custom properties** — i.e. inside `:root {}` / `[data-theme]` blocks in `src/css/custom.css`, or inside `theme.extend.colors` in `tailwind.config.js`. These are the single authoritative locations where the palette is established.
>
> **Visible-style rule:** Once a token or CSS variable exists, use that variable everywhere else. Do **not** write hard-coded hex directly in `color`, `background`, `border`, `fill`, `stroke`, or `box-shadow` properties on components, pages, or MDX wrappers. Use the appropriate `var(--ifm-...)` or Tailwind token instead.
>
> **Migration note:** Existing hard-coded hex in non-component files is acceptable only if it is defining a token. If a hard-coded hex in `custom.css` is directly styling a visible element rather than defining a variable, it should be replaced on the next touch. New direct-use hex in component or page files is always a Blocker.

#### Primary Brand Colors

| Token | Value | Usage |
|-------|-------|-------|
| `--ifm-color-primary` | `#ff914d` | Primary accent: links, active states, CTAs, sidebar active border, TOC active |
| `--ifm-color-primary-dark` | `#e67643` | Hover state for primary |
| `--ifm-color-primary-darker` | `#c95919` | Pressed/active state |
| `--ifm-color-primary-darkest` | `#be2c1b` | Deep pressed state |
| `--ifm-color-primary-light` | `#ffd0a0` | Light tint backgrounds |
| `--ifm-color-primary-lightest` | `#ffceb1` | Lightest tint |

> **Rule:** `#ff914d` (Keploy Orange) is the sole primary accent colour. Do not introduce new accent colours.

#### Semantic Text Colors

| Context | Light Mode | Dark Mode |
|---------|-----------|-----------|
| Primary body text | `#00163d` | `#f5f6f7` |
| H1 | `#00163d` | `#f9fafb` |
| H2 | `#00163d` | `#f3f4f6` |
| H3–H4 | `#0a2a5e` | `#e5e7eb` |
| H5–H6 | `#374151` | `#9ca3af` |
| Sidebar text | `#374151` | `#e5e7eb` |
| Sidebar muted | `#6b7280` | `#9ca3af` |
| Muted / secondary | `#6b7280` | `#9ca3af` |

#### Background Colors

| Context | Light Mode | Dark Mode |
|---------|-----------|-----------|
| Page background | `rgb(249, 250, 251)` | `#141414` |
| Navbar | `#ffffff` | `#141414` |
| Sidebar | `#ffffff` | `#18181b` |
| Card | `#ffffff` | `#1a1a1a` |
| Footer | `#ffffff` | `#000000` |
| Code block (`<pre>`) | `#fcfcfd` | `#1e1e21` |
| Inline code | `#fff7ed` | `rgba(251, 146, 60, 0.2)` |
| Code title bar | `#f8fafc` | `#252528` |

#### Border Colors

| Context | Light Mode | Dark Mode |
|---------|-----------|-----------|
| Navbar border | `rgba(0, 0, 0, 0.08)` | `rgba(255, 255, 255, 0.08)` |
| Sidebar border | `rgba(0, 0, 0, 0.08)` | `rgba(255, 255, 255, 0.08)` |
| Code block border | `rgba(226, 232, 240, 0.8)` | `rgba(255, 255, 255, 0.08)` |
| H2 bottom rule | `rgba(0, 0, 0, 0.08)` | — |
| Inline code border | — | `rgba(251, 146, 60, 0.4)` |

#### Semantic / Admonition Colors

| Type | Icon Gradient | Border | Background (Light) |
|------|--------------|--------|-------------------|
| `:::note` | `#6366f1 → #4f46e5` (indigo) | `rgba(99, 102, 241, 0.2)` | `rgba(99, 102, 241, 0.08)` |
| `:::tip` | `#10b981 → #059669` (green) | `rgba(16, 185, 129, 0.2)` | `rgba(16, 185, 129, 0.08)` |
| `:::warning` / `:::caution` | `#f59e0b → #d97706` (amber) | `rgba(245, 158, 11, 0.2)` | `rgba(245, 158, 11, 0.08)` |
| `:::danger` | `#ef4444 → #dc2626` (red) | `rgba(239, 68, 68, 0.2)` | `rgba(239, 68, 68, 0.08)` |
| `:::info` | `#ff914d → #ff7a2d` (orange) | `rgba(255, 145, 77, 0.2)` | `rgba(255, 145, 77, 0.08)` |

#### Tier / Feature Badge Colors

| Tier | Background | Text | Border |
|------|-----------|------|--------|
| OSS | `rgba(34, 197, 94, 0.1)` | `#16a34a` | — |
| Enterprise | `rgba(139, 92, 246, 0.1)` | `#7c3aed` | — |
| Cloud | `rgba(59, 130, 246, 0.1)` | `#3b82f6` | — |

#### Link Colors

| State | Light Mode | Dark Mode |
|-------|-----------|-----------|
| Default | `#ea580c` | `#fb923c` |
| Hover | `#ff914d` | `#ff914d` |
| Default underline | `rgba(234, 88, 12, 0.3)` | `rgba(251, 146, 60, 0.3)` |
| Hover underline | `#ff914d` | `#ff914d` |

#### Tailwind Custom Palette (Extended Brand)

These are available as Tailwind utilities and used in marketing/home components:

| Name | Value | Notes |
|------|-------|-------|
| `offwhite` | `#F2F2F2` | Alt background |
| `keployblue` | `#B2E7EA` | Light cyan, illustrations |
| `keploybrightblue` | `#127AE5` | Active blue elements |
| `keploypurple` | `#B8B4DC` | Light purple tint |
| `keploybrightpurple` | `#8F86DA` | Vibrant purple |
| `spaceblack` | `#141414` | Dark mode bg (matches `--ifm-background-color` dark) |
| `green1` | `#9EE587` | Success illustrations |
| `green2` | `#32D67B` | Success CTA |
| `orange1` | `#FFA280` | Soft orange hover |
| `orange2` | `#FF7065` | Red-orange accent |

> **Rule:** Tailwind palette colors are for marketing/homepage components only. Do NOT use them inside documentation page content.

---

### 2.2 Typography

#### Font Stack

| Role | Font | Weights | Fallback |
|------|------|---------|---------|
| Headings (H1–H4) | `"Aeonik"` | 700, 800 | `system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif` |
| Body text | `"DM Sans"` | 400, 700 | same system stack |
| Code / monospace | `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New"` | — | monospace |

> **Rule:** Do not import additional Google Fonts or local fonts without design review. The existing three-family stack (Aeonik + DM Sans + mono) is intentional and must be preserved.

#### Type Scale

| Element | Size | Weight | Line Height | Letter Spacing |
|---------|------|--------|-------------|----------------|
| Root/Base | `18px` | 400 | `1.6` | — |
| Article body | `1rem` (18px) | 400 | `1.8` | — |
| H1 | `2.5rem` (45px) | 800 | `1.5` | `-0.03em` |
| H2 | `1.75rem` (31.5px) | 700 | `1.3` | `-0.02em` |
| H3 | `1.375rem` (24.75px) | 600 | `1.35` | `-0.01em` |
| H4 | `1.125rem` (20.25px) | 600 | `1.4` | — |
| H5 | `1rem` (18px) | 600 | `1.5` | — |
| H6 | `1rem` (18px) | 600 | `1.5` | — |
| Inline code | `0.8125rem` (14.6px) | 600 | — | — |
| Code block | `0.8125rem` (14.6px) | 400 | `1.6` | — |
| Sidebar category | `0.875rem` (15.75px) | 600 | `1.5` | `0.01em` |
| Sidebar link | `0.8125rem` (14.6px) | 400 | `1.5` | — |
| TOC link | `0.75rem` (13.5px) | 400 | — | — |
| TOC active | `0.75rem` (13.5px) | 500 | — | — |
| Breadcrumb | `0.8125rem` (14.6px) | 500 | — | — |
| Badge / tag | `0.6875rem` (12.4px) | 600 | — | `0.03em` |

#### Heading Spacing

| Heading | `margin-top` | `margin-bottom` |
|---------|-------------|----------------|
| H1 | `-0.25rem` | `0.9rem` |
| H2 | `3.5rem` | `1.25rem` |
| H3 | `2.5rem` | `0.75rem` |
| H4 | `2rem` | `0.5rem` |
| H5 | `1.5rem` | `0.5rem` |
| H6 | `1.5rem` | `0.5rem` |

> **Rule:** These spacing values create clear visual hierarchy. Do not collapse or override heading margins in component-level CSS without approval.

---

### 2.3 Spacing

The spacing system is based on a **0.25rem (4px) base unit**. All spacing values should be multiples of this base.

#### Common Spacing Values

| Token | rem | px | Usage |
|-------|-----|----|-------|
| `xs` | `0.25rem` | 4px | Tight internal padding (badges) |
| `sm` | `0.5rem` | 8px | Sidebar item vertical padding, list item gaps |
| `md` | `0.75rem` | 12px | Sidebar category padding, code padding |
| `base` | `1rem` | 16px | Default block margin, card padding |
| `lg` | `1.25rem` | 20px | Code block padding, list padding |
| `xl` | `1.5rem` | 24px | Paragraph margin-bottom, section spacing |
| `2xl` | `2rem` | 32px | H4 top margin, table margin |
| `3xl` | `2.5rem` | 40px | H3 top margin |
| `4xl` | `3rem` | 48px | Content wrapper padding (L/R) |
| `5xl` | `3.5rem` | 56px | H2 top margin |

#### Container Widths

| Context | Value |
|---------|-------|
| Content reading area | `max-width: 860px` |
| Sidebar width (default) | `260px` |
| Sidebar width (large ≥1400px) | `280px` |
| Sidebar width (tablet 997–1200px) | `200px` |
| Sidebar width (medium 997–1100px) | `180px` |
| TOC width (default) | `250px` |
| TOC width (tablet) | `140–180px` |
| TOC width (large) | `200–240px` |

> **Rule:** The `860px` content max-width is a reading-width optimization (~70–80 characters per line at 18px base). Do not widen this.

---

### 2.4 Border Radius

| Element | Value |
|---------|-------|
| Admonitions / large cards | `14px` |
| Code blocks (`<pre>`) | `12px` |
| Sidebar categories | `12px` |
| Buttons, copy button, sidebar links | `8px` |
| Search box | `8px` |
| Blockquote | `0 8px 8px 0` (right-rounded only) |
| Inline code | `6px` |
| Breadcrumb links | `6px` |
| Images | `8px` |
| Tier badges | `4px` |
| TOC links | `0` (flat, no radius) |

> **Rule:** Radii follow a consistent scale: `4px → 6px → 8px → 12px → 14px`. Do not introduce intermediate values like `10px` or `16px`.

---

### 2.5 Shadows & Elevation

| Element | Value |
|---------|-------|
| Code block (light) | `0 1px 2px rgba(0, 0, 0, 0.06), 0 8px 16px rgba(0, 0, 0, 0.02)` |
| Code block (dark) | `0 10px 15px -3px rgba(0, 0, 0, 0.4)` |
| Sidebar category hover (light) | `0 2px 8px rgba(139, 92, 246, 0.08)` |
| Sidebar category hover (dark) | `0 2px 8px rgba(139, 92, 246, 0.15)` |
| Copy button hover | `0 4px 12px rgba(139, 92, 246, 0.3)` |
| Tailwind `shadow-keployblue` | `0 25px 50px -12px rgba(178, 231, 234, 0.1)` |

> **Rule:** Shadows must be subtle and purposeful. Avoid `box-shadow` values that create harsh depth on documentation content elements.

---

### 2.6 Transitions & Animations

| Use case | Value |
|----------|-------|
| Fast (hover feedback) | `all 0.15s ease` |
| Standard | `all 0.2s ease` |
| Smooth eased (sidebar) | `all 0.25s cubic-bezier(0.4, 0, 0.2, 1)` |
| Slower eased | `all 0.3s cubic-bezier(0.4, 0, 0.2, 1)` |
| Chevron rotation | `transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)` |
| Fade-in-down (banners) | `opacity + translateY(-10px) 0.5s ease-out` |
| Scale hover (Tailwind util) | `hover:scale-105` + `motion-reduce:transform-none` |

> **Rule:** All interactive elements must have `transition` defined. Always include `motion-reduce:transition-none` for Tailwind scale utilities to respect accessibility preferences.

---

## 3. Layout System

### Page Structure (3-Column)

```
┌────────────────────────────────────────────────────────────┐
│                        NAVBAR (100vw)                      │
├──────────────┬──────────────────────────────┬──────────────┤
│              │                              │              │
│   SIDEBAR    │      CONTENT AREA            │     TOC      │
│   260px      │      max-width: 860px        │    250px     │
│   (sticky)   │      padding: 0 3rem         │   (sticky)   │
│              │      line-height: 1.8        │              │
│              │                              │              │
├──────────────┴──────────────────────────────┴──────────────┤
│                  PAGINATION  (full width)                   │
├────────────────────────────────────────────────────────────┤
│                        FOOTER                              │
└────────────────────────────────────────────────────────────┘
```

### Navbar

```
height:          var(--ifm-navbar-height)  /* ~60px Docusaurus default */
background:      #ffffff (light) / #141414 (dark)
border-bottom:   1px solid rgba(0,0,0,0.08) / rgba(255,255,255,0.08)
padding:         0.5rem 0
logo height:     32px
z-index:         sticky above content
```

**Rules:**
- Navbar must have a visible border-bottom separator from the content
- Logo must always be 32px tall — do not resize
- Search is positioned in the navbar; never move it elsewhere
- Gap between right-aligned navbar items: `12px`

### Sidebar Navigation

```
width:           260px (--doc-sidebar-width)
background:      #ffffff / #18181b
border-right:    1px solid rgba(0,0,0,0.08)
position:        sticky, full height
scrollbar:       6px wide, rgba(255,145,77,0.3) thumb
```

**Rules:**
- Category items: `padding: 0.75rem 1rem`, `border-radius: 12px`
- Link items: `padding: 0.5rem 0.75rem`, `border-radius: 8px`
- Active item: `3px solid #ff914d` left accent, `rgba(255,145,77,0.1)` background
- Nesting depth ≤ 3 levels — deeper nesting requires architecture review
- Category labels use font-size `0.875rem`, weight `600`, uppercase with `letter-spacing: 0.01em`
- Nested items: `font-size: 0.8125rem`, deeper nesting: `0.75rem`

### Content Area

```
max-width:       860px
margin:          auto
padding:         0 3rem (left/right wrapper)
font-size:       1rem (18px base)
line-height:     1.8
```

**Rules:**
- Never exceed `860px` content width — this is an optimal reading-line-length constraint
- Content padding must be `3rem` on desktop, `1rem` on mobile
- Article `<main>` must not have added custom backgrounds or borders

### Table of Contents (Right TOC)

```
width:           250px
position:        sticky; top: 76px
max-height:      calc(100vh - 96px)
overflow-y:      auto
padding:         0 1.25rem 0 0.5rem
scrollbar:       4px, rgba(255,145,77,0.3)
```

**Rules:**
- TOC links: `font-size: 0.75rem`, default color `#6b7280`
- Active TOC link: `color: #ff914d`, `font-weight: 500`
- TOC border-left: default `#e5e7eb`, active `#ff914d`
- "On this page" label: `font-size: 0.95rem`, `font-weight: 600`
- TOC is hidden on screens < 996px

### Footer

```
background:      #ffffff / #000000
border-top:      1px solid rgba(0,0,0,0.08)
padding-top:     2rem
social icons:    gap: 5.5rem; size: 24px (desktop), 22px (mobile)
```

### Responsive Breakpoints

| Name | Media Query | Behaviour |
|------|------------|-----------|
| Mobile | `max-width: 996px` | Sidebar collapses to drawer, TOC hidden, content full-width |
| Tablet | `min-width: 997px` | Sidebar `200px`, TOC `140–180px` |
| Medium | `997px – 1100px` | Sidebar `180px` |
| Desktop | `min-width: 1200px` | Default sidebar `260px`, TOC `250px` |
| Large | `min-width: 1400px` | Sidebar `280px`, TOC `200–240px` |

**Rules:**
- Mobile: content padding reduces to `1rem`, code font to `0.75rem`, border-radius to `6px`
- Pagination stacks vertically on mobile (`flex-direction: column`)
- Never override Docusaurus responsive collapse behaviour for the sidebar

---

## 4. Component Guidelines

### 4.1 Headings (H1–H6)

**Purpose:** Create scannable content hierarchy for long-form technical documentation.

**Visual Rules:**

| Level | Font | Size | Weight | Color (Light) | Top Margin |
|-------|------|------|--------|--------------|------------|
| H1 | Aeonik | 2.5rem | 800 | `#00163d` | `-0.25rem` |
| H2 | Aeonik | 1.75rem | 700 | `#00163d` | `3.5rem` |
| H3 | Aeonik | 1.375rem | 600 | `#0a2a5e` | `2.5rem` |
| H4 | Aeonik | 1.125rem | 600 | `#0a2a5e` | `2rem` |
| H5 | DM Sans | 1rem | 600 | `#374151` | `1.5rem` |
| H6 | DM Sans | 1rem | 600 | `#374151` | `1.5rem` |

- H2 gets a `border-bottom: 1px solid rgba(0,0,0,0.08)` and `padding-bottom: 0.5rem`
- H1 uses gradient text clip in some hero contexts: `-webkit-background-clip: text`

**Do's:**
- ✅ Use only one H1 per page
- ✅ Follow strict hierarchy: H1 → H2 → H3 (never skip levels)
- ✅ Use infinitive verb forms: "Install Keploy", not "Installing Keploy"
- ✅ Use sentence case: "Configure your environment", not "Configure Your Environment"

**Don'ts:**
- ❌ Do not use H1 inside MDX components or admonitions
- ❌ Do not add custom color or font-size to headings inline
- ❌ Do not bold an entire heading — heading weight handles emphasis
- ❌ Do not skip heading levels (e.g., H2 → H4)

---

### 4.2 Paragraphs & Body Text

**Visual Rules:**
- Font: `DM Sans`, `1rem` (18px), weight `400`
- Line height: `1.8`
- Color: `#00163d` (light) / `#f5f6f7` (dark)
- `margin-bottom: 1.5rem`

**Do's:**
- ✅ Keep paragraphs short — 3–5 sentences max for technical content
- ✅ Use active voice

**Don'ts:**
- ❌ Do not set custom `color` on `<p>` tags
- ❌ Do not reduce `line-height` below `1.6`

---

### 4.3 Code Blocks (Fenced)

**Purpose:** Display multi-line commands, configuration snippets, and code samples.

**Visual Rules:**
```
background:     #fcfcfd (light) / #1e1e21 (dark)
border:         1px solid rgba(226,232,240,0.8) / rgba(255,255,255,0.08)
border-radius:  12px
padding:        1rem 1.25rem
font-size:      0.8125rem (14.6px)
line-height:    1.6
font-family:    monospace stack
box-shadow:     (see §2.5)
margin:         2rem 0
Prism (light):  vsLight theme
Prism (dark):   dracula theme
```

**Title bar (filename label):**
```
background:     #f8fafc / #252528
border-bottom:  1px solid #e2e8f0 / rgba(255,255,255,0.08)
color:          #475569 / #94a3b8
font-size:      0.75rem
padding:        0.5rem 1rem
```

**Copy button:**
```
position:       absolute top: 0.75rem; right: 0.75rem
opacity:        0 by default, 1 on code block hover/focus
border-radius:  8px
transition:     0.2s cubic-bezier(0.4, 0, 0.2, 1)
hover:          translateY(-2px), purple shadow
```

**Do's:**
- ✅ Always specify the language identifier after triple backticks: ` ```bash `, ` ```javascript `
- ✅ Use filename labels for config file examples: ` ```yaml title="keploy.yaml" `
- ✅ Highlight relevant lines using Docusaurus `{1,3-5}` syntax when needed

**Don'ts:**
- ❌ Do not use code blocks for single tokens — use inline code instead
- ❌ Do not add inline styles to `<pre>` or `<code>` elements
- ❌ Do not override code block background colors in page-level CSS

---

### 4.4 Inline Code

**Purpose:** Mark file names, commands, variables, and technical terms within prose.

**Visual Rules:**
```
background:     #fff7ed (light) / rgba(251,146,60,0.2) (dark)
color:          #c2410c (light) / #fb923c (dark)
border:         (dark only) 1px solid rgba(251,146,60,0.4)
padding:        0.2rem 0.4rem
border-radius:  6px
font-size:      0.8125rem
font-weight:    600
```

**Do's:**
- ✅ Use for: CLI commands, file paths, env variable names, function/method names, flag names
- ✅ Consistent: wrap all code-like tokens, not just some

**Don'ts:**
- ❌ Do not use for full sentences or descriptions
- ❌ Do not override inline code color — it uses semantic orange to distinguish from link orange

---

### 4.5 Admonitions / Callout Boxes

**Purpose:** Surface important notes, tips, warnings, dangers, and info contextually.

**5 Types and When to Use:**

| Type | Keyword | Use For |
|------|---------|---------|
| `:::note` | Note | Supplementary context, caveats |
| `:::tip` | Tip | Best practices, helpful shortcuts |
| `:::warning` / `:::caution` | Warning | Potential issues, gotchas |
| `:::danger` | Danger | Destructive actions, data loss risks |
| `:::info` | Info | Keploy-specific callouts, feature notes |

> **Admonition syntax note:** Use the Docusaurus `:::type` syntax for all **new** documentation. Legacy files (primarily under `versioned_docs/`) may contain GitHub-style admonitions (`> [!NOTE]`, `> [!TIP]`) — these are tolerated in versioned content but should not be used in new pages under `docs/`. Migrate to `:::type` syntax when touching those files.

**Visual Rules:**
```
border-radius:  14px
border:         1px solid [type-color at 20% opacity]
background:     gradient 135deg, [type-color at 8% → 2%]
left-accent:    4px vertical bar with type gradient
padding:        1rem 1.25rem
margin:         1.5rem 0
heading size:   0.875rem, weight 700, uppercase, letter-spacing 0.04em
content size:   0.9375rem, line-height 1.7
```

**Do's:**
- ✅ Use the correct semantic type — don't use `:::warning` as a general note
- ✅ Keep admonition content concise (2–4 lines)
- ✅ Use the built-in Docusaurus `:::type` syntax — never a custom `<div>` for callouts

**Don'ts:**
- ❌ Do not nest admonitions
- ❌ Do not create custom callout divs with inline styles
- ❌ Do not use `:::danger` for non-destructive warnings

---

### 4.6 Links

**Visual Rules:**
```
color:              #ea580c (light) / #fb923c (dark)
border-bottom:      1px solid rgba(234,88,12,0.3)
text-decoration:    none
hover color:        #ff914d
hover border:       1px solid #ff914d
transition:         all 0.15s ease
```

**Do's:**
- ✅ Use descriptive anchor text: "See the [configuration guide](...)" not "click [here](...)"
- ✅ Distinguish internal links (relative) from external links

**Don'ts:**
- ❌ Do not use raw URLs as link text
- ❌ Do not add `color` or `text-decoration` overrides to anchor tags
- ❌ Do not style links as buttons unless they are truly CTAs

---

### 4.7 Blockquotes

**Purpose:** Highlight important quotes, key statements, or referenced excerpts.

```
border-left:    4px solid #8b5cf6
background:     rgba(139, 92, 246, 0.05) / rgba(139,92,246,0.1) dark
border-radius:  0 8px 8px 0
padding:        1rem 1.5rem
margin:         1.5rem 0
color:          #000000 (light) / #eeeeee (dark)
```

> **Rule:** Blockquotes use **purple** (`#8b5cf6`) as their accent — this is intentional and distinct from orange (interactive) and semantic (admonition) colors.

---

### 4.8 Tables

```
width:          100%
cell padding:   12px 18px
line-height:    1.6
margin-bottom:  2rem
```

**Do's:**
- ✅ Always include a header row
- ✅ Keep column counts to ≤ 6 for readability on mobile
- ✅ Use tables for comparison/reference data only

**Don'ts:**
- ❌ Do not use tables for layout purposes
- ❌ Do not add inline `width` attributes to `<td>` or `<th>`

---

### 4.9 Sidebar Navigation

(See Layout §3 for dimensions. This section covers interaction states.)

**States:**

| State | Background | Left Border | Text Color |
|-------|-----------|-------------|------------|
| Default | transparent | none | `#374151` / `#e5e7eb` |
| Hover | `rgba(255,145,77,0.06)` | none | `#374151` |
| Active/Current | `rgba(255,145,77,0.1)` | `3px solid #ff914d` | `#ff914d`, weight 600 |
| Category | transparent | none | `#ff914d`, weight 600 |

**Do's:**
- ✅ Active page must always be visually distinguished with the orange left border
- ✅ Categories must be visually heavier than items (larger font, weight 600)

**Don'ts:**
- ❌ Do not add icons to sidebar items unless following existing badge patterns
- ❌ Do not change the sidebar background — it intentionally contrasts with the page background

---

### 4.10 Table of Contents (TOC)

**States:**

| State | Color | Weight |
|-------|-------|--------|
| Default link | `#6b7280` | 400 |
| Hover | `#ff914d` | 400 |
| Active (in-viewport heading) | `#ff914d` | 500 |

- Border-left: default `#e5e7eb`, active `#ff914d`
- "On this page" label: `0.95rem`, weight `600`
- TOC hides at `< 996px`

---

### 4.11 Tier / Feature Badges (OSS / Enterprise / Cloud)

**Purpose:** Indicate feature availability by tier in an inline context.

```
display:        inline-flex
padding:        0.125rem 0.5rem
font-size:      0.6875rem
font-weight:    600
border-radius:  4px
text-transform: uppercase
letter-spacing: 0.03em
vertical-align: middle
```

**Callout box variants** (block-level, not inline):
```
padding:        1rem 1.25rem
margin:         1.5rem 0
border-radius:  8px
border:         1px solid [tier-color at 20%]
```

**Do's:**
- ✅ Use inline badge in headings/sentences to mark feature availability
- ✅ Use block callout at the top of a page/section when an entire page is tier-gated

**Don'ts:**
- ❌ Do not use custom tier colors — only the three defined (green/purple/blue)
- ❌ Do not create custom badge components

---

### 4.12 Breadcrumbs

```
position:       sticky; top: var(--ifm-navbar-height)
background:     #ffffff (light), z-index: 10
font-size:      0.8125rem
font-weight:    500
separator:      › (CSS content), color #9ca3af
link color:     #6b7280
link padding:   0.375rem 0.5rem
link radius:    6px
```

---

### 4.13 Pagination (Prev / Next)

```
border-top:     2.5px solid var(--ifm-color-emphasis-200)
padding-top:    2rem
margin:         2rem 0 3rem
card border:    1.5px solid
card radius:    6px
card padding:   1rem
label size:     0.9rem, weight 700
title size:     0.85rem, weight 600
```

**Do's:**
- ✅ Always include both previous and next on interior pages
- ✅ Pagination card labels must be "Previous" and "Next"

---

### 4.14 Search UI

- Positioned in the navbar
- Uses Docusaurus Algolia DocSearch or built-in search
- Search input: `rounded-lg px-3 py-2` (Tailwind)

> **Rule:** Do not replace or restyle the search component.

---

### 4.15 Announcement Bar

```
background:     repeating-linear-gradient with rgba(255,145,77,0.15) at 10px steps
text:           #00163d (light) / #f3f4f6 (dark)
link:           #c45a1a (light) / #ff914d (dark)
border-bottom:  1px solid rgba(255,145,77,0.2)
```

---

## 5. Content & Typography Rules

### Heading Hierarchy Consistency

1. Every page **must** begin with exactly one `H1` (the page title)
2. Sections use `H2`
3. Sub-sections use `H3`
4. Paragraphs within sub-sections may use `H4` for granular topics
5. `H5`/`H6` should be used sparingly — consider restructuring if needed
6. **Never skip heading levels** (e.g., H2 → H4)

### Writing Style (from `STYLE.md`)

- **Primary guide:** Google Developer Documentation Style Guide
- **Secondary guide:** Microsoft Writing Style Guide
- **Voice:** Active voice preferred
- **Capitalization:** Sentence case for headings, capitalize Keploy-specific proper nouns
- **Verb form for tasks:** Infinitive ("Install", "Configure"), not gerund ("Installing", "Configuring")
- **Numeric ranges:** En-dash (–), not hyphen (-)
- **Code in prose:** Always wrap in backticks — filenames, commands, flags, paths, variable names

### Paragraph & Content Rules

- Paragraph `margin-bottom: 1.5rem` — never collapse this
- Max line length enforced by `860px` content width — do not add inline `max-width` to paragraphs
- `line-height: 1.8` for article body — minimum `1.6` anywhere
- List `margin-bottom: 0.5rem` per item, `1.5rem` for the list block
- List `padding-left: 1.5rem`

### Emphasis Rules

| Emphasis | Markdown | Use For |
|----------|----------|---------|
| **Bold** | `**text**` | Key terms, critical warnings |
| *Italic* | `*text*` | Titles, technical terms being introduced |
| `inline code` | `` `text` `` | All code-like tokens |
| ~~strikethrough~~ | `~~text~~` | Deprecated items only |

> **Rule:** Do not bold entire sentences. Bold is for **keywords**, not phrases.

### Scannability

- Use bullet lists for 3+ parallel items
- Use numbered lists for sequential steps only
- Use `:::tip` admonitions for pro-tips that can be skipped
- Use `:::note` for important caveats at the end of a section
- Avoid walls of prose — break long explanations with sub-headings

### Code vs Text Balance

- Code samples should appear **within 2 paragraphs** of their introduction
- Never show code without a sentence explaining what it does
- Keep code blocks to ≤ 30 lines unless showing a full file — use `// ...` to truncate

---

## 6. Theming (Light / Dark Mode)

### Theme Architecture

- Base: Docusaurus `html[data-theme="light"]` / `html[data-theme="dark"]` selectors
- User toggle: Enabled (navbar theme switch)
- Default: Light mode

### Key Theme Variable Pairs

| Variable | Light | Dark |
|----------|-------|------|
| `--ifm-background-color` | `rgb(249, 250, 251)` | `#141414` |
| `--ifm-color` | `#00163d` | `#f5f6f7` |
| `--sidebar-bg` | `#ffffff` | `#18181b` |
| `--ifm-card-background-color` | `#ffffff` | `#1a1a1a` |
| `--ifm-footer-background-color` | `#ffffff` | `#000000` |
| `--ifm-code-background` | `#fff7ed` | `rgba(251, 146, 60, 0.2)` |
| `--ifm-code-color` | `#c2410c` | `#fb923c` |

### Theme Rules

1. **Every new CSS rule that sets color, background, or border must have a dark mode counterpart** inside `html[data-theme="dark"]`
2. Hard-coded hex/RGB values are allowed **only when defining design tokens** (e.g. inside `:root {}` / `[data-theme]` blocks in `custom.css`, or in `tailwind.config.js` theme tokens). When styling visible elements in components or pages, always use CSS variables — never literal color values.
3. Contrast ratios must meet WCAG AA minimum (4.5:1 for body text, 3:1 for large text) in both modes
4. The primary orange `#ff914d` is the **same in both modes** — it has sufficient contrast in both

### Contrast Reference

| Pair | Ratio | Standard |
|------|-------|---------|
| `#00163d` on `rgb(249,250,251)` (light body) | ~14:1 | AAA ✅ |
| `#f5f6f7` on `#141414` (dark body) | ~13:1 | AAA ✅ |
| `#ff914d` on `#141414` (orange on dark bg) | ~5.6:1 | AA ✅ |
| `#ea580c` on `rgb(249,250,251)` (links light) | ~4.8:1 | AA ✅ |
| `#fb923c` on `#141414` (links dark) | ~5.2:1 | AA ✅ |
| `#c2410c` on `#fff7ed` (inline code) | ~5.1:1 | AA ✅ |

---

## 7. Interaction Design

### Hover States

| Element | Hover Behaviour |
|---------|----------------|
| Links | Color → `#ff914d`, border-bottom → `#ff914d` |
| Sidebar items | Background → `rgba(255,145,77,0.06)` |
| Sidebar categories | Background → `rgba(255,145,77,0.08)` + subtle shadow |
| Code block | Copy button fades in (opacity 0 → 1) |
| Copy button | `translateY(-2px)` + purple glow shadow |
| Buttons | `opacity-90` |
| TOC links | Color → `#ff914d` |

### Active / Selected States

| Element | Active Behaviour |
|---------|-----------------|
| Sidebar current page | `3px solid #ff914d` left border, bg tint, weight 600 |
| TOC current section | `color: #ff914d`, `font-weight: 500` |
| Navbar link | Underline or color indicator via Docusaurus default |

### Focus States (Accessibility)

- All interactive elements must have visible `:focus-visible` outlines
- Focus ring: `ring-2 ring-[--ifm-color-primary] ring-offset-2` (Tailwind pattern)
- Do not use `outline: none` without providing a custom focus indicator
- Focus ring color: `#ff914d` (matches primary)

### Transition Principles

1. All interactive state changes must use CSS transitions — no instant jumps
2. Fast feedback (`0.15s`) for hover on links/buttons
3. Smooth easing (`cubic-bezier(0.4, 0, 0.2, 1)`) for structural changes like sidebar expand
4. Respect `prefers-reduced-motion` — always include `motion-reduce:transition-none`

---

## 8. Accessibility Standards

### Color Contrast

- **Body text:** WCAG AAA (≥ 7:1) in both modes
- **Link text:** WCAG AA (≥ 4.5:1) in both modes
- **Interactive components:** WCAG AA minimum (3:1 for large text)
- **Never** rely on color alone to convey information — admonitions use icons + color

### Keyboard Navigation

- All sidebar items, TOC links, navbar items must be reachable via `Tab`
- Sidebar collapse/expand must work via `Enter`/`Space`
- Code copy button must be keyboard-accessible (it becomes visible on focus)
- Modal/drawer elements must implement focus trapping

### Semantic HTML Rules

1. Use proper heading levels — never use heading tags for visual sizing
2. Use `<nav>` for the sidebar and TOC
3. Use `<article>` for the content area (Docusaurus does this by default)
4. Use `<code>` for inline code, `<pre><code>` for blocks
5. All images must have `alt` text
6. Decorative images must have `alt=""`
7. Interactive elements must have `aria-label` if their text label is not descriptive

### ARIA Roles

- Sidebar: `role="navigation"` + `aria-label="Docs sidebar"`
- TOC: `role="navigation"` + `aria-label="Table of contents"`
- Admonitions: `role="note"` (Docusaurus default)
- Copy button: `aria-label="Copy code to clipboard"` + state announcement

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  * {
    transition: none !important;
    animation: none !important;
  }
}
```
All custom animations/transitions must be covered by this media query.

---

## 9. Performance Considerations

### Font Loading

- `DM Sans` loaded via Google Fonts with `display=swap`
- `Aeonik` loaded as custom `@font-face` (local)
- `Roboto` loaded as local `woff2` — weights 300, 400, 700 only
- **Rule:** Do not add new remote font imports without performance impact analysis

### Code Block Rendering

- Prism.js is the syntax highlighter — do not add a second highlighter (e.g., Shiki, highlight.js)
- Line numbers are rendered via Docusaurus — do not implement custom line number rendering
- Copy button uses lazy opacity transition to avoid layout during render

### Layout Stability (CLS Prevention)

- Font `display: swap` prevents invisible text but may cause layout shift — mitigate by matching font metrics between fallback and loaded font
- Avoid setting `height` on elements that depend on content — use `min-height`
- Code block and image containers should have stable dimensions before content loads

### Rendering Strategy

- Docusaurus uses **SSG** (static site generation) by default
- All documentation pages are pre-rendered at build time
- Interactive components (search, theme toggle) hydrate client-side
- **Rule:** Do not add client-only rendering to content-critical elements — they must be SSR-compatible

### Image Optimization

- Use Docusaurus `<img>` or standard Markdown image syntax
- Prefer `.webp` or `.avif` over `.png`/`.jpg` for screenshots
- Always set `width` and `height` attributes on images to prevent CLS

---

## 10. Design Best Practices & Laws of UX

### Laws of UX Applied to Keploy Docs

#### Hick's Law — Reduce decision complexity
> The time to make a decision increases with the number and complexity of choices.

**Application:**
- Sidebar navigation must be organized into clear, mutually exclusive categories
- Do not present more than 7–10 items per sidebar category before grouping further
- Search results should show the most relevant 5–8 results prominently

#### Fitts's Law — Make targets easy to hit
> The time to acquire a target is a function of distance and size.

**Application:**
- Sidebar items have `padding: 0.5rem 0.75rem` — sufficient click target size
- Code copy button must be at least `32×32px` — do not shrink it
- Navigation links must have ample padding, not rely on text width only

#### Miller's Law — Chunk information
> People can hold only ~7 (±2) items in working memory.

**Application:**
- Break long pages into H2 sections of ≤ 7 major concepts
- TOC should ideally have 5–10 entries — if more, the page should be split
- Step-by-step guides should chunk steps into numbered lists, not paragraphs

#### Jakob's Law — Use familiar patterns
> Users spend most of their time on other sites, so they prefer familiar design patterns.

**Application:**
- Docs sidebar on the left, TOC on the right — standard developer docs convention
- Code blocks with a copy button in the top-right corner
- Orange primary color is a distinct brand choice but applied consistently so users learn it

#### Law of Proximity — Group related content
> Objects near each other are perceived as related.

**Application:**
- Code blocks must immediately follow the prose that references them
- Admonitions must be adjacent to the content they annotate
- Related page links in pagination must be visually grouped

#### Law of Similarity — Consistent visual language
> Items that look alike are perceived as having the same function.

**Application:**
- All clickable items use the same orange hover — users learn the pattern
- All code-like text uses the same inline code style
- All warning-level information uses the amber admonition — never deviate

#### Aesthetic-Usability Effect — Design affects perceived usability
> Users perceive aesthetically pleasing design as easier to use.

**Application:**
- Clean whitespace and generous line-height make content feel approachable
- Consistent spacing rhythm reduces cognitive friction
- Dark mode parity signals quality and completeness

#### Law of Prägnanz — Simplicity
> People interpret ambiguous images in the simplest way possible.

**Application:**
- Use standard Markdown elements — avoid custom MDX components for routine content
- Avoid decorative elements that don't communicate meaning
- Prefer prose + code blocks over complex diagrams when both convey the same information

### Documentation-Specific UX Principles

1. **Progressive disclosure:** Put the essential information first. Advanced details in expandable sections or separate sub-pages.
2. **Copy-paste friendly:** Every command shown must be in a code block with a copy button — never in plain prose.
3. **Version awareness:** If content is version-specific, indicate the version clearly at the top.
4. **Scannable before readable:** Users scan before they read. Headings, code blocks, and callouts are the first-pass.
5. **Cross-reference liberally:** Link to related concepts. Developers often arrive on the wrong page first.
6. **Error-first help:** For CLI/API docs, show what error a command produces before showing how to fix it — this helps users self-identify their situation.

### Cognitive Load Reduction

| Technique | How It's Applied |
|-----------|-----------------|
| Visual chunking | H2/H3 sections, numbered steps |
| Redundancy reduction | One callout style per semantic type, consistent link treatment |
| Progressive disclosure | Collapsible sidebar categories, TOC for in-page navigation |
| Spatial memory | 3-column layout is consistent on every page — users don't re-orient |
| Colour-coding | Each admonition type has a unique color — users recognise severity at a glance |
| White space | Generous margins prevent visual crowding |

---

## 11. PR Review Checklist

> This section is the core of the AI-powered PR review agent. Each rule is binary (pass/fail) or measurable.

---

### 🎨 A. Color Compliance

| # | Rule | Severity |
|---|------|----------|
| A1 | No hard-coded hex values in **component files** (`src/components/`, JSX/TSX) — use CSS variables. Hard-coded hex in `tailwind.config.js` / `custom.css` (token-definition files) is allowed. | ❌ Blocker |
| A2 | Primary accent color is `#ff914d` — no alternative primary introduced | ❌ Blocker |
| A3 | Admonition colors match defined semantic palette (indigo/green/amber/red/orange) | ❌ Blocker |
| A4 | Tier badge colors are only green (`#16a34a`), purple (`#7c3aed`), blue (`#3b82f6`) | ❌ Blocker |
| A5 | Link color is `#ea580c` (light) / `#fb923c` (dark) — not customized per-page | ❌ Blocker |
| A6 | Every color rule has a `html[data-theme="dark"]` counterpart | ⚠️ Major |
| A7 | Text-on-background contrast meets WCAG AA (4.5:1 for body, 3:1 for large) | ⚠️ Major |
| A8 | Blockquotes use purple (`#8b5cf6`) left border — not orange or custom | ℹ️ Minor |
| A9 | Tailwind palette colors (`keployblue`, `keploypurple`, etc.) are NOT used in doc content pages | ⚠️ Major |

---

### 🔤 B. Typography Compliance

| # | Rule | Severity |
|---|------|----------|
| B1 | Headings use `Aeonik` font — no override with `DM Sans` or system fonts | ❌ Blocker |
| B2 | Body text uses `DM Sans` — no override with Aeonik or serif fonts | ❌ Blocker |
| B3 | No new `@import` or `@font-face` declarations for additional fonts | ❌ Blocker |
| B4 | Root font-size remains `18px` — not overridden | ❌ Blocker |
| B5 | H1 is `2.5rem/800`, H2 is `1.75rem/700`, H3 is `1.375rem/600` — within ±0.125rem | ⚠️ Major |
| B6 | Article `line-height` is `1.8` — not reduced below `1.6` | ⚠️ Major |
| B7 | Code blocks and inline code use the monospace font stack — not a custom font | ❌ Blocker |
| B8 | No inline `font-size` or `font-family` on heading tags | ❌ Blocker |
| B9 | Letter spacing on H1 is `-0.03em`, H2 is `-0.02em` — not overridden | ℹ️ Minor |

---

### 📐 C. Spacing & Layout

| # | Rule | Severity |
|---|------|----------|
| C1 | Content area `max-width` is `860px` — not widened | ❌ Blocker |
| C2 | Content wrapper padding is `3rem` (desktop) / `1rem` (mobile) — not reduced | ⚠️ Major |
| C3 | H2 top margin is `3.5rem`, H3 is `2.5rem` — not collapsed | ⚠️ Major |
| C4 | Paragraph `margin-bottom` is `1.5rem` — not reduced | ⚠️ Major |
| C5 | Code block `margin` is `2rem 0` — not removed | ℹ️ Minor |
| C6 | Sidebar width is `260px` (default) — not overridden without responsive justification | ⚠️ Major |
| C7 | No custom `width` or `max-width` added to `<article>` or `.markdown` | ❌ Blocker |
| C8 | Spacing values are multiples of `0.25rem` (4px base) — no arbitrary values like `13px` | ℹ️ Minor |
| C9 | TOC width remains `250px` — not overridden | ℹ️ Minor |
| C10 | Border radius values are from the approved scale: `4, 6, 8, 12, 14px` | ℹ️ Minor |

---

### 🧩 D. Component Correctness

| # | Rule | Severity |
|---|------|----------|
| D1 | Callouts use `:::type` Docusaurus syntax — not custom `<div>` elements | ❌ Blocker |
| D2 | Correct admonition type is used semantically (danger only for destructive, etc.) | ⚠️ Major |
| D3 | Code blocks have a language identifier (e.g., ` ```bash `) | ⚠️ Major |
| D4 | No inline `style` attribute on `<pre>`, `<code>`, or heading elements | ❌ Blocker |
| D5 | Tier badges use the defined `<span>` component — not custom styled `<div>` | ⚠️ Major |
| D6 | Tables have a header row (`<th>` elements) | ⚠️ Major |
| D7 | Images have `alt` text; decorative images have `alt=""` | ⚠️ Major |
| D8 | Pagination is present on all interior doc pages | ℹ️ Minor |
| D9 | No Tailwind marketing-palette classes (`keployblue`, `keploypurple`) in doc content | ⚠️ Major |
| D10 | Custom components added in the PR re-use existing design tokens (no new colors/fonts) | ❌ Blocker |

---

### 📝 E. Content & Writing

| # | Rule | Severity |
|---|------|----------|
| E1 | Each page has exactly one `H1` | ❌ Blocker |
| E2 | Heading hierarchy is strictly sequential (no skipped levels) | ⚠️ Major |
| E3 | Headings use sentence case — not Title Case | ⚠️ Major |
| E4 | Task headings use infinitive form ("Install", not "Installing") | ℹ️ Minor |
| E5 | CLI commands, file paths, env vars, and flags are in inline code | ⚠️ Major |
| E6 | Code blocks are preceded by a prose explanation | ℹ️ Minor |
| E7 | Active voice is used — passive voice flagged for review | ℹ️ Minor |
| E8 | No raw URLs used as link anchor text | ℹ️ Minor |
| E9 | Bold is used for key terms only — not entire sentences | ℹ️ Minor |
| E10 | Numeric ranges use en-dash (–) not hyphen (-) | ℹ️ Minor |

---

### ♿ F. Accessibility

| # | Rule | Severity |
|---|------|----------|
| F1 | No `outline: none` without a custom `:focus-visible` replacement | ❌ Blocker |
| F2 | All interactive elements are keyboard-accessible | ❌ Blocker |
| F3 | Color is not the sole conveyor of meaning (icons/labels accompany color) | ⚠️ Major |
| F4 | All images have `alt` text | ⚠️ Major |
| F5 | Semantic HTML is used (no `<div>` for headings, no `<span>` for paragraphs) | ⚠️ Major |
| F6 | `prefers-reduced-motion` is respected for all custom animations | ⚠️ Major |
| F7 | New interactive components have `aria-label` where visible text is absent | ⚠️ Major |
| F8 | WCAG AA contrast maintained for all new text/background combinations | ❌ Blocker |

---

### 📱 G. Responsiveness

| # | Rule | Severity |
|---|------|----------|
| G1 | New CSS includes mobile styles (`max-width: 996px`) | ⚠️ Major |
| G2 | No fixed `width` values on content elements (use `max-width`) | ❌ Blocker |
| G3 | Code blocks don't overflow horizontally on mobile — `overflow-x: auto` applied | ⚠️ Major |
| G4 | Tables are scrollable on mobile | ⚠️ Major |
| G5 | Images use `max-width: 100%` — not fixed widths that break mobile | ⚠️ Major |
| G6 | TOC is hidden on mobile — not forced visible | ℹ️ Minor |

---

### 🌓 H. Theme / Dark Mode

| # | Rule | Severity |
|---|------|----------|
| H1 | All new color rules have a `html[data-theme="dark"]` counterpart | ❌ Blocker |
| H2 | Dark mode backgrounds use `#141414` (page), `#18181b` (sidebar), `#1a1a1a` (card) — no custom darks | ⚠️ Major |
| H3 | Dark mode text uses `#f5f6f7` — not pure white `#ffffff` | ℹ️ Minor |
| H4 | Dark mode link color is `#fb923c` — not changed | ⚠️ Major |
| H5 | Code blocks in dark mode use `#1e1e21` background — not pure black | ℹ️ Minor |
| H6 | New components tested in both light and dark mode before PR submission | ❌ Blocker |

---

### ⚡ I. Performance

| # | Rule | Severity |
|---|------|----------|
| I1 | No new remote font imports (Google Fonts, etc.) without performance justification | ❌ Blocker |
| I2 | No second syntax highlighting library added (only Prism.js) | ❌ Blocker |
| I3 | Images have explicit `width` and `height` to prevent CLS | ⚠️ Major |
| I4 | New client-side components are wrapped in `BrowserOnly` if they cannot be SSR-rendered | ⚠️ Major |
| I5 | No synchronous render-blocking scripts added | ❌ Blocker |

---

### 🔁 J. Consistency & Reuse

| # | Rule | Severity |
|---|------|----------|
| J1 | No duplicate component created when an existing one serves the purpose | ❌ Blocker |
| J2 | Custom MDX components are used consistently — not one-off inline divs | ⚠️ Major |
| J3 | New CSS classes follow the existing naming convention (BEM or Infima-style) | ℹ️ Minor |
| J4 | No `!important` declarations added to CSS | ⚠️ Major |
| J5 | No Tailwind classes mixed directly into MDX/Markdown prose elements | ⚠️ Major |

---

### Severity Key

| Icon | Level | Meaning |
|------|-------|---------|
| ❌ | **Blocker** | Must be fixed before merge. Directly violates design system or breaks accessibility/theming. |
| ⚠️ | **Major** | Should be fixed before merge. Degrades design consistency or UX quality. |
| ℹ️ | **Minor** | Nice to fix. Low-impact deviation; acceptable in edge cases with justification. |

---

## Appendix: Quick Reference

### Approved Colors at a Glance

```
Primary orange:    #ff914d
Orange hover:      #e67643
Text (light):      #00163d
Text (dark):       #f5f6f7
Page BG (light):   rgb(249, 250, 251)
Page BG (dark):    #141414
Sidebar (dark):    #18181b
Card (dark):       #1a1a1a
Link (light):      #ea580c
Link (dark):       #fb923c
Note:              #6366f1
Tip:               #10b981
Warning:           #f59e0b
Danger:            #ef4444
Info:              #ff914d
Blockquote:        #8b5cf6
OSS badge:         #16a34a
Enterprise badge:  #7c3aed
Cloud badge:       #3b82f6
```

### Approved Font Sizes

```
Root:        18px
Body:        1rem
H1:          2.5rem
H2:          1.75rem
H3:          1.375rem
H4:          1.125rem
H5/H6:       1rem
Sidebar:     0.875rem / 0.8125rem
TOC:         0.75rem
Code:        0.8125rem
Badge:       0.6875rem
```

### Approved Spacing

```
Paragraph:   mb 1.5rem
H2:          mt 3.5rem
H3:          mt 2.5rem
H4:          mt 2rem
Code block:  m 2rem 0
Content pad: 3rem (desktop), 1rem (mobile)
Max width:   860px (content), 260px (sidebar), 250px (TOC)
```

### Approved Border Radii

```
Cards/admonitions: 14px
Code blocks:       12px
Sidebar category:  12px
Buttons/items:     8px
Blockquote:        0 8px 8px 0
Inline code:       6px
Breadcrumbs:       6px
Badges:            4px
```

---
