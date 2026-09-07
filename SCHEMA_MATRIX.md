# Structured Data (Schema.org) Matrix

A map of every JSON-LD `schema.org` type emitted across the docs site, the
source that emits it, and the pages/components it applies to. Introduced in
[PR #897](https://github.com/keploy/docs/pull/897) (site health + AI-citation
fixes). Use this as the single reference when adding, moving, or debugging
structured data.

> **Why this exists:** JSON-LD nodes that share an `@id` are merged by
> consumers (Google, LLM answer engines). Canonical entities are declared once
> in `src/schema/siteEntities.js` and referenced by `@id` everywhere else, so
> the graph stays consistent. See the header comment in that file.

## 1. Site-wide graph (every route)

Injected into the `<head>` of **every** page via `headTags` in
`docusaurus.config.js` (`innerHTML: JSON.stringify(siteGraph)`).

| Schema type          | `@id`                          | Source                                | Applies to |
| -------------------- | ------------------------------ | ------------------------------------- | ---------- |
| `Organization`       | `https://keploy.io/#organization` | `src/schema/siteEntities.js` → `siteGraph` | All routes |
| `WebSite`            | `https://keploy.io/docs/#website` | `src/schema/siteEntities.js` → `siteGraph` | All routes |
| `SoftwareApplication`| `https://keploy.io/#keploy`    | `src/schema/siteEntities.js` → `siteGraph` | All routes |
| `ImageObject`        | `https://keploy.io/#logo`      | nested in `Organization.logo`         | All routes |
| `SearchAction`       | —                              | nested in `WebSite.potentialAction` (sitelinks search box) | All routes |

These three nodes are referenced by `@id` (`organizationRef`, `websiteRef`)
from the per-page schemas below, so the per-page nodes never re-declare the
publisher/author organization.

## 2. Per-doc schema (Markdown pages via `DocItem`)

Emitted by `src/theme/DocItem/index.js` for pages rendered through the docs
theme. Type is chosen per page from front matter, path, and content.

| Schema type              | When it applies                                                                 | Key logic in `DocItem` |
| ------------------------ | ------------------------------------------------------------------------------- | ---------------------- |
| `TechArticle`            | Default for any normal doc page                                                 | `schemaType` fallback |
| `APIReference`           | `/running-keploy/public-api` and `/running-keploy/cli-commands`, or `apiReference: true` / `type: api` front matter | `isApi` |
| `BlogPosting`            | `type: blog` / `blog: true` front matter, or `blog` tag                          | `isBlog` |
| `[<type>, LearningResource]` | Quickstart tutorials — `/quickstart/<name>/`; adds `learningResourceType: "Tutorial"` | `isQuickstart` |
| Custom via front matter  | `schemaType:` / `schema_type:` front matter overrides all detection             | `schemaTypeFromFrontMatter` |
| `DefinedTerm`            | Glossary term pages — `/concepts/reference/glossary/<term>/`; joins the glossary `DefinedTermSet` by `@id` | `isGlossaryTerm` |
| `CollectionPage`         | Section index pages (source is `index.md`/`README.md`, not the docs root)        | `isCategoryHub` |
| *(suppressed)*           | Docs root, versioned roots (`/docs/4.0.0/`), category index pages — emit only breadcrumbs | `suppressArticleSchema` |

Every `Article`-family node references `organizationRef` (publisher/author
fallback) and `websiteRef` (`isPartOf`), and carries a fallback social-card
`image` (`static/img/keploy-docs-card.png`).

## 3. Breadcrumbs (docs pages)

| Schema type       | Source                          | Applies to |
| ----------------- | ------------------------------- | ---------- |
| `BreadcrumbList` + `ListItem` | `src/theme/DocBreadcrumbs/index.js` | Every docs page with a breadcrumb trail |
| `BreadcrumbList` + `ListItem` | `breadcrumbList()` helper in `siteEntities.js` | Bespoke React pages (see §5) |

## 4. Content-injected schema (Markdown authoring)

| Schema type | Source | Applies to |
| ----------- | ------ | ---------- |
| `FAQPage` → `Question` / `Answer` | `src/remark/remarkFaqSchema.js` (remark plugin, wired in `docusaurus.config.js`) | `*-faq.md` pages: `keploy-explained/api-testing-faq`, `integration-testing-faq`, `unit-testing-faq` |
| `HowTo` → `HowToStep`, `HowToSupply`, `HowToTool`, `MonetaryAmount` | `src/components/HowTo.js` (used as `<HowTo>` in MDX) | ~44 quickstart / installation / server docs |

The `remarkFaqSchema` plugin auto-detects FAQ docs by the `-faq.md` filename,
turns each `##`/`###` heading into a `Question`, and only emits when it finds
≥2 Q&A pairs (skips the `## Related` divider).

## 5. Bespoke React pages (`src/pages/*`)

Each hand-built page emits its own JSON-LD, using `organizationRef` /
`websiteRef` / `breadcrumbList()` from `siteEntities.js` for consistency.

| Page (route)                                   | Source                                   | Schema types emitted |
| ---------------------------------------------- | ---------------------------------------- | -------------------- |
| Home (`/docs/`)                                | `src/pages/index.js`                     | `CollectionPage`, `ItemList` + `ListItem`, `BreadcrumbList` |
| About (`/about`)                               | `src/pages/about.js`                     | `AboutPage`, `BreadcrumbList` |
| Leadership (`/leadership`)                     | `src/pages/leadership.js`                | `CollectionPage`, `ItemList` + `ListItem`, `Person` |
| Application Development (`/application-development`) | `src/pages/application-development.js` | `WebPage`, `ItemList` + `ListItem`, `BreadcrumbList` |
| Security (`/security`)                         | `src/pages/security.js`                  | `WebPage`, `Organization`, `ContactPoint` |
| Privacy Policy (`/privacy-policy`)             | `src/pages/privacy-policy.js`            | `DigitalDocument` |
| Glossary hub (`/concepts/reference/glossary/`) | `src/pages/concepts/reference/glossary.js` | `DefinedTermSet` + `DefinedTerm`, `BreadcrumbList` |
| Community                                      | `src/components/Community.js`            | `ItemList` + `ListItem` |

The glossary hub's `DefinedTermSet` (`@id` = `TERMSET_ID`) is the set that each
individual glossary term page's `DefinedTerm` (§2) joins via `inDefinedTermSet`.

## Quick reference: type → source

| Schema type            | Emitted by |
| ---------------------- | ---------- |
| `Organization`         | `siteEntities.js` (site graph); `security.js` |
| `WebSite`              | `siteEntities.js` (site graph) |
| `SoftwareApplication`  | `siteEntities.js` (site graph) |
| `ImageObject`          | `siteEntities.js` (nested in Organization) |
| `SearchAction`         | `siteEntities.js` (nested in WebSite) |
| `TechArticle` / `APIReference` / `BlogPosting` | `DocItem/index.js` |
| `LearningResource`     | `DocItem/index.js` (quickstarts) |
| `DefinedTerm`          | `DocItem/index.js` (term pages); `glossary.js` (hub) |
| `DefinedTermSet`       | `glossary.js` |
| `CollectionPage`       | `DocItem/index.js` (section hubs); `index.js`; `leadership.js` |
| `BreadcrumbList` / `ListItem` | `DocBreadcrumbs/index.js`; `siteEntities.js` helper |
| `FAQPage` / `Question` / `Answer` | `remarkFaqSchema.js` |
| `HowTo` / `HowToStep` / `HowToSupply` / `HowToTool` / `MonetaryAmount` | `HowTo.js` |
| `AboutPage`            | `about.js` |
| `WebPage`              | `security.js`; `application-development.js` |
| `ContactPoint`        | `security.js` |
| `DigitalDocument`      | `privacy-policy.js` |
| `Person`               | `leadership.js` |
| `ItemList` / `ListItem` | `index.js`; `leadership.js`; `application-development.js`; `Community.js` |

---

_Generated as a reference for the structured-data work in PR #897. When you add
a new schema emitter or change a type, update this table._
