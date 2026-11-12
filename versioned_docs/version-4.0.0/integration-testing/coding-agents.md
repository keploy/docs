---
id: coding-agents
title: Use with coding agents
description: Let Claude Code, Cursor, Codex or another coding agent connect a cluster, triage a failed pull request, accept intended changes and review Keploy branches.
keywords:
  - keploy mcp
  - claude code
  - cursor
  - codex
  - ai agent
---

Every Keploy command an agent needs prints a **NEXT** block: what happened, and the exact command to run next. The `keploy k8s`, `status`, `triage`, `accept` and `review` commands also answer in JSON with `--json`. A coding agent can therefore run the whole loop from a single instruction. It asks you only the questions it can't answer from the code: whether a changed response is intended.

## Set up your agent

```bash
keploy skill install       # Keploy's skills, for every agent found on this machine
keploy mcp-install --all   # Keploy's MCP server, for every agent found on this machine
```

- `keploy skill install` supports Claude Code, Cursor, Codex, Antigravity and GitHub Copilot. Use `--agent claude-code,cursor` to pick agents, and `--project` to install into the current repository instead of your home directory.
- `keploy mcp-install` creates a personal access token and writes it into each agent's MCP config. Use `--editor <name>` for one agent. GitHub Copilot isn't detected automatically; wire it with `--editor github-copilot`.

## Prompts that work

| You want to                | Tell your agent                                            |
| -------------------------- | ---------------------------------------------------------- |
| Set Keploy up on a cluster | _"Install Keploy and run `keploy k8s setup`."_             |
| Fix a failed pull request  | _"The Keploy check failed on my PR. Can you sort it out?"_ |
| Review a branch            | _"Review the Keploy branches waiting on me."_              |

## What the agent does with a failed pull request

1. Runs `keploy cloud status` to find the pull request's run and branch.
2. Runs `keploy cloud triage`. It reads each failure group's question, compares the failing responses with your diff, and asks you which changes are intended.
3. For a regression, it fixes the code and pushes.
4. For an intended change, it records your answer and runs `keploy cloud accept --reviewer <someone>`, which deletes the outdated tests and requests that person's review.
5. If you change your mind, it runs `keploy cloud restore-test`.

A reviewer's agent runs `keploy cloud review list`, then `review diff`, explains the diff, and approves only when the reviewer says so.

:::caution Agents never edit tests
If an agent proposes editing a recorded test or mock to make a pull request pass, stop it. Accepting a change means deleting the outdated test through review; the next recording captures the new behaviour.
:::

## Related

- [Review test changes](/integration-testing/review-test-changes/), the same flow by hand
- [`keploy cloud` reference](/integration-testing/cli-keploy-cloud/)
