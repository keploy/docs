---
id: deduplication
title: Remove Duplicates Tests
sidebar_label: Remove Duplicate Tests
tags:
  - explanation
  - feature guide
  - Test Deduplication
keywords:
  - dedup
  - keploy cloud
  - deduplication
  - duplicate tests
  - golang
  - testcases
---

## Why Deduplication? ❄️

When developing or maintaining a software, it is common for test suites to grow in size. This often results in redundancy, as many test cases cover the same functions or scenarios. This is where Test Deduplication comes into play.

It simplifies the testing process by removing redundant test cases, which saves time and resources while keeping the testcases which adds value to the overall coverage of the application.

## Usage 🛠️

To detect duplicate tests, simply run the below command, like so:

```bash
keploy test -c "docker compose up" --containerName containerName --dedup
```

### For Golang Applications

**1. Pre-requisite**

Install the `keploy/go-sdk/v3/keploy` : -

```bash
go get github.com/keploy/go-sdk/v3/keploy
```

Add the following on top of your main application file : -

```bash
import _ "github.com/keploy/go-sdk/v3/keploy"
```

Update the go build command in Dockerfile to add new flags which is required for deduplication (use same flags for native builds)

```bash
RUN go build -cover -covermode=atomic -coverpkg=./... -o /app/main .
```

**2. Run Deduplication**

For Docker, run:

```bash
keploy test -c "docker compose up" --containerName containerName --dedup
```

For Native, run:

```bash
keploy test -c ./main --dedup
```

This will generate a dedupData.yaml file

After this Run

```bash
keploy dedup
```

This command will create a duplicates.yaml file which will contain all the test cases which was found to be duplicate.

In order to remove all the duplicate test cases, run the following command:

```bash
keploy dedup --rm
```
