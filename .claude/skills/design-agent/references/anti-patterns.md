# Keploy Docs anti-patterns

These are patterns already present in the repo that a design-review agent should flag in PRs instead of normalizing as "okay".

These examples are primarily copy-forward risks. Their presence in existing legacy files does not automatically mean every touched file should be rewritten unless the PR is already changing that surface in a meaningful way.

## 1. Inline styles for color, spacing, borders, or layout

What it looks like:

```jsx
<div
  style={{
    padding: "1rem",
    border: isDark ? "1px solid #333" : "1px solid #eee",
    borderRadius: "10px",
    background: isDark ? "#23272f" : "#fff8f5",
  }}
/>
```

Why it's wrong:

- It bypasses both Docusaurus theme variables and Tailwind utility conventions.
- It makes dark mode, token reuse, and visual consistency harder to review.

Correct alternative:

```jsx
<div className="rounded-xl border border-gray-200 bg-[var(--ifm-card-background-color)] p-4 dark:border-gray-700" />
```

Seen in:

- `src/components/InstallReminder.js`
- `src/components/EnterpriseInstallReminder.js`
- `src/components/SectionDivider.js`
- `src/components/StartKeploy.js`
- `src/components/StartKeployDocker.js`

## 2. Hardcoded hex colors instead of repo tokens

What it looks like:

```jsx
const chipStyles = {
  enterprise: { label: "Enterprise", color: "#7c3aed", bg: "rgba(139, 92, 246, 0.1)" },
  cloud: { label: "Cloud", color: "#2563eb", bg: "rgba(59, 130, 246, 0.1)" },
};
```

Why it's wrong:

- The repo already has Docusaurus CSS variables and a Tailwind palette.
- Repeating hardcoded hex values in component-local maps creates token drift.

Correct alternative:

```jsx
<span className="rounded-full bg-purple-100 px-2 py-1 text-purple-700 dark:bg-purple-900/30 dark:text-purple-200" />
```

Or, for doc-wide theming, prefer a class that references the theme variable:

```jsx
<span className="text-[var(--ifm-color-primary)]" />
```

Seen in:

- `src/components/DocHeaderChips.js`
- `src/components/SidebarBadge.js`
- `src/components/ProductTier.js`
- `src/components/TierCallout.js`
- `src/components/SidebarCategoryIcon.js`

## 3. Arbitrary-value classes where standard classes or shared tokens would be clearer

What it looks like:

```jsx
className="bg-[color:orange] border-[color:orange] bg-[var(--ifm-card-background-color)] shadow-[0_4px_12px_var(--ifm-card-shadow-color)]"
```

Why it's wrong:

- Arbitrary values make review harder because they hide the intended token or design choice.
- Some are especially brittle or unclear, such as `bg-[color:orange]`.

Correct alternative:

```jsx
className="bg-orange-500 border-orange-500"
```

Or:

```jsx
className="bg-[var(--ifm-card-background-color)]"
```

only when there is no standard class and the Docusaurus variable is intentional.

Seen in:

- `src/components/GSoC.js`
- `src/components/Hacktoberfest.js`
- `src/components/GitTogether.js`
- `src/components/GlossaryCard.js`
- `src/components/QuickStart.js`

## 4. Invalid JSX or SVG attribute names

What it looks like:

```jsx
<div class="flex gap-3">
```

```jsx
<path fill-rule="evenodd" clip-rule="evenodd" />
```

Why it's wrong:

- `class` should be `className` in JSX.
- SVG attributes must use camelCase in React: `fillRule`, `clipRule`.
- These issues are easy to miss visually but create avoidable warnings and inconsistency.

Correct alternative:

```jsx
<div className="flex gap-3">
```

```jsx
<path fillRule="evenodd" clipRule="evenodd" />
```

Seen in:

- `src/components/QuickStart.js`
- `src/components/Product.js`

## 5. Mixing multiple styling systems inside one component without a clear reason

What it looks like:

```jsx
<div className="quickstart-wizard">
  <style>{`...large CSS block...`}</style>
  <div className="wizard-option" style={{ flexDirection: "column" }} />
</div>
```

Why it's wrong:

- It combines Tailwind, large inline `<style>` blocks, and per-node inline styles.
- That makes future edits slower and makes consistency review harder.

Correct alternative:

- Prefer one primary system per component.
- In this repo, newer components are easiest to maintain when they stay Tailwind-first and only use CSS variables where theming requires it.

Seen in:

- `src/components/QuickStartFilter.js`

## 6. Recreating badge, chip, and metadata systems instead of reusing the existing helpers

What it looks like:

```jsx
<span className="rounded-full bg-orange-100 px-3 py-1 text-sm font-medium text-orange-600">
  Custom status
</span>
```

Why it's wrong:

- This repo already has several metadata helpers: `DocHeaderChips`, `ProductTier`, `TierCallout`, and `SidebarBadge`.
- Recreating them increases visual drift.

Correct alternative:

```jsx
<TierCallout chips={["oss", "docker"]} />
```

or

```jsx
<DocHeaderChips tier="cloud" version="4.0.0" />
```

Seen in:

- Repeated manually across several homepage sections

## 7. Introducing more legacy card styles into new sections

What it looks like:

```jsx
<div className="rounded-lg bg-[color:var(--ifm-card-background-color)] p-5 shadow-lg" />
```

Why it's wrong:

- The repo already has a visible split between older card styling and newer homepage styling.
- New work should follow the newer pattern unless it is intentionally editing a legacy section in place.

Correct alternative:

```jsx
<div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800/50" />
```

Seen in:

- `src/components/QuickStart.js`
- `src/components/SDKs.js`
- `src/components/Intro.js`
- `src/components/Product.js`
- `src/components/UtgMethods.js`

Review note:

- Prefer not to spread this pattern into new work.
- If a PR only makes a small content edit inside one of these legacy sections, do not require a full card-system rewrite unless that mismatch is central to the review.

## 8. `focus:outline-none` without a clear replacement

What it looks like:

```jsx
className="focus:outline-none"
```

Why it's wrong:

- The repo already defines global focus styling and some components add stronger `focus-visible` rings.
- Removing outlines without a replacement harms keyboard usability.

Correct alternative:

```jsx
className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ifm-color-primary)] focus-visible:ring-offset-2"
```

Seen in:

- Any new PR that removes focus styling
- Existing correct replacement examples: `src/components/WhatIsKeploy.js`, `src/components/GlossaryCard.js`, `src/pages/concepts/reference/glossary.js`, `src/components/shared/Button.js`

## 9. Duplicated IDs inside reusable components

What it looks like:

```jsx
<button id="copy-full-code">Copy</button>
```

Why it's wrong:

- Reusable components may render multiple times on one page.
- Duplicate IDs break DOM assumptions and make styling or scripting unreliable.

Correct alternative:

```jsx
<button onClick={handleCopy}>Copy</button>
```

Or generate a unique ID per instance.

Seen in:

- `src/components/CollapsibleCode.js`

## 10. Adding more one-off font systems

What it looks like:

```css
h1,
h2,
h3 {
  font-family: "SomeNewBrandFont", sans-serif;
}
```

Why it's wrong:

- The repo already mixes `DM Sans`, `Aeonik`, and local `Roboto`.
- Adding another font family worsens inconsistency.

Correct alternative:

- Reuse the existing docs body and heading stacks.
- If typography needs cleanup, centralize it in `src/css/custom.css` instead of per-component overrides.

Seen in:

- Existing font split between docs body and headings in `src/css/custom.css`
