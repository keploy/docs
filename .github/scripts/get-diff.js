// returns the unified diff string and list of changed files for the current GitHub event (PR or push)

const { execSync } = require("child_process");
const https = require("https");

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_REPOSITORY = process.env.GITHUB_REPOSITORY; // "owner/repo"
const PR_NUMBER = process.env.PR_NUMBER;
const GITHUB_EVENT_NAME = process.env.GITHUB_EVENT_NAME;
const GITHUB_SHA = process.env.GITHUB_SHA;

// fetch the pr diff from the GitHub API, using the "diff" media type to get a unified diff string, returns raw unified diff string
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
        res.on("end", () => {
          if (res.statusCode < 200 || res.statusCode >= 300) {
            reject(
              new Error(
                `GitHub API returned ${res.statusCode} fetching PR diff. ` +
                `Check GITHUB_TOKEN permissions and that PR_NUMBER=${PR_NUMBER} is valid. ` +
                `Response: ${data.trim().slice(0, 300)}`
              )
            );
            return;
          }
          resolve(data);
        });
      })
      .on("error", reject);
  });
}

// get diff for a push event using git. Compares HEAD to its parent (HEAD~1).
function getCommitDiff() {
  try {
    const diff = execSync("git diff HEAD~1 HEAD", {
      encoding: "utf8",
      maxBuffer: 10 * 1024 * 1024, // 10MB
    });
    return diff;
  } catch {
    // first commit edge case, diff against empty tree
    const diff = execSync(
      "git diff 4b825dc642cb6eb9a060e54bf8d69288fbee4904 HEAD",
      { encoding: "utf8", maxBuffer: 10 * 1024 * 1024 }
    );
    return diff;
  }
}

// for manual workflow_dispatch: diff the last commit. this is a best practice to get some diff for manual runs, but may not be perfect depending on the repo state.

function getManualDiff() {
  return getCommitDiff();
}

// main export function that returns the diff and list of changed files based on the GitHub event type (pull_request or push)

// diff : raw unified diff string
// changedFiles: array of file paths that changed (extracted from diff headers)

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
