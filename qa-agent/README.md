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

## Environment Variables & Secrets Required

The QA Agent relies on specific environment variables to authenticate with the language model and the GitHub API. 

### 1. `ANTHROPIC_API_KEY` (Required Secret)
The API key used to query the Claude model for QA checks.
- **Where to configure**: In your GitHub repository, go to `Settings` -> `Secrets and variables` -> `Actions` -> `New repository secret`.
- **Name**: `ANTHROPIC_API_KEY`
- **Example Value**: `sk-ant-api03-XXXXXXXXXXXXXXXXXXXXXXX`

### 2. `GITHUB_TOKEN` (Automatically Provided)
Used by the `PyGithub` client to read PR diffs and post comments.
- **Where to configure**: None needed! GitHub Actions injects this automatically.
- **Example Value**: `${{ secrets.GITHUB_TOKEN }}` (Visible in `.github/workflows/qa-review.yml`).

### 3. `REVIEW_MODE` (Optional Environment Variable)
Determines if the agent runs a full topological check or skips it for speed.
- **Where to configure**: Passed natively in the Workflow file or triggered via issue comments.
- **Example Value**: `full` or `fast`
- **Usage**: Comment `/qa-review fast` on a PR to bypass second-order risk analysis.

## Running the map builder locally

```bash
pip install -r qa-agent/requirements.txt
python qa-agent/scripts/build_codebase_map.py
```
