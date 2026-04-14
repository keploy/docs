# TypeScript Rules

This repository has no first-class `.ts` or `.tsx` source files today and no root `tsconfig.json`, but it does ship TypeScript dependencies and transforms TypeScript code examples in `docusaurus.config.js`. Apply these rules only when reviewing:

1. newly added `.ts` or `.tsx` files
2. plugin code that introduces TypeScript
3. fenced TypeScript examples in docs where correctness is part of the feature

## Rules

1. No `any` type.
   Use `unknown` plus narrowing, or define the actual shape.

2. No non-null assertions (`!`) without an inline comment explaining why the value is safe.

3. No `@ts-ignore` without a clear reason.
   Prefer `@ts-expect-error` with a comment when suppression is truly required.

4. All exported functions must have explicit return types.

5. Do not use `as Type` to coerce data from external sources such as API responses, `process.env`, or untyped JSON without validation.

6. Prefer string literal unions over broad enums unless the enum is shared, stable, and justified.

7. Do not leave implicit `any` from untyped third-party packages unresolved.
   Add `@types/*`, a local declaration, or wrap the boundary safely.

8. Generic parameter names must be descriptive when the type carries domain meaning.
   `TValue` is acceptable when the generic has a specific role; bare `T` or `U` is only acceptable for very local conventional helpers.

9. For docs examples, the code shown to readers must still be type-sound even though the site temporarily prepends `// @ts-nocheck` during remark processing.
   That transform exists to keep docs builds flexible, not to excuse broken examples.
