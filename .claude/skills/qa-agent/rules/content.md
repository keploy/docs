# Content Rules

This is a documentation repository with 566 Markdown or MDX files across current and versioned docs. Content quality defects are product defects here.

## Rules

1. All images must have non-empty, descriptive alt text.
   Decorative images should be explicitly treated as decorative rather than left ambiguous.

2. Links must use meaningful text.
   Avoid weak text such as `click here`, `read more`, or raw pasted URLs when a descriptive label is possible.

3. Duplicate page titles across the site should be flagged when they create navigation or search ambiguity.
   Cross-version duplicates are acceptable when they intentionally document the same topic in archived versions.

4. Broken internal anchors are `blocking`.
   A broken `#section` link in docs is a user-facing bug even if the page still builds.

5. Frontmatter must include:
   `title` required, `description` required, `tags` optional but encouraged.
   In this repo, `id` is also expected for docs pages.

6. Very short technical docs should be flagged as warnings when they are effectively stubs.
   As a heuristic, pages under roughly 300 words should be checked for completeness unless they are intentionally concise reference entries.

7. Code examples should be complete and runnable where feasible.
   Truncated examples using `...` should be flagged when they remove the critical setup or make the example misleading.

8. Future-dated content must include an explicit draft indicator before publication.

9. Docs that introduce new UI terms, product names, or workflow labels should stay consistent with nearby docs and navigation labels.

10. When a doc imports MDX components from `docs/components/` or `@site/src/components/...`, the prose still needs to stand on its own.
    Do not hide essential instructions only inside visual chrome.
