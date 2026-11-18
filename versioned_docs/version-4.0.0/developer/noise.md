---
id: noise
title: Noise configuration
sidebar_label: Noise configuration
description: Tell Keploy which response fields and outgoing request fields may change between recording and replay, using response noise, mock noise detection and strict mock noise.
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

**Noise** is a field whose value is expected to change on every run, such as a timestamp, a request ID or a token. Keploy ignores noise when it compares results. There are two kinds:

- **Response noise:** fields in your app's response that Keploy ignores when it compares the response with the recording.
- **Mock noise:** fields in the request body of your app's outgoing calls, to databases or other services, that may differ from the recorded mock.

## Add response noise

| Where                                                                            | Applies to                               |
| -------------------------------------------------------------------------------- | ---------------------------------------- |
| **Recordings** page → open a test case → **Noise** tab → **Add noise**           | That test case, on every run             |
| **Replay** dialog → **Advanced options**                                         | That manual replay only                  |
| Record dialog → **Auto replay** step → **Advanced settings** → **Noise options** | The auto-replay rounds of that recording |

![Noise tab on a recorded test case with Add noise](/img/developer/noise-test-case.webp)

Changing a test case's noise changes test data, so it happens on a branch. If you're on main, Keploy asks you to create a branch first, and the change reaches main when you merge the branch. See [Commit, review and merge](/docs/developer/fix-failing-tests/#commit-review-and-merge).

In the replay and auto-replay dialogs, enter fields in this format:

| Field                       | Example                      |
| --------------------------- | ---------------------------- |
| Global noise: body fields   | `data.timestamp`             |
| Global noise: headers       | `Date`                       |
| Per test-set noise: body    | `test-set-1: data.sessionId` |
| Per test-set noise: headers | `test-set-1: Date`           |

Separate multiple entries with commas or new lines.

Auto-replay also learns response noise by itself. In a test case's first auto-replay round, any fields that differ are saved as noise on that test case, and the test shows as **noisy** instead of failed. After that first round, a new difference counts as a failure.

To set noise in a local `keploy.yml`, see [Advanced noise filtering](/docs/running-keploy/configuration-file/#advanced-noise-filtering).

## Mock noise detection

**Mock noise detection** is an auto-replay setting on the **Auto replay** step of the **Start Recording** dialog. It is off by default.

![Mock noise detection toggle on the Auto replay step](/img/developer/record-step-auto-replay.webp)

When it's on, each auto-replay round compares the request body of your app's outgoing calls with the recorded mocks they match. Fields whose values differ are saved as noise on that mock, so later replays accept them. Keploy still checks each field's type.

In the API and in older configurations, this setting is called `schemaNoiseDetection`. It is the same setting as `mockNoiseDetection`.

## Strict mock noise

**Strict mock noise** is a manual-replay setting in the **Run Replay** dialog. It is off by default and has no effect on auto-replay. In the API and in older configurations, it is called `schemaNoiseStrict`, which is the same setting as `mockNoiseStrict`.

![Strict mock noise toggle in the Run Replay dialog](/img/developer/replay-step-configure.webp)

- **Off:** an outgoing call matches a mock by the shape of its JSON request body. Values are compared only on mocks that already have learned noise.
- **On:** every changed value in the request body must be known noise, or Keploy rejects the mock. If no mock is left, the call isn't served and the test fails.

Use strict mode when a changed request value would be a real bug, such as a wrong amount sent to a payment service. Before you turn it on, run a few auto-replay rounds with mock noise detection on, so that Keploy has already learned the fields that are expected to change.

## Related

- [Auto-replay](/docs/developer/auto-replay/)
- [Run a manual replay](/docs/developer/manual-replay/)
- [Configuration file](/docs/running-keploy/configuration-file/): noise for the local CLI
