---
id: samples-mux
title: Mux-SQL Sample Application
description: The following sample app showcases how to use Mux framework and the Keploy Platform.
tags:
  - Mux Framework
  - Postgres
  - SQL
keyword:
  - Mux Framework
  - Postgres
  - SQL
  - Golang
  - API Test generator
  - Auto Testcase generation
---

# Product Catelog

A sample url shortener app to test Keploy integration capabilities

## Installation Setup

```bash
git clone https://github.com/keploy/samples-go.git && cd samples-go/mux-sql
go mod download
```

## Installation Keploy

Keploy can be installed on Linux directly and on Windows with the help of WSL. Based on your system archieture, install the keploy latest binary release

**1. AMD Architecture**

```shell
curl --silent --location "https://github.com/keploy/keploy/releases/latest/download/keploy_linux_amd64.tar.gz" | tar xz -C /tmp

sudo mkdir -p /usr/local/bin && sudo mv /tmp/keploy /usr/local/bin && keploy
```

<details>
<summary> 2. ARM Architecture </summary>

```shell
curl --silent --location "https://github.com/keploy/keploy/releases/latest/download/keploy_linux_arm64.tar.gz" | tar xz -C /tmp

sudo mkdir -p /usr/local/bin && sudo mv /tmp/keploy /usr/local/bin && keploy
```

</details>

### Start Postgres Instance

Using the docker-compose file we will start our postgres instance:-

```bash
# Start Postgres
docker-compose up -d
```

### Capture the Testcases

> **Since, we are on the local machine the Postgres Host will be `localhost`.**

Now, we will create the binary of our application:-

```zsh
go build
```

Once we have our binary file ready,this command will start the recording of API calls using ebpf:-

```shell
sudo -E keploy record -c "./test-app-product-catelog"
```

Make API Calls using Hoppscotch, Postman or cURL command. Keploy with capture those calls to generate the test-suites containing testcases and data mocks.

#### Generate testcases

To genereate testcases we just need to make some API calls. You can use [Postman](https://www.postman.com/), [Hoppscotch](https://hoppscotch.io/), or simply `curl`

### 1. Generate shortned url

```bash
curl --request POST \
  --url http://localhost:8010/product \
  --header 'content-type: application/json' \
  --data '{
    "name":"Bubbles",
    "price": 123
}'
```

this will return the response.

```json
{
  "id": 1,
  "name": "Bubbles",
  "price": 123
}
```

#### 2. Redirect to original url from shortened url

1. By using Curl Command

```bash
curl --request GET \
  --url http://localhost:8010/products
```

2. By querying through the browser `http://localhost:8010/products`

Now both these API calls were captured as editable testcases and written to `keploy/tests folder`. The keploy directory would also have `mocks` files that contains all the outputs of postgres operations.

![Testcase](/img/testcase.png?raw=true)

Now, let's see the magic! 🪄💫

## Generate Test Runs

Now let's run the test mode (in the mux-sql directory, not the Keploy directory).

```shell
sudo -E keploy test -c "./test-app-product-catelog" --delay 10
```

Once done, you can see the Test Runs on the Keploy server, like this:

![Testrun](/img/testrun.png?raw=true)

So no need to setup fake database/apis like Postgres or write mocks for them. Keploy automatically mocks them and, **The application thinks it's talking to Postgres 😄**

# Using Docker

Keploy can be used on Linux & Windows through Docker, and on MacOS by the help of [Colima](https://docs.keploy.io/docs/server/macos/installation/#using-colima)

## Create Keploy Alias

To establish a network for your application using Keploy on Docker, follow these steps.

If you're using a docker-compose network, replace keploy-network with your app's `docker_compose_network_name` below.

```shell
alias keploy='sudo docker run --pull always --name keploy-v2 -p 16789:16789 --privileged --pid=host -it -v "$(pwd)":/files -v /sys/fs/cgroup:/sys/fs/cgroup -v /sys/kernel/debug:/sys/kernel/debug -v /sys/fs/bpf:/sys/fs/bpf -v /var/run/docker.sock:/var/run/docker.sock --rm ghcr.io/keploy/keploy'
```

## Let's start the MongoDB Instance

Using the docker-compose file we will start our mongodb instance:-

```shell
docker-compose up -d
```

> Since we are using docker to run the application, we need to update the `postgres` host on line 10 in `main.go`, update the host to `mux-sql-postgres-1`.
> Now, we will create the docker image of our application:-

```shell
docker build -t mux-app:1.0 .
```

## Capture the Testcases

```zsh
keploy record -c "docker run -p 8010:8010 --rm --name muxSqlApp --network keploy-network mux-app:1.0"
```

![Testcase](/img/testcase.png?raw=true)

### Generate testcases

To genereate testcases we just need to make some API calls. You can use Postman, Hoppscotch, or simply curl

```bash
curl --request POST \
  --url http://localhost:8010/product \
  --header 'content-type: application/json' \
  --data '{
    "name":"Bubbles",
    "price": 123
}'
```

this will return the response.

```json
{
  "id": 1,
  "name": "Bubbles",
  "price": 123
}
```

#### 2. Redirect to original url from shortened url

1. By using Curl Command

```bash
curl --request GET \
  --url http://localhost:8010/products
```

2. By querying through the browser `http://localhost:8010/products`

Now both these API calls were captured as editable testcases and written to `keploy/tests folder`. The keploy directory would also have `mocks` files that contains all the outputs of postgres operations.

## Run the captured testcases

Now that we have our testcase captured, run the test file.

```shell
keploy test -c "sudo docker run -p 8010:8010 --net keploy-network --rm --name muxSqlApp mux-app:1.0" --delay 10
```

So no need to setup dependencies like mongoDB, web-go locally or write mocks for your testing.

The application thinks it's talking to mongoDB 😄

We will get output something like this:
![Testrun](/img/testrun.png?raw=true)
