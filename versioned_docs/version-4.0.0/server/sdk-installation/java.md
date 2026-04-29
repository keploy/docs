---
id: java
title: Java Agent for Dynamic Deduplication
sidebar_label: Java
description: "Configure the Keploy Java agent for Enterprise dynamic deduplication with in-process JaCoCo coverage."
tags:
  - java
  - coverage
  - deduplication
keywords:
  - Java
  - JaCoCo
  - Maven
  - Spring Boot
  - WAR
  - dynamic deduplication
---

import ProductTier from '@site/src/components/ProductTier';

<ProductTier tiers="Enterprise" offerings="Self-Hosted, Dedicated" />

The Keploy Java SDK is used as a Java agent for Enterprise dynamic deduplication during replay/test mode. It collects per-testcase Java coverage and sends it to Keploy Enterprise so duplicate testcases can be identified.

The Java agent does not record API traffic or mock dependencies. Record your Keploy tests separately, commit the generated test fixtures when you use them in CI, and run Java dedup during `keploy test --dedup`.

Because the SDK is a Java agent, it is framework-agnostic. It can be attached to Spring Boot apps, Dropwizard/Jersey apps, plain executable jars, classpath-based apps, servlet/WAR-style archives, and other JVM frameworks as long as the application JVM also runs the JaCoCo agent.

## Requirements

- Java 8, 17, or 21
- `io.keploy:keploy-sdk` version with Java-agent support
- JaCoCo Java agent attached to the application JVM
- Keploy Enterprise with dynamic deduplication enabled

## Copy the Keploy Java Agent

Copy the Keploy Java agent jar during your build. Do not add it under `<dependencies>`, and do not import Keploy classes from your application code.

```xml
<plugin>
  <groupId>org.apache.maven.plugins</groupId>
  <artifactId>maven-dependency-plugin</artifactId>
  <version>3.6.1</version>
  <executions>
    <execution>
      <id>copy-keploy-java-agent</id>
      <phase>package</phase>
      <goals>
        <goal>copy</goal>
      </goals>
      <configuration>
        <artifactItems>
          <artifactItem>
            <groupId>io.keploy</groupId>
            <artifactId>keploy-sdk</artifactId>
            <version>2.0.1</version>
            <outputDirectory>${project.build.directory}</outputDirectory>
            <destFileName>keploy-sdk.jar</destFileName>
          </artifactItem>
        </artifactItems>
      </configuration>
    </execution>
  </executions>
</plugin>
```

## Run with the Keploy and JaCoCo Java Agents

The SDK reads coverage in-process via JaCoCo's runtime API (`org.jacoco.agent.rt.RT.getAgent()`), so attach both agents in the application JVM: the Keploy agent starts the dedup control socket, and the JaCoCo agent provides runtime coverage.

```bash
java \
  -javaagent:target/keploy-sdk.jar \
  -javaagent:/path/to/jacocoagent.jar \
  -jar target/app.jar
```

The SDK automatically looks for application classes in Maven `target/classes`, Gradle `build/classes/java/main`, executable jars, Spring Boot `BOOT-INF/classes`, servlet `WEB-INF/classes`, and the runtime classpath. If your compiled application classes live somewhere else, set `KEPLOY_JAVA_CLASS_DIRS` to the class directory or archive that should be analyzed:

```bash
export KEPLOY_JAVA_CLASS_DIRS=/absolute/path/to/target/classes
```

If the in-process API is unavailable in your environment, the SDK transparently falls back to JaCoCo's TCP server mode. To use the fallback explicitly, launch JaCoCo in `tcpserver` mode and configure `KEPLOY_JACOCO_HOST` / `KEPLOY_JACOCO_PORT` (defaults: `127.0.0.1:36320`):

```bash
java \
  -javaagent:target/keploy-sdk.jar \
  -javaagent:/path/to/jacocoagent.jar=address=127.0.0.1,port=36320,output=tcpserver \
  -jar target/app.jar
```

## Replay with Dedup

Run Keploy in test mode with dynamic deduplication enabled:

```bash
keploy test \
  -c "java -javaagent:target/keploy-sdk.jar -javaagent:/path/to/jacocoagent.jar -jar target/app.jar" \
  --dedup \
  --language java
```

If you are using the JaCoCo TCP fallback, also pass `--pass-through-ports <jacoco-port>` so Keploy does not try to mock the coverage-control connection.

After replay, run:

```bash
keploy dedup
```

To apply the dynamic deduplication cleanup:

```bash
keploy dedup --rm
```

## Docker and Restricted Docker

Java dedup uses two Unix sockets shared between Keploy Enterprise and the Java process:

- `/tmp/coverage_control.sock`
- `/tmp/coverage_data.sock`

For Docker or Docker Compose runs, Keploy injects a shared `keploy-sockets-vol:/tmp` mount into the application container and the Keploy agent container so both processes use the same socket paths. Do not add a conflicting `/tmp` bind mount or `tmpfs`; keep `/tmp` writable even when the root filesystem is read-only.

For restricted containers, the application can run as a non-root user with dropped capabilities and `no-new-privileges` as long as the injected `/tmp` volume is shared and writable. If the SDK falls back to JaCoCo TCP mode, the JaCoCo TCP port must also be reachable from the Java process.

## CI Guidance

CI should run replay/test mode against checked-in Keploy test fixtures. Do not record Java dedup fixtures in the pipeline unless you intentionally want to refresh them.
