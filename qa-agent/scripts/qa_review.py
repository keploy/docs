"""
QA Review Agent
Reads QA_GUIDELINES.md, fetches the PR diff, and runs a structured review.

Triggered by GitHub Actions on:
- pull_request (opened, synchronize, reopened)
- push to any open PR
- issue_comment containing /qa-review
- workflow_dispatch (manual, with pr-number input)

Environment variables required:
  ANTHROPIC_API_KEY    — Anthropic API key
  GITHUB_TOKEN         — GitHub token (provided by Actions or a PAT)
  PR_NUMBER            — PR number to review
  GITHUB_REPOSITORY    — e.g. keploy/landing-page
  REVIEW_MODE          — "full" (default) or "fast" (skip second-order analysis)
"""

import os
import sys
import json
from pathlib import Path
from github import Github
import anthropic

# --- configuration ---
ANTHROPIC_API_KEY  = os.environ["ANTHROPIC_API_KEY"]
GITHUB_TOKEN       = os.environ["GITHUB_TOKEN"]
PR_NUMBER          = int(os.environ["PR_NUMBER"])
REPO_NAME          = os.environ["GITHUB_REPOSITORY"]
REVIEW_MODE        = os.environ.get("REVIEW_MODE", "full")
GUIDELINES_PATH    = Path(__file__).parent.parent / "QA_GUIDELINES.md"
CODEBASE_MAP_PATH  = Path(__file__).parent.parent / "codebase_map.json"

# file extensions the agent cares about — update to match this project
REVIEWABLE_EXTENSIONS = {
    ".ts", ".tsx", ".js", ".jsx",   # adjust for your language
    ".py", ".go", ".rs", ".java",
    ".md", ".mdx",
    ".json",  # only when it's config, not data
    ".css", ".scss",
}

# files to always skip
SKIP_PATTERNS = {
    "package-lock.json", "yarn.lock", "pnpm-lock.yaml", "poetry.lock",
    ".gitignore", ".prettierignore",
}


def load_guidelines() -> str:
    if not GUIDELINES_PATH.exists():
        return "WARNING: QA_GUIDELINES.md not found. Reviewing against general best practices only."
    return GUIDELINES_PATH.read_text()


def load_codebase_map() -> dict:
    """
    Load the pre-built codebase dependency map.
    This tells the agent which files depend on which, so it can do second-order analysis.
    Built by build_codebase_map.py (run during agent setup or on schedule).
    """
    if not CODEBASE_MAP_PATH.exists():
        return {}
    try:
        return json.loads(CODEBASE_MAP_PATH.read_text())
    except Exception:
        return {}


def get_pr_data(repo, pr_number: int):
    pr = repo.get_pull(pr_number)
    files = pr.get_files()

    changed_files = []
    diff_sections = []
    skipped = []

    for f in files:
        filename = f.filename
        ext = Path(filename).suffix
        basename = Path(filename).name

        if basename in SKIP_PATTERNS:
            skipped.append(filename)
            continue
        if ext not in REVIEWABLE_EXTENSIONS:
            skipped.append(filename)
            continue
        if not f.patch:
            skipped.append(filename)
            continue

        changed_files.append(filename)
        diff_sections.append(
            f"### {filename} (status: {f.status}, +{f.additions}/-{f.deletions})\n"
            f"```diff\n{f.patch}\n```"
        )

    diff_text = "\n\n".join(diff_sections)
    return pr, changed_files, diff_text, skipped


def find_downstream_files(changed_files: list[str], codebase_map: dict) -> dict:
    """
    Given a list of changed files, find all files that import them.
    This is how the agent detects second-order breakage risk.
    """
    downstream = {}
    for changed_file in changed_files:
        dependents = codebase_map.get(changed_file, [])
        if dependents:
            downstream[changed_file] = dependents
    return downstream


def build_review_prompt(
    guidelines: str,
    diff_text: str,
    changed_files: list[str],
    downstream: dict,
    pr_title: str,
    pr_body: str,
    commits: list[str],
) -> str:
    
    downstream_section = ""
    if downstream:
        lines = ["## Files that depend on changed files (second-order breakage risk)\n"]
        for changed, dependents in downstream.items():
            lines.append(f"**{changed}** is imported by:")
            for dep in dependents:
                lines.append(f"  - {dep}")
        downstream_section = "\n".join(lines)
    else:
        downstream_section = "## Second-order analysis\nNo high-coupling dependencies detected for changed files."

    commits_section = "\n".join(f"- {c}" for c in commits) if commits else "(no commit messages available)"

    return f"""You are a QA engineer reviewing a pull request.
Your job is to check this PR against the project's QA guidelines.

You have full context of this codebase — the guidelines below were derived from it.
You are not just checking the diff in isolation. You are checking whether these changes
could break anything else in the codebase, based on the dependency information provided.

---

## QA Guidelines (derived from this codebase)

{guidelines}

---

## PR information

**Title**: {pr_title}
**Description**: {pr_body or "(no description provided — this itself may be a violation, check Section 9)"}

**Commits in this PR**:
{commits_section}

**Files changed** ({len(changed_files)} reviewable files):
{chr(10).join(f"- {f}" for f in changed_files)}

{downstream_section}

---

## Diff

{diff_text}

---

## Your review instructions

Go through the following in order:

**Pass 1 — PR checklist (Section 9 of guidelines)**
Run every item in the PR checklist. Report each item as PASS or FAIL with a brief reason.

**Pass 2 — Rule-by-rule check**
For each section of the guidelines (Architecture, Type safety, Error handling, API/data layer, Testing, Naming, Dependencies):
Check whether the diff introduces any violations.
For each violation found: state the rule ID, what was violated, where in the diff (filename), and what the fix should be.

**Pass 3 — Second-order breakage analysis**
Look at the downstream dependency information above.
For each file that changed AND has downstream dependents:
- Does the change alter any exported interface, function signature, type, or behavior?
- If yes: which downstream files are at risk, and how?
- Flag all risks, even if they might be fine — let the human decide.

**Pass 4 — Test coverage check**
- Does the diff include new or modified business logic?
- If yes: are there corresponding test changes in the diff?
- If no tests are present: is there a test file that should have been updated?
- Name the specific test file that is missing or should be updated.

---

## Output format

Use EXACTLY this structure:

## QA Review

### PR Checklist
| Item | Result | Note |
|---|---|---|
[one row per checklist item from Section 9 of guidelines]

### Verdict
[APPROVED / NEEDS_CHANGES / CRITICAL_ISSUES]
[One sentence on the overall state of this PR]

### Issues found
[Numbered list. For each issue:]
**[SEVERITY] RULE-[ID]: [Short title]**
File: `[filename]`
Problem: [specific description of what is wrong]
Fix: [specific description of what to change]

If no issues: write "No violations found."

### Second-order risks
[For each downstream risk identified:]
**Changed**: `[file that changed]`
**At risk**: `[downstream file]`
**Reason**: [what specifically might break and why]

If no risks: write "No second-order risks detected."

### Missing tests
[List any test files that should exist or be updated]
If none: write "Test coverage appears adequate for this diff."

### Suggestions (INFO level)
[Optional improvements that are not violations]
"""


def run_review(prompt: str) -> str:
    client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)
    message = client.messages.create(
        model="claude-3-5-sonnet-20241022",
        max_tokens=4000,
        messages=[{"role": "user", "content": prompt}]
    )
    return message.content[0].text


def post_comment(repo, pr, review_text: str, skipped: list[str]):
    skipped_note = ""
    if skipped:
        skipped_note = f"\n\n<details><summary>Skipped {len(skipped)} non-reviewable files</summary>\n\n" + \
                       "\n".join(f"- {f}" for f in skipped) + "\n\n</details>"

    body = (
        f"## 🔍 QA Review\n\n"
        f"{review_text}"
        f"{skipped_note}\n\n"
        f"---\n"
        f"*qa-agent · [Guidelines](./qa-agent/QA_GUIDELINES.md) · "
        f"Comment `/qa-review` to re-trigger · "
        f"Comment `/qa-review fast` to skip second-order analysis*"
    )
    pr.create_issue_comment(body)


def get_commit_messages(pr) -> list[str]:
    try:
        return [c.commit.message.split("\n")[0] for c in pr.get_commits()]
    except Exception:
        return []


def main():
    g = Github(GITHUB_TOKEN)
    repo = g.get_repo(REPO_NAME)

    print(f"Loading guidelines from {GUIDELINES_PATH}...")
    guidelines = load_guidelines()

    print("Loading codebase dependency map...")
    codebase_map = load_codebase_map()

    print(f"Fetching PR #{PR_NUMBER}...")
    pr, changed_files, diff_text, skipped = get_pr_data(repo, PR_NUMBER)

    if not changed_files:
        pr.create_issue_comment(
            "## 🔍 QA Review\n\nNo reviewable files changed in this PR. Skipping. ✅"
        )
        return

    commits = get_commit_messages(pr)

    print("Analyzing downstream dependencies...")
    downstream = find_downstream_files(changed_files, codebase_map) if REVIEW_MODE == "full" else {}

    print("Building review prompt...")
    prompt = build_review_prompt(
        guidelines=guidelines,
        diff_text=diff_text,
        changed_files=changed_files,
        downstream=downstream,
        pr_title=pr.title,
        pr_body=pr.body or "",
        commits=commits,
    )

    print("Running Claude review...")
    review = run_review(prompt)

    print("Posting comment...")
    post_comment(repo, pr, review, skipped)

    print("Done.")

    # exit 1 if critical issues — this marks the GitHub check as failed
    if "CRITICAL_ISSUES" in review:
        sys.exit(1)


if __name__ == "__main__":
    main()
