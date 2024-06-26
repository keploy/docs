---
id: samples-java
title: Java Sample Application
sidebar_label: Employer (PostgresDb)
description: The following sample app showcases how to use java framework and the Keploy Platform.
tags:
  - java
  - spring-jpa
  - quickstart
  - samples
  - java-framework
  - postgres
  - examples
  - tutorial
keyword:
  - Jacoco
  - Maven
  - Springboot Framework
  - Postgres
  - SQL
  - Java
  - API Test generator
  - Auto Testcase generation
  - Junit
---

# Example Employee-Manager App

A sample Employee-Manager app to test Keploy integration capabilities using **SpringBoot**
and **PostgreSQL**.

> This sample application is **not written for macOS users** since this application doesn't have a docker file yet.

import InstallationGuide from '../concepts/installation.md'

<InstallationGuide/>

## Setup Employee-Manager App

### Application Pre-Requisites 📋

- Java 1.8+ or {'<'}17 ☕
- Maven 🛠️

Clone the repository and install the dependencies

```bash
git clone https://github.com/keploy/samples-java && cd samples-java/employee-manager
mvn clean install -Dmaven.test.skip=true
```

## Start the Postgres DB 🐳

```bash
docker compose up -d
```

Note: You may have to use sudo if you are not part of the docker group.

### Capture the testcases 🎬

Once we have our jar file ready,this command will start the recording of API calls using ebpf:-

```bash
keploy record -c "java -jar target/springbootapp-0.0.1-SNAPSHOT.jar"
```

![Testcases](https://github.com/keploy/samples-java/blob/main/employee-manager/img/test-cases.png?raw=true)

Now let's run a few tests to capture some more scenarios:

#### Generate testcases 📝

To generate testcases we just need to **make some API calls.** You can use [Postman](https://www.postman.com/)
, [Hoppscotch](https://hoppscotch.io/), or simply `curl`

1. Make an employee entry 📥

```bash
curl --location --request POST 'http://localhost:8080/api/employees' \
--header 'Content-Type: application/json' \
--data-raw '{
    "firstName": "Myke",
    "lastName": "Tyson",
    "email": "mt@gmail.com",
    "timestamp":1
}'
```

this will return the response or an entry. The timestamp would automatically be ignored during testing because it'll
always be different.

```bash
{
    "id": 1,
    "firstName": "Myke",
    "lastName": "Tyson",
    "email": "mt@gmail.com",
    "timestamp": 1661493301
}
```

2. Fetch recorded info about employees

```bash
curl --location --request GET 'http://localhost:8080/api/employees/1'
```

or by querying through the browser `http://localhost:8080/api/employees/1`

Now both these API calls were captured as **editable** testcases and written to `keploy/test` folder. The keploy
directory would also have `mock.yml` file.

Now, let's see the magic! 🪄💫

## Run the test cases

First lets shutdown the database to verify that keploy's magic is taking care of the database mocking. No need to worry
about the database anymore! 🎉

```bash
docker-compose down
```

Now, let's run the keploy in test mode: -

```bash
keploy test -c "java -jar target/springbootapp-0.0.1-SNAPSHOT.jar" --delay 10
```

This will run the testcases and generate the report in `keploy/testReports` folder. You will see the following output:-

````shell
🐰 Keploy: 2024-02-20T13:49:20Z 	INFO	starting test for of	{"test case": "test-1", "test set": "test-set-1"}
2024-02-20 13:49:20.778  INFO 18888 --- [nio-8080-exec-1] o.a.c.c.C.[Tomcat].[localhost].[/]       : Initializing Spring DispatcherServlet 'dispatcherServlet'
2024-02-20 13:49:20.778  INFO 18888 --- [nio-8080-exec-1] o.s.web.servlet.DispatcherServlet        : Initializing Servlet 'dispatcherServlet'
2024-02-20 13:49:20.779  INFO 18888 --- [nio-8080-exec-1] o.s.web.servlet.DispatcherServlet        : Completed initialization in 1 ms
Testrun failed for testcase with id: "test-1"

--------------------------------------------------------------------

+-------------------------------------------------------------------------------------------------------------+
|                                                DIFFS TEST-1                                                 |
+-------------------------------------------------------------------------------------------------------------+
|                     EXPECT HEADER                    |                   ACTUAL HEADER                      |
| -----------------------------------------------------+----------------------------------------------------- |
|                                                      |                                                      |
|                                                                                                             |
|                      EXPECT BODY                     |                    ACTUAL BODY                       |
| -----------------------------------------------------+----------------------------------------------------- |
|    {                                                 |  {                                                   |
|      "email": "mt@gmail.com",                        |    "email": "mt@gmail.com",                          |
|      "firstName": "Myke",                            |    "firstName": "Myke",                              |
|      "id": 1,                                        |    "id": 1,                                          |
|      "lastName": "Tyson",                            |    "lastName": "Tyson",                              |
|   -  "timestamp": 1.70843653e+09                     | +  "timestamp": 1.70843696e+09                       |
|    }                                                 |  }                                                   |
|                                                      |                                                      |
|                                                                                                             |
+-------------------------------------------------------------------------------------------------------------+
🐰 Keploy: 2024-02-20T13:49:20Z 	INFO	result	{"testcase id": "test-1", "testset id": "test-set-1", "passed": "false"}
🐰 Keploy: 2024-02-20T13:49:21Z 	INFO	starting test for of	{"test case": "test-2", "test set": "test-set-1"}
Testrun passed for testcase with id: "test-2"

--------------------------------------------------------------------

🐰 Keploy: 2024-02-20T13:49:21Z 	INFO	result	{"testcase id": "test-2", "testset id": "test-set-1", "passed": "true"}
🐰 Keploy: 2024-02-20T13:49:21Z 	INFO	test report for test-set-1: 	{"name: ": "report-2", "path: ": "/Users/neha/open-source/samples-java/employee-manager/keploy/report-2"}

<=========================================>
TESTRUN SUMMARY. For testrun with id: "test-set-1"
Total tests: 2
Total test passed: 1
Total test failed: 1
<=========================================>```
````

Did you spot that the `timestamp` is showing some differences? Yep, time has a way of doing that! 🕰️

Worry not, just add the ever-changing fields (like our **ts** here) to the **noise parameter** to **dodge those assertions**.

> Pro tip: Add `body.timestamp` to noise in `test-1.yaml`.

<img src="/docs/img/code-snippets/java-sample-employee-manager-noise.png" alt="Adding Noise to Test case Java Postgres Employee Manager App" width="70%" style={{ borderRadius: '5px' }}/>

Run that `keploy test` command once more and watch as everything falls into place with all tests passing! 🌟

Final thoughts? Dive deeper! Try different API calls, tweak the DB response in the `mocks.yml`, or fiddle with the request or response in `test-x.yml`. Run the tests again and see the magic unfold! ✨👩‍💻👨‍💻✨

### 🎉 Wrapping it up

Congrats on the journey so far! You've seen Keploy's power, flexed your coding muscles, and had a bit of fun too! Now, go out there and keep exploring, innovating, and creating! Remember, with the right tools and a sprinkle of fun, anything's possible. 😊🚀

Hope this helps you out, if you still have any questions, reach out to us .

import GetSupport from '../concepts/support.md'

<GetSupport/>
