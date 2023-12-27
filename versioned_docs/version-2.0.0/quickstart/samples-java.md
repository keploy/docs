---
id: samples-java
title: Java Sample Application
sidebar_label: Spring Boot + Postgres
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

- [Support all Java Version](https://docs.spring.io/spring-boot/docs/current/reference/html/getting-started.html#getting-started.installing)

## Quick Keploy Installation

Based on your OS and preference(Docker/Native), you setup Keploy using One-click installation method:-

```sh
curl -O https://raw.githubusercontent.com/keploy/keploy/main/keploy.sh && source keploy.sh
```

## Setup Employee-Manager App

Clone the repository and install the dependencies

```bash
git clone https://github.com/keploy/samples-java && cd employee-manager
mvn clean install -Dmaven.test.skip=true
```

### Capture the testcases

Once we have our jar file ready,this command will start the recording of API calls using ebpf:-

```bash
sudo -E env PATH=$PATH keploy record -c "java -jar target/springbootapp-0.0.1-SNAPSHOT.jar"
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

Now, let's run the keploy in test mode: -

```bash
sudo -E env PATH=$PATH keploy test -c "java -jar target/springbootapp-0.0.1-SNAPSHOT.jar" --delay 10
```

This will run the testcases and generate the report in `keploy/testReports` folder.
