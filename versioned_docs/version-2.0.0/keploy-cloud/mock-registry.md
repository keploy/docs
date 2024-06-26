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

### Why Use Mock Registry 📦

When dealing with large mock files in tests, committing them to Git repositories can be cumbersome and inefficient. **Uploading these mocks to cloud storage** instead helps maintain a clean and performant repository, reducing the complexity and improving workflow efficiency.

### What is Mock Registry? 📂

The Mock Registry feature in Keploy allows users to upload large mock files to cloud storage, keeping the Git repository lightweight and manageable. This ensures that test suites remain efficient and scalable.

## Usage 🛠️

### Running Tests

To run your tests with Keploy and utilize the Mock Registry feature, use the following command. Mock upload is enabled by default:

```bash
keploy test -c "<appCmd>" --freezeTime
```

Voila! If the test set is successful, the mock is uploaded to the cloud!

### Disabling Mock Upload

If you prefer not to upload mocks to cloud storage for a specific test run, you can disable the mock upload feature by adding the --disableMockUpload=true flag:

```bash
keploy test -c "<appCmd>" --disableMockUpload=true
```

By following these steps, you can efficiently manage large mock files using the Mock Registry feature in Keploy, ensuring that your tests remain streamlined and your repositories clean.

### Disabling Mock Upload via Configuration File

You can also set the mock upload preference in the configuration file. This allows you to enable or disable mock upload by default for all test runs:

```bash
# keploy.yaml
disableMockUpload: true
```
