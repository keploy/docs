---
id: api-testing
title: API Testing in CI/CD
sidebar_label: API Testing
description: Run cloud-managed Keploy API test suites in GitHub Actions with app-scoped CI credentials (GitLab CI and other providers available on request).
---

# API Testing in CI/CD

Run your cloud-managed Keploy API test suites automatically on every pull request and push using `keploy test-suite`.

> **Supported CI provider:** **GitHub Actions** is supported out of the box. GitLab CI and other providers are **available on request** (pass `--experimental-provider` to preview templates).

## Before Your First Run

1. **Generate at least one API test suite** for your app in the Keploy Console.
2. **Configure `KEPLOY_BASE_PATH` (or start your service in CI):** The generated workflow runs `keploy test-suite` against `${KEPLOY_BASE_PATH:-http://localhost:8080}`. Set `KEPLOY_BASE_PATH` as a GitHub Actions repository variable pointing to your staging or preview URL, or add a step to start your service on `localhost:8080` before the Keploy step.
3. **Finding your App ID:** Omit `--app` when running `keploy ci setup --product api --json` to let the CLI guide you through creating or selecting an app (`keploy app create`).

## Quick Start (Agent or Terminal)

```bash
keploy ci setup --product api --app <your-app-id> --json
```

If you prefer the Keploy Console, open **[app.keploy.io/ci-cd](https://app.keploy.io/ci-cd)**, select **API Testing**, mint a scoped credential, store the revealed key as the repository secret **`KEPLOY_API_KEY`** in GitHub Settings → Secrets and variables → Actions, and commit `.github/workflows/keploy-api.yml`.

## What the Credential Grants

API Testing credentials are scoped to the single app with least privilege:

- `app:read` — read the app's endpoint and auth settings (such as Bearer token or login cURL configuration) needed to execute authenticated API test suites.
- `testsuite:read`, `atgtestrun:write` and `atgreport:write` — fetch cloud test suites and submit test-run results and reports.
- `branch:read` and `branch:write` — create and update `ci/<branch>` test-suite branches automatically.

## Branch Behavior

Every generated API Testing workflow resolves the current PR or push branch using your CI provider's native environment variables (for example `GITHUB_HEAD_REF` / `GITHUB_REF_NAME` on GitHub Actions) and passes:

```bash
KEPLOY_INVOKER=ci keploy test-suite --app '<app-id>' --cloud --basePath "${KEPLOY_BASE_PATH:-http://localhost:8080}" --create-branch "ci/${KEPLOY_BRANCH}"
```

## OIDC Workload Identity (Push-Only)

For protected main/release branch builds without stored API keys:

```bash
keploy ci setup --product api --app <your-app-id> --auth oidc --trigger push-only --json
```

## Rotating Keys Without Downtime

```bash
keploy ci credential create --app <your-app-id> --product api --auth key --rotate --grace-hours 24 --to-gh-secret KEPLOY_API_KEY --no-wait --json
```
