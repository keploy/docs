// Asserts every docs URL that moved still leads to its page in the built
// site. A moved page's old URL lives on in bookmarks, search results, blog
// posts and other sites' links, so it must keep working for good: a client
// redirect (plugin-client-redirects) sends it on. Docusaurus's own
// broken-link check cannot see this, because nothing on the site links to an
// old URL any more.
//
// The list of moves is src/redirects.js, the same list docusaurus.config.js
// gives the plugin, so a redirect added there is checked here too. For each
// one, the build must hold:
// - a redirect page at each old URL whose target is the new URL,
// - a real page (not another redirect) at the new URL, and
// - when the new URL names a #fragment, an element with that id on the page.
//
// A page moved or deleted with no redirect listed is not in that list. So,
// given a base build (the branch the change goes into, built the same way),
// every page in the base build's sitemap must still lead to a page here: the
// page itself, or a redirect to a real page.
//
// Usage: node scripts/verify-moved-urls.js <build dir> [<base build dir>]
const fs = require("fs");
const path = require("path");

const REDIRECTS = require("../src/redirects");

const BASE_URL = "/docs/";

// The page plugin-client-redirects writes at an old URL.
const REDIRECT_RE = /<meta http-equiv="refresh" content="0; url=([^"]+)">/;

const buildDir = process.argv[2];
const baseDir = process.argv[3];
if (!buildDir) {
  console.error(
    "usage: node scripts/verify-moved-urls.js <build dir> [<base build dir>]"
  );
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

// The text as a RegExp that matches only itself (a "." in #v1.2 is a dot).
const escapeRe = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// An element with that id, its quotes kept or dropped by the minifier.
const hasId = (html, id) => {
  const re = escapeRe(id);
  return new RegExp(`\\sid=(?:"${re}"|${re}[\\s>])`).test(html);
};

// A redirect target as the browser lands on it. plugin-client-redirects drops
// the slash before a #fragment (/x#y for /x/#y), and keploy.io answers a path
// without its trailing slash with a redirect to the path with it, so both are
// one page.
function canon(url) {
  const [p, f] = url.split("#");
  return (p.endsWith("/") ? p : p + "/") + (f === undefined ? "" : "#" + f);
}

// Each old URL with the URL it moved to. The plugin takes one `from` or a list.
const moves = [];
for (const {from, to} of REDIRECTS) {
  for (const f of [].concat(from)) moves.push({from: f, to});
}

const failures = [];
if (moves.length === 0) {
  failures.push(
    `src/redirects.js lists no redirects: the check would pass on nothing.`
  );
}
for (const {from, to} of moves) {
  const [toPath, fragment = ""] = to.split("#");
  const old = readPage(from);
  if (old === null) {
    failures.push(
      `${from}: no page at the old URL (${pageFile(from)}). Does ` +
        `docusaurus.config.js still give src/redirects.js to ` +
        `plugin-client-redirects?`
    );
    continue;
  }
  const m = old.match(REDIRECT_RE);
  if (!m) {
    failures.push(
      `${from}: the old URL holds a page, not a redirect to ${to}. A page ` +
        `moved back there? Then remove its redirect from src/redirects.js.`
    );
    continue;
  }
  const want = BASE_URL + to.replace(/^\//, "");
  if (canon(m[1]) !== canon(want)) {
    failures.push(
      `${from}: redirects to ${m[1]}, not to ${want}. Point its redirect ` +
        `at the page's current URL.`
    );
    continue;
  }
  const target = readPage(toPath);
  if (target === null) {
    failures.push(
      `${from}: redirects to ${to}, but no page is built there ` +
        `(${pageFile(toPath)}). The page moved again? Point its redirect in ` +
        `src/redirects.js at its current URL.`
    );
    continue;
  }
  if (REDIRECT_RE.test(target)) {
    failures.push(
      `${from}: redirects to ${to}, which is itself a redirect. Point it at ` +
        `the page's current URL, so a reader takes one hop.`
    );
    continue;
  }
  if (fragment && !hasId(target, fragment)) {
    failures.push(
      `${from}: redirects to ${to}, but ${pageFile(toPath)} has no ` +
        `id="${fragment}". The heading was renamed? Point the redirect at ` +
        `its current anchor.`
    );
  }
}

// Every page of the base build, by its URL under BASE_URL.
let basePages = [];
if (baseDir) {
  const sitemap = path.join(baseDir, "sitemap.xml");
  const xml = fs.readFileSync(sitemap, "utf8");
  basePages = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
    (m) => new URL(m[1]).pathname
  );
  if (basePages.length === 0) {
    failures.push(
      `${sitemap} lists no pages: the check would pass on nothing.`
    );
  }
}
for (const loc of basePages) {
  if (!loc.startsWith(BASE_URL)) {
    failures.push(`${loc}: the base sitemap lists a page outside ${BASE_URL}.`);
    continue;
  }
  const url = "/" + loc.slice(BASE_URL.length);
  const page = readPage(url);
  if (page === null) {
    failures.push(
      `${url}: the base build has this page and this build has nothing ` +
        `there. Moved or deleted? Add a redirect from it to the page that ` +
        `replaces it in src/redirects.js.`
    );
    continue;
  }
  const m = page.match(REDIRECT_RE);
  if (!m) continue;
  const to = m[1].split("#")[0];
  const target = to.startsWith(BASE_URL)
    ? readPage("/" + to.slice(BASE_URL.length))
    : null;
  if (target === null || REDIRECT_RE.test(target)) {
    failures.push(
      `${url}: the base build has this page, and here it redirects to ` +
        `${m[1]}, which is not a page. Point its redirect in ` +
        `src/redirects.js at the page that replaces it.`
    );
  }
}

if (failures.length > 0) {
  console.error(`${failures.length} moved URL(s) no longer lead to a page:`);
  for (const f of failures) console.error(`- ${f}`);
  process.exit(1);
}
console.log(`All ${moves.length} moved URLs redirect to their pages.`);
if (baseDir) {
  console.log(
    `All ${basePages.length} pages of the base build still lead to a page.`
  );
}
