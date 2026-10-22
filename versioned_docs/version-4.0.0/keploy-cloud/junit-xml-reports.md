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

Keploy supports exporting test results as standard JUnit XML. Use `--format junit` flag on the `keploy report` command — it is a user-defined config and does not need any external plugin. 


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

### Sample Output


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

### Config Example using GitHub Actions

```yaml
- name: Run Keploy Tests
  id: keploy-test
  run: keploy test -c "<CMD_TO_RUN_APP>" --delay 10
  continue-on-error: true

- name: Generate JUnit Report
  if: always()
  run: keploy report --format junit > test-results.xml
```

Results appear in the workflow summary under the **Tests** tab.

