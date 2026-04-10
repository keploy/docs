// Builds the system and user prompts for the design review agent.

const fs = require("fs");
const path = require("path");

// Max characters for the diff sent to Claude
const MAX_DIFF_CHARS = 80000;

// Max characters for DESIGN_GUIDELINES.md.
// claude-sonnet-4-6 has a 200k token context window (~4 chars/token).
// Budget: 80k diff + 40k guidelines + ~4k system prompt + 4k response = ~128k tokens.
// 40,000 chars leaves comfortable headroom.
const MAX_GUIDELINES_CHARS = 40000;

function loadGuidelines() {
  const guidelinesPath = path.resolve(__dirname, "../../DESIGN_GUIDELINES.md");
  if (!fs.existsSync(guidelinesPath)) {
    throw new Error(
      "DESIGN_GUIDELINES.md not found at repo root. Cannot run design review."
    );
  }

  const full = fs.readFileSync(guidelinesPath, "utf8");

  if (full.length <= MAX_GUIDELINES_CHARS) return full;

  // Guidelines exceed the budget. Extract only the Section 11 block (PR Review
  // Checklist) — stop at the next ## heading (e.g. Appendix) so the Appendix
  // doesn't consume the character budget and truncate the checklist itself.
  const section11Match = full.match(
    /## 11\. PR Review Checklist[\s\S]*?(?=\n## |\n---\n#|$)/
  );
  if (section11Match) {
    const section11 = section11Match[0].slice(0, MAX_GUIDELINES_CHARS);
    return (
      "<!-- Guidelines truncated: sending Section 11 (PR Review Checklist) only -->\n\n" +
      section11
    );
  }

  // Fallback: hard truncate with a note
  return (
    full.slice(0, MAX_GUIDELINES_CHARS) +
    "\n\n[guidelines truncated — see DESIGN_GUIDELINES.md for full content]"
  );
}

function truncateDiff(diff) {
  if (diff.length <= MAX_DIFF_CHARS) return diff;
  return (
    diff.slice(0, MAX_DIFF_CHARS) +
    "\n\n[diff truncated, only first 80,000 characters reviewed]"
  );
}

/**
 * @param {string} diff - unified diff string (already filtered to relevant files)
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
List 3 to 5 design rules that were correctly followed in this diff.

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
