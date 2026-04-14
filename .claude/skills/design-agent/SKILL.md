name: design-agent
description: >
  Use this skill when a contributor asks for /design-agent, design review, PR review, UI review, design feedback, visual QA, frontend consistency checks, component usage guidance, Tailwind review, CSS review, docs-site styling review, Docusaurus theme review, accessibility review, spacing review, typography review, or help matching Keploy Docs design conventions. Trigger this for PR review comments about design consistency, component usage, Tailwind/CSS conventions in this repo, hardcoded colors, inline styles, Docusaurus CSS variable usage, dark mode mismatches, focus states, and whether a page or component looks like the rest of the Keploy documentation site.

Design Agent — Keploy Documentation
This agent reviews UI and frontend changes in the Keploy docs site, which is built on Docusaurus 3 with React, Tailwind CSS, Docusaurus theme overrides, and a large set of MDX helper components. It checks whether changes align with the repo's actual design system: Docusaurus CSS variables for core theming, Tailwind utility patterns on newer pages, and existing reusable components for chips, cards, quickstart flows, glossary cards, and docs metadata.

Trigger
This skill is invoked when a contributor uses /design-agent or asks for design review, design feedback, or UI/UX guidance on a PR or commit.

What to review in a PR
When called on a PR or set of code changes, check for:

1. Token compliance
Colors must prefer the repo's existing theme tokens from `src/css/custom.css`: `--ifm-color-primary` `#ff914d`, `--ifm-color-primary-dark` `#e67643`, `--ifm-color-primary-darker` `#c95919`, `--ifm-color-primary-darkest` `#be2c1b`, `--ifm-color-primary-light` `#ffd0a0`, `--ifm-color-primary-lightest` `#ffceb1`, `--ifm-color` `#00163d` in light mode and `#f5f6f7` in dark mode, `--ifm-background-color` `rgb(249, 250, 251)` in light mode and `#141414` in dark mode, `--ifm-card-background-color`, and `--ifm-card-shadow-color`.
Use custom Tailwind colors from `tailwind.config.js` only when they already match an established pattern: `offwhite`, `keployblue`, `keploybrightblue`, `keploypurple`, `keploybrightpurple`, `spaceblack`, `green1`, `green2`, `orange1`, `orange2`, `gray5`, `lightgray`, `lightteal`.
Do not introduce arbitrary values such as `bg-[#3b82f6]`, `text-[#7c3aed]`, or new one-off RGB values when an existing Docusaurus variable or existing Tailwind palette class already fits.
`[inferred]` Newer homepage sections frequently use Tailwind's default gray/orange/purple/indigo families. Reuse those exact class families when extending those sections instead of inventing a new accent system.
Flag `style={{ color: "#..." }}`, `style={{ background: "#..." }}`, and ad hoc token maps with raw hex values unless the file is already following that legacy pattern and the PR cannot reasonably normalize it.

2. Component usage
Use `@docusaurus/Link` for internal navigation, not raw `<a href="/docs/...">`.
Use `@theme/Heading` or markdown headings inside docs content so anchor links and scroll offsets keep working.
Use `GlossaryCard` for glossary card grids.
Use `DocHeaderChips`, `ProductTier`, or `TierCallout` for doc metadata chips instead of inventing another badge row.
Use `QuickStartTabs` and `QuickStartFilter` when editing the quickstart entry experience; do not rebuild the same chooser pattern from scratch.
Use `SidebarBadge` and `SidebarCategoryIcon` for sidebar labels/icons instead of ad hoc badge markup.
`[inferred]` Reuse existing card anatomy from newer homepage sections: `rounded-2xl`, bordered surfaces, `p-6`, compact eyebrow pill, `text-3xl md:text-4xl` section headings, and dark-mode variants.
There is no consistently enforced global button component in this repo. Do not force `src/components/shared/Button.js` everywhere, but do flag raw buttons/links that ignore existing CTA patterns, focus states, or dark-mode treatment.

3. Typography
Docs pages force `DM Sans` globally through `src/css/custom.css`; code blocks intentionally revert to the system monospace stack.
Headings and the navbar use an `Aeonik`-first fallback stack in `src/css/custom.css`; body copy on docs pages is still forced to `DM Sans`.
Review heading hierarchy carefully: section headers on newer landing sections usually use `text-3xl font-bold tracking-tight md:text-4xl`; subheads are commonly `text-lg` or `text-xl` with `font-bold` or `font-semibold`; supporting copy is usually `text-sm`, `text-base`, or `text-xs` in gray text classes.
In docs markdown, prose styling comes from Tailwind Typography plus Docusaurus overrides in `tailwind.config.js` and `src/theme/DocItem/index.js`.
Flag jumps in hierarchy like using `text-4xl` for small card titles or mixing legacy `tracking-wide font-semibold` headings with the newer `tracking-tight font-bold` marketing pattern in the same section.

4. Spacing & layout
The homepage shell uses `max-w-screen-lg` with `p-6 md:p-10` and stacked sections separated mostly by `mb-12` or `mb-16`.
Common card spacing is `p-6`; compact nested options often use `p-3` or `p-4`.
Common gaps are `gap-2`, `gap-3`, `gap-4`, and `gap-6`.
Common max widths are `max-w-2xl`, `max-w-3xl`, `max-w-5xl`, and `max-w-6xl`.
`[inferred]` Prefer `rounded-xl` or `rounded-2xl` on newer surfaces; `rounded-lg` appears mostly in older components.
Flag new layouts that ignore the established page width, use inconsistent spacing steps, or introduce oversized padding/margins without a clear reason.

5. Responsiveness
This repo uses Tailwind's default responsive prefixes; no custom breakpoints are defined in `tailwind.config.js`.
Common responsive patterns in source are `md:grid-cols-2`, `md:grid-cols-3`, `md:grid-cols-12`, `md:text-4xl`, `md:p-10`, `lg:gap-8`, `lg:px-10`, and Docusaurus' desktop breakpoint behavior around `997px` in `src/theme/DocItem/styles.module.css`.
`[inferred]` New sections should collapse to one column on mobile, keep CTAs full-width or easy to tap, and avoid text that depends on hover-only disclosure.
Flag any PR that adds fixed widths or desktop-only multi-column layouts without a mobile fallback.

6. Accessibility
Keep visible focus treatment. Global focus styles are defined in `src/css/custom.css`, and some components add stronger local rings with `focus-visible:ring-*`.
Preserve `aria-label` usage for icon-only links and action buttons; examples already exist in `src/theme/DocItem/index.js`, `src/theme/Heading/index.js`, `src/pages/concepts/reference/glossary.js`, and `src/components/WhatIsKeploy.js`.
Images should keep meaningful `alt` text unless decorative.
Internal controls that behave like toggles or filters should keep state semantics such as `aria-pressed`.
If a PR adds `target="_blank"`, require `rel="noopener noreferrer"`.
Flag `focus:outline-none` when it is not paired with an equivalent replacement ring or outline.

7. Anti-patterns to flag
Inline styling for structure, spacing, or color in React components, especially in `InstallReminder`, `EnterpriseInstallReminder`, `SectionDivider`, `StartKeploy`, `StartKeployDocker`, and `ResponsivePlayer`.
Hardcoded color maps and local `<style>` blocks for reusable chips/badges instead of shared tokens or CSS variables, as seen in `DocHeaderChips`, `SidebarBadge`, `ProductTier`, and `TierCallout`.
Arbitrary value classes like `bg-[color:orange]`, `border-[color:orange]`, `bg-[var(--ifm-card-background-color)]`, and `shadow-[0_4px_12px_var(--ifm-card-shadow-color)]` when a standard class or central token would be clearer.
Invalid or inconsistent JSX/SVG attributes such as raw `class=` and kebab-case `fill-rule` or `clip-rule`.
Recreating cards, pill badges, or quickstart selectors that already exist in `src/components`.
Mixing old `rounded-lg shadow-lg` legacy cards into newer `rounded-2xl border p-6` sections without an intentional visual reason.
Introducing new font families or typography systems; this repo already has conflicting font choices and should not add more.

How to deliver feedback
When reviewing a PR, structure your feedback as follows:

Summary — one paragraph overall design health assessment
Critical issues — things that must be fixed before merge (broken design tokens, accessibility failures, missing required components)
Suggestions — things that would improve consistency but aren't blockers
Positive notes — what was done well (always include at least one)

Be specific. Reference actual line numbers or file names from the diff.
Compare against guidelines in the references/ files.
Never give vague feedback like "improve spacing" — say exactly what class or token should be used instead.

Reference files

Read references/design-tokens.md for all color, spacing, and typography values
Read references/component-library.md for component usage rules
Read references/anti-patterns.md for patterns to flag in review
