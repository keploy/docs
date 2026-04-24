#!/usr/bin/env node
// Submits new/changed docs URLs to Google Indexing API and pings the GSC sitemap endpoint.
// Reads GOOGLE_SERVICE_ACCOUNT_JSON from env; uses a previous-sitemap file for smart diffing
// so only URLs that are new or have a changed <lastmod> date consume quota.
//
// Usage:
//   node scripts/google-index.js \
//     --sitemap build/docs/sitemap.xml \
//     --prev-sitemap .sitemap-prev.xml \
//     --sitemap-url https://keploy.io/docs/sitemap.xml
//   Add --all to force-submit every URL (ignores prev-sitemap).

'use strict';

const { GoogleAuth } = require('google-auth-library');
const fs = require('fs');

const INDEXING_ENDPOINT =
  'https://indexing.googleapis.com/v3/urlNotifications:publish';
const GSC_SITEMAPS_API =
  'https://www.googleapis.com/webmasters/v3/sites';

// Google's published quota: 200 URL_UPDATED notifications per day (default).
// Burst: up to 10 per second before per-second quota kicks in.
const DAILY_QUOTA = 200;
const BURST_SIZE = 10;
const MAX_RETRIES = 3;

// ── helpers ───────────────────────────────────────────────────────────────────

function parseArgs() {
  const argv = process.argv.slice(2);
  const get = (flag) => {
    const i = argv.indexOf(flag);
    return i !== -1 ? argv[i + 1] : null;
  };
  return {
    sitemap:     get('--sitemap')      || 'build/docs/sitemap.xml',
    prevSitemap: get('--prev-sitemap') || '.sitemap-prev.xml',
    sitemapUrl:  get('--sitemap-url')  || 'https://keploy.io/docs/sitemap.xml',
    siteUrl:     get('--site-url')     || 'https://keploy.io/',
    all:         argv.includes('--all'),
  };
}

// Returns Map<url, lastmod|null> — lastmod is the raw string from <lastmod> or
// null when the tag is absent. Used for both presence and date diffing.
function parseSitemap(filepath) {
  if (!fs.existsSync(filepath)) return new Map();
  const content = fs.readFileSync(filepath, 'utf8');
  const result = new Map();
  // Match each <url>…</url> block so loc and lastmod stay paired.
  const urlBlocks = content.match(/<url>[\s\S]*?<\/url>/g) || [];
  for (const block of urlBlocks) {
    const locMatch     = block.match(/<loc>([^<]+)<\/loc>/);
    const lastmodMatch = block.match(/<lastmod>([^<]+)<\/lastmod>/);
    if (locMatch) {
      result.set(locMatch[1].trim(), lastmodMatch ? lastmodMatch[1].trim() : null);
    }
  }
  return result;
}

// Mirror the same filters used by the IndexNow step so both pipelines
// submit identical URL sets: no /tags/ pages, no versioned /docs/N.M.P/ paths.
function filterUrl(url) {
  return !url.includes('/tags/') && !/\/docs\/\d+\.\d+\.\d+\//.test(url);
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

// ── Google Indexing API ───────────────────────────────────────────────────────

// Retries on 429, 5xx, and network errors with exponential backoff.
// Hard 4xx (e.g. 404, 403) are permanent failures — no retry.
async function submitOne(token, url, type) {
  let delay = 1000;
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const res = await fetch(INDEXING_ENDPOINT, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url, type }),
      });

      if (res.ok) return { ok: true };

      const body = await res.text().catch(() => '');
      const retryable = res.status === 429 || res.status >= 500;

      if (!retryable || attempt === MAX_RETRIES) {
        return { ok: false, status: res.status, body: body.slice(0, 200) };
      }

      console.log(`    retry ${attempt}/${MAX_RETRIES} after ${delay}ms (HTTP ${res.status})`);
    } catch (err) {
      // Network-level error (DNS, connection reset, timeout).
      if (attempt === MAX_RETRIES) {
        return { ok: false, status: 0, body: err.message };
      }
      console.log(`    retry ${attempt}/${MAX_RETRIES} after ${delay}ms (${err.message})`);
    }

    await sleep(delay);
    delay *= 2;
  }
  // Guard: unreachable with MAX_RETRIES > 0, but prevents implicit undefined return.
  return { ok: false, status: 0, body: 'max retries exceeded' };
}

async function submitBatch(token, urls, type) {
  let ok = 0;
  let fail = 0;

  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    const result = await submitOne(token, url, type);
    if (result.ok) {
      ok++;
      if (i < 5 || i % 10 === 0 || i === urls.length - 1) {
        console.log(`  [${i + 1}/${urls.length}] ✓ ${url}`);
      }
    } else {
      console.log(`  [${i + 1}/${urls.length}] ✗ HTTP ${result.status} — ${url}`);
      console.log(`    Response: ${result.body}`);
      fail++;
    }

    // Stay under burst limit: 10 req/s.
    if ((i + 1) % BURST_SIZE === 0 && i + 1 < urls.length) {
      await sleep(1100);
    }
  }

  return { ok, fail };
}

async function submitUrls(token, updatedUrls, deletedUrls) {
  let totalFail = 0;

  // ── URL_UPDATED ─────────────────────────────────────────────────────────────
  const toUpdate = updatedUrls.slice(0, DAILY_QUOTA);
  if (updatedUrls.length > DAILY_QUOTA) {
    console.log(
      `::warning::${updatedUrls.length} URLs to update but daily quota is ${DAILY_QUOTA}; ` +
      `submitting first ${DAILY_QUOTA}. Request a quota increase at console.cloud.google.com.`
    );
  }

  if (toUpdate.length > 0) {
    console.log(`\nSubmitting ${toUpdate.length} URL_UPDATED notification(s)…`);
    const { ok, fail } = await submitBatch(token, toUpdate, 'URL_UPDATED');
    console.log(`URL_UPDATED: ${ok} accepted, ${fail} failed.`);
    totalFail += fail;
  } else {
    console.log('No new/changed URLs to submit (URL_UPDATED).');
  }

  // ── URL_DELETED ─────────────────────────────────────────────────────────────
  // Quota for deletions shares the same 200/day pool — only send if there's
  // remaining budget after updates.
  const deletionBudget = Math.max(0, DAILY_QUOTA - toUpdate.length);
  const toDelete = deletedUrls.slice(0, deletionBudget);

  if (toDelete.length > 0) {
    console.log(`\nSubmitting ${toDelete.length} URL_DELETED notification(s)…`);
    const { ok, fail } = await submitBatch(token, toDelete, 'URL_DELETED');
    console.log(`URL_DELETED: ${ok} accepted, ${fail} failed.`);
    totalFail += fail;
  }

  if (deletedUrls.length > toDelete.length) {
    console.log(
      `::warning::${deletedUrls.length - toDelete.length} deleted URL(s) skipped — ` +
      `quota exhausted. They will be signalled on the next deploy.`
    );
  }

  return totalFail;
}

// ── GSC Sitemap ping ──────────────────────────────────────────────────────────

async function pingSitemap(token, siteUrl, sitemapUrl) {
  try {
    const endpoint =
      `${GSC_SITEMAPS_API}/${encodeURIComponent(siteUrl)}` +
      `/sitemaps/${encodeURIComponent(sitemapUrl)}`;

    const res = await fetch(endpoint, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok || res.status === 204) {
      console.log(`\nGSC sitemap ping: OK (HTTP ${res.status}) — ${sitemapUrl}`);
    } else {
      const body = await res.text().catch(() => '');
      console.log(
        `\n::warning::GSC sitemap ping returned HTTP ${res.status}. Body: ${body.slice(0, 300)}`
      );
    }
  } catch (err) {
    console.log(`\n::warning::GSC sitemap ping failed: ${err.message}`);
  }
}

// ── main ─────────────────────────────────────────────────────────────────────

async function main() {
  const args = parseArgs();

  const saJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!saJson) {
    console.log(
      '::error::GOOGLE_SERVICE_ACCOUNT_JSON is not set. ' +
      'Add the service account key JSON as a GitHub secret.'
    );
    process.exit(1);
  }

  let credentials;
  try {
    credentials = JSON.parse(saJson);
  } catch {
    console.log('::error::GOOGLE_SERVICE_ACCOUNT_JSON is not valid JSON.');
    process.exit(1);
  }

  if (!fs.existsSync(args.sitemap)) {
    console.log(`::notice::Sitemap not found at ${args.sitemap} — skipping.`);
    process.exit(0);
  }

  // Fetch the token once — valid for 1 hour, well beyond the ~22s runtime
  // for 200 URLs. No need to call getAccessToken() per request.
  const auth = new GoogleAuth({
    credentials,
    scopes: [
      'https://www.googleapis.com/auth/indexing',
      'https://www.googleapis.com/auth/webmasters',
    ],
  });
  const client = await auth.getClient();
  const { token } = await client.getAccessToken();
  if (!token) {
    console.log('::error::Failed to obtain an access token. Check that the service account key is valid and the Indexing API is enabled on its Cloud project.');
    process.exit(1);
  }

  const newMap  = parseSitemap(args.sitemap);
  const prevMap = args.all ? new Map() : parseSitemap(args.prevSitemap);

  const hasPrev = !args.all && fs.existsSync(args.prevSitemap);
  if (!hasPrev) {
    console.log(
      args.all
        ? '--all flag set: submitting every URL in the sitemap.'
        : 'No previous sitemap cached — submitting all current URLs (first run).'
    );
  } else {
    console.log(`Prev sitemap: ${prevMap.size} URLs | New sitemap: ${newMap.size} URLs`);
  }

  // URLs to update: new URL OR same URL with a different/newer lastmod date.
  const updatedUrls = [];
  for (const [url, lastmod] of newMap) {
    if (!filterUrl(url)) continue;
    if (!prevMap.has(url)) {
      updatedUrls.push(url); // new page
    } else if (lastmod && prevMap.get(url) !== lastmod) {
      updatedUrls.push(url); // existing page with updated content
    }
  }

  // URLs to delete: present in previous sitemap but gone from the new one.
  const deletedUrls = [];
  for (const [url] of prevMap) {
    if (!filterUrl(url)) continue;
    if (!newMap.has(url)) {
      deletedUrls.push(url);
    }
  }

  console.log(
    `Changed/new: ${updatedUrls.length} | Deleted: ${deletedUrls.length}`
  );

  const failures = await submitUrls(token, updatedUrls, deletedUrls);
  await pingSitemap(token, args.siteUrl, args.sitemapUrl);

  if (failures > 0) process.exit(1);
}

main().catch((err) => {
  console.log(`::error::Unhandled error: ${err.message}`);
  process.exit(1);
});
