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

Welcome to the world of Keploy development! This guide will help you set up Keploy locally.

### 1. **Setting Up Your Platform**:

_If you want to try Keploy on macOS or Windows, no worries — you’ll just need to set up a Linux VM._

- For macOS, install [Lima](https://github.com/lima-vm/lima#installation).
- If you're on Windows, install [WSL](https://learn.microsoft.com/en-us/windows/wsl/install).

Note: Linux Users are good to go.

### 2. **Pre-requisites**:

First things first, ensure you have [Golang](https://go.dev/doc/install) installed.

### 3. **Clone Keploy Repository**:

Time to get your hands on Keploy!:

```shell
git clone https://github.com/keploy/keploy.git && cd keploy
go mod download
```

Once done, build the binary

```shell
go build -race -tags=viper_bind_struct -o keploy .
sudo mv keploy /usr/local/bin/
sudo chmod +x /usr/local/bin/keploy
```

**_Now we have successfully set up Keploy. Let’s test it with the sample app._**

#### Keploy operates in two modes:

- `record`: Capture Keploy test cases from API calls.
- `test`: Execute recorded test cases and validate assertions.

The Keploy CLI operates by capturing all network traffic between your application and its dependencies.

It meticulously records API calls, database queries, and any other interactions your application engages in.

Once the recording phase is complete, Keploy can effortlessly generate test cases and data mocks in YAML format.

If you don't have any samples app, you can use the [gin-mongo URL Shortener](https://github.com/keploy/samples-go/tree/main/gin-mongo) sample application:

#### Let's clone sample app repo:

```shell
git clone https://github.com/keploy/samples-go.git && cd samples-go/gin-mongo
go mod download   # Download dependencies:
go build -o gin-mongo-binary  # Generate binary of the application:
```

### 4. Now let's try running keploy:

#### Capturing Test Cases:

```shell
sudo keploy record -c "path/to/go/binary"
```

#### Running Test Cases:

```shell
sudo keploy test -c "path/to/go/binary" --delay 10
```

Note: Use the `--debug` flag to run Keploy in debug mode for detailed logs.

### Also you can Test Locally Built Docker Image:

#### Build Docker Image:

Note: Run the below command inside the keploy respository and make sure there is no directory by the name of keploy inside the main keploy repository.

```shell
sudo docker image build -t ghcr.io/keploy/keploy:v2-dev .
```

#### Remember setting up the Keploy binary. See [Setup Keploy using Binary](#3-clone-keploy-repository) for details.

#### Capture Test Cases:

```shell
sudo keploy record -c "docker run -p -p <appPort>:<hostPort>  --name <containerName> --network keploy-network --rm <imageName>"
```

#### Running Test Cases:

```shell
sudo keploy test -c "docker run -p -p <appPort>:<hostPort>  --name <containerName> --network keploy-network --rm <imageName>" --delay 10
```

There you have it! With this guide, you're all set to dive into Keploy development.

Happy testing! 🧪🔍💻

> **Note** :- Run `go run github.com/99designs/gqlgen generate --config pkg/graph/gqlgen.yml` to generate the graphql server stubs which can be used when working with unit testing libraries like JUnit, PyTest, etc..

Hope this helps you out, if you still have any questions, reach out to us on [slack](https://keploy.slack.com/join/shared_invite/zt-357qqm9b5-PbZRVu3Yt2rJIa6ofrwWNg) .
