---
id: index
title: Test Coverage Generation
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

In case of **docker** command, you would need to set `--skipCoverage` flag to false as by default coverage is disabled. Also language must be explicitly passed through `--language` flag.

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

:::note
In case of java application, before running test subcommand, you need to clean the target folder by removing any previously generated file, and then running install command. Else you may get [class mismatch error](https://www.eclemma.org/jacoco/trunk/doc/classids.html) or total coverage percentage would come out to be 0.
```bash
mvn clean install -Dmaven.test.skip=true
```
:::


## 🛠️ Language Specific Requirements

<table>
  <tr>
    <th rowspan="2">
      Programming Language
    </th>
    <th colspan="2" width="80%">
      Prerequisites
    </th>
  </tr>
  <tr>
    <th>Native</th>
    <th>Docker</th>
  </tr>
  <tr>
    <td id="lang">
      go
    </td>
    <td colspan="2">
      1. The application should have a graceful shutdown to stop the API server on `SIGTERM` or `SIGINT` signals. Refer [appendix](#graceful-shutdown) for basic implementation of graceful shutdown function. 
      2. The go binary should be built with `-cover` flag.
    </td>
  </tr>
  <tr>
    <td id="lang">
      python
    </td>
    <td>
      [coverage.py v7.6.0 and above](https://coverage.readthedocs.io/en/7.6.0/install.html)
    </td>
    <td>
      update your CMD instruction to:<br/>
      `CMD ["sh", "-c", "python3 -m coverage run $APPEND --data-file=.coverage.keploy app.py"]`,<br/>
      where app.py will be the program to run.
    </td>
  </tr>
  <tr>
    <td id="lang">
      javascript
    </td>
    <td>
      [nyc](https://www.npmjs.com/package/nyc)
    </td>
    <td>
    1. Add a new script to package.json: <br/>
    `"keploy-coverage": "nyc --clean=$CLEAN npm run start",`
    2. Change the CMD instruction to: <br/>
    `CMD [ "npm", "run", "keploy-coverage" ]`
    </td>
  </tr>
  <tr>
    <td id="lang">
      java
    </td>
    <td>
      [Jacoco](https://mvnrepository.com/artifact/org.jacoco/jacoco-maven-plugin/0.8.8)
    </td>
    <td>
    Update the CMD instruction to:<br/>
    `CMD ["sh", "-c", "java $JACOCOAGENT -jar <your_application_jar_path>"]`
    </td>
  </tr>
</table>

:::note
If container fails to stop after keploy test-set run, then include the below instructions in your dockerfile:
```sh
RUN apt-get install -y dumb-init
ENTRYPOINT [ "dumb-init", "--" ]
```
:::

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
