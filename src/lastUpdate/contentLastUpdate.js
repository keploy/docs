// contentLastUpdate — the date a doc's *content* last changed, for the
// "Last updated" line, the TechArticle `dateModified`, and the sitemap
// `<lastmod>`.
//
// Why not Docusaurus's own git date: it takes the newest commit that touched
// the file, whatever that commit did. In this repo that is badly wrong:
//   - cutting a docs version copies every page into versioned_docs/version-X/,
//     so every page "changes" on the day the version is cut;
//   - sitewide sweeps (front matter / SEO fields, formatting) touch most pages
//     without changing what they say.
// A <lastmod> that moves when nothing a reader sees has changed is one Google
// learns to ignore, for the whole sitemap.
//
// What counts as a content change: the Markdown body (everything after the
// front matter) differs once whitespace is collapsed. Walking a file's history
// newest-first, commits that only touch front matter or whitespace are
// skipped, and when the file was created by a copy or rename (a version cut, a
// move) the walk carries on through the file it came from, as long as the body
// came across unchanged.
//
// Commits that change bodies without changing content (a mass find-and-replace,
// a link rewrite) can be skipped by listing them in .lastmod-ignore-revs at the
// repo root, the same way .git-blame-ignore-revs works for blame.
//
// The result is injected as `last_update` front matter (see parseFrontMatter in
// docusaurus.config.js), which Docusaurus already prefers over git. A
// `last_update.date` written by hand in a doc always wins.
//
// Limitation: a page that imports a shared partial does not move its date
// when only the partial changes (same as stock Docusaurus).
//
// Safety: this never throws. When it cannot answer (dev server, no git, a
// shallow clone, a file git does not track) it returns null and Docusaurus
// falls back to its own behaviour.

const {execFile, spawnSync} = require("child_process");
const fs = require("fs");
const path = require("path");

const REPO_ROOT = path.resolve(__dirname, "..", "..");
const IGNORE_REVS_FILE = path.join(REPO_ROOT, ".lastmod-ignore-revs");

// Only docs content is dated this way; pages and partials keep the default.
const DOC_DIRS = ["docs", "versioned_docs"].map(
  (dir) => path.join(REPO_ROOT, dir) + path.sep
);

// ~400 docs are parsed concurrently at build time; cap the git processes.
const MAX_GIT_PROCESSES = 16;
let runningGit = 0;
const gitQueue = [];

function git(args) {
  return new Promise((resolve) => {
    const start = () => {
      runningGit += 1;
      execFile(
        "git",
        args,
        {cwd: REPO_ROOT, maxBuffer: 64 * 1024 * 1024},
        (err, stdout) => {
          runningGit -= 1;
          if (gitQueue.length) gitQueue.shift()();
          resolve(err ? null : stdout);
        }
      );
    };
    if (runningGit < MAX_GIT_PROCESSES) start();
    else gitQueue.push(start);
  });
}

function memoize(fn) {
  const cache = new Map();
  return (...args) => {
    const key = args.join("\0");
    if (!cache.has(key)) cache.set(key, fn(...args));
    return cache.get(key);
  };
}

function readIgnoreRevs() {
  try {
    return (
      fs
        .readFileSync(IGNORE_REVS_FILE, "utf8")
        .split("\n")
        .map((line) => line.replace(/#.*/, "").trim())
        // Short prefixes would match most of history; require 7+ hex chars.
        .filter((rev) => /^[0-9a-f]{7,40}$/i.test(rev))
        .map((rev) => rev.toLowerCase())
    );
  } catch {
    return [];
  }
}
const ignoreRevs = readIgnoreRevs();
const isIgnored = (hash) => ignoreRevs.some((rev) => hash.startsWith(rev));

// Body with front matter removed and whitespace collapsed, so front-matter
// edits, re-wrapping and trailing-space fixes all compare equal.
function contentOf(source) {
  if (source === null) return null;
  return source
    .replace(/^﻿?---\r?\n[\s\S]*?\r?\n---(\r?\n|$)/, "")
    .replace(/\s+/g, " ")
    .trim();
}

const readContent = memoize(async (rev, file) =>
  contentOf(await git(["show", `${rev}:${file}`]))
);

// For a commit, which added paths were copied or renamed, and from where.
const copySources = memoize(async (hash) => {
  const out = await git([
    "diff",
    "--name-status",
    "-M",
    "-C",
    "--find-copies-harder",
    "-l0",
    `${hash}^`,
    hash,
  ]);
  const sources = new Map();
  for (const line of (out || "").split("\n")) {
    const [status, from, to] = line.split("\t");
    if (to && /^[RC]/.test(status)) sources.set(to, from);
  }
  return sources;
});

// Newest commit, at or before `rev`, that changed the content of `file`.
async function lastContentChange(file, rev) {
  const log = await git([
    "log",
    "--no-merges",
    "--format=%H%x09%ct%x09%an",
    rev,
    "--",
    file,
  ]);
  if (!log) return null;

  for (const line of log.trim().split("\n")) {
    const [hash, timestamp, author] = line.split("\t");
    const change = {timestamp: Number(timestamp) * 1000, author};
    const ignored = isIgnored(hash);
    const after = await readContent(hash, file);
    if (after === null) continue; // the commit deleted the file
    const before = await readContent(`${hash}^`, file);

    if (before === null) {
      // The file was created here. If it is a copy or rename, keep walking
      // through the original, unless the content changed on the way over.
      const source = (await copySources(hash)).get(file);
      // Creating a file is always a content change, even in an ignored commit.
      if (!source) return change;
      const sourceContent = await readContent(`${hash}^`, source);
      if (!ignored && sourceContent !== after) return change;
      return lastContentChange(source, `${hash}^`);
    }

    if (!ignored && before !== after) return change;
  }
  return null;
}

let enabled;
function isEnabled() {
  if (enabled !== undefined) return enabled;
  // Docusaurus itself skips git in dev and when this env var is set; match it.
  if (
    process.env.NODE_ENV !== "production" ||
    process.env.DOCUSAURUS_DISABLE_LAST_UPDATE === "true"
  ) {
    return (enabled = false);
  }
  const shallow = spawnSync("git", ["rev-parse", "--is-shallow-repository"], {
    cwd: REPO_ROOT,
    encoding: "utf8",
  }).stdout?.trim();
  if (shallow !== "false") {
    // A shallow clone has no history to walk; every page would get the date
    // of the newest commit. CI must check out with fetch-depth: 0.
    console.warn(
      "[contentLastUpdate] git history unavailable (shallow clone?): " +
        "doc last-update dates and sitemap <lastmod> will not be accurate."
    );
    return (enabled = false);
  }
  return (enabled = true);
}

const lastUpdateFor = memoize(async (filePath) => {
  const file = path.relative(REPO_ROOT, filePath).split(path.sep).join("/");
  try {
    return await lastContentChange(file, "HEAD");
  } catch {
    return null;
  }
});

// Adds `last_update` to a parsed doc's front matter. Hand-written values win.
async function withContentLastUpdate(filePath, parsed) {
  const {frontMatter} = parsed;
  if (
    !isEnabled() ||
    frontMatter.last_update?.date ||
    !DOC_DIRS.some((dir) => filePath.startsWith(dir))
  ) {
    return parsed;
  }
  const change = await lastUpdateFor(filePath);
  if (!change) return parsed;
  return {
    ...parsed,
    frontMatter: {
      ...frontMatter,
      last_update: {
        date: new Date(change.timestamp).toISOString(),
        author: frontMatter.last_update?.author ?? change.author,
      },
    },
  };
}

module.exports = {withContentLastUpdate};
