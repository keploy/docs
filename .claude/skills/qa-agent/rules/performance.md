# Performance Rules

This repository is a statically built Docusaurus site with client-side React components, theme overrides, and browser scripts.

## Rules

1. No synchronous file I/O in build hooks, plugins, or request-like handlers.
   If new plugin code is added under `plugins/`, prefer async APIs.

2. No `useEffect` that fetches data without cleanup or cancellation.
   This applies to interactive components under `src/components/` and `src/theme/`.

3. Recommend `React.memo` for components rendered repeatedly in lists when they receive complex object props and show measurable churn.
   Do not add it blindly.

4. No anonymous functions as default props or other patterns that create avoidable rerenders in hot list components.

5. Dynamic import or code splitting is recommended for unusually heavy interactive components, media players, or third-party widgets.
   `src/components/responsive-player/ResponsivePlayer.js` is the sort of component where weight matters.

6. Do not import an entire utility library when a narrow import will do.

7. Images used in prominent content should declare dimensions or use a rendering strategy that avoids layout shift.
   This is blocking for above-the-fold hero content or shared page chrome.

8. Avoid blocking external scripts in document head.
   JSON-LD scripts are acceptable.
   External analytics, chat, or widget scripts should be deferred or loaded through a controlled client hook.

9. When multiple independent async tasks are introduced in plugin or build code, prefer `Promise.all()` over unnecessary sequential waits.

10. Shared theme files such as `src/theme/DocItem/index.js` and `src/pages/index.js` are performance-sensitive because they affect many pages.
    Avoid expensive per-render work that could be hoisted or simplified.

11. Static browser scripts under `static/js/` should operate incrementally on the DOM and avoid full-document rescans where practical.

12. Large numbers of new images, diagrams, or GIFs in `static/` should be reviewed for size and format choice.
    Prefer SVG when vector art is sufficient; avoid oversized GIFs when MP4 or optimized alternatives would perform better.
