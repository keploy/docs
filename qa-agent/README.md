# QA Agent

Automated QA review system. Reviews every PR and commit against guidelines derived from this codebase's own patterns.

## Files

| File | Purpose |
|---|---|
| `QA_GUIDELINES.md` | The rules. Derived from codebase analysis. Edit via PR. |
| `codebase_map.json` | Dependency graph. Updated manually. |
| `scripts/qa_review.py` | Review agent — runs on every PR |
| `scripts/build_codebase_map.py` | Builds the dependency graph |
| `requirements.txt` | Python dependencies |

## How it works

1. PR opened or commit pushed → GitHub Actions triggers
2. Agent loads `QA_GUIDELINES.md`
3. Agent loads `codebase_map.json` (pre-built dependency graph)
4. Agent fetches the PR diff
5. Agent finds all files that depend on changed files (second-order analysis)
6. Agent sends everything to Claude with a structured review prompt
7. Claude runs four passes: checklist, rule check, breakage analysis, test coverage
8. Review posted as PR comment

## Triggers

| Event | What happens |
|---|---|
| PR opened | Full review runs automatically |
| Commit pushed to open PR | Full review runs automatically |
| Comment `/qa-review` on PR | Re-runs full review |
| Comment `/qa-review fast` | Re-runs without second-order analysis |
| `workflow_dispatch` | Manual — enter PR number in Actions tab |

## Updating the guidelines

Edit `QA_GUIDELINES.md` via a PR. The agent will review its own guidelines update for consistency. Guidelines changes should be reviewed by a human before merging.

## Secrets required

- `ANTHROPIC_API_KEY` — add to repo or org secrets
- `GITHUB_TOKEN` — provided automatically by GitHub Actions

## Running the map builder locally

```bash
pip install -r qa-agent/requirements.txt
python qa-agent/scripts/build_codebase_map.py
```
