# Known Suppressions

Do not flag these as violations unless the suppression itself is the problem.

## Explicit Suppressions Found

1. `static/js/code-block-buttons.js`
   - Suppression: `/* eslint-disable */`
   - Reason in file: `Turn off ESLint for this file because it's sent down to users as-is.`
   - Review guidance: do not flag the file merely for disabling ESLint; review the actual browser-safety and security characteristics instead.

## TypeScript Suppression Patterns

1. No repo `.ts` or `.tsx` source files were found during reconnaissance.
2. No `@ts-ignore` or `@ts-expect-error` usage was found by the requested TypeScript-only grep.

## Deliberate Pattern Deviations

1. `docusaurus.config.js`
   - The repo uses `//@ts-check`, ESM-style imports, and `module.exports` together.
   - Treat this as an intentional Docusaurus config pattern unless a change makes the file invalid.

2. `docusaurus.config.js`
   - The docs remark pipeline temporarily prepends `// @ts-nocheck` to fenced TypeScript code blocks and strips it back out later.
   - Do not report this as a source-code suppression; it is a build-time transform for examples.

3. `sidebars.js`
   - The file is intentionally empty in the current repo state.
   - Do not flag emptiness by itself; only flag real navigation or discoverability regressions.

4. `src/theme/DocItem/index.js`
   - Breadcrumb-related rendering comments indicate an intentional SEO-driven customization.
   - Review resulting behavior, not the existence of the customization comment.
