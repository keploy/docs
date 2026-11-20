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

Each step names what you select and what the extension shows. The steps are
from version 3.1.1 of the extension. For every setting and command, see the
[VS Code extension page](/docs/running-keploy/utg-vscode-extension/).

:::note Screenshots are on their way

The boxes marked **Screenshot coming** stand where each screenshot goes. Until
they're added, each box says what the screen shows.

:::

## Before you begin

You need:

- VS Code 1.125 or later, on Linux (x86-64 or arm64) or on a Mac with Apple
  silicon. The [requirements](/docs/running-keploy/utg-vscode-extension/#requirements)
  list the Linux versions that work. Windows support in the extension is
  coming.
- Claude Code or GitHub Copilot in VS Code, or Cursor's agent in Cursor.
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
step that isn't done runs the command that does it when you select it.

:::note Screenshot coming

The **Set up** checklist, just after the install: **Downloading the Keploy
CLI** turns at the top, and the steps below it are not done yet.

:::

The extension also adds a guided tour to VS Code. To open it, run **Welcome:
Open Walkthrough** from the Command Palette and choose **Get started with
Keploy**.

## Step 2: Let the extension download the Keploy CLI

The download starts by itself when the extension is installed. You don't have
to do anything.

- A notification, **Keploy: downloading the CLI (_version_)**, shows how much
  has arrived, such as _120.4 MB of 301.2 MB_. To stop it, select **Cancel**.
- The status bar shows **Keploy: CLI** and the percentage.
- The CLI goes into `~/.keploy/bin`, and the extension checks it against
  Keploy's published checksum before it installs it. No step needs `sudo`.

When the download ends, the checklist ticks **Keploy CLI installed**.

:::note Screenshot coming

The download notification with its progress and its **Cancel** button, and the
**Downloading the Keploy CLI** row in the checklist.

:::

If you cancelled, run **Keploy: Install or update the CLI** to start the
download again.

## Step 3: Sign in

1. In the checklist, select **Signed in to Keploy**. Or run **Keploy: Sign
   in** from the Command Palette.

   Your browser opens Keploy's sign-in page. In VS Code, a **Keploy sign-in**
   notification shows the page's address and a code.

2. In your browser, sign in, type the code the notification shows, and
   approve the sign-in. The page never fills the code in for you: typing it
   ties the approval to the sign-in VS Code started. Approve only a sign-in
   you started yourself.

   VS Code says **Keploy: you are signed in.** The checklist ticks **Signed in
   to Keploy**.

:::note Screenshot coming

Two images: the **Keploy sign-in** notification with its code, and the
browser's page with that code typed in. The account's email is blurred.

:::

The CLI stores the session, not the extension. Every `keploy` command reads
it, in VS Code's runs, in your terminal and in your agent's terminal.

## Step 4: Hand the setup to your coding agent

1. In the checklist, select **Project set up by your agent**.

   If VS Code asks whether you trust the folder, trust it: Keploy runs your
   project's own test command, so it needs a trusted workspace.

2. The extension installs Keploy's skill for this project, then opens your
   agent with the setup task. Claude Code is used when you have it,
   otherwise GitHub Copilot. In Cursor, the task goes to your clipboard:
   paste it into Cursor's agent chat.

   The task starts like this:

   ```text
   Set up Keploy dependency mocking for this project's tests, following the keploy mock skill (.claude/skills).
   ```

3. Let your agent work. It follows each step the CLI prints, starting with
   `KEPLOY_PROVEN=1 keploy mock status --json`:

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

To choose the agent yourself, run **Keploy: Hand the setup to another agent**.

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

3. The record runs `keploy mock record --lock keploy.lock` in a VS Code
   terminal, with `KEPLOY_PROVEN=1`. When it ends, the terminal shows its last
   line, and the checklist ticks its record step.

:::note Screenshot coming

The work-branch message with its **Create keploy/_name_ and record** button,
then the record's terminal at its last line.

:::

The record uploads the recording to Keploy Cloud and pins it in
`keploy.lock`. The [keploy.yml and keploy.lock guide](../guides/keploy-yml-and-lock.md)
explains the lock.

## Step 6: Replay with the dependencies off

1. Stop your dependencies, such as the database and the API your tests call.
2. Run **Keploy: Replay** from the Command Palette, or select **Replay
   green** in the checklist while it isn't ticked.

   The replay runs `keploy mock replay` in a terminal, with `KEPLOY_PROVEN=1`.
   It reads `keploy.lock` and answers every call your tests make from the
   recording.

3. When the replay exits 0 and no test failed, the checklist ticks **Replay
   green**. Only a replay you start in VS Code ticks it: a replay in your
   agent's terminal doesn't.

Open VS Code's **Testing** view to see the result. **Keploy (mocked)** lists
each recording set, and **Keploy Cloud: _n_ tests** for a recording held in
Keploy Cloud. You can record and replay from there too.

:::note Screenshot coming

The **Testing** view with **Keploy (mocked)** green, the checklist with
**Replay green** ticked, and the replay's terminal ending with `VERDICT
passed`.

:::

## Step 7: See a red test

1. Change one test so it fails, for example by changing the value it expects.
2. Run **Keploy: Replay** again.

The replay fails, and VS Code shows it in three places:

- **Testing view:** the run is red, and each red test is listed with the CLI's
  reason after **red:**.
- **Test Results view:** the failed item's message ends with the `FAILED` and
  `VERDICT` lines the replay printed. `FAILED` names the test that failed.
- **The replay's terminal:** your test's own failure message says what
  differed, such as the value it got and the value it wanted.

The extension shows no diff view of its own. The difference is in your test's
failure message, as when you run the tests without Keploy.

A test can also fail because it makes a call the recording doesn't have. Then
the terminal names that call and says what to do, as
[Step 5 of the Go quickstart](../quickstarts/go.md#step-5-add-a-test-and-see-a-call-with-no-recording)
shows.

:::note Screenshot coming

The **Testing** view with the red test and its reason, and the **Test
Results** view with the `FAILED` and `VERDICT` lines.

:::

Change the test back, and replay again to see it green.

## Step 8: Stage the files to commit

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

:::note Screenshot coming

The **Stage for commit** list with its picked files, then Source Control with
the staged files and the commit message.

:::

## Step 9: Replay in CI

For a Go or Node project in a GitHub repository:

1. In the checklist, select **CI replays keploy.lock (GitHub Actions)**.

   The extension writes `.github/workflows/keploy.yml`. It never writes over a
   file that is already there. On every pull request and every push to main,
   the workflow runs `keploy mock replay --lock keploy.lock --on-miss fail`
   with `KEPLOY_PROVEN=1`.

2. The workflow needs one repository secret, `KEPLOY_API_KEY`: a read-only CI
   key. Ask your Keploy admin for one. The notification's **Open the CI key
   page** button opens the page where the admin makes it.
3. Store the key as the repository's secret. Run this in a terminal, and paste
   the key when it asks:

   ```bash
   gh secret set KEPLOY_API_KEY
   ```

   The notification's **Copy the secret command** button copies this command.
   Selecting either button closes the notification.

4. Commit the workflow with `keploy.yml` and `keploy.lock`, and push.

:::note Screenshot coming

The new `.github/workflows/keploy.yml` open in the editor, with the
notification and its two buttons.

:::

For any other project or CI, the extension writes no workflow and says so. The
[Other CI systems](../guides/ci.md#other-ci-systems) section shows the replay step to add
yourself.

## Step 10: Invite your team

Select **Teammates invited** in the checklist. The Keploy app's **Add User**
page opens, where an admin adds your teammates.

A teammate who clones the repository signs in and replays. The replay reads the
committed `keploy.yml` and `keploy.lock`, and downloads the recordings the lock
pins.

## Next steps

- [The VS Code extension](/docs/running-keploy/utg-vscode-extension/): every
  command, setting and platform note, and troubleshooting.
- [Go quickstart](../quickstarts/go.md): the same record and replay in a
  terminal, with the real output of each step.
- [Partial re-record](../guides/partial-re-record.md): re-record one changed
  test without running the whole suite again.
- [Troubleshooting](../troubleshooting.md): what a failing record or replay
  prints, and how to fix it.
