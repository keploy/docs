---
id: deduplication
title: Deduplication
sidebar_label: Deduplication
tags:
  - explanation
  - feature guide
  - jwt
  - Test Deduplication
keywords:
  - dedup
  - keploy cloud
  - jwt
  - deduplication
---

### Why Deduplication? ❄️

Test deduplication simplifies the testing process by removing redundant test cases, saving time and resources while clarifying the purpose and coverage of each test.

### What is Deduplication? ⏳

Test deduplication is a process used in software testing to eliminate duplicate test cases or scenarios. When developing and maintaining software, it's common for test suites to grow in size, often resulting in redundancy where certain test cases cover the same functionality or scenarios.

## Usage 🛠️

To detect duplicate tests, simply run the below command, like so:

```bash
keploy dedup -c "<appCmd>" --freezeTime
```

Voila! Keploy will now detect duplicate tests .

### Remove Duplicate Tests

You can simply remove duplicate tests with :

<<<<<<< HEAD

```bash
keploy dedup --rm
```

=======

```bash
keploy dedup --rm
```

> > > > > > > d9e9a18a1c3b58d557559c5a734a5e1cc0121eab
