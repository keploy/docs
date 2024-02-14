---
id: samples-java
title: Java Sample Application
sidebar_label: Spring Boot + Postgres SQL
description: The following sample app showcases how to use java framework and the Keploy Platform.
tags:
  - java
  - spring-jpa
  - quickstart
  - samples
  - examples
  - tutorial
keyword:
  - MongoDB
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

A sample Employee-Manager app to test Keploy integration capabilities using [SpringBoot](https://spring.io) and [PostgreSQL](https://www.postgresql.org/).

## Pre-requisites

- Java 1.8+
- Maven

## Quick Keploy Installation

Based on your OS and preference(Docker/Native), you setup Keploy using One-click installation method:-

```shell
curl -O https://raw.githubusercontent.com/keploy/keploy/main/keploy.sh && source keploy.sh
```

## Setup Employee-Manager App

Clone the repository and install the dependencies

```bash
git clone https://github.com/keploy/samples-java && cd samples-java/employee-manager
mvn clean install -Dmaven.test.skip=true
```

## Start the Postgres DB

```bash
docker-compose up -d
```

Note: You may have to use sudo if you are not part of the docker group.

### Capture the testcases

Once we have our jar file ready,this command will start the recording of API calls using ebpf:-

```bash
keploy record -c "java -jar target/springbootapp-0.0.1-SNAPSHOT.jar"
```

![Testcases](https://github.com/keploy/samples-java/blob/main/employee-manager/img/test-cases.png?raw=true)

Now let's run a few tests to capture some more scenarios:

#### Generate testcases

To generate testcases we just need to **make some API calls.** You can use [Postman](https://www.postman.com/), [Hoppscotch](https://hoppscotch.io/), or simply `curl`

1. Make an employee entry

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

this will return the response or an entry. The timestamp would automatically be ignored during testing because it'll always be different.

```
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

Now both these API calls were captured as **editable** testcases and written to `keploy/test` folder. The keploy directory would also have `mock.yml` file.

Now, let's see the magic! 🪄💫

## Run the test cases

First lets shutdown the database to verify that keploy's magic is taking care of the database mocking. No need to worry about the database anymore! 🎉

```bash

docker-compose down
```

Now, let's run the keploy in test mode: -

```bash
keploy test -c "java -jar target/springbootapp-0.0.1-SNAPSHOT.jar" --delay 10
```

This will run the testcases and generate the report in `keploy/testReports` folder. You will see the following output:-

```bash
🐰 Keploy: 2024-01-17T16:47:17Z 	INFO	result	{"testcase id": "test-1", "testset id": "test-set-1", "passed": "true"}
🐰 Keploy: 2024-01-17T16:47:18Z 	INFO	starting test for of	{"test case": "test-2", "test set": "test-set-1"}
🐰 Keploy: 2024-01-17T16:47:18Z 	INFO	result	{"testcase id": "test-2", "testset id": "test-set-1", "passed": "true"}
🐰 Keploy: 2024-01-17T16:47:18Z 	INFO	test report for test-set-1: 	{"name: ": "report-3", "path: ": "/tmp/samples-java/employee-manager/keploy/report-3"}

 <=========================================>
  TESTRUN SUMMARY. For testrun with id: "test-set-1"
	Total tests: 2
	Total test passed: 2
	Total test failed: 0
 <=========================================>

🐰 Keploy: 2024-01-17T16:47:18Z 	INFO	keploy has initiated the shutdown of the user application.
🐰 Keploy: 2024-01-17T16:47:18Z 	INFO	test run completed	{"passed overall": true}
```
