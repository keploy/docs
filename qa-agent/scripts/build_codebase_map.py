"""
Codebase Map Builder
Scans the repository and builds a reverse dependency map:
  { "src/utils/auth.js": ["src/pages/login.js", "src/components/guard.js", ...] }

This tells the QA agent: "if auth.js changes, these files might be affected."

This is supposed to run when:
  - Once during initial setup
  - In CI on merges to main (to keep the map current) (omitted per user instructions)
  - Output: qa-agent/codebase_map.json
"""

import os
import re
import json
from pathlib import Path
from collections import defaultdict

ROOT = Path(".")
OUTPUT = Path("qa-agent/codebase_map.json")

# adjust these patterns for your language/framework
IMPORT_PATTERNS = [
    # TypeScript/JavaScript/MDX: import ... from '...'
    r"""from\s+['"]([^'"]+)['"]""",
    # TypeScript/JavaScript: require('...')
    r"""require\s*\(\s*['"]([^'"]+)['"]\s*\)""",
]

SKIP_DIRS = {
    "node_modules", ".git", "build", ".docusaurus", "dist",
    "coverage", ".turbo"
}

SOURCE_EXTENSIONS = {
    ".ts", ".tsx", ".js", ".jsx", ".mdx", ".md",
}


def get_all_source_files() -> list[Path]:
    files = []
    for path in ROOT.rglob("*"):
        if any(part in SKIP_DIRS for part in path.parts):
            continue
        if path.suffix in SOURCE_EXTENSIONS and path.is_file():
            files.append(path)
    return files


def resolve_import(importer: Path, import_path: str, all_files: set[str]) -> str | None:
    """
    Try to resolve an import string to an actual file path.
    Handles relative imports and path aliases.
    Returns None if the import cannot be resolved to a local file.
    """
    # skip node_modules and external packages natively
    if not import_path.startswith(".") and not import_path.startswith("@theme/") and not import_path.startswith("@site/"):
        return None

    # handle path aliases for Docusaurus
    if import_path.startswith("@theme/"):
        import_path = "src/theme/" + import_path[len("@theme/"):]
    elif import_path.startswith("@site/"):
        import_path = import_path[len("@site/"):]

    base = importer.parent / import_path

    # try exact match (already has extension)
    candidate = str(base)
    if candidate in all_files:
        return candidate

    # try with extensions
    for ext in SOURCE_EXTENSIONS:
        candidate = str(base) + ext
        if candidate in all_files:
            return candidate

    # try as directory index
    for ext in SOURCE_EXTENSIONS:
        candidate = str(base / f"index{ext}")
        if candidate in all_files:
            return candidate

    return None


def build_map() -> dict:
    print("Scanning source files...")
    all_files = get_all_source_files()
    all_file_paths = {str(f.as_posix()) for f in all_files}
    print(f"Found {len(all_files)} source files.")

    # reverse dependency map: file -> list of files that import it
    reverse_deps: dict[str, list[str]] = defaultdict(list)

    for source_file in all_files:
        try:
            content = source_file.read_text(encoding="utf-8", errors="ignore")
        except Exception:
            continue

        for pattern in IMPORT_PATTERNS:
            matches = re.findall(pattern, content, re.MULTILINE)
            for match in matches:
                resolved = resolve_import(source_file, match, all_file_paths)
                if resolved and resolved != source_file.as_posix():
                    reverse_deps[resolved].append(source_file.as_posix())

    # clean up: sort and deduplicate
    return {k: sorted(set(v)) for k, v in reverse_deps.items()}


def main():
    codebase_map = build_map()

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT.write_text(json.dumps(codebase_map, indent=2))

    print(f"\nCodebase map built:")
    print(f"  {len(codebase_map)} files have dependents")
    print(f"  Top 10 most depended-upon files:")
    top = sorted(codebase_map.items(), key=lambda x: len(x[1]), reverse=True)[:10]
    for path, dependents in top:
        print(f"    {path}: {len(dependents)} dependents")
    print(f"\nWritten to {OUTPUT}")


if __name__ == "__main__":
    main()
