/**
 * prompt.js
 * Builds the system and user prompts for the Claude design review agent.
 */

const fs = require("fs");
const path = require("path");

// Max characters of diff to send — keeps tokens under control
const MAX_DIFF_CHARS = 80000;

function loadGuidelines() {
  const guidelinesPath = path.resolve(
    __dirname,
    "../../DESIGN_GUIDELINES.md"
  );
  if (!fs.existsSync(guidelinesPath)) {
    throw new Error(
      "DESIGN_GUIDELINES.md not found at repo root. Cannot run design review."
    );
  }
  return fs.readFileSync(guidelinesPath, "utf8");
}

function truncateDiff(diff) {
  if (diff.length <= MAX_DIFF_CHARS) return diff;
  return (
    diff.slice(0, MAX_DIFF_CHARS) +
    "\n\n[diff truncated — only first 80,000 characters reviewed]"
  );
}

/**
 * @param {string} diff - unified diff string
 * @param {string[]} changedFiles - list of changed file paths
 * @returns {{ system: string, user: string }}
 */
function buildPrompt(diff, changedFiles) {
  const guidelines = loadGuidelines();
  const truncatedDiff = truncateDiff(diff);

  const system = `You are a strict design review agent for the Keploy Docs website (keploy.io/docs).

Your ONLY job is to review code diffs against the Keploy Docs Design Guidelines.

RULES FOR YOUR REVIEW:
- Only flag issues that are present in the diff provided. Do not comment on code outside the diff.
- Cite the exact rule ID (e.g., A1, B3, C7) from Section 11 of the guidelines for every issue.
- Be concise and specific — point to the exact line or element causing the issue.
- Do not give generic advice. Every comment must reference a specific rule.
- If the diff has no design issues, say so clearly.
- Do not review logic, functionality, or non-design concerns.

OUTPUT FORMAT (strict Markdown):

## Keploy Design Review

### Summary
One sentence verdict: pass / has issues.

### ❌ Blockers
Issues that must be fixed before merge. If none, write "None".
- **[RuleID]** \`filename\`: description of violation

### ⚠️ Major Issues
Issues that should be fixed before merge. If none, write "None".
- **[RuleID]** \`filename\`: description of violation

### ℹ️ Minor Suggestions
Low-impact suggestions. If none, write "None".
- **[RuleID]** \`filename\`: description

### ✅ Passed Checks
List 3–5 design rules that were correctly followed in this diff.

---
*Reviewed against DESIGN_GUIDELINES.md — Keploy Docs Design System*`;

  const user = `## Changed Files
${changedFiles.length > 0 ? changedFiles.map((f) => `- ${f}`).join("\n") : "No files listed."}

## Diff
\`\`\`diff
${truncatedDiff}
\`\`\`

## Design Guidelines
${guidelines}

Review the diff above against the design guidelines. Follow the output format exactly.`;

  return { system, user };
}

module.exports = { buildPrompt };
