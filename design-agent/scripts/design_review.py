from __future__ import annotations

import base64
import json
import os
import re
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Iterable, Literal

from anthropic import Anthropic

GITHUB_API = "https://api.github.com"
GITHUB_API_VERSION = "2022-11-28"

COMMENT_MARKER = "<!-- design-agent-review-comment -->"

VERDICT_TOKENS = {
    "APPROVED",
    "CHANGES_REQUESTED",
    "MANUAL_REVIEW_REQUIRED",
    "SKIPPED",
}

ALLOWED_EXTENSIONS = (
    ".module.css",
    ".css",
    ".scss",
    ".ts",
    ".tsx",
    ".js",
    ".jsx",
    ".md",
    ".mdx",
    ".svg",
    ".png",
    ".jpg",
    ".jpeg",
    ".webp",
    ".gif",
)

ALLOWED_PATH_PREFIXES = (
    "src/",
    "src/css/",
    "src/theme/",
    "src/components/",
    "docs/",
    "versioned_docs/",
    "static/",
    "design-agent/",
)

EXCLUDED_DIFF_PATHS = {
    "design-agent/DOCS_DESIGN_GUIDELINES.md",
}


@dataclass(frozen=True)
class PullRequestMeta:
    number: int
    head_sha: str
    head_repo_full_name: str
    base_repo_full_name: str
    is_external: bool


def _env(name: str, *, required: bool = False, default: str | None = None) -> str | None:
    value = os.environ.get(name)
    if value is None or value == "":
        value = default
    if required and (value is None or value == ""):
        raise RuntimeError(f"Missing required environment variable: {name}")
    return value


def _env_bool(name: str, *, default: bool = False) -> bool:
    raw = os.environ.get(name)
    if raw is None:
        return default
    raw = raw.strip().lower()
    return raw in {"1", "true", "yes", "y", "on"}


def _repo_root() -> Path:
    return Path(__file__).resolve().parents[2]


def _github_api_request(
    *,
    token: str,
    method: Literal["GET", "POST", "PATCH"],
    path: str,
    query: dict[str, str] | None = None,
    body: dict[str, Any] | None = None,
    timeout_s: int = 30,
) -> Any:
    url = f"{GITHUB_API}{path}"
    if query:
        url = f"{url}?{urllib.parse.urlencode(query)}"

    data: bytes | None = None
    headers = {
        "Authorization": f"Bearer {token}",
        "Accept": "application/vnd.github+json",
        "X-GitHub-Api-Version": GITHUB_API_VERSION,
        "User-Agent": "keploy-docs-design-agent",
    }
    if body is not None:
        data = json.dumps(body).encode("utf-8")
        headers["Content-Type"] = "application/json; charset=utf-8"

    request = urllib.request.Request(url, data=data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(request, timeout=timeout_s) as response:
            raw = response.read().decode("utf-8")
            if raw.strip() == "":
                return None
            return json.loads(raw)
    except urllib.error.HTTPError as e:
        error_body = ""
        try:
            error_body = e.read().decode("utf-8", errors="replace")
        except Exception:
            error_body = ""
        raise RuntimeError(
            f"GitHub API error: {method} {path} -> HTTP {e.code}. Body: {error_body[:2000]}"
        ) from e
    except urllib.error.URLError as e:
        raise RuntimeError(f"GitHub API request failed: {method} {path} ({e})") from e


def _paginate(
    *,
    token: str,
    path: str,
    query: dict[str, str] | None = None,
    per_page: int = 100,
) -> list[Any]:
    items: list[Any] = []
    page = 1
    while True:
        q = dict(query or {})
        q["per_page"] = str(per_page)
        q["page"] = str(page)
        batch = _github_api_request(token=token, method="GET", path=path, query=q)
        if not isinstance(batch, list):
            raise RuntimeError(f"Expected list response for {path}, got {type(batch)}")
        items.extend(batch)
        if len(batch) < per_page:
            break
        page += 1
        if page > 50:
            raise RuntimeError(f"Pagination exceeded safety limit for {path}")
    return items


def _is_root_config(path: str) -> bool:
    # These are explicitly allowed even though they don't live under ALLOWED_PATH_PREFIXES.
    return bool(
        re.match(r"^(tailwind\.config\..+|docusaurus\.config\..+)$", path)
    )


def _is_design_relevant_file(path: str) -> bool:
    if path in EXCLUDED_DIFF_PATHS:
        return False
    if not _is_root_config(path) and not path.startswith(ALLOWED_PATH_PREFIXES):
        return False
    return path.endswith(ALLOWED_EXTENSIONS)


def _build_filtered_diff(files: Iterable[dict[str, Any]]) -> tuple[str, list[str], list[str], int]:
    relevant_files: list[str] = []
    no_patch_files: list[str] = []
    diff_parts: list[str] = []
    textual_patch_files = 0

    for f in files:
        filename = f.get("filename") or ""
        if not isinstance(filename, str) or filename.strip() == "":
            continue
        if not _is_design_relevant_file(filename):
            continue

        relevant_files.append(filename)
        status = f.get("status") or "modified"
        patch = f.get("patch")
        diff_parts.append(f"diff --git a/{filename} b/{filename}")
        diff_parts.append(f"--- a/{filename}")
        diff_parts.append(f"+++ b/{filename}")

        if patch is None:
            no_patch_files.append(filename)
            diff_parts.append(
                "[NO_PATCH_AVAILABLE] GitHub did not provide a textual patch for this file (binary or too large)."
            )
            diff_parts.append("")
            continue

        if not isinstance(patch, str) or patch.strip() == "":
            no_patch_files.append(filename)
            diff_parts.append(
                "[NO_PATCH_AVAILABLE] Empty patch field returned by GitHub API."
            )
            diff_parts.append("")
            continue

        textual_patch_files += 1
        diff_parts.append(patch.rstrip("\n"))
        diff_parts.append("")

    return "\n".join(diff_parts).rstrip() + "\n", relevant_files, no_patch_files, textual_patch_files


def _truncate(text: str, limit: int, *, label: str) -> str:
    if len(text) <= limit:
        return text
    return (
        text[:limit]
        + f"\n\n[{label} truncated to first {limit} characters]"
    )


def _fetch_common_guidelines(*, token: str) -> str:
    repo = _env("COMMON_GUIDELINES_REPO", default="keploy/landing-page") or "keploy/landing-page"
    path = _env("COMMON_GUIDELINES_PATH", default="design-agent/COMMON_DESIGN_GUIDELINES.md") or "design-agent/COMMON_DESIGN_GUIDELINES.md"
    ref = _env("COMMON_GUIDELINES_REF", default="main") or "main"

    # GitHub "contents" API: GET /repos/{owner}/{repo}/contents/{path}?ref=...
    encoded_path = urllib.parse.quote(path)
    payload = _github_api_request(
        token=token,
        method="GET",
        path=f"/repos/{repo}/contents/{encoded_path}",
        query={"ref": ref},
    )
    if not isinstance(payload, dict) or payload.get("type") != "file":
        raise RuntimeError(
            f"Unexpected contents response for {repo}:{path}@{ref}: {type(payload)}"
        )

    content_b64 = payload.get("content")
    encoding = payload.get("encoding")
    if encoding != "base64" or not isinstance(content_b64, str) or content_b64.strip() == "":
        raise RuntimeError(
            f"Invalid contents payload for {repo}:{path}@{ref} (encoding={encoding})"
        )

    # GitHub may include line breaks in base64 content.
    content_b64_compact = "".join(content_b64.splitlines())
    try:
        decoded = base64.b64decode(content_b64_compact).decode("utf-8")
    except Exception as e:
        raise RuntimeError(
            f"Failed to decode base64 content for {repo}:{path}@{ref}"
        ) from e
    return decoded


def _load_local_docs_guidelines() -> str:
    guidelines_path = _repo_root() / "design-agent" / "DOCS_DESIGN_GUIDELINES.md"
    if not guidelines_path.exists():
        raise RuntimeError(
            f"Missing local guidelines file required for review: {guidelines_path}"
        )
    return guidelines_path.read_text(encoding="utf-8")


def _load_merged_guidelines(*, commons_token: str, max_chars: int) -> str:
    common = _fetch_common_guidelines(token=commons_token)
    local = _load_local_docs_guidelines()

    merged = (
        "# Common Design Guidelines (private)\n\n"
        + common.strip()
        + "\n\n---\n\n"
        + "# Docs Repo Design Guidelines\n\n"
        + local.strip()
        + "\n"
    )
    return _truncate(merged, max_chars, label="guidelines")


def _anthropic_text_from_response(response: Any) -> str:
    # anthropic==0.40.0 returns `Message` objects; `content` is a list of blocks.
    blocks = getattr(response, "content", None)
    if blocks is None:
        return ""
    parts: list[str] = []
    for block in blocks:
        text = getattr(block, "text", None)
        if isinstance(text, str) and text != "":
            parts.append(text)
            continue
        # Defensive fallback for dict-like blocks.
        if isinstance(block, dict) and isinstance(block.get("text"), str):
            parts.append(block["text"])
            continue
    return "".join(parts).strip()


def _parse_verdict(review_markdown: str) -> str | None:
    lines = review_markdown.splitlines()

    # Find "## Verdict" section.
    start_idx: int | None = None
    for i, line in enumerate(lines):
        if re.match(r"^\s*##\s+Verdict\s*$", line):
            start_idx = i + 1
            break
    if start_idx is None:
        start_idx = 0

    tokens_found: set[str] = set()
    for line in lines[start_idx:]:
        if re.match(r"^\s*##\s+", line):
            break
        if "|" in line:
            continue
        stripped = line.strip()
        if stripped == "":
            continue
        if stripped in VERDICT_TOKENS:
            tokens_found.add(stripped)
            continue

        # If the model accidentally wrote extra text, ignore lines that contain tokens
        # alongside other text (we require a single-token line).
        embedded = [t for t in VERDICT_TOKENS if t in stripped]
        if len(embedded) == 1 and stripped != embedded[0]:
            continue

    if len(tokens_found) == 1:
        return next(iter(tokens_found))
    return None


def _section_text(review_markdown: str, heading: str) -> str | None:
    lines = review_markdown.splitlines()
    start: int | None = None
    for i, line in enumerate(lines):
        if line.strip() == f"## {heading}":
            start = i + 1
            break
    if start is None:
        return None
    out: list[str] = []
    for line in lines[start:]:
        if re.match(r"^\s*##\s+", line):
            break
        out.append(line)
    return "\n".join(out).strip()


def _validate_review_template(review_markdown: str) -> None:
    required_headings = [
        "Design review summary",
        "Verdict",
        "Violations",
        "Improvement suggestions",
        "Flagged for discussion",
        "Approved changes",
    ]
    missing = [h for h in required_headings if _section_text(review_markdown, h) is None]
    if missing:
        raise RuntimeError(f"Model output missing required section(s): {', '.join(missing)}")

    improvements = _section_text(review_markdown, "Improvement suggestions") or ""
    # "None." is allowed; otherwise enforce max 3 bullets.
    if improvements.strip() != "" and improvements.strip().lower() != "none.":
        bullets = [
            ln
            for ln in improvements.splitlines()
            if ln.lstrip().startswith("- ")
        ]
        if len(bullets) > 3:
            raise RuntimeError(
                f"Model produced too many improvement suggestions ({len(bullets)} > 3)."
            )


def _build_prompt(*, diff_text: str, changed_files: list[str], guidelines: str) -> tuple[str, str]:
    diff_budget = int(_env("MAX_DIFF_CHARS", default="80000") or "80000")
    diff_text = _truncate(diff_text, diff_budget, label="diff")

    system = (
        "You are a strict Design Review Agent for the Keploy Docs codebase.\n\n"
        "Your job:\n"
        "- Review ONLY the provided diff.\n"
        "- Enforce the provided design guidelines (common first, repo-specific second).\n"
        "- Focus on UI/UX, styling, layout, typography, visuals, accessibility, and Docusaurus/Tailwind conventions.\n"
        "- Do not review non-design logic unless it impacts UI behavior or accessibility.\n\n"
        "Hard output requirements:\n"
        "- Output STRICT Markdown with the exact sections below.\n"
        "- The Verdict section MUST contain a single token on its own line.\n"
        "- Improvement suggestions are non-blocking and MUST be max 3.\n\n"
        "Allowed verdict tokens:\n"
        + "\n".join(f"- {t}" for t in sorted(VERDICT_TOKENS))
        + "\n\n"
        "Output template (follow exactly):\n\n"
        "## Design review summary\n"
        "<2-4 bullet points>\n\n"
        "## Verdict\n"
        "<ONE_TOKEN_ONLY>\n\n"
        "## Violations\n"
        "- <bullet list of blocking/major issues; include file paths>\n"
        "- If none: None.\n\n"
        "## Improvement suggestions\n"
        "- <non-blocking; max 3>\n"
        "- If none: None.\n\n"
        "## Flagged for discussion\n"
        "- <items to discuss>\n"
        "- If none: None.\n\n"
        "## Approved changes\n"
        "- <things done well>\n"
        "- If none: None.\n"
    )

    user = (
        "## Changed files\n"
        + ("\n".join(f"- {f}" for f in changed_files) if changed_files else "None.")
        + "\n\n"
        "## Diff\n"
        "```diff\n"
        + diff_text
        + "```\n\n"
        "## Design guidelines\n"
        + guidelines
        + "\n"
    )
    return system, user


def _upsert_pr_comment(
    *,
    token: str,
    repo: str,
    pr_number: int,
    body: str,
) -> None:
    body_limit = int(_env("MAX_COMMENT_CHARS", default="60000") or "60000")
    if len(body) > body_limit:
        body = body[: body_limit] + "\n\n[comment truncated due to GitHub comment size limits]"

    comments = _paginate(token=token, path=f"/repos/{repo}/issues/{pr_number}/comments")
    marker_comment = None
    for c in comments:
        if isinstance(c, dict) and isinstance(c.get("body"), str) and COMMENT_MARKER in c["body"]:
            marker_comment = c
            break

    if marker_comment and isinstance(marker_comment.get("id"), int):
        _github_api_request(
            token=token,
            method="PATCH",
            path=f"/repos/{repo}/issues/comments/{marker_comment['id']}",
            body={"body": body},
        )
        return

    _github_api_request(
        token=token,
        method="POST",
        path=f"/repos/{repo}/issues/{pr_number}/comments",
        body={"body": body},
    )


def _render_footer_links(*, repo: str, head_sha: str, files: list[str], max_files: int = 25) -> str:
    repo_url = f"https://github.com/{repo}"
    out: list[str] = []
    out.append(f"- Reviewed commit: {repo_url}/tree/{head_sha}")
    display_files = files[:max_files]
    out.append("- Reviewed files (blob links):")
    for f in display_files:
        out.append(f"  - {repo_url}/blob/{head_sha}/{f}")
    if len(files) > max_files:
        out.append(f"  - (and {len(files) - max_files} more)")
    return "\n".join(out)


def _load_pr_meta_from_env() -> PullRequestMeta:
    repo = _env("GITHUB_REPOSITORY", required=True)
    pr_number_raw = _env("PR_NUMBER", required=True)
    try:
        pr_number = int(pr_number_raw or "")
    except Exception as e:
        raise RuntimeError(f"Invalid PR_NUMBER: {pr_number_raw}") from e

    head_sha = _env("PR_HEAD_SHA") or ""
    head_repo = _env("PR_HEAD_REPO_FULL_NAME") or ""
    if head_sha.strip() == "" or head_repo.strip() == "":
        # Workflow is expected to provide these, but we can still attempt to run in a reduced mode.
        head_sha = head_sha.strip()
        head_repo = head_repo.strip()
    base_repo = repo
    is_external = _env_bool("IS_EXTERNAL_PR", default=(head_repo != "" and head_repo != base_repo))

    if head_sha == "":
        # Best-effort fallback: fetch PR metadata using the workflow token.
        token = _env("GITHUB_TOKEN", required=True)
        pr = _github_api_request(token=token, method="GET", path=f"/repos/{repo}/pulls/{pr_number}")
        head_sha = pr["head"]["sha"]
        head_repo = pr["head"]["repo"]["full_name"]
        is_external = head_repo != base_repo

    return PullRequestMeta(
        number=pr_number,
        head_sha=head_sha,
        head_repo_full_name=head_repo,
        base_repo_full_name=base_repo,
        is_external=is_external,
    )


def main() -> int:
    pr_meta = _load_pr_meta_from_env()

    gh_token = _env("GITHUB_TOKEN", required=True)
    allow_external = _env_bool("ALLOW_EXTERNAL_PR_REVIEW", default=False)

    pr_files = _paginate(
        token=gh_token,
        path=f"/repos/{pr_meta.base_repo_full_name}/pulls/{pr_meta.number}/files",
    )
    diff_text, relevant_files, no_patch_files, textual_patch_files = _build_filtered_diff(pr_files)

    if len(relevant_files) == 0:
        # Requirement: exit without posting noisy comment.
        print("No design-relevant diffs after filtering. Exiting without commenting.")
        return 0

    if textual_patch_files == 0 and len(no_patch_files) > 0:
        footer = _render_footer_links(
            repo=pr_meta.base_repo_full_name,
            head_sha=pr_meta.head_sha,
            files=relevant_files,
        )
        body = (
            f"{COMMENT_MARKER}\n\n"
            "## Design review summary\n"
            "- No textual patches were available for the design-relevant files in this PR.\n"
            "- A manual review is required for the affected files.\n\n"
            "## Verdict\n"
            "MANUAL_REVIEW_REQUIRED\n\n"
            "## Violations\n"
            "None.\n\n"
            "## Improvement suggestions\n"
            "None.\n\n"
            "## Flagged for discussion\n"
            "- GitHub did not provide `patch` for the following files:\n"
            + "\n".join(f"  - {f}" for f in no_patch_files)
            + "\n\n"
            "## Approved changes\n"
            "None.\n\n"
            "---\n"
            + footer
            + "\n"
        )
        _upsert_pr_comment(
            token=gh_token,
            repo=pr_meta.base_repo_full_name,
            pr_number=pr_meta.number,
            body=body,
        )
        print("Posted MANUAL_REVIEW_REQUIRED comment (no textual patches).")
        return 0

    if pr_meta.is_external and not allow_external:
        footer = _render_footer_links(
            repo=pr_meta.base_repo_full_name,
            head_sha=pr_meta.head_sha,
            files=relevant_files,
        )
        body = (
            f"{COMMENT_MARKER}\n\n"
            "## Design review summary\n"
            "- This PR is from an external repository (fork).\n"
            "- Automated design review is disabled for external PRs by default.\n\n"
            "## Verdict\n"
            "SKIPPED\n\n"
            "## Violations\n"
            "None.\n\n"
            "## Improvement suggestions\n"
            "None.\n\n"
            "## Flagged for discussion\n"
            "- To allow external PR reviews, set `ALLOW_EXTERNAL_PR_REVIEW=true` for this workflow run.\n\n"
            "## Approved changes\n"
            "None.\n\n"
            "---\n"
            + footer
            + "\n"
        )
        _upsert_pr_comment(
            token=gh_token,
            repo=pr_meta.base_repo_full_name,
            pr_number=pr_meta.number,
            body=body,
        )
        print("Posted SKIPPED comment (external PR).")
        return 0

    commons_token = _env("DESIGN_COMMONS_TOKEN", required=True)
    guidelines = _load_merged_guidelines(
        commons_token=commons_token,
        max_chars=int(_env("MAX_GUIDELINES_CHARS", default="60000") or "60000"),
    )

    # Anthropic key is required only when we will actually perform an LLM review.
    anthropic_key = _env("ANTHROPIC_API_KEY", required=True)
    model = _env("ANTHROPIC_MODEL", default="claude-3-5-sonnet-latest") or "claude-3-5-sonnet-latest"

    system, user = _build_prompt(
        diff_text=diff_text,
        changed_files=relevant_files,
        guidelines=guidelines,
    )

    client = Anthropic(api_key=anthropic_key)
    max_tokens = int(_env("ANTHROPIC_MAX_TOKENS", default="2400") or "2400")

    review_text = ""
    for attempt in (1, 2):
        response = client.messages.create(
            model=model,
            max_tokens=max_tokens,
            system=system,
            messages=[{"role": "user", "content": user}],
        )
        review_text = _anthropic_text_from_response(response)
        if review_text.strip() != "":
            break
        if attempt == 1:
            print("Empty Anthropic response; retrying once...", file=sys.stderr)
            time.sleep(1)

    if review_text.strip() == "":
        raise RuntimeError("Anthropic returned an empty response after 2 attempts.")

    _validate_review_template(review_text)

    verdict = _parse_verdict(review_text)
    if verdict is None:
        raise RuntimeError("Review text produced but verdict token was unparseable.")

    footer = _render_footer_links(
        repo=pr_meta.base_repo_full_name,
        head_sha=pr_meta.head_sha,
        files=relevant_files,
    )

    body = (
        f"{COMMENT_MARKER}\n\n"
        + review_text.strip()
        + "\n\n---\n"
        + footer
        + "\n"
    )

    _upsert_pr_comment(
        token=gh_token,
        repo=pr_meta.base_repo_full_name,
        pr_number=pr_meta.number,
        body=body,
    )
    print(f"Posted design review comment. Verdict: {verdict}")
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except Exception as e:
        print(f"design_review.py failed: {e}", file=sys.stderr)
        raise
