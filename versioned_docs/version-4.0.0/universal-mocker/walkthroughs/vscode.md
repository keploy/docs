---
id: vscode
title: "Walkthrough: set up the Universal Mocker in VS Code"
sidebar_label: VS Code
description: A step-by-step tour of the Keploy VS Code extension, from installing it to a green replay of your tests with their dependencies switched off, a red test, the staged files and the CI workflow.
tags:
  - universal mocker
  - service virtualization
  - vscode
  - walkthrough
keywords:
  - keploy vs code extension
  - vscode mocks
  - service virtualization vscode
  - record and replay vscode
  - ai coding agents
---

# Walkthrough: set up the Universal Mocker in VS Code

This walkthrough takes one project through the Keploy VS Code extension, from
installing it to a green replay of your tests with their dependencies switched
off. You also see a red test, stage the files to commit, and add the CI
workflow.

Each step names what you select and what the extension shows. The screenshots
are from version 3.1.1 of the extension, with Keploy 3.9.4; the steps cover
extension 3.1.5 and the optional checklist steps added in 3.1.8. For every
setting and command, see the
[VS Code extension page](/docs/running-keploy/utg-vscode-extension/).

:::note Two screenshots are on their way

The screenshots are from a real run of the extension on Linux. Two boxes
marked **Screenshot coming** stand where two more go: the browser's sign-in
page and your agent's chat. Each box says what the screen shows.

:::

## Before you begin

You need:

- VS Code 1.125 or later, on Linux (x86-64 or arm64) or on a Mac with Apple
  silicon. The [requirements](/docs/running-keploy/utg-vscode-extension/#requirements)
  list the Linux versions that work. Windows support in the extension is
  coming.
- Claude Code (its VS Code extension or the `claude` CLI) or GitHub Copilot in
  VS Code, or Cursor's agent in Cursor.
- A project in a Git repository, with tests that call a database or an API.
  To follow along with a sample, create the package from
  [Step 1 of the Go quickstart](../quickstarts/go.md#step-1-create-the-sample-package),
  commit it, and start its dependencies as its Step 2 shows.
- A free Keploy account. You sign in from the extension in Step 3.

## Step 1: Install the extension

1. In VS Code, open the **Extensions** view.
2. Search for **Keploy**.
3. Select **Install** on **Keploy: API Testing, Mocks & Service
   Virtualization**. Its ID is `keploy.keployio`.
4. Select the **Keploy** icon in the Activity Bar.

The **Set up** checklist opens. It lists each step of this walkthrough, and a
step that isn't done runs the command that does it when you select it. In
extension 3.1.8 and later, five steps — **Keploy CLI installed**, **Signed in
to Keploy**, **Project set up by your agent**, **Tests recorded**, and **Replay
green** — are required and complete setup when all five are done. Three steps —
**keploy.yml, keploy.lock and the test edits staged**, **CI replays
keploy.lock**, and **Teammates invited** — are optional: each step that isn't
done shows an `Optional` label (or `optional, needs git` when VS Code's Git is
unavailable) and an inline **Skip optional setup step** action, and never
blocks setup completion; once skipped, it stays skipped for that workspace
(`Optional · skipped`; select it, use its inline **Restore skipped setup step**
action, or use the checklist toolbar's **Show skipped setup steps** button to
restore it).

<img src="/docs/img/universal-mocker/vscode/01-checklist-download.png" alt="The Keploy Set Up checklist just after the install: Downloading the Keploy CLI turns at the top, and the steps below it are not done yet" width="100%" />

The extension also adds a guided tour to VS Code. To open it, run **Welcome:
Open Walkthrough** from the Command Palette and choose **Get started with
Keploy**.

## Step 2: Let the extension download the Keploy CLI

The download starts by itself when the extension is installed. You don't have
to do anything.

- A notification, **Keploy: downloading the CLI (_version_)**, shows how much
  has arrived, such as _125.6 MB of 125.6 MB_ when it ends. To stop it, select **Cancel**.
- The status bar shows **Keploy: CLI** and the percentage.
- The CLI goes into `~/.keploy/bin`, and the extension checks it against
  Keploy's published checksum before it installs it. No step needs `sudo`.

When the download ends, the checklist ticks **Keploy CLI installed**.

<img src="/docs/img/universal-mocker/vscode/02-download-notification.png" alt="The notification Keploy: downloading the CLI (3.9.4): 125.6 MB of 125.6 MB with its Cancel button, the Downloading the Keploy CLI row in the checklist, and Keploy: CLI 100% in the status bar" width="100%" />

If you cancelled, run **Keploy: Install or update the CLI** to start the
download again.

## Step 3: Sign in

1. In the checklist, select **Signed in to Keploy**. Or run **Keploy: Sign
   in** from the Command Palette.

2. VS Code asks **Do you want Code to open the external website?** for
   `https://app.keploy.io/activate`. Select **Open**.

   <img src="/docs/img/universal-mocker/vscode/03-signin-open.png" alt="VS Code asking whether to open https://app.keploy.io/activate, with Configure Trusted Domains, Copy, Cancel and Open buttons" width="452" />

   Your browser opens Keploy's sign-in page. In VS Code, a **Keploy sign-in**
   notification shows the page's address and a code:

   ```text
   Keploy sign-in: Open https://app.keploy.io/activate, enter the code XXXX-XXXX, and approve it. Tell me when it says you are signed in.
   ```

   The CLI writes this text for coding agents too, which is why it ends with
   "Tell me". In VS Code you don't need to do anything else: the notification
   waits for your approval.

   <img src="/docs/img/universal-mocker/vscode/03-signin-notification.png" alt="The Keploy sign-in notification with its code blurred and its Cancel button" width="455" />

3. In your browser, sign in, type the code the notification shows, and
   approve the sign-in. The page never fills the code in for you: typing it
   ties the approval to the sign-in VS Code started. Approve only a sign-in
   you started yourself.

   VS Code says **Keploy: you are signed in.** The checklist ticks **Signed in
   to Keploy**.

   If you don't approve in time, VS Code says **Keploy: the sign-in was not
   approved in your browser in time.** Select **Try again** for a new code.

:::note Screenshot coming

The browser's page with the code typed in. The account's email is blurred.

:::

The CLI stores the session, not the extension. Every `keploy` command reads
it, in VS Code's runs, in your terminal and in your agent's terminal.

## Step 4: Hand the setup to your coding agent

1. In the checklist, select **Project set up by your agent**.

   If VS Code asks whether you trust the folder, trust it: Keploy runs your
   project's own test command, so it needs a trusted workspace.

2. The extension installs Keploy's skill for this project, then hands the setup
   task to your coding agent:

   - **Claude Code** works through either its VS Code extension (**Claude Code
     (chat)**) or its CLI, the `claude` command (**Claude Code (terminal)**).
     When `claude` is installed (on your `PATH`, or where Claude Code's
     installer puts it), **Set up with my agent** opens an integrated terminal
     in your project (in bash, zsh, fish, or PowerShell) and runs `claude` with
     the setup task as its first message. If `claude`'s path cannot be safely
     passed to your shell, no terminal opens: Keploy names that path and puts
     the task on your clipboard.
   - When **both** the Claude Code VS Code extension and the `claude` CLI are
     installed, Keploy asks once: **Claude Code (chat)** or **Claude Code
     (terminal)**, and remembers your choice for the workspace.
   - A Claude Code user is never silently handed off to GitHub Copilot or
     another agent. With no Claude Code installed, Keploy asks once per
     workspace which agent gets the setup (before opening GitHub Copilot, and
     in Cursor before putting the task on your clipboard for Cursor's agent)
     and offers Claude Code there too, with the task on your clipboard. If a
     workspace previously picked Claude Code and neither its extension nor the
     `claude` CLI is found anymore, Keploy puts the task on your clipboard and
     tells you instead of switching agents.

   | Agent                  | Where the skill goes                                  | Where the task goes                                                                              |
   | ---------------------- | ----------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
   | Claude Code (chat)     | `.claude/skills`                                      | a new Claude Code conversation                                                                   |
   | Claude Code (terminal) | `.claude/skills`                                      | an integrated terminal in your project running `claude` with the setup task as its first message |
   | GitHub Copilot         | `.github/instructions/keploy-mocking.instructions.md` | the chat, in agent mode                                                                          |
   | Cursor's agent         | `.cursor/rules`                                       | your clipboard: paste it into the agent chat                                                     |

   The task starts like this, with Claude Code:

   ```text
   Set up Keploy dependency mocking for this project's tests, following the keploy mock skill (.claude/skills).
   ```

   If the agent doesn't open, VS Code says **Keploy: _agent_ did not open. The
   setup task is on your clipboard.** Paste it into your agent.

3. Send the task (with **Claude Code (terminal)**, `claude` starts with the
   task right away). Then let your agent work. It follows each step the CLI
   prints, starting with `KEPLOY_PROVEN=1 keploy mock status --json`:

   - it sets `mock.command` in `keploy.yml` to your test command;
   - it adds the test-side hook the skill names for your framework, such as
     `keploytest` for Go;
   - it records your tests, with your dependencies running:
     `KEPLOY_PROVEN=1 keploy mock record --lock keploy.lock`;
   - it replays them until the replay is green:
     `KEPLOY_PROVEN=1 keploy mock replay --lock keploy.lock`.

   On `main` or `master`, the agent first switches to a work branch named
   `keploy/<your folder's name>`. It asks you before any step that changes
   more than `keploy.yml`, `keploy.lock` and your test files.

:::note Screenshot coming

The agent's chat with the setup task, and the checklist beside it with
**Project set up by your agent** ticked.

:::

To change the workspace's remembered agent choice at any time, run **Keploy:
Hand the setup to another agent**.

## Step 5: Record from VS Code

Your agent has recorded once. You can record again yourself, for example after
you add a test. Your dependencies must be running.

1. Run **Keploy: Record** from the Command Palette.
2. If you're on `main` or `master`, the extension says:

   ```text
   Keploy records on a work branch, not on main: the default branch's recordings change only through merges, so CI replays what was reviewed.
   ```

   Select **Create keploy/_name_ and record** to create the branch, switch to
   it and record there. Nothing runs if you close the message.

   <img src="/docs/img/universal-mocker/vscode/06-record-branch.png" alt="On main, the message Keploy records on a work branch, not on main, with its Create keploy/docs-vscode-orders and record button" width="100%" />

3. The record runs `keploy mock record --lock keploy.lock` in a VS Code
   terminal, with `KEPLOY_PROVEN=1`. When it ends, the checklist says
   **Recorded: _n_ tests in Keploy Cloud**, and the terminal ends like this:

   ```text
   keploy: recorded from uncommitted changes in 2 file(s); the recording matches the code only once you commit them with keploy.lock
   keploy: commit keploy.lock with your change
   keploy: keploy.lock is not listed in Keploy Cloud: the pin of app <app id> is off, so its replays read Keploy branches, which a listed one could change; `KEPLOY_PROVEN=1 keploy mock pin on` turns it on, then `KEPLOY_PROVEN=1 keploy mock register` lists the lock
   keploy: committed keploy/docs-vscode-orders and its skip lines (pinned in keploy.lock): 2 replayable, 0 quarantined
   ```

   The first two lines ask you to commit `keploy.lock` with your changes,
   which Step 8 does. The third line shows while the app's recording pin is
   off: [Turn on the app's recording pin](../guides/keploy-yml-and-lock.md#turn-on-the-apps-recording-pin)
   explains it.

   <img src="/docs/img/universal-mocker/vscode/07-record-done.png" alt="The checklist saying Recorded: 2 tests in Keploy Cloud, and the record's terminal ending with its keploy lines; the app id is blurred" width="100%" />

The record uploads the recording to Keploy Cloud and pins it in
`keploy.lock`. The [keploy.yml and keploy.lock guide](../guides/keploy-yml-and-lock.md)
explains the lock. In an untrusted workspace — including one with several
project folders — **Keploy: Record** and **Keploy: Replay** refuse for
workspace trust before asking which folder to use.

## Step 6: Replay with the dependencies off

1. Stop your dependencies, such as the database and the API your tests call.
2. Run **Keploy: Replay** from the Command Palette, or select **Replay
   green** in the checklist while it isn't ticked.

   The replay runs `keploy mock replay` in a terminal, with `KEPLOY_PROVEN=1`.
   It reads `keploy.lock` and answers every call your tests make from the
   recording.

3. When the replay exits 0 and no test failed, its terminal ends with
   `VERDICT  passed`, and the checklist ticks **Replay green**. Only a replay
   you start in VS Code ticks it, from **Keploy: Replay** or the **Testing**
   view: a replay in your agent's terminal doesn't.

   <img src="/docs/img/universal-mocker/vscode/08-replay-green.png" alt="The checklist with Replay green ticked, and the replay's terminal ending with VERDICT passed; the report link is blurred" width="100%" />

You can also replay from VS Code's **Testing** view. A project whose
recordings are in Keploy Cloud shows one row there, **Keploy Cloud: _n_
tests**, which replays as **Keploy: Replay** does. Run **Test: Run All Tests**
from the Command Palette, or select the row's run button, and the row turns
green or red. The view shows only the runs you start in it, not a **Keploy:
Replay** from the Command Palette. Recordings kept on your machine with `--local` show one row per recording set
instead, with its tests under it. You can start another **Keploy: Record** or
**Keploy: Replay** as soon as the previous run ends in its terminal, even while
Keploy is still reading the project's status. If a later replay of the same set
starts before an earlier run finishes reading its status, the earlier run
reports that its result was replaced rather than showing the later run's
verdict.

<img src="/docs/img/universal-mocker/vscode/09-testing-green.png" alt="The Testing view with the row Keploy Cloud: 2 tests passed, 1/1 in 9.6 seconds" width="100%" />

## Step 7: See a red test

1. Change one test so it fails, for example by changing the value it expects.
   In the Go sample, change both `50`s in `TestTotalInUSD` to `51`.
2. Run **Keploy: Replay** again.

The replay fails, and VS Code shows it in these places:

- **The replay's terminal** ends with the result. `FAILED` names the test
  that failed, and `VERDICT` gives the exit code of your test command:

  ```text
  keploy: docs-vscode-orders: 2 test(s) ran: 1 passed, 1 failed (0 held by keploy), 0 skipped by the test; 0 quarantined (skipped by keploy)
  FAILED  .::TestTotalInUSD: the test failed
  MOCKED  .::TestTotalInUSD: [::1]:5432 (mocked: if this is your app, start it from the runner, then re-record)
  MOCKED  .::TestTotalInUSD: [::1]:8090 (mocked: if this is your app, start it from the runner, then re-record)
  MOCKED  .::TestTotalInEUR: [::1]:5432 (mocked: if this is your app, start it from the runner, then re-record)
  VERDICT  failed: the test command exited 1
  ```

  Your test's own failure message is above these lines, in your test
  command's output.

  <img src="/docs/img/universal-mocker/vscode/10-red-terminal.png" alt="The end of the red replay's terminal: FAILED .::TestTotalInUSD: the test failed, three MOCKED lines, and VERDICT failed: the test command exited 1" width="100%" />

- **The Testing view**, for a replay you run from it: the **Keploy Cloud**
  row turns red.
- **The Test Results view**, for the same run: select the red row to see its
  message. It ends with the `FAILED` and `VERDICT` lines:

  ```text
  keploy mock replay exited 1, and its report says a test failed: see its terminal.
  FAILED  .::TestTotalInUSD: the test failed
  VERDICT  failed: the test command exited 1
  ```

  <img src="/docs/img/universal-mocker/vscode/11-red-results.png" alt="The Testing view with the Keploy Cloud row red, and the Test Results view with the row's message and its FAILED and VERDICT lines" width="100%" />

The extension shows no diff view of its own. The difference is in your test's
failure message, as when you run the tests without Keploy.

A test can also fail because it makes a call the recording doesn't have. Then
the terminal names that call and says what to do, as
[Step 5 of the Go quickstart](../quickstarts/go.md#step-5-add-a-test-and-see-a-call-with-no-recording)
shows.

Change the test back, and replay again to see it green.

## Step 8: Stage the files to commit

In extension 3.1.8 and later, once **Replay green** is ticked, the five
required setup steps are done and setup counts as complete; this step is
optional.

1. In the checklist, select **keploy.yml, keploy.lock and the test edits
   staged**.
2. In the list that opens, check the files. `keploy.yml`, `keploy.lock` and
   the files that changed after your agent started are picked. Keploy's skill
   for the project is listed unpicked: pick it to share the setup with your
   team.
3. Select **OK**.

Source Control opens with the files staged. When its message box is empty,
the extension puts `test: record dependency mocks with Keploy` in it. Review
the changes, then commit. The extension never commits for you, and never changes `.gitignore`.

<img src="/docs/img/universal-mocker/vscode/12-stage-pick.png" alt="The Stage for commit list with keploy.lock and keploy.yml picked, and the project's Keploy instructions file listed unpicked" width="100%" />

<img src="/docs/img/universal-mocker/vscode/13-stage-scm.png" alt="Source Control with keploy.lock and keploy.yml staged and the message test: record dependency mocks with Keploy" width="100%" />

## Step 9: Replay in CI

In extension 3.1.8 and later, **CI replays keploy.lock** is optional — Keploy
still offers it as the recommended next step after **Replay green** without
blocking setup completion.

For a Go or Node project in a GitHub repository:

1. In the checklist, select **CI replays keploy.lock**.

   The extension writes `.github/workflows/keploy.yml`. It never writes over a
   file that is already there. On every pull request and every push to main,
   the workflow runs `keploy mock replay --lock keploy.lock --on-miss fail`
   with `KEPLOY_PROVEN=1`.

2. The workflow needs one repository secret, `KEPLOY_API_KEY`: a key with only
   MOCK_READER. Make it in the project's folder:

   ```bash
   keploy service-account key create --role MOCK_READER --to-gh-secret KEPLOY_API_KEY
   ```

   Keploy asks you to sign in again in the browser, then stores the key as the
   repository's secret: [Make a CI key](../guides/ci.md#step-1-make-a-ci-key).
   Only an admin of the app's company can approve the key, so if you are not
   one, ask an admin to run the command. The notification's **Copy the key
   command** button copies this command (requires Keploy CLI 3.9.13 or later;
   with an older or unreadable CLI, the notification omits **Copy the key
   command** and offers **Clear pin and update** or **Update CLI** beside
   **Open the CI key page**).

3. With a Keploy that has no `service-account` command, ask your Keploy admin
   for the key. The notification's **Open the CI key page** button opens the
   page where the admin makes it. Store the key as the repository's secret.
   Run this in a terminal, and paste the key when it asks:

   ```bash
   gh secret set KEPLOY_API_KEY
   ```

   Selecting either button closes the notification.

4. Commit the workflow with `keploy.yml` and `keploy.lock`, and push.

For any other project or CI, such as Python, Java or GitLab CI, the extension
writes no workflow. Its notification offers **Hand CI setup to** your coding
agent, which gives the agent Keploy's CI recipe for the project, and **Show me
the steps**, which opens the same recipe with a **Copy the steps** button. The
CI recipe action requires Keploy CLI 3.9.13 or later: with an older or
unreadable CLI, Wire CI does not open the recipe and instead offers **Clear pin
and update** (when `keploy.cli.version` pins an older version) or **Update
CLI**, while every other extension command keeps working on older pinned CLIs.
The [Other CI systems](../guides/ci.md#other-ci-systems) section shows the
recipe.
The checklist's **CI replays keploy.lock** row is done once a config of the CI
your repository runs, at the repository's root or in the project's folder, has
the recipe's `keploy mock replay ... --on-miss fail` step. For a project in a
folder below the root, a step at the root counts only when it names that
project: it runs in the project's folder (`working-directory`, `cd`, or
`--lock <folder>/keploy.lock`), or gives a unique `--name <its recording>`. A
step that names no project counts only for a `keploy.yml` at the repository's
root.

## Step 10: Invite your team

In extension 3.1.8 and later, **Teammates invited** is optional. Select
**Teammates invited** in the checklist. The Keploy app's **Add User** page
opens, where an admin adds your teammates.

A teammate who clones the repository signs in and replays. The replay reads the
committed `keploy.yml` and `keploy.lock`, and downloads the recordings the lock
pins.

## Next steps

- [The VS Code extension](/docs/running-keploy/utg-vscode-extension/): every
  command, setting and platform note, and troubleshooting.
- [VS Code quickstart](../quickstarts/vscode.md): record and replay a sample
  from the extension without a coding agent, with the real output of each
  step.
- [Go quickstart](../quickstarts/go.md): the same record and replay in a
  terminal, with the real output of each step.
- [Partial re-record](../guides/partial-re-record.md): re-record one changed
  test without running the whole suite again.
- [Troubleshooting](../troubleshooting.md): what a failing record or replay
  prints, and how to fix it.
