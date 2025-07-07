---
id: index
title: SDK Installation Guide for Server
tags:
  - coverage
keyword:
  - coverage
  - unit tests
  - code coverage
  - Golang
  - Go Test
  - java
  - jacoco
  - node
  - npm
  - nyc
  - python
  - coveragepy
---

Follow this step-by-step guide to install the server SDK. Learn how to set up and integrate the SDK into your application for seamless testing and monitoring.

```bash
keploy test -c "your_application_command"
```

After successful execution of this command, A coverage report would be generated inside the test-run folder of keploy/reports.

```sh
keploy
├── reports
│   └── test-run-0
│       ├── coverage.yaml
│       └── test-set-0-report.yaml
└── test-set-0
    ├── mocks.yaml
    └── tests
        ├── test-1.yaml
        └── test-2.yaml
```
