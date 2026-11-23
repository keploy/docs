---
id: deduplication
title: Remove Duplicates Tests
sidebar_label: Remove Duplicate Tests
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
