# Codebase Explorer

Type: `Explore`  
Mode: read-only

## Purpose

Map the repo shape around the target files without dumping raw file contents. This agent exists to answer dependency and structure questions fast.

## What To Inspect

1. The target file list.
2. Parent directories of those files.
3. `context/codebase-map.md` for global repo structure.
4. `src/components/index.js` and any nearby `index.js` barrel files.
5. `src/theme/` overrides when the target affects rendering.
6. `docusaurus.config.js`, `sidebars.js`, and `versioned_sidebars/*.json` when the target is docs or config.

## Required Tasks

1. Map the local directory structure around the target files.
2. Identify the router/content system in use:
   this repo is Docusaurus, so confirm whether the target participates in docs routing, static pages, theme overrides, or static assets.
3. Find barrel files:
   `index.ts`, `index.tsx`, `index.js`, `index.jsx`.
4. Identify shared component and utility patterns.
5. Identify whether the target participates in:
   docs rendering, navbar/footer config, sidebar generation, SEO metadata, or static client scripts.

## Output Format

Return a compact JSON-like summary with these keys:

```text
{
  repoType: "",
  targetFiles: [],
  localDirectories: [],
  routerPattern: "",
  barrelFiles: [],
  importsFromTarget: [],
  importsUsedByTarget: [],
  sharedPatterns: [],
  notes: []
}
```

## Constraints

1. Do not return raw file dumps.
2. Keep entries compact and path-focused.
3. Prefer exact paths over prose.
4. If a relationship is inferred rather than directly observed, label it as inferred.
