---
id: refusals
title: Verbs UI Capture refuses
sidebar_label: UI Capture refused verbs
description: The verbs Keploy UI Capture refuses by design with KUI_E_REFUSED_BY_DESIGN (exit code 13), why each one is refused, and what to do instead.
tags:
  - UI capture
  - errors
  - troubleshooting
keywords:
  - UI capture
  - KUI_E_REFUSED_BY_DESIGN
  - exit code 13
  - retry
  - quarantine
  - update snapshots
---

Some verbs that other UI testing tools have would let a broken thing report success. Keploy UI Capture does not have them, by design. When you, a script or an AI agent ask for one, under its name or any of its other spellings, the tool refuses with [`KUI_E_REFUSED_BY_DESIGN`](errors.md#kui-e-refused-by-design) and does nothing else.

**Exit code:** `13` (refused-by-policy). Nothing ran, and nothing was measured. This is a refusal, not a missing feature.

The error's evidence says which verb you asked for:

- `verb`: the verb, by the name used on this page.
- `requestedAs`: the spelling you used.
- `reason`: what the verb would have hidden.

`remedy.docs` links to this page. Each verb's section below says why it is refused and what to do instead. No command of the keploy binary does the alternative for you: each one is a decision a person, or an agent on a person's behalf, makes on purpose.

| Verb                                    | Also refused as                                                                                           |
| --------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| [`retry`](#retry)                       | `retries`, `retry-failed`, `rerun`, `rerun-failed`, `attempt-again`, `max-retries`                        |
| [`heal`](#heal)                         | `auto-heal`, `self-heal`, `heal-selectors`, `fix-selectors`                                               |
| [`update-snapshots`](#update-snapshots) | `update-snapshot`, `u`, `accept-baseline`, `accept-all`, `bless`, `approve-diff`                          |
| [`set-tolerance`](#set-tolerance)       | `tolerance`, `threshold`, `set-threshold`, `max-diff`, `allowed-diff`, `fuzz`, `fuzzy-match`              |
| [`quarantine`](#quarantine)             | `mute`, `skip-flaky`, `ignore-failure`, `allow-failure`, `known-failure`, `expected-failure`, `soft-fail` |

## `retry` {#retry}

**Exit code:** `13` (refused-by-policy).

**What happened:** You asked to run a failed flow again until it passes.

**Cause:** A retry turns a reproducible failure green, and destroys the evidence that the run did not reproduce. The difference between two runs is the finding; averaging over it deletes the finding.

**Fix:** Run the flow several times against an unchanged build, and compare the runs to each other. The divergence between them is the finding: a retry that goes green has deleted it, not resolved it.

## `heal` {#heal}

**Exit code:** `13` (refused-by-policy).

**What happened:** You asked the run to find another element when a recorded selector stops matching.

**Cause:** A selector fallback at run time binds a different element from the one the flow recorded, so a removed or renamed control reports as a pass.

**Fix:** Look at which recorded selector stopped matching, and at what is on the page now. The lower-confidence candidates are recorded as evidence and shown when a flow fails. They are never used in its place at run time, because a fallback that binds a different element turns a real regression into a green check.

## `update-snapshots` {#update-snapshots}

**Exit code:** `13` (refused-by-policy).

**What happened:** You asked to accept every pending difference as the new baseline at once.

**Cause:** A bulk accept blesses every difference at once, unreviewed, which makes the regression you did not look at the new definition of correct.

**Fix:** Walk the pending differences one at a time, so each acceptance is a separate, reviewed decision. Capture again only the ones you have looked at, each with a stated reason.

## `set-tolerance` {#set-tolerance}

**Exit code:** `13` (refused-by-policy).

**What happened:** You asked to let a comparison pass within a tolerance or a threshold.

**Cause:** Every tolerance band has a false-pass region: a real regression smaller than the band cannot be told from a pass, and nobody measures how big that region is.

**Fix:** Measure this environment's noise floor first, and state it with the verdict, so the sensitivity of the run is a measured number, not an assumed one.

## `quarantine` {#quarantine}

**Exit code:** `13` (refused-by-policy).

**What happened:** You asked to mute a failing flow, or to let it fail without failing the run.

**Cause:** Quarantine exists for one purpose: to let a suite report green while something is known to be broken.

**Fix:** Name exactly which flows you were about to silence, and decide each one. Taking a flow out of scope makes its verdict `uncovered`, not `passed`, so the run never claims to have checked something it did not.
