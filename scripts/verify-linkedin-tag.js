// Asserts the built homepage carries the LinkedIn Insight Tag, and that the
// Partner ID in it is the one the build was given. Catches a broken prod gate
// or a bad LINKEDIN_PARTNER_ID override in CI, where nobody opens DevTools.
//
// Usage: node scripts/verify-linkedin-tag.js <build dir>
const fs = require("fs");
const path = require("path");

const buildDir = process.argv[2] || "build";
const indexPath = path.join(buildDir, "index.html");
const html = fs.readFileSync(indexPath, "utf8");

const fail = (msg) => {
  console.error(`verify-linkedin-tag: ${msg} (${indexPath})`);
  process.exit(1);
};

const loader = html.includes(
  "https://snap.licdn.com/li.lms-analytics/insight.min.js"
);
if (!loader) fail("insight.min.js loader is missing");

const scriptId = html.match(/_linkedin_partner_id\s*=\s*"(\d+)"/);
if (!scriptId)
  fail("_linkedin_partner_id assignment is missing or not numeric");

const pixelId = html.match(
  /px\.ads\.linkedin\.com\/collect\/\?pid=(\d+)&(?:amp;)?fmt=gif/
);
if (!pixelId) fail("noscript pixel is missing or its pid is not numeric");

if (scriptId[1] !== pixelId[1]) {
  fail(`script id ${scriptId[1]} and noscript pid ${pixelId[1]} differ`);
}

const expected = process.env.LINKEDIN_PARTNER_ID;
if (expected && scriptId[1] !== expected) {
  fail(
    `built id ${scriptId[1]} does not match LINKEDIN_PARTNER_ID=${expected}`
  );
}

console.log(`verify-linkedin-tag: ok, partner id ${scriptId[1]}`);
