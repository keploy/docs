// Asserts the built sitemap carries real per-page <lastmod> dates. Catches the
// failure mode where every page silently ships one date (a shallow clone, git
// unavailable, the sitemap `lastmod` option dropped), which a green build
// otherwise hides. See src/lastUpdate/contentLastUpdate.js.
//
// Usage: node scripts/verify-lastmod.js <build dir>
const fs = require("fs");
const path = require("path");

// Thresholds. Today: ~216 URLs, ~46 distinct dates, the largest single date
// (#918, a real sitewide rewrite) covers about a third of pages.
const MIN_COVERAGE = 0.9; // share of URLs that must carry <lastmod>
const MIN_DISTINCT_DATES = 10;
const MAX_SHARE_OF_ONE_DATE = 0.5;

const buildDir = process.argv[2] || "build";
const sitemapPath = path.join(buildDir, "sitemap.xml");
const xml = fs.readFileSync(sitemapPath, "utf8");

const fail = (msg) => {
  console.error(`verify-lastmod: ${msg} (${sitemapPath})`);
  process.exit(1);
};

const urls = xml.match(/<url>[\s\S]*?<\/url>/g) || [];
if (!urls.length) fail("no <url> entries");

const dates = urls
  .map((url) => url.match(/<lastmod>([^<]+)<\/lastmod>/))
  .filter(Boolean)
  .map((match) => match[1]);

const coverage = dates.length / urls.length;
if (coverage < MIN_COVERAGE) {
  fail(`only ${dates.length} of ${urls.length} URLs have <lastmod>`);
}

const counts = {};
for (const date of dates) counts[date] = (counts[date] || 0) + 1;
const distinct = Object.keys(counts).length;
if (distinct < MIN_DISTINCT_DATES) {
  fail(`only ${distinct} distinct <lastmod> dates; is git history shallow?`);
}

const [topDate, topCount] = Object.entries(counts).sort(
  (a, b) => b[1] - a[1]
)[0];
if (topCount / dates.length > MAX_SHARE_OF_ONE_DATE) {
  fail(
    `${topCount} of ${dates.length} URLs share <lastmod> ${topDate}; ` +
      "a sitewide sweep may need an entry in .lastmod-ignore-revs"
  );
}

console.log(
  `verify-lastmod: ok (${dates.length}/${urls.length} URLs, ` +
    `${distinct} distinct dates, largest ${topDate} x${topCount})`
);
