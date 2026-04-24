---
id: java
title: Java SDK for Dynamic Deduplication
sidebar_label: Java
description: "Configure the Keploy Java SDK for Enterprise dynamic deduplication with JaCoCo TCP server mode."
tags:
  - java
  - coverage
  - deduplication
keywords:
  - Java
  - JaCoCo
  - Maven
  - Spring Boot
  - dynamic deduplication
---

The Java SDK is used for Enterprise dynamic deduplication during replay/test mode. It collects per-testcase Java coverage and sends it to Keploy Enterprise so duplicate testcases can be identified.

The Java SDK does not record API traffic or mock dependencies. Record your Keploy tests separately, commit the generated test fixtures when you use them in CI, and run Java dedup during `keploy test --dedup`.

## Requirements

- Java 8, 17, or 21
- `io.keploy:keploy-sdk`
- JaCoCo runtime agent in TCP server mode
- Keploy Enterprise with dynamic deduplication enabled

## Add the SDK

Add the Keploy Java SDK dependency:

```xml
<dependency>
  <groupId>io.keploy</groupId>
  <artifactId>keploy-sdk</artifactId>
  <version>N.N.N</version>
</dependency>
```

## Start the Dedup Agent

For Spring Boot 2 or other `javax.servlet` applications, import the middleware:

```java
import io.keploy.servlet.KeployMiddleware;
import org.springframework.context.annotation.Import;

@Import(KeployMiddleware.class)
public class Application {
}
```

For Spring Boot 3, Jakarta EE applications, other frameworks, or custom launchers, start the agent during application startup:

```java
import io.keploy.dedup.KeployDedupAgent;

KeployDedupAgent.start();
```

## Run with JaCoCo TCP Server Mode

Run the Java application with the JaCoCo runtime agent in `tcpserver` mode. Keploy uses the JaCoCo TCP port to reset and dump per-testcase coverage during replay.

```bash
java -javaagent:/path/to/jacocoagent.jar=address=127.0.0.1,port=36320,destfile=target/jacoco-keploy.exec,output=tcpserver \
  -jar target/app.jar
```

If your compiled application classes are not under `target/classes` or `build/classes/java/main`, set `KEPLOY_JAVA_CLASS_DIRS`:

```bash
export KEPLOY_JAVA_CLASS_DIRS=/absolute/path/to/target/classes
```

## Replay with Dedup

Run Keploy in test mode with dynamic deduplication enabled and pass through the JaCoCo TCP port:

```bash
keploy test \
  -c "java -javaagent:/path/to/jacocoagent.jar=address=127.0.0.1,port=36320,destfile=target/jacoco-keploy.exec,output=tcpserver -jar target/app.jar" \
  --dedup \
  --pass-through-ports 36320
```

After replay, run:

```bash
keploy dedup
```

To remove duplicate testcases:

```bash
keploy dedup --rm
```

## Docker and Restricted Docker

Java dedup uses two Unix sockets shared between Keploy Enterprise and the Java process:

- `/tmp/coverage_control.sock`
- `/tmp/coverage_data.sock`

For Docker or Docker Compose runs, bind-mount host `/tmp` into the application container as `/tmp` so both processes use the same socket paths. Keep `/tmp` writable even when the root filesystem is read-only.

For restricted containers, the application can run as a non-root user with dropped capabilities and `no-new-privileges` as long as `/tmp` is shared and writable, and the JaCoCo TCP port is reachable from the Java process.

## CI Guidance

CI should run replay/test mode against checked-in Keploy test fixtures. Do not record Java dedup fixtures in the pipeline unless you intentionally want to refresh them.
