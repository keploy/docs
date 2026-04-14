# The Definitive Autonomous QA Review Agent Manual
> **Version**: 3.0.0 (Enterprise-Grade Expansion)
> **Target System**: Keploy Documentation Codebase (Docusaurus + React + Tailwind + MDX)
> **Purpose**: This manual serves as the foundational "Brain" for the QA Agent and the absolute standard for human code reviewers. It contains ~900 lines of rigorous checks, structural dependencies, causality mappings, and algorithmic review protocols.

---

## Table of Contents
1. [Core Philosophy: Context-Aware Reviewing](#1-core-philosophy-context-aware-reviewing)
2. [Causality Mapping: "If X changes, check Y and do Z"](#2-causality-mapping-if-x-changes-check-y-and-do-z)
3. [Docusaurus Architecture & SSR Integrity](#3-docusaurus-architecture--ssr-integrity)
4. [React & UI Component Guidelines](#4-react--ui-component-guidelines)
5. [Tailwind & Design System Guidelines](#5-tailwind--design-system-guidelines)
6. [Markdown & MDX Authoring Standards](#6-markdown--mdx-authoring-standards)
7. [SEO, Web Vitals, & Accessibility](#7-seo-web-vitals--accessibility)
8. [Dependency & Package Management](#8-dependency--package-management)
9. [Automated Verification & Local Testing](#9-automated-verification--local-testing)
10. [Exhaustive Code Review Checklist](#10-exhaustive-code-review-checklist)
11. [Severity Levels & Agent Review Etiquette](#11-severity-levels--agent-review-etiquette)

---

## 1. Core Philosophy: Context-Aware Reviewing

Code reviews in this repository must transcend line-by-line syntax validation. The agent and human reviewers must operate with **Global Context Awareness**.

### 1.1 The Ecosystem Perspective
A documentation site is a hyper-connected graph. Changing a single ID in a markdown frontmatter or a prop in a component propagates across the graph. Reviewers must evaluate the rippling effects of every change.
- **Micro-level validation**: Does this function work? Is this react component returning valid JSX?
- **Macro-level validation**: Does this React component rely on browser-APIs that break Node.js SSR?
- **Ecosystem validation**: If this component's prop signature changes, did the 40 MDX files that import it get updated?

### 1.2 Destructive vs Constructive Feedback
- **Destructive**: "This is built wrong. Fix styling."
- **Constructive**: "RULE-UI-003: Inline styling impacts performance and disables our ability to use Dark Mode gracefully. Please migrate `<div style={{color: 'red'}}>` to use the Tailwind configuration: `<div className="text-red-500 dark:text-red-400">`."

---

## 2. Causality Mapping: "If X changes, check Y and do Z"

The QA agent must trace implications. This section defines rigid causality maps for the Keploy documentation repository.

### RULE-CAUSE-001: Component Prop Signature Modifications
**If X Changes**: A developer adds a new required prop to a shared component.
- **Example**: `src/components/ProductTier.js` adds a new prop `cloudOnly={true}`.
**Check Y**: The QA Agent must find EVERY single `.mdx` or `.md` or `.js` file that imports `<ProductTier />`.
**Do Z**: The agent must assert that all instances of `<ProductTier />` in the codebase are updated to provide the new `cloudOnly` prop, or ensure the component handles undefined values with a default `cloudOnly=false`. If instances are missed, **BLOCK** the PR.

### RULE-CAUSE-002: Markdown Frontmatter ID / Filename Changes
**If X Changes**: A file is renamed from `setup-guide.md` to `installation.md`, or the frontmatter `id` is modified.
**Check Y**: The QA Agent must `grep` the entire `/docs` and `/versioned_docs` directory for the old filename `setup-guide` and the old ID.
**Do Z**: 
1. If the old filename is referenced in any `[Link Title](./setup-guide.md)` tags, **BLOCK** the PR with a critical error and provide the exact list of files containing the broken link.
2. Ensure `sidebars.js` (and any related `versioned_sidebars`) is updated to reflect the new ID. Docusaurus will crash at compile time if a sidebar references a missing ID.

### RULE-CAUSE-003: Modifying Navbar or Footer Configurations
**If X Changes**: A new item is added to `navbar.items` or `footer.links` inside `docusaurus.config.js`.
**Check Y**: 
1. Verify the link is an absolute URL starting with `http` or a valid relative URL.
2. Check the character length of the navbar.
**Do Z**: 
If the navbar gains more than 1 new link, **WARN** the developer that the top-level navbar might wrap unpredictably on tablet screen sizes (`768px - 1024px`) before the mobile hamburger menu triggers. Request UI verification on horizontal constraint testing.

### RULE-CAUSE-004: UTG Configuration Grid Sizes
**If X Changes**: A developer adds a 4th product to the `<UTG />` component inside `src/components/Product.js`.
**Check Y**: Check the parent wrapper's grid classes: `<div className="grid gap-4 sm:grid-cols-3 xl:gap-6">`.
**Do Z**: 
If there are 4 items but the class is locked to `sm:grid-cols-3`, the fourth item will wrap alone onto a new line, looking orphaned. **WARN** the developer to update the grid to something symmetrical: `sm:grid-cols-2 lg:grid-cols-4`.

### RULE-CAUSE-005: Adding `window` or `document` accessing properties
**If X Changes**: A developer adds a function in a React component that reads `window.location.hostname`.
**Check Y**: Check if that logic is executed in the raw body of the functional component or if it's protected.
**Do Z**: 
If it is in the raw body (which runs during SSR), **BLOCK** the PR. Provide the fix: "Docusaurus SSR will crash because `window` is undefined in Node.js environments. Please wrap this evaluation in `useEffect` or an `ExecutionEnvironment.canUseDOM` condition."

### RULE-CAUSE-006: Versioned Docs Alterations
**If X Changes**: A developer fixes a typo or updates an API parameter precisely inside `versioned_docs/version-4.0.0/running-keploy/cli-commands.md`.
**Check Y**: Check the active root `/docs` folder for the same file structure.
**Do Z**: 
**INFO**: Alert the developer: "You applied a fix to a versioned sandbox. Unless this is a historical-only patch, please ensure you propagate this fix to the underlying `/docs/running-keploy/cli-commands.md` file so it survives the next version bump!"

---

## 3. Docusaurus Architecture & SSR Integrity

Docusaurus generates static sites. This entails rules completely unique to Static Site Generators.

### 3.1 Strict Browser Isolation
Code must be Isomorphic (capable of running in both Node.js for generation and Chrome for interaction).
**The Issue**:
```jsx
export default function LocationTracker() {
  const url = window.location.href; // 🔴 CRASHES DOCUSAURUS SSR BUILD
  return <div>{url}</div>;
}
```
**The Solution**:
```jsx
import React, { useEffect, useState } from 'react';

export default function LocationTracker() {
  const [url, setUrl] = useState("");
  
  useEffect(() => {
    setUrl(window.location.href); // 🟢 Safe. useEffect only runs on the client.
  }, []);
  
  return <div>{url}</div>;
}
```
**QA Agent Regex Trigger**: The agent must trigger a CRITICAL violation if it detects `/window\./` or `/document\./` or `/localStorage\./` outside of `useEffect` arrays or outside functions triggered purely by user interaction (like `onClick`).

### 3.2 Swizzling Rules
Docusaurus allows users to "swizzle" (eject) theme components into `src/theme/`.
- If a developer needs a custom Navbar, they shouldn't build it from scratch in `src/components`. They must use `npm run swizzle @docusaurus/theme-classic Navbar -- --wrap`.
- **QA Rule**: If a PR contains a newly created file in `src/theme/` that hasn't been officially swizzled (e.g., missing standard wrapper configurations), flag an INFO warning requesting clarification.

### 3.3 `<BrowserOnly>` For Heavy Client Operations
Sometimes, a component completely defies SSR (e.g., a complex terminal widget or heavily interactive canvas).
- The agent must verify that the component is wrapped in Docusaurus's official `<BrowserOnly>` component.
```jsx
import BrowserOnly from '@docusaurus/BrowserOnly';

<BrowserOnly fallback={<div>Loading Demo...</div>}>
  {() => <HeavyInteractiveCanvas />}
</BrowserOnly>
```

---

## 4. React & UI Component Guidelines

This section manages how our frontend logic is developed.

### 4.1 Enforcing Pure JavaScript
- **Context**: The Keploy docs use a modern `.js` config leveraging Babel and Webpack. TypeScript is NOT actively configured for JSX compilation.
- **Rule**: If the QA Agent detects file additions ending in `.ts` or `.tsx`, it must instantly **BLOCK** the PR unless `tsconfig.json` mappings and Docusaurus TypeScript dependency arrays are also bundled in the PR. Fragmented architectures increase maintenance debt.

### 4.2 Component Colocation
- **Context**: Code must live where it is logically pertinent.
- **Rule**: React components must reside ONLY in `src/components`. Page routes must reside ONLY in `src/pages`. Overrides reside ONLY in `src/theme`. Markdown and MDX content reside ONLY in `/docs`, `/blog`, or `/versioned_docs`.
- **Violation Checking**: If the PR creates `docs/SharedButton.jsx`, **BLOCK** the PR and demand relocation to `src/components/shared/Button.js`.

### 4.3 Prop Standardization (No PropTypes/TS)
Since we lack TypeScript interfaces, components must use safe default destructuring to prevent internal runtime `undefined` crashes.
**Bad**:
```jsx
export const CustomCard = (props) => {
  return <div className={props.className}><h2>{props.title.toUpperCase()}</h2></div>
}
```
*(If `title` is missing, `.toUpperCase()` crashes the entire React tree).*
**Good**:
```jsx
export const CustomCard = ({ className = "", title = "Default Title" }) => { ... }
```
**QA Protocol**: The agent must intelligently identify prop destructuring. If nested array/string operations occur on unchecked props, issue a **WARNING** stating "Potential null-pointer dereference. Ensure prop defaults are defined."

### 4.4 Large DOM Trees and Fragment usage
- Avoid useless `<div>` wrappers. Use `<>` (React Fragments) when returning multiple sibling elements.
- **Why**: Deep nesting impacts the DOM tree size, slowing down Docusaurus rendering times.

---

## 5. Tailwind & Design System Guidelines

### 5.1 No Inline Styles (CRITICAL)
- **Rule**: Inline styling `style={{ margin: "10px" }}` is forbidden.
- **Why**: Inline styles cannot adapt to Docusaurus Dark Mode toggles. They cause hardcoded contrast breaks when users switch themes.
- **QA Check**: The agent must reject ANY `style={{...}}` injection and suggest the equivalent Tailwind utility. `padding-top: 10px` -> `pt-2.5`.

### 5.2 Adherence to the Tailwind Config Dictionary
- The `tailwind.config.js` in Keploy contains specific brand colors:
  - `keployblue`, `keploybrightblue`, `keploypurple`, `spaceblack`, `green1`, `orange1`, `offwhite`.
- **QA Check**: If a developer uses a raw hex value in a tailwind arbitrary class: `<div className="bg-[#127AE5]">`, the agent must **WARN** and correct it to `<div className="bg-keploybrightblue">`.
- This ensures that if Keploy's branding changes, modifying the config file propagates globally, leaving no hardcoded hex traces behind.

### 5.3 Dark Mode Implementation
- Every custom component MUST support dark mode gracefully.
- Tailwind provides the `dark:` prefix.
- Docusaurus dynamically attaches the `[data-theme='dark']` attribute to the HTML tag. 
- **QA Check**: If a component defines a stark white background: `className="bg-white text-black"`, the agent must **WARN**: "This component lacks Dark Mode fallbacks. Please update to `className="bg-white text-black dark:bg-spaceblack dark:text-gray-200"`."

### 5.4 SVG Extraction
- Raw SVGs inside components should be isolated.
- While legacy components like `Product.js` contain massive SVG strings, new components must use imported SVGs or `<img src="..." />`.
- **QA Check**: If a raw string `<path d="M... ">` exceeds 300 characters inside a new component, **INFO**: "Consider abstracting this raw SVG vector data into an asset file in `./static/img/` to preserve component readability."

---

## 6. Markdown & MDX Authoring Standards

As a documentation repository, Markdown is our primary product.

### 6.1 Frontmatter Strict Enforcement
Docusaurus frontmatter dictates routing, search, and presentation.
The Agent must parse the top chunk of every modified/new `.md` / `.mdx` file.

**Required Schema for ALL docs:**
```yaml
---
id: [must be kebab-case, no spaces]
title: [Sentence Case or Title Case]
sidebar_label: [Short, scannable name]
description: [Must exist. 10-160 characters for SEO]
tags:
  - [must be lowercase array]
---
```
**QA Protocol**: If the agent catches a `.md` file with missing `description`, it must issue a **WARNING** noting that search ranking and social-share link previews heavily rely on this metadata.

### 6.2 Visual Hierarchy and Header Nesting
Semantic nesting is required for both accessibility and Docusaurus' TOC (Table of Contents) generation.
- **Rule 1**: No `<h1>` (`#`) tags inside the document. The frontmatter `title` is automatically injected as the `<h1>`.
- **Rule 2**: Headers must be sequential. Do not jump from `##` to `####`.
- **QA Protocol**: The agent must regex grab all headings. If `^#### ` exists before `^### `, issue a **WARNING**: "Heading syntax skipped a logical level. This creates broken Table of Contents linkages."

### 6.3 Admonitions Standardization
Docusaurus admonitions map out UI boxes for specific tone.
- `:::note`: General context and informational tidbits.
- `:::tip`: Helpful tricks, shortcuts, and performance gains.
- `:::info`: Core documentation objective facts.
- `:::caution`: Potentially confusing steps, deprecation warnings.
- `:::danger`: Actions causing data loss, security risks, system lockups.
- **QA Check**: Verify the `:::` block is correctly closed with a matching `:::`. Missing colons will leak raw markdown into the UI.

### 6.4 Image and Media Hygiene
All images MUST possess highly descriptive `alt="..."` tags.
- **Bad**: `![img](/static/gui.png)` or `![dashboard](/gui.png)`
- **Good**: `![Keploy KeployCloud Dashboard showing active API mock recordings](/img/gui.png)`
- **Pathing Rule**: Image paths must use absolute paths resolving from the `static` directory. Docusaurus resolves `/img/gui.png` directly to `static/img/gui.png`. Do not use `../../static/img/`.
- **QA Protocol**: Agent must extract `!\[(.*?)\]\((.*?)\)` patterns. If group 1 is empty or vague (like 'image', 'screenshot'), issue a **CRITICAL** accessibility violation. If group 2 is a relative path backing out multiple directories (`../../`), issue an **INFO** to utilize root resolution.

### 6.5 Anchor Link Validity
- Do not use absolute URL links pointing back to Keploy itself (e.g., `https://keploy.io/docs/setup`).
- Use relative paths: `[Setup](./setup.md)`. Docusaurus translates these automatically and ensures they don't break across isolated deployments or branch previews.
- **QA Protocol**: If the agent detects `href="https://keploy.io/docs/..."` or `[text](https://keploy.io/docs/...)`, it must **BLOCK**, specifying the usage of internal routing paths.

### 6.6 Component Injection into MDX
When wrapping standard JSX into MDX:
- Do not indent the JSX code syntax! Markdown parsers will interpret 4-spaces or tabs of indentation as a code-block, breaking the React render pipeline.
**Bad**:
```mdx
    <ProductTier
        plan="Enterprise" 
    />
```
**Good**:
```mdx
<ProductTier
  plan="Enterprise" 
/>
```

---

## 7. SEO, Web Vitals, & Accessibility

### 7.1 Algolia Search Engine Optimisation
- Algolia DocSearch relies on standard HTML elements to index pages.
- Avoid building complex React UI modals that hide important text data inside "state-bound" tooltips or complex unmounted accordions.
- If text is not in the DOM on initial load, Algolia cannot search it.
- **QA Protocol**: Ensure documentation primarily lives in raw text structures.

### 7.2 Core Web Vitals
- Adding heavy components damages LCP (Largest Contentful Paint) and CLS (Cumulative Layout Shift).
- If images are used inside raw HTML injections (`<img src.../>`), ensure `width` and `height` attributes are hard-specified to prevent the content from jumping when the image loads.

### 7.3 Semantic HTML Enforcement
- Avoid massive strings of nested `<div>`s.
- Use generic grouping elements appropriately:
  - `<nav>` for any on-page contextual directory.
  - `<article>` if wrapping a large standalone component.
  - `<aside>` for supplementary UI boxes (which admonitions do automatically).

---

## 8. Dependency & Package Management

### 8.1 Package Updates
- Never add UI Component Libraries.
  - E.g., `npm install @mui/material` is absolutely forbidden. Keploy docs rely on a tightly integrated custom Tailwind system.
- Never add utility tracking scripts natively unless vetted.
  - `docusaurus.config.js` already holds the analytics config (`clarity`, `gtag`, `apollo`).
- **QA Protocol**: The agent must inspect any `package.json` diff. If a library size exceeds standard expectations (e.g., adding `lodash` instead of `lodash.throttle`), it must **WARN** the developer of excessive bundle blooming.

### 8.2 Lockfile Verification
- If you modify `package.json` dependency versions, `package-lock.json` must change.
- If `yarn.lock` or `package-lock.json` magically changes without a `package.json` modification, the developer likely ran an unbounded `npm install` on a wildly different Node.js runtime, resolving disparate nested dependencies.
- **QA Protocol**: The agent must flag mismatched dependency file actions and request isolation.

---

## 9. Automated Verification & Local Testing

### 9.1 Local Building (The Ultimate Sanity Check)
Since the repository boasts zero Jest unit tests, the static compilation step IS the test.
- Every developer must execute `npm run build` locally.
- **Why**: Docusaurus `build` performs extensive validation. It verifies SSR compatibility, catches un-imported components in MDX, traps broken URLs, and validates frontmatter integrity.
- **QA Protocol**: The checklist mandates asking the developer if they have observed zero local build errors.

### 9.2 Formatting
- The project adheres to `prettier`. Pre-commit hooks (`husky` + `lint-staged`) generally manage this.
- If the PR bypasses husky entirely via `--no-verify` and commits brutally misformatted code, the GitHub actions `.github/workflows/lint.yml` and `prettify_code.yml` will trigger anomalies. The agent should be aware but default to letting GitHub actions handle syntax linting.

---

## 10. Exhaustive Code Review Checklist

This checklist is computationally analyzed and iterated upon by the QA Agent during the "Pass 1" review matrix function.

### Phase A: Architecture and Git Hygiene
- [ ] **Clean Commits**: The PR must not possess 'WIP', 'test', or 'junk' commits polluting the history.
- [ ] **Relevant Scope**: The PR description MUST answer "Why". "Adding changes" is insufficient.
- [ ] **Package Logic**: `package.json` modifications are coupled with `package-lock.json`.
- [ ] **No Dead Code**: Commented out React chunks (`{/* <OldComponent /> */}`) are erased before merging.
- [ ] **Console Cleanliness**: No `console.log()` / `console.error()` traces persist in functional code arrays.

### Phase B: React/Docusaurus Implementation
- [ ] **SSR Safe DOM Access**: Zero root-level references to `window`, `document`, `navigator`, or `localStorage` exists outside of `useEffect` arrays / `ExecutionEnvironment.canUseDOM`.
- [ ] **Component Colocation**: All generated `.js`/`.jsx` logic files reside exclusively within `src/` subdirectories (`components/`, `pages/`, `theme/`).
- [ ] **Prop Safety Defaults**: All unstructured props supply default fallbacks to prevent `undefined` runtime traps.
- [ ] **Tailwind Preeminence**: Absolutely no inline `style={{...}}` blocks are utilized. All layout geometry is managed via `className`.
- [ ] **Dark Mode Adherence**: All custom React styling implements `dark:` variant fallbacks.

### Phase C: Markdown and Text Syntax
- [ ] **Frontmatter Compliance**: All Markdown files possess valid headers comprising `id`, `title`, `sidebar_label`, `description`, etc.
- [ ] **No Level 1 Headers**: The markdown textual interior avoids `# Header` entirely, starting at `##`.
- [ ] **Relative Linking**: Internal links resolve via relative markdown queries (`[Target](./path.md)`) or root paths. Raw Keploy domains (`https://keploy.io/docs/..`) are nonexistent.
- [ ] **Asset Accessibility**: Added `<img/>` tags or `![img]()` markdown blocks specify deeply descriptive `alt` data arrays.

### Phase D: Causality and Secondary Effects (Crucial Check)
- [ ] **Prop Breakage Validation**: Modifications to shared components (`Product.js`, `QuickStartFilter.js`) cascade flawlessly. The reviewer has confirmed all reliant MDX/Parent components adapt to the modified prop interface.
- [ ] **Sidebars Integrity**: Frontmatter `id` or filename changes have updated reciprocal bindings inside `sidebars.js` / `versioned_sidebars`.
- [ ] **Versioned Docs Sync**: If bug-fixing a `versioned_docs/` variant, verify the patch carries forward to the `docs/` root module.

---

## 11. Severity Levels & Agent Review Etiquette

The QA Agent will synthesize its findings into an array of actionable responses. Each issue identified MUST be tagged with an exact severity level indicating the expected human resolution behavior.

### 🛑 CRITICAL (Merge Blocker)
**Definition**: Errors violating systemic integrity which guarantee a build crash or introduce profound security/architectural failure. The PR cannot be merged under any circumstances until resolved.
**Scenarios**: 
- Using `window.location` during an SSR render footprint.
- Syntax errors inside MDX files breaking the JSX React parser.
- Changing `sidebars.js` identifiers to unresolvable, non-existent markdown IDs (guarantees a CI build disaster).

### ⚠️ WARNING (Requires Attention)
**Definition**: Violations of code quality logic that won't break the build but severely violate project conventions, creating unmanageable tech debt.
**Scenarios**:
- Generating massive nested Javascript components inside the `/docs` folder instead of `/src/components`.
- Using hardcoded inline stylizations rather than Tailwind CSS bindings.
- Omissions of `description` or SEO data tags in frontmatter layouts.

### 📘 INFO (Stylistic & Trivial Suggestion)
**Definition**: Small, non-blocking optimizations. The PR can be safely merged, but these items should be recognized by the developer as future benchmarks.
**Scenarios**:
- Extracting inline mega-SVG strings into a standalone file.
- Correcting overly specific Tailwind groupings to more generic flexible flex layouts.

### ❓ QUESTION (Human Discretion Required)
**Definition**: The context spans beyond the analytical capacity of static interpretation. A human must manually override or provide situational awareness.
**Scenarios**:
- The developer drastically refactored the QuickStart Filtering UI schema. (The QA agent can verify syntactical safety, but a human must vet that the user experience is optimal).
- The inclusion of new script tags (e.g., analytics snippets) in `docusaurus.config.js`.

---
*Generated by the Advanced QA Autonomy System. End of File.*
