---
id: cli
title: "UI Testing CLI reference: keploy ui, keploy login, and keploy mcp-install"
sidebar_label: CLI
description: Reference for keploy ui replay and local capture commands (v3.9.24+), signing in with keploy login, and connecting an AI agent with keploy mcp-install.
tags:
  - UI testing
  - UI capture
  - CLI
  - reference
keywords:
  - keploy ui
  - keploy ui run
  - keploy ui explore
  - keploy ui record
  - keploy ui export-steps
  - keploy ui status
  - keploy ui explain
  - keploy login
  - keploy mcp-install
  - Keploy CLI
  - AI agent
  - MCP
  - UI capture
  - origin-map
  - strict-origins
---

import ProductTier from '@site/src/components/ProductTier';

<ProductTier tiers="Free, Teams, Scale, Enterprise" offerings="Self-Hosted, Dedicated" />

The `keploy` CLI handles three parts of UI Testing:

1. **Signing in** from a terminal or an AI agent's shell (`keploy login`).
2. **Connecting an AI agent** to the Keploy MCP server (`keploy mcp-install`).
3. **Replaying and capturing UI journeys** locally or in CI (`keploy ui`, shipped in `keploy` CLI `v3.9.24+`).

To install the CLI, see [Install Keploy](../server/installation.md).

## Sign in from a terminal or an agent {#keploy-login}

```bash
keploy login
```

`keploy login` signs you in through your browser and waits until you approve the sign-in. With an API key in `KEPLOY_API_KEY`, or a session it saved before, it uses that instead.

An AI agent's shell shows a command's output only when the command exits, so an agent signs in in two steps:

```bash
keploy login --no-wait --json
# a person opens the link and approves the code
keploy login --finish --json
```

1. `keploy login --no-wait` prints the sign-in link and code and exits without waiting. The agent shows them to you.
2. You open the link and approve the code.
3. `keploy login --finish` collects the session. It waits up to 70 seconds for the approval, and can be run again until the code expires.

| Flag             | What it does                                                                                                                          |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `--no-wait`      | Print the sign-in link and code and exit instead of waiting.                                                                          |
| `--finish`       | Collect the session for the sign-in started by `--no-wait`.                                                                           |
| `--new`          | With `--no-wait`: discard the sign-in waiting here and start a new one. Without it, `--no-wait` shows the waiting code or link again. |
| `--json`         | With `--no-wait` or `--finish`: print the answer as one JSON document on stdout, for AI agents and tools. Logs go to stderr.          |
| `--api-key`      | A Keploy API key for this invocation, in place of the `KEPLOY_API_KEY` environment variable.                                          |
| `--show`         | Print the API key a login uses here (its last 4 characters only) and where it comes from, then exit without signing in.               |
| `--manual-login` | Ask for an API key to paste instead of opening the browser.                                                                           |

When an API key is set, in `KEPLOY_API_KEY` or with `--api-key`, and the server accepts it, `keploy login --no-wait` answers that you are signed in and starts no sign-in.

## Connect your agent {#keploy-mcp-install}

```bash
keploy mcp-install --editor claude-code
```

`keploy mcp-install` uses the session `keploy login` saved: sign in first. It mints a personal access token for the Keploy MCP server and writes the server, `https://api.keploy.io/client/v1/mcp` with that token, into your agent's MCP configuration as `keploy`. The UI capture tools are then available to the agent: see [MCP tools](./mcp-tools.md).

| Flag               | What it does                                                                                                                                                                                                                                |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--editor <name>`  | The agent to configure: `claude-code`, `cursor`, `windsurf`, `claude-desktop`, `codex`, `antigravity` or `github-copilot`. For `github-copilot`, which has no configuration file on disk, it prints a block to paste. Pass this or `--all`. |
| `--all`            | Configure every MCP-aware agent found on this machine. GitHub Copilot is not detected: configure it with `--editor github-copilot`.                                                                                                         |
| `--scope <scope>`  | `global` (the default) configures the agent for every project on this machine. `project` configures it for the current directory, for Claude Code, Cursor and Codex; for Cursor and Codex that writes the token into a file in your repo.   |
| `--api-server-url` | The Keploy API server to connect to. The default is `https://api.keploy.io`. Pass your own server's URL when you self-host.                                                                                                                 |
| `--rotate`         | Mint a new token and revoke the current one. Every agent configured with the old token must then be configured again.                                                                                                                       |
| `--show-token`     | Print the real token inside the copy-paste blocks. Off by default, because those blocks end up in terminal scrollback and CI logs.                                                                                                          |

The token is minted once and reused: `mcp-install` keeps it in `~/.keploy/mcp.yaml`, so configuring one more agent leaves the others working. It expires after 90 days. When your agents start getting `401`, run `keploy mcp-install --rotate`: without `--rotate`, `mcp-install` hands out the cached token again. Minting a new one, with `--rotate`, on another machine or by signing in to the Keploy VS Code extension, which mints its token the same way, revokes the ones minted before, and agents still holding them lose access.

The token carries the scopes your role in the company allows. Effective access is still what your role holds on each app: setting up capture needs `testgen:run` on the app, and reading flows needs `app:view`.

## In CI {#in-ci}

No person can approve a sign-in code in CI. To sign the `keploy` binary in there, set `KEPLOY_API_KEY` to a scoped service-account key created with [`keploy service-account key create`](../running-keploy/cli-commands.md#service-account) (`--role UI_RUNNER` for `keploy ui run`, or `--role UI_READER` for read-only REST/API checks).

In CI you can replay production-recorded journeys against a local, preview, or staging build with [`keploy ui run`](#keploy-ui-run), replay committed local bundles offline with `--bundle`, or check capture status through the [REST API](./rest-api.md). See [Capture and replay in CI](./ci.md).

## `keploy ui` commands {#keploy-ui}

The `keploy ui` command group ships in the `keploy` CLI (`v3.9.24+`, installed by `https://keploy.io/install.sh`) on **Linux and macOS** (`keploy ui` is not available on Windows). Every `keploy ui` command writes one compact JSON line to stdout (for scripts and AI agents) and human-readable status or engine diagnostics to stderr.

Commands that drive the embedded Playwright replay engine (`run`, `explore`, and `record`) require:

- **Node.js `20.19+` or `22.12+`** (override the binary path with `--node`).
- **Your repository's own `@playwright/test`** installed in `--repo` (defaults to the current working directory), along with Chromium (`npx playwright install chromium`).

### Replay journeys with `keploy ui run` {#keploy-ui-run}

`keploy ui run` replays an app's journey plan from Keploy Cloud (or local bundles from `--bundle`) against a frontend build served at `--base-url`. Every recorded network call is answered from the capture, so no live backend or database is required.

```bash
# Replay an app's journey plan from Keploy Cloud
keploy ui run --app <app-id> --base-url http://localhost:3000

# Replay a local bundle file or directory of *.json bundles offline (no cloud auth)
keploy ui run --bundle .keploy/ui-journeys --base-url http://localhost:3000
```

By default, generated Playwright tests are written to `<repo>/.keploy-ui-tests` and results (`verdict-document.json`, `visual-diff.json`, and Playwright's report) are written to `<repo>/.keploy-ui-results`. Both directories carry their own `.gitignore`. When passing a custom `--suite`, it must be a subdirectory inside `--repo` (not `--repo` itself) so Node resolves the repository's `@playwright/test` without overwriting your `playwright.config.ts`.

| Flag                             | Default                     | What it does                                                                                                                                   |
| -------------------------------- | --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `--app <id>`                     | —                           | Keploy app ID whose journey plan is replayed (required unless `--bundle` is set).                                                              |
| `--plan <id>`                    | Active plan                 | Journey plan ID to replay. Cannot be combined with `--bundle`.                                                                                 |
| `--bundle <path>`                | —                           | Local recorded bundle JSON file or directory of `*.json` bundles to replay offline without Keploy Cloud authentication.                        |
| `--base-url <url>`               | —                           | URL where the frontend build under test is served, e.g. `http://localhost:3000` (required).                                                    |
| `--repo <dir>`                   | `.`                         | Path to the app repository whose `@playwright/test` runs the tests.                                                                            |
| `--suite <dir>`                  | `<repo>/.keploy-ui-tests`   | Directory inside `--repo` where generated tests are written.                                                                                   |
| `--out <dir>`                    | `<repo>/.keploy-ui-results` | Output directory for `verdict-document.json`, completion data, `visual-diff.json`, and Playwright's report.                                    |
| `--launcher <json>`              | Repository default          | JSON array of words specifying how to launch Playwright (for example `["npx","playwright"]`).                                                  |
| `--timeout <duration>`           | Per-test bound              | Maximum duration for Playwright's run (whole milliseconds, e.g. `120s`).                                                                       |
| `--app-wait <duration>`          | `30s`                       | How long to wait for `--base-url` to respond before failing (whole milliseconds).                                                              |
| `--ignore-https-errors`          | `false`                     | Allow Chromium to load an app with an unverified TLS certificate (useful for local HTTPS or staging servers).                                  |
| `--journey <id>`                 | —                           | Repeatable. Replay only the named journey ID(s) locally without creating or uploading a cloud test run.                                        |
| `--storage-state <path>`         | Auto-discovered             | Path to a Playwright `storageState` JSON file (`cookies` and `origins`, max 10 MiB) applied to every browser context.                          |
| `--device <preset>`              | —                           | Mobile or tablet device preset for viewport, touch, scale factor, and user-agent emulation.                                                    |
| `--origin-map <live>=<recorded>` | —                           | Repeatable (max 32, one-to-one). Explicit cross-origin API mapping from `<live-origin>` to `<recorded-origin>`.                                |
| `--strict-origins`               | `false`                     | Disable automatic 1-to-1 cross-origin API aliasing and require exact or `--origin-map` origin matches.                                         |
| `--screenshots`                  | `false`                     | Capture deterministic end-state viewport screenshots for each journey.                                                                         |
| `--step-screenshots`             | `false`                     | Capture per-step screenshots (`<journeyId>-step-N.png`) in addition to end-state screenshots (implies `--screenshots`).                        |
| `--baseline-screenshots <dir>`   | —                           | Directory of baseline `<journeyId>.png` screenshots to pixel-diff against (implies `--screenshots`).                                           |
| `--visual-mask <selector>`       | —                           | Repeatable (max 32, up to 256 chars each). CSS selector to mask dynamic regions during visual diffing.                                         |
| `--runner <name>`                | `keploy-cli@<hostname>`     | Runner identity used to claim the cloud test run.                                                                                              |
| `--node <path>`                  | `node`                      | Node.js binary used by the embedded engine (Node `20.19+` or `22.12+`).                                                                        |
| `--config-path`, `-c <dir>`      | `.`                         | Local directory for `keploy.yml` (redirected to a temporary directory when left at default so `run` never writes `keploy.yml` into your repo). |
| `--json`                         | `false`                     | Accepted for compatibility; `keploy ui` always emits one JSON line on stdout.                                                                  |

#### Map cross-origin APIs for staging and preview environments {#cross-origin-api-replay}

Production recordings often target a production API host such as `https://api.example.com`, while a PR preview, staging, or local build calls a different backend host such as `https://api.staging.example.com`.

- **Automatic 1-to-1 cross-origin API aliasing:** By default, Keploy binds each live API origin independently and one-to-one to its matching recorded API origin, synthesizes CORS `OPTIONS` preflight responses, and keeps third-party analytics and widget requests out of origin matching. Even apps talking to multiple backend hosts work automatically when each method and path matches a single recorded origin.
- **Explicit mapping (`--origin-map`):** Pass repeatable `--origin-map <live-origin>=<recorded-origin>` flags (up to 32 entries) when the same method and path were recorded on more than one origin (ambiguous match: `tests[].finding` in `.keploy-ui-results/verdict-document.json` and Playwright's report under `--out` include a `pass --origin-map …` hint), when an automatic binding would conflict with an origin already bound, or when you want explicit origin mappings. Put the **live origin on the left** and the **recorded origin on the right**. Each value must be a strict `http://` or `https://` origin (scheme, host, and optional port: no path, query, or fragment), mappings must be one-to-one, and an origin cannot map to itself.
- **Strict origin matching (`--strict-origins`):** Pass `--strict-origins` to disable automatic aliasing so every cross-origin API call must either match the recorded origin exactly or appear in an explicit `--origin-map` entry.

```bash
keploy ui run \
  --app <app-id> \
  --base-url https://preview-123.staging.example.com \
  --origin-map https://api.staging.example.com=https://api.example.com \
  --origin-map https://auth.staging.example.com=https://auth.example.com \
  --strict-origins
```

#### Debug a single journey locally (`--journey`) {#single-journey-debugging}

Pass repeatable `--journey <journey-id>` (copied from `nonPassing[].reproCommand` in `keploy ui explain`) to iterate locally on specific journeys without creating or uploading a cloud test run:

```bash
keploy ui run --app <app-id> --base-url http://localhost:3000 --journey <journey-id>
```

#### Pre-seed cookies and `localStorage` (`--storage-state`) {#storage-state}

Pass `--storage-state ./storage-state.json` (a Playwright `storageState` JSON object with optional `cookies` and `origins` arrays, up to 10 MiB) to seed browser storage before each journey starts:

```bash
keploy ui run --app <app-id> --base-url http://localhost:3000 --storage-state ./storage-state.json
```

Storage state is resolved in this order:

1. An explicit `--storage-state <path>` flag.
2. Auto-discovered `<repo>/.keploy/ui-storage-state.json` (checked by `keploy ui run`, including `--bundle` runs, and by `keploy ui explore`).
3. For `--bundle` runs only, any `storageState` saved inside the bundle (applied when neither `--storage-state` nor `<repo>/.keploy/ui-storage-state.json` is present).

#### Emulate mobile and tablet devices (`--device`) {#device-emulation}

Emulate mobile or tablet viewport, touch events, device scale factor, and user-agent on `keploy ui run`, `keploy ui record`, and `keploy ui explore`:

```bash
keploy ui run --app <app-id> --base-url http://localhost:3000 --device "iPhone 15"
```

Supported presets: `"iPhone 15"`, `"iPhone 15 Pro"`, `"iPhone 14"`, `"iPhone SE"`, `"Pixel 7"`, `"Pixel 5"`, `"Galaxy S24"`, `"iPad Mini"`, and `"iPad Pro 11"`.

#### Compare visual screenshots {#visual-regression}

Enable deterministic end-state viewport screenshots and pixel-diff them against a baseline directory:

```bash
keploy ui run \
  --app <app-id> \
  --base-url http://localhost:3000 \
  --screenshots \
  --baseline-screenshots ./baseline-screenshots \
  --visual-mask ".timestamp" \
  --step-screenshots
```

- `--baseline-screenshots <dir>` compares each journey against `<dir>/<journeyId>.png` and writes diff metadata to `<out>/visual-diff.json` (implies `--screenshots`).
- `--step-screenshots` also captures per-step images (`<journeyId>-step-N.png`, implies `--screenshots`).
- `--visual-mask <selector>` (repeatable, max 32, up to 256 characters each) masks dynamic regions such as timestamps or live charts. `[data-keploy-visual-mask]`, `[role="progressbar"]`, and `[aria-busy="true"]` are masked automatically.
- Run `keploy ui explain --app <app-id>` to surface `visualDiff` on failing journeys and material `visualChanges` (`diffPercent > 0.1` or `dimensionMismatch`) on passing journeys. Because `explain` defaults `--out` to `.keploy-ui-results` in the current working directory (whereas `run` defaults to `<repo>/.keploy-ui-results`), pass `--out <dir>` whenever you used `--repo` or a custom `--out`.

### Check status and triage failures (`status` and `explain`) {#keploy-ui-status-explain}

```bash
# Check capture state, runnable journey plan, and latest test run
keploy ui status --app <app-id>

# Explain non-passing journeys from the latest run (or a specific --run)
keploy ui explain --app <app-id> [--run <run-id>]
```

- **`keploy ui status`** requires `--app <app-id>`. It prints a deterministic `phase` (`no_sessions`, `waiting_for_flows`, `no_runnable_journeys`, `ready_to_run`, `run_in_progress`, `failing_journeys`, `unverified_run`, or `verified_green`) with a `next` command block.
- **`keploy ui explain`** requires `--app <app-id>` and accepts optional `--run <run-id>` (defaults to the latest run), `--out <dir>` (defaults to `.keploy-ui-results` in the current directory, checked for `visual-diff.json`), and `--max-flows <n>` (default `10`, range `1`–`20`). For each non-passing journey it reports `cause.kind`, the failing `step`, `nearbyCalls`, `visualDiff`, and a local `reproCommand`.

### Explore routes offline with `keploy ui explore` {#keploy-ui-explore}

Crawl safe same-origin routes and write self-contained replay bundles locally with no capture SDK and no Keploy Cloud sign-in:

```bash
keploy ui explore --base-url http://localhost:3000 --out .keploy/ui-journeys
```

| Flag                     | Default               | What it does                                                                                                                         |
| ------------------------ | --------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `--base-url <url>`       | —                     | URL where the app under test is served (required).                                                                                   |
| `--out <dir>`            | `.keploy/ui-journeys` | Output directory for explored journey bundle JSON files.                                                                             |
| `--max-pages <n>`        | `5`                   | Maximum same-origin pages to explore (`1`–`15`).                                                                                     |
| `--device <preset>`      | —                     | Mobile or tablet device preset to emulate while exploring.                                                                           |
| `--storage-state <path>` | Auto-discovered       | Playwright `storageState` JSON file applied to the explorer browser context (auto-discovers `<repo>/.keploy/ui-storage-state.json`). |
| `--repo <dir>`           | `.`                   | App repository whose `@playwright/test` runs the explorer.                                                                           |
| `--launcher <json>`      | Repository default    | JSON array of words specifying how to launch Playwright.                                                                             |
| `--timeout <duration>`   | Engine default        | Maximum duration for the explore run (whole milliseconds).                                                                           |
| `--ignore-https-errors`  | `false`               | Allow Chromium to load an app with an unverified TLS certificate.                                                                    |
| `--node <path>`          | `node`                | Node.js binary (`20.19+` or `22.12+`).                                                                                               |

### Record a local bundle with `keploy ui record` {#keploy-ui-record}

Record a self-contained offline replay bundle from a declarative steps JSON file (`{"name":"...","steps":[{"action":"goto","url":"/path"},{"action":"click","selector":"..."}]}`):

```bash
keploy ui record \
  --base-url http://localhost:3000 \
  --steps ./steps.json \
  --out .keploy/ui-journeys/checkout.json
```

| Flag                     | Default            | What it does                                                                  |
| ------------------------ | ------------------ | ----------------------------------------------------------------------------- |
| `--base-url <url>`       | —                  | URL where the app under test is served (required).                            |
| `--steps <path>`         | —                  | Path to the declarative steps JSON file (required, max 1 MiB).                |
| `--out <path>`           | —                  | Output file path for the recorded bundle JSON (required).                     |
| `--repo <dir>`           | `.`                | App repository whose `@playwright/test` runs the recorder.                    |
| `--launcher <json>`      | Repository default | JSON array of words specifying how to launch Playwright.                      |
| `--storage-state <path>` | —                  | Playwright `storageState` JSON file applied to the recording browser context. |
| `--device <preset>`      | —                  | Mobile or tablet device preset to emulate while recording.                    |
| `--timeout <duration>`   | Engine default     | Maximum duration for the recording run (whole milliseconds).                  |
| `--ignore-https-errors`  | `false`            | Allow Chromium to load an app with an unverified TLS certificate.             |
| `--node <path>`          | `node`             | Node.js binary (`20.19+` or `22.12+`).                                        |

### Export editable steps with `keploy ui export-steps` {#keploy-ui-export-steps}

When an intentional UI change alters a selector or step, export a recorded journey into a declarative steps JSON file compatible with `keploy ui record --steps`, edit only the changed step, and re-record the bundle:

```bash
# Export from Keploy Cloud
keploy ui export-steps --app <app-id> --journey <journey-id> --out /tmp/steps.json

# Export offline from a local bundle
keploy ui export-steps --bundle .keploy/ui-journeys/checkout.json --out /tmp/steps.json
```

| Flag                        | Default     | What it does                                                                                                              |
| --------------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------- |
| `--app <id>`                | —           | Keploy app ID whose journey to export (required unless `--bundle` is set).                                                |
| `--journey <id>`            | —           | Journey ID to export (required with `--app`; optional with `--bundle` when the bundle contains one journey).              |
| `--plan <id>`               | Active plan | Journey plan ID (mutually exclusive with `--bundle`).                                                                     |
| `--bundle <path>`           | —           | Local bundle JSON file or directory of `*.json` bundles to export offline (mutually exclusive with `--app` and `--plan`). |
| `--out <path>`              | —           | Output file path for the exported steps JSON (required).                                                                  |
| `--config-path`, `-c <dir>` | `.`         | Local directory for `keploy.yml`.                                                                                         |

### Exit codes {#keploy-ui-exit-codes}

| Code | Name             | Meaning                                                                                                                                 |
| ---- | ---------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `0`  | Pass             | Every flow in scope was proven and none regressed.                                                                                      |
| `1`  | Findings         | At least one flow differed from its recording.                                                                                          |
| `5`  | SignInRequired   | No signed-in session or API key could be used (`keploy login --no-wait --json`, then `keploy login --finish`, or set `KEPLOY_API_KEY`). |
| `10` | Nondeterministic | The run did not reproduce; the result is not trustworthy.                                                                               |
| `11` | BlockedEnv       | The environment prevented the run; nothing was measured.                                                                                |
| `12` | NothingMatched   | At least one flow in scope had no recording to compare against, or the selection matched none.                                          |
| `13` | RefusedByPolicy  | The requested verb is refused by design (see [Refused verbs](./refusals.md)).                                                           |
| `14` | NeedsHuman       | The result is unproven and must not be guessed.                                                                                         |
| `15` | Usage            | The command invocation or flags were malformed.                                                                                         |

For every `KUI_E_` error code reported in the stdout JSON envelope, see [UI Capture errors and warnings](./errors.md).

## Related

- [UI capture and replay in CI](./ci.md)
- [AI agent quickstart](./quickstart-agent.md)
- [Operate UI capture from an AI agent](./agents.md)
- [MCP tools](./mcp-tools.md)
- [REST API](./rest-api.md)
- [Refused verbs](./refusals.md)
- [Install Keploy](../server/installation.md)
