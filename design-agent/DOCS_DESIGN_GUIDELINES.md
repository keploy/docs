# Keploy Docs — Repo-Specific Design Guidelines

This document captures **what this repo actually implements today** (Docusaurus theme + Tailwind usage + CSS variables). It is meant to be used *in addition to* the shared/private common design policy (loaded at runtime by the Design Review Agent).

If this document conflicts with the shared/common policy, follow the common policy unless the common policy explicitly allows repo overrides.

---

## 1) Tech stack (UI/design)

- Framework: **Docusaurus v3** (`@docusaurus/core`, preset-classic).
- UI: **React 18**.
- Styling layers:
  - **Infima/Docusaurus theme variables** (notably `--ifm-*` custom properties).
  - **Tailwind CSS v3** (JIT mode), used primarily in `src/components/**`, `src/pages/**`, and swizzled `src/theme/**`.
  - Global overrides in `src/css/custom.css`.
- Tailwind dark mode: `darkMode: ["class", '[data-theme="dark"]']` (Docusaurus uses `html[data-theme="dark"]`).
- Important constraint: Tailwind **preflight is disabled** (`corePlugins.preflight = false`). Do not assume Tailwind’s CSS reset is present.

## 2) Color system

### Primary brand (Infima variables)

Global primary is defined via Infima variables in `src/css/custom.css`:

- `--ifm-color-primary`: `#ff914d`
- Darker steps:
  - `--ifm-color-primary-dark`: `#e67643`
  - `--ifm-color-primary-darker`: `#c95919`
  - `--ifm-color-primary-darkest`: `#be2c1b`
- Lighter steps:
  - `--ifm-color-primary-light`: `#ffd0a0`
  - `--ifm-color-primary-lightest`: `#ffceb1`

When introducing new colors, prefer:

1. existing `--ifm-*` variables where applicable (links, badges, code, backgrounds)
2. Tailwind theme tokens already defined in `tailwind.config.js` (see below)
3. only then introduce new constants (and document them)

### Tailwind extended colors

Custom Tailwind colors exist in `tailwind.config.js` (`theme.extend.colors`), including:

- `offwhite`, `spaceblack`
- `keploybrightblue`, `keploybrightpurple`
- `green1/green2`, `orange1/orange2`, `gray5`, `lightteal`

Prefer these tokens over ad-hoc hex values in Tailwind-heavy components.

### Dark mode

Dark mode overrides are implemented primarily via:

- `html[data-theme="dark"]` blocks in `src/css/custom.css`
- `dark:*` utilities in Tailwind components

When adding new UI, ensure:

- dark mode text contrast is explicitly handled (don’t rely on defaults)
- link colors remain consistent (Infima link variables are overridden in dark mode)

## 3) Typography

- Primary font for docs pages is **DM Sans**, loaded via `<head>` tags in `docusaurus.config.js`, then forced broadly via CSS selectors in `src/css/custom.css`.
- Code blocks/inline code explicitly revert to a **monospace stack** in `src/css/custom.css`.
- Headings, navbar, and menu use an **Aeonik-first** stack in `src/css/custom.css`:
  - `"Aeonik", system-ui, -apple-system, ...`
- Base sizing is set on `:root`:
  - `font-size: 18px;`
  - `line-height: 1.6;`

Guidelines:

- Prefer semantic headings (`h1`/`h2`/`h3`) and avoid manually faking heading styles with generic divs.
- When using Tailwind, prefer consistent scale classes already used in the repo (e.g. `text-sm`, `text-lg`, `text-3xl`, `md:text-4xl`).

## 4) Layout and spacing

- Docs layout has a known desktop content constraint:
  - `src/theme/DocItem/styles.module.css` sets `.docItemCol { max-width: 75% }` for `min-width: 997px`.
- Sidebar width is set via `--doc-sidebar-width: 260px`.
- Many layout “hotfixes” exist in `src/css/custom.css` to force full-width navbar/main wrapper and control overflow.

Guidelines:

- Avoid adding new global `!important` layout overrides unless a Docusaurus/Infima limitation requires it.
- Prefer local component-scoped styling (`styles.module.css` or Tailwind classes) for new UI.

## 5) Component patterns

### Docusaurus theme overrides

Theme components under `src/theme/**` are swizzles/overrides. In this repo, some wrappers simply delegate to `@theme-original/*` (e.g. `Navbar`, `Footer`) and customization is mostly in CSS.

Guidelines:

- Keep swizzled components minimal; prefer composition over deep rewrites.
- When changing TOC/breadcrumb/doc meta behavior, validate both SSR and mobile/desktop (the TOC has explicit anti-FOUC handling).

### Tailwind-first UI components

Some UI components are built with Tailwind utility classes (e.g. `src/components/QuickStartTabs.js`).

Guidelines:

- Keep utility class blocks readable: prefer consistent ordering, avoid deeply nested conditional strings where possible.
- Always include dark mode variants (`dark:*`) when introducing new surfaces.

## 6) Motion, icons, and media

- Micro-interactions use short transitions (e.g. `.menu__link` etc. `transition: all 0.15s ease` in `src/css/custom.css`).
- Tailwind defines a `fade-in-down` keyframe/animation.
- Icons appear via `react-icons` and `lucide-react`.
- Tailwind typography plugin sets `img { borderRadius: 0.5rem; display: inline; }` for markdown typography.

Guidelines:

- Prefer small, consistent motion (150–300ms). Avoid distracting animations in docs.
- Ensure icons have consistent sizing (`h-* w-*`) and color treatment in dark mode.
- For images in docs, ensure they look acceptable with the global `border-radius` and in dark mode backgrounds.

## 7) Docusaurus/Infima constraints and conventions

- Tailwind preflight is disabled: do not assume normalized defaults.
- Link styles are tuned via Infima variables and custom overrides; avoid reintroducing underlines or hover effects unless consistent with the existing behavior.
- Hash-link behavior is customized in `src/theme/Heading/styles.module.css` (no `#` prefix; opacity on hover/focus).

Guidelines:

- Anchor/header changes must preserve scroll offset behavior (sticky navbar).
- Use `html[data-theme="dark"]` as the canonical selector for non-Tailwind dark mode CSS.

## 8) Anti-patterns (repo-specific)

- Adding new global selectors that target many Docusaurus internals (especially with `!important`) unless unavoidable.
- Relying on Tailwind reset behavior (it is disabled here).
- Introducing new one-off hardcoded colors when existing `--ifm-*` variables or Tailwind tokens apply.
- Adding comment-driven design “checklists” inside components instead of documenting in this file.

## 9) PR checklist (design/UI)

- Dark mode: verify colors/contrast on `html[data-theme="dark"]`.
- Typography: DM Sans is used on docs pages; code blocks remain monospace.
- Responsiveness: verify `max-width: 996px` and desktop (`min-width: 997px`) breakpoints.
- Docusaurus internals: TOC/sidebar/menu interactions still behave correctly (hover, focus, scroll).
- No accidental global `!important` overrides unless justified and scoped.

## 10) Agent policy: improvement suggestions

In Design Agent reviews for this repo:

- “Improvement suggestions” must be **non-blocking** and **max 3**.
- Suggestions must be tied to the current diff and the patterns established in this repo (Tailwind utilities, Infima variables, dark mode selectors).

