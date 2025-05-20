---
id: samples-mysql
title: Mux MySQL Sample Application
sidebar_label: Mux + MySQL
description: The following sample app showcases how to use Mux framework and the Keploy Platform.
tags:
  - go
  - quickstart
  - samples
  - examples
  - tutorial
  - mysql
  - sql
  - mux-framework
keyword:
  - Mux Framework
  - MySQL
  - Golang
  - API Test generator
  - Auto Testcase generation
---

## Introduction

A sample url shortener app to test Keploy integration capabilities using [Mux](https://github.com/gorilla/mux) and MySQL. Buckle up, it's gonna be a fun ride! 🎢

import InstallationGuide from '../concepts/installation.md'

<InstallationGuide/>

## Get Started! 🎬

## Clone a sample URL shortener app 🧪

```bash
git clone https://github.com/keploy/samples-go.git && cd samples-go/mux-mysql
go mod download
```

## Installation Keploy

There are 2 ways you can run this sample application.

- [Using Docker compose : running application as well as MySQL on Docker container](#using-docker-compose-)
- [Using Docker container for MySQL and running application locally](#running-app-locally-on-linuxwsl-)

## Using Docker Compose 🐳

We will be using Docker compose to run the application as well as MySQL on Docker container.

### Start MySQL Instance

```bash
docker run -p 3306:3306 --rm --name mysql --network keploy-network -e MYSQL_ROOT_PASSWORD=my-secret-pw -d mysql:latest
```

#### Creating Docker Volume

```bash
docker volume create --driver local --opt type=debugfs --opt device=debugfs debugfs
```

### Capture the Testcases

Now, we will create the docker image of our application:-

```zsh
docker build -t url-short .
```

Once we have our Docker image file ready,this command will start the recording of API calls using ebpf:-

```shell
keploy record -c "docker run -p 8080:8080 --name urlshort --rm --network keploy-network url-short:latest"
```

Make API Calls using Postman or cURL command. Keploy with capture those calls to generate the test-suites containing testcases and data mocks.

### Generate testcases

To generate testcases we just need to make some API calls. You can use [Postman](https://www.postman.com/) or simply `curl`

#### Generate shortened url

```bash
curl --request POST \
  --url http://localhost:8080/create \
  --header 'content-type: application/json' \
  --data '{
  "link": "https://github.com"
}'
```

this will return the shortened url. The ts would automatically be ignored during testing because it'll always be different.

```bash
{
  "message":"Converted",
  "link":"http://localhost:8080/links/1",
  "status":true
}
```

#### Access all the shortened urls

```bash
curl --request GET http://localhost:8080/all
```

Now both these API calls were captured as **editable** testcases and written to `keploy/tests` folder. The keploy directory would also have `mocks` file that contains all the outputs of MySQL operations. Here's what the folder structure look like:

![Testcase](/img/mux-mysql-keploy-record.png)

Now, let's see the magic! ✨💫

Want to see if everything works as expected?

### Run the Testcases

Now let's run the test mode (in the echo-sql directory, not the Keploy directory).

```shell
keploy test -c "docker run -p 8080:8080 --name urlshort --rm --network keploy-network url-short:latest" --delay 10
```

output should look like

![Testrun](/img/mux-mysql-keploy-tests.png)

So no need to setup fake database/apis MySQL or write mocks for them. Keploy automatically mocks them and, **The application thinks it's talking to MySQL 😄**

### Wrapping it up 🎉

Congrats on the journey so far! You've seen Keploy's power, flexed your coding muscles, and had a bit of fun too! Now, go out there and keep exploring, innovating, and creating! Remember, with the right tools and a sprinkle of fun, anything's possible.😊🚀

Happy coding! ✨👩‍💻👨‍💻✨

**\*\*\*\***\*\*\*\*\***\*\*\*\*\***\*\*\*\*\***\*\*\*\*\***\*\*\*\*\***\*\*\*\*\***\_\_\_\***\*\*\*\*\***\*\*\*\*\***\*\*\*\*\***\*\*\*\*\***\*\*\*\*\***\*\*\*\*\***\*\*\***

## Running App Locally on Linux/WSL 🐧

We'll be running our sample application right on Linux, but just to make things a tad more thrilling, we'll have the database (MySQL) chill on Docker. Ready? Let's get the party started!🎉

> To establish a network for your application using Keploy on Docker, follow these steps.
> If you're using a docker-compose network, replace keploy-network with your app's `docker_compose_network_name` below.

### Let's start the MySQL Instance

```zsh
docker run -p 3306:3306 --rm --name mysql -e MYSQL_ROOT_PASSWORD=my-secret-pw -d mysql:latest
```

Now, we will create the binary of our application:-

```zsh
export ConnectionString="root:my-secret-pw@tcp(localhost:3306)/mysql"

go build -o main
```

### Capture the Testcases

```zsh
sudo -E PATH=$PATH keploy record -c "./main"
```

![Testcase](https://github.com/heyyakash/samples-go/assets/85030597/2b4f3c04-4631-4f9a-b317-7fdb6db87879)

### Generate testcases

To generate testcases we just need to make some API calls. You can use Postman, Hoppscotch, or simply curl

#### Generate shortened url

```bash
curl --request POST \
  --url http://localhost:8080/create \
  --header 'content-type: application/json' \
  --data '{
  "link": "https://google.com"
}'
```

this will return the shortened url.

```json
{
  "message": "Converted",
  "link": "http://localhost:8080/links/1",
  "status": true
}
```

#### Redirect to original url from shortened url

```zsh
curl -request GET localhost:8080/links/1
```

Now, let's see the magic! 🪄💫

Now both these API calls were captured as a testcase and should be visible on the Keploy CLI. You should be seeing an app named keploy folder with the test cases we just captured and data mocks created

### Run the captured testcases

Now that we have our testcase captured, run the test file.

```zsh
sudo -E PATH=$PATH keploy test -c "./main" --delay 10
```

So no need to setup dependencies like MySQL, web-go locally or write mocks for your testing.

The application thinks it's talking to MySQL 😄

We will get output something like this:
![Testrun](https://github.com/heyyakash/samples-go/assets/85030597/472cab5e-9687-4fc5-bd57-3c52f56feedf)

### Wrapping it up 🎉

Congrats on the journey so far! You've seen Keploy's power, flexed your coding muscles, and had a bit of fun too! Now, go out there and keep exploring, innovating, and creating! Remember, with the right tools and a sprinkle of fun, anything's possible.😊🚀

Hope this helps you out, if you still have any questions, reach out to us .

import GetSupport from '../concepts/support.md'

<GetSupport/>
