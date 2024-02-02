---
id: replay
title: Replay Tests & Mocks for Go (v1.0.0)
description: Replay Test Suite for Go in Keploy.
tags:
  - developer-guide
  - go
  - replay-guide
  - replay-test-case
---

import ReplayTest from '../operation/test.md'

<ReplayTest/>

### Method 2 [preferred]

<details><summary>
Testing using Unit Test File

</summary>

import GoTest from './integration-with-go-test.md'

<GoTest/>

</details>

### Method 3

<details><summary>
Run Tests in CI/CD

</summary>

After following METHOD 2 above ^, Keploy will be integrated to `go-test`.
If you already have `go-test` no changes are required in the CI/CD pipeline.

</details>
