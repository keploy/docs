---
id: dev-guide
title: Dev Guide
sidebar_label: Dev Guide
tags:
  - explanation
  - dev-guide
---

# Dev Guide

1. **Platform and it’s requirements:** <br/>
   To run keploy on macOS or windows, you need to create a Linux VM. <br/>
   For MacOS: Install [Lima](https://github.com/lima-vm/lima#installation) to create a Linux VM.<br/>
   For Windows: Install [WSL](https://learn.microsoft.com/en-us/windows/wsl/install) to create a Linux VM.

2. **Pre-requisites:**

[Install Golang](https://go.dev/doc/install)

3. **Cloning Keploy Repository:**

```shell
git clone https://github.com/keploy/keploy.git && cd keploy
```

Download go dependencies:

```shell
go mod download
```

4. **How to run Keploy on v2?**

The Keploy CLI works by intercepting all network traffic between your application and its dependencies. It then records the API calls, database queries, and other interactions that your application makes. Once you have finished recording test cases, Keploy can generate test cases and data mocks in YAML format.

#### Keploy runs in the following modes:

`record`: Record the keploy testcases from the API calls <br/>
`test`: Run the recorded testcases and execute assertions <br/>
`completion`: Generate the autocompletion script for the specified shell <br/>
`serve`: Run the keploy server to expose test apis <br/>

To run keploy on an application, you can use this [gin-mongo URL Shortener](https://github.com/keploy/samples-go/tree/main/gin-mongo) sample application:

#### Clone the repository and navigate to the directory:

```shell
git clone https://github.com/keploy/samples-go.git && cd samples-go/gin-mongo
```

#### Download dependencies:

```shell
go mod download
```

#### Generate binary of the application:

```shell
go build -o gin-mongo-binary
```

### To run Keploy natively:

#### Capturing Test Cases:

```shell
 go run -exec "sudo -E env 'PATH=$PATH'" main.go record -c "path/to/go/binary/of/application"
```

After entering record mode, hit request to your application to generate test cases that will be replayed during the test phase. <br/>
If using POSTMAN, turn off the keep-alive header.

#### Running Test Cases:

```shell
go run -exec "sudo -E env 'PATH=$PATH'" main.go test -c "path/to/go/binary/of/application" --delay 10
```

Generated test cases can be seen inside keploy directory of the keploy repository. <br/>

### If trying to run via Keploy binary:

#### Generate Keploy Binary:

```shell
go build -o keploy && sudo mv keploy /usr/local/bin`
```

#### Capturing Test Cases:

```shell
sudo keploy record -c "path/to/go/binary"
```

#### Running Test Cases:

```shell
sudo keploy test -c "path/to/go/binary" --delay 10
```

Note: Use `––debug` flag to run keploy in debug mode. It helps you to pinpoint the error by looking at the logs.

5. **How to run Keploy via docker?**

#### Install the Keploy Docker Image:

```shell
docker install ghcr.io/keploy/keploy
```

#### Create Keploy Alias:

```shell
alias keployV2='sudo docker run --name keploy-ebpf -p 16789:16789 --network keploy-network --privileged --pid=host -it -v "$(pwd)":/files -v /sys/fs/cgroup:/sys/fs/cgroup -v /sys/kernel/debug:/sys/kernel/debug -v /sys/fs/bpf:/sys/fs/bpf -v /var/run/docker.sock:/var/run/docker.sock --rm ghcr.io/keploy/keploy'
```

#### Capture Test Cases:

```shell
keployV2 record -c "docker run -p 8080:8080 --name <containerName>  --network keploy-network --rm <imageName>"" --containerName  <containerName>
```

#### Running Test Cases:

```shell
keployV2 test --c "docker run -p 8080:8080  --name <containerName> --network keploy-network --rm <imageName>" --delay 10
```

6. **How to test locally built docker image?**

#### Build Docker Image:

```shell
docker build -t <nameOfImage>
```

#### Create Alias:

```shell
alias keployV2='sudo docker run --name keploy-ebpf -p 16789:16789 --network keploy-network --privileged --pid=host -it -v "$(pwd)":/files -v /sys/fs/cgroup:/sys/fs/cgroup -v /sys/kernel/debug:/sys/kernel/debug -v /sys/fs/bpf:/sys/fs/bpf -v /var/run/docker.sock:/var/run/docker.sock --rm  <nameOfImage>
```

#### Capture Test Cases:

```shell
keployV2 record -c "docker run -p 8080:8080 --name <containerName>  --network keploy-network --rm <imageName>"" --containerName  <containerName>
```

#### Running Test Cases:

```shell
keployV2 test --c "docker run -p 8080:8080  --name <containerName> --network keploy-network --rm <imageName>" --delay 10
```
