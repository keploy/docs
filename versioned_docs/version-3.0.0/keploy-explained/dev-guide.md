---
id: contribution-guide
title: Contribution Guide
sidebar_label: Contribution Guide
tags:
  - explanation
  - dev guide
  - contribution guide
---

# Contribution Guide 🚀

Welcome to the world of Keploy development! Here, we'll get you up and running smoothly, making your Keploy journey a breeze.

### 1. **Setting Up Your Platform**:

Running Keploy on macOS or Windows? No problem! You'll need to create a Linux VM.

- For macOS, install [Lima](https://github.com/lima-vm/lima#installation).
- If you're on Windows, install [WSL](https://learn.microsoft.com/en-us/windows/wsl/install).

Note: Linux Users are good to go.

### 2. **Pre-requisites**:

First things first, ensure you have [Golang](https://go.dev/doc/install) installed.

### 3. **Cloning Keploy Repository**:

Time to get your hands on Keploy! Run these commands to clone the repository and download those Go dependencies:

```shell
git clone https://github.com/keploy/keploy.git && cd keploy
go mod download
```

### 4. Running Keploy on v2:

The Keploy CLI operates by capturing all network traffic between your application and its dependencies.
It meticulously records API calls, database queries, and any other interactions your application engages in.

Once the recording phase is complete, Keploy can effortlessly generate test cases and data mocks in YAML format.

#### Keploy operates in two modes:

- `record`: Capture Keploy test cases from API calls.
- `test`: Execute recorded test cases and validate assertions.

To dive into Keploy, you can use the [gin-mongo URL Shortener](https://github.com/keploy/samples-go/tree/main/gin-mongo) sample application:

#### Let's clone sample app repo:

```shell
git clone https://github.com/keploy/samples-go.git && cd samples-go/gin-mongo
go mod download   # Download dependencies:
go build -o gin-mongo-binary  # Generate binary of the application:
```

### Now let's try running keploy:

#### Capturing Test Cases:

```shell
 go run -exec "sudo -E env 'PATH=$PATH'" -tags=viper_bind_struct main.go record -c "path/to/go/binary/of/application"
```

After entering record mode, send requests to your application to generate test cases.

#### Running Test Cases:

```shell
go run -exec "sudo -E env 'PATH=$PATH'" -tags=viper_bind_struct main.go test -c "path/to/go/binary/of/application" --delay 10
```

Run Keploy server to expose test APIs:

```shell
go run -exec "sudo -E env 'PATH=$PATH'" -tags=viper_bind_struct main.go test -c "path/to/go/binary/of/application" --delay 10 --coverage
```

Generated test cases can be found inside the Keploy directory.

### 5. Setup Keploy using Binary:

#### Generate Keploy Binary:

```shell
go build -race -tags=viper_bind_struct -o keploy . && sudo mv keploy /usr/local/bin
```

#### Capturing Test Cases:

```shell
sudo -E env PATH="$PATH" keploy record -c "path/to/go/binary"
```

#### Running Test Cases:

```shell
sudo -E env PATH="$PATH" keploy test -c "path/to/go/binary" --delay 10
```

Note: Use the `--debug` flag to run Keploy in debug mode for detailed logs.

### 6. Setup Keploy via Docker:

#### Install the Keploy Docker Image:

```shell
docker pull ghcr.io/keploy/keploy
```

#### Create Keploy Alias:

```shell
alias keployV2='sudo docker run --pull always --name keploy-v2 -p 16789:16789 --network keploy-network --privileged --pid=host -it -v $(pwd):$(pwd) -w $(pwd) -v /sys/fs/cgroup:/sys/fs/cgroup -v /sys/kernel/debug:/sys/kernel/debug -v /sys/fs/bpf:/sys/fs/bpf -v /var/run/docker.sock:/var/run/docker.sock --rm ghcr.io/keploy/keploy'
```

#### Capture Test Cases:

```shell
keployV2 record -c "docker run -p 8080:8080 --name <containerName>  --network keploy-network --rm <imageName>"" --containerName  <containerName>
```

#### Running Test Cases:

```shell
keployV2 test --c "docker run -p 8080:8080  --name <containerName> --network keploy-network --rm <imageName>" --delay 10
```

### 7. Testing Locally Built Docker Image:

#### Build Docker Image:

Run the below command inside the keploy respository and make sure there is no directory by the name of keploy inside the main keploy repository.

```shell
sudo docker image build -t ghcr.io/keploy/keploy:v2-dev .
```

#### Create Alias:

```shell
alias keployV2='sudo docker run --name keploy-v2 -p 16789:16789 --privileged --pid=host -it -v $(pwd):$(pwd) -w $(pwd) -v /sys/fs/cgroup:/sys/fs/cgroup -v /sys/kernel/debug:/sys/kernel/debug -v /sys/fs/bpf:/sys/fs/bpf -v /var/run/docker.sock:/var/run/docker.sock -v '"$HOME"'/.keploy-config:/root/.keploy-config -v '"$HOME"'/.keploy:/root/.keploy --rm ghcr.io/keploy/keploy:v2-dev'
```

#### Remember setting up the Keploy binary. See [Setup Keploy using Binary](#5-setup-keploy-using-binary) for details.

#### Capture Test Cases:

```shell
sudo -E env PATH="$PATH" keployV2 record -c "docker run -p 8080:8080 --name <containerName>  --network keploy-network --rm <imageName>"" --containerName  <containerName>
```

#### Running Test Cases:

```shell
sudo -E env PATH="$PATH" keployV2 test --c "docker run -p 8080:8080  --name <containerName> --network keploy-network --rm <imageName>" --delay 10
```

There you have it! With this guide, you're all set to dive into Keploy development. Happy testing! 🧪🔍💻

> **Note** :- Run `go run github.com/99designs/gqlgen generate --config pkg/graph/gqlgen.yml` to generate the graphql server stubs which can be used when working with unit testing libraries like JUnit, PyTest, etc..

Hope this helps you out, if you still have any questions, reach out to us .

import GetSupport from '../concepts/support.md'

<GetSupport/>
