---
id: troubleshooting
title: Troubleshooting
description: Fixes for the problems people hit most with Keploy integration testing — cluster connection, recording, CI replay, approvals and Keploy branches.
keywords:
  - keploy troubleshooting
  - cloud replay errors
  - k8s-proxy
---

Start with the status command for where you are. Both print what is wrong and the next command to run.

```bash
keploy k8s status --app <namespace>.<deployment>   # cluster, recording, auto-replay
keploy cloud status                                # a pull request's run, branch and review
```

## Cluster and recording

**The cluster never shows as connected.** The proxy's heartbeat isn't reaching Keploy. Check `kubectl get pods -n keploy` and the proxy's logs. On Keploy Cloud, the cluster needs outbound HTTPS to `api.keploy.io`. If it has no inbound route, also turn on `keploy.tunnel.enabled=true`.

**`record start` won't start without `--confirm`.** That's intended: starting a recording recreates the deployment's pods once. Re-run it with `--confirm` when a restart is acceptable.

**Recording shows no tests.** Make sure the deployment is getting traffic while the recording runs, and that [recording filters](/running-keploy/recording-filters/) don't exclude it. If the app reads or writes through paths eBPF can't see, see [Fix "could not record an app's bytes"](/running-keploy/capture-loss/).

**A test fails in auto-replay every time.** It's marked as failed and left out of pull-request runs. Common causes are clock-dependent responses ([time freezing](/keploy-cloud/time-freezing/)) and calls to a dependency that wasn't captured.

## CI replay

**`failed to list self-hosted apps … 404`, or a message that the cluster is most likely SaaS.** `KEPLOY_K8S_PROXY_URL` is set, but the cluster is on Keploy Cloud. Unset it, or set `KEPLOY_K8S_PROXY_AUTH=false`.

**The step waits, then fails at the approval timeout.** The tests pass on the pull request's Keploy branch, but nobody has approved it yet. Ask for a review (`keploy cloud review request`), or raise `--approval-timeout`. `keploy cloud status` shows who it's waiting on.

**Approved branches never merge into main.** Check that the push-to-main job runs `keploy cloud replay` without `--no-branch-catchup`, and that the branch is approved: catch-up merges approved branches only. A branch approved after its pull request merged is merged by the next push-to-main run. If it warns that the history is too shallow, check out with full history (`fetch-depth: 0` on GitHub Actions, `GIT_DEPTH: 0` on GitLab).

**The step fails because the branch is behind main.** Another pull request changed main's tests. Run `keploy cloud branch-rebase` on the branch, or pass `--allow-stale-branch` to report it without failing.

**Self-signed certificate errors on a self-hosted proxy.** Set `KEPLOY_TLS_SKIP_VERIFY=true` in the job.

## More

- [Common errors](/keploy-explained/common-errors/)
- [Integration testing FAQ](/keploy-explained/integration-testing-faq/)
- Still stuck? Ask on [Slack](https://keploy.io/slack).
