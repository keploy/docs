---
id: deduplication
title: Remove Duplicates Tests
sidebar_label: Remove Duplicate Tests
description: "Remove duplicate test cases with Keploy Enterprise deduplication — save time and resources by eliminating redundant tests."
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
---

import ProductTier from '@site/src/components/ProductTier';

<ProductTier tiers="Enterprise" offerings="Self-Hosted, Dedicated" />

## Why Deduplication? ❄️

When developing or maintaining a software, it is common for test suites to grow in size. This often results in redundancy, as many test cases cover the same functions or scenarios. This is where Test Deduplication comes into play.

It simplifies the testing process by removing redundant test cases, which saves time and resources while keeping the testcases which adds value to the overall coverage of the application.

## Usage 🛠️

To detect duplicate tests, simply run the below command, like so:

```bash
keploy test -c "docker compose up" --containerName containerName --dedup
```

### For Golang Applications

**1. Pre-requisite**

Install the `keploy/go-sdk/v3/keploy` : -

```bash
go get github.com/keploy/go-sdk/v3/keploy
```

Add the following on top of your main application file : -

```bash
import _ "github.com/keploy/go-sdk/v3/keploy"
```

**2. Build Configuration**

Update the `go build` command in your Dockerfile (or native build script) to include coverage flags. These are required for deduplication to calculate coverage accurately.

```bash
RUN go build -cover -covermode=atomic -coverpkg=./... -o /app/main .
```

**3. Dockerfile Configuration (Important for Docker Users)**

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

**4. Run Deduplication**

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

**1. Pre-requisite**

Add the Keploy Java SDK to your application:

```xml
<dependency>
    <groupId>io.keploy</groupId>
    <artifactId>keploy-sdk</artifactId>
    <version>2.0.0</version>
</dependency>
```

For Spring Boot applications, register the Keploy middleware in your main class:

```java
import io.keploy.servlet.KeployMiddleware;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Import;

@SpringBootApplication
@Import(KeployMiddleware.class)
public class App {
}
```

Java dynamic deduplication uses JaCoCo runtime coverage. The SDK reads coverage in-process via JaCoCo's runtime API (`org.jacoco.agent.rt.RT.getAgent()`), so attaching the JaCoCo Java agent is enough — no TCP server flags, no `--pass-through-ports`:

```bash
java -javaagent:/path/to/org.jacoco.agent-runtime.jar -jar target/app.jar
```

If the in-process API is unavailable for some reason (for example, an isolated classloader), the SDK transparently falls back to JaCoCo's TCP server mode. To force the fallback, launch JaCoCo in `tcpserver` mode and tell Keploy to leave that port alone:

```bash
java -javaagent:/path/to/org.jacoco.agent-runtime.jar=address=127.0.0.1,port=36320,output=tcpserver \
  -jar target/app.jar
```

The default JaCoCo endpoint for the fallback is `127.0.0.1:36320`. You can override it with `KEPLOY_JACOCO_HOST` and `KEPLOY_JACOCO_PORT`, or with the JVM properties `keploy.jacoco.host` and `keploy.jacoco.port`. When using the fallback, add the JaCoCo port to `--pass-through-ports` so coverage-control traffic is not mocked.

**2. Build Configuration**

Build the application before running Keploy so the Java class files are available for coverage analysis:

```bash
mvn clean package -DskipTests
```

By default, the SDK scans `target/classes`, `build/classes/java/main`, and runtime classpath jars. For custom layouts or restricted Docker images, set `KEPLOY_JAVA_CLASS_DIRS` to the class directories or jars that should be analyzed.

**3. Dockerfile Configuration (Important for Docker Users)**

When you use Docker or Docker Compose, make sure the final runtime image contains:

- the runnable application jar,
- the JaCoCo runtime agent jar,
- the compiled classes or the fat jar that contains the application classes.

For example:

```dockerfile
COPY target/app.jar /app/app.jar
COPY target/classes /app/target/classes
COPY jacocoagent.jar /app/jacocoagent.jar
```

Then run the app with the JaCoCo agent attached:

```bash
java -javaagent:/app/jacocoagent.jar -jar /app/app.jar
```

Keploy and the Java SDK exchange per-test coverage signals over `/tmp/coverage_control.sock` and `/tmp/coverage_data.sock`. For Docker and Docker Compose, bind-mount host `/tmp` into the application container so both processes see the same socket paths.

For hardened Docker runs, the Java dedup sample is validated with a non-root runtime user, a read-only root filesystem, dropped Linux capabilities, `no-new-privileges`, and host `/tmp` bind-mounted into the container for the Keploy control/data sockets and JaCoCo output. Do not replace the shared `/tmp` bind mount with a container-only `tmpfs` or named volume; Keploy on the host will not be able to reach the Java SDK control socket.

**4. Run Deduplication**

For Docker, run:

```bash
keploy test -c "docker compose up" --containerName containerName --dedup --language java
```

For Native, run:

```bash
keploy test -c "java -javaagent:/path/to/org.jacoco.agent-runtime.jar -jar target/app.jar" --dedup --language java
```

If the SDK falls back to the JaCoCo TCP server, also pass `--pass-through-ports <jacoco-port>` so Keploy does not try to mock the coverage-control connection.

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
