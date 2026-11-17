---
id: noise
title: Noise configuration
sidebar_label: Noise configuration
description: Tell Keploy which response fields and mock request fields may change between recording and replay, with response noise, mock noise detection and strict mock noise.
tags:
  - K8s
  - developer
  - noise
keywords:
  - keploy noise
  - mock noise detection
  - schema noise detection
  - strict mock noise
  - global noise
  - noisy fields
---

import ProductTier from '@site/src/components/ProductTier';

<ProductTier tiers="Enterprise" offerings="Self-Hosted, Dedicated" />

**Noise** is a field Keploy should ignore because its value changes on every run, such as a timestamp, a request ID or a token. Keploy works with two kinds:

- **Response noise:** fields in your app's response that the test comparison ignores.
- **Mock noise:** fields in the request body of your app's outgoing calls (to databases or other services) that may differ from the recorded mock.

## Add response noise

| Where                                                                            | Applies to                            |
| -------------------------------------------------------------------------------- | ------------------------------------- |
| **Recordings** page → open a test case → **Noise** tab → **Add noise**           | That test case, on every run.         |
| **Replay** dialog → **Advanced options**                                         | That manual replay only.              |
| Record dialog → **Auto replay** step → **Advanced settings** → **Noise options** | Auto-replay rounds of that recording. |

Editing a test case's noise is a change to test data, so it happens on a branch. If you're on main, Keploy asks you to create a branch first, and the change reaches main when you merge it. See [Fix failing tests](/docs/developer/fix-failing-tests/#commit-review-and-merge).

In the replay and auto-replay dialogs, enter fields like this:

| Field                       | Example                      |
| --------------------------- | ---------------------------- |
| Global noise: body fields   | `data.timestamp`             |
| Global noise: headers       | `Date`                       |
| Per test-set noise: body    | `test-set-1: data.sessionId` |
| Per test-set noise: headers | `test-set-1: Date`           |

Separate several entries with commas or new lines.

Auto-replay also learns response noise on its own. On a test case's first auto-replay round, fields that differ are saved as noise on that test case, and the test shows as **noisy** instead of failed. After that first round, a new difference is reported as a failure.

For noise in a local `keploy.yml`, see [Advanced noise filtering](/docs/running-keploy/configuration-file/#advanced-noise-filtering).

## Mock noise detection

**Mock noise detection** is an auto-replay setting on the **Auto replay** step of the record dialog. It is off by default.

When it's on, each auto-replay round compares the request body of your app's outgoing calls with the recorded mock they match. Fields whose values differ are saved as noise on that mock, so later replays accept them. Keploy still checks each field's type.

In the API and older configs, this setting is also called `schemaNoiseDetection`. It is the same setting as `mockNoiseDetection`.

## Strict mock noise

**Strict mock noise** is a manual-replay setting in the **Replay** dialog. It is off by default and has no effect on auto-replay. In the API and older configs it is also called `schemaNoiseStrict`, the same setting as `mockNoiseStrict`.

- **Off:** an outgoing call matches a mock by the shape of its JSON request body. Values are compared only on mocks that already have learned noise.
- **On:** every changed request-body value must already be known noise, or the mock is rejected. If no mock is left, the call goes unserved and the test fails.

Use strict mode when a changed request value would be a real bug, such as a wrong amount sent to a payment service. Turn on mock noise detection for a few auto-replay rounds first, so the fields that are expected to change are already learned.

## Related

- [Auto-replay](/docs/developer/auto-replay/)
- [Run a manual replay](/docs/developer/manual-replay/)
- [Configuration file](/docs/running-keploy/configuration-file/): noise for the local CLI
