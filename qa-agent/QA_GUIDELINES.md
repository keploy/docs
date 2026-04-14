# QA Guidelines
> Generated from codebase analysis on 2026-04-14
> These rules are derived from actual patterns in this codebase.
> Update this file when the codebase conventions change — via PR, reviewed by the team.

---

## Section 1 — Architecture rules

Rules about how code is structured and where things belong.
Derived from: the component-driven Docusaurus structure of this codebase.

### RULE-A-001: Component Colocation
**What**: React components must be placed in `src/components/` and not scattered across `docs/` or `src/pages/`.
**Why**: Ensures reusability across MDX pages. Mixing React logic inside `docs/` or `src/pages/` causes navigation bloat.
**How to check**: Look at new file additions. Anything ending in `.js` providing a UI fragment must be in `src/components/`.
**Example of violation**:
```diff
+ // docs/QuickStartWidget.js
+ export default function Widget() { return <div>Quickstart</div>; }
```
**Example of compliance**:
```diff
+ // src/components/QuickStartWidget.js
+ export default function Widget() { return <div>Quickstart</div>; }
```

### RULE-A-002: Theme Customisation
**What**: Docusaurus default overrides must go entirely in `src/theme/`.
**Why**: Docusaurus relies on specific path resolutions for "swizzled" components (Navbar, Footer, etc.). Placing them anywhere else breaks the override mechanism.
**How to check**: If a component is named identically to a Docusaurus built-in (e.g., `DocItem`, `NavbarItem`), it must reside in `src/theme/`.

---

## Section 2 — Type safety rules

Rules about TypeScript / type usage derived from this codebase's type discipline.

### RULE-T-001: Pure JavaScript over TypeScript
**What**: Avoid introducing `.ts` or `.tsx` files without a concerted architectural shift.
**Why**: This codebase is 100% JavaScript (uses `.js` extensively). The linter checks `.js` with `eslint-plugin-react`. Sneaking in `.ts` files may cause webpack loaders or linters to fail or result in inconsistent type disciplines.
**How to check**: Fail if `*.ts` or `*.tsx` extensions are added unless `tsconfig.json` changes accompany them.
**Example of violation**:
```diff
+ // src/components/Community.tsx
```

---

## Section 3 — Error handling rules

Rules derived from how this codebase handles errors.

### RULE-E-001: Component Fallbacks
**What**: Complex components (like filtering or routing logic) must wrap internal evaluation in basic try/catch if accessing browser APIs.
**Why**: Docusaurus pre-renders (SSR) static HTML. Accessing `window` or `document` unprotected breaks the `npm run build` process instantly.
**How to check**: Look for `window.` or `document.` accesses. They must be inside `useEffect()` hooks or `ExecutionEnvironment.canUseDOM` conditions.
**Example of violation**:
```javascript
const url = window.location.href; // Breaks Docusaurus SSR build
```

---

## Section 4 — API and data layer rules

Rules about how routes are defined, validated, and how data is accessed.

### RULE-D-001: No Server-Side Fetching in Components
**What**: Avoid complex fetching loops in components.
**Why**: Docusaurus generates a static site. Dynamic data fetching at runtime causes content shifting and defeats the purpose of SEO-optimized markdown documentation. 
**How to check**: Flag usages of `fetch()` or `axios(...)` in components unless wrapped strictly with `useEffect()` for non-critical secondary info (like stars count).

---

## Section 5 — Testing rules

Rules about what must be tested, how tests must be structured in this codebase.

**Minimum test requirements for a PR to pass**:
Currently, the codebase has 0% test coverage and uses NO testing framework, so there are no test requirements.

- [ ] (INFO) Observe that no tests are required for now until a framework is established. If someone adds a test file, check if it's accompanied by `package.json` configurations (Jest, Vitest).

---

## Section 6 — Naming and style rules

Rules about naming derived from actual naming patterns in this codebase.

### RULE-N-001: PascalCase for React Components
**What**: All components and their filenames must use `PascalCase`.
**Why**: This is the strict pattern in `src/components/` (e.g., `QuickStartFilter.js`, `GetStartedPaths.js`). It prevents case collision across case-sensitive file systems (Linux vs macOS).
**How to check**: Ensure `src/components/[file].js` starts with a capital letter.

---

## Section 7 — Dependency rules

Rules about adding, updating, or removing dependencies.

### RULE-DEP-001: No Heavy UI Libraries
**What**: Do not add heavy UI component libraries (like Material UI or Ant Design).
**Why**: The project heavily utilizes TailwindCSS (`tailwindcss`) and custom styles in `src/css/styles.module.css`. Mixing CSS-in-JS abstractions bloats the bundle and creates clashing layouts.
**How to check**: Check `package.json` diff for adding new dependencies starting with `@mui`, `antd`, etc. Approved styling is TailwindCSS.

---

## Section 8 — Breaking change detection rules

THIS IS THE MOST IMPORTANT SECTION.

### RULE-B-001: `src/components/Product.js` interface stability
**What this module provides**: The primary logic and layout for product description loops and UI structure on landing/docs.
**Files that depend on it**: Root pages, docs routing.
**What a change here can break**: The entire aesthetic of the landing pages and main documentation entry forms.
**What to check when this file is modified**:
- Ensure all tailwind classes added relate to valid defined `keploy` colors in `tailwind.config.js`.
- If prop types changed, ensure there's no runtime breakage.

### RULE-B-002: `src/components/QuickStartFilter.js` and `QuickStartList.js`
**What this model represents**: Filter selection for multiple platforms and SDKs on quickstart pages.
**Files that use this model**: MDX docs relying on quickstart grids.
**What a change here can break**: Users are heavily reliant on Quickstart paths. Breaking this component means users cannot pick their platform (Linux, macOS, Windows).
**What to check when this file is modified**:
- Ensure the state toggle (`useState`) successfully maps to valid component returns.
- Flag changes to SDK names if they break hardcoded object lookups.

### RULE-B-003: `docusaurus.config.js` and `sidebars.js`
**What this model represents**: Global configuration and navigation schema.
**Files that use this model**: Docusaurus router.
**What a change here can break**: The entire site build. Broken paths will throw "broken-links" errors in `docusaurus build`.
**What to check when this file is modified**:
- Check for trailing slashes matching previous patterns.
- Validate `url` or `href` objects inside navbar arrays.

---

## Section 9 — PR checklist

A mechanical checklist the agent runs on every PR regardless of what changed.

- [ ] PR has a description (not empty)
- [ ] PR description explains WHY not just WHAT
- [ ] No files contain new TODO/FIXME without an associated issue number
- [ ] No `console.log` statements left in production code (unless inside a commented explanatory code block inside MDX).
- [ ] No commented-out large React UI blocks added.
- [ ] Diff does not include `yarn.lock` or `package-lock.json` changes without `package.json` changes.
- [ ] No `window.` DOM assignments in raw Component scope without SSR safety (`useEffect`).
- [ ] Tailwind class modifications use standard keys provided in `tailwind.config.js`.

---

## Section 10 — Severity levels

When the agent reports an issue, it must use one of these levels:

**CRITICAL** — must be fixed before merge. Breaks existing functionality (SSR build issues), introduces security issue, or violates a rule with no safe exceptions.

**WARNING** — should be fixed, but merge is not blocked. Inconsistent with conventions, reduces quality, or introduces technical debt.

**INFO** — observation or suggestion. Improvement opportunity, not a violation.

**QUESTION** — the agent cannot determine if this is correct without human context. Flags for reviewer attention.
