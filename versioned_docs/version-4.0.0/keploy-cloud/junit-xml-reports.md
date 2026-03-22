---
id: junit-xml-reports
title: JUnit XML Reports
description: Export Keploy test results as JUnit XML for CI dashboards and trend tracking
sidebar_label: JUnit XML Reports
keywords:
  - junit
  - junit xml
  - test reports
  - ci testing
  - ci/cd
  - github actions
  - jenkins
  - gitlab
  - test results
tags:
  - junit
  - ci
  - reports
---

import ProductTier from '@site/src/components/ProductTier';

<ProductTier tiers="Open Source, Enterprise" offerings="Self-Hosted, Dedicated" />

Keploy supports exporting test results as standard JUnit XML. Use `--format junit` flag on the `keploy report` command — CI systems parse the output natively, no plugins or custom parsers needed.
Supported CI systems: GitHub Actions, GitLab CI, Jenkins, CircleCI, Azure DevOps.

## Usage

```bash
keploy test -c "<CMD_TO_RUN_APP>" --delay 10
keploy report --format junit > test-results.xml
```

To scope the report to specific test-sets:

```bash
keploy report --format junit --test-sets "test-set-1"
```

The default format remains `text` — existing workflows are unaffected.

## Output Structure

| Keploy Concept | JUnit XML Element |
|---|---|
| Test-set | `<testsuite>` |
| Test case | `<testcase>` |
| Failed test | `<failure>` with diff summary |
| Obsolete test | `<skipped>` |

```xml
<?xml version="1.0" encoding="UTF-8"?>
<testsuites tests="5" failures="1" time="2.300">
  <testsuite name="test-set-1" tests="3" failures="1" skipped="0" time="1.500">
    <testcase name="tc-1" classname="test-set-1" time="0.500"></testcase>
    <testcase name="tc-2" classname="test-set-1" time="0.400"></testcase>
    <testcase name="tc-3" classname="test-set-1" time="0.600">
      <failure message="test assertion failed [HIGH-RISK]" type="AssertionError">status: expected 200, got 500
body mismatch (JSON)</failure>
    </testcase>
  </testsuite>
  <testsuite name="test-set-2" tests="2" failures="0" skipped="1" time="0.800">
    <testcase name="tc-4" classname="test-set-2" time="0.300"></testcase>
    <testcase name="tc-5" classname="test-set-2" time="0.500">
      <skipped message="obsolete test case"></skipped>
    </testcase>
  </testsuite>
</testsuites>
```

## CI Configuration

### GitHub Actions

```yaml
- name: Run Keploy Tests
  run: keploy test -c "<CMD_TO_RUN_APP>" --delay 10

- name: Generate JUnit Report
  run: keploy report --format junit > test-results.xml

- name: Publish Test Results
  uses: EnricoMi/publish-unit-test-result-action@v2
  with:
    files: test-results.xml
```

Results appear in the workflow summary under the **Tests** tab.

---

### GitLab CI

```yaml
keploy-test:
  script:
    - keploy test -c "<CMD_TO_RUN_APP>" --delay 10
    - keploy report --format junit > test-results.xml
  artifacts:
    when: always
    reports:
      junit: test-results.xml
```

Results appear in the pipeline **Tests** tab.

---

### Jenkins

```groovy
stage('Keploy Test') {
  steps {
    sh 'keploy test -c "<CMD_TO_RUN_APP>" --delay 10'
    sh 'keploy report --format junit > test-results.xml'
  }
  post {
    always {
      junit 'test-results.xml'
    }
  }
}
```

Results appear under **Test Results** in the build view with trend tracking across builds.

---

### CircleCI

```yaml
- run:
    name: Run Keploy Tests
    command: keploy test -c "<CMD_TO_RUN_APP>" --delay 10

- run:
    name: Generate JUnit Report
    command: keploy report --format junit > ~/test-results/keploy/results.xml

- store_test_results:
    path: ~/test-results
```

Results appear in the **Tests** tab of the pipeline run.