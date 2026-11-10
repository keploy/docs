---
id: troubleshooting
title: Troubleshooting
description: Fixes for the problems people hit most with Keploy integration testing — cluster connection, recording, CI replay, approvals and Keploy branches — plus where to see why a test failed, and debug bundles.
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

**A test fails in auto-replay every time.** It's marked as failed and left out of pull-request runs. Common causes are a call to a dependency that wasn't captured, and clock-dependent responses when time isn't frozen: recordings started with `keploy k8s record start` auto-replay with the real clock (see [Concepts: time freezing](/integration-testing/concepts/#time-freezing)). Start the recording from the Console to freeze it.

## CI replay

**`failed to list self-hosted apps … 404`, or a message that the cluster is most likely SaaS.** `KEPLOY_K8S_PROXY_URL` is set, but the cluster is on Keploy Cloud. Unset it, or set `KEPLOY_K8S_PROXY_AUTH=false`.

**The step waits, then fails at the approval timeout.** The tests pass on the pull request's Keploy branch, but nobody has approved it yet. Ask for a review (`keploy cloud review request`), or raise `--approval-timeout`. `keploy cloud status` shows who it's waiting on.

**Approved branches never merge into main.** Check that the push-to-main job runs `keploy cloud replay` without `--no-branch-catchup`, and that the branch is approved: catch-up merges approved branches only. A branch approved after its pull request merged is merged by the next push-to-main run. If it warns that the history is too shallow, check out with full history (`fetch-depth: 0` on GitHub Actions, `GIT_DEPTH: 0` on GitLab).

**The step fails because the branch is behind main.** Another pull request changed main's tests. Run `keploy cloud branch-rebase` on the branch, or pass `--allow-stale-branch` to report it without failing.

**Self-signed certificate errors on a self-hosted proxy.** Set `KEPLOY_TLS_SKIP_VERIFY=true` in the job.

## Find out why a test failed

- **Auto-Replay History**, on the deployment, lists each recording's auto-replays with how many tests passed and failed. Expand a recording to see its runs.
- The app's **Recordings** page shows, per release, how many tests were accepted, how many are bugs and how many couldn't be replayed. Open a test to see its request, the recorded and replayed responses, and its mocks.
- A failed test explains itself under **Why did this test fail?**, or **Why is this test unreplayable?**: which response fields differed, or why Keploy couldn't replay it.
- The cluster's **Logs** tab shows recording, replay and k8s-proxy logs, for problems with a recording or the cluster rather than one test.

### Reproduce a failure on your machine

On a failed test, click **Download Failure Snapshot**, then **Copy debug command**. The command downloads the failing tests, the mocks they matched and the mocks around them:

```bash
keploy debug failures --app shop.orders --cluster <cluster-name> \
  --test-sets "<test-set-id>:<test-name>" --out ./keploy-failures
```

Pass a bare test set ID to download every failing test in it.

## Debug bundles

A debug bundle holds what Keploy support needs to look into a failure: a snapshot of the mocks and the app's logs for the failed tests.

- **From an auto-replay.** In **Auto-Replay History**, a run with failed tests offers **Download debug bundle**.
- **From the Recordings page.** A test set with bundles shows a bug icon (**View debug bundles**). A recording's ⋮ menu has **Download debug bundles** when one of its test sets has a bundle. Bundles that belong to no test set are listed under **Debug bundles without a test set**.
- **From a failed test.** Its **Why did this test fail?** panel has a **Debug Bundle** button.
- **On every auto-replay.** When you start a recording, turn on **Debug Bundle** under **Advanced settings** in the **Record config** step to build one each auto-replay interval. On a self-hosted cluster the bundles stay in your cluster; otherwise they're sent to Keploy support.
- **From CI.** Every `keploy cloud replay` run captures a debug-level log and uploads a bundle when it exits. Turn that off with `--disable-debug-bundle`.

To hand a bundle to Keploy, open it and click **Share with Keploy** (you need write access), or send support its bundle ID. A bundle still being built can't be downloaded yet, and old bundles expire and are cleaned up.

## More

- [Common errors](/keploy-explained/common-errors/)
- [Integration testing FAQ](/keploy-explained/integration-testing-faq/)
- Still stuck? Ask on [Slack](https://keploy.io/slack).
