#!/usr/bin/env bash
#
# deploy-docs-test.sh — end-to-end test of deploy-docs.sh against a local S3.
#
#   AWS_ENDPOINT_URL=http://localhost:5000 .github/scripts/deploy-docs-test.sh [build_dir]
#
#   build_dir  `npm run build`'s output. The test deploys that real site. With
#              no argument it synthesises a small Docusaurus-shaped one.
#
# The endpoint is a moto server (motoserver/moto), which serves S3 and
# CloudFront. build_and_check.yml runs one as a service and this against the
# PR's own build. Locally:
#
#   docker run -d -p 127.0.0.1:5000:5000 motoserver/moto:5.2.3
#
# It replays the deploys that broke production, and the weeks after them, with
# DEPLOY_NOW standing in for the clock. The property under test: no asset a
# live, cached or open page can still reference is ever deleted, and every
# asset nothing can reference any more eventually is.

set -euo pipefail
export LC_ALL=C
# No `| head` anywhere below: under pipefail, head closing the pipe early fails
# the writer with SIGPIPE, and whether it does depends on timing. sed -n 1p
# reads to the end.

: "${AWS_ENDPOINT_URL:?point AWS_ENDPOINT_URL at a moto server}"
export AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID:-testing}
export AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY:-testing}
export AWS_DEFAULT_REGION=${AWS_DEFAULT_REGION:-us-east-1}
export AWS_PAGER=

here=$(cd "$(dirname "$0")" && pwd)
deploy="$here/deploy-docs.sh"
tmp=$(mktemp -d)
trap 'rm -rf "$tmp"' EXIT

# moto differs from S3 in two ways the prune depends on, so a shim in front of
# the aws CLI puts S3's behaviour back for delete-objects:
#   - S3 rejects more than 1000 keys in one call; moto takes any number.
#   - In quiet mode S3 returns only the keys that failed, so on success the CLI
#     prints nothing at all; moto lists every key it deleted.
# Without it, a prune that sent one oversized batch, or choked on an empty
# response, would pass here and fail in production.
REAL_AWS=$(command -v aws)
export REAL_AWS
mkdir -p "$tmp/bin"
# It also logs each call when AWS_CALL_LOG is set, so the test can check the
# order a deploy runs its steps in; and when a call matches AWS_FAIL_MATCH it
# makes the call, then fails it, the way a sync that dies after uploading does.
cat > "$tmp/bin/aws" << 'SHIM'
#!/usr/bin/env bash
set -euo pipefail
if [ -n "${AWS_CALL_LOG:-}" ]; then
  echo "$*" >> "$AWS_CALL_LOG"
fi
# CloudFront, as the deploy sees it: the status in CloudFront's own casing
# ("Completed"; moto says "COMPLETED"), "InProgress" for the first
# AWS_INVALIDATION_PENDING polls, and AccessDenied when AWS_INVALIDATION_DENY
# is set.
if [ "${1:-} ${2:-}" = "cloudfront get-invalidation" ]; then
  if [ -n "${AWS_INVALIDATION_DENY:-}" ]; then
    echo "An error occurred (AccessDenied) when calling the GetInvalidation operation: User is not authorized to perform: cloudfront:GetInvalidation" >&2
    exit 254
  fi
  status=$("$REAL_AWS" "$@")
  polls=$(($(cat "$AWS_INVALIDATION_POLLS" 2> /dev/null || echo 0) + 1))
  echo "$polls" > "$AWS_INVALIDATION_POLLS"
  if [ "$polls" -le "${AWS_INVALIDATION_PENDING:-0}" ]; then
    echo InProgress
  elif [ "$(printf '%s' "$status" | tr '[:upper:]' '[:lower:]')" = completed ]; then
    echo Completed
  else
    echo "$status"
  fi
  exit 0
fi
if [ -n "${AWS_FAIL_MATCH:-}" ] && [[ "$*" =~ $AWS_FAIL_MATCH ]]; then
  "$REAL_AWS" "$@" || true
  echo "injected failure: $*" >&2
  exit 1
fi
if [ "${1:-}" != s3api ] || [ "${2:-}" != delete-objects ]; then
  exec "$REAL_AWS" "$@"
fi
req=
prev=
for a in "$@"; do
  [ "$prev" = --delete ] && req=${a#file://}
  prev=$a
done
if [ "$(jq '.Objects | length' "$req")" -gt 1000 ]; then
  echo "An error occurred (MalformedXML) when calling the DeleteObjects operation: The XML you provided was not well-formed or did not validate against our published schema" >&2
  exit 254
fi
out=$("$REAL_AWS" "$@")
if [ "$(jq '.Quiet // false' "$req")" = true ]; then
  printf '%s' "$out" | jq -e '(.Errors // []) | length > 0' > /dev/null 2>&1 &&
    printf '%s\n' "$out" | jq '{Errors}'
  exit 0
fi
printf '%s\n' "$out"
SHIM
chmod +x "$tmp/bin/aws"
# sleep, logged: the invalidation wait is checked by what the deploy slept, not
# by wall-clock time, which a slow runner would make flaky.
REAL_SLEEP=$(command -v sleep)
export REAL_SLEEP
cat > "$tmp/bin/sleep" << 'SHIM'
#!/usr/bin/env bash
if [ -n "${SLEEP_LOG:-}" ]; then
  echo "$*" >> "$SLEEP_LOG"
fi
exec "$REAL_SLEEP" "$@"
SHIM
chmod +x "$tmp/bin/sleep"
export PATH="$tmp/bin:$PATH"
export AWS_INVALIDATION_POLLS=$tmp/invalidation-polls
# Enough for deploy 1's one slow poll; short enough that a deploy that never
# sees "Completed" fails this test in seconds, not after 15 minutes.
export DOCS_INVALIDATION_WAIT_SECONDS=30

MANIFESTS=docs/_deploy/asset-manifests
ASSET_CACHE='public, max-age=31536000, immutable'
PAGE_CACHE='public, max-age=0, s-maxage=86400, must-revalidate'
STATIC_CACHE='public, max-age=3600, s-maxage=86400'

failures=0
pass() { echo "  ok   $*"; }
fail() {
  echo "  FAIL $*"
  failures=$((failures + 1))
}
check() { # check <description> <command...>
  local what=$1
  shift
  if "$@"; then pass "$what"; else fail "$what"; fi
}

for _ in $(seq 30); do
  aws s3api list-buckets > /dev/null 2>&1 && break
  sleep 1
done

# ---------------------------------------------------------------- the sites

# v1: the build as main.yml stages it, with docs/ at the root.
mkdir -p "$tmp/v1"
if [ "$#" -ge 1 ]; then
  cp -R "$1" "$tmp/v1/docs"
else
  d="$tmp/v1/docs"
  mkdir -p "$d/assets/js" "$d/assets/css" "$d/assets/fonts" "$d/assets/images" \
    "$d/server/installation" "$d/img"
  printf '%s\n' '<html><link href="/docs/assets/css/styles.22222222.css"><script src="/docs/assets/js/runtime~main.11111111.js"></script>' \
    '<img src="/docs/assets/images/arch-0123456789abcdef0123456789abcdef.webp"></html>' > "$d/index.html"
  printf '%s\n' '<html><script src="/docs/assets/js/runtime~main.11111111.js"></script>' \
    '<script src="/docs/assets/js/00000001.00001eef.js"></script>' \
    '<a href="https://github.com/keploy/docs/assets/53110238/not-ours">x</a></html>' > "$d/server/installation/index.html"
  echo '# Install — “quoted”' > "$d/server/installation.md"
  echo '# Keploy — “home”' > "$d/index.md"
  echo '# Keploy — API tests · “récord”' > "$d/llms.txt"
  echo '<urlset/>' > "$d/sitemap.xml"
  echo '<svg/>' > "$d/img/logo.svg"
  echo '<svg/>' > "$d/img/old-diagram.svg"
  echo 'runtime' > "$d/assets/js/runtime~main.11111111.js"
  echo 'body{}' > "$d/assets/css/styles.22222222.css"
  echo 'font' > "$d/assets/fonts/inter-33333333.woff2"
  echo 'img' > "$d/assets/images/arch-0123456789abcdef0123456789abcdef.webp"
  # More than one listing page (1000 keys), so the prune's listing must
  # paginate to see them all — and, once v2 renames them, more than one
  # delete-objects batch.
  for i in $(seq 1100); do
    printf 'chunk %s' "$i" > "$d/assets/js/$(printf '%08x' "$i").$(printf '%08x' $((i * 7919))).js"
  done
fi
v1=$tmp/v1

# Everything under assets/ is served as immutable, so it must all be
# content-hashed. Enforced on the real build too: an un-hashed file here would
# be cached for a year under a name the next deploy reuses.
unhashed=$(cd "$v1" && find docs/assets -type f | sed -E 's#.*/##; s/\.(map|LICENSE\.txt)$//' |
  { grep -vE '[.-][0-9a-f]{8,}\.[A-Za-z0-9]+$' || true; })
check "every file under docs/assets/ is content-hashed${unhashed:+: $unhashed}" test -z "$unhashed"
# deploy-docs.sh sorts files into cache classes by extension, and aws s3 sync
# filters are case-sensitive: a page.HTML would be cached as a static file.
upper=$(cd "$v1" && find docs -path docs/assets -prune -o -type f -print |
  { grep -iE '\.(html|xml|json|txt|md)$' || true; } | { grep -vE '\.(html|xml|json|txt|md)$' || true; })
check "pages and text files use lowercase extensions${upper:+: $upper}" test -z "$upper"

# v2: the next build, after something like a Docusaurus upgrade — EVERY chunk
# renamed — and with one page, one markdown copy and one image removed and a
# page added. One file of each class goes, so each sync pass's --delete is
# exercised.
cp -R "$v1" "$tmp/v2"
v2=$tmp/v2
(cd "$v2/docs/assets/js" && for f in *; do mv "$f" "v2-$f"; done)
# ...and its pages point at the renamed chunks, as a real build's would.
find "$v2/docs" -path "$v2/docs/assets" -prune -o -type f -name '*.html' -print0 |
  xargs -0 perl -pi -e 's#/docs/assets/js/#/docs/assets/js/v2-#g'
gone_asset=$(cd "$v1" && find docs/assets/js -type f -name '*.js' | sort | sed -n 1p)
new_asset="docs/assets/js/v2-${gone_asset##*/}"
# Picked from the build, so a PR that moves some page cannot break this test.
gone_page=$(cd "$v1" && find docs -path docs/assets -prune -o -type f -name index.html -print |
  { grep -vx docs/index.html || true; } | sort | tail -n 1)
gone_md=$(cd "$v1" && find docs -path docs/assets -prune -o -type f -name '*.md' -print | sort | sed -n 1p)
gone_static=$(cd "$v1" && find docs -path docs/assets -prune -o -type f -name '*.svg' -print | sort | sed -n 1p)
rm "$v2/$gone_page" "$v2/$gone_md" "$v2/$gone_static"
new_page=docs/new-page/index.html
mkdir -p "$v2/docs/new-page"
echo '<html>new</html>' > "$v2/$new_page"

# v2a: the build deploy 2 ships and then fails partway through. It is v2 plus
# one chunk only it has, loaded by its new page; the re-run ships plain v2. So
# d2's pages go live, are replaced a day later, and the chunk they loaded must
# outlive them by the retention window although d2 never completed.
cp -R "$v2" "$tmp/v2a"
v2a=$tmp/v2a
d2_asset=docs/assets/js/d2only.0badf00d.js
echo 'd2 only' > "$v2a/$d2_asset"
printf '<html><script src="/%s"></script></html>\n' "$d2_asset" > "$v2a/$new_page"

# ---------------------------------------------------------------- helpers

bucket="docs-e2e-$$-$RANDOM"
aws s3api create-bucket --bucket "$bucket" > /dev/null
CLOUDFRONT_DISTRIBUTION_ID=$(aws cloudfront create-distribution --origin-domain-name "$bucket.s3.amazonaws.com" \
  --query 'Distribution.Id' --output text)
export CLOUDFRONT_DISTRIBUTION_ID
dist=$CLOUDFRONT_DISTRIBUTION_ID

keys() { # every key under a prefix, sorted
  aws s3api list-objects-v2 --bucket "$bucket" --prefix "${1:-}" \
    --query 'Contents[].Key' --output json | jq -r '.[]?' | sort
}
site_keys() { (cd "$1" && find docs -type f) | sort; }
# The bucket's files, and a site's, outside docs/assets and the manifests.
bucket_pages() { keys docs/ | grep -vE '^docs/(assets|_deploy)/' || true; }
site_pages() { site_keys "$1" | grep -v '^docs/assets/' || true; }
has() { aws s3api head-object --bucket "$bucket" --key "$1" > /dev/null 2>&1; }
lacks() { ! has "$1"; }
all_lack() { for k in "$@"; do lacks "$k" || return 1; done; }
header() { aws s3api head-object --bucket "$bucket" --key "$1" --query "$2" --output text; }
header_is() { [ "$(header "$1" "$2")" = "$3" ]; }
header_matches() { header "$1" "$2" | grep -qE "$3"; }
pages_are() { diff <(site_pages "$1") <(bucket_pages) > /dev/null; }
asset_keys_of() { for s in "$@"; do (cd "$s" && find docs/assets -type f); done; }
assets_are() { # the bucket's assets are exactly those of the given sites
  diff <(asset_keys_of "$@" | sort -u) <(keys docs/assets/) > /dev/null
}
assets_are_plus() { # assets_are, plus one key that is not in any site
  local extra=$1
  shift
  diff <({ asset_keys_of "$@"; echo "$extra"; } | sort -u) <(keys docs/assets/) > /dev/null
}
manifests() { keys "$MANIFESTS/" | sed 's#.*/##' | tr '\n' ' ' | sed 's/ $//'; }
sleeps() { { cat "$tmp/sleeps" 2> /dev/null || true; } | tr '\n' ' ' | sed 's/ $//'; }
# The docs/assets keys the pages under a directory load: same-site URLs only,
# so github.com/keploy/docs/assets/... attachment links are not mistaken for
# ours.
refs() {
  grep -rhoE '(src|href|content)="(https://keploy\.io)?/docs/assets/[^"]+' --include='*.html' "$1" |
    sed -E 's#^[a-z]+="(https://keploy\.io)?/##; s/[?#].*//' | sort -u
}
refs_resolve() { # every asset the pages under a directory load is in the bucket
  local want
  want=$(refs "$1" || true)
  # An empty set would make this pass vacuously.
  [ -n "$want" ] && [ -z "$(comm -23 <(printf '%s\n' "$want") <(keys docs/assets/))" ]
}
live_refs_resolve() { # ...and so does every page the bucket serves right now
  rm -rf "$tmp/live"
  aws s3 sync "s3://$bucket/docs" "$tmp/live/docs" --exclude '*' --include '*.html' --only-show-errors
  refs_resolve "$tmp/live"
}
# Line of the first logged aws call matching a pattern (0 if none).
call_at() { grep -nE -m 1 -- "$1" "$tmp/calls" | cut -d: -f1 || echo 0; }
steps_in_order() {
  local assets manifest static txt md pages static_delete invalidate done_marker
  assets=$(call_at '^s3 sync [^ ]+/docs/assets s3://')
  manifest=$(call_at '^s3 cp [^ ]+ s3://[^ ]+/asset-manifests/[^ ]+\.txt')
  static=$(call_at '^s3 sync [^ ]+ s3://[^ ]+ --exclude \*\.html')
  txt=$(call_at '^s3 sync .* --include \*\.txt')
  md=$(call_at '^s3 sync .* --include \*\.md')
  pages=$(call_at '^s3 sync .* --include \*\.html')
  static_delete=$(call_at '^s3 sync [^ ]+ s3://[^ ]+ --delete --exclude \*\.html')
  invalidate=$(call_at '^cloudfront create-invalidation')
  done_marker=$(call_at '^s3 cp - s3://[^ ]+/asset-manifests/[^ ]+\.done')
  echo "     assets=$assets manifest=$manifest static=$static txt=$txt md=$md pages=$pages" \
    "static-delete=$static_delete invalidate=$invalidate done=$done_marker"
  [ "$assets" -gt 0 ] && [ "$assets" -lt "$manifest" ] && [ "$manifest" -lt "$static" ] &&
    [ "$static" -lt "$pages" ] && [ "$txt" -lt "$pages" ] && [ "$md" -lt "$pages" ] &&
    [ "$manifest" -lt "$txt" ] && [ "$manifest" -lt "$md" ] &&
    [ "$pages" -lt "$invalidate" ] && [ "$invalidate" -lt "$static_delete" ] &&
    [ "$static_delete" -lt "$done_marker" ]
}
invalidations() {
  aws cloudfront list-invalidations --distribution-id "$dist" --output json |
    jq '.InvalidationList.Items // [] | length'
}
run_deploy() { # run_deploy <site> <epoch> <id>
  echo "  -- deploy $3 at DEPLOY_NOW=$2"
  : > "$tmp/calls"
  rm -f "$AWS_INVALIDATION_POLLS" "$tmp/sleeps"
  DEPLOY_NOW=$2 AWS_CALL_LOG=$tmp/calls SLEEP_LOG=$tmp/sleeps "$deploy" "$1" "$bucket" "$3" > "$tmp/out" 2>&1 || {
    cat "$tmp/out"
    fail "deploy $3 exited non-zero"
    return 1
  }
  sed 's/^/     | /' "$tmp/out"
  # A shell error the script survived is still a bug: it means some value was
  # not what the code assumed, and the next change may not be so lucky.
  if grep -qE 'integer expression expected|syntax error|unbound variable|command not found|No such file' "$tmp/out"; then
    fail "deploy $3 printed a shell error"
  fi
}

DAY=86400
HOUR=3600
T0=1790000000

# The bucket as the old s3-deploy action left it: every object carrying the
# malformed "max-age=public," header, plus files a newer build no longer has.
aws s3 sync "$v1" "s3://$bucket" --cache-control 'max-age=public,' --only-show-errors
pre_asset=docs/assets/js/pre-manifest.deadbeef.js
echo old | aws s3 cp - "s3://$bucket/$pre_asset" --only-show-errors
orphan_page=docs/retired/index.html
echo old | aws s3 cp - "s3://$bucket/$orphan_page" --only-show-errors
# A CI build is always newer than the bucket it deploys over, and sync uploads
# a file only when it is newer than the object (or a different size). So stamp
# the builds after the seed, as a real build is — or the header checks below
# would pass or fail on the order this test happened to write files in.
sleep 1
find "$v1" "$v2" "$v2a" -type f -exec touch {} +

sample_asset=$(cd "$v1" && find docs/assets/js -type f -name '*.js' | sort | tail -n 1)
sample_css=$(cd "$v1" && find docs/assets/css -type f -name '*.css' | sed -n 1p)
sample_font=$(cd "$v1" && find docs/assets -type f -name '*.woff2' | sed -n 1p)
sample_md=$(cd "$v2" && find docs -path docs/assets -prune -o -type f -name '*.md' -print | sort | sed -n 1p)
sample_static=$(cd "$v2" && find docs -path docs/assets -prune -o -type f -name '*.svg' -print | sort | sed -n 1p)

# ---------------------------------------------------------------- scenarios

echo "== deploy 1: v1 over the old action's bucket, its invalidation slow to land"
export AWS_INVALIDATION_PENDING=1
run_deploy "$v1" "$T0" d1
unset AWS_INVALIDATION_PENDING
check "outside docs/assets the bucket holds exactly v1" pages_are "$v1"
check "a page v1 no longer has is deleted" lacks "$orphan_page"
check "v1's assets are all there, and the pre-manifest one is kept: history is shorter than the window" \
  assets_are_plus "$pre_asset" "$v1"
check "assets are cached as immutable (and the old malformed header is gone)" \
  header_is "$sample_asset" CacheControl "$ASSET_CACHE"
check "pages revalidate on every load" header_is docs/index.html CacheControl "$PAGE_CACHE"
check "the sitemap revalidates too" header_is docs/sitemap.xml CacheControl "$PAGE_CACHE"
check "llms.txt revalidates" header_is docs/llms.txt CacheControl "$PAGE_CACHE"
check "llms.txt is text/plain in UTF-8, not Latin-1 by default" \
  header_is docs/llms.txt ContentType 'text/plain; charset=utf-8'
check "a page's .md copy is text/markdown in UTF-8" \
  header_is "$sample_md" ContentType 'text/markdown; charset=utf-8'
check "a static image is cached for an hour, not revalidated on every load" \
  header_is "$sample_static" CacheControl "$STATIC_CACHE"
check "html is served as text/html" header_matches docs/index.html ContentType '^text/html'
check "js is served as javascript" header_matches "$sample_asset" ContentType 'javascript'
check "css is served as text/css" header_matches "$sample_css" ContentType '^text/css'
check "svg is served as image/svg+xml" header_matches "$sample_static" ContentType '^image/svg\+xml'
if [ -n "$sample_font" ]; then
  check "woff2 is served as a font" header_matches "$sample_font" ContentType '^font/woff2'
fi
check "the manifest lists exactly v1's assets" \
  diff <(cd "$v1" && find docs/assets -type f | sort) \
  <(aws s3 cp "s3://$bucket/$MANIFESTS/$T0-d1.txt" - --only-show-errors)
check "the manifest is marked complete" test "$(manifests)" = "$T0-d1.done $T0-d1.txt"
check "CloudFront is invalidated once" test "$(invalidations)" = 1
check "assets, manifest, static, text, pages last; then invalidation, static deletions and the marker" \
  steps_in_order
check "every asset a live page loads is in the bucket" live_refs_resolve
# Counting polls is not enough: a loop that stopped sleeping between them
# would burn the whole wait in a second and fall to the "not landed" path.
check "it slept 10s between the InProgress poll and the next" test "$(sleeps)" = 10
check "static deletions waited for CloudFront to report the invalidation Completed" \
  test "$(sed -n "1,$(call_at '^s3 sync [^ ]+ s3://[^ ]+ --delete --exclude \*\.html')p" "$tmp/calls" |
    grep -c '^cloudfront get-invalidation')" = 2

echo "== deploy 2: v2a an hour later, dying once its pages are up"
if DEPLOY_NOW=$((T0 + HOUR)) AWS_FAIL_MATCH='--include \*\.html' "$deploy" "$v2a" "$bucket" d2 > "$tmp/out" 2>&1; then
  fail "a deploy whose page sync fails exits 0"
else
  pass "a deploy whose page sync fails exits non-zero"
fi
check "the failure was the injected one, in the page sync" grep -q 'injected failure: s3 sync' "$tmp/out"
check "its manifest is written but not marked complete" \
  test "$(manifests)" = "$T0-d1.done $T0-d1.txt $((T0 + HOUR))-d2.txt"
check "its pages went live" has "$new_page"
check "v1's chunks all survive it, and d2's are all up" assets_are_plus "$pre_asset" "$v1" "$v2a"
check "every page left live loads only assets in the bucket" live_refs_resolve

echo "== deploy 2, re-run: a day later, succeeding"
run_deploy "$v2" $((T0 + DAY)) d2r
check "every v1 chunk is still served, for v1 pages still open" has "$gone_asset"
check "and d2's chunk, for d2 pages still open" has "$d2_asset"
check "v2's chunks are served" has "$new_asset"
check "outside docs/assets the bucket holds exactly v2" pages_are "$v2"
check "the removed page, markdown copy and image are deleted" \
  all_lack "$gone_page" "$gone_md" "$gone_static"
check "the added page is served" has "$new_page"
check "CloudFront is invalidated again, once" test "$(invalidations)" = 2
check "every asset a live v2 page loads is in the bucket" live_refs_resolve
check "and every asset a v1 page still open in a tab loads" refs_resolve "$v1"

echo "== deploy 3: v2, 14 days and 2 hours after deploy 1"
# The window starts at T0+2h. d2 (T0+1h) is before it, but it failed, so it
# cannot be the boundary: that is d1, the newest COMPLETED deploy before the
# window. v1's chunks stay, and so do d2's — its pages were live until d2r, a
# day in, whether or not d2 ever finished.
run_deploy "$v2" $((T0 + 14 * DAY + 2 * HOUR)) d3
check "v1's and d2's chunks are kept: a failed deploy is not a boundary, but its assets count" \
  assets_are "$v1" "$v2a"
check "the pre-manifest asset is deleted: d1 replaced it before the window began" lacks "$pre_asset"
check "a v1 page open since d2r still loads" refs_resolve "$v1"
check "every manifest from d1 on is kept" \
  test "$(manifests)" = "$T0-d1.done $T0-d1.txt $((T0 + HOUR))-d2.txt $((T0 + DAY))-d2r.done $((T0 + DAY))-d2r.txt $((T0 + 14 * DAY + 2 * HOUR))-d3.done $((T0 + 14 * DAY + 2 * HOUR))-d3.txt"

echo "== deploy 4: v2, 15 days and 1 hour after deploy 1"
# The window starts at T0+1d+1h: d2r is now the boundary, and it replaced
# every v1 and d2 page more than 14 days ago.
run_deploy "$v2" $((T0 + 15 * DAY + HOUR)) d4
check "every v1-only and d2-only chunk is deleted — more than one delete batch's worth" assets_are "$v2"
check "every asset a live page loads is still in the bucket" live_refs_resolve
check "the prune reports deleting them all" \
  grep -q "deleted $(comm -23 <(asset_keys_of "$v1" "$v2a" | sort -u) <(asset_keys_of "$v2" | sort) | wc -l | tr -d ' ') unused asset" "$tmp/out"
check "outside docs/assets the bucket holds exactly v2" pages_are "$v2"
check "manifests and markers from before d2r are dropped" \
  test "$(manifests)" = "$((T0 + DAY))-d2r.done $((T0 + DAY))-d2r.txt $((T0 + 14 * DAY + 2 * HOUR))-d3.done $((T0 + 14 * DAY + 2 * HOUR))-d3.txt $((T0 + 15 * DAY + HOUR))-d4.done $((T0 + 15 * DAY + HOUR))-d4.txt"

echo "== a manifest prefix holding something this script did not write"
stray=docs/assets/js/stray.abcdef12.js
echo stray | aws s3 cp - "s3://$bucket/$stray" --only-show-errors
echo x | aws s3 cp - "s3://$bucket/$MANIFESTS/notes.txt" --only-show-errors
run_deploy "$v2" $((T0 + 60 * DAY)) d5
check "the prune is skipped rather than guessing" grep -q 'notes.txt is not something this script wrote' "$tmp/out"
check "so an unused asset is left in place" has "$stray"
check "and nothing else moved" assets_are_plus "$stray" "$v2"
aws s3 rm "s3://$bucket/$MANIFESTS/notes.txt" --only-show-errors

# v3: v2 without one static file, to watch when a dropped static file goes.
cp -R "$v2" "$tmp/v3"
v3=$tmp/v3
rm "$v3/$sample_static"
find "$v3" -type f -exec touch {} +

echo "== deploy 6: v3, its invalidation not landing in time"
export AWS_INVALIDATION_PENDING=99 DOCS_INVALIDATION_WAIT_SECONDS=5
run_deploy "$v3" $((T0 + 61 * DAY)) d6
unset AWS_INVALIDATION_PENDING
export DOCS_INVALIDATION_WAIT_SECONDS=30
check "it says the invalidation had not landed" grep -q 'had not landed after 5s' "$tmp/out"
check "and it waited exactly its 5s budget, not a whole 10s poll past it" test "$(sleeps)" = 5
check "so the static file v3 dropped is left for the next deploy" has "$sample_static"
check "and the deploy is still marked complete" has "$MANIFESTS/$((T0 + 61 * DAY))-d6.done"

echo "== deploy 7: v3, the deploy user unable to read the invalidation"
if DEPLOY_NOW=$((T0 + 62 * DAY)) AWS_INVALIDATION_DENY=1 "$deploy" "$v3" "$bucket" d7 > "$tmp/out" 2>&1; then
  fail "a deploy that cannot read its invalidation exits 0"
else
  pass "a deploy that cannot read its invalidation fails, rather than leave dropped files public for good"
fi
check "it names the missing permission" grep -q '::error::.*cloudfront:GetInvalidation' "$tmp/out"
check "the static file v3 dropped is still there" has "$sample_static"
check "but the deploy is marked complete" has "$MANIFESTS/$((T0 + 62 * DAY))-d7.done"
check "and the prune ran before it failed" grep -q 'deploy-docs: 5/5' "$tmp/out"

echo "== deploy 8: v3, all well again"
run_deploy "$v3" $((T0 + 63 * DAY)) d8
check "the static file v3 dropped is deleted now" lacks "$sample_static"
check "outside docs/assets the bucket holds exactly v3" pages_are "$v3"

echo "== failures that must fail the deploy"
if DEPLOY_NOW=$T0 "$deploy" "$v2" "no-such-bucket-$$" x > "$tmp/out" 2>&1; then
  fail "a deploy to a bucket that does not exist exits 0"
else
  pass "a deploy to a bucket that does not exist fails"
fi
# Refused means refused BEFORE touching the bucket: no aws call at all. A
# check that only looked at the exit code would pass for a script that
# uploaded everything and then fell over.
refused() { # refused <description> <command...>
  local what=$1
  shift
  : > "$tmp/calls"
  if AWS_CALL_LOG=$tmp/calls "$@" > "$tmp/out" 2>&1; then
    fail "$what: exited 0"
  elif [ -s "$tmp/calls" ]; then
    fail "$what: but only after calling aws: $(sed -n 1p "$tmp/calls")"
  else
    pass "$what"
  fi
}
refused "a deploy with no CLOUDFRONT_DISTRIBUTION_ID is refused" \
  env -u CLOUDFRONT_DISTRIBUTION_ID "$deploy" "$v2" "$bucket" x
mkdir -p "$tmp/empty/docs"
refused "a build with no docs/assets is refused" "$deploy" "$tmp/empty" "$bucket" x
refused "a deploy_id that cannot name a manifest is refused" "$deploy" "$v2" "$bucket" 'bad id'

echo
if [ "$failures" -ne 0 ]; then
  echo "deploy-docs-test: $failures check(s) FAILED"
  exit 1
fi
echo "deploy-docs-test: all checks passed"
