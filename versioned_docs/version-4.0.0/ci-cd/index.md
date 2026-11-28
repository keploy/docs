---
id: index
title: Set Up CI/CD with Keploy
sidebar_label: Overview
description: Set up CI/CD for Integration Tests, Universal Mocker, UI Testing, and API Testing with Keploy in GitHub Actions, with GitLab CI and other providers available on request.
keywords:
  - keploy ci cd
  - github actions
  - ci setup
  - oidc workload identity
  - service account api keys
---

# Set Up CI/CD with Keploy

Keploy provides a single, unified CI/CD setup experience across all four Keploy testing products:

- **[Integration Tests (Cloud Replay)](./integration-tests)** — replay recorded traffic against your service in CI (SaaS or self-hosted Kubernetes cluster).
- **[Universal Mocker](./universal-mocker)** — replay recorded dependency mocks offline during your existing test suite.
- **[UI Testing](./ui-testing)** — run recorded Playwright browser journeys in CI with zero flaky backends.
- **[API Testing](./api-testing)** — run cloud-managed API test suites on every PR and push.

> **Supported CI providers:** **GitHub Actions** is the supported CI provider out of the box. **GitLab CI**, Woodpecker CI, Jenkins, CircleCI, Azure Pipelines, Bitbucket Pipelines, and AWS CodeBuild are **available on request** (contact Keploy for enablement, or pass `--experimental-provider` in the CLI to preview templates).
>
> **Minimum versions:** Unified CI/CD setup requires Keploy Enterprise CLI **`>= v3.9.29`**. Self-hosted Integration Tests clusters require `k8s-proxy >= v3.8.27`.

## Two Ways to Set Up

1. **With your AI coding agent (recommended):** Install the Enterprise CLI, then ask your agent to run `keploy ci setup --json`. See **[AI Agent CI/CD Setup](./agent-setup)**.
2. **In the Keploy Console:** Open **[app.keploy.io/ci-cd](https://app.keploy.io/ci-cd)** (or `/ci-cd` on self-hosted), pick your app and product, copy the agent prompt or create a scoped credential, store the key as `KEPLOY_API_KEY` in your CI secret store, and commit the generated workflow YAML.

## Security Model & Least-Privilege Credentials

Every credential created by `keploy ci` or `/ci-cd` is bound to a dedicated, app-scoped service account:

- **One credential per app and product** — never an org-wide Personal Access Token or admin key.
- **Explicit interactive sign-in & browser consent** — CI credentials cannot be minted with an existing API key. Every mint uses a dedicated device-authorization flow requiring a human to review and approve the exact app and permissions in the browser.
- **Server-verified audit trail** — creation, first use, OIDC token exchange, rotation, adoption, and revocation are recorded server-side and visible to organization admins in **Settings → CI Audit** and via `keploy ci audit`.
- **Owner-bound enforcement** — if the user who created a CI credential leaves the organization or is deactivated, CI runs fail closed until an organization admin explicitly adopts the credential.
- **Free plan:** Universal Mocker (cloud or `--auth local` credential-free mode) and UI Testing CI credentials are available on the Free plan. Integration Tests and API Testing require a paid plan.

## Authentication Modes

| Mode                                  | Best for                                           | How it works                                                                                                                                                                                                                                                          |
| ------------------------------------- | -------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Scoped expiring API key** (default) | Pull requests & pushes                             | Mints a 90-day (default; `--ttl-days` 1–365) app-scoped key and stores it directly into your CI secret store (`--to-gh-secret KEPLOY_API_KEY`, `--to-glab-var KEPLOY_API_KEY`, or `--to-file <path>`). Supports zero-downtime rotation (`--rotate --grace-hours 24`). |
| **OIDC Workload Identity**            | Push-only / protected branches (no stored secrets) | GitHub Actions (`--auth oidc --trigger push-only`, optionally `--env <name>`) exchanges a short-lived signed OIDC token for an app-scoped Keploy access token. Pull-request jobs always use scoped keys.                                                              |
| **Local (credential-free)**           | Zero-cloud Universal Mocker or local UI Testing    | Runs with committed local mocks (`--local`) or local UI bundles (`--bundle`) — no Keploy API key or network auth required.                                                                                                                                            |

## Self-Hosted Keploy

Pass `--api-server-url https://api.your-company.internal` to `keploy ci setup`, `keploy ci credential create`, and `keploy ci doctor` (or export `KEPLOY_API_SERVER_URL`). Generated workflows pin `KEPLOY_API_SERVER_URL`, guard that the runner installs Enterprise CLI `>= v3.9.29`, and include `KEPLOY_K8S_PROXY_URL` for self-hosted Integration Tests clusters.

For self-hosted OIDC issuers (for example GitHub Enterprise Server), configure `KEPLOY_OIDC_CUSTOM_ISSUERS` on `api-server` with comma-separated `<platform>=<issuer>` entries.

## Provider Notes

- **GitHub Actions (supported):** Automatic secret storage via `gh secret set`, push-only OIDC workload identity, and full workflow checks in `keploy ci doctor`.
- **GitLab CI & other providers (available on request):** Contact Keploy for managed enablement, or pass `--experimental-provider` to preview templates. On GitLab CI, note that merge-request pipelines on unprotected branches fail if `KEPLOY_API_KEY` is marked Protected (`--protected` is only for push-only pipelines). For Woodpecker CI, check `.woodpecker/keploy-*.yml` with `keploy ci doctor --woodpecker-path <path>`.
