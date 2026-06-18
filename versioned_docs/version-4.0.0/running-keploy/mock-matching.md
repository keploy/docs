---
id: mock-matching
title: How Keploy Matches Mocks per Protocol
sidebar_label: Mock Matching Reference
description: Reference for what Keploy compares when matching outgoing calls to recorded Mocks, per protocol, and how to control noise and fuzzy matching.
tags:
  - mocks
  - mock matching
  - noise
  - fuzzy matching
  - deterministic replay
keywords:
  - mock matching
  - noise
  - fuzzy match
  - mock mismatch
  - deterministic replay
  - req_body_noise
---

During replay, Keploy intercepts every outgoing call your application makes and answers it from the recorded Mocks instead of the real dependency. This page is the reference for **what is compared per protocol**, what happens when nothing matches (a _mock miss_), and which knobs control the behavior.

> Keploy has two separate matching layers. **Test assertions** compare your API's recorded response with the live response and decide pass/fail — configured with `globalNoise` (see [Configuration file](configuration-file.md)). **Mock matching** (this page) selects which recorded Mock answers each outgoing call. The two layers share one noise vocabulary: a field path such as `body.user.created_at` or `header.date` means the same thing in both.

## What each protocol checks

| Protocol                    | Matched on                                                                                                                                                                                                | Ignored by default                                                                                                                                                             | On a mock miss, your app sees                                                                      |
| --------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------- |
| **HTTP**                    | URL path, method, content type, header **keys**, query parameter **keys**, request body (exact, then JSON field structure, then fuzzy)                                                                    | ~60 known volatile headers (`Authorization`, `X-Amz-Date`, `Traceparent`, `X-Request-Id`, webhook signatures, and similar), header **values**, learned `req_body_noise` fields | A synthetic `502 Bad Gateway` with the body `keploy: no matching mock found for this HTTP request` |
| **gRPC**                    | Method, metadata keys, decoded message structure and content                                                                                                                                              | Volatile metadata, compression details                                                                                                                                         | A `NotFound` gRPC status                                                                           |
| **MySQL**                   | Handshake (character set, max packet size), then query text — exact first, then query _structure_ (literals and bind parameters normalized), with recorded-order fallbacks for repeated identical queries | Bind parameter values when the query structure is unambiguous; fresh generated values (for example a UUID written then read back) resolve by recorded order                    | A closed connection (drivers report a communication error such as SQLSTATE 08S01)                  |
| **PostgreSQL**              | Wire message shape and query fingerprint; bind values act as a tiebreaker; repeated identical statements resolve in recorded order                                                                        | Volatile bind positions (for example freshly generated UUIDs) inferred automatically                                                                                           | An in-protocol error response (`KP001`) naming the unmatched query                                 |
| **MongoDB**                 | Command name, collection, and message structure; values are compared by type, not content                                                                                                                 | Timestamps, ObjectIDs, cursor ids, and session identifiers cannot break a match                                                                                                | The connection closes and the driver reconnects; misses are logged but do not interrupt the driver |
| **DNS**                     | Query name and type                                                                                                                                                                                       | —                                                                                                                                                                              | A DNS failure for the query                                                                        |
| **Generic (any other TCP)** | Raw bytes — exact first, then similarity (Jaccard) with thresholds 0.9 (per-test Mocks) and 0.4 (session Mocks)                                                                                           | Byte ranges covered by the Mock's `noise:` regular expressions                                                                                                                 | The connection closes with no bytes                                                                |

A few practical consequences of this table:

- **HTTP header and query values are not matched** — only their key sets. If a dependency call fails to match, the cause is the path, the method, the key sets, or the body.
- **You usually don't need noise for database traffic.** The MySQL, PostgreSQL, and MongoDB matchers absorb drifting values (timestamps, generated ids) through structure-aware matching and recorded-order fallbacks. Noise configuration matters most for HTTP request bodies and for response assertions.
- **Protocol coverage depends on the binary.** The official release binaries and the Enterprise agent include all protocol matchers listed above. A Keploy binary you build from the open-source repository yourself handles HTTP, MySQL, DNS, and everything else through the Generic byte matcher.

## The noise vocabulary

One grammar describes an ignorable field everywhere:

- `body.<dotted.json.path>` — a JSON field, for example `body.data.created_at`
- `header.<name>` — a header, for example `header.date`

Three places accept it:

1. **`globalNoise` in `keploy.yml`** — applies to response assertions, and (for the `body` bucket) to HTTP request-body matching during replay, so a field you declared noisy can never cause a mock miss either.
2. **`spec.assertions.noise` in a Test-Case YAML file** — per-test noise, written automatically at record time for timestamp-like fields.
3. **`req_body_noise` on an HTTP Mock** — request-body fields that Keploy _learned_ drift between recording and replay (see the next section).

When a mock miss is reported, the field paths in the report use this same grammar — you can copy a path from the report straight into `globalNoise`.

## Learned request-body noise

Run replay with `--schema-noise-detection` and Keploy diffs each matched HTTP Mock's recorded request body against the live one, recording drifting field paths as `req_body_noise` on that Mock. The learned noise persists onto `mocks.yaml` automatically.

`--schema-noise-strict` (or `schemaNoiseStrict` in `keploy.yml`) turns the learned noise into an enforcement contract: a Mock that carries `req_body_noise` only matches when every request-body field outside the learned (and user-configured) noise is identical. A drift on an unmarked field fails the test instead of being served silently. The Keploy Kubernetes agent enables this automatically on its replay path.

## Fuzzy matching and deterministic replay

When the exact and structural checks leave more than one candidate — or none — some protocols fall back to **similarity matching**: Levenshtein/Jaccard for HTTP, Jaccard for Generic, and partial-shape scoring for MySQL. A similarity pick is a guess, and a wrong guess surfaces as a confusing downstream test failure.

The `fuzzyMatch` setting (`keploy.yml`) or `--fuzzy-match` flag controls this:

| Value            | Behavior                                                                                                                                                                                                                                                      |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `warn` (default) | Similarity fallbacks run as before, but every fuzzy-served Mock logs a visible warning with the Mock name, match type, and score. Use these warnings to audit whether your suite depends on fuzzy matching.                                                   |
| `on`             | Legacy behavior — similarity fallbacks run silently.                                                                                                                                                                                                          |
| `off`            | **Deterministic replay.** No similarity guessing. Byte-equal matches still serve; several equally valid candidates resolve in recorded order; anything else becomes a structured mock miss that names the closest candidate and the exact fields that differ. |

`off` is the right setting once your suite is stable: every served Mock is then either an exact match, a structural match, or a recorded-order pick — reproducible run to run.

## Debugging a mock miss

When an outgoing call has no matching Mock, Keploy reports it in four places:

1. **A warning log at the moment of the miss**, naming the call, how far matching got (`no_schema_candidates`, `body_mismatch`, `strict_noise_reject`, `no_match`, or `fuzzy_match_disabled`), the closest recorded Mock, and the per-field differences.
2. **The `MOCKS MISMATCH SUMMARY` table** at the end of the run — printed whenever any test had mock differences, including runs that passed.
3. **The Test-Run report YAML file** — each failed test carries `failure_info.unmatched_calls` with the same structured data (protocol, closest Mock, match phase, field diffs).
4. **`keploy report`** — failed tests render their unmatched outgoing calls _above_ the response diff, because the response diff is usually a downstream symptom of the miss.

Reading a miss report:

- Field diffs of kind `value_changed` on dynamic-looking fields (ids, timestamps, tokens) → add the reported path to `globalNoise`, or run with `--schema-noise-detection` to learn it.
- Diffs of kind `missing_in_mock` / `missing_in_live` (fields added or removed) → the request structure changed since recording; re-record the Test-Set with `keploy record`.
- `Missing mocks:` rows in the summary table → `mappings.yaml` references Mocks that no longer exist in the Mock file (pruned, deduplicated, or edited away); re-record, or refresh the mapping with `--update-test-mapping`.
