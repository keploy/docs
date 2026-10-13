#!/usr/bin/env bash
#
# deploy-docs.sh — publish the docs build to S3 so that no page that is live,
# cached, or open in a tab is ever left pointing at a deleted docs/assets/ file
# — the content-hashed JS and CSS a page needs to hydrate at all.
#
#   .github/scripts/deploy-docs.sh <site_dir> <bucket> <deploy_id>
#
#   site_dir   the site as the bucket serves it: docs/ at its root
#   bucket     the S3 bucket behind keploy.io/docs
#   deploy_id  names this deploy's manifest; the commit SHA being shipped
#
# Environment:
#   CLOUDFRONT_DISTRIBUTION_ID  invalidated (/docs*) once the pages are live.
#                               Required: without it the edge would serve the
#                               old pages for up to a day.
#   DOCS_ASSET_RETENTION_DAYS   how long an asset is kept once the pages that
#                               used it have been replaced (default 14)
#   DOCS_INVALIDATION_WAIT_SECONDS
#                               how long to wait for the invalidation to land
#                               before leaving dropped static files for the next
#                               deploy (default 900)
#   DEPLOY_NOW                  this deploy's time as a Unix epoch (default: now).
#                               Only deploy-docs-test.sh sets it, to replay weeks
#                               of deploys in seconds.
#   AWS credentials and region as the aws CLI reads them; the test also sets
#   AWS_ENDPOINT_URL to point it at a local S3.
#
# Keep this interface backward compatible: re-running a finished main.yml run
# replays that run's own workflow file against the script on today's main.
#
# WHY — keploy/docs, 2026-09-23. The deploy used to be a single `s3-deploy
# --deleteRemoved` pass: upload the new build, then delete everything in the
# bucket the new build did not contain. Docusaurus names every JS and CSS chunk
# by content hash, so each deploy deleted the previous build's chunks the moment
# it ran. Anything still holding the previous HTML then asked for a chunk that
# no longer existed and never hydrated: a tab left open, a cached page, or a
# second deploy running at the same time. Two merges 17 s apart (#912, #913)
# did the last of those to production — /docs/server/installation/ rendered,
# but its macOS tab and every other control on it were dead.
#
# So a deploy runs in this order:
#   1. docs/assets/ — the hashed chunks — uploaded FIRST, cached as immutable,
#      and never deleted by this pass. The new pages are not live yet, so no
#      page can reference a chunk before it exists.
#   2. This deploy's manifest, the list of assets it shipped, written BEFORE the
#      pages. Every asset a live page can reference is then on record, even if
#      step 3 fails halfway.
#   3. Everything else: static files uploaded, then text and pages synced with
#      --delete, pages last.
#   4. CloudFront invalidated, so the edge serves the new pages. Once that has
#      landed — no old page left anywhere to ask for them — static files the
#      build dropped are deleted. (Un-hashed static files keep their URL, so
#      there is no old copy to retain: a tab still open on a page whose image
#      was renamed shows it broken, as it always has.) Then the manifest is
#      marked complete.
#   5. Old assets pruned: one is deleted only once every page that used it was
#      replaced more than DOCS_ASSET_RETENTION_DAYS ago.
#
# Steps 1-4 fail the deploy on any error. Step 5 is housekeeping: a failed or
# skipped prune only leaves unused files in the bucket, so it warns and exits 0
# rather than paint a successful deploy red.

set -euo pipefail
# comm needs both inputs sorted under one collation; pin it.
export LC_ALL=C

if [ "$#" -ne 3 ]; then
  echo "usage: $0 <site_dir> <bucket> <deploy_id>" >&2
  exit 2
fi
site=${1%/}
bucket=$2
deploy_id=$3

# Docusaurus' content-hashed output, under the site's /docs base URL. Nothing
# un-hashed may live here: it is cached as immutable. (static/ has no assets/
# directory, which is what keeps it that way; deploy-docs-test.sh checks.)
ASSETS=docs/assets
# Under docs/ with everything else, so the deploy writes nowhere the old one
# did not.
MANIFESTS=docs/_deploy/asset-manifests

# A hashed name never changes content, so browsers may keep it for a year.
ASSET_CACHE="public, max-age=31536000, immutable"
# Pages, sitemaps and text keep their URL and change with every deploy:
# browsers revalidate each load (a 304 when unchanged). CloudFront keeps them a
# day, and step 4 clears it.
PAGE_CACHE="public, max-age=0, s-maxage=86400, must-revalidate"
# Images, fonts and scripts outside docs/assets also keep their URL but rarely
# change, and a page load pulls in dozens of them. An hour stale is fine;
# a revalidation round trip for each one on every load is not.
STATIC_CACHE="public, max-age=3600, s-maxage=86400"

retention_days=${DOCS_ASSET_RETENTION_DAYS:-14}
wait_seconds=${DOCS_INVALIDATION_WAIT_SECONDS:-900}
now=${DEPLOY_NOW:-$(date +%s)}
for v in "$retention_days" "$wait_seconds" "$now"; do
  case "$v" in '' | *[!0-9]*)
    echo "deploy-docs: DOCS_ASSET_RETENTION_DAYS, DOCS_INVALIDATION_WAIT_SECONDS and DEPLOY_NOW must be whole numbers (got '$v')" >&2
    exit 2
    ;;
  esac
done
if [ -z "${CLOUDFRONT_DISTRIBUTION_ID:-}" ]; then
  echo "deploy-docs: CLOUDFRONT_DISTRIBUTION_ID is required — without an invalidation the edge serves the old pages for up to a day" >&2
  exit 2
fi
case "$deploy_id" in '' | *[!A-Za-z0-9._-]*)
  echo "deploy-docs: deploy_id must be [A-Za-z0-9._-]+ (got '$deploy_id')" >&2
  exit 2
  ;;
esac
if [ ! -d "$site/$ASSETS" ]; then
  echo "deploy-docs: $site/$ASSETS does not exist — is $site a docs build with docs/ at its root?" >&2
  exit 2
fi

# Checked up front: jq is only needed by the prune, which runs after the pages
# are live, and finding it missing there would be too late to stop anything.
for tool in aws jq; do
  command -v "$tool" > /dev/null || {
    echo "deploy-docs: $tool is required" >&2
    exit 2
  }
done

tmp=$(mktemp -d)
trap 'rm -rf "$tmp"' EXIT

(cd "$site" && find "$ASSETS" -type f) | sort > "$tmp/shipped"
if [ ! -s "$tmp/shipped" ]; then
  echo "deploy-docs: $site/$ASSETS is empty — refusing to deploy a build with no assets" >&2
  exit 2
fi
manifest="$MANIFESTS/$now-$deploy_id.txt"
done_marker="$MANIFESTS/$now-$deploy_id.done"

echo "deploy-docs: 1/5 uploading $(wc -l < "$tmp/shipped" | tr -d ' ') assets to $ASSETS/ (nothing deleted)"
aws s3 sync "$site/$ASSETS" "s3://$bucket/$ASSETS" \
  --cache-control "$ASSET_CACHE" --no-progress --only-show-errors

echo "deploy-docs: 2/5 recording them in $manifest"
aws s3 cp "$tmp/shipped" "s3://$bucket/$manifest" \
  --content-type text/plain --cache-control no-store --only-show-errors

# sync_class <cache-control> <content-type, or '' to let the CLI guess> [--delete] <filters...>
#
# One class of file outside docs/assets. --delete removes what the build no
# longer has, but only among the files the filters select, so the four classes
# below must partition the site between them — each file in exactly one.
sync_class() {
  local args=(--cache-control "$1")
  if [ -n "$2" ]; then
    args+=(--content-type "$2")
  fi
  shift 2
  # The class filters come first: a later filter wins, so the two excludes
  # after them hold whatever the class includes.
  aws s3 sync "$site" "s3://$bucket" "$@" \
    --exclude "$ASSETS/*" --exclude "$MANIFESTS/*" \
    "${args[@]}" --no-progress --only-show-errors
}

STATIC=(--exclude '*.html' --exclude '*.xml' --exclude '*.json' --exclude '*.txt' --exclude '*.md')
echo "deploy-docs: 3/5 uploading static files, then syncing text and pages"
sync_class "$STATIC_CACHE" '' "${STATIC[@]}"
# The CLI labels these text/plain and text/markdown with no charset, and a
# client with no charset decodes text/* as Latin-1 (Python's requests does).
# llms.txt, llms-full.txt and the .md copies of every page exist for exactly
# those readers, and nearly all of them hold non-ASCII.
sync_class "$PAGE_CACHE" 'text/plain; charset=utf-8' --delete --exclude '*' --include '*.txt'
sync_class "$PAGE_CACHE" 'text/markdown; charset=utf-8' --delete --exclude '*' --include '*.md'
# Pages last, so every file a page links to is already there when it goes live.
sync_class "$PAGE_CACHE" '' --delete --exclude '*' --include '*.html' --include '*.xml' --include '*.json'

# invalidation_landed <id>: 0 once CloudFront reports it complete, 1 if it has
# not within wait_seconds, 2 if CloudFront would not say. Polled rather than
# `aws cloudfront wait`, which cannot tell those last two apart. The status is
# matched case-insensitively: CloudFront says "Completed".
invalidation_landed() {
  local status step waited=0
  while :; do
    status=$(aws cloudfront get-invalidation --distribution-id "$CLOUDFRONT_DISTRIBUTION_ID" \
      --id "$1" --query 'Invalidation.Status' --output text) || return 2
    if [ "$(printf '%s' "$status" | tr '[:upper:]' '[:lower:]')" = completed ]; then
      return 0
    fi
    if [ "$waited" -ge "$wait_seconds" ]; then
      return 1
    fi
    step=$((wait_seconds - waited < 10 ? wait_seconds - waited : 10))
    sleep "$step"
    waited=$((waited + step))
  done
}

echo "deploy-docs: 4/5 invalidating /docs* on CloudFront"
invalidation=$(aws cloudfront create-invalidation --distribution-id "$CLOUDFRONT_DISTRIBUTION_ID" \
  --paths '/docs*' --query 'Invalidation.Id' --output text)
# A slow invalidation only defers the deletions to the next deploy. One whose
# status cannot be read would defer them on EVERY deploy — a file removed from
# static/, a retracted PDF say, would stay public for good behind a green
# check — so that fails the run, once the rest of the deploy is done.
landed=0
invalidation_landed "$invalidation" || landed=$?
static_error=
case "$landed" in
  0)
    echo "deploy-docs: invalidation $invalidation landed; deleting static files the build dropped"
    sync_class "$STATIC_CACHE" '' --delete "${STATIC[@]}"
    ;;
  1)
    echo "::warning::deploy-docs: invalidation $invalidation had not landed after ${wait_seconds}s; static files this build dropped are left for the next deploy to delete"
    ;;
  *)
    static_error="could not read the status of invalidation $invalidation (the aws error above says why; AccessDenied means the deploy user needs cloudfront:GetInvalidation), so static files this build dropped were NOT deleted. The pages are live."
    echo "::error::deploy-docs: $static_error"
    ;;
esac
# Every page of this deploy is live. Only a deploy that got this far may stand
# as the prune's boundary (see prune): one that failed in step 3 left the pages
# it did not reach at the deploy before it.
aws s3 cp - "s3://$bucket/$done_marker" --content-type text/plain \
  --cache-control no-store --only-show-errors < /dev/null

# Keys under a prefix, one per line. JSON rather than text output because the
# CLI merges every page before applying --query only for JSON; text applies it
# page by page. A key holding a space survives too.
list_keys() {
  aws s3api list-objects-v2 --bucket "$bucket" --prefix "$1" \
    --query 'Contents[].Key' --output json > "$tmp/list.json" &&
    jq -r '.[]?' "$tmp/list.json"
}

skip_prune() {
  echo "::warning::deploy-docs: prune skipped, nothing deleted — $*"
}

# Which assets may still be referenced. The boundary is the newest COMPLETED
# deploy from before the window. Its pages were all live until something
# replaced them, which happened inside the window, so a tab opened on them may
# still be open: its assets stay, and so do those of every deploy after it,
# complete or not — a deploy that failed halfway left some of its pages live.
# Everything before the boundary was wholly replaced by it before the window
# began (give or take the minutes the boundary deploy itself took, against a
# window of days).
prune() {
  local cutoff=$((now - retention_days * 86400))

  if ! list_keys "$MANIFESTS/" > "$tmp/listing"; then
    skip_prune "could not list $MANIFESTS/"
    return 0
  fi
  if ! grep -qxF "$done_marker" "$tmp/listing"; then
    skip_prune "the listing of $MANIFESTS/ is missing $done_marker, written moments ago, so it cannot be trusted"
    return 0
  fi

  # manifests: "<epoch> <key>" per manifest; done: the names of the markers;
  # entries: "<epoch> <key>" for both.
  local key name epoch boundary=-1
  : > "$tmp/manifests"
  : > "$tmp/done"
  : > "$tmp/entries"
  while IFS= read -r key; do
    name=${key#"$MANIFESTS/"}
    epoch=${name%%-*}
    case "$epoch" in '' | *[!0-9]*) epoch=x ;; esac
    [ "$epoch" = x ] || echo "$epoch $key" >> "$tmp/entries"
    case "$epoch:$name" in
      x:*) ;;
      *.txt)
        echo "$epoch $key" >> "$tmp/manifests"
        continue
        ;;
      *.done)
        echo "$name" >> "$tmp/done"
        continue
        ;;
    esac
    skip_prune "$key is not something this script wrote (<epoch>-<id>.txt or .done); the retained set would be a guess"
    return 0
  done < "$tmp/listing"

  while read -r epoch key; do
    name=${key#"$MANIFESTS/"}
    if [ "$epoch" -lt "$cutoff" ] && [ "$epoch" -gt "$boundary" ] &&
      grep -qxF "${name%.txt}.done" "$tmp/done"; then
      boundary=$epoch
    fi
  done < "$tmp/manifests"

  if [ "$boundary" -lt 0 ]; then
    echo "deploy-docs: 5/5 no completed deploy older than $retention_days days yet; nothing to prune"
    return 0
  fi

  : > "$tmp/keep.unsorted"
  while read -r epoch key; do
    [ "$epoch" -ge "$boundary" ] || continue
    if ! aws s3 cp "s3://$bucket/$key" - --only-show-errors >> "$tmp/keep.unsorted"; then
      skip_prune "could not read $key"
      return 0
    fi
  done < "$tmp/manifests"
  sort -u "$tmp/keep.unsorted" > "$tmp/keep"

  if ! list_keys "$ASSETS/" | sort -u > "$tmp/live"; then
    skip_prune "could not list $ASSETS/"
    return 0
  fi
  # Everything step 1 uploaded must be in the listing. If it is not, the
  # listing is short — truncated, or in a format jq did not read — and every
  # asset missing from it would look unused.
  comm -23 "$tmp/shipped" "$tmp/live" > "$tmp/unlisted"
  if [ -s "$tmp/unlisted" ]; then
    skip_prune "the listing of $ASSETS/ is missing assets this deploy uploaded, so it cannot be trusted"
    return 0
  fi

  comm -23 "$tmp/live" "$tmp/keep" > "$tmp/stale"
  local stale_count deleted=0
  stale_count=$(wc -l < "$tmp/stale" | tr -d ' ')
  echo "deploy-docs: 5/5 $(wc -l < "$tmp/live" | tr -d ' ') assets in the bucket, $(wc -l < "$tmp/keep" | tr -d ' ') shipped within $retention_days days; deleting $stale_count"

  # delete-objects takes at most 1000 keys a call.
  split -l 1000 "$tmp/stale" "$tmp/batch."
  local batch errors
  for batch in "$tmp"/batch.*; do
    [ -s "$batch" ] || continue
    jq -R -s '{Objects: (split("\n") | map(select(length > 0) | {Key: .})), Quiet: true}' "$batch" > "$tmp/delete.json"
    if ! aws s3api delete-objects --bucket "$bucket" --delete "file://$tmp/delete.json" --output json > "$tmp/deleted.json"; then
      skip_prune "delete-objects failed after $deleted of $stale_count deletions"
      return 0
    fi
    # In quiet mode S3 lists only the keys that failed, and when none did the
    # CLI prints nothing at all; -s reads that as [] rather than an error.
    errors=$(jq -s '(.[0].Errors // []) | length' "$tmp/deleted.json")
    if [ "$errors" -ne 0 ]; then
      echo "::warning::deploy-docs: $errors asset(s) could not be deleted and were left in place:"
      jq -r '.Errors[] | "  \(.Key): \(.Code) \(.Message)"' "$tmp/deleted.json"
    fi
    deleted=$((deleted + $(wc -l < "$batch") - errors))
  done

  # Manifests and markers from before the boundary no longer decide anything.
  # Walked from the listing, not from the manifests, so a marker whose manifest
  # went on an earlier run is removed too.
  while read -r epoch key; do
    [ "$epoch" -lt "$boundary" ] || continue
    aws s3 rm "s3://$bucket/$key" --only-show-errors ||
      echo "::warning::deploy-docs: could not remove $key; the next deploy will retry"
  done < "$tmp/entries"

  echo "deploy-docs: deleted $deleted unused asset(s)"
}

prune

if [ -n "$static_error" ]; then
  echo "deploy-docs: failing the run: $static_error" >&2
  exit 1
fi
