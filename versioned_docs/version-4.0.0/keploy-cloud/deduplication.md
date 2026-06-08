---
id: deduplication
title: Dynamic Deduplication
sidebar_label: Dynamic Deduplication
description: "Use Keploy Enterprise dynamic deduplication to identify redundant test cases and save time and resources."
tags:
  - explanation
  - feature guide
  - Test Deduplication
keywords:
  - dedup
  - keploy cloud
  - deduplication
  - duplicate tests
  - golang
  - testcases
toc_min_heading_level: 2
toc_max_heading_level: 4
---

import ProductTier from '@site/src/components/ProductTier';

<ProductTier tiers="Enterprise" offerings="Self-Hosted, Dedicated" />

## Why Dynamic Deduplication? ❄️

When developing or maintaining a software, it is common for test suites to grow in size. This often results in redundancy, as many test cases cover the same functions or scenarios. This is where Test Deduplication comes into play.

It simplifies the testing process by identifying redundant test cases, which saves time and resources while keeping the testcases that add value to the overall coverage of the application.

## Usage 🛠️

To collect coverage for dynamic deduplication, run:

```bash
keploy test -c "docker compose up" --containerName containerName --dedup
```

### For Golang Applications

#### 1. Pre-requisite

Install the `keploy/go-sdk/v3/keploy` : -

```bash
go get github.com/keploy/go-sdk/v3/keploy
```

Add the following on top of your main application file : -

```bash
import _ "github.com/keploy/go-sdk/v3/keploy"
```

#### 2. Build Configuration

Update the `go build` command in your Dockerfile (or native build script) to include coverage flags. These are required for deduplication to calculate coverage accurately.

```bash
RUN go build -cover -covermode=atomic -coverpkg=./... -o /app/main .
```

#### 3. Dockerfile Configuration (Important for Docker Users)

If you are using a multi-stage Docker build (e.g., building in one stage and running in a slim image), you **must** ensure the Go toolchain and `go.mod` files are preserved in the final runtime image. The deduplication feature requires access to the Go runtime to map coverage data correctly.

Update your final runtime stage in the `Dockerfile` to include the following:

```dockerfile
# ... inside your final runtime stage ...

# 1. Copy Go toolchain from the builder stage
COPY --from=builder /usr/local/go /usr/local/go

# 2. Set Go environment variables so the app can use internal go tools
ENV GOROOT=/usr/local/go
ENV PATH=/usr/local/go/bin:${PATH}

# 3. Copy go.mod and go.sum (Required for dependency resolution during coverage)
COPY --from=builder /src/go.mod /src/go.sum /app/

# 4. Set the GOMOD environment variable
ENV GOMOD=/app/go.mod

# ... rest of your dockerfile ...
```

> **Note:** If you face issues with toolchain downloads in restricted environments, you may also need to set `ENV GOTOOLCHAIN=local` and configure your `GOPROXY` in the Dockerfile.

#### 4. Run Deduplication

For Docker, run:

```bash
keploy test -c "docker compose up" --containerName containerName --dedup
```

For Native, run:

```bash
keploy test -c ./main --dedup
```

This will generate a `dedupData.yaml` file.

After this, run:

```bash
keploy dedup
```

This command will create a `duplicates.yaml` file which will contain all the test cases which were found to be duplicate.

In order to remove all the duplicate test cases, run the following command:

```bash
keploy dedup --rm
```

### For Java Applications

#### 1. Pre-requisite

Java dynamic deduplication uses JaCoCo runtime coverage. Attach the Keploy Java agent to emit per-test coverage signals, and attach the JaCoCo runtime agent so the SDK can read the coverage data. The Java agent is framework-agnostic across Spring Boot, Dropwizard/Jersey, plain executable jars, classpath-based apps, servlet/WAR archives, etc.

Both agents attach at JVM startup via `-javaagent:`. They do not modify your application bytecode either at compile time or while classes load, so no source code or `pom.xml` changes are required to enable dedup.

You only need `keploy-sdk.jar` and `jacocoagent.jar` available on disk wherever you reference them with `-javaagent:` at runtime. Fetch them in whichever way fits your workflow:

**Option A**, one-off fetch with the Maven CLI:

```bash
mvn dependency:copy \
  -Dartifact=io.keploy:keploy-sdk:2.0.6 \
  -DoutputDirectory=target -Dmdep.stripVersion=true

mvn dependency:copy \
  -Dartifact=org.jacoco:org.jacoco.agent:0.8.12:jar:runtime \
  -DoutputDirectory=target -Dmdep.stripVersion=true
```

**Option B**, direct download from Maven Central (no Maven required):

```bash
mkdir -p target

curl -L -o target/keploy-sdk.jar \
  https://repo.maven.apache.org/maven2/io/keploy/keploy-sdk/2.0.6/keploy-sdk-2.0.6.jar

curl -L -o target/jacocoagent.jar \
  https://repo.maven.apache.org/maven2/org/jacoco/org.jacoco.agent/0.8.12/org.jacoco.agent-0.8.12-runtime.jar
```

**Option C**, let your Maven build copy them automatically. If you'd rather Maven fetch the agents during your normal build, add the following plugin block to your `pom.xml`. It runs at the `package` phase and only copies the two JARs alongside your app jar; it does not alter the compile classpath, your application bytecode, or any source file:

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

Run the app with both agents attached:

```bash
java \
  -javaagent:target/keploy-sdk.jar \
  -javaagent:target/jacocoagent.jar \
  -jar target/app.jar
```

#### 2. Build Configuration

Build the application before running Keploy so the Java class files are available for coverage analysis:

```bash
mvn clean package -DskipTests
```

By default, the SDK scans Maven `target/classes`, Gradle `build/classes/java/main`, executable jars, Spring Boot `BOOT-INF/classes`, servlet `WEB-INF/classes`, and runtime classpath archives. For custom layouts or restricted Docker images, set `KEPLOY_JAVA_CLASS_DIRS` to the class directories or archives that should be analyzed. For shaded or uber-jar Docker images, copy the compiled application classes into the image and point `KEPLOY_JAVA_CLASS_DIRS` at that directory so dependency classes do not participate in dedup signatures.

#### 3. Dockerfile Configuration (Important for Docker Users)

When you use Docker or Docker Compose, copy four artifacts into the runtime image and attach both agents in the entrypoint:

```dockerfile
COPY target/app.jar           /app/app.jar
COPY target/keploy-sdk.jar    /app/keploy-sdk.jar
COPY target/jacocoagent.jar   /app/jacocoagent.jar
COPY target/classes           /app/classes

ENV KEPLOY_JAVA_CLASS_DIRS=/app/classes

ENTRYPOINT ["java", \
  "-javaagent:/app/keploy-sdk.jar", \
  "-javaagent:/app/jacocoagent.jar", \
  "-jar", "/app/app.jar"]
```

Keploy injects a shared `keploy-sockets-vol:/tmp` mount into both the application container and the Keploy agent container at replay time so the dedup sockets are visible on both sides. Keep `/tmp` writable in the container; do not add a conflicting `/tmp` bind mount or `tmpfs`. Restricted containers (non-root user, read-only root filesystem, dropped capabilities) work as long as `/tmp` stays writable.

#### 4. Run Deduplication

For Docker, run:

```bash
keploy test -c "docker compose up" --container-name containerName --dedup --language java
```

For Native, run:

```bash
keploy test -c "java -javaagent:target/keploy-sdk.jar -javaagent:target/jacocoagent.jar -jar target/app.jar" --dedup --language java
```

This produces `dedupData.yaml`, a per-testcase coverage map (`testSetID/testCaseID` to executed lines per source file) Keploy uses to compute redundancy.

```bash
keploy dedup
```

This reads `dedupData.yaml` and writes `duplicates.yaml`, listing the testcases that dedup marked redundant (grouped by test-set). To remove those testcases from the local Keploy test set:

```bash
keploy dedup --rm
```
