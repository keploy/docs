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
git clone https://github.com/your-repository/spring-boot-xml-app.git
cd spring-boot-xml-app
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
curl --silent --location \"https://github.com/keploy/keploy/releases/latest/download/keploy_linux_amd64.tar.gz\" | tar xz -C /tmp
sudo mkdir -p /usr/local/bin && sudo mv /tmp/keploy /usr/local/bin && keploy
```

### Record Test Cases

Start recording interactions by running:

```bash
keploy record -c \"mvn spring-boot:run\"
```

Then, invoke the API using `curl` or your favorite API testing tool.

### Run Generated Tests

Execute recorded tests:

```bash
keploy test -c \"mvn spring-boot:run\" --delay 10
```

Review generated test reports in `Keploy/reports`.

## Handling Failing Tests ⚠️

If you encounter failing tests due to variable or irrelevant data, like timestamps or dynamically generated fields, you can add them to the global noise configuration in your `keploy.yml`:

**Example:**

```yaml
globalNoise:
  global:
    header.Date: []
    body:
      # To ignore some values for a field, pass regex patterns to the corresponding array value
      UserList: []
```

Here is a screenshot of a failing test example (replace this with your actual screenshot):

![Failing Test Example](paste-your-screenshot-here.png)

After updating `keploy.yml` with the above configuration, rerun your tests, and the issue should be resolved.

## Dependencies 📚

- Spring Boot
- Spring Web
- JAXB (XML serialization)

## Wrapping Up 🎉

Fantastic! You've successfully navigated creating and testing XML APIs with Spring Boot and Keploy. Keep exploring, experimenting, and innovating! If you have any queries, we're here to help!

import GetSupport from '../concepts/support.md'

<GetSupport/>
