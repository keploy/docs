#!/usr/bin/env node
/**
 * Verifies the JSON-LD graph in the built site.
 *
 * The @id-based consolidation only pays off if every bare {"@id": "..."}
 * reference resolves to a node actually defined on the same page -- an
 * unresolved reference is worse than the inline duplicate it replaced,
 * because consumers get a dangling pointer instead of an entity. This walks
 * the built HTML and fails on unparseable JSON-LD, dangling references, or a
 * regression to the generic `Article` type. noindex pages (archived versions)
 * are skipped. Note it verifies JSON validity and @id resolution, not that
 * every emitted `url` actually resolves.
 *
 * Usage: node scripts/verify-schema-graph.js [buildDir]
 */
const fs = require("fs");
const path = require("path");

const buildDir = process.argv[2] || "build";

// Pages Docusaurus renders with a `noindex` robots meta (archived versions
// carrying `noIndex: true`, etc.) are skipped: they keep their own legacy
// schema copies and are never served to crawlers. Detected from the built HTML
// rather than a hard-coded version list, so it can't drift when a version is
// archived.
const NOINDEX_RE = /<meta[^>]+name="robots"[^>]+content="[^"]*noindex/i;

function findHtml(dir, out = []) {
  for (const entry of fs.readdirSync(dir, {withFileTypes: true})) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      findHtml(full, out);
    } else if (entry.name === "index.html") {
      out.push(full);
    }
  }
  return out;
}

// The build inlines JSON-LD into <script type="application/ld+json">. The
// <Head>/Helmet emitters HTML-escape entities while the raw-text body <script>
// (remark FAQ plugin) does not, so unescape defensively before parsing --
// unescaping already-clean JSON is a no-op here.
const SCRIPT_RE =
  /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g;

// A page is its own WebPage: the idiomatic `mainEntityOfPage:
// {"@type":"WebPage","@id":<pageUrl>}` points at the document itself, which has
// no separate full node. Seed `defined` with the page's own URL so that
// self-reference resolves, while a typed ref to any *other* undefined @id is
// still caught as dangling. Use og:url, not the canonical <link>: a few docs
// set a cross-site canonical (e.g. to the blog), but og:url is always the
// page's own trailing-slash URL, which is what the schema @id derives from.
const OG_URL_RE = /<meta[^>]+property="og:url"[^>]+content="([^"]+)"/i;

function unescapeHtml(s) {
  return s
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
}

// Collect every node that declares an @id, and every bare {"@id"} reference.
function walk(node, defined, referenced) {
  if (Array.isArray(node)) {
    node.forEach((n) => walk(n, defined, referenced));
    return;
  }
  if (!node || typeof node !== "object") {
    return;
  }
  const keys = Object.keys(node).filter((k) => k !== "@context");
  if (node["@id"]) {
    // A node is a *reference* when it carries nothing beyond @id -- including
    // the idiomatic typed form {"@type":"Person","@id":"…"}, which has two keys
    // but still only points at an entity defined elsewhere. Only a node with a
    // real property (name, url, …) *defines* the entity. Treating typed refs as
    // definitions would let a typed pointer at an undefined @id pass silently,
    // which is exactly the dangling case this guard exists to catch.
    const propsBeyondId = keys.filter((k) => k !== "@id" && k !== "@type");
    if (propsBeyondId.length === 0) {
      referenced.add(node["@id"]);
    } else {
      defined.add(node["@id"]);
    }
  }
  for (const key of keys) {
    walk(node[key], defined, referenced);
  }
}

const files = findHtml(buildDir);

let parseErrors = 0;
let dangling = 0;
let blocks = 0;
let scanned = 0;
const typeCounts = new Map();

for (const file of files) {
  const html = fs.readFileSync(file, "utf8");
  // Skip noindex pages (archived versions etc.) -- see NOINDEX_RE above.
  if (NOINDEX_RE.test(html)) {
    continue;
  }
  scanned += 1;
  const defined = new Set();
  const referenced = new Set();
  const ownUrl = html.match(OG_URL_RE);
  if (ownUrl) {
    defined.add(ownUrl[1]);
  }
  let match;
  SCRIPT_RE.lastIndex = 0;
  while ((match = SCRIPT_RE.exec(html))) {
    blocks += 1;
    let parsed;
    try {
      parsed = JSON.parse(unescapeHtml(match[1]));
    } catch (err) {
      parseErrors += 1;
      console.error(`INVALID JSON-LD  ${file}\n  ${err.message}`);
      continue;
    }
    const graph = parsed["@graph"] || parsed;
    walk(graph, defined, referenced);
    for (const n of Array.isArray(graph) ? graph : [graph]) {
      const t = n && n["@type"];
      if (typeof t === "string") {
        typeCounts.set(t, (typeCounts.get(t) || 0) + 1);
      }
    }
  }
  for (const ref of referenced) {
    if (!defined.has(ref)) {
      dangling += 1;
      console.error(`DANGLING @id     ${file}\n  ${ref}`);
    }
  }
}

// The specialization work replaced every generic `Article` with a subtype
// (TechArticle / APIReference / BlogPosting). Pin that: a stray generic
// `Article` reappearing is a regression the shape checks above wouldn't catch.
const genericArticles = typeCounts.get("Article") || 0;

console.log(`\nPages scanned:     ${scanned}`);
console.log(`JSON-LD blocks:    ${blocks}`);
console.log(`Invalid JSON:      ${parseErrors}`);
console.log(`Dangling @id refs: ${dangling}`);
console.log(`Generic Article:   ${genericArticles}`);
console.log("\nTop-level @type distribution:");
for (const [type, count] of [...typeCounts].sort((a, b) => b[1] - a[1])) {
  console.log(`  ${String(count).padStart(5)}  ${type}`);
}
if (genericArticles) {
  console.error(
    `\nFAIL: ${genericArticles} generic "Article" node(s) -- use TechArticle/APIReference/BlogPosting.`
  );
}

process.exit(parseErrors || dangling || genericArticles ? 1 : 0);
