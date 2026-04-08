// posts the design review results as a github comment
// on a pr: posts a pr review comment
// on a push: posts a commit comment
// on a manual workflow_dispatch: posts a commit comment (best effort to get some comment for manual runs, but may not be perfect depending on repo state)

const https = require("https");

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_REPOSITORY = process.env.GITHUB_REPOSITORY;
const PR_NUMBER = process.env.PR_NUMBER;
const GITHUB_EVENT_NAME = process.env.GITHUB_EVENT_NAME;
const GITHUB_SHA = process.env.GITHUB_SHA;

function githubRequest(method, path, body) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify(body);
    const options = {
      hostname: "api.github.com",
      path,
      method,
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3+json",
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(payload),
        "User-Agent": "keploy-design-review-agent",
      },
    };

    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          // 204 No Content (DELETE) returns empty body — safe parse
          resolve(data.length > 0 ? JSON.parse(data) : {});
        } else {
          reject(
            new Error(
              `GitHub API error ${res.statusCode}: ${data}`
            )
          );
        }
      });
    });

    req.on("error", reject);
    req.write(payload);
    req.end();
  });
}

/**
 * Find and delete any previous design review comment on the PR
 * so we don't accumulate stale comments.
 */
async function deletePreviousReviewComment(owner, repo) {
  const listPath = `/repos/${owner}/${repo}/issues/${PR_NUMBER}/comments`;

  const comments = await new Promise((resolve, reject) => {
    const options = {
      hostname: "api.github.com",
      path: listPath,
      method: "GET",
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "keploy-design-review-agent",
      },
    };

    https
      .get(options, (res) => {
        let data = "";
        res.on("data", (c) => (data += c));
        res.on("end", () => resolve(JSON.parse(data)));
      })
      .on("error", reject);
  });

  const botComments = comments.filter(
    (c) =>
      c.user.type === "Bot" &&
      c.body.includes("Keploy Design Review")
  );

  for (const comment of botComments) {
    await githubRequest(
      "DELETE",
      `/repos/${owner}/${repo}/issues/comments/${comment.id}`,
      {}
    ).catch(() => {}); // ignore delete errors
  }
}

/**
 * @param {string} reviewBody - the Markdown review text from Claude
 */
async function postComment(reviewBody) {
  const [owner, repo] = GITHUB_REPOSITORY.split("/");

  if (GITHUB_EVENT_NAME === "pull_request" && PR_NUMBER) {
    // Clean up previous bot comment first
    await deletePreviousReviewComment(owner, repo);

    // Post fresh PR comment
    await githubRequest(
      "POST",
      `/repos/${owner}/${repo}/issues/${PR_NUMBER}/comments`,
      { body: reviewBody }
    );
    console.log(`Design review posted to PR #${PR_NUMBER}`);
  } else {
    // Post as commit comment (push or manual trigger)
    await githubRequest(
      "POST",
      `/repos/${owner}/${repo}/commits/${GITHUB_SHA}/comments`,
      { body: reviewBody }
    );
    console.log(`Design review posted to commit ${GITHUB_SHA}`);
  }
}

module.exports = { postComment };
