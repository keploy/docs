---
id: run-in-ci
title: Run on every pull request
sidebar_label: Run on every pull request
description: Add keploy cloud replay to GitHub Actions, GitLab CI or Jenkins so every pull request is checked against your recorded tests, and approved test changes merge with the pull request.
keywords:
  - keploy cloud replay
  - github actions
  - gitlab ci
  - jenkins
  - pull request check
---

One CI step checks every pull request against the app's recorded tests: `keploy cloud replay`. It runs the tests against the image your pipeline just built, with every dependency served from mocks. The runner needs Docker and nothing else: no database, no queue, no staging environment.

## What the step does

| When                                                     | What happens                                                                                                                                                                   |
| -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| A pull request's tests all pass                          | The step passes.                                                                                                                                                               |
| A pull request's tests fail                              | Keploy finds or creates the pull request's **Keploy branch** and fails the step. The output and the job summary show the run ID and the next command: `keploy cloud triage`.   |
| The branch has approved changes and the tests pass on it | The step passes.                                                                                                                                                               |
| The branch has changes still waiting for approval        | The step waits, up to `--approval-timeout` (30 minutes by default), and the pull request shows as pending. It passes as soon as a reviewer approves, and fails at the timeout. |
| A push to main                                           | Keploy merges the approved Keploy branches of the pull requests that push landed (catch-up), then replays main.                                                                |

## GitHub Actions

```yaml title=".github/workflows/keploy.yml"
name: keploy

on:
  pull_request:
    branches: [main]
  push:
    branches: [main]

concurrency:
  group: keploy-${{ github.ref }}
  cancel-in-progress: false

jobs:
  cloud-replay:
    runs-on: ubuntu-latest
    timeout-minutes: 40
    steps:
      - uses: actions/checkout@v4
        with:
          # The push run reads main's history to find the pull requests it lands.
          fetch-depth: 0

      - name: Build the app image
        run: docker build -t shop/orders:${{ github.sha }} .

      - name: Install Keploy
        run: source /dev/stdin <<<"$(curl -fsSL https://keploy.io/install.sh || echo 'echo Keploy installer download failed >&2; return 1')"

      - name: Keploy cloud replay
        env:
          KEPLOY_API_KEY: ${{ secrets.KEPLOY_API_KEY }}
          # Self-hosted clusters only; leave these repository variables unset for Keploy Cloud.
          KEPLOY_K8S_PROXY_URL: ${{ vars.KEPLOY_K8S_PROXY_URL }}
        run: |
          keploy cloud replay \
            --app shop.orders \
            --cluster prod-east \
            --image shop/orders:${{ github.sha }}
```

1. Create an API key in the Console (**Settings → API Keys**) and add it as the repository secret `KEPLOY_API_KEY`.
2. Use a key that belongs to a person or a CI user that may merge branches, but isn't an org admin. An admin key merges without review, and the CLI warns about that.
3. Keep `fetch-depth: 0`. The push to main reads the history to find the pull requests it lands. Keploy deepens a shallow clone itself, but full history avoids the extra fetch and the warning when it can't reach far enough.
4. Leave `cancel-in-progress: false`, so a waiting approval isn't cancelled by the next push.

## GitLab CI

```yaml title=".gitlab-ci.yml"
keploy:
  # A Linux runner with the shell executor and Docker installed.
  tags: [linux-docker]
  variables:
    GIT_DEPTH: 0
  rules:
    - if: $CI_PIPELINE_SOURCE == "merge_request_event"
    - if: $CI_COMMIT_BRANCH == $CI_DEFAULT_BRANCH
  script:
    - docker build -t shop/orders:$CI_COMMIT_SHA .
    - source /dev/stdin <<<"$(curl -fsSL https://keploy.io/install.sh)"
    - keploy cloud replay --app shop.orders --cluster prod-east --image shop/orders:$CI_COMMIT_SHA
```

Set `KEPLOY_API_KEY` as a masked CI/CD variable (**Settings → CI/CD → Variables**). The runner's shell must be bash for the install line.

## Jenkins

```groovy title="Jenkinsfile"
pipeline {
  agent any
  environment {
    KEPLOY_API_KEY = credentials('keploy-api-key')
  }
  stages {
    stage('Keploy') {
      steps {
        sh 'docker build -t shop/orders:$GIT_COMMIT .'
        sh '''bash -c 'source /dev/stdin <<<"$(curl -fsSL https://keploy.io/install.sh)"
          keploy cloud replay --app shop.orders --cluster prod-east --image shop/orders:$GIT_COMMIT' '''
      }
    }
  }
}
```

Store the key as a **Secret text** credential, and run the job on an agent with Docker. If the pipeline can't detect the pull request on its own, pass it in with the `--ci-*` overrides (`--ci-pr-number`, `--ci-repository`, `--ci-commit-sha`, `--ci-pr-source-branch`, `--ci-pr-target-branch`).

## Self-hosted clusters

Set `KEPLOY_K8S_PROXY_URL` to the proxy's ingress URL. The CLI then authenticates through the cluster's proxy and never needs to reach Keploy Cloud. If the proxy's certificate is self-signed, also set `KEPLOY_TLS_SKIP_VERIFY=true`.

For a Keploy Cloud cluster, leave `KEPLOY_K8S_PROXY_URL` unset. If it's set, the replay fails and tells you to turn the mode off with `KEPLOY_K8S_PROXY_AUTH=false`.

## Flags you'll reach for

| Flag                  | What it does                                                                                                             |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `--image`             | The image to test. Defaults to the image in the deployment's manifest.                                                   |
| `--approval-timeout`  | How long a passing run waits for its branch's approval (default `30m`). `KEPLOY_APPROVAL_TIMEOUT` sets it for every run. |
| `--require-approval`  | Fail at once instead of waiting when the branch isn't approved.                                                          |
| `--no-auto-branch`    | Replay on main only; never create or use a pull request branch.                                                          |
| `--no-branch-catchup` | On a push to main, don't merge landed pull requests' branches.                                                           |
| `--base-branch`       | The branch pull requests merge into (default `main`).                                                                    |
| `--test-sets`         | Replay only these Test sets.                                                                                             |

Every flag is listed in the [`keploy cloud` reference](/integration-testing/cli-keploy-cloud/#keploy-cloud-replay).

## Next

When the step fails, see [Review test changes](/integration-testing/review-test-changes/).
