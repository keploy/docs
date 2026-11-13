// Asserts every keploy.io/docs URL the capture SDK (@keploy/capture-sdk) ships
// resolves in the built site. These links live in packages on npm, not in a
// page here, so Docusaurus's own broken-link check cannot see them, and a
// published version keeps its links for good.
//
// - Each error the SDK passes to onError carries `remedy.docs`, and its
//   exported SDK_WARNINGS table gives each console warning the same link:
//   https://keploy.io/docs/ui-capture/errors#<id>, where <id> is the code in
//   lower case with `-` for `_`. Each must be an <h2> on that page whose
//   section names the code and says what happened, the cause and the fix.
// - The SDK's README links pages. When a page a published version links to
//   moves, a client redirect in docusaurus.config.js keeps the old URL
//   working; it must lead to a page that exists here, anchor included.
//
// When the SDK gains a code or a README link, add it below.
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

// Every section on the errors page says these three things, in this order.
const PARTS = ["What happened:", "Cause:", "Fix:"];

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

const errorsPage = resolve(`${SITE}ui-capture/errors`);
if (errorsPage.error) {
  problems.push(errorsPage.error);
} else {
  const article = articleOf(errorsPage, `${SITE}ui-capture/errors`);
  // Each h2 in the article, with the text up to the next h2.
  const sections = new Map();
  const headingRe = /<h2\b[^>]*\sid=(?:"([^"]+)"|([^\s">]+))[^>]*>/g;
  const starts = [...article.matchAll(headingRe)];
  starts.forEach((m, i) => {
    const end = i + 1 < starts.length ? starts[i + 1].index : article.length;
    sections.set(m[1] || m[2], article.slice(m.index, end));
  });
  for (const code of ERROR_CODES) {
    const id = errorId(code);
    const section = sections.get(id);
    if (!section) {
      problems.push(`${SITE}ui-capture/errors#${id}: no <h2 id="${id}">`);
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
}

if (problems.length) {
  console.error(`verify-ui-capture-sdk-links:\n  ${problems.join("\n  ")}`);
  process.exit(1);
}
console.log(
  `verify-ui-capture-sdk-links: ok, ${ERROR_CODES.length} error sections and ${README_LINKS.length} README links resolve`
);
