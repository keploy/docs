---
id: agent-setup
title: AI Agent CI/CD Setup
sidebar_label: AI Agent Setup
description: Let Claude Code, Cursor, GitHub Copilot, Codex, or Antigravity wire your GitHub Actions CI/CD pipeline automatically with keploy ci setup --json.
keywords:
  - ai agent ci setup
  - claude code keploy
  - cursor keploy ci
  - keploy ci setup
  - keploy ci doctor
---

# AI Agent CI/CD Setup

Keploy's `keploy ci` commands emit structured `ci_setup.v1` JSON **NEXT blocks** (`run`, `ask`, `agent_todo`, `patch_content`) so your AI coding agent can set up, verify, and diagnose CI/CD pipelines with human-in-the-loop browser approval — and without ever seeing a raw API key.

> **Supported CI provider:** **GitHub Actions** is the supported CI provider out of the box. GitLab CI and other providers are **available on request** (pass `--experimental-provider` to preview templates).

## 1. Install the Enterprise CLI (`>= v3.9.27`)

Run in **bash** or **zsh** (requires `curl`):

```bash
source /dev/stdin <<< "$(curl --silent --show-error --fail --location https://keploy.io/ent/install.sh || { echo 'Keploy installer download failed' >&2; echo 'false'; })"
```

The installer also installs Keploy's `ci` agent skill for Claude Code, Cursor, Codex, GitHub Copilot, and Antigravity (you can re-run `keploy skill install` anytime).

## 2. Optional: Add to `AGENTS.md` / `CLAUDE.md`

```markdown
## Keploy CI/CD

When asked to set up, update, or fix Keploy CI/CD:

- Run `keploy ci setup --json` (or `keploy ci doctor --json`).
- Follow `run` literally; relay `ask` verbatim to the user; follow `agent_todo` for single-file merges or committing the workflow on a PR branch.
- Never ask the user to paste a Keploy API key, never read or print `--to-file` key files, and never run `glab variable get`.
- Always ask the user before running any doctor `fix_run` that changes repository settings or rotates/revokes credentials.
- Stop once `keploy ci doctor --json` returns `doctor_passed` (or `doctor_warn`, relaying warnings and `agent_todo`), then commit the workflow on a branch and open a pull request.
```

## 3. Prompt Your Agent

Paste into Claude Code, Cursor, Codex, Copilot, or Antigravity:

> Set up Keploy CI/CD for this repository. Run `keploy ci setup --json` and follow each emitted NEXT block literally — relay any `ask` verbatim to me, never read key files or ask me to paste an API key, ask before running any `fix_run` that changes repo settings or rotates credentials, stop when `keploy ci doctor --json` returns `doctor_passed` or `doctor_warn`, and commit the workflow on a branch for a pull request.

## 4. What Happens During Setup

1. **Interactive sign-in check:** API keys cannot mint CI credentials. If no interactive browser session is active, `keploy ci setup` directs the agent to `keploy login --no-wait --force-session --json`.
2. **Detection:** Inspects your git remote, default branch, `keploy.yml`, and existing CI files to detect the product and provider.
3. **Human-in-the-loop credential approval:** Starts an app-scoped device-authorization flow (`--no-wait --json`), asks you to open `https://app.keploy.io/activate`, inspect the exact app, permissions, and destination, and approve in the browser.
4. **Zero-leak secret storage:** Stores the minted key directly via `gh secret set KEPLOY_API_KEY` (or writes mode `0600` outside the repo with `--to-file`). The raw key never appears in stdout, JSON, or agent context.
5. **Safe workflow wiring:** Writes `.github/workflows/keploy-<product>.yml` via `--write` (with `permissions: contents: read` on key/local workflows, or `id-token: write` on push-only OIDC workflows).
6. **Automated verification:** Runs `keploy ci doctor --json` to verify the workflow file, default branch filter, required `keploy.yml` settings, `KEPLOY_API_KEY` presence (or OIDC trust policy match), and credential health.

## 5. End-to-End Agent Walkthrough

> **Provenance:** The 6-step transcript below is reproduced verbatim by the committed golden test `TestCIWalkthroughGolden_AgentSetup` in `enterprise/cmd/enterprise/ci_walkthrough_golden_test.go` against an in-process mock Keploy API backend and stubbed `git`/`gh` commands, using default SaaS URLs.

### Step 1 — Unauthenticated `keploy ci setup --json`

```bash
keploy ci setup --json
```

```json
{
  "schema": "ci_setup.v1",
  "flow": "ci_setup",
  "phase": "interactive_login_required",
  "summary": "Sign in with an interactive Keploy browser session before setting up CI/CD (configured API keys are ignored).",
  "run": "keploy login --no-wait --force-session --json",
  "protocol": "Keploy unified CI/CD setup. Follow `run` literally when present; relay `ask` verbatim to the user; follow `agent_todo` for single-file merges. Never ask the user to paste an API key or run `glab variable get`."
}
```

The agent runs `keploy login --no-wait --force-session --json`, relays the sign-in URL and code to the human, then runs `keploy login --finish --force-session --json` after browser approval.

### Step 2 — Re-run `keploy ci setup --json` after sign-in

```bash
keploy ci setup --json
```

```json
{
  "schema": "ci_setup.v1",
  "flow": "ci_setup",
  "phase": "credential_needed",
  "summary": "Create a least-privilege t2 CI key for Orders API (permissions: app:view, mock:read).",
  "product": "t2",
  "provider": "github_actions",
  "app_id": "app-orders-prod",
  "auth_mode": "key",
  "run": "keploy ci credential create --app app-orders-prod --product t2 --provider github_actions --auth key --to-gh-secret KEPLOY_API_KEY --no-wait --json",
  "granted_permissions": ["app:view", "mock:read"],
  "protocol": "Keploy unified CI/CD setup. Follow `run` literally when present; relay `ask` verbatim to the user; follow `agent_todo` for single-file merges. Never ask the user to paste an API key or run `glab variable get`."
}
```

_(If your GitHub account is not a repository admin, the CLI automatically routes to `--to-file ~/keploy-ci-t2.key` instead of `--to-gh-secret` so a repo admin can upload it without exposing the key to the agent.)_

### Step 3 — Agent starts bound browser consent (`--no-wait`)

```bash
keploy ci credential create --app app-orders-prod --product t2 --provider github_actions --auth key --to-gh-secret KEPLOY_API_KEY --no-wait --json
```

```json
{
  "schema": "ci_setup.v1",
  "flow": "ci_credential",
  "phase": "approval_pending",
  "summary": "Browser approval required to create t2 CI credential (key) for Orders API.",
  "product": "t2",
  "provider": "github_actions",
  "app_id": "app-orders-prod",
  "auth_mode": "key",
  "run": "keploy ci credential create --finish --json",
  "ask": "Open https://app.keploy.io/activate, enter code ABCD-EFGH, verify the permissions [app:view, mock:read] and destination gh:acme/orders, and approve.",
  "verification_uri": "https://app.keploy.io/activate",
  "user_code": "ABCD-EFGH",
  "destination": "gh:acme/orders",
  "granted_permissions": ["app:view", "mock:read"],
  "protocol": "Keploy unified CI/CD setup. Follow `run` literally when present; relay `ask` verbatim to the user; follow `agent_todo` for single-file merges. Never ask the user to paste an API key or run `glab variable get`."
}
```

### Step 4 — Human approves in browser, agent finishes (`--finish`)

```bash
keploy ci credential create --finish --json
```

```json
{
  "schema": "ci_setup.v1",
  "flow": "ci_credential",
  "phase": "credential_created",
  "summary": "Created scoped CI key key-1 for Orders API and stored at gh:acme/orders.",
  "product": "t2",
  "provider": "github_actions",
  "app_id": "app-orders-prod",
  "auth_mode": "key",
  "run": "keploy ci setup --product t2 --app app-orders-prod --provider github_actions --auth key --write --json",
  "service_account_id": "sa-ci-1",
  "credential_id": "key-1",
  "destination": "gh:acme/orders",
  "granted_permissions": ["app:view", "mock:read"],
  "protocol": "Keploy unified CI/CD setup. Follow `run` literally when present; relay `ask` verbatim to the user; follow `agent_todo` for single-file merges. Never ask the user to paste an API key or run `glab variable get`."
}
```

### Step 5 — Agent writes the workflow (`--write`)

```bash
keploy ci setup --product t2 --app app-orders-prod --provider github_actions --auth key --write --json
```

```json
{
  "schema": "ci_setup.v1",
  "flow": "ci_setup",
  "phase": "ci_wired",
  "summary": "Wrote .github/workflows/keploy-t2.yml. Run `keploy ci doctor` to verify secrets, syntax, and auth.",
  "product": "t2",
  "provider": "github_actions",
  "app_id": "app-orders-prod",
  "auth_mode": "key",
  "run": "keploy ci doctor --product t2 --app app-orders-prod --provider github_actions --json",
  "target_file": ".github/workflows/keploy-t2.yml",
  "written_file": ".github/workflows/keploy-t2.yml",
  "protocol": "Keploy unified CI/CD setup. Follow `run` literally when present; relay `ask` verbatim to the user; follow `agent_todo` for single-file merges. Never ask the user to paste an API key or run `glab variable get`."
}
```

### Step 6 — Agent verifies with `keploy ci doctor --json`

```bash
keploy ci doctor --product t2 --app app-orders-prod --provider github_actions --json
```

```json
{
  "schema": "ci_setup.v1",
  "flow": "ci_doctor",
  "phase": "doctor_passed",
  "summary": "All CI/CD checks passed.",
  "product": "t2",
  "provider": "github_actions",
  "app_id": "app-orders-prod",
  "agent_todo": "Commit .github/workflows/keploy-t2.yml on a branch and open a pull/merge request so CI runs it.",
  "checks": [
    {
      "name": "workflow_present",
      "status": "pass",
      "message": "Found Keploy CI workflow: .github/workflows/keploy-t2.yml"
    },
    {
      "name": "secret_present",
      "status": "pass",
      "message": "KEPLOY_API_KEY secret is configured in GitHub Actions."
    }
  ],
  "protocol": "Keploy unified CI/CD setup. Follow `run` literally when present; relay `ask` verbatim to the user; follow `agent_todo` for single-file merges. Never ask the user to paste an API key or run `glab variable get`."
}
```

The agent commits `.github/workflows/keploy-t2.yml` on a new branch and opens a pull request.
