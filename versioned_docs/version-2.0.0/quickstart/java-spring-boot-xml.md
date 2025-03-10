---
id: java-spring-boot-xml
title: Sample REST API with Spring-Boot and XML
sidebar_label: XML API App
description: This CRUD Application demonstrates REST API endpoints that serve XML responses using Spring Boot.
tags:
  - java
  - spring-boot
  - xml
  - quickstart
  - samples
  - examples
  - tutorial
  - restful-api
keyword:
  - XML
  - Maven
  - Springboot Framework
  - REST API
  - Java
  - API Test generator
  - Auto Testcase generation
  - JAXB
---

## Introduction

🌟 Explore creating REST APIs with XML responses using [Spring-Boot](https://github.com/spring-projects/spring-boot). Discover the ease of integrating XML serialization through JAXB. Let's dive right in! 🚀

## Pre-Requisite 🛠️

- Install [Java 17](https://www.oracle.com/java/technologies/downloads/) and set JAVA_HOME environment variable.
- Install [Maven](https://maven.apache.org/install.html)
- Install [Docker](https://docs.docker.com/engine/install/) (optional)

## Get Started! 🎬

### Clone and Build the Application

```bash
git clone https://github.com/keploy/samples-java.git
cd spring-boot-xml/naive-spring-boot
mvn clean install
```

### Run the Application

Start the Spring Boot application with:

```bash
mvn spring-boot:run
```

> **Note**: For Windows users, commands remain the same.

## API Endpoints 📡

### Get User Data (XML)

- **Endpoint**: `GET /api/user`

Make a request using `curl`:

```bash
curl -X GET -H \"Accept: application/xml\" http://localhost:8080/api/user
```

- **Endpoint**: `GET /api/users`

Make a request using `curl`:

```bash
curl -X GET http://localhost:8080/api/users -H "Accept: application/xml"
```

- **Endpoint**: `GET /api/people`

Make a request using `curl`:

```bash
curl -X GET http://localhost:8080/api/people -H "Accept: application/xml"
```

### Example XML Response

```xml
<User>
    <name>John Doe</name>
    <age>30</age>
    <phone>0101233333</phone>
</User>
```

## Integrating with Keploy 📥

Harness Keploy's test generation capabilities easily:

### Install Keploy

```bash
 curl --silent -O -L https://keploy.io/install.sh && source install.sh
```

or

### Install the cloud version -

```bash
  curl --silent -O -L https://keploy.io/ent/install.sh && source install.sh
```

### Record Test Cases

```bash
keploy record -c "java -jar target/XML-0.0.1-SNAPSHOT.jar"
```

Start recording interactions by running:

```bash
keploy record -c "java -jar target/XML-0.0.1-SNAPSHOT.jar"
```

Then, invoke the API using `curl` or your favorite API testing tool.

### Run Generated Tests

Execute recorded tests:

```bash
keploy test -c "java -jar target/XML-0.0.1-SNAPSHOT.jar" --delay 10
```

Review generated test reports in `Keploy/reports`.

## Handling Failing Tests ⚠️

If you encounter failing tests due to variable or irrelevant data, like timestamps or dynamically generated fields, you can add them to the global noise configuration in your `keploy.yml`:

**Example:**

<img width="694" alt="Screenshot 2025-03-11 at 12 07 04 AM" src="https://github.com/user-attachments/assets/92dc6480-73f9-435c-a3b8-c918b2acc7a1" />

```yaml
globalNoise:
  global:
    header.Date: []
    body:
      # To ignore some values for a field, pass regex patterns to the corresponding array value
      UserList: []
```

After updating `keploy.yml` with the above configuration, rerun your tests, and the issue should be resolved.

<img width="711" alt="Screenshot 2025-03-11 at 12 07 19 AM" src="https://github.com/user-attachments/assets/bed57c1e-e7a9-4cbd-80d6-f69a2024ba60" />

## Dependencies 📚

- Spring Boot
- Spring Web
- JAXB (XML serialization)

## Wrapping Up 🎉

Fantastic! You've successfully navigated creating and testing XML APIs with Spring Boot and Keploy. Keep exploring, experimenting, and innovating! If you have any queries, we're here to help!

import GetSupport from '../concepts/support.md'

<GetSupport/>
