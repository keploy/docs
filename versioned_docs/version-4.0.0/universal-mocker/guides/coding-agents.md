---
id: coding-agents
title: Use the Universal Mocker with a coding agent
sidebar_label: Coding agents
description: Install Keploy's mocking skill for Claude Code, Cursor, Codex, GitHub Copilot or Antigravity, then let your agent record and replay your tests' dependency calls by following the NEXT block each keploy mock command prints. Every output is from Keploy 3.9.4.
tags:
  - mocks
  - ai agents
  - skill
keywords:
  - keploy skill install
  - keploy mock status
  - coding agent
  - claude code
  - cursor
  - github copilot
  - codex
  - NEXT block
  - service virtualization
---

# Use the Universal Mocker with a coding agent

Keploy's **mocking skill** teaches your coding agent how to set up and keep up
Keploy mocking for your tests. With it, you can ask your agent to "set up
Keploy mocking for this project's tests", and it records and replays your
tests' dependency calls step by step.

The agent drives the Keploy CLI. Each `keploy mock` command prints a
**NEXT block**: where things stand, a question for you, and the command to run
next. The skill tells the agent to follow those blocks, so you don't have to
remember the commands. The skill doesn't use Keploy's MCP server: everything it
needs comes from the CLI.

The skill works with Claude Code, Cursor, Codex, GitHub Copilot and
Antigravity.

:::tip Using VS Code?

The [Keploy VS Code extension](../walkthroughs/vscode.md#step-4-hand-the-setup-to-your-coding-agent)
installs the skill and hands the setup to your agent for you: Claude Code
(either its VS Code extension's chat or the `claude` CLI in an integrated
terminal), GitHub Copilot, or Cursor's agent. When both the Claude Code
extension and the `claude` CLI are installed, it asks once whether to use
**Claude Code (chat)** or **Claude Code (terminal)** and remembers the choice
for the workspace; with no Claude Code installed, it asks once per workspace
and never silently hands a Claude Code user off to GitHub Copilot. Read on to
do the same from a terminal, or to see what the agent does.

:::

Every output here is from Keploy 3.9.4 on Linux, in a Go repository at
`/home/you/shop`. The output is trimmed: timestamps and long lines are cut
(`…`).

## Step 1: Install the skill into your repository

1. [Install Keploy](../../server/installation.md), if you haven't.
2. In your repository's root, install the skill for your agent:

   ```bash
   keploy skill install mock --agent claude-code --project
   ```

   Output:

   ```text
   ✓ installed "mock" skill for claude-code → /home/you/shop/.claude/skills/keploy-mocking/SKILL.md
   ```

   For another agent, change `--agent`. To install for several agents at
   once, list them with commas: `--agent cursor,codex,github-copilot`.
   `--all` installs for every supported agent.

3. Commit the skill file, so everyone who clones the repository gets it.

Each agent reads the skill from its own place:

| Agent (`--agent`)                 | File in your repository                               |
| --------------------------------- | ----------------------------------------------------- |
| Claude Code (`claude-code`)       | `.claude/skills/keploy-mocking/SKILL.md`              |
| Cursor (`cursor`)                 | `.cursor/rules/keploy-mocking.mdc`                    |
| Codex (`codex`)                   | `.agents/skills/keploy-mocking/SKILL.md`              |
| Antigravity (`antigravity`)       | `.agents/skills/keploy-mocking/SKILL.md`              |
| GitHub Copilot (`github-copilot`) | `.github/instructions/keploy-mocking.instructions.md` |

To see what an install would write without writing anything, add `--dry-run`:

```bash
keploy skill install mock --agent claude-code --project --dry-run
```

```text
[dry-run] would install "mock" skill for claude-code → /home/you/shop/.claude/skills/keploy-mocking/SKILL.md (new file)
```

`keploy skill list` lists the skills and agents. The `mock` skill is the one
for the Universal Mocker.

### Install it for every repository instead

Without `--project`, the skill goes to your home directory, and your agent
reads it in every repository:

| Agent          | File in your home directory                       |
| -------------- | ------------------------------------------------- |
| Claude Code    | `~/.claude/skills/keploy-mocking/SKILL.md`        |
| Cursor         | `~/.cursor/skills/keploy-mocking/SKILL.md`        |
| Codex          | `~/.agents/skills/keploy-mocking/SKILL.md`        |
| Antigravity    | `~/.gemini/config/skills/keploy-mocking/SKILL.md` |
| GitHub Copilot | `~/.copilot/skills/keploy-mocking/SKILL.md`       |

The home directory's copy starts with a check: the skill applies only in a
repository that uses Keploy (one with a `keploy.yml`, a `keploy/` folder or a
project copy of a Keploy skill), or when you ask for Keploy by name. Elsewhere
the agent ignores it.

### Keep the skill up to date

After you update Keploy, run the same install command again. It replaces the
skill file with the one your Keploy version ships, so don't edit the file by
hand: an install overwrites your edits.

## Step 2: Ask your agent to set it up

1. Start the dependencies your tests talk to, such as your database
   (`docker compose up -d`). The agent records against them.
2. Ask your agent, for example:

   ```text
   Set up Keploy dependency mocking for this project's tests.
   ```

The skill tells the agent to start with `keploy mock status`, run from the
repository's root. In a repository with no recording yet, it prints:

```text
=== KEPLOY NEXT ===
phase:    uninitialized
summary:  Keploy is not recording this repo's dependency calls yet.
caveats:
  - keploy.yml has no mock.appId, so no recording is in the Keploy cloud. To publish one, record on a branch other than main with `keploy mock record --app <name>`, or run `keploy app create` first.
ask:      Want me to set up Keploy mocking? I'll record the real calls your tests make to databases and APIs once, then prove the whole suite passes with every one of them switched off.
do:       Find the command that runs this project's test suite first (package.json scripts.test, `go test ./...`, `pytest`, `mvn test`), and use it exactly in the commands below. Set it up end to end: … (3) record: keploy mock record --local -c '<your test command>' … (4) stop the dependencies and prove it: keploy mock replay --local -c '<your test command>' --on-miss fail; … (6) run `keploy mock status` and follow the NEXT block to wire CI. Commit keploy.yml and keploy/ (keep keploy/.gitignore as the CLI wrote it).
options:
  - record the test suite's dependency calls
  - stop
protocol: This output uses a NEXT block. Relay `ask` to the dev verbatim and wait; run `run` on yes; loop until phase=verified_green (or ci_wired once CI replays every recording). Never edit a recording to make a failing test pass.
===================
```

3. Your agent asks you the block's question (`ask`). Answer it.
4. On yes, the agent does what `do` says and runs the block's `run` command,
   when it has one. Then it runs `keploy mock status` again for the next block. It loops until the
   phase is `verified_green`, or `ci_wired` once CI replays the recordings.

## Read a NEXT block

| Field      | What it holds                                                              |
| ---------- | -------------------------------------------------------------------------- |
| `phase`    | Where the setup stands. See the phases below.                              |
| `summary`  | One line on the state, such as how many recordings pass offline.           |
| `caveats`  | Things to know before you call it done, such as no Keploy app yet.         |
| `ask`      | The question the agent relays to you, word for word, before it goes on.    |
| `run`      | The command the agent runs when you say yes.                               |
| `do`       | What the agent must do around that command, such as stop the dependencies. |
| `options`  | The other sensible next steps.                                             |
| `protocol` | The rules the agent follows for every block.                               |

The phases, in order:

| `phase`          | Meaning                                                                                                                                                                                         |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `uninitialized`  | No recording yet.                                                                                                                                                                               |
| `recorded`       | A recording exists, but no replay has shown it passes with the dependencies off.                                                                                                                |
| `verified_red`   | The last replay failed. The `summary` says why: the tests failed, the replay couldn't run, the replay wrote no coverage report for the coverage floor you set, or coverage is under that floor. |
| `verified_green` | Every recording passes with the dependencies off.                                                                                                                                               |
| `ci_wired`       | CI replays every recording.                                                                                                                                                                     |

Only a `verified_red` whose tests failed points at your code. The other three
reasons are about the run.

`keploy mock status --json` prints the same block as one JSON object, plus the
state of every recording:

```json
{
  "flow": "mock",
  "phase": "uninitialized",
  "summary": "Keploy is not recording this repo's dependency calls yet.",
  "ask": "Want me to set up Keploy mocking? …",
  "agent_todo": "Find the command that runs this project's test suite first …",
  "caveats": ["keploy.yml has no mock.appId, so no recording is in the Keploy cloud. …"],
  "options": [{ "label": "record the test suite's dependency calls" }, { "label": "stop" }],
  "mock": {
    "sets": [],
    "cloud": { "state": "no_app", "tests": 0, "sets": 0 }
  },
  …
}
```

## Choose where the recording lives

The first time, your agent asks you where to keep the recording:

- **In the repository** (`--local`): the recording is committed with your
  code. You need no Keploy account, and CI needs no secret. This is what
  `keploy mock status` suggests for a repository with no recording yet.
- **In Keploy Cloud** (no `--local`): the recording goes to your Keploy
  account, and `keploy/.gitignore` keeps `mocks.yaml` out of git. CI replays
  without `--local` and needs a `KEPLOY_API_KEY` secret.

After that, the agent keeps each recording where it is: the `run` commands
in each block already carry the right flag.

## Sign in from your agent's shell

If a Keploy command needs your account, it exits with code 5 and the reason
`auth_required`. A plain `keploy login` waits for you at a terminal, which an
agent's shell doesn't have, so the skill tells the agent to sign in in two
parts:

1. The agent runs `keploy login --no-wait --json`. Its block names a page and a
   short code.
2. The agent shows you the page and the code. You open the page in your own
   browser, check the code, and approve. The agent never opens the page,
   types the code or asks for a password.
3. The agent runs `keploy login --finish --json` to collect the session.

[`keploy login`](../reference.md#keploy-login) lists both flags and the exit
codes. In CI nobody can approve a sign-in: the job uses a `KEPLOY_API_KEY`
secret.

## Check each test on its own

With `KEPLOY_PROVEN=1` in the environment your agent's commands run with,
every block names `KEPLOY_PROVEN=1` in its commands, and the agent records and
checks each test on its own. The first block then reads:

```text
=== KEPLOY NEXT ===
phase:    uninitialized
summary:  Keploy is not recording this repo's dependency calls yet.
caveats:
  - keploy.yml has no mock.appId, so no recording is in the Keploy cloud. To publish one, record on a branch other than main with `KEPLOY_PROVEN=1 keploy mock record --app <name>`, or run `keploy app create` first.
…
```

The VS Code extension's setup task tells your agent to run every `keploy`
command this way. See
[Prove each test offline](../mock-your-tests.md#proven) for what the per-test
checks need.

## What the skill tells your agent not to do

- Edit a recording (`mocks.yaml`) by hand to make a red replay green.
- Switch to `--on-miss passthrough` to make a red replay green. That lets
  calls reach the real services, so the replay no longer proves anything.
- Rewrite an expected value in a test to make a red test pass.
- Write a hand-made stub for a new test that talks to a dependency. It
  records the test instead.

When a replay fails with `no recorded mock matched an outgoing call`, your code
now makes a call the recording doesn't have. If you changed the code on
purpose, the agent re-records against the real dependencies, or adds just the
new calls with `--on-miss record` while they are up. If not, that call is the
regression, and the agent tells you.

## Related

- [Drive transforms and virtual services with coding agents](../../transforms/coding-agents.md):
  use `KEPLOY NEXT` blocks, `--json`, and embedded schemas to configure Replay
  Transforms and operate standalone Virtual Services.
- [VS Code walkthrough](../walkthroughs/vscode.md): the extension installs the
  skill and hands the setup to your agent.
- [Mock your tests](../mock-your-tests.md): the commands the agent runs, in
  full.
- [Troubleshooting](../troubleshooting.md): what each failure means and how to
  fix it.
- [Reference](../reference.md): every `keploy mock` command and flag.
