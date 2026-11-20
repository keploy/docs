// Asserts every docs URL that moved still leads to its page in the built
// site. A moved page's old URL lives on in bookmarks, search results, blog
// posts and other sites' links, so it must keep working for good: a client
// redirect in docusaurus.config.js (plugin-client-redirects) sends it on.
// Docusaurus's own broken-link check cannot see this, because nothing on the
// site links to an old URL any more.
//
// For each move below, the build must hold:
// - a redirect page at the old URL whose target is the new URL, and
// - a real page (not another redirect) at the new URL.
//
// When a page moves, add its old and new URL below in the same change.
//
// Usage: node scripts/verify-moved-urls.js <build dir>
const fs = require("fs");
const path = require("path");

const BASE_URL = "/docs/";

const MOVES = [
  // Into the Universal Mocker section.
  {
    from: "/running-keploy/mock-quickstart/",
    to: "/universal-mocker/mock-quickstart/",
  },
  {
    from: "/running-keploy/mock-your-tests/",
    to: "/universal-mocker/mock-your-tests/",
  },
];

// The page plugin-client-redirects writes at an old URL.
const REDIRECT_RE = /<meta http-equiv="refresh" content="0; url=([^"]+)">/;

const buildDir = process.argv[2];
if (!buildDir) {
  console.error("usage: node scripts/verify-moved-urls.js <build dir>");
  process.exit(2);
}

function pageFile(url) {
  return path.join(buildDir, url, "index.html");
}

function readPage(url) {
  try {
    return fs.readFileSync(pageFile(url), "utf8");
  } catch (err) {
    return null;
  }
}

const failures = [];
for (const {from, to} of MOVES) {
  const old = readPage(from);
  if (old === null) {
    failures.push(
      `${from}: no page at the old URL (${pageFile(from)}). Add a redirect ` +
        `from it to ${to} in docusaurus.config.js's plugin-client-redirects.`
    );
    continue;
  }
  const m = old.match(REDIRECT_RE);
  if (!m) {
    failures.push(
      `${from}: the old URL holds a page, not a redirect to ${to}. A page ` +
        `moved back there? Then remove this move from ${__filename}.`
    );
    continue;
  }
  if (m[1] !== BASE_URL + to.replace(/^\//, "")) {
    failures.push(
      `${from}: redirects to ${m[1]}, not to ${BASE_URL}${to.replace(
        /^\//,
        ""
      )}. Point its redirect at the page's current URL.`
    );
    continue;
  }
  const target = readPage(to);
  if (target === null) {
    failures.push(
      `${from}: redirects to ${to}, but no page is built there ` +
        `(${pageFile(to)}). The page moved again? Point the redirect, and ` +
        `this entry, at its current URL.`
    );
    continue;
  }
  if (REDIRECT_RE.test(target)) {
    failures.push(
      `${from}: redirects to ${to}, which is itself a redirect. Point it at ` +
        `the page's current URL, so a reader takes one hop.`
    );
  }
}

if (failures.length > 0) {
  console.error(`${failures.length} moved URL(s) no longer lead to a page:`);
  for (const f of failures) console.error(`- ${f}`);
  process.exit(1);
}
console.log(`All ${MOVES.length} moved URLs redirect to their pages.`);
