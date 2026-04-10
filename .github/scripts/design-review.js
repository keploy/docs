// get diff (pr diff or git diff depending on trigger)
// filter to design-relevant files
// build Claude prompt with guidelines + diff
// call Claude API
// post review comment to GitHub

const Anthropic = require("@anthropic-ai/sdk");
const { getDiff } = require("./get-diff");
const { filterFiles } = require("./filter-files");
const { buildPrompt } = require("./prompt");
const { postComment } = require("./post-comment");

// Model is configurable via the CLAUDE_MODEL repo variable so it can be updated
// without a code change if the model is renamed or a newer version is preferred.
const CLAUDE_MODEL = process.env.CLAUDE_MODEL || "claude-sonnet-4-6";

if (!process.env.GITHUB_TOKEN) {
  console.error("ERROR: GITHUB_TOKEN environment variable is not set.");
  process.exit(1);
}

if (!process.env.GITHUB_REPOSITORY) {
  console.error("ERROR: GITHUB_REPOSITORY environment variable is not set.");
  process.exit(1);
}

/**
 * Filter the full unified diff down to only hunks belonging to relevantFiles.
 * Prevents the agent from seeing or commenting on non-design files.
 *
 * @param {string} fullDiff - raw unified diff
 * @param {string[]} relevantFiles - file paths that passed filterFiles()
 * @returns {string} filtered diff containing only relevant file sections
 */
function filterDiffToRelevantFiles(fullDiff, relevantFiles) {
  const relevantSet = new Set(relevantFiles);
  const sections = fullDiff.split(/^(?=diff --git )/m);
  return sections
    .filter((section) => {
      const match = section.match(/^diff --git a\/(.+) b\/.+/);
      return match && relevantSet.has(match[1]);
    })
    .join("");
}

async function run() {
  console.log("=== Keploy Design Review Agent ===");
  console.log(`Trigger: ${process.env.GITHUB_EVENT_NAME}`);
  console.log(`Model: ${CLAUDE_MODEL}`);

  // Step 1: Get the diff
  console.log("Fetching diff...");
  const { diff, changedFiles } = await getDiff();

  if (!diff || diff.trim().length === 0) {
    console.log("No diff found. Nothing to review.");
    await postComment(
      "## Keploy Design Review\n\nNo changes detected in this diff. Nothing to review."
    );
    return;
  }

  console.log(`Total changed files: ${changedFiles.length}`);

  // Step 2: Filter to design-relevant files
  const relevantFiles = filterFiles(changedFiles);
  console.log(`Design-relevant files: ${relevantFiles.length}`);

  if (relevantFiles.length === 0) {
    console.log("No design-relevant files changed. Skipping review.");
    await postComment(
      "## Keploy Design Review\n\n✅ No design-relevant files changed in this diff. Nothing to review."
    );
    return;
  }

  // Step 3: Check API key — only required if we actually have files to review.
  // Exit cleanly (exit 0) so the check doesn't fail and block the PR.
  const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
  if (!ANTHROPIC_API_KEY) {
    console.log("ANTHROPIC_API_KEY not available — skipping review.");
    await postComment(
      "## Keploy Design Review\n\n" +
      "⚪ Design review was skipped because `ANTHROPIC_API_KEY` is not available in this workflow run.\n\n" +
      "Possible causes: the secret is not configured in repo Settings → Secrets → Actions, " +
      "it is restricted to a specific environment that this workflow cannot access, " +
      "or the workflow trigger was changed from `pull_request_target` to `pull_request` " +
      "which may not expose secrets. A maintainer can verify and rerun once resolved."
    );
    return;
  }

  // Step 4: Trim the diff to only the hunks for relevant files
  const filteredDiff = filterDiffToRelevantFiles(diff, relevantFiles);

  // Step 5: Build the prompt
  console.log("Building review prompt...");
  const { system, user } = buildPrompt(filteredDiff, relevantFiles);

  // Step 6: Call Claude API
  console.log(`Calling Claude API (model: ${CLAUDE_MODEL})...`);
  const client = new Anthropic({ apiKey: ANTHROPIC_API_KEY });

  let message;
  try {
    message = await client.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 4096,
      messages: [{ role: "user", content: user }],
      system,
    });
  } catch (err) {
    throw new Error(
      `Claude API request failed (model: ${CLAUDE_MODEL}): ${err.message}`
    );
  }

  const reviewText = message.content
    .filter((block) => block.type === "text")
    .map((block) => block.text)
    .join("\n");

  console.log("Review generated. Posting comment...");
  console.log("--- Review Preview ---");
  console.log(reviewText.slice(0, 500) + (reviewText.length > 500 ? "..." : ""));
  console.log("---------------------");

  // Step 7: Post the comment
  await postComment(reviewText);
  console.log("=== Design review complete ===");
}

run().catch((err) => {
  console.error("Design review agent failed:", err.message);
  process.exit(1);
});
