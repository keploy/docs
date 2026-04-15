# Security Rules

This repo is mostly static, but it still ships client JavaScript, external integrations, analytics hooks, public API examples, and deployment config. Review those surfaces seriously.

## Rules

1. No hardcoded secrets, API keys, access tokens, passwords, or private endpoints in any file.
   Public browser-safe keys must be intentionally public and documented as such.
   Example: `themeConfig.algolia.apiKey` in `docusaurus.config.js` is a public search key; treat similar additions with scrutiny.

2. Never place private credentials in Docusaurus config, frontmatter, static scripts, GitHub workflows, or docs examples that appear real.
   Use obvious placeholders such as `kep_...` rather than production-looking values.

3. `dangerouslySetInnerHTML` must be paired with trusted content or sanitization.
   If user-controlled HTML is ever introduced, require DOMPurify or an equivalent sanitizer.

4. No `eval()` or `new Function()` usage anywhere.

5. External redirect targets must be allowlisted and not derived from unsanitized user input.
   This matters in redirect configs like `static/_redirects` and any future runtime redirects.

6. Cookies or local storage entries that hold auth tokens must be avoided in client-side scripts unless secure handling is explicit.
   If auth is introduced, require `httpOnly` and `secure` cookies on the server side.

7. No SQL or command string interpolation in any future server helper, script, or plugin.
   Parameterize inputs.

8. File uploads or downloadable assets added to docs workflows must validate content type and size server-side if any upload path is introduced.

9. Do not log user data, secrets, or tokens to the browser console or CI logs.

10. `fetch()` or XHR calls from client code must not expose server-only credentials.
    Static scripts under `static/js/` and `static/scripts/` are public by definition.

11. Third-party scripts, analytics snippets, or chat widgets added to `docusaurus.config.js`, `static/scripts/`, or page `<Head>` output require an explicit review of origin, privacy impact, and load strategy.

12. Public API docs must not encourage insecure copy-paste examples.
    Prefer scoped keys, short-lived tokens, and clear placeholder values, as seen in `versioned_docs/version-4.0.0/running-keploy/public-api.md`.
