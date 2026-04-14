# `keploy/docs` repo-specific design guidance

This file contains only design-system rules and review guidance that are specific to `keploy/docs`, beyond the shared Keploy commons.

## Stack and styling model

- [explicit] This repo is a Docusaurus documentation site.
  Evidence: `package.json` includes `@docusaurus/core`, `@docusaurus/preset-classic`, and `docusaurus.config.js`; `README.md` and `CONTRIBUTING.md` both describe the site as Docusaurus-based.

- [explicit] Styling is split across Tailwind CSS 3, Docusaurus/Infima variables, global CSS in `src/css/custom.css`, CSS Modules in `src/theme/*/*.module.css`, and local `<style>` blocks inside React components.
  Evidence: `tailwind.config.js`, `src/css/custom.css`, `src/theme/Heading/styles.module.css`, `src/theme/DocItem/styles.module.css`, `src/theme/DocBreadcrumbs/styles.module.css`, and component source such as `DocHeaderChips.js` and `QuickStartFilter.js`.

- [explicit] Tailwind preflight is disabled because the repo relies on Docusaurus base styles.
  Evidence: `tailwind.config.js`.

- [explicit] Tailwind Typography is extended for docs prose.
  Evidence: `tailwind.config.js`.

## Docs-specific tokens and theme variables

- [explicit] The docs repo defines Docusaurus theme variables that should be treated as the primary token layer for docs-shell surfaces:
  - `--ifm-color-primary: #ff914d`
  - `--ifm-color-primary-dark: #e67643`
  - `--ifm-color-primary-darker: #c95919`
  - `--ifm-color-primary-darkest: #be2c1b`
  - `--ifm-color-primary-light: #ffd0a0`
  - `--ifm-color-primary-lightest: #ffceb1`
  - `--ifm-color: #00163d` in light mode and `#f5f6f7` in dark mode
  - `--ifm-background-color: rgb(249, 250, 251)` in light mode and `#141414` in dark mode
  - `--ifm-card-background-color: #ffffff` in light mode and `#1a1a1a` in dark mode
  - `--ifm-card-shadow-color: rgba(0, 0, 0, 0.2)` in light mode and `rgba(255, 255, 255, 0.2)` in dark mode
  Evidence: `src/css/custom.css`.

- [explicit] Inline code gets repo-specific docs styling:
  - light background `#fff7ed`
  - light text `#c2410c`
  - radius `6px`
  Evidence: `src/css/custom.css`.

- [explicit] This repo also extends Tailwind with docs-local colors not part of the shared commons:
  - `offwhite #F2F2F2`
  - `keployblue #B2E7EA`
  - `keploybrightblue #127AE5`
  - `keploypurple #B8B4DC`
  - `keploybrightpurple #8F86DA`
  - `spaceblack #141414`
  - `green1 #9EE587`
  - `green2 #32D67B`
  - `orange1 #FFA280`
  - `orange2 #FF7065`
  - `gray5 #E0E0E0`
  - `lightgray rgba(242,242,242,0.5)`
  - `lightteal #C7EDEF`
  Evidence: `tailwind.config.js`.

- [explicit] Tailwind also defines repo-local sizing and motion extensions:
  - `fontSize`: `17`, `60`, `144`
  - `lineHeight`: `25`, `36`, `48`, `60`, `72`, `144`
  - widths and heights: `200`, `300`, `700`, `800`, `3/1`
  - `maxWidth.700`
  - `gridTemplateColumns.usecases`
  - `transitionDelay.3000`
  - `animation.fade-in-down`
  Evidence: `tailwind.config.js`.

## Typography and prose behavior

- [explicit] Docs pages forcibly apply `"DM Sans", sans-serif` across docs UI and markdown content.
  Evidence: `src/css/custom.css`.

- [explicit] Code blocks and inline code are forcibly reset to a monospace stack.
  Evidence: `src/css/custom.css`.

- [explicit] Headings, the menu, and the navbar use an `Aeonik`-first font stack, separate from docs body text.
  Evidence: `src/css/custom.css`.

- [inferred] Reviewers should treat the body/heading font split as an intentional docs-specific override in this repo, even though the font system is internally inconsistent and `Aeonik` is not loaded in the repo.
  Evidence: `src/css/custom.css`, `docusaurus.config.js`.

- [explicit] The docs markdown container is wrapped with:
  - `prose`
  - `md:prose-md`
  - `lg:prose-lg`
  - `mx-auto my-12 max-w-full px-2 md:px-6`
  Evidence: `src/theme/DocItem/index.js`.

- [explicit] Tailwind Typography overrides docs prose to use Docusaurus variables for text and headings, orange link color, rounded inline code, and rounded inline images.
  Evidence: `tailwind.config.js`.

- [explicit] Docs H1 headings receive a gradient text treatment in the docs shell.
  Evidence: `src/css/custom.css`.

## Layout and page-shell rules

- [explicit] The homepage uses a centered container with `max-w-screen-lg`, `px-8` at the `Layout` level, and `p-6 md:p-10` inside `<main>`.
  Evidence: `src/pages/index.js`.

- [explicit] On docs pages, `DocItem` constrains the main column to `75%` on desktop when TOC is present.
  Evidence: `src/theme/DocItem/styles.module.css`.

- [explicit] The navbar is forced to full viewport width and the docs page shell backgrounds are overridden in global CSS.
  Evidence: `src/css/custom.css`.

- [explicit] Sidebar behavior is heavily customized in `src/css/custom.css`:
  - active category labels should not be highlighted like leaf pages
  - categories with their own landing pages should preserve normal text color
  - hover backgrounds are unified on collapsible category rows
  - caret icon sizing is normalized
  Evidence: `src/css/custom.css`.

- [inferred] For new homepage-style sections in this repo, the dominant modern pattern is:
  - centered section headers
  - `text-3xl font-bold tracking-tight md:text-4xl`
  - compact eyebrow pills
  - cards using `rounded-2xl`, border, `p-6`, and dark-mode variants
  Evidence: `GetStartedPaths.js`, `QuickStartTabs.js`, `TestingCapabilities.js`, `Community.js`, `EcosystemSupport.js`, `WhatIsKeploy.js`.

- [inferred] Older sections still use `rounded-lg`, `shadow-lg`, and simpler card markup; reviewers should avoid spreading that older pattern into new work unless the PR is editing the legacy section in place.
  Evidence: `QuickStart.js`, `SDKs.js`, `Intro.js`, `Product.js`, `UtgMethods.js`, `GSoC.js`, `Hacktoberfest.js`, `GitTogether.js`.

## Docs-specific component inventory and usage rules

### Theme overrides

- [explicit] `src/theme/Heading/index.js`
  - Wraps headings to preserve anchor behavior and collect broken-link anchors.
  - Adds a hidden hash-link target with `aria-label` and `title`.
  - Review rule: do not replace docs headings with raw elements in theme-level code if that would bypass anchor-link behavior.

- [explicit] `src/theme/DocItem/index.js`
  - Owns doc-page SEO metadata, breadcrumb rendering, TOC behavior, prose wrapper, version badge row, inline footer, and the `KeployCloud` strip.
  - Review rule: treat this as the canonical docs page shell; avoid duplicating page-shell concerns elsewhere.

- [explicit] `src/theme/DocBreadcrumbs/index.js`
  - Adds breadcrumb structured data and breadcrumb nav markup with an ARIA label.
  - Review rule: preserve breadcrumb semantics if editing.

- [explicit] `src/theme/DocSidebarItem/Category.js`
  - Adds top-level sidebar category icon treatment via `SidebarCategoryIcon`.
  - Review rule: extend the icon mapping rather than duplicating top-level category icon markup.

### Reusable docs components

- [explicit] `DocHeaderChips`
  - Props: `tier`, `version`, `availability = []`
  - Use for compact doc metadata rows.
  - Source: `src/components/DocHeaderChips.js`

- [explicit] `ProductTier`
  - Props: `tiers`, `offerings`
  - Use for compact tier/offering chips.
  - Source: `src/components/ProductTier.js`

- [explicit] `TierCallout`
  - Props: `chips = []`, `type`, `children`
  - Can render either inline chips or a subtle note block with chips.
  - Source: `src/components/TierCallout.js`

- [explicit] `SidebarBadge`
  - Props: `type = "oss"`, `showIcon = true`
  - Use for sidebar-specific labels such as `oss`, `enterprise`, `cloud`, `beta`, `new`.
  - Source: `src/components/SidebarBadge.js`

- [explicit] `SidebarCategoryIcon`
  - Props: `category`, `size = 16`, `className = ""`
  - Use for top-level sidebar category icon mapping.
  - Source: `src/components/SidebarCategoryIcon.js`

- [explicit] `GlossaryCard`
  - Props: `name`, `description`, `link`
  - Use for glossary card grids.
  - Source: `src/components/GlossaryCard.js`

- [explicit] `QuickStartFilter`
  - Props: `defaultLanguage = null`
  - Multi-step quickstart wizard.
  - Source: `src/components/QuickStartFilter.js`

- [explicit] `QuickStartTabs`
  - No props.
  - Two-path quickstart chooser for AI vs OSS flow.
  - Source: `src/components/QuickStartTabs.js`

- [explicit] `CollapsibleCode`
  - Props: `code`, `language = "json"`, `previewLines = 10`
  - Use for long code samples with preview/copy behavior.
  - Source: `src/components/CollapsibleCode.js`

- [explicit] `StartKeploy`
  - No props.
  - Tabbed starter commands for local language runtimes.
  - Source: `src/components/StartKeploy.js`

- [explicit] `StartKeployDocker`
  - No props.
  - Tabbed starter commands for Docker/Docker Compose flows.
  - Source: `src/components/StartKeployDocker.js`

- [inferred] When a PR creates a new metadata strip, tier chip, glossary card, quickstart chooser, or sidebar badge/icon treatment, reviewers should first check whether one of the components above already solves the problem.

## Accessibility and interaction patterns unique to this repo

- [explicit] Code-block copy buttons are made visible on keyboard focus via `:focus-within` and `:focus-visible` in global CSS.
  Evidence: `src/css/custom.css`.

- [explicit] The repo defines a global `:focus-visible` outline and then adds orange-focused overrides for `button`, `a`, and `input`.
  Evidence: `src/css/custom.css`.

- [explicit] Docs heading anchors have accessible names through `aria-label` and `title`.
  Evidence: `src/theme/Heading/index.js`.

- [explicit] Glossary navigation uses `role="navigation"`, `aria-label`, and `aria-pressed`.
  Evidence: `src/pages/concepts/reference/glossary.js`.

- [explicit] The docs sidebar styling explicitly relies on `aria-current="page"` to differentiate category links from leaf-page active states.
  Evidence: `src/css/custom.css`.

- [inferred] Reviewers should treat docs navigation semantics as fragile because this repo customizes Docusaurus sidebar and breadcrumb behavior more than a default docs site.

## Authoring and docs-specific constraints

- [explicit] The repo has a written style guide for docs writing in `STYLE.md`.
  It requires:
  - sentence case headings
  - infinitive verb forms in headings
  - capitalization of Keploy-specific terms
  - active voice
  - globally readable language
  Evidence: `STYLE.md`.

- [explicit] Contributors are told in `CONTRIBUTING.md` and `README.md` to follow the style guide and the existing docs structure/design.

- [inferred] For design review, that means UI or MDX changes should avoid introducing heading or metadata treatments that fight the repo’s documentation-oriented content structure.

## Docs-specific anti-patterns to flag

- [explicit] Inline visual styling is common in legacy helper components and should be flagged when newly introduced:
  - `InstallReminder.js`
  - `EnterpriseInstallReminder.js`
  - `SectionDivider.js`
  - `StartKeploy.js`
  - `StartKeployDocker.js`
  - `ResponsivePlayer.js`

- [explicit] Several metadata and badge helpers use hardcoded local color maps rather than the docs variable layer:
  - `DocHeaderChips.js`
  - `SidebarBadge.js`
  - `ProductTier.js`
  - `TierCallout.js`
  - `SidebarCategoryIcon.js`

- [explicit] Invalid JSX/SVG attributes already exist and should not spread:
  - raw `class` in `QuickStart.js`
  - kebab-case `fill-rule` and `clip-rule` in `Product.js`

- [explicit] `CollapsibleCode.js` uses a hardcoded DOM id `copy-full-code`, which is risky for a reusable component.

- [explicit] `QuickStartFilter.js` mixes Tailwind, component-local `<style>` rules, and multiple inline styles in one component.

- [inferred] New PRs should not copy the legacy pattern of large one-off CSS-in-JS objects or local color dictionaries when the change belongs to the docs shell or a reusable docs helper.

- [inferred] New PRs should not introduce more visual divergence between:
  - older docs helper sections using `rounded-lg shadow-lg`
  - newer homepage sections using `rounded-2xl border p-6`

- [inferred] When editing newer homepage sections, prefer extending the existing newer pattern rather than backsliding to the older helper-card style.
