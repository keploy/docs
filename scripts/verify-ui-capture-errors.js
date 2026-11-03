// Asserts the built UI Capture errors page has a section for every code the
// capture SDK (@keploy/capture-sdk) links to. Each error the SDK passes to
// onError carries `remedy.docs`, and its exported SDK_WARNINGS table gives each
// console warning the same link: https://keploy.io/docs/ui-capture/errors#<id>,
// where <id> is the code in lower case with `-` for `_`. A heading renamed or
// removed here would leave that link landing on the top of the page, and
// nothing else in the build notices: these links come from the SDK, not from
// a page in this site.
//
// When the SDK gains a code, add it below and a section for it to
// versioned_docs/version-4.0.0/ui-capture/errors.md.
//
// Usage: node scripts/verify-ui-capture-errors.js <build dir>
const fs = require("fs");
const path = require("path");

const SDK_CODES = [
  // Errors: the capture ends and onError is called.
  "KUI_E_DOM_RECORDER_UNAVAILABLE",
  "KUI_E_INGEST_ENDPOINT_NOT_FOUND",
  "KUI_E_INGEST_KEY_REJECTED",
  "KUI_E_INGEST_REJECTED",
  "KUI_E_PRIVACY_ROUTE_INVALID",
  "KUI_E_SESSION_CONFLICT",
  "KUI_E_SESSION_ID_INVALID",
  // Warnings: one event is dropped and the capture continues.
  "KUI_E_EVENT_OVERSIZED",
  "KUI_E_EVENT_OVERSIZED_SCRUBBING",
  "KUI_E_EVENT_UNSERIALISABLE",
];

// Every section says these three things, in this order.
const PARTS = ["What happened:", "Cause:", "Fix:"];

const buildDir = process.argv[2] || "build";
const pagePath = path.join(buildDir, "ui-capture", "errors", "index.html");

const fail = (msg) => {
  console.error(`verify-ui-capture-errors: ${msg} (${pagePath})`);
  process.exit(1);
};

if (!fs.existsSync(pagePath)) fail("page is missing");
const html = fs.readFileSync(pagePath, "utf8");

// The article only: the table of contents repeats every heading as a link.
const article = html.match(/<article[\s\S]*<\/article>/);
if (!article) fail("no <article> element");

// Each h2 in the article, with the text up to the next h2.
const sections = new Map();
// The id quoted or not, so a minifier that drops the quotes cannot fail it.
const headingRe = /<h2\b[^>]*\sid=(?:"([^"]+)"|([^\s">]+))[^>]*>/g;
const starts = [...article[0].matchAll(headingRe)];
starts.forEach((m, i) => {
  const end = i + 1 < starts.length ? starts[i + 1].index : article[0].length;
  sections.set(m[1] || m[2], article[0].slice(m.index, end));
});

const problems = [];
for (const code of SDK_CODES) {
  const id = code.toLowerCase().replace(/_/g, "-");
  const section = sections.get(id);
  if (!section) {
    problems.push(`no <h2 id="${id}"> for ${code}`);
    continue;
  }
  const text = section.replace(/<[^>]+>/g, "");
  // The whole code: KUI_E_EVENT_OVERSIZED must not pass on a section that
  // names only KUI_E_EVENT_OVERSIZED_SCRUBBING.
  if (!new RegExp(`${code}(?![A-Z0-9_])`).test(text)) {
    problems.push(`section #${id} does not name ${code}`);
  }
  let at = -1;
  for (const part of PARTS) {
    const next = text.indexOf(part, at + 1);
    if (next === -1) {
      problems.push(`section #${id} has no "${part}" after the one before`);
      break;
    }
    at = next;
  }
}

if (problems.length) fail(problems.join("; "));
console.log(
  `verify-ui-capture-errors: ok, ${SDK_CODES.length} sections with what happened, cause and fix`
);
