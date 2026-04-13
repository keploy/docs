# Design Review Agent (Keploy Docs)

This repo contains a hardened Design Review Agent that reviews **PR diffs** for UI/design quality and posts an **upserted** PR comment.

## Architecture

- **Guidelines sources (merged at runtime)**
  - **Common/private** guidelines: fetched at runtime from `keploy/landing-page` via GitHub REST *contents* API (requires `DESIGN_COMMONS_TOKEN`).
  - **Repo-specific** guidelines: `design-agent/DOCS_DESIGN_GUIDELINES.md` (committed in this repo).
  - Merge order: **COMMON first**, then **DOCS**.
- **Diff source**
  - Uses GitHub REST API `pulls/{pull_number}/files` to fetch changed files + patches.
  - Filters to design-relevant files/paths/extensions and excludes `design-agent/DOCS_DESIGN_GUIDELINES.md` from the diff payload to avoid circular review.
- **LLM**
  - Uses Anthropic via `anthropic==0.40.0`.
  - Enforces a strict output template + verdict parsing (job fails on malformed output).
- **Commenting**
  - Upserts a single PR comment using a hidden marker: `<!-- design-agent-review-comment -->`.

## Security notes

- **Trusted trigger only**: the workflow only runs on an explicit `/design-review` comment (and only from `OWNER`, `MEMBER`, or `COLLABORATOR`) or via `workflow_dispatch`.
- **Fork safety**
  - The workflow checks out PR code **only for internal PRs**.
  - For external/fork PRs, the workflow checks out the default branch and the script will **skip** unless `ALLOW_EXTERNAL_PR_REVIEW=true`.
- **Secrets usage**
  - `ANTHROPIC_API_KEY` is only required when the agent will actually perform an LLM review.
  - If there are no design-relevant diffs, the job exits with no comment (no secrets required).
  - If GitHub provides no textual patches for relevant files, the agent posts `MANUAL_REVIEW_REQUIRED` and **does not** call Anthropic.

## Required secrets

- `ANTHROPIC_API_KEY`: Anthropic API key used for the review.
- `DESIGN_COMMONS_TOKEN`: GitHub token with read access to `keploy/landing-page` (to fetch the private common guidelines file).

## Workflow usage

### PR comment trigger

On a pull request, comment:

```
/design-review
```

If you are an `OWNER`, `MEMBER`, or `COLLABORATOR`, the workflow will run and upsert a single design review comment.

### Manual workflow_dispatch

Run the workflow manually and provide the input `pr-number`.

## Troubleshooting

- **Missing secrets**
  - If the run is expected to do an LLM review, missing `ANTHROPIC_API_KEY` or `DESIGN_COMMONS_TOKEN` will fail the job with a clear error.
  - For skip paths (no relevant diffs, external PR skipped, no patch), the agent should not require Anthropic.
- **No textual patch**
  - GitHub can return `patch: null` for binary or very large diffs. If all relevant files have no patch, the agent posts `MANUAL_REVIEW_REQUIRED`.
- **Empty Anthropic responses**
  - The agent retries once. If still empty, it fails the job.
- **Unparseable verdict**
  - The agent enforces a strict verdict token; if the model output does not contain exactly one known verdict token, the job fails.

