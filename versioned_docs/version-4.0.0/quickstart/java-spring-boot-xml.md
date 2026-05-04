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
keywords:
  - XML
  - Maven
  - Springboot Framework
  - REST API
  - Java
  - API Test generator
  - Auto Testcase generation
  - JAXB
---
import HowTo from '@site/src/components/HowTo';

<HowTo
  name="Sample REST API with Spring-Boot and XML — record and replay tests with Keploy"
  description="Clone the sample app, run it under Keploy to capture API traffic, then replay the recorded testcases."
  totalTime="PT10M"
  estimatedCost={{currency: "USD", value: "0"}}
  tools={["Keploy CLI", "Docker", "git"]}
  visible={false}
  steps={[
    {
      name: "Install Keploy",
      text: "Install the Keploy CLI on Linux/WSL using the install script from https://keploy.io/install.sh.",
    },
    {
      name: "Clone the sample app",
      text: "Clone the sample repo referenced on this page and install its dependencies.",
    },
    {
      name: "Start dependencies (database, etc.)",
      text: "Bring up any Docker services the app needs (databases, message queues) before recording.",
    },
    {
      name: "Record API calls",
      text: "Run keploy record -c \"CMD_TO_RUN_APP\" and exercise the app's endpoints (curl, Postman) to capture testcases and mocks.",
    },
    {
      name: "Replay tests",
      text: "Run keploy test -c \"CMD_TO_RUN_APP\" --delay 10 to replay the recorded testcases and detect regressions.",
    },
  ]}
/>

import ProductTier from '@site/src/components/ProductTier';

<ProductTier tiers="Open Source, Enterprise" offerings="Self-Hosted, Dedicated" />

Explore creating REST APIs with XML responses using Spring-Boot. Discover the ease of integrating XML serialization through JAXB. Let's dive right in!

import InstallReminder from '@site/src/components/InstallReminder';

<InstallReminder />

## Pre-Requisite 🛠️

- Install Java 17 and set JAVA_HOME environment variable.
- Install Maven
- Install Docker (optional)

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

### Record Test Cases

```bash
keploy record -c "java -jar target/XML-0.0.1-SNAPSHOT.jar"
```

Then, invoke the API using `curl` or your favorite API testing tool.

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

### Run Generated Tests

Execute recorded tests:

```bash
keploy test -c "java -jar target/XML-0.0.1-SNAPSHOT.jar" --delay 10
```

Review generated test reports in `Keploy/reports`.

## Handling Failing Tests ⚠️

If you encounter failing tests due to variable or irrelevant data, like timestamps or dynamically generated fields, you can add them to the global noise configuration in your `keploy.yml`:

**Example:**

<img src="/docs/img/java-spring-boot-header.png" alt="Sample Keploy test header" width="100%" style={{ borderRadius: '5px' }} />

```yaml
globalNoise:
  global:
    header.Date: []
    body:
      # To ignore some values for a field, pass regex patterns to the corresponding array value
      UserList: []
```

After updating `keploy.yml` with the above configuration, rerun your tests, and the issue should be resolved.

<img src="/docs/img/keploy-testcase-employee.png" alt="Sample Keploy Testcases" width="100%" style={{ borderRadius: '5px' }} />

## Wrapping Up 🎉

Fantastic! You've successfully navigated creating and testing XML APIs with Spring Boot and Keploy. Keep exploring, experimenting, and innovating! If you have any queries, we're here to help!
