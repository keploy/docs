/**
 * filter-files.js
 * Filters a list of changed file paths to only those relevant for design review.
 */

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
  "package-lock.json",
  "yarn.lock",
  "pnpm-lock.yaml",
];

/**
 * @param {string[]} files - array of file paths from the diff
 * @returns {string[]} filtered file paths
 */
function filterFiles(files) {
  return files.filter((file) => {
    const isIgnored = IGNORED_PATHS.some((p) => file.includes(p));
    if (isIgnored) return false;

    const hasAllowedExt = ALLOWED_EXTENSIONS.some((ext) => file.endsWith(ext));
    return hasAllowedExt;
  });
}

module.exports = { filterFiles };
