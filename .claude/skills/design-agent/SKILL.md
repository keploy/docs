name: design-agent
description: >
  Use this skill when a contributor asks for /design-agent, docs design review, PR design feedback, Docusaurus UI review, docs-page consistency review, MDX component review, docs theme review, docs accessibility review, or help checking whether a change matches keploy/docs conventions beyond the shared Keploy design commons. Trigger it for reviews of docs-specific layout, Docusaurus theme overrides, sidebar/navigation behavior, docs metadata chips, prose styling, global docs CSS, and repo-local Tailwind/CSS patterns that are unique to keploy/docs.

Design Agent — Keploy Docs overrides
This skill reviews only the design-system rules that are specific to the `keploy/docs` repository. It assumes the shared Keploy commons are already loaded, then applies the Docusaurus-specific, docs-shell-specific, and repo-local component/style overrides found in this repository.

Loading order
Load commons guidelines first, then apply these repo-specific overrides. In case of conflict, repo-specific rules take precedence.

When to use
Use this skill for PRs or commits in `keploy/docs` that touch Docusaurus pages, MDX helpers, docs theme overrides, sidebar or breadcrumb behavior, docs layout, `src/css/custom.css`, `tailwind.config.js`, or any reusable component under `src/components` or `src/theme`.

What to review
Review only docs-specific overrides beyond the commons:

1. Docusaurus-specific tokens and theme variables
Check whether changes use the repo’s Docusaurus token layer in `src/css/custom.css` when editing docs surfaces, markdown content, inline code, cards, navbar, footer, or docs background treatment.
Flag changes that bypass docs-specific variables like `--ifm-color-primary`, `--ifm-color`, `--ifm-background-color`, `--ifm-card-background-color`, and `--ifm-card-shadow-color` when the change is clearly part of the docs shell rather than a one-off marketing section.

2. Docs-shell components and theme overrides
Check whether PRs preserve the behavior of `src/theme/DocItem`, `src/theme/Heading`, `src/theme/DocBreadcrumbs`, and `src/theme/DocSidebarItem/Category`.
Flag raw replacements that break heading anchors, TOC behavior, breadcrumb semantics, sidebar icon treatment, or doc-page footer behavior.

3. Docs-specific reusable components
Prefer the existing docs metadata and helper components when they match the job: `DocHeaderChips`, `ProductTier`, `TierCallout`, `SidebarBadge`, `SidebarCategoryIcon`, `GlossaryCard`, `QuickStartFilter`, `QuickStartTabs`, `StartKeploy`, `StartKeployDocker`, and `CollapsibleCode`.
Do not require these components outside their scope, but do flag duplicate implementations of the same docs-specific patterns.

4. Docs typography and prose behavior
Review changes against the docs-specific typography stack and prose rules in `src/css/custom.css`, `tailwind.config.js`, and `src/theme/DocItem/index.js`.
Flag changes that break the docs body font override, code-font reset, heading anchor behavior, prose container sizing, or docs-specific gradient H1 treatment.

5. Docs layout and responsiveness
Check whether changes preserve the established docs layout model: centered long-form content, Docusaurus doc shell, and homepage sections that fit within the existing `max-w-screen-lg` / `max-w-*` patterns.
Flag fixed-width layouts, desktop-only docs UI, or spacing that departs from the repo’s repeated docs patterns without reason.

6. Docs accessibility and navigation behavior
Check icon links, toggle/filter controls, focus states, copy-button visibility, `aria-current` handling, and sidebar semantics.
Flag regressions in keyboard focus visibility, missing accessible names on icon-only actions, or changes that weaken Docusaurus navigation semantics.

7. Docs-specific anti-patterns
Flag repo-local issues already present here and likely to spread: inline visual styles in React helpers, duplicated chip systems with local color maps, arbitrary-value classes for visual tokens, invalid JSX/SVG attributes, and mixing legacy `rounded-lg shadow-lg` cards into newer docs homepage sections without intent.

How to deliver feedback
When reviewing a PR, structure feedback as:

Summary — one paragraph on docs-specific design health
Critical issues — docs-specific blockers that should be fixed before merge
Suggestions — non-blocking consistency improvements
Positive notes — at least one concrete thing done well

Reference actual file names and line numbers from the diff. Keep comments specific to this repo’s docs overrides rather than restating the shared commons.

Reference files
Read `references/docs-specific.md` for the repo-specific rules, tokens, components, and anti-patterns that apply only to `keploy/docs`.
