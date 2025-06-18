---
id: index
title: Pre-requites 🛠️
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

To get the coverage report, first make sure all the requirements are met and then run Keploy test as usual with your application command:

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
