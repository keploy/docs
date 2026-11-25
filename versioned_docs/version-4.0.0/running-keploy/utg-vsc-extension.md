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

The **Keploy VS Code extension** (listed as **Keploy: API Testing, Mocks & Service Virtualization**, ID `keploy.keployio`) sets Keploy up for your tests through the coding agent you already use. Keploy records the real calls each of your tests makes to its dependencies, such as HTTP and gRPC APIs, databases, caches and queues, and replays them from the recording, so the same suite runs green with none of those dependencies contacted, on your laptop and in CI.

The extension doesn't write your tests or your integration. It installs the Keploy CLI, signs you in, installs Keploy's skill for your project, and hands the setup to your agent. Your agent then runs the CLI's [`keploy mock`](/docs/universal-mocker/mock-your-tests/) commands, and the extension shows what the CLI reports about each test.

:::note Version 3.1.0 hands the setup to your agent

Version 3.1.0 replaces the 3.0.0 panel. Setting Keploy up, recording and replaying are now steps your coding agent takes with the CLI, guided by Keploy's skill. **Wire CI** writes a GitHub Actions workflow for a Go or Node project and offers Keploy's CI recipe for any other language or CI, and the 3.0.0 test-file actions and agent rules are gone. To generate unit tests, use Keploy's [PR Agent](/docs/running-keploy/utg-pr-agent/), which writes them on your GitHub pull requests.

:::

## Requirements

| Requirement    | Details                                                                                                                                                                                                                                                                                                                |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Editor         | VS Code 1.125 or later.                                                                                                                                                                                                                                                                                                |
| Coding agent   | Claude Code (its VS Code extension or the `claude` CLI) or GitHub Copilot in VS Code, or Cursor's agent in Cursor.                                                                                                                                                                                                     |
| Keploy account | A free account. You sign in from the extension.                                                                                                                                                                                                                                                                        |
| macOS          | Apple silicon. Keploy doesn't support Intel Macs: on one, the extension says so and starts no download.                                                                                                                                                                                                                |
| Linux          | x86-64 or arm64, with Linux kernel 5.10 or later **and** glibc 2.34 or later, such as Ubuntu 22.04, Debian 12, or RHEL 9 and later. The released CLI doesn't start on older glibc (Ubuntu 20.04, Debian 11, RHEL 8, Amazon Linux 2) or on musl-based distributions such as Alpine.                                     |
| Windows        | Windows 10 or 11 on an x64 PC, with extension 3.1.7 or later and Keploy CLI 3.9.19 or later, which the extension installs for you. No step needs an administrator. Keploy doesn't support Windows on Arm yet: on an Arm PC, the extension says so and starts no download. See [Run it on Windows](#run-it-on-windows). |
| Disk           | About 360 MB in your home folder for the CLI.                                                                                                                                                                                                                                                                          |

## Install the extension

1. In VS Code, open the **Extensions** view, search for **Keploy**, and select **Install** on **Keploy: API Testing, Mocks & Service Virtualization**. You can also install it from the [Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=keploy.keployio), or from a terminal:

   ```bash
   code --install-extension keploy.keployio
   ```

2. Select the **Keploy** icon in the Activity Bar. The **Set up** checklist shows each step: CLI installed, signed in, project set up by your agent (or, offered beside it, your running app recorded for [Integration Testing](/docs/server/install/)), tests recorded, replay green, the files staged, CI wired and teammates invited. Select a step that isn't done to run the command that moves it on.

For a guided tour, run **Welcome: Open Walkthrough** from the Command Palette and choose **Get started with Keploy**.

## The Keploy CLI

The extension runs the Keploy CLI, which it downloads and keeps up to date for you:

- **First install.** The download starts by itself when the extension is installed. A notification shows its progress; select **Cancel** to stop it, and run **Keploy: Install or update the CLI** when you're ready. A dropped connection is retried, continuing where it stopped; if the connection is still down after those retries, the install stops, and trying again starts the download over.
- **Location.** The CLI goes into your home folder, at `~/.keploy/bin/keploy`, or on Windows at `%LOCALAPPDATA%\.keploy\bin\keploy.exe`. That is the folder the [Linux](/docs/installation/linux-installation/), [macOS](/docs/installation/macos-installation/) and [Windows](/docs/installation/windows-installation/) install steps use, so a CLI you installed with them is the one the extension runs. The download is a single file of 270 to 360 MB, depending on your platform, and the extension checks it against the SHA-256 checksum Keploy publishes before it installs it. Installing the CLI needs no root, `sudo` or administrator, and changes nothing else on your machine.
- **Your terminals.** The extension adds that folder to the end of `PATH` in VS Code's terminals, so your agent finds `keploy` there. A `keploy` that is earlier on your `PATH`, such as one in `/usr/local/bin`, still wins in a terminal, while the extension's own runs always use the CLI in your home folder.
- **Updates.** The extension keeps a CLI it installed at the current release. A CLI you installed yourself in that folder is left as it is, unless it's older than the oldest version the extension works with: then the extension replaces it. On Windows, that oldest version is 3.9.19. Windows doesn't let a running `keploy.exe` be replaced, so while a record or replay runs, the extension says so and leaves it; select **Retry** when the run ends.
- **A fixed version.** To hold one build, set `keploy.cli.version` to an exact release number. A version older than the oldest one the extension works with is refused, with a message naming that version. Leave the setting empty to follow the current release.

## Sign in

Sign-in is required once the CLI is installed: until you sign in, every other command (the walkthrough steps, Record, Replay, handing setup to your agent, Wire CI and Testing view runs) asks you to sign in first. Select **Signed in to Keploy** in the checklist, or run **Keploy: Sign in**. Keploy's sign-in page opens in your browser with a code; approve it there. There is nothing to copy back. If your company runs its own Keploy, run **Keploy: Sign in to a self-hosted Keploy** with your server's k8s-proxy URL and an API key from its dashboard. The extension never stores a token: the CLI writes the session, and the extension reads it to show whether you're signed in and, while telemetry is on, to send its events to Keploy's API with your session.

The CLI stores the session, so every `keploy` run reads it: the extension's, your terminal's and your agent's. A `keploy login` in a terminal signs the extension in too. Your sign-in lasts across restarts; when it expires, Keploy asks again.

## Set up with your agent

Select **Project set up by your agent** in the checklist, or run **Keploy: Set up Keploy with my coding agent**. The extension installs Keploy's skill for this project through the CLI (`keploy skill install mock --agent <agent> --project`), then opens your agent with the setup task:

1. set `mock.command` in `keploy.yml` to the command CI runs your tests with;
2. add the test-side integration the skill names for your framework: go-sdk's `keploytest` for Go tests, `@keploy/playwright` for Playwright; in any other framework the test process makes the same calls by hand, as the skill shows;
3. record with `keploy mock record --lock keploy.lock`, to Keploy Cloud: the recording is pinned in `keploy.lock`, the file CI and your teammates replay;
4. replay with `keploy mock replay --lock keploy.lock` until it's green, fixing each red the way its options say.

The agent runs every `keploy` command with `KEPLOY_PROVEN=1` and starts with `keploy mock status --json`, and every `keploy mock` command prints its next step, so the agent never has to guess. It asks you before any step that needs your sign-in or changes more than `keploy.yml`, `keploy.lock` and your test files.

| Agent                  | How the extension hands off the task                                                                                                                                                                                                                                                                                                                                                    | Where the skill goes   |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------- |
| Claude Code (chat)     | Opens a new Claude Code conversation with the setup task typed in when the Claude Code VS Code extension is installed.                                                                                                                                                                                                                                                                  | `.claude/skills`       |
| Claude Code (terminal) | Opens an integrated terminal in your project (in bash, zsh, fish, or PowerShell) and runs `claude` with the setup task as its first message from a terminal variable when the `claude` CLI is installed (on `PATH` or its installer location). If `claude`'s path cannot be safely passed to your shell, no terminal opens: Keploy names that path and puts the task on your clipboard. | `.claude/skills`       |
| GitHub Copilot         | Opens chat in agent mode when picked.                                                                                                                                                                                                                                                                                                                                                   | `.github/instructions` |
| Cursor                 | Copies the setup task to your clipboard for Cursor's agent when picked in Cursor.                                                                                                                                                                                                                                                                                                       | `.cursor/rules`        |

How the extension picks an agent:

- When only one form of Claude Code (its extension or the `claude` CLI) is installed, it uses that form.
- When **both** the Claude Code VS Code extension and the `claude` CLI are installed, Keploy asks once: **Claude Code (chat)** or **Claude Code (terminal)**, and remembers your choice for the workspace.
- A Claude Code user is never silently handed off to GitHub Copilot or another agent. With no Claude Code installed, Keploy asks once per workspace which agent gets the setup (before opening GitHub Copilot, and in Cursor before copying the task for Cursor's agent) and offers Claude Code there too, with the task on your clipboard. If a workspace remembered Claude Code and neither its extension nor the `claude` CLI is present anymore, Keploy puts the task on your clipboard and tells you rather than switching agents.

To change the workspace's remembered agent choice at any time, run **Keploy: Hand the setup to another agent**. **Keploy: Hand the setup to my agent** hands the setup over again using the workspace's remembered choice (or asks as above when none is saved).

## Record, replay and review

Your agent records and replays from its terminal. You can also run either one yourself with **Keploy: Record** and **Keploy: Replay**, which run `keploy mock record --lock keploy.lock` and `keploy mock replay` in a VS Code task, so a project's first record creates `keploy.lock`. Signed in, the CLI works through your Keploy account: each recording is uploaded to Keploy Cloud and downloaded from there before a replay. The extension runs one record or replay of each kind at a time while its task is active in its terminal: starting another while a task is still running says _A Keploy replay is already running_ (or the record equivalent) and starts nothing. Once a run ends in its terminal, you can start the next run immediately—even while Keploy is still reading the project's status. If a later replay of the same set starts before an earlier run finishes reading its status, the earlier run reports that a later replay replaced its result rather than showing the later run's verdict. When a run ends, its terminal is shown scrolled to its last line.

**Keploy: Record** records on a work branch, so the default branch's `keploy.lock` changes only through merges. When you select it on `main` or `master`, or with no branch checked out, the extension offers to create `keploy/<your folder's name>` (or, when that exists, the first free copy from `-2` to `-9`, named in the offer), check it out and record there. Nothing runs if you don't take the offer. Before a record, the extension also saves your Keploy app's ID in `keploy.yml` (with `keploy app create --json`) when the file has none, so the checklist finds the recording in Keploy Cloud.

On macOS, when your test command runs through `mvn`, `mvnw`, `gradle` or `gradlew`, **Keploy: Record** first says that Java builds run through Maven or Gradle aren't supported on macOS in this release, because macOS strips Keploy's network hook from those launcher scripts, and suggests Linux for them. The record still runs.

For a recording held in Keploy Cloud, the checklist's **Tests recorded** step ticks once Keploy Cloud holds tests for the project, and reads **Recorded: _n_ tests in Keploy Cloud**. **Replay green** ticks only from a replay you started in VS Code, with **Keploy: Replay** or from the Testing view, that exited 0 with a report in which no test failed. It stays ticked after a window reload, or after you close and reopen VS Code. A newer replay run elsewhere, such as in your agent's terminal, takes the tick back, whether it passed or failed, because the extension didn't see how it exited: run **Keploy: Replay** to tick it again. A new record, or a newer `keploy.lock`, clears it too.

- **Testing view.** "Keploy (mocked)" in VS Code's Testing view lists each recording set, and every test the CLI names as red, not judged, stale or set aside, with the CLI's reason. A recording held in Keploy Cloud is one row, **Keploy Cloud: _n_ tests**. Record and Replay run from it, one recording set at a time (`keploy mock replay --name <set>`), and **Run All** runs every set in turn. An item passes only when the replay you started exited 0 and its result says no test failed: a run whose result is missing or replaced by a later replay of the same set, or where a test was not judged or did not run, is never marked passed. A failed item says why in the Test Results view: its message ends with the `FAILED` and `VERDICT` lines the replay's terminal ended with.
- **Status bar.** A count of the tests Keploy kept.
- **Refresh.** **Keploy: Refresh status** reads the CLI's status again.

When the replay is green, select **keploy.yml, keploy.lock and the test edits staged** in the checklist, or run **Keploy: Stage keploy.yml, keploy.lock and the test edits**. `keploy.yml`, `keploy.lock` and the files that changed after your agent started go into Source Control for you to review and commit. Keploy's skill for the project is offered unpicked: pick it to share the setup with your team. Nothing is committed for you, and `.gitignore` is never changed.

## Run it in CI

Select **CI replays keploy.lock** in the checklist, or run **Keploy: Wire CI**. For a Go or Node project in a GitHub repository, the extension writes `.github/workflows/keploy.yml`, never over a file that is already there. On every pull request and every push to main, the workflow runs `keploy mock replay --lock keploy.lock --on-miss fail` with `KEPLOY_PROVEN=1`, and comments on the pull request what its `keploy.lock` changes.

The replay lets no download out, so before it the workflow sets up your project's toolchain and installs its dependencies, in the folder your test command runs in: the project's folder, or the folder its first `cd` goes to. The extension reads the toolchain from the program your test command runs (`go` for Go; `npm`, `npx`, `pnpm`, `yarn`, `node`, `jest` or `playwright` for Node) or, for a command such as `make test`, from that folder's files (a `go.mod`, or a `package.json` with its lockfile):

- **Go:** `actions/setup-go` with your `go.mod`'s Go version, then `go mod download`.
- **Node:** `actions/setup-node`, then an install from your lockfile: `npm ci`, or pnpm's or Yarn's frozen install through corepack (`npm install` when there's no lockfile).

The workflow needs one repository secret, `KEPLOY_API_KEY`: a key with only **MOCK_READER** on your app. Run `keploy service-account key create --role MOCK_READER --to-gh-secret KEPLOY_API_KEY` in the project's folder: Keploy asks an admin of the app's company to approve that one key with a fresh browser sign-in, stores it through `gh`, and never prints it. With an older CLI that has no `service-account` command, an admin makes the key at [Account > Service Accounts](https://app.keploy.io/settings/service-accounts) and stores it with `gh secret set KEPLOY_API_KEY`. The notification the extension shows has a **Copy the key command** button for the CLI command and an **Open the CI key page** button. **Copy the key command** requires Keploy CLI 3.9.13 or later: with an older or unreadable CLI, the notification omits **Copy the key command** and offers **Clear pin and update** (when `keploy.cli.version` pins an older version) or **Update CLI** beside **Open the CI key page**.

For any other project, such as a Python or Java one, a test command that runs several toolchains, or one whose toolchain the extension can't tell — and for GitLab CI, Jenkins, or any other CI besides GitHub Actions — Wire CI writes no workflow and instead offers the recipe `keploy mock ci` prints for the project, with **Hand CI setup to** your coding agent and **Show me the steps** (with a copy button). The CI recipe action requires Keploy CLI 3.9.13 or later: with an older or unreadable CLI, Wire CI does not open the recipe and instead offers **Clear pin and update** or **Update CLI**, while every other extension command keeps working on older pinned CLIs. If you get stuck, write to support@keploy.io. The extension writes the native workflow once `keploy.lock` exists and Keploy has read your test command; otherwise it gives the recipe with what to do first. For a project in a folder below the repository's root, such as `tests/e2e`, the workflow's steps run in that folder, and a Go project's `go.mod` can be there or in a folder above it.

The checklist's **CI replays keploy.lock** row is done when a config of the CI your repository runs, at the repository's root or in the project's folder, has a `keploy mock replay ... --on-miss fail` step on any CI. For a project in a folder below the root, a step at the root counts only when it names that project (`working-directory`, `cd`, `--lock <folder>/keploy.lock`, or a unique `--name <its recording>`); a step that names no project counts only for a `keploy.yml` at the repository's root.

## Invite teammates

Select **Teammates invited** in the checklist, or run **Keploy: Invite teammates**. It opens the Keploy app's [Add User](https://app.keploy.io/settings/users/add-user) page, where an admin adds them. A teammate who clones the repository signs in with `keploy login` and runs `KEPLOY_PROVEN=1 keploy mock replay`: the replay reads the committed `keploy.yml` and `keploy.lock` and downloads the recordings the lock pins.

## Record your running app (Integration Testing)

No tests to record? Keploy's Integration Testing can record the API calls your app serves instead. Select **No tests to record? Record your running app** in the checklist, or run **Keploy: Record my running app**. It asks for the command that starts your app, such as `go run .` or `npm start` on Linux, and runs `keploy record -c "<command>"` in a terminal of its own. Send your app the requests you want as tests, then press Ctrl+C: the recording goes to `keploy/test-set-<n>`. **Keploy: Replay my app's recording as tests** runs `keploy test -c "<command>" -t <sets>`, naming every `keploy/test-set-<n>` folder, which starts your app again and replays those requests against it as tests. The terminal stays open with keploy's exit code until you press Enter.

On macOS, give the command that runs your app itself, such as its built binary or `node server.js`, not a launcher such as `npm start` or a wrapper script: macOS drops Keploy's interception when a protected system binary runs. For a Go app, build it and give its binary, such as `./app` after `go build -o app .` (add `app` to `.gitignore`, or build it outside the repository, so the binary stays out of your commits). On macOS, the extension's record also skips the replay that `keploy record` runs when it stops (it passes `--disableAutoReplay`): in this release, that replay takes about 90 seconds for each test whose request called another service. The recording is saved, and **Keploy: Replay my app's recording as tests** runs it as tests.

On Linux, Keploy needs root to capture your app's traffic, so the CLI asks for your password (`sudo`) in that terminal; on a Mac or on Windows it needs no admin rights. These runs don't set `KEPLOY_PROVEN`. [Record and replay your app](/docs/server/install/) shows the same steps in a terminal.

## Where your tests can run

The extension runs the CLI with `KEPLOY_PROVEN=1`, which judges each test on its own, against the command `mock.command` in `keploy.yml` names. This version of the extension sets Keploy up for tests that run directly on Linux, macOS or Windows:

| Where your tests run              | What happens                                                                                                                                                                                                                                               |
| --------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Directly on Linux                 | Keploy uses eBPF, which needs root. When you're not root, the CLI asks for it through `sudo` on a record or a replay, so answer its prompt in the run's terminal. The extension never adds `sudo` itself.                                                  |
| Directly on macOS (Apple Silicon) | No `sudo` needed. Keploy instruments the test processes it starts; see the [macOS guide](/docs/installation/macos-installation/) for what that covers.                                                                                                     |
| Directly on Windows (x64)         | No administrator needed. Keploy instruments the test processes it starts, in user space. The first record or replay asks you to trust Keploy's certificate: see [Run it on Windows](#run-it-on-windows).                                                   |
| In a Docker container             | Not in this version of the extension. The CLI in this release stops a `docker` test command, or one with `--from-container`, under `KEPLOY_PROVEN`: it runs the test command natively. Set `mock.command` to the command that runs your tests on the host. |

## Run it on Windows

From extension 3.1.7, the extension sets Keploy up on Windows 10 and 11 on x64 PCs, with Keploy CLI 3.9.19 or later. No step needs an administrator: installing and updating the CLI, recording, replaying and trusting Keploy's certificate all run as you.

1. **Install the extension.** The steps are the same as on Linux and macOS: [Install the extension](#install-the-extension). The extension downloads `keploy.exe` into `%LOCALAPPDATA%\.keploy\bin`, checks it against the checksum Keploy publishes, and keeps it at Keploy CLI 3.9.19 or later. `keploy.exe` is signed by **Keploy Inc**.
2. **Sign in and set up with your agent,** as [Sign in](#sign-in) and [Set up with your agent](#set-up-with-your-agent) describe.
3. **Trust Keploy's certificate once.** To record and replay your tests' HTTPS calls, Keploy adds its own certificate authority to your Windows user's **Trusted Root** store. On the first record or replay, Windows shows a **Security Warning** asking whether to install a certificate from a certification authority claiming to represent **Keploy MITM CA**, followed by an ID. Select **Yes**: the run waits for your answer. If you select **No**, the run stops and Keploy prints the step that trusts the certificate; start the record or replay again and select **Yes**. Keploy keeps that certificate authority in `%LOCALAPPDATA%\Keploy\ca`, so later runs reuse it with no prompt.
4. **Record and replay** with **Keploy: Record** and **Keploy: Replay**, or let your agent run them, as [Record, replay and review](#record-replay-and-review) describes.

A few things work differently on Windows:

- **Windows on Arm.** Keploy doesn't support Windows on Arm yet, because its Windows capture runs only on x64. On an Arm PC, the extension says _Keploy doesn't support Windows on Arm yet_, downloads no CLI and starts no command. To use Keploy on an Arm PC, run it in WSL, as the [Windows guide](/docs/installation/windows-installation/#option-2-install-keploy-with-wsl) shows.
- **No desktop.** A session with no desktop, such as a CI runner's service, an OpenSSH session or a scheduled task, can't show Windows' prompt to trust Keploy's certificate. Keploy then gives its certificate to Node, Python, OpenSSL and curl, Cargo and Java apps through the variables each one reads, so their HTTPS calls are still recorded and replayed. Go and .NET apps read only the Windows store: trust Keploy's certificate once from a session signed in to the desktop as the same Windows user, by running Keploy there and selecting **Yes**, or by running the `certutil -user -addstore ROOT` command Keploy prints, with the certificate's path. A certificate an administrator or a group policy put in the machine's Trusted Root store counts too, and a run with no desktop as Administrator or as LocalSystem (an account in the Administrators group) adds it to the machine's store itself. For a runner that runs as a built-in service account such as NETWORK SERVICE, see [Troubleshoot Keploy on Windows](/docs/installation/windows-installation/#troubleshoot-keploy-on-windows).
- **DNS.** A name in your Windows `hosts` file is answered by Windows itself. Every other lookup goes through Keploy, as on Linux.
- **From a terminal.** The same `keploy mock record` and `keploy mock replay` commands run in PowerShell or Command Prompt, with no administrator: see [Mock your tests](/docs/universal-mocker/mock-your-tests/). To install the CLI yourself, follow the [Windows guide](/docs/installation/windows-installation/).

## What goes out

On replay, none of your dependencies are contacted: the calls Keploy recorded are answered from the recording, and a call it didn't record is refused instead of sent, so a test that needs that call fails. What does go out:

- A DNS lookup the recording doesn't have goes to your resolver, and its answer is used.
- Signed in, the CLI works through your Keploy account and needs a connection: each recording is uploaded to Keploy Cloud, with any credentials it captured, and downloaded from there before a replay. To keep credentials off Keploy's servers, record against test credentials.
- Keploy's own usage telemetry, from the extension and the CLI, as [Telemetry](#telemetry) describes.

## Settings

| Setting                    | Default | What it does                                                                                                                                    |
| -------------------------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `keploy.cli.version`       | empty   | Pins the CLI to an exact version, such as `3.9.19`. Empty follows the current release, never below the oldest version the extension works with. |
| `keploy.telemetry.enabled` | `true`  | Sends the extension's product-analytics events. See [Telemetry](#telemetry). A workspace's settings can turn this off, never on.                |

In a workspace you haven't trusted, the Keploy view opens and explains itself, but recording, replaying and sign-in stay off until you trust the folder: Keploy runs your project's own test command, which is code execution. In an untrusted workspace with more than one project folder, **Keploy: Record** and **Keploy: Replay** refuse for workspace trust before asking which folder to use.

## Telemetry

The extension sends product-analytics events: which setup steps you reach, how Wire CI goes, and where a step fails, so Keploy can decide what to fix first. They carry VS Code's machine ID, and their values are kept as the extension saw them, including file paths, hostnames, IP addresses, repository names, email addresses and the text of an error. API keys, tokens, passwords and `Authorization` values are redacted before an event leaves your machine. Events never carry source code or file contents.

Every event goes to `telemetry.keploy.io`, keyed by that machine ID. While you're signed in, the same event also goes to Keploy's API, `api.keploy.io`, with your session, so it's tied to your Keploy account. While telemetry is on and a setup flow is active (a day from Set up or the sign-in that started it), the extension sets `KEPLOY_SESSION` in integrated terminals and on the `keploy` commands in the task handed to your coding agent so CLI runs (from CLI 3.9.5) join the flow.

To turn it off, set `keploy.telemetry.enabled` to `false`, or set VS Code's `telemetry.telemetryLevel` to `off`. Either one stops the extension's own events to both places, sets `KEPLOY_DISABLETELE=true` (and no `KEPLOY_SESSION`) on every Keploy CLI the extension starts, on every new integrated terminal (including an agent's terminal), and on every `keploy` command in the task handed to your coding agent. A change to either setting reaches the next terminal you open. It does not yet quiet all of the CLI:

- On Linux, a CLI not running as root starts its agent with `sudo`, which drops `KEPLOY_DISABLETELE`; set `disableTele: true` in `keploy.yml` to stop the agent's usage pings.
- CLI sign-in events do not yet honour either setting.
- Keploy's server records activity through your signed-in account (sign-ins, uploaded recordings and replays, CI runs) as part of the service regardless of either setting.

A `keploy` command run in a shell VS Code did not open for you (or in an integrated terminal opened before you turned telemetry off, until relaunched) gets neither variable: set `KEPLOY_DISABLETELE=true` in that shell and `disableTele: true` in `keploy.yml`.

## Troubleshoot

**Keploy: Show log** opens the extension's log, which names the CLI version on disk, the version it's updating to, and why.

| Message                                                                                | What it means                                                                                                                                 | What to do                                                                                                                                                           |
| -------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| The CLI download fails or never finishes.                                              | The download couldn't reach Keploy's servers, or ran out of retries.                                                                          | Run **Keploy: Install or update the CLI** again. Downloads start at `keploy.io` and are served from the CDN it redirects to, so a proxy or firewall must allow both. |
| **keploy.cli.version pins** _version_**, below** _version_ …                           | The pinned version is older than the oldest CLI the extension works with (on Windows, 3.9.19).                                                | Pin the version the message names or a later one, or clear the setting to follow the current release.                                                                |
| **Keploy: the sign-in could not start.**                                               | The CLI couldn't start the sign-in. The rest of the message gives the CLI's reason.                                                           | Check your connection to `app.keploy.io` and `api.keploy.io`, then run **Keploy: Sign in** again.                                                                    |
| **Keploy: could not install the skill for** _agent_                                    | `keploy skill install` failed. The rest of the message gives the CLI's reason.                                                                | Fix what it names, then run **Keploy: Hand the setup to my agent** again.                                                                                            |
| A record or replay stops with _"runs the test command natively in this release"_.      | `mock.command` is a `docker` or `docker compose` command.                                                                                     | Set `mock.command` to the command that runs your tests on the host.                                                                                                  |
| **Keploy: Wire CI for this project needs Keploy CLI 3.9.13 or later** …                | The installed CLI is older than 3.9.13 (or its version cannot be read), which Wire CI's recipe action and **Copy the key command** require.   | Select **Update CLI**, or **Clear pin and update** if `keploy.cli.version` pins an older version. Other extension commands keep working on older pinned CLIs.        |
| **A Keploy replay is already running** …                                               | A replay task you started is still active in its terminal.                                                                                    | Wait for it to end in its terminal, then start the new one again (you don't need to wait for the post-run status refresh).                                           |
| **Stage** or **Wire CI** _needs Git_ …                                                 | VS Code's Git is turned off (`git.enabled`), or Git isn't installed.                                                                          | Turn `git.enabled` on, or install Git. On a Mac, run `xcode-select --install`.                                                                                       |
| **Keploy doesn't support Windows on Arm yet** …                                        | The PC has an Arm processor. Keploy's Windows capture runs only on x64.                                                                       | Use an x64 Windows PC, or run Keploy in WSL as the [Windows guide](/docs/installation/windows-installation/#option-2-install-keploy-with-wsl) shows.                 |
| **Keploy runs on Windows from Keploy CLI 3.9.19** … _keploy.io could not be reached_ … | The extension couldn't ask keploy.io for the latest CLI (you're offline, or a proxy is in the way), and no CLI at 3.9.19 or later is on disk. | Check your connection to `keploy.io`, then reload the window.                                                                                                        |
| **keploy.exe is running** …                                                            | A record or replay is using `keploy.exe`, so Windows doesn't let the extension replace it.                                                    | Select **Retry** when the run ends.                                                                                                                                  |
| **keploy.exe is held open by another program** …                                       | Another program, such as an antivirus scan or a backup, has `keploy.exe` open.                                                                | Select **Retry** in a moment.                                                                                                                                        |
| Windows shows a **Security Warning** about **Keploy MITM CA**.                         | Keploy is adding its certificate authority to your user's Trusted Root store, to record and replay HTTPS calls.                               | Select **Yes**. See [Run it on Windows](#run-it-on-windows).                                                                                                         |

On Linux, if the CLI doesn't run at all, check your glibc version with `ldd --version`. The released CLI needs glibc 2.34 or later; see [Requirements](#requirements).

On Windows, if Microsoft Defender or SmartScreen stops `keploy.exe`, see [Troubleshoot Keploy on Windows](/docs/installation/windows-installation/#troubleshoot-keploy-on-windows).

## Commands

| Command                                                      | What it does                                                                                                                                                                   |
| ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Keploy: Set up Keploy with my coding agent**               | Makes sure the CLI is installed, signs you in if you aren't, then hands the setup to your agent.                                                                               |
| **Keploy: Sign in**                                          | Signs the CLI in to your Keploy account in your browser.                                                                                                                       |
| **Keploy: Sign in to a self-hosted Keploy**                  | Signs in to a self-hosted Keploy server using its k8s-proxy URL and an API key.                                                                                                |
| **Keploy: Hand the setup to my agent**                       | Installs Keploy's skill for this project and hands the setup task to the workspace's agent (Claude Code chat or terminal, GitHub Copilot, or Cursor).                          |
| **Keploy: Hand the setup to another agent**                  | The same, letting you choose a different agent (including switching between Claude Code chat and terminal) and updating the workspace's remembered choice.                     |
| **Keploy: Record** and **Keploy: Replay**                    | Run `keploy mock record --lock keploy.lock` (on a work branch) or `keploy mock replay`.                                                                                        |
| **Keploy: Refresh status**                                   | Reads the CLI's status again.                                                                                                                                                  |
| **Keploy: Stage keploy.yml, keploy.lock and the test edits** | Stages the setup's files in Source Control for you to review and commit.                                                                                                       |
| **Keploy: Wire CI**                                          | Writes `.github/workflows/keploy.yml` for Go/Node on GitHub Actions; for every other project or CI, offers the `keploy mock ci` recipe to hand to your agent or view and copy. |
| **Keploy: Invite teammates**                                 | Opens the Keploy app's Add User page.                                                                                                                                          |
| **Keploy: Record my running app**                            | Asks for the command that starts your app and runs `keploy record -c "<command>"` in a terminal.                                                                               |
| **Keploy: Replay my app's recording as tests**               | Runs `keploy test -c "<command>"` on the project's `keploy/test-set-<n>` sets in a terminal.                                                                                   |
| **Keploy: Install or update the CLI**                        | Installs the CLI, or updates it when it needs updating.                                                                                                                        |
| **Keploy: Choose the project folder**                        | Picks which project folder (with a `keploy.yml` containing a `mock` section) the extension works in for this workspace.                                                        |
| **Keploy: Show log**                                         | Opens the extension's log.                                                                                                                                                     |

## Related

- [Mock your tests](/docs/universal-mocker/mock-your-tests/) — the `keploy mock` commands your agent runs.
- [Keploy on macOS](/docs/installation/macos-installation/), [Linux](/docs/installation/linux-installation/) and [Windows](/docs/installation/windows-installation/) — installing the CLI yourself, and what each platform supports.
- [Keploy's PR Agent](/docs/running-keploy/utg-pr-agent/) — Keploy's unit test generator, on your pull requests.
