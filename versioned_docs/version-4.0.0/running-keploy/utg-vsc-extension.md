---
id: utg-vscode-extension
title: Keploy VS Code extension
sidebar_label: VS Code Extension
description: Install the Keploy VS Code extension, sign in, and hand the setup of Keploy's dependency mocks to your coding agent. Where the CLI goes, which platforms work, what goes out, settings, telemetry and troubleshooting.
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

The **Keploy VS Code extension** (listed as **Keploy: API & DB Mocks**, ID `keploy.keployio`) sets Keploy up for your tests through the coding agent you already use. Keploy records the real calls each of your tests makes to its dependencies, such as HTTP and gRPC APIs, databases, caches and queues, and replays them from the recording, so the same suite runs green with none of those dependencies contacted, on your laptop and in CI.

The extension doesn't write your tests or your integration. It installs the Keploy CLI, signs you in, installs Keploy's skill for your project, and hands the setup to your agent. Your agent then runs the CLI's [`keploy mock`](/docs/running-keploy/mock-your-tests/) commands, and the extension shows what the CLI reports about each test.

:::note Version 3.1.0 hands the setup to your agent

Version 3.1.0 replaces the 3.0.0 panel. Recording, replaying and adding Keploy to CI are now steps your coding agent takes with the CLI, guided by Keploy's skill, and the 3.0.0 test-file actions, CI workflow writers and agent rules are gone. To generate unit tests, use Keploy's [PR Agent](/docs/running-keploy/utg-pr-agent/), which writes them on your GitHub pull requests.

:::

## Requirements

| Requirement    | Details                                                                                                                                                                                                                                                                            |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Editor         | VS Code 1.125 or later.                                                                                                                                                                                                                                                            |
| Coding agent   | Claude Code or GitHub Copilot in VS Code, or Cursor's agent in Cursor.                                                                                                                                                                                                             |
| Keploy account | A free account. You sign in from the extension.                                                                                                                                                                                                                                    |
| macOS          | Apple silicon. Keploy doesn't support Intel Macs: on one, the extension says so and starts no download.                                                                                                                                                                            |
| Linux          | x86-64 or arm64, with Linux kernel 5.10 or later **and** glibc 2.34 or later, such as Ubuntu 22.04, Debian 12, or RHEL 9 and later. The released CLI doesn't start on older glibc (Ubuntu 20.04, Debian 11, RHEL 8, Amazon Linux 2) or on musl-based distributions such as Alpine. |
| Windows        | Not in this version: on Windows, the extension says so and starts no setup. Its Windows support comes in the next release. To use Keploy on Windows today, install the CLI with the [Windows guide](/docs/installation/windows-installation/).                                     |
| Disk           | About 360 MB in your home folder for the CLI.                                                                                                                                                                                                                                      |

## Install the extension

1. In VS Code, open the **Extensions** view, search for **Keploy**, and select **Install** on **Keploy: API & DB Mocks**. You can also install it from the [Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=keploy.keployio), or from a terminal:

   ```bash
   code --install-extension keploy.keployio
   ```

2. Select the **Keploy** icon in the Activity Bar. The **Set up** checklist shows each step: CLI installed, signed in, project set up by your agent, tests recorded, replay green, and the files staged. Select a step that isn't done to run the command that moves it on.

For a guided tour, run **Welcome: Open Walkthrough** from the Command Palette and choose **Get started with Keploy**.

## The Keploy CLI

The extension runs the Keploy CLI, which it downloads and keeps up to date for you:

- **First install.** The download starts by itself when the extension is installed. A notification shows its progress; select **Cancel** to stop it, and run **Keploy: Install or update the CLI** when you're ready. A dropped connection is retried, continuing where it stopped; if the connection is still down after those retries, the install stops, and trying again starts the download over.
- **Location.** The CLI goes into your home folder, at `~/.keploy/bin/keploy`. That is the folder the [Linux](/docs/installation/linux-installation/) and [macOS](/docs/installation/macos-installation/) install steps use, so a CLI you installed with them is the one the extension runs. The download is a single file of 270 to 360 MB, depending on your platform, and the extension checks it against the SHA-256 checksum Keploy publishes before it installs it. Installing the CLI needs no root or `sudo`, and changes nothing else on your machine.
- **Your terminals.** The extension adds that folder to the end of `PATH` in VS Code's terminals, so your agent finds `keploy` there. A `keploy` that is earlier on your `PATH`, such as one in `/usr/local/bin`, still wins in a terminal, while the extension's own runs always use the CLI in your home folder.
- **Updates.** The extension keeps a CLI it installed at the current release. A CLI you installed yourself in that folder is left as it is, unless it's older than the oldest version the extension works with: then the extension replaces it.
- **A fixed version.** To hold one build, set `keploy.cli.version` to an exact release number. A version older than the oldest one the extension works with is refused, with a message naming that version. Leave the setting empty to follow the current release.

## Sign in

Select **Sign in** in the checklist, or run **Keploy: Sign in**. Keploy's sign-in page opens in your browser with a code; approve it there. There is nothing to copy back, and the extension never sees or stores a token.

The CLI stores the session, so every `keploy` run reads it: the extension's, your terminal's and your agent's. A `keploy login` in a terminal signs the extension in too.

## Set up with your agent

Select **Set up with my agent** in the checklist, or run **Keploy: Set up Keploy with my coding agent**. The extension installs Keploy's skill for this project through the CLI (`keploy skill install mock --agent <agent> --project`), then opens your agent with the setup task:

1. set `mock.command` in `keploy.yml` to the command CI runs your tests with;
2. add the test-side hook the skill names for your framework (Go, Java, Python or Jest);
3. record with `keploy mock record`;
4. replay with `keploy mock replay` until it's green, fixing each red the way its options say.

The agent starts with `keploy mock status --json`, and every `keploy mock` command prints its next step, so the agent never has to guess. It asks you before any step that needs your sign-in or changes more than `keploy.yml`, `keploy.lock` and your test files.

| Agent          | When the extension uses it                                                                                                | Where the skill goes   |
| -------------- | ------------------------------------------------------------------------------------------------------------------------- | ---------------------- |
| Claude Code    | When the Claude Code extension is installed.                                                                              | `.claude/skills`       |
| GitHub Copilot | When Claude Code isn't installed: in VS Code, or in Cursor with the GitHub Copilot extension.                             | `.github/instructions` |
| Cursor         | In Cursor, when neither Claude Code nor GitHub Copilot is installed. The setup task goes to your clipboard for its agent. | `.cursor/rules`        |

To pick the agent yourself, run **Keploy: Hand the setup to another agent**. **Keploy: Hand the setup to my agent** hands the setup over again, to the first agent in this table that you have.

## Record, replay and review

Your agent records and replays from its terminal. You can also run either one yourself with **Keploy: Record** and **Keploy: Replay**, which run `keploy mock record` and `keploy mock replay` in a VS Code task. Signed in, the CLI works through your Keploy account: each recording is uploaded to Keploy Cloud and downloaded from there before a replay.

- **Testing view.** "Keploy (mocked)" in VS Code's Testing view lists each recording set, and every test the CLI names as red, not judged, stale or set aside, with the CLI's reason. Record and Replay run from it.
- **Status bar.** A count of the tests Keploy kept.
- **Refresh.** **Keploy: Refresh status** reads the CLI's status again.

When the replay is green, select **Stage** in the checklist, or run **Keploy: Stage keploy.yml, keploy.lock and the test edits**. `keploy.yml`, `keploy.lock` and the files that changed after your agent started go into Source Control for you to review and commit. Keploy's skill for the project is offered unpicked: pick it to share the setup with your team. Nothing is committed for you, and `.gitignore` is never changed.

## Where your tests can run

The extension runs the CLI with `KEPLOY_PROVEN=1`, which judges each test on its own, against the command `mock.command` in `keploy.yml` names. This version of the extension sets Keploy up for tests that run directly on Linux or macOS:

| Where your tests run              | What happens                                                                                                                                                                                                                                               |
| --------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Directly on Linux                 | Keploy uses eBPF, which needs root. When you're not root, the CLI asks for it through `sudo` on a record or a replay, so answer its prompt in the run's terminal. The extension never adds `sudo` itself.                                                  |
| Directly on macOS (Apple Silicon) | No `sudo` needed. Keploy instruments the test processes it starts; see the [macOS guide](/docs/installation/macos-installation/) for what that covers.                                                                                                     |
| Directly on Windows               | Not in this version of the extension; see [Requirements](#requirements).                                                                                                                                                                                   |
| In a Docker container             | Not in this version of the extension. The CLI in this release stops a `docker` test command, or one with `--from-container`, under `KEPLOY_PROVEN`: it runs the test command natively. Set `mock.command` to the command that runs your tests on the host. |

## What goes out

On replay, none of your dependencies are contacted: the calls Keploy recorded are answered from the recording, and a call it didn't record is refused instead of sent, so a test that needs that call fails. What does go out:

- A DNS lookup the recording doesn't have goes to your resolver, and its answer is used.
- Signed in, the CLI works through your Keploy account and needs a connection: each recording is uploaded to Keploy Cloud, with any credentials it captured, and downloaded from there before a replay. To keep credentials off Keploy's servers, record against test credentials.
- Keploy's own usage telemetry, from the extension and the CLI, as [Telemetry](#telemetry) describes.

## Settings

| Setting                    | Default | What it does                                                                                                                                     |
| -------------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `keploy.cli.version`       | empty   | Pins the CLI to an exact version, such as `3.8.126`. Empty follows the current release, never below the oldest version the extension works with. |
| `keploy.telemetry.enabled` | `true`  | Sends the extension's product-analytics events. See [Telemetry](#telemetry). A workspace's settings can turn this off, never on.                 |

In a workspace you haven't trusted, the Keploy view opens and explains itself, but recording, replaying and sign-in stay off until you trust the folder: Keploy runs your project's own test command, which is code execution.

## Telemetry

The extension sends product-analytics events: which setup steps you reach, and where a step fails, so Keploy can decide what to fix first. They carry VS Code's machine ID, and their values are kept as the extension saw them, including file paths, hostnames, IP addresses, repository names, email addresses and the text of an error. API keys, tokens, passwords and `Authorization` values are redacted before an event leaves your machine. Events never carry source code or file contents.

Every event goes to `telemetry.keploy.io`, keyed by that machine ID. While you're signed in, the same event also goes to Keploy's API, `api.keploy.io`, with your session, so it's tied to your Keploy account.

To turn it off, set `keploy.telemetry.enabled` to `false`, or set VS Code's `telemetry.telemetryLevel` to `off`. Either one stops the extension's own events, to both places, and every Keploy CLI the extension starts gets `KEPLOY_DISABLETELE=true`, which quiets the CLI process. In this release that doesn't reach every part of the CLI:

- **On Linux**, a CLI that isn't running as root starts its agent, the process that records and replays, with `sudo`, which drops the variable, so the agent sends its own usage pings. `disableTele: true` in your project's `keploy.yml` stops them.
- The CLI's **sign-in events**, sent when you sign in or when it renews your session during a run, follow neither setting.

A `keploy` command that you or your agent run in a terminal isn't one the extension starts, so neither setting reaches it: `KEPLOY_DISABLETELE=true` in that shell quiets the CLI process, and `disableTele: true` in `keploy.yml` quiets its agent too.

## Troubleshoot

**Keploy: Show log** opens the extension's log, which names the CLI version on disk, the version it's updating to, and why.

| Message                                                                           | What it means                                                                       | What to do                                                                                                                                                           |
| --------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| The CLI download fails or never finishes.                                         | The download couldn't reach Keploy's servers, or ran out of retries.                | Run **Keploy: Install or update the CLI** again. Downloads start at `keploy.io` and are served from the CDN it redirects to, so a proxy or firewall must allow both. |
| **keploy.cli.version pins** _version_**, below** _version_ …                      | The pinned version is older than the oldest CLI the extension works with.           | Pin the version the message names or a later one, or clear the setting to follow the current release.                                                                |
| **Keploy: the sign-in could not start.**                                          | The CLI couldn't start the sign-in. The rest of the message gives the CLI's reason. | Check your connection to `app.keploy.io` and `api.keploy.io`, then select **Sign in** again.                                                                         |
| **Keploy: could not install the skill for** _agent_                               | `keploy skill install` failed. The rest of the message gives the CLI's reason.      | Fix what it names, then run **Keploy: Hand the setup to my agent** again.                                                                                            |
| A record or replay stops with _"runs the test command natively in this release"_. | `mock.command` is a `docker` or `docker compose` command.                           | Set `mock.command` to the command that runs your tests on the host.                                                                                                  |

On Linux, if the CLI doesn't run at all, check your glibc version with `ldd --version`. The released CLI needs glibc 2.34 or later; see [Requirements](#requirements).

## Commands

| Command                                                      | What it does                                                                                     |
| ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------ |
| **Keploy: Set up Keploy with my coding agent**               | Makes sure the CLI is installed, signs you in if you aren't, then hands the setup to your agent. |
| **Keploy: Sign in**                                          | Signs the CLI in to your Keploy account in your browser.                                         |
| **Keploy: Hand the setup to my agent**                       | Installs Keploy's skill for this project and opens your agent with the setup task.               |
| **Keploy: Hand the setup to another agent**                  | The same, with an agent you pick.                                                                |
| **Keploy: Record** and **Keploy: Replay**                    | Run `keploy mock record` or `keploy mock replay` for the project.                                |
| **Keploy: Refresh status**                                   | Reads the CLI's status again.                                                                    |
| **Keploy: Stage keploy.yml, keploy.lock and the test edits** | Stages the setup's files in Source Control for you to review and commit.                         |
| **Keploy: Install or update the CLI**                        | Installs the CLI, or updates it when it needs updating.                                          |
| **Keploy: Show log**                                         | Opens the extension's log.                                                                       |

## Related

- [Mock your tests](/docs/running-keploy/mock-your-tests/) — the `keploy mock` commands your agent runs.
- [Keploy on macOS](/docs/installation/macos-installation/) and [Linux](/docs/installation/linux-installation/) — installing the CLI yourself, and what each platform supports.
- [Keploy's PR Agent](/docs/running-keploy/utg-pr-agent/) — Keploy's unit test generator, on your pull requests.
