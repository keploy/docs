---
id: ui-testing
title: UI Testing in CI/CD
sidebar_label: UI Testing
description: Replay recorded Playwright UI journeys in GitHub Actions with Keploy UI Testing (GitLab CI and other providers available on request).
---

# UI Testing in CI/CD

Replay your recorded Playwright browser journeys automatically on every pull request and push with `keploy ui run`.

> **Supported CI provider:** **GitHub Actions** is supported out of the box. GitLab CI and other providers are **available on request** (pass `--experimental-provider` to preview templates).
>
> **Plan requirement:** UI Testing CI credentials are available on the Free plan. Local bundle replay (`--auth local --bundle-dir <dir>`) runs offline without cloud credentials.

## Before Your First Run

1. **Start your web app in CI:** Pass `--start-cmd "<command>"` during setup (for example `--start-cmd "npm run start"`) or export `APP_START_CMD` in your workflow so your app is listening at `--base-url` before `keploy ui run` executes.
2. **Recorded UI journeys:**
   - **Cloud mode:** Ensure your app has recorded UI journeys in the Keploy Console.
   - **Local mode (`--auth local`):** Commit your recorded bundle directory (default `.keploy/ui-journeys`).
3. **Playwright dependencies:** The generated workflow runs `npm ci` / `npm install` and `npx playwright install --with-deps` automatically.
4. **Finding your App ID:** Omit `--app` when running `keploy ci setup --product ui --json` to follow the CLI's guided `keploy app create` flow.

## Quick Start (Agent or Terminal)

```bash
keploy ci setup --product ui --app <your-app-id> --base-url http://localhost:3000 --start-cmd "npm run start" --json
```

If you prefer the Keploy Console, open **[app.keploy.io/ci-cd](https://app.keploy.io/ci-cd)**, select **UI Testing**, mint a scoped credential, save the revealed key as the repository secret **`KEPLOY_API_KEY`** in GitHub Settings → Secrets and variables → Actions, and commit `.github/workflows/keploy-ui.yml`.

## Authentication Modes

- **Scoped API key (default):** Grants `app:view`, `uipayload:read` and `testgen:run` on the single app, stored as `KEPLOY_API_KEY`.
- **OIDC Workload Identity (`--auth oidc --trigger push-only`):** Exchanges a short-lived GitHub OIDC token with zero stored secrets.
- **Local bundle replay (`--auth local`):**
  ```bash
  keploy ci setup --product ui --auth local --bundle-dir .keploy/ui-journeys --base-url http://localhost:3000 --start-cmd "npm run start" --write --json
  ```
  Runs `KEPLOY_INVOKER=ci keploy ui run --bundle '.keploy/ui-journeys' --base-url 'http://localhost:3000'` without any Keploy API key.

## What the Generated Workflow Does

1. Installs the Enterprise CLI (`>= v3.9.29`).
2. Installs Node dependencies and Playwright browsers (`npx playwright install --with-deps`).
3. Starts your app using `--start-cmd` (or `APP_START_CMD`) and waits until `--base-url` responds before executing `keploy ui run`.
4. Uploads journey verdicts to Keploy Cloud (in key or OIDC mode).
