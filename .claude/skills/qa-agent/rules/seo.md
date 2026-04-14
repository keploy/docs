# SEO Rules

SEO is a first-class concern in this repo. Recent commits heavily modify sitemap, schema, keywords, redirects, titles, breadcrumbs, and llms files. Treat regressions seriously.

## Rules

1. Broken internal links are `blocking`.
   They harm users and search crawling, and this repo is configured to fail on broken links.

2. Every new or materially updated docs page must have a unique `title` and a meaningful `description`.

3. Strategic pages such as landing pages, installation guides, API docs, and glossary entries should provide social image coverage.
   `src/theme/DocItem/index.js` already emits `og:image` and `twitter:image` when a page image is available.

4. Canonical URL behavior must not regress.
   Changes to `docusaurus.config.js`, `src/theme/DocItem/index.js`, redirects, or permalink/frontmatter logic that break canonical consistency are `blocking`.

5. Do not remove or degrade structured data without a clear reason.
   The repo currently emits JSON-LD from `docusaurus.config.js`, `src/theme/DocItem/index.js`, and `src/pages/index.js`.

6. Page titles and descriptions should not be duplicated across unrelated current-version pages.

7. Avoid hardcoded absolute docs URLs when a stable internal doc link would prevent redirect churn.

8. New images intended for sharing should be crawlable, stable, and sized appropriately for previews.

9. Updates to `static/llms.txt`, `static/llms-full.txt`, sitemap behavior, redirects, or breadcrumb logic need explicit QA because they affect discoverability beyond the rendered page.

10. Redirect changes in `static/_redirects`, `vercel.json`, or future config must preserve the canonical destination and avoid chains where practical.
