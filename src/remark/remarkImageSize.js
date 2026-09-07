// remarkImageSize — dependency-free remark plugin that stamps intrinsic
// width/height onto raw <img> tags so the browser can reserve layout space
// (fixes Cumulative Layout Shift / CLS).
//
// Scope — raw <img> only: Docusaurus's own mdx-loader already resolves and
// sizes Markdown images (`![](/img/x.png)` renders with width/height + a hashed
// asset), so those need nothing from us. What Docusaurus leaves untouched is
// hand-written HTML <img> tags in .md/.mdx (of which this repo has many) — that
// is the gap this plugin fills, and only that, to avoid fighting the native
// image pipeline.
//
// Why hand-rolled instead of `image-size` / `rehype-img-size`:
//   the repo carries BOTH yarn.lock and package-lock.json (Vercel uses yarn,
//   GitHub CI uses npm), so adding a dep means keeping two lockfiles in sync.
//   The header formats we actually need (PNG/GIF/JPEG) are trivially parseable,
//   so we read the first bytes ourselves and add no runtime dependency.
//
// Safety: this plugin NEVER throws. Anything it can't confidently measure
// (remote/relative/data URIs, webp/svg, missing files, malformed headers)
// is silently skipped — the image renders exactly as before, just without the
// CLS win. It also never overwrites author-provided dimensions.

const fs = require("fs");
const path = require("path");

// static/ lives at the repo root, two levels up from src/remark/.
// Resolve against __dirname so it works regardless of build cwd.
const STATIC_DIR = path.resolve(__dirname, "..", "..", "static");

// ---------------------------------------------------------------------------
// Header parsers — each takes a Buffer and returns {width, height} or null.
// ---------------------------------------------------------------------------

// PNG: 8-byte signature, then the IHDR chunk. Width/height are 32-bit
// big-endian integers at byte offsets 16 and 20.
function parsePNG(buf) {
  if (buf.length < 24) return null;
  const sig = "\x89PNG\r\n\x1a\n";
  for (let i = 0; i < 8; i++) {
    if (buf[i] !== sig.charCodeAt(i)) return null;
  }
  if (buf.toString("ascii", 12, 16) !== "IHDR") return null;
  const width = buf.readUInt32BE(16);
  const height = buf.readUInt32BE(20);
  return width && height ? {width, height} : null;
}

// GIF: "GIF87a"/"GIF89a", then the logical screen descriptor. Width/height are
// 16-bit little-endian integers at byte offsets 6 and 8.
function parseGIF(buf) {
  if (buf.length < 10) return null;
  const magic = buf.toString("ascii", 0, 6);
  if (magic !== "GIF87a" && magic !== "GIF89a") return null;
  const width = buf.readUInt16LE(6);
  const height = buf.readUInt16LE(8);
  return width && height ? {width, height} : null;
}

// JPEG: starts with SOI (0xFFD8). Walk the marker segments until a Start-Of-Frame
// marker (0xC0–0xCF, excluding the non-SOF 0xC4/0xC8/0xCC), whose payload carries
// height then width as 16-bit big-endian integers.
function parseJPEG(buf) {
  if (buf.length < 4 || buf[0] !== 0xff || buf[1] !== 0xd8) return null;
  let offset = 2;
  const len = buf.length;
  while (offset + 9 < len) {
    // Markers are 0xFF-prefixed; skip any fill bytes.
    if (buf[offset] !== 0xff) {
      offset++;
      continue;
    }
    const marker = buf[offset + 1];
    // Standalone markers (no length): padding 0xFF, RSTn (0xD0–0xD7), SOI, EOI.
    if (marker === 0xff) {
      offset++;
      continue;
    }
    if ((marker >= 0xd0 && marker <= 0xd9) || marker === 0x01) {
      offset += 2;
      continue;
    }
    const segLen = buf.readUInt16BE(offset + 2);
    if (segLen < 2) return null; // malformed
    const isSOF =
      marker >= 0xc0 &&
      marker <= 0xcf &&
      marker !== 0xc4 &&
      marker !== 0xc8 &&
      marker !== 0xcc;
    if (isSOF) {
      const height = buf.readUInt16BE(offset + 5);
      const width = buf.readUInt16BE(offset + 7);
      return width && height ? {width, height} : null;
    }
    offset += 2 + segLen;
  }
  return null;
}

// Extensions we attempt to measure — a cheap gate so we don't read files we
// can't parse anyway (webp/svg/etc.). The parser itself is chosen by the file's
// actual magic bytes, not its extension, so a mislabeled file (e.g. a PNG saved
// as ".jpg" — this repo has one) is still sized correctly.
const CANDIDATE_EXTS = new Set([".png", ".gif", ".jpg", ".jpeg"]);

// Pick a parser from the buffer's magic bytes, ignoring the file extension.
function parserFor(buf) {
  if (buf.length < 4) return null;
  // PNG: 89 50 4E 47
  if (
    buf[0] === 0x89 &&
    buf[1] === 0x50 &&
    buf[2] === 0x4e &&
    buf[3] === 0x47
  ) {
    return parsePNG;
  }
  // GIF: "GIF"
  if (buf[0] === 0x47 && buf[1] === 0x49 && buf[2] === 0x46) return parseGIF;
  // JPEG: FF D8
  if (buf[0] === 0xff && buf[1] === 0xd8) return parseJPEG;
  return null;
}

// ---------------------------------------------------------------------------
// src -> filesystem path resolution.
// ---------------------------------------------------------------------------

// Returns an absolute path under static/, or null if the src is not a local
// asset we should touch. Skips remote/data/relative URLs and unparseable types.
function resolveStaticPath(src) {
  if (typeof src !== "string" || src.length === 0) return null;

  // Strip query string and hash (e.g. "foo.png?raw=true").
  let clean = src.split("#")[0].split("?")[0];
  if (clean.length === 0) return null;

  // Skip remote, protocol-relative, and data URIs.
  if (/^(https?:)?\/\//i.test(clean) || /^data:/i.test(clean)) return null;

  // Only site-absolute paths (leading "/") map to static/. Bare relative paths
  // ("img/x.png", "./x.png", "../x.png") are relative to the doc file, not
  // static/, so we can't anchor them here — skip, to avoid accidentally
  // stamping a same-named file that happens to live under static/.
  if (!clean.startsWith("/")) return null;

  // Only attempt raster formats with a fixed intrinsic pixel size.
  const ext = path.extname(clean).toLowerCase();
  if (!CANDIDATE_EXTS.has(ext)) return null;

  // Absolute site paths: drop the "/docs/" baseUrl prefix if present, then
  // treat the remainder as relative to static/. So "/docs/img/x.png",
  // "/img/x.png" and "/gif/x.gif" all map into static/.
  if (clean.startsWith("/docs/")) clean = clean.slice("/docs".length);
  clean = clean.replace(/^\/+/, "");

  const abs = path.join(STATIC_DIR, clean);
  // Guard against path traversal escaping static/.
  if (!abs.startsWith(STATIC_DIR + path.sep)) return null;
  return abs;
}

// Full pipeline: src string -> {width, height} or null. Never throws.
// Note: sizeCache is module-level, so it persists for the whole process. Under
// `npm run build` that's a fresh process each time, so it's always accurate.
// Under the dev server (`npm start`) the process is long-lived, so if an author
// replaces an asset with one of different dimensions the stale entry sticks —
// restart the dev server to pick up resized assets.
const sizeCache = new Map();
function measure(src) {
  const abs = resolveStaticPath(src);
  if (!abs) return null;
  if (sizeCache.has(abs)) return sizeCache.get(abs);

  let result = null;
  try {
    const buf = fs.readFileSync(abs);
    const parser = parserFor(buf);
    result = parser ? parser(buf) : null;
  } catch (_e) {
    result = null; // missing/unreadable file — skip silently
  }
  sizeCache.set(abs, result);
  return result;
}

// ---------------------------------------------------------------------------
// AST helpers.
// ---------------------------------------------------------------------------

// Own tree walker — avoids depending on unist-util-visit (ESM/CJS interop).
function walk(node, visitor) {
  if (!node || typeof node !== "object") return;
  visitor(node);
  const children = node.children;
  if (Array.isArray(children)) {
    for (const child of children) walk(child, visitor);
  }
}

// Read a plain-string mdxJsxAttribute by name (ignores expression attributes).
function getJsxAttr(node, name) {
  if (!Array.isArray(node.attributes)) return undefined;
  for (const attr of node.attributes) {
    if (attr && attr.type === "mdxJsxAttribute" && attr.name === name) {
      return attr;
    }
  }
  return undefined;
}

function handleJsxImg(node) {
  if (node.name !== "img") return;
  // Respect any author-provided sizing: if either dimension is already set,
  // leave the element untouched.
  if (getJsxAttr(node, "width") || getJsxAttr(node, "height")) return;

  const srcAttr = getJsxAttr(node, "src");
  if (!srcAttr || typeof srcAttr.value !== "string") return; // dynamic/expression src

  const size = measure(srcAttr.value);
  if (!size) return;

  node.attributes.push(
    {type: "mdxJsxAttribute", name: "width", value: String(size.width)},
    {type: "mdxJsxAttribute", name: "height", value: String(size.height)}
  );
}

// ---------------------------------------------------------------------------
// Plugin entry.
// ---------------------------------------------------------------------------

function remarkImageSize() {
  return function transformer(tree) {
    walk(tree, (node) => {
      if (
        node.type === "mdxJsxFlowElement" ||
        node.type === "mdxJsxTextElement"
      ) {
        handleJsxImg(node);
      }
    });
  };
}

module.exports = remarkImageSize;
