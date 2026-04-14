# Keploy Docs component library

This repo has two layers of reusable UI:

1. `src/components/*` MDX and page-building helpers.
2. `src/theme/*` Docusaurus theme overrides that contributors should preserve when editing docs UX.

Files marked as legacy are still reusable, but they do not match the newer homepage design language as closely.

## App components

### `Button`

- File: [`src/components/shared/Button.js`](/Users/amaan-bhati/Documents/docs/src/components/shared/Button.js)
- Purpose: Simple shared `<button>` with Docusaurus variable-based colors and a focus ring.
- Use when: You need a real `<button>` element inside a custom React component.
- Do not use when: A navigation action should be a `Link`, or when an existing Docusaurus button style already matches the page.
- Props: `children`, `type`, `name`, `className`
- Example: `<Button type="button">Run test</Button>`

### `CollapsibleCode`

- File: [`src/components/CollapsibleCode.js`](/Users/amaan-bhati/Documents/docs/src/components/CollapsibleCode.js)
- Purpose: Shows a preview of long code with Show More and Copy actions.
- Use when: A doc needs to preview long code samples without overwhelming the page.
- Do not use when: A normal `CodeBlock` is short enough to show in full.
- Props: `code`, `language = "json"`, `previewLines = 10`
- Example: `<CollapsibleCode code={payload} language="json" previewLines={12} />`

### `Community`

- File: [`src/components/Community.js`](/Users/amaan-bhati/Documents/docs/src/components/Community.js)
- Purpose: Homepage section for community links and a demo CTA.
- Use when: Editing the homepage or a page that intentionally mirrors the homepage marketing style.
- Do not use when: A doc page only needs a simple inline support link block.
- Props: none
- Example: `<Community />`

### `DocHeaderChips`

- File: [`src/components/DocHeaderChips.js`](/Users/amaan-bhati/Documents/docs/src/components/DocHeaderChips.js)
- Purpose: Compact metadata strip for doc pages.
- Use when: A doc needs tier, version, or availability metadata near the title.
- Do not use when: You only need a single badge or pill; prefer the simpler chip helpers.
- Props: `tier`, `version`, `availability = []`
- Example: `<DocHeaderChips tier="oss" version="4.0.0" availability={["cli", "cloud"]} />`

### `EcosystemSupport`

- File: [`src/components/EcosystemSupport.js`](/Users/amaan-bhati/Documents/docs/src/components/EcosystemSupport.js)
- Purpose: Homepage section for sponsorship, storytelling, and GSoC programs.
- Use when: Editing ecosystem/community marketing on the homepage.
- Do not use when: A doc needs a small inline callout rather than a multi-card section.
- Props: none
- Example: `<EcosystemSupport />`

### `EnterpriseInstallReminder`

- File: [`src/components/EnterpriseInstallReminder.js`](/Users/amaan-bhati/Documents/docs/src/components/EnterpriseInstallReminder.js)
- Purpose: Inline install reminder card for enterprise samples.
- Use when: A guide assumes Keploy Enterprise is already installed.
- Do not use when: The page is for OSS or when metadata chips are enough.
- Props: none
- Example: `<EnterpriseInstallReminder />`

### `GSoC`

- File: [`src/components/GSoC.js`](/Users/amaan-bhati/Documents/docs/src/components/GSoC.js)
- Purpose: Legacy GSoC promo section.
- Use when: Maintaining the existing GSoC landing content.
- Do not use when: Building new homepage sections; it uses an older visual pattern.
- Props: none
- Example: `<GSoC />`

### `GetStartedPaths`

- File: [`src/components/GetStartedPaths.js`](/Users/amaan-bhati/Documents/docs/src/components/GetStartedPaths.js)
- Purpose: Two-path homepage chooser for AI generation vs record/replay.
- Use when: Editing the top-level onboarding decision on the homepage.
- Do not use when: A page only needs a single CTA card or a tabbed quickstart.
- Props: none
- Example: `<GetStartedPaths />`

### `GitTogether`

- File: [`src/components/GitTogether.js`](/Users/amaan-bhati/Documents/docs/src/components/GitTogether.js)
- Purpose: Legacy event promo section.
- Use when: Maintaining GitTogether event content already using this block.
- Do not use when: Creating new design-system exemplars; it follows older styling conventions.
- Props: none
- Example: `<GitTogether />`

### `GlossaryCard`

- File: [`src/components/GlossaryCard.js`](/Users/amaan-bhati/Documents/docs/src/components/GlossaryCard.js)
- Purpose: Clickable glossary entry card with hover affordance.
- Use when: Rendering glossary grids or term libraries.
- Do not use when: A plain text list of links is sufficient.
- Props: `name`, `description`, `link`
- Example: `<GlossaryCard name="Mock" description="A simulated dependency." link="/docs/concepts/reference/glossary/mocks" />`

### `Hacktoberfest`

- File: [`src/components/Hacktoberfest.js`](/Users/amaan-bhati/Documents/docs/src/components/Hacktoberfest.js)
- Purpose: Legacy Hacktoberfest promo block.
- Use when: Updating the existing Hacktoberfest surface.
- Do not use when: Building new generic community sections.
- Props: none
- Example: `<Hacktoberfest />`

### `InstallReminder`

- File: [`src/components/InstallReminder.js`](/Users/amaan-bhati/Documents/docs/src/components/InstallReminder.js)
- Purpose: Inline install reminder card for OSS/local guides.
- Use when: A page expects Keploy to be installed before the next steps.
- Do not use when: A simple doc link is enough or when metadata chips are more appropriate.
- Props: none
- Example: `<InstallReminder />`

### `Intro`

- File: [`src/components/Intro.js`](/Users/amaan-bhati/Documents/docs/src/components/Intro.js)
- Purpose: Legacy support matrix for languages and dependencies.
- Use when: Maintaining the existing support overview.
- Do not use when: Building new sections; it uses an older card pattern and has some incomplete links.
- Props: none
- Example: `<Intro />`

### `KeployCloud`

- File: [`src/components/KeployCloud.js`](/Users/amaan-bhati/Documents/docs/src/components/KeployCloud.js)
- Purpose: Small support strip with Slack and demo CTAs.
- Use when: A docs page needs the standard support footer strip.
- Do not use when: The full homepage community section is more appropriate.
- Props: none
- Example: `<KeployCloud />`

### `Products`

- File: [`src/components/Product.js`](/Users/amaan-bhati/Documents/docs/src/components/Product.js)
- Purpose: Legacy product card section.
- Use when: Maintaining the current product overview if it is still needed.
- Do not use when: Adding new marketing sections; it is visually older and contains invalid SVG JSX attributes.
- Props: none
- Example: `<Products />`

### `ProductTier`

- File: [`src/components/ProductTier.js`](/Users/amaan-bhati/Documents/docs/src/components/ProductTier.js)
- Purpose: Compact inline chips for tiers and offerings.
- Use when: Docs need product tier or hosting-mode metadata near headings or callouts.
- Do not use when: A richer metadata strip such as `DocHeaderChips` is needed.
- Props: `tiers`, `offerings`
- Example: `<ProductTier tiers="Open Source, Enterprise" offerings="Dedicated" />`

### `QuickStart`

- File: [`src/components/QuickStart.js`](/Users/amaan-bhati/Documents/docs/src/components/QuickStart.js)
- Purpose: Legacy welcome/intro section for docs onboarding.
- Use when: Maintaining the current quickstart landing experience.
- Do not use when: Adding modern homepage sections; it uses older typography and card styles.
- Props: none
- Example: `<QuickStart />`

### `QuickStartFilter`

- File: [`src/components/QuickStartFilter.js`](/Users/amaan-bhati/Documents/docs/src/components/QuickStartFilter.js)
- Purpose: Three-step quickstart wizard by language and environment.
- Use when: A page needs the established quickstart chooser UX.
- Do not use when: A simple list or a two-option CTA is enough.
- Props: `defaultLanguage = null`
- Example: `<QuickStartFilter defaultLanguage="Go" />`

### `QuickStartTabs`

- File: [`src/components/QuickStartTabs.js`](/Users/amaan-bhati/Documents/docs/src/components/QuickStartTabs.js)
- Purpose: Two-tile quickstart chooser for AI vs OSS paths.
- Use when: Presenting the two main onboarding paths in a compact section.
- Do not use when: The richer `GetStartedPaths` section is already present on the page.
- Props: none
- Example: `<QuickStartTabs />`

### `Resources`

- File: [`src/components/Resources.js`](/Users/amaan-bhati/Documents/docs/src/components/Resources.js)
- Purpose: Legacy quick links list.
- Use when: A page needs a small list of curated resources.
- Do not use when: You need card-based marketing CTAs.
- Props: none
- Example: `<Resources />`

### `ResponsivePlayer`

- File: [`src/components/responsive-player/ResponsivePlayer.js`](/Users/amaan-bhati/Documents/docs/src/components/responsive-player/ResponsivePlayer.js)
- Purpose: 16:9 responsive wrapper around `react-player`.
- Use when: Embedding video that should keep aspect ratio responsively.
- Do not use when: A static image or simple iframe embed is sufficient.
- Props: `url`, `loop`, `playing`
- Example: `<ResponsivePlayer url="https://youtu.be/example" playing={false} loop={false} />`

### `SDKs`

- File: [`src/components/SDKs.js`](/Users/amaan-bhati/Documents/docs/src/components/SDKs.js)
- Purpose: Legacy supported-OS cards.
- Use when: Maintaining the current OS chooser section.
- Do not use when: Building new feature marketing or metadata chips.
- Props: none
- Example: `<SDKs />`

### `SectionDivider`

- File: [`src/components/SectionDivider.js`](/Users/amaan-bhati/Documents/docs/src/components/SectionDivider.js)
- Purpose: Dashed horizontal divider.
- Use when: You need a strong visual separation inside a long custom page.
- Do not use when: Standard margin spacing is sufficient.
- Props: none
- Example: `<SectionDivider />`

### `SidebarBadge`

- File: [`src/components/SidebarBadge.js`](/Users/amaan-bhati/Documents/docs/src/components/SidebarBadge.js)
- Purpose: Small badge/chip for sidebar labels.
- Use when: Marking sidebar items as OSS, enterprise, cloud, beta, or new.
- Do not use when: Metadata should appear inside page content instead of navigation.
- Props: `type = "oss"`, `showIcon = true`
- Example: `<SidebarBadge type="enterprise" />`

### `SidebarCategoryIcon`

- File: [`src/components/SidebarCategoryIcon.js`](/Users/amaan-bhati/Documents/docs/src/components/SidebarCategoryIcon.js)
- Purpose: Icon resolver and wrapper for top-level sidebar categories.
- Use when: Extending the icon mapping for top-level docs categories.
- Do not use when: The category is not represented in the sidebar or the icon is not part of the established mapping.
- Props: `category`, `size = 16`, `className = ""`
- Example: `<SidebarCategoryIcon category="api-testing" />`

### `StartKeploy`

- File: [`src/components/StartKeploy.js`](/Users/amaan-bhati/Documents/docs/src/components/StartKeploy.js)
- Purpose: Tabbed language-specific quick commands for local recording/testing.
- Use when: A page needs the standard record/test command starter across languages.
- Do not use when: The page is Docker-focused.
- Props: none
- Example: `<StartKeploy />`

### `StartKeployDocker`

- File: [`src/components/StartKeployDocker.js`](/Users/amaan-bhati/Documents/docs/src/components/StartKeployDocker.js)
- Purpose: Tabbed starter commands for Docker and Docker Compose.
- Use when: A page is specifically about containerized recording/testing.
- Do not use when: A language-based local starter is more appropriate.
- Props: none
- Example: `<StartKeployDocker />`

### `TestingCapabilities`

- File: [`src/components/TestingCapabilities.js`](/Users/amaan-bhati/Documents/docs/src/components/TestingCapabilities.js)
- Purpose: Homepage section showing functional tests and quality gates as chip groups.
- Use when: Explaining the breadth of Keploy testing types in the current homepage style.
- Do not use when: A page only needs a short feature list.
- Props: none
- Example: `<TestingCapabilities />`

### `TierCallout`

- File: [`src/components/TierCallout.js`](/Users/amaan-bhati/Documents/docs/src/components/TierCallout.js)
- Purpose: Inline chips or a subtle note block for tier/platform/feature metadata.
- Use when: A doc needs lightweight metadata like `oss`, `docker`, `k8s`, or `ai-gen`.
- Do not use when: Full section callouts or admonitions are more appropriate.
- Props: `chips = []`, `type`, `children`
- Example: `<TierCallout chips={["oss", "docker", "record-replay"]} />`

### `UTGMethods`

- File: [`src/components/UtgMethods.js`](/Users/amaan-bhati/Documents/docs/src/components/UtgMethods.js)
- Purpose: Legacy three-card overview of unit-test-generation entry points.
- Use when: Maintaining UTG landing content.
- Do not use when: Building new homepage-standard sections.
- Props: none
- Example: `<UTGMethods />`

### `WhatIsKeploy`

- File: [`src/components/WhatIsKeploy.js`](/Users/amaan-bhati/Documents/docs/src/components/WhatIsKeploy.js)
- Purpose: Homepage "About Keploy" narrative plus trust/compliance banner.
- Use when: Editing the homepage's main product narrative.
- Do not use when: A page only needs a short intro paragraph or a simple trust badge.
- Props: none
- Example: `<WhatIsKeploy />`

## Theme overrides

### `@theme/Heading`

- File: [`src/theme/Heading/index.js`](/Users/amaan-bhati/Documents/docs/src/theme/Heading/index.js)
- Purpose: Wraps Docusaurus headings to preserve anchor links and scroll offsets.
- Use when: Editing how headings render across docs.
- Do not use when: Building custom standalone heading components inside page sections unless you understand the anchor behavior you are bypassing.
- Props: `as`, `id`, plus heading props from Docusaurus
- Example: `<Heading as="h2" id="install">Install Keploy</Heading>`

### `@theme/DocBreadcrumbs`

- File: [`src/theme/DocBreadcrumbs/index.js`](/Users/amaan-bhati/Documents/docs/src/theme/DocBreadcrumbs/index.js)
- Purpose: Breadcrumb rendering plus breadcrumb structured data.
- Use when: Editing docs navigation breadcrumbs globally.
- Do not use when: A page only needs a local back link.
- Props: internal Docusaurus props only
- Example: Automatic inside `DocItem`

### `@theme/DocItem`

- File: [`src/theme/DocItem/index.js`](/Users/amaan-bhati/Documents/docs/src/theme/DocItem/index.js)
- Purpose: Global doc page shell, SEO metadata, TOC behavior, inline footer, and prose wrapper.
- Use when: Editing docs page structure or markdown container behavior.
- Do not use when: A page-level component can solve the issue locally.
- Props: Docusaurus `content`/doc props
- Example: Automatic for docs pages

### `@theme/DocSidebarItem/Category`

- File: [`src/theme/DocSidebarItem/Category.js`](/Users/amaan-bhati/Documents/docs/src/theme/DocSidebarItem/Category.js)
- Purpose: Adds icon treatment to top-level sidebar categories.
- Use when: Editing sidebar category icon behavior.
- Do not use when: Icons should appear inside doc content instead of nav.
- Props: Docusaurus sidebar item props
- Example: Automatic in the docs sidebar

### `@theme/Footer`

- File: [`src/theme/Footer/index.js`](/Users/amaan-bhati/Documents/docs/src/theme/Footer/index.js)
- Purpose: Pass-through wrapper for the default footer.
- Use when: A future global footer override is needed.
- Do not use when: A page-specific CTA strip like `KeployCloud` is enough.
- Props: Docusaurus footer props
- Example: Automatic in site layout

### `@theme/Navbar` and `@theme/NavbarItem/DropdownNavbarItem`

- Files: [`src/theme/Navbar/index.js`](/Users/amaan-bhati/Documents/docs/src/theme/Navbar/index.js), [`src/theme/NavbarItem/DropdownNavbarItem.js`](/Users/amaan-bhati/Documents/docs/src/theme/NavbarItem/DropdownNavbarItem.js)
- Purpose: Thin wrappers around the default navbar and dropdown item.
- Use when: Editing global navbar behavior.
- Do not use when: A page-specific menu is enough.
- Props: Docusaurus navbar props
- Example: Automatic in site layout

### `@theme/NotFound`

- File: [`src/theme/NotFound/index.js`](/Users/amaan-bhati/Documents/docs/src/theme/NotFound/index.js)
- Purpose: Wraps the default 404 page with layout and metadata.
- Use when: Editing 404 behavior globally.
- Do not use when: A normal page route should handle the case.
- Props: none
- Example: Automatic on unmatched routes
