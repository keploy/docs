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
- `io.keploy:keploy-sdk` `2.0.6` (or newer with Java-agent support)
- JaCoCo runtime agent (tested with `0.8.12`)
- Keploy Enterprise with dynamic deduplication enabled

## Copy the Keploy SDK and JaCoCo Agents

Both jars are runtime agents. Copy them into `target/` at build time. Do not add the Keploy SDK under `<dependencies>` and do not import Keploy classes from your code.

```xml
<plugin>
  <groupId>org.apache.maven.plugins</groupId>
  <artifactId>maven-dependency-plugin</artifactId>
  <version>3.6.1</version>
  <executions>
    <execution>
      <id>copy-keploy-java-agent</id>
      <phase>package</phase>
      <goals><goal>copy</goal></goals>
      <configuration>
        <artifactItems>
          <artifactItem>
            <groupId>io.keploy</groupId>
            <artifactId>keploy-sdk</artifactId>
            <version>2.0.6</version>
            <outputDirectory>${project.build.directory}</outputDirectory>
            <destFileName>keploy-sdk.jar</destFileName>
          </artifactItem>
        </artifactItems>
      </configuration>
    </execution>
    <execution>
      <id>copy-jacoco-agent</id>
      <phase>package</phase>
      <goals><goal>copy</goal></goals>
      <configuration>
        <artifactItems>
          <artifactItem>
            <groupId>org.jacoco</groupId>
            <artifactId>org.jacoco.agent</artifactId>
            <version>0.8.12</version>
            <classifier>runtime</classifier>
            <type>jar</type>
            <outputDirectory>${project.build.directory}</outputDirectory>
            <destFileName>jacocoagent.jar</destFileName>
          </artifactItem>
        </artifactItems>
      </configuration>
    </execution>
  </executions>
</plugin>
```

## Run with Both Agents

Attach both agents in the application JVM. The Keploy agent reads coverage in-process via JaCoCo's runtime API, so order doesn't matter as long as both are present:

```bash
java \
  -javaagent:target/keploy-sdk.jar \
  -javaagent:target/jacocoagent.jar \
  -jar target/app.jar
```

The SDK auto-detects application classes from Maven `target/classes`, Gradle `build/classes/java/main`, executable jars, Spring Boot `BOOT-INF/classes`, servlet `WEB-INF/classes`, and the runtime classpath. For custom layouts, point it at the right directory or archive:

```bash
export KEPLOY_JAVA_CLASS_DIRS=/absolute/path/to/target/classes
```

## Replay with Dedup

```bash
keploy test \
  -c "java -javaagent:target/keploy-sdk.jar -javaagent:target/jacocoagent.jar -jar target/app.jar" \
  --dedup \
  --language java
```

This produces `dedupData.yaml` (per-testcase coverage map). Then:

```bash
keploy dedup        # writes duplicates.yaml grouping the redundant testcases per test-set
keploy dedup --rm   # removes the redundant testcases from the local Keploy test set
```

## Docker

Keploy injects a shared `keploy-sockets-vol:/tmp` mount into the application container and the Keploy agent container at replay time, so the dedup sockets are visible on both sides. Keep `/tmp` writable; do not add a conflicting `/tmp` bind mount or `tmpfs`. Restricted containers (non-root user, read-only root filesystem, dropped capabilities) work as long as `/tmp` stays writable.

## CI Guidance

CI should run replay/test mode against checked-in Keploy test fixtures. Do not record Java dedup fixtures in the pipeline unless you intentionally want to refresh them.
