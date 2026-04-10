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
  // This prevents failures on fork PRs where secrets are unavailable but
  // there are no design files to review anyway (already handled above).
  const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
  if (!ANTHROPIC_API_KEY) {
    console.error("ERROR: ANTHROPIC_API_KEY environment variable is not set.");
    process.exit(1);
  }

  // Step 4: Trim the diff to only the hunks for relevant files
  const filteredDiff = filterDiffToRelevantFiles(diff, relevantFiles);

  // Step 5: Build the prompt
  console.log("Building review prompt...");
  const { system, user } = buildPrompt(filteredDiff, relevantFiles);

  // Step 6: Call Claude API
  console.log("Calling Claude API...");
  const client = new Anthropic({ apiKey: ANTHROPIC_API_KEY });

  const message = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 4096,
    messages: [
      {
        role: "user",
        content: user,
      },
    ],
    system,
  });

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
