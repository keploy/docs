// filters a list of changed file paths to only those relevant for design review

const ALLOWED_EXTENSIONS = [
  ".css",
  ".scss",
  ".sass",
  ".mdx",
  ".md",
  ".tsx",
  ".jsx",
  ".js",
  ".ts",
];

const IGNORED_PATHS = [
  "node_modules/",
  "build/",
  ".docusaurus/",
  ".github/",
  "package-lock.json",
  "yarn.lock",
  "pnpm-lock.yaml",
  "DESIGN_GUIDELINES.md",
];

// Only review actual site source directories
const ALLOWED_PATHS = ["src/", "docs/", "versioned_docs/", "blog/", "static/"];

/**
 * @param {string[]} files array of file paths from the diff
 * @returns {string[]} filtered file paths
 */
function filterFiles(files) {
  return files.filter((file) => {
    const isIgnored = IGNORED_PATHS.some((p) => file.includes(p));
    if (isIgnored) return false;

    const hasAllowedExt = ALLOWED_EXTENSIONS.some((ext) => file.endsWith(ext));
    if (!hasAllowedExt) return false;

    return ALLOWED_PATHS.some((p) => file.startsWith(p));
  });
}

module.exports = { filterFiles };
