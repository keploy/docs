// Asserts every keploy.io/docs URL the capture SDK (@keploy/capture-sdk) and
// the Keploy UI tools (the `keploy ui` commands, the replay engine and the
// tools an AI agent calls) ship resolves in the built site. These links live
// in packages and binaries, not in a page here, so Docusaurus's own
// broken-link check cannot see them, and a published version keeps its links
// for good.
//
// - Each error the SDK passes to onError carries `remedy.docs`, and its
//   exported SDK_WARNINGS table gives each console warning the same link:
//   https://keploy.io/docs/ui-capture/errors#<id>, where <id> is the code in
//   lower case with `-` for `_`. Each must be an <h2> on that page whose
//   section names the code and says its exit code, what happened, the cause
//   and the fix. A Keploy UI tool's error carries the same `remedy.docs`.
// - KUI_E_REFUSED_BY_DESIGN's `remedy.docs` links the refusals page, and each
//   refused verb's entry links its section there:
//   https://keploy.io/docs/ui-capture/refusals#<verb>.
// - The SDK's README links pages. When a page a published version links to
//   moves, a client redirect in docusaurus.config.js keeps the old URL
//   working; it must lead to a page that exists here, anchor included.
//
// When the SDK or the tools gain a code, a refused verb or a README link,
// add it below.
//
// Usage: node scripts/verify-ui-capture-sdk-links.js <build dir>
const fs = require("fs");
const path = require("path");

const SITE = "https://keploy.io/docs/";

const ERROR_CODES = [
  // Errors (SDK_ERRORS): the capture ends, or never starts, and onError is
  // called.
  "KUI_E_CAPTURE_DECLINED",
  "KUI_E_DOM_RECORDER_UNAVAILABLE",
  "KUI_E_INGEST_ENDPOINT_NOT_FOUND",
  "KUI_E_INGEST_KEY_REJECTED",
  "KUI_E_INGEST_REJECTED",
  "KUI_E_PRIVACY_CONFLICT",
  "KUI_E_PRIVACY_ROUTE_INVALID",
  "KUI_E_SESSION_CONFLICT",
  "KUI_E_SESSION_ID_INVALID",
  "KUI_E_STRICT_ATTRIBUTES_UNAVAILABLE",
  // Warnings (SDK_WARNINGS): a console line, and the capture continues.
  "KUI_E_BODY_WORKER_UNAVAILABLE",
  "KUI_E_EVENT_OVERSIZED",
  "KUI_E_EVENT_OVERSIZED_SCRUBBING",
  "KUI_E_EVENT_UNSERIALISABLE",
  "KUI_E_NAVIGATION_UNWRAPPED",
  "KUI_E_REQUEST_TERM_FAILED",
  // The Keploy UI tools: a tool error, and the process exits with its code.
  "KUI_E_ARTIFACT_INLINE_IMAGE",
  "KUI_E_BROWSER_MISSING",
  "KUI_E_CATALOGUE_TOO_LARGE",
  "KUI_E_COUNTS_DO_NOT_SUM",
  "KUI_E_DETERMINISM_CERT_STALE",
  "KUI_E_ENGINE_INPUT_INVALID",
  "KUI_E_ENV_NOT_READY",
  "KUI_E_ENVELOPE_INVALID",
  "KUI_E_ENVELOPE_OVERFLOW",
  "KUI_E_FIELD_NAME_DRIFT",
  "KUI_E_IMAGE_DIGEST_MISMATCH",
  "KUI_E_INVALID_INPUT",
  "KUI_E_MOCK_UNMATCHED_REQUEST",
  "KUI_E_NEEDS_HUMAN",
  "KUI_E_NO_FLOWS_MATCHED",
  "KUI_E_NODE_BELOW_FLOOR",
  "KUI_E_NOISE_FLOOR_UNMEASURED",
  "KUI_E_NONDETERMINISTIC_RUN",
  "KUI_E_NOT_IMPLEMENTED",
  "KUI_E_REFUSED_BY_DESIGN",
  "KUI_E_RUNTIME_PATH_REFUSED",
  "KUI_E_SCHEMA_DRIFT",
  "KUI_E_SENSITIVITY_BELOW_NOISE",
  "KUI_E_SERVER_REJECTED",
  "KUI_E_SERVER_UNREACHABLE",
  "KUI_E_SIGN_IN_REQUIRED",
  "KUI_E_TEST_NOT_EXECUTED",
  "KUI_E_TOOL_FAILED",
  "KUI_E_TOOL_NOT_AVAILABLE",
  "KUI_E_UNKNOWN_TOOL",
  "KUI_E_UNKNOWN_VERDICT",
  "KUI_E_USAGE",
  "KUI_E_VERDICT_DOCUMENT_REFUSED",
];

// The verbs KUI_E_REFUSED_BY_DESIGN refuses, each a section of the refusals
// page, which itself names the code.
const REFUSED_VERBS = [
  "heal",
  "quarantine",
  "retry",
  "set-tolerance",
  "update-snapshots",
];

const README_LINKS = [
  // The README of the releases after 3.0.1.
  "https://keploy.io/docs/",
  "https://keploy.io/docs/running-keploy/ui-capture/",
  // The README of 3.0.1, on npm: pages that have since moved.
  "https://keploy.io/docs/ui-capture/overview/",
  "https://keploy.io/docs/ui-capture/install-sdk/",
];

const errorId = (code) => code.toLowerCase().replace(/_/g, "-");

// Every section on both pages says these four things, in this order.
const PARTS = ["Exit code:", "What happened:", "Cause:", "Fix:"];

const buildDir = process.argv[2] || "build";
const problems = [];

// The client redirect page @docusaurus/plugin-client-redirects writes.
const REFRESH_RE = /<meta http-equiv="refresh" content="0; url=([^"]+)">/;

// The built file a URL is served from, following one client redirect, and
// the fragment the browser ends up at. keploy.io answers a path without its
// trailing slash with a redirect to the path with it, so both are one file.
function resolve(url, redirected = null) {
  if (!url.startsWith(SITE)) return {error: `${url} is not under ${SITE}`};
  const u = new URL(url);
  let rel = u.pathname.slice(new URL(SITE).pathname.length);
  if (rel && !rel.endsWith("/")) rel += "/";
  const file = path.join(buildDir, rel, "index.html");
  if (!fs.existsSync(file)) {
    return {
      error: `${url}: no ${file}${redirected ? ` (from ${redirected})` : ""}`,
    };
  }
  const html = fs.readFileSync(file, "utf8");
  const refresh = html.match(REFRESH_RE);
  // A redirect page this does not recognise must fail, not pass unfollowed.
  if (!refresh && /http-equiv=["']?refresh/i.test(html)) {
    return {
      error: `${url}: ${file} redirects in a form this check cannot read`,
    };
  }
  if (refresh) {
    if (redirected) return {error: `${redirected} redirects more than once`};
    const to = new URL(refresh[1], url);
    // The redirect page appends the old URL's fragment to its target.
    if (!to.hash) to.hash = u.hash;
    return resolve(to.href, url);
  }
  return {
    file,
    html,
    fragment: decodeURIComponent(u.hash.slice(1)),
    redirected,
  };
}

// The page's article: the table of contents repeats every heading as a link.
function articleOf(page, url) {
  const m = page.html.match(/<article[\s\S]*<\/article>/);
  if (!m) problems.push(`${url}: ${page.file} has no <article>`);
  return m ? m[0] : "";
}

// An element with that id, its quotes kept or dropped by the minifier.
const hasId = (html, id) =>
  new RegExp(`\\sid=(?:"${id}"|${id}[\\s>])`).test(html);

for (const url of README_LINKS) {
  const page = resolve(url);
  if (page.error) {
    problems.push(page.error);
    continue;
  }
  if (page.fragment && !hasId(articleOf(page, url), page.fragment)) {
    problems.push(`${url}: ${page.file} has no id="${page.fragment}"`);
  }
}

// Each section a link names: an <h2> with that id, whose text up to the next
// <h2> names `name` whole and says PARTS in order. `pageNames`, when given, is
// a code the page's article must name, for a link to the page itself.
function checkSections(pageUrl, wanted, pageNames = null) {
  const page = resolve(pageUrl);
  if (page.error) {
    problems.push(page.error);
    return;
  }
  const article = articleOf(page, pageUrl);
  // The whole name: KUI_E_EVENT_OVERSIZED must not pass on a section that
  // names only KUI_E_EVENT_OVERSIZED_SCRUBBING, nor `heal` on `auto-heal`.
  const names = (text, name) =>
    new RegExp(`(?<![A-Za-z0-9_-])${name}(?![A-Za-z0-9_-])`).test(text);
  if (pageNames && !names(article.replace(/<[^>]+>/g, ""), pageNames)) {
    problems.push(`${pageUrl} does not name ${pageNames}`);
  }
  // Each h2 in the article, with the text up to the next h2.
  const sections = new Map();
  const headingRe = /<h2\b[^>]*\sid=(?:"([^"]+)"|([^\s">]+))[^>]*>/g;
  const starts = [...article.matchAll(headingRe)];
  starts.forEach((m, i) => {
    const end = i + 1 < starts.length ? starts[i + 1].index : article.length;
    sections.set(m[1] || m[2], article.slice(m.index, end));
  });
  for (const {id, name} of wanted) {
    const section = sections.get(id);
    if (!section) {
      problems.push(`${pageUrl}#${id}: no <h2 id="${id}">`);
      continue;
    }
    const text = section.replace(/<[^>]+>/g, "");
    if (!names(text, name)) {
      problems.push(`section ${pageUrl}#${id} does not name ${name}`);
    }
    let at = -1;
    for (const part of PARTS) {
      const next = text.indexOf(part, at + 1);
      if (next === -1) {
        problems.push(
          `section ${pageUrl}#${id} has no "${part}" after the one before`
        );
        break;
      }
      at = next;
    }
  }
}

checkSections(
  `${SITE}ui-capture/errors`,
  ERROR_CODES.map((code) => ({id: errorId(code), name: code}))
);
checkSections(
  `${SITE}ui-capture/refusals`,
  REFUSED_VERBS.map((verb) => ({id: verb, name: verb})),
  "KUI_E_REFUSED_BY_DESIGN"
);

if (problems.length) {
  console.error(`verify-ui-capture-sdk-links:\n  ${problems.join("\n  ")}`);
  process.exit(1);
}
console.log(
  `verify-ui-capture-sdk-links: ok, ${ERROR_CODES.length} error sections, ${REFUSED_VERBS.length} refused verbs and ${README_LINKS.length} README links resolve`
);
