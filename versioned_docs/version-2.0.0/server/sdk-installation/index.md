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

**Note**: In case of java application, before running test subcommand, you need to clean the project by removing any previously generated file, and run install command.

```bash
mvn clean install -Dmaven.test.skip=true
```

## 🛠️ Language Specific Requirements

| Programming Language | Prerequisites                                                                                                                                                                                                                                                       |
| :------------------: | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
|          go          | 1. The application should have a graceful shutdown to stop the API server on `SIGTERM` or `SIGINT` signals. Refer [appendix](#graceful-shutdown) for basic implementation of graceful shutdown function. <br/> 2. The go binary should be built with `-cover` flag. |
|        python        | [Python 3 and above](https://www.python.org/downloads/) <br/> [coverage.py](https://coverage.readthedocs.io/en/7.4.1/install.html)                                                                                                                                  |
|      javascript      | [nyc](https://www.npmjs.com/package/nyc)                                                                                                                                                                                                                            |
|         java         | [Jacoco 0.8.8](https://mvnrepository.com/artifact/org.jacoco/jacoco-maven-plugin/0.8.8)                                                                                                                                                                             |

## Graceful Shutdown

It is important that the application is shutdown gracefully. In case of Golang, function for graceful shutdown:

```go
func GracefulShutdown() {
	stopper := make(chan os.Signal, 1)
	// listens for interrupt and SIGTERM signal
	signal.Notify(stopper, os.Interrupt, os.Kill, syscall.SIGKILL, syscall.SIGTERM)
	go func() {
		select {
		case <-stopper:
			os.Exit(0)
		}
	}()
}

func main() {

	port := "8080"

	r := gin.Default()

	r.GET("/:param", getURL)
	r.POST("/url", putURL)
	// should be called before starting the API server from main()
	GracefulShutdown()

	r.Run()
}
```
