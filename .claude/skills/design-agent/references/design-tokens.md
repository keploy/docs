# Keploy Docs design tokens

This repo does not have a single token source of truth. Core theme tokens live in [`src/css/custom.css`](/Users/amaan-bhati/Documents/docs/src/css/custom.css), custom Tailwind extensions live in [`tailwind.config.js`](/Users/amaan-bhati/Documents/docs/tailwind.config.js), and newer components also use Tailwind's default palette directly. Sections marked `[inferred]` come from repeated class usage rather than explicit config.

## Stack

| Area | Value | Source |
| --- | --- | --- |
| Site framework | Docusaurus 3.9.2 with React 18 | `package.json`, `docusaurus.config.js` |
| Styling system | Tailwind CSS 3 + Docusaurus/Infima + plain CSS + CSS Modules + component-local `<style>` blocks | `package.json`, `tailwind.config.js`, `src/css/custom.css` |
| Tailwind plugin | `@tailwindcss/typography` | `tailwind.config.js` |
| Tailwind preflight | Disabled | `tailwind.config.js` |
| Component helpers | Docusaurus theme components, `react-icons`, `react-player` | `package.json`, `src/components`, `src/theme` |
| Component library status | No external UI kit such as shadcn/ui, Radix, Chakra, or MUI | repo scan |

## Theme colors

### Docusaurus CSS variables

| Token | Light value | Dark value | Source |
| --- | --- | --- | --- |
| `--ifm-color-primary` | `#ff914d` | `#ff914d` | `src/css/custom.css` |
| `--ifm-color-primary-dark` | `#e67643` | `#e67643` | `src/css/custom.css` |
| `--ifm-color-primary-darker` | `#c95919` | `#c95919` | `src/css/custom.css` |
| `--ifm-color-primary-darkest` | `#be2c1b` | `#be2c1b` | `src/css/custom.css` |
| `--ifm-color-primary-light` | `#ffd0a0` | `#ffd0a0` | `src/css/custom.css` |
| `--ifm-color-primary-lightest` | `#ffceb1` | `#ffceb1` | `src/css/custom.css` |
| `--ifm-color-primary-lighter` | `#fff` | `#fff` | `src/css/custom.css` |
| `--ifm-color` | `#00163d` | `#f5f6f7` | `src/css/custom.css` |
| `--ifm-background-color` | `rgb(249, 250, 251)` | `#141414` | `src/css/custom.css` |
| `--ifm-footer-background-color` | `#ffffff` | `#000000` | `src/css/custom.css` |
| `--ifm-card-background-color` | `#ffffff` | `#1a1a1a` | `src/css/custom.css` |
| `--ifm-card-shadow-color` | `rgba(0, 0, 0, 0.2)` | `rgba(255, 255, 255, 0.2)` | `src/css/custom.css` |
| `--ifm-badge-background-color` | `rgba(239, 246, 255)` | `#f88e34` | `src/css/custom.css` |
| `--card-color` | `rgba(239, 246, 255)` | `rgba(17, 24, 39)` | `src/css/custom.css` |
| `--ifm-code-background` | `#fff7ed` | `rgba(251, 146, 60, 0.2)` | `src/css/custom.css` |
| `--ifm-code-color` | `#c2410c` | `#fb923c` | `src/css/custom.css` |
| `--ifm-code-border-color` | not set | `rgba(251, 146, 60, 0.4)` | `src/css/custom.css` |
| `--ifm-blockquote-color` | `#000000` | `#eeeeee` | `src/css/custom.css` |
| `--ifm-color-emphasis-300` | `#505050` | inherited | `src/css/custom.css` |
| `--ifm-color-input-background` | `#ffffff` | inherited | `src/css/custom.css` |
| `--collapse-button-bg-color-dark` | inherited | `transparent` | `src/css/custom.css` |

### Tailwind custom colors

| Tailwind token | Value | Source |
| --- | --- | --- |
| `offwhite` | `#F2F2F2` | `tailwind.config.js` |
| `keployblue` | `#B2E7EA` | `tailwind.config.js` |
| `keploybrightblue` | `#127AE5` | `tailwind.config.js` |
| `keploypurple` | `#B8B4DC` | `tailwind.config.js` |
| `keploybrightpurple` | `#8F86DA` | `tailwind.config.js` |
| `spaceblack` | `#141414` | `tailwind.config.js` |
| `green1` | `#9EE587` | `tailwind.config.js` |
| `green2` | `#32D67B` | `tailwind.config.js` |
| `orange1` | `#FFA280` | `tailwind.config.js` |
| `orange2` | `#FF7065` | `tailwind.config.js` |
| `gray5` | `#E0E0E0` | `tailwind.config.js` |
| `lightgray` | `rgba(242,242,242,0.5)` | `tailwind.config.js` |
| `lightteal` | `#C7EDEF` | `tailwind.config.js` |

### Tailwind default palettes actively used `[inferred]`

These classes appear repeatedly in newer components. They are not customized in `tailwind.config.js`; values come from Tailwind defaults used by Tailwind CSS 3.

| Family | Exact class/value mappings used in repo | Typical usage |
| --- | --- | --- |
| `gray` | `gray-50 #f9fafb`, `gray-100 #f3f4f6`, `gray-200 #e5e7eb`, `gray-300 #d1d5db`, `gray-400 #9ca3af`, `gray-500 #6b7280`, `gray-600 #4b5563`, `gray-700 #374151`, `gray-800 #1f2937`, `gray-900 #111827`, `gray-950 #030712` | text, borders, dark surfaces, neutral CTAs |
| `orange` | `orange-50 #fff7ed`, `orange-100 #ffedd5`, `orange-300 #fdba74`, `orange-400 #fb923c`, `orange-500 #f97316`, `orange-600 #ea580c`, `orange-700 #c2410c`, `orange-900 #7c2d12` | primary accent, CTA backgrounds, highlight borders |
| `purple` | `purple-50 #faf5ff`, `purple-100 #f3e8ff`, `purple-200 #e9d5ff`, `purple-300 #d8b4fe`, `purple-400 #c084fc`, `purple-500 #a855f7`, `purple-600 #9333ea`, `purple-700 #7e22ce`, `purple-800 #6b21a8`, `purple-900 #581c87` | secondary accent, chips, cards |
| `indigo` | `indigo-100 #e0e7ff`, `indigo-200 #c7d2fe`, `indigo-300 #a5b4fc`, `indigo-400 #818cf8`, `indigo-500 #6366f1`, `indigo-600 #4f46e5`, `indigo-700 #4338ca`, `indigo-900 #312e81` | enterprise/security section accents |
| `blue` | `blue-50 #eff6ff`, `blue-100 #dbeafe`, `blue-200 #bfdbfe`, `blue-300 #93c5fd`, `blue-400 #60a5fa`, `blue-500 #3b82f6`, `blue-600 #2563eb`, `blue-700 #1d4ed8`, `blue-900 #1e3a8a` | cloud and GSoC banners |
| `green` | `green-100 #dcfce7`, `green-400 #4ade80`, `green-500 #22c55e`, `green-600 #16a34a`, `green-700 #15803d`, `green-900 #14532d` | success and checklist accents |
| `amber` | `amber-50 #fffbeb`, `amber-100 #fef3c7`, `amber-200 #fde68a`, `amber-300 #fcd34d`, `amber-400 #fbbf24`, `amber-500 #f59e0b`, `amber-600 #d97706`, `amber-700 #b45309`, `amber-900 #78350f` | sponsorship program callouts |
| `red` | `red-100 #fee2e2`, `red-400 #f87171`, `red-600 #dc2626`, `red-900 #7f1d1d` | YouTube and error-adjacent accent use |
| `pink` | `pink-400 #f472b6`, `pink-600 #db2777`, `pink-900 #831843` | gradient support accents |
| `cyan` | `cyan-50 #ecfeff` | secondary gradient support |

## Typography

### Font families

| Usage | Value | Source |
| --- | --- | --- |
| Global docs body copy | `"DM Sans", sans-serif !important` | `docusaurus.config.js`, `src/css/custom.css` |
| Code and preformatted text | `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace` | `src/css/custom.css` |
| Headings, navbar, menu | `"Aeonik", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"` | `src/css/custom.css` |
| Local font faces | `Roboto` weights `300`, `400`, `700`; `fontFamily.light = ["Roboto Light", "sans"]` | `src/css/custom.css`, `tailwind.config.js` |

Note: `Aeonik` is referenced but not loaded anywhere in this repo. `DM Sans` is loaded via Google Fonts in `docusaurus.config.js`.

### Font sizes and line heights

#### Explicit custom Tailwind extensions

| Token | Value | Source |
| --- | --- | --- |
| `text-17` | `17px` | `tailwind.config.js` |
| `text-60` | `60px` | `tailwind.config.js` |
| `text-144` | `144px` | `tailwind.config.js` |
| `leading-25` | `25px` | `tailwind.config.js` |
| `leading-36` | `36px` | `tailwind.config.js` |
| `leading-48` | `48px` | `tailwind.config.js` |
| `leading-60` | `60px` | `tailwind.config.js` |
| `leading-72` | `72px` | `tailwind.config.js` |
| `leading-144` | `144px` | `tailwind.config.js` |
| Root font size | `18px` | `src/css/custom.css` |
| Root line height | `1.6` | `src/css/custom.css` |

#### Common text utilities in active components `[inferred]`

| Utility | Meaning | Seen in |
| --- | --- | --- |
| `text-xs` | compact helper text, eyebrow metadata | section pills, chips, captions |
| `text-sm` | card body, CTA labels, chip labels | most cards and option rows |
| `text-base` | longer narrative copy | section intros, narrative blurbs |
| `text-lg` | subheads and strong support text | card titles and banner headings |
| `text-xl` | prominent card titles | feature cards and banners |
| `text-2xl` | legacy section titles | older homepage/MDX helpers |
| `text-3xl md:text-4xl` | current homepage section titles | `GetStartedPaths`, `QuickStartTabs`, `TestingCapabilities`, `Community`, `EcosystemSupport`, `WhatIsKeploy` |

### Prose and markdown overrides

| Rule | Value | Source |
| --- | --- | --- |
| `prose` wrapper | `md:prose-md prose mx-auto my-12 max-w-full px-2 lg:prose-lg md:px-6` | `src/theme/DocItem/index.js` |
| Link color in prose | `#E67643`, hover `#C95919` | `tailwind.config.js` typography extension |
| Heading prose color | `var(--ifm-color)` | `tailwind.config.js` typography extension |
| Code radius | `0.25rem` | `tailwind.config.js` typography extension |
| Inline code padding | `0.15rem 0.3rem` | `tailwind.config.js` typography extension |
| Images in prose | `borderRadius: 0.5rem`, `display: inline` | `tailwind.config.js` typography extension |
| `h1` docs header effect | soft gradient text fill | `src/css/custom.css` |

## Spacing scale

No custom spacing scale is defined in `tailwind.config.js`. The repo uses Tailwind's default spacing utilities heavily.

### Most common spacing classes `[inferred]`

| Utility | Default Tailwind value | Typical usage |
| --- | --- | --- |
| `p-3` | `0.75rem` | nested option rows |
| `p-4` | `1rem` | smaller cards and nested panels |
| `p-5` | `1.25rem` | older legacy cards |
| `p-6` | `1.5rem` | primary card padding |
| `px-3 py-1` | `0.75rem` x `0.25rem` | pills and eyebrow labels |
| `px-5 py-2.5` | `1.25rem` x `0.625rem` | medium CTA buttons |
| `px-5 py-3` | `1.25rem` x `0.75rem` | large CTA buttons |
| `gap-2` | `0.5rem` | chips, inline metadata |
| `gap-3` | `0.75rem` | option rows |
| `gap-4` | `1rem` | icon/content rows |
| `gap-6` | `1.5rem` | section grids |
| `mb-2` | `0.5rem` | eyebrow-to-heading spacing |
| `mb-3` | `0.75rem` | heading-to-copy spacing |
| `mb-6` | `1.5rem` | content block spacing |
| `mb-8` | `2rem` | section header spacing |
| `mb-12` | `3rem` | section separation |
| `mb-16` | `4rem` | large section separation |
| `md:p-10` | `2.5rem` | homepage shell padding |

## Radii

| Token/class | Value | Source |
| --- | --- | --- |
| `--ifm-code-border-radius` | `6px` | `src/css/custom.css` |
| `rounded-md` | Tailwind default `0.375rem` `[inferred]` | `shared/Button.js`, newer buttons |
| `rounded-lg` | Tailwind default `0.5rem` `[inferred]` | legacy cards, player shell |
| `rounded-xl` | Tailwind default `0.75rem` `[inferred]` | newer CTAs, nested cards |
| `rounded-2xl` | Tailwind default `1rem` `[inferred]` | primary modern card surfaces |
| `rounded-full` | full pill radius `[inferred]` | badges and pills |
| image radius in prose | `0.5rem` | `tailwind.config.js` typography extension |

## Shadows

| Token/class | Value | Source |
| --- | --- | --- |
| `shadow-keployblue` | `0 25px 50px -12px rgba(178, 231, 234, 0.1)` | `tailwind.config.js` |
| `shadow-sm` | Tailwind default `[inferred]` | newer cards |
| `shadow-md` | Tailwind default `[inferred]` | hover states and glossary buttons |
| `shadow-lg` | Tailwind default `[inferred]` | prominent cards and CTAs |
| `shadow-[0_4px_12px_var(--ifm-card-shadow-color)]` | custom arbitrary value | `GlossaryCard.js` |
| `shadow-[0_8px_20px_var(--ifm-card-shadow-color)]` | custom arbitrary value | `GlossaryCard.js` |

## Layout widths and sizing

### Explicit Tailwind extensions

| Token | Value | Source |
| --- | --- | --- |
| `grid-cols-usecases` | `200px minmax(0, 1fr)` | `tailwind.config.js` |
| `max-w-700` | `700px` | `tailwind.config.js` |
| `w-200` | `200px` | `tailwind.config.js` |
| `w-300` | `300px` | `tailwind.config.js` |
| `w-700` | `700px` | `tailwind.config.js` |
| `w-800` | `800px` | `tailwind.config.js` |
| `w-3/1` | `300%` | `tailwind.config.js` |
| `h-60` | `60px` | `tailwind.config.js` |
| `h-200` | `200px` | `tailwind.config.js` |
| `h-300` | `300px` | `tailwind.config.js` |
| `h-400` | `400px` | `tailwind.config.js` |
| `h-700` | `700px` | `tailwind.config.js` |
| `h-800` | `800px` | `tailwind.config.js` |
| `h-3/1` | `300%` | `tailwind.config.js` |

### Common width patterns `[inferred]`

| Utility | Typical usage |
| --- | --- |
| `max-w-screen-lg` | homepage container |
| `max-w-2xl`, `max-w-3xl`, `max-w-5xl`, `max-w-6xl` | section copy and grid wrappers |
| `w-full` | cards, sections, nav shell |
| `min-h-[92px]` | nested quickstart option rows |

## Breakpoints

No custom `screens` are defined in `tailwind.config.js`; the repo relies on Tailwind defaults.

| Breakpoint | Value | Evidence |
| --- | --- | --- |
| `md` | `768px` `[inferred]` | `md:grid-cols-2`, `md:grid-cols-3`, `md:text-4xl`, `md:p-10` across `src/components` and `src/pages/index.js` |
| `lg` | `1024px` `[inferred]` | `lg:gap-8`, `lg:px-10`, `lg:prose-lg` |
| `xl` | `1280px` `[inferred]` | `xl:gap-8` in legacy sections |
| Docusaurus desktop layout breakpoint | `997px` | `src/theme/DocItem/styles.module.css` |

## Motion

| Token | Value | Source |
| --- | --- | --- |
| `transitionDelay.3000` | `3000ms` | `tailwind.config.js` |
| `fade-in-down` keyframes | opacity `0` to `1`, translateY `-10px` to `0` | `tailwind.config.js` |
| `animate-fade-in-down` | `fade-in-down 0.5s ease-out` | `tailwind.config.js` |

## Focus and accessibility styling

| Rule | Value | Source |
| --- | --- | --- |
| Global focus visible | `outline: 2px solid #2563eb; outline-offset: 2px` | `src/css/custom.css` |
| Interactive overrides | `button:focus-visible`, `a:focus-visible`, `input:focus-visible` use orange outline `rgba(255, 145, 77, 0.5)` | `src/css/custom.css` |
| Code block copy button visibility | visible on container focus-within and button focus-visible | `src/css/custom.css` |
