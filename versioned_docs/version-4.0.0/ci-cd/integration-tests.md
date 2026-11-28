---
id: integration-tests
title: Integration Tests (Cloud Replay) in CI/CD
sidebar_label: Integration Tests
description: Run Keploy Integration Tests (Cloud Replay) in GitHub Actions for both SaaS and self-hosted clusters (GitLab CI and other providers available on request).
---

# Integration Tests (Cloud Replay) in CI/CD

Replay recorded integration test sets against your service on every pull request and push using `keploy cloud replay`.

> **Supported CI provider:** **GitHub Actions** is supported out of the box. GitLab CI and other providers are **available on request** (pass `--experimental-provider` to preview templates).
>
> **Plan requirement:** Integration Tests CI credentials require a paid Keploy plan.

## Before Your First Run

1. **Connected cluster & recorded test sets:** Record at least one test set for your app on a SaaS or self-hosted Kubernetes cluster.
2. **Docker daemon on the runner:** Local runner replay (`keploy cloud replay`) needs a reachable Docker daemon (included on standard `ubuntu-latest` GitHub-hosted runners).
3. **Self-hosted clusters:** Upgrade `k8s-proxy` to **`>= v3.8.27`** and pass `--k8s-proxy-url` and `--cluster` if you want to override the cluster heartbeat URL.
4. **Finding your App ID:** If you do not have `<your-app-id>` handy, omit `--app` when running `keploy ci setup --product t1 --json` — the CLI will point you to `keploy k8s status` to discover your cluster apps.

## Quick Start (Agent or Terminal)

```bash
keploy ci setup --product t1 --app <your-app-id> --json
```

If you prefer the Keploy Console, open **[app.keploy.io/ci-cd](https://app.keploy.io/ci-cd)**, select **Integration Tests**, mint a scoped credential, save the revealed key as **`KEPLOY_API_KEY`** in GitHub Settings → Secrets and variables → Actions, and commit `.github/workflows/keploy-t1.yml`.

Follow the emitted `run` commands until `keploy ci doctor --json` passes.

## Modes & Optional Features

| Option                            | Flag                             | Extra permissions granted                                                              |
| --------------------------------- | -------------------------------- | -------------------------------------------------------------------------------------- |
| **Local runner replay** (default) | _(none)_                         | `app:view`, `testcase:read`, `mock:read`, `report:write`, `config:read`, `branch:read` |
| **In-cluster replay**             | `--mode trigger`                 | Adds `replay:trigger`, `testrun:read`                                                  |
| **Auto-branching & PR comments**  | `--features branch_flow`         | Adds `branch:write`, `branch:merge`, `branch:delete`                                   |
| **Debug bundle uploads**          | `--features upload_debug_bundle` | Adds `debugbundle:write`                                                               |
| **Test normalization**            | `--features normalize`           | Adds `testcase:write`                                                                  |
| **Coverage reporting**            | `--features coverage`            | Adds `coverage:write`                                                                  |

Example with optional features:

```bash
keploy ci setup --product t1 --app <your-app-id> --mode trigger --features branch_flow,coverage --json
```

## Self-Hosted Kubernetes Clusters (`k8s-proxy`)

> **Important:** Self-hosted Integration Tests credentials (both scoped API keys and OIDC workload identities) require **`k8s-proxy >= v3.8.27`**. Earlier `k8s-proxy` versions rejected `app:view`-only credentials and OIDC workload identity tokens.

When your app belongs to a self-hosted cluster, `keploy ci setup` automatically includes `KEPLOY_K8S_PROXY_URL` and `--cluster <name>` in the generated workflow (never on SaaS clusters). You can also pass `--k8s-proxy-url https://k8s-proxy.your-company.internal --cluster <cluster-name>` explicitly.

## OIDC Workload Identity (Push-Only)

For push-only runs on your default branch with zero stored secrets:

```bash
keploy ci setup --product t1 --app <your-app-id> --auth oidc --trigger push-only --json
```
