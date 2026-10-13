---
id: utg-vscode-extension
title: Keploy VS Code extension
sidebar_label: VS Code Extension
description: Record the API and database calls your tests make from VS Code, then replay them with those dependencies switched off. Install, first run, sign-in, AI agent setup, CI, settings, and troubleshooting.
tags:
  - vscode
  - vs code extension
  - mocks
  - mocking
  - record and replay
  - ai agents
keywords:
  - keploy vs code extension
  - vscode mocks
  - api mocks
  - database mocks
  - dependency mocking
  - record and replay
  - ai coding agents
  - keploy.keployio
---

The **Keploy VS Code extension** (listed as **Keploy: API & DB Mocks**, ID `keploy.keployio`) records the real calls your tests make to their dependencies, such as HTTP and gRPC APIs, databases, caches, and queues, and saves them next to your code. It then replays your tests with those dependencies switched off, answering every call from the recording.

The extension runs the Keploy CLI's [`keploy mock`](/docs/running-keploy/mock-your-tests/) commands for you from a panel in VS Code. Keploy works at the network layer, so you don't need an SDK or any change to your test code. Which languages and protocols it supports depends on where your tests run; see [Choose where your tests run](#choose-where-your-tests-run).

:::note The extension no longer generates unit tests

Version 3.0.0 of the extension replaces the earlier unit test generator. To generate unit tests, use Keploy's [PR Agent](/docs/running-keploy/utg-pr-agent/), which writes them on your GitHub pull requests.

:::

## What you can do with it

- **Record** the dependency calls your test command makes while the real dependencies are running.
- **Replay** the same command with the dependencies switched off. Every call is answered from the recording, and a call that was never recorded fails the run.
- **Hand it to your coding agent.** The extension can install Keploy's skill and rules for Claude Code, Cursor, GitHub Copilot, Codex, and Antigravity, so your agent records and replays instead of inventing stubs.
- **Check it in CI.** One click adds a GitHub Actions job that replays the recording on every pull request.

## Requirements

| Requirement       | Details                                                                                                                                                                                                                                                                            |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Editor            | VS Code 1.104 or later.                                                                                                                                                                                                                                                            |
| macOS             | Apple Silicon only. The Keploy CLI's macOS build doesn't run on Intel Macs, so the extension doesn't install it there.                                                                                                                                                             |
| Linux             | x86-64 or arm64, with Linux kernel 5.10 or later **and** glibc 2.34 or later, such as Ubuntu 22.04, Debian 12, or RHEL 9 and later. The released CLI doesn't start on older glibc (Ubuntu 20.04, Debian 11, RHEL 8, Amazon Linux 2) or on musl-based distributions such as Alpine. |
| Windows           | x64. Windows on Arm isn't supported.                                                                                                                                                                                                                                               |
| Disk              | About 200 MB in your home folder for the CLI.                                                                                                                                                                                                                                      |
| Docker (optional) | Only if your tests run in containers.                                                                                                                                                                                                                                              |

## Install the extension

1. In VS Code, open the **Extensions** view, search for **Keploy**, and select **Install** on **Keploy: API & DB Mocks**. You can also install it from the [Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=keploy.keployio), or from a terminal:

   ```bash
   code --install-extension keploy.keployio
   ```

2. Select the **Keploy** icon in the Activity Bar to open the panel.

For a guided tour, run **Welcome: Open Walkthrough** from the Command Palette and choose **Get started with Keploy**.

## Install the Keploy CLI on first run

The extension runs your tests through the Keploy CLI, which it downloads and manages for you:

- **New install.** The download starts on its own the first time VS Code starts with the extension. A notification shows its progress; select **Cancel** to stop it. Nothing is installed, and the panel offers **Install Keploy** for when you're ready.
- **Update from an earlier version of the extension.** If you don't have the Keploy CLI yet, the extension asks before it downloads it.
- **Size and location.** The CLI is a single file of about 200 MB. It goes to `~/.keploy/bin/keploy` on macOS and Linux, and to `%APPDATA%\.keploy\bin\keploy.exe` on Windows. The extension checks the download against the SHA-256 checksum Keploy publishes and discards it if they don't match. Installing the CLI changes nothing else on your machine.
- **Updates.** When the CLI in that folder is older than the minimum version the extension needs, the extension replaces it automatically. It never touches a `keploy` binary you installed somewhere else, such as `/usr/local/bin`.
- **A fixed version.** To hold one build, set `keploy.cli.version` to an exact release number. Leave it empty to follow the current release.

## Record and replay your tests

### Record with the dependencies running

1. Start the real dependencies your tests use: a database, a cache, a local service, or a staging API.
2. In the Keploy panel, enter the command that runs your tests, such as `npm test`, `pytest`, or `go test ./...`. The panel suggests one when it recognizes your project.
3. Select **Start recording**.

Keploy runs your command and saves every outgoing call it captures into a mock set, in `keploy/<set name>/mocks.yaml` in your workspace. While the run is in progress, the panel counts the captured calls; select **Stop** to end it early. The first run also writes `keploy.yml`, the CLI's settings for this repository, at the root of your workspace.

### Replay with the dependencies switched off

1. Stop the dependencies.
2. Select **Replay offline**.

Keploy runs the same command and answers every call from the recording. The panel replays with `--on-miss fail`, so a call that was never recorded fails the run instead of reaching a real service. When the tests pass, the panel shows **Dependencies off. Tests still passed.**

Commit the `keploy/` folder and `keploy.yml` with your code so that teammates and CI replay the same recording. Signing in changes what git picks up, as [Sign in](#sign-in-optional) explains.

### Start a run from elsewhere

- **Command Palette:** run **Keploy: Record Mocks** or **Keploy: Replay Mocks**, and confirm the test command to run.
- **Test files:** at the top of recognized test files, such as `*.test.ts`, `*_test.go`, `test_*.py`, or `*Test.java`, the extension adds **Record with Keploy** and **Replay with Keploy mocks**. Each asks for the test command to run, filled in with your project's command, and uses a mock set named after the file. To hide them, set `keploy.codeLens.enabled` to `false`.

### What the panel runs

The panel runs the CLI in a VS Code terminal with the same commands you would run yourself:

```bash
keploy mock record -c "<your test command>"
keploy mock replay -c "<your test command>" --on-miss fail
```

It adds `--name <set name>` for a named set, `--container-name` for a container command, and `--local` when you aren't signed in. See [Mock your tests](/docs/running-keploy/mock-your-tests/) for the other flags and for per-test scoping.

### Choose where your tests run

| Where your tests run              | What to enter                                                                                       | Notes                                                                                                                                                                                                                 |
| --------------------------------- | --------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Directly on Linux                 | Your test command                                                                                   | Keploy uses eBPF, which needs root. Unless VS Code runs as root, the CLI asks for your `sudo` password in the Keploy terminal. To run the whole command with `sudo -E` instead, set `keploy.cli.elevation` to `sudo`. |
| Directly on macOS (Apple Silicon) | Your test command                                                                                   | No `sudo` needed.                                                                                                                                                                                                     |
| Directly on Windows (x64)         | Your test command                                                                                   | No Administrator rights needed.                                                                                                                                                                                       |
| In a Docker container             | A `docker` or `docker compose` command, such as `docker compose run --rm --name my-app-tests tests` | The panel also asks for the name of the container your tests run in.                                                                                                                                                  |

Directly on macOS and Windows, Keploy supports tests written in Go, Node.js, Python, and Java, and understands their HTTP and HTTPS, MySQL, and MongoDB calls. It captures other protocols, such as PostgreSQL, Redis, Kafka, and gRPC, only as raw bytes, and those usually don't replay. For other languages or those dependencies, run your tests in a Docker container. The [macOS](/docs/installation/macos-installation/) and [Windows](/docs/installation/windows-installation/) guides have the details.

## Sign in (optional)

You don't need an account to record and replay on your machine. Without one, the panel runs with `--local`, and your recordings stay on your disk. The Command Palette and the test-file actions ask whether to sign in or to run without an account.

When you sign in, runs go through your Keploy account instead, and the CLI also keeps each mock set in Keploy's [Mock Registry](/docs/keploy-cloud/mock-registry/): it uploads the whole set, including any credentials it holds, when a recording finishes, and downloads it before a replay. If an upload or download fails, the run carries on with the set on your disk. Signed-in replays are reported to your Keploy account as usage; runs without an account aren't. Signed-in runs check your account with Keploy's servers first, so they need a network connection. To record and replay with no network at all, sign out.

When a signed-in recording uploads a set, or a signed-in replay downloads one, the CLI adds `/*/mocks.yaml` to `keploy/.gitignore`. That line matches the recording in every set, so git leaves out any recording that it doesn't already track. A recording that git already tracks stays tracked, so a signed-in recording's changes to it, credentials included, go into your next commit. Each set's `config.yaml` records which copy in the registry a signed-in replay downloads. For what this means in CI, see [Check your recordings in CI](#check-your-recordings-in-ci).

- **Sign in:** select **Sign in** in the panel, or run **Keploy: Sign In**. The extension runs `keploy login`, which opens your browser.
- **One session:** the extension uses the CLI's own session, so a `keploy login` in any terminal signs the panel in too. If `KEPLOY_API_KEY` is set, or `~/.keploy/cred.yaml` holds an API key, the CLI uses that key first.
- **Sign out:** run **Keploy: Sign Out**.

## Set up your AI coding agent

The extension can teach your coding agent to record and replay your tests, so the agent works against recorded calls instead of stubs it guesses.

After your first recording that captures calls, the extension asks once whether to set up the coding agents it finds. You can also start this at any time with **Keploy: Add Mocking Rules for AI Agents**. When the extension asks, it writes nothing before you answer. The skill acts only in repositories that use Keploy.

When the Keploy CLI can install its skill, your answer decides where the files go:

| Your answer                            | Where the files go                                                                                                                                            |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **All my projects**                    | Your agents' home folders: `~/.claude/skills` for Claude Code, `~/.agents/skills` for Codex, and `~/.gemini/config/skills` for Antigravity.                   |
| **Just this project**                  | This repository: `.claude/skills`, `.cursor/rules`, `.agents/skills`, or `.github/instructions`, for the agents it found. Offered only when a folder is open. |
| **Add it**                             | This repository. Offered instead of the two preceding answers when only Cursor or GitHub Copilot is found.                                                    |
| **No thanks**, or closing the question | Nowhere. The extension doesn't ask again on its own.                                                                                                          |

Cursor and GitHub Copilot have no home-folder location, so only a repository install, **Just this project** or **Add it**, sets them up.

When the Keploy CLI has no skill to install, or the extension finds no coding agent, **Keploy: Add Mocking Rules for AI Agents** writes the extension's own rules into the repository instead: `.claude/skills/keploy-mocking/SKILL.md`, `.cursor/rules/keploy-mocking.mdc`, `CLAUDE.md`, `AGENTS.md`, and `.github/copilot-instructions.md`. In files that can hold your own content, it edits only the block between `<!-- BEGIN KEPLOY MOCKING … -->` and `<!-- END KEPLOY MOCKING -->`, and leaves the rest alone. A notification lists every file it wrote.

To keep the skill out of home folders on a machine, set `keploy.agentSkill.install` to `false`. The extension then doesn't offer this on its own, and the command writes into the current repository only.

In VS Code's chat, the extension also provides tools that an agent can call, or that you can reference with `#keployStatus`, `#keployMocks`, `#keployRecord`, `#keployReplay`, and `#keployVerify`. The record, replay, and verify tools ask you to confirm before they run your test command.

## Check your recordings in CI

After a replay passes, the panel offers to add a CI job that replays the recording on every pull request:

- **GitHub Actions:** **Check this on every pull request** writes `.github/workflows/keploy-offline-tests.yml`, or `keploy-offline-<set name>.yml` for a named set. The job installs the same CLI version, fails if the recording is missing, and runs `keploy mock replay --local` with `--on-miss fail`. The replay needs no database and no API keys. In a repository with no CI yet, the button reads **Add a GitHub Actions replay job**.
- **GitLab, Woodpecker, CircleCI, and others:** **Copy the replay steps for** your CI copies the steps to your clipboard, to paste into the job that runs your tests. The extension doesn't edit those pipeline files.

The job replays the recording committed to your repository, without an account. If `keploy/.gitignore` holds the `/*/mocks.yaml` line that signed-in runs add, git skips any recording it doesn't already track, and the job fails for lack of a recording. To commit that recording anyway, run `git add -f keploy/<set name>/mocks.yaml`. Once git tracks the file, the line no longer applies to it.

To keep recordings from drifting away from the real services, run **Keploy: Set Up Mock Auto-Refresh (CI)**. It writes `.github/workflows/keploy-refresh-mocks.yml`, a GitHub Actions workflow that runs every Monday at 06:00 UTC and on demand. It re-records against your real dependencies, fails if nothing was recorded, and commits the refreshed set. If git doesn't track the set and `keploy/.gitignore` lists it, the workflow has nothing to commit. Before you rely on it, replace its **Bring up real dependencies** step, which is a placeholder. This workflow is for GitHub Actions only; in a repository that uses another CI, the extension doesn't write it.

## Keep credentials out of your repository

A recording holds real traffic, so it can hold real credentials. The panel checks the start of each recording for common credential patterns, such as `Authorization` headers, cookies, bearer tokens, JWTs, and API key headers, and warns you when it finds one. The check doesn't read a whole large recording, and it doesn't recognize database passwords, so a clean result isn't a guarantee: review a recording before you commit it. The extension never rewrites recorded traffic.

When the panel finds credentials and `keploy/` isn't ignored, it offers **Add keploy/ to .gitignore**. If `keploy/` is already committed, it offers **Stop tracking keploy/** instead, and if it can't tell, **Keep keploy/ out of git**. Without an account, an ignored recording stays on your machine, so teammates and CI can't replay it, and the CI job fails for lack of a recording. **Stop tracking keploy/** doesn't remove credentials that were already pushed, so rotate them.

When you're signed in, the CLI has already uploaded the recording, credentials included, to your account's Mock Registry, and ignoring `keploy/` doesn't change that. To keep credentials off Keploy's servers, record without an account, or record against test credentials.

Once `keploy/` is ignored, the panel offers **Record again with fresh credentials**: record against test credentials to get a recording that's safe to commit.

## Settings

| Setting                     | Default | What it does                                                                                                                                                 |
| --------------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `keploy.cli.version`        | empty   | Pins the CLI to an exact version. Empty follows the current release, never below the minimum version the extension needs.                                    |
| `keploy.cli.elevation`      | `auto`  | Linux only. `auto` and `none` both run the command as is, and the CLI asks for `sudo` itself when it needs it. `sudo` runs the whole command with `sudo -E`. |
| `keploy.agentSkill.install` | `true`  | Lets the extension offer the Keploy skill for your agents' home folders. `false` keeps it out of them, and agent rules go into the repository only.          |
| `keploy.codeLens.enabled`   | `true`  | Shows the record and replay actions at the top of test files.                                                                                                |
| `keploy.telemetry.enabled`  | `true`  | Sends the extension's usage events. See [Telemetry](#telemetry).                                                                                             |

## Telemetry

The extension sends usage events to Keploy: which features you use, and whether recordings and replays succeed or fail. The events never include source code, file contents, paths, test commands, or request and response data. They carry VS Code's anonymous machine ID, and your Keploy account only when you're signed in.

To turn them off, set `keploy.telemetry.enabled` to `false`, or set VS Code's `telemetry.telemetryLevel` to `off`. Either one stops the extension's events.

The Keploy CLI reports its own usage separately, and so does the agent that the CLI starts to record and replay your tests. When your tests run directly on your machine, setting `disableTele: true` in your repository's `keploy.yml` turns off both.

Setting the environment variable `KEPLOY_DISABLETELE` to `true` in the environment you start VS Code from also turns off the CLI's reporting, but on Linux it doesn't always reach the agent. Unless the CLI itself runs as root, it starts the agent with `sudo`, which drops the variable, so the agent still reports its usage. On Linux, use `keploy.yml`.

When your tests run in a Docker container, the CLI runs the agent in a container of its own. Either setting still turns off the CLI's own reporting, but neither reaches that agent, so it still reports its usage.

The CLI also sends events about signing in, such as when you sign in or when it renews your session. Those events don't follow either setting.

## Troubleshoot

When a run fails, the panel names the problem and offers the action that fixes it, and the notification that appears when the run ends gives the specific reason. The messages you're most likely to see:

| Message                                                                                                  | What it means                                                                                                                                                                                                                                                                                                                                                         | What to do                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| -------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **The install did not finish.**                                                                          | The CLI download failed. The panel names the cause, such as a full disk, no write access to the install folder, a proxy asking for credentials (HTTP 407), or a refused download (HTTP 403).                                                                                                                                                                          | Fix the cause, then select **Try the install again**. Downloads start at `keploy.io` and are served from the CDN it redirects to, so a proxy or firewall must allow both.                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| **Keploy's macOS build is Apple Silicon only.**                                                          | You're on an Intel Mac, where the extension can't run Keploy.                                                                                                                                                                                                                                                                                                         | To use Keploy on this Mac, run the CLI inside a Lima VM. See the [macOS guide](/docs/installation/macos-installation/).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| **The pinned Keploy version was never published.** or **This Keploy version has no build for this Mac.** | `keploy.cli.version` names a release that doesn't exist, or one older than the Apple Silicon build.                                                                                                                                                                                                                                                                   | Clear the setting, or pin a published release.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| **That run captured nothing.**                                                                           | The recording finished without capturing a single call.                                                                                                                                                                                                                                                                                                               | Check that your dependencies were running and reachable from the test command. For a container command, check that the tests ran in the container you named. On macOS, if the panel names `npm`, `npx`, `yarn`, or `pnpm`, macOS removed Keploy's instrumentation when that launcher started your tests. Start the test runner with `node` itself, such as `node node_modules/.bin/jest`, or run your tests in Docker. Running `jest` on its own doesn't help, because it starts through the same kind of launcher. See the [macOS guide](/docs/installation/macos-installation/#option-1-run-keploy-natively). |
| **That recording was cut short.**                                                                        | The run stopped before your test command finished, so the recording is incomplete.                                                                                                                                                                                                                                                                                    | Record again before you rely on it.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| **Keploy needs permissions to attach.**                                                                  | On Linux, the CLI couldn't get the root privileges that eBPF needs.                                                                                                                                                                                                                                                                                                   | Enter your `sudo` password when the CLI asks, set `keploy.cli.elevation` to `sudo`, or run your tests in a container.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| **Keploy stopped that run.**                                                                             | Keploy itself failed before your tests ran, for example a signed-in run that couldn't reach Keploy's servers. The line under it gives Keploy's reason. After a replay, this means the recording wasn't tested.                                                                                                                                                        | Follow that line. With no network, sign out, then record or replay without an account. Don't record again because of it.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| **That run did not pass.**                                                                               | The test command failed. Keploy passes your command's exit code through, so this is usually your tests.                                                                                                                                                                                                                                                               | Run the command on its own. If it passes there, the failure came from running it under Keploy, so report it.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| **That command was not found.**                                                                          | The shell couldn't run your test command.                                                                                                                                                                                                                                                                                                                             | Check the command, and that its tool is on your `PATH`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| **That run was stopped.**                                                                                | The run was ended from outside the panel before it finished.                                                                                                                                                                                                                                                                                                          | Run it again.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| **That run ran out of memory.**                                                                          | The operating system killed the test command, usually for lack of memory.                                                                                                                                                                                                                                                                                             | Free some memory, or run fewer tests at once.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| **That run did not finish.**                                                                             | Keploy or the test process stopped early. The line under it says why.                                                                                                                                                                                                                                                                                                 | Follow that line. If it asks for a container, run your tests in one and enter the container's name.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| **There is nothing to replay.**                                                                          | The mock set has no recorded calls.                                                                                                                                                                                                                                                                                                                                   | Record first, or replay a set that has calls in it.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| **The offline run did not pass.**                                                                        | The replay failed: your code changed since the recording, or it made a call that was never recorded. If the notification says **Keploy stopped that run.**, the replay never reached your tests; see that message. If the panel says Keploy couldn't attach to your tests, it's a permissions problem, not the recording: see **Keploy needs permissions to attach.** | Open the recording to see what's in it. Then fix the test, select **Record only the missing calls** with the dependencies running, or record again.                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| **The replay did not finish.**                                                                           | The replay was stopped before it finished, so the recording wasn't judged.                                                                                                                                                                                                                                                                                            | Run the replay again.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| **Keploy needs a sign-in.** or **Your session expired.**                                                 | A run tried to use your account without a valid session.                                                                                                                                                                                                                                                                                                              | Sign in again, or run without an account.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| **Keploy would not use your API key.**                                                                   | Keploy rejected the key in `KEPLOY_API_KEY` or `~/.keploy/cred.yaml`. Signing in doesn't replace that key.                                                                                                                                                                                                                                                            | Replace the key, or run without an account.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |

In a workspace you haven't trusted, the panel opens, but recording, replaying, and sign-in stay off until you trust the folder.

On Linux, if the CLI doesn't run at all, check your glibc version with `ldd --version`. The released CLI needs glibc 2.34 or later; see [Requirements](#requirements).

## Commands

| Command                                                                         | What it does                                                                                 |
| ------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| **Keploy: Open Mocks Dashboard**                                                | Opens the Keploy panel.                                                                      |
| **Keploy: Record Mocks**                                                        | Records the dependency calls of your test command.                                           |
| **Keploy: Replay Mocks**                                                        | Replays your test command against a recording.                                               |
| **Keploy: Add Mocking Rules for AI Agents**                                     | Installs the Keploy skill or rules for your coding agents.                                   |
| **Keploy: Set Up Mock Auto-Refresh (CI)**                                       | Writes the GitHub Actions workflow that re-records mocks.                                    |
| **Keploy: Sign In** and **Keploy: Sign Out**                                    | Signs the CLI in to your Keploy account, or out of it.                                       |
| **Keploy: Show CLI Version**                                                    | Shows the version of the installed CLI.                                                      |
| **Keploy: Mocking Docs**                                                        | Opens [Mock your tests](/docs/running-keploy/mock-your-tests/).                              |
| **Keploy: Report an Issue (GitHub)** and **Keploy: Request a Feature (GitHub)** | Opens a prefilled issue in the [keploy/keploy](https://github.com/keploy/keploy) repository. |

## Related

- [Mock your tests](/docs/running-keploy/mock-your-tests/) — the `keploy mock` commands the extension runs.
- [Mock Registry](/docs/keploy-cloud/mock-registry/) — where signed-in runs keep mock sets.
- [Keploy on macOS](/docs/installation/macos-installation/), [Linux](/docs/installation/linux-installation/), and [Windows](/docs/installation/windows-installation/) — what each platform supports.
- [Keploy's PR Agent](/docs/running-keploy/utg-pr-agent/) — Keploy's unit test generator, on your pull requests.
