---
id: mock-registry
title: Mock Registry
sidebar_label: Mock Registry 📦
tags:
  - explanation
  - feature guide
  - mock storage
keywords:
  - mock storage
  - keploy cloud
  - efficient testing
  - cloud storage
---

Mock Registry uploads mock files to cloud storage, keeping the application's repository lightweight and manageable.

When dealing with large mock files during tests, committing them to git repositories can be cumbersome. **Uploading such mocks to cloud storage** instead helps maintain a clean and performant repository, reducing complexity.

## Usage 🛠️

### Disabling Mock Upload

Mock are `uploaded to cloud by default` and can be disabled using CLI or keploy config.

1. [Disable using CLI flag](#disable-using-cli-flag)
2. [Disable using keploy config file](#disable-using-keploy-config-file)

### Disable using CLI flag

To disable mock uploads for a specific test run, use the --disableMockUpload=true flag:

```bash
keploy test -c "<appCmd>" --disableMockUpload=true
```

### Disable using keploy config file

Set the mock upload preference in the configuration file to enable or disable mock uploads by default for all test runs:

```bash
# keploy.yaml
disableMockUpload: true
```

## Mock Registry Behavior

### Test Run Passed ✅

If test cases pass, mocks are uploaded to the cloud, added to .gitignore, and a config.yml is generated with a unique Mock ID.

### TestRun Failed ❌

If one or more test cases are failed, Mocks would not be uploaded to cloud and `config.yml` is not generated, but mocks would still be moved to `.gitignore`.

### Local Mock is missing 🚫

If mocks are missing locally, they will be downloaded from the cloud during the test run.

### Different Mocks Locally and Cloud 🔄

If mocks present locally and in the cloud are different, mocks from the cloud will be downloaded and used during the test run.

### Upload Updated Mocks 📤

To update mocks in the cloud, delete the `config.yml` under the test set folder. When tests are run, a new config file will be generated, and updated mocks will be uploaded to the cloud.

### If using `--removeUnuseMocks` 🧹

When `--removeUnusedMocks` is used, `config.yml` will be updated with a new Mock ID, and those mocks will be treated as new mocks.

### Public and Private Mocks 🔒

Mocks can be classified as public or private based on their usage and accessibility:

#### Public Mocks 🌐

Public mocks are accessible by all users and can be shared across multiple projects. Use public mocks when the data is generic and not sensitive.

#### Private Mocks 🔐

Private mocks are restricted to specific users or projects. Use private mocks for sensitive or project-specific data to ensure security and privacy.
