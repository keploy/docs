/**
 * get-diff.js
 * Returns the unified diff of changed files.
 * Switches strategy based on event type: pull_request vs push vs workflow_dispatch.
 */

const { execSync } = require("child_process");
const https = require("https");

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_REPOSITORY = process.env.GITHUB_REPOSITORY; // "owner/repo"
const PR_NUMBER = process.env.PR_NUMBER;
const GITHUB_EVENT_NAME = process.env.GITHUB_EVENT_NAME;
const GITHUB_SHA = process.env.GITHUB_SHA;

/**
 * Fetch PR diff from GitHub API.
 * Returns raw unified diff string.
 */
function fetchPRDiff() {
  return new Promise((resolve, reject) => {
    const [owner, repo] = GITHUB_REPOSITORY.split("/");
    const options = {
      hostname: "api.github.com",
      path: `/repos/${owner}/${repo}/pulls/${PR_NUMBER}`,
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3.diff",
        "User-Agent": "keploy-design-review-agent",
      },
    };

    https
      .get(options, (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => resolve(data));
      })
      .on("error", reject);
  });
}

/**
 * Get diff for a push event using git.
 * Compares HEAD to its parent (HEAD~1).
 */
function getCommitDiff() {
  try {
    const diff = execSync("git diff HEAD~1 HEAD", {
      encoding: "utf8",
      maxBuffer: 10 * 1024 * 1024, // 10MB
    });
    return diff;
  } catch {
    // First commit edge case — diff against empty tree
    const diff = execSync(
      "git diff 4b825dc642cb6eb9a060e54bf8d69288fbee4904 HEAD",
      { encoding: "utf8", maxBuffer: 10 * 1024 * 1024 }
    );
    return diff;
  }
}

/**
 * For manual workflow_dispatch: diff the last commit.
 */
function getManualDiff() {
  return getCommitDiff();
}

/**
 * Main export: returns { diff, changedFiles }
 * diff        - raw unified diff string
 * changedFiles - array of file paths that changed
 */
async function getDiff() {
  let diff = "";

  if (GITHUB_EVENT_NAME === "pull_request") {
    diff = await fetchPRDiff();
  } else if (GITHUB_EVENT_NAME === "push") {
    diff = getCommitDiff();
  } else {
    // workflow_dispatch or any other trigger
    diff = getManualDiff();
  }

  // Extract unique file names from diff headers: "diff --git a/foo b/foo"
  const fileMatches = [...diff.matchAll(/^diff --git a\/(.+) b\/.+$/gm)];
  const changedFiles = [...new Set(fileMatches.map((m) => m[1]))];

  return { diff, changedFiles };
}

module.exports = { getDiff };
