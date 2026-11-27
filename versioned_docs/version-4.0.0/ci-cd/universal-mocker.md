---
id: universal-mocker
title: Universal Mocker in CI/CD
sidebar_label: Universal Mocker
description: Replay recorded dependency mocks offline in GitHub Actions with Keploy Universal Mocker (GitLab CI and other providers available on request).
---

# Universal Mocker in CI/CD

Run your existing unit and integration test suite in CI with recorded external dependencies replayed deterministically by Keploy Universal Mocker.

> **Supported CI provider:** **GitHub Actions** is supported out of the box. GitLab CI and other providers are **available on request** (pass `--experimental-provider` to preview templates).

## Before Your First Run

Make sure these prerequisites are committed to your repository before opening your CI pull request:

1. **A `keploy.yml` with `mock.command`** — your repository's test command (for example `go test ./...`, `pytest`, or `npm test`) configured under `mock.command`.
2. **Recorded mocks:**
   - **Cloud mode (scoped key or OIDC):** Run `keploy mock record` and `keploy mock publish` locally and commit the generated **`keploy.lock`** file to your repository.
   - **Local mode (`--auth local`):** Commit the local `keploy/` mock recordings directory alongside `keploy.yml`.
3. **Privileged Linux runner:** Universal Mocker attaches an eBPF proxy during replay. Standard `ubuntu-latest` GitHub-hosted runners work out of the box; container-based CI jobs must run privileged.
4. **Finding your App ID:** If you do not know `<your-app-id>`, omit `--app` when running `keploy ci setup --product t2 --json` — the CLI will either read `appId` from `keploy.yml` or guide you to create/select an app with `keploy app create`.

## Quick Start (Agent or Terminal)

```bash
keploy ci setup --product t2 --app <your-app-id> --json
```

If you prefer the Keploy Console, open **[app.keploy.io/ci-cd](https://app.keploy.io/ci-cd)**, select **Universal Mocker**, mint a credential, save the revealed key as the repository secret **`KEPLOY_API_KEY`** in GitHub Settings → Secrets and variables → Actions, and commit the generated `.github/workflows/keploy-t2.yml`.

Follow the emitted `run` commands through browser consent and `keploy ci doctor --json`.

## Three Ways to Authenticate Universal Mocker in CI

1. **Scoped expiring API key (default, recommended for PRs):**
   Works on pull requests and pushes in GitHub Actions. Mints an app-scoped key (`app:view`, `mock:read`, `report:write`, `mock:listmain`, `branch:read`) and stores it as `KEPLOY_API_KEY`.
2. **OIDC Workload Identity (push-only, zero stored secrets):**
   ```bash
   keploy ci setup --product t2 --app <your-app-id> --auth oidc --trigger push-only --json
   ```
   Pins your GitHub repository and branch ref (`refs/heads/<default-branch>`) so no long-lived API key is stored in CI.
3. **Local mode (`--auth local`, credential-free, Free-plan friendly):**
   ```bash
   keploy ci setup --product t2 --auth local --write --json
   ```
   Replays committed local mocks with `KEPLOY_PROVEN=1 KEPLOY_INVOKER=ci keploy mock replay --local --on-miss fail` — zero Keploy API key required.

## Generated Workflow Behavior

- Sets `KEPLOY_PROVEN=1` and `KEPLOY_INVOKER=ci`.
- Cloud auth modes run `keploy mock replay --lock keploy.lock --on-miss fail` so any unrecorded outbound dependency call fails the build deterministically.
- Local mode runs `keploy mock replay --local --on-miss fail` using `mock.command` from `keploy.yml`.
- Fails fast before running tests if `KEPLOY_API_KEY` is missing in key mode.

## Self-Hosted Keploy

Add `--api-server-url https://api.your-company.internal` to `keploy ci setup` and `keploy ci doctor`.
