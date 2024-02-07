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
keyword:
  - Mux Framework
  - MySQL
  - Golang
  - API Test generator
  - Auto Testcase generation
---

## Introduction

A sample url shortener app to test Keploy integration capabilities using [Mux](https://github.com/gorilla/mux) and [MySQL](https://www.mysql.com/). Buckle up, it's gonna be a fun ride! 🎢

## Pre-Requisite 🛠️

- Install WSL (`wsl --install`) for <img src="/docs/img/os/windows.png" alt="Windows" width="3%" /> Windows.

## Optional 🛠️

- Install Colima( `brew install colima && colima start` ) for <img src="/docs/img/os/macos.png" alt="MacOS" width="3%" /> MacOs.

## Get Started! 🎬

## Clone a sample URL shortener app 🧪

```bash
git clone https://github.com/keploy/samples-go.git && cd samples-go/mux-mysql
go mod download
```

## Installation Keploy

Keploy can be installed on Linux directly and on Windows with the help of WSL. Based on your system archieture, install the keploy latest binary release

Depending on your OS, choose your adventure:

- <details>
   <summary><img src="/docs/img/os/linux.png" alt="Linux" width="3%" /> Linux or <img src="/docs/img/os/windows.png" alt="Windows" width="3%" /> Windows</summary>

  Alright, let's equip ourselves with the **latest Keploy binary**:

  ```bash
  curl --silent --location "https://github.com/keploy/keploy/releases/latest/download/keploy_linux_amd64.tar.gz" | tar xz -C /tmp
  sudo mkdir -p /usr/local/bin && sudo mv /tmp/keploy /usr/local/bin && keploy
  ```

  If everything goes right, your screen should look a bit like this:

   <img src="/docs/img/code-snippets/install-keploy-logs.png" alt="Test Case Generator" width="50%" />

  Moving on...

   <details>
   <summary style={{ fontWeight: 'bold', fontSize: '1.17em', marginLeft: '0.5em' }}>Run App on 🐧 Linux / WSL </summary>

  ### Start MySQL Instance

  Start the MySQL instance

  ```bash
    docker run -p 3306:3306 --rm --name mysql --network keploy-network -e MYSQL_ROOT_PASSWORD=my-secret-pw -d mysql:latest
  ```

  ### Capture the Testcases

  Now, we will create the binary of our application:-

  ```zsh
  export ConnectionString="root:my-secret-pw@tcp(localhost:3306)/mysql"
  go build -o main
  ```

  Once we have our binary file ready,this command will start the recording of API calls using ebpf:-

  ```shell
  sudo -E keploy record -c "./main"
  ```

  Make API Calls using Hoppscotch, Postman or cURL command. Keploy with capture those calls to generate the test-suites containing testcases and data mocks.

  ### Generate testcases

  To generate testcases we just need to make some API calls. You can use [Postman](https://www.postman.com/), [Hoppscotch](https://hoppscotch.io/), or simply `curl`

  #### Generate shortened url

  ```bash
  '{
  curl --request POST \
    --url http://localhost:8082/url \
    --header 'content-type: application/json' \
    --data '{
    "url": "https://github.com"
  }'
  ```

  this will return the shortened url. The ts would automatically be ignored during testing because it'll always be different.

  ```bash
  {"message":"Converted","link":"http://localhost:8080/link/1","status":true}
  ```

  #### Access all the shortened urls

  1. By using Curl Command

  ```bash
  curl localhost:8080/all
  ```

  Now both these API calls were captured as **editable** testcases and written to `keploy/tests` folder. The keploy directory would also have `mocks` file that contains all the outputs of MySQL operations. Here's what the folder structure look like:

  ![Testcase](/img/mux-mysql-keploy-record.png)

  Now, let's see the magic! ✨💫

  Want to see if everything works as expected?

  ## Run the Testcases

  Now let's run the test mode (in the echo-sql directory, not the Keploy directory).

  ```shell
  sudo -E keploy test -c "./main" --delay 10
  ```

  output should look like

  ![Testrun](/img/mux-mysql-keploy-tests.png)

  So no need to setup fake database/apis MySQL or write mocks for them. Keploy automatically mocks them and, **The application thinks it's talking to MySQL 😄**

  ## Wrapping it up 🎉

  Congrats on the journey so far! You've seen Keploy's power, flexed your coding muscles, and had a bit of fun too! Now, go out there and keep exploring, innovating, and creating! Remember, with the right tools and a sprinkle of fun, anything's possible.😊🚀

  Happy coding! ✨👩‍💻👨‍💻✨

   </details>

   <details>
   <summary style={{ fontWeight: 'bold', fontSize: '1.17em', marginLeft: '0.5em' }}> Run App with <img src="/docs/img/os/docker.png" alt="Docker Container" width="3%" /> Docker </summary>

  >To establish a network for your application using Keploy on Docker, follow these steps.
  >If you're using a docker-compose network, replace keploy-network with your app's `docker_compose_network_name` below.

  ## Let's start the MySQL Instance

  Start the MySQL instance:-

  ```zsh
    docker run -p 3306:3306 --rm --name mysql -e MYSQL_ROOT_PASSWORD=my-secret-pw -d mysql:latest
  ```

  Now, we will create the docker image of our application:-

  ```zsh
  docker build -t url-short .
  ```

  ## Capture the Testcases

  ```zsh
  keploy record -c "docker run -p 8080:8080 --name urlshort --rm --network keploy-network url-short:latest"
  ```

  ![Testcase](https://github.com/heyyakash/samples-go/assets/85030597/2b4f3c04-4631-4f9a-b317-7fdb6db87879)

  ### Generate testcases

  To genereate testcases we just need to make some API calls. You can use Postman, Hoppscotch, or simply curl

  1. Generate shortned url

  ```bash
  curl --request POST \
    --url http://localhost:8082/url \
    --header 'content-type: application/json' \
    --data '{
    "url": "https://google.com"
  }'
  ```

  this will return the shortened url.

  ```json
  {
  curl -X POST localhost:8080/create -H "Content-Type: application/json" -d '{"link":"https://google.com"}'
  }
  ```

  2. Redirect to original url from shòrtened url

  ```bash
  curl localhost:8080/links/1
  ```

  Now, let's see the magic! 🪄💫

  Now both these API calls were captured as a testcase and should be visible on the Keploy CLI. You should be seeing an app named keploy folder with the test cases we just captured and data mocks created

  ## Run the captured testcases

  Now that we have our testcase captured, run the test file.

  ```zsh
  keploy test -c "sudo docker run -p 8082:8082 --net keploy-network --name echoSqlApp echo-app:1.0 echoSqlApp" --delay 10
  ```

  So no need to setup dependencies like mongoDB, web-go locally or write mocks for your testing.

  The application thinks it's talking to mongoDB 😄

  We will get output something like this:
  ![Testrun](https://github.com/heyyakash/samples-go/assets/85030597/472cab5e-9687-4fc5-bd57-3c52f56feedf)

  ## Wrapping it up 🎉

  Congrats on the journey so far! You've seen Keploy's power, flexed your coding muscles, and had a bit of fun too! Now, go out there and keep exploring, innovating, and creating! Remember, with the right tools and a sprinkle of fun, anything's possible.😊🚀

  Happy coding! ✨👩‍💻👨‍💻✨
   </details>

   </details>

- <details>
   <summary><img src="/docs/img/os/macos.png" alt="MacOS" width="3%" /> MacOs </summary>

  Dive straight in, but first in case you're using **Keploy** with **Colima**, give it a gentle nudge with (`colima start`). Let's make sure it's awake and ready for action!

  ### Use Keploy with Docker-Desktop

  Note: To run Keploy on MacOS through [Docker](https://docs.docker.com/desktop/release-notes/#4252) the version must be `4.25.2` or above.

  #### Creating Docker Volume

  ```bash
  docker volume create --driver local --opt type=debugfs --opt device=debugfs debugfs
  ```

  ### Use Keploy with Colima

  To start colima, you can run:
  ```bash
  colima start
  ```

  ## Let's start the MySQL Instance

  Using the docker-compose file we will start our instance:-

  ```zsh
  docker run -p 3306:3306 --rm --name mysql --network keploy-network -e MYSQL_ROOT_PASSWORD=my-secret-pw -d mysql:latest
  ```

  Now, we will create the docker image of our application:-

  ```zsh
  docker build -t url-short .
  ```

  ## Capture the Testcases

  ```zsh
  keploy record -c "docker run -p 8080:8080 --name urlshort --rm --network keploy-network url-short:latest"
  ```

  ![Testcase](https://github.com/heyyakash/samples-go/assets/85030597/2b4f3c04-4631-4f9a-b317-7fdb6db87879)

  ### Generate testcases

  To genereate testcases we just need to make some API calls. You can use Postman, Hoppscotch, or simply curl

  1. Generate shortned url

  ```bash
  curl --request POST \
    --url http://localhost:8082/url \
    --header 'content-type: application/json' \
    --data '{
    "url": "https://google.com"
  }'
  ```

  this will return the shortened url.

  ```json
  {
    "message": "Converted",
    "link": "http://localhost:8080/link/1",
    "status": true
  }
  ```

  2. Redirect to original url from shòrtened url

  ```
  curl --request GET \
    --url http://localhost:8082/Lhr4BWAi
  ```

  Now, let's see the magic! 🪄💫

  Now both these API calls were captured as a testcase and should be visible on the Keploy CLI. You should be seeing an app named keploy folder with the test cases we just captured and data mocks created

  ## Run the captured testcases

  Now that we have our testcase captured, run the test file.

  ```zsh
   keploy record -c "docker run -p 8080:8080 --name urlshort --rm --network keploy-network url-short:latest"
  ```

  So no need to setup dependencies like MySQL, web-go locally or write mocks for your testing.

  The application thinks it's talking to MySQL 😄

  We will get output something like this:
  ![Testrun](/img/mux-mysql-keploy-tests.png)

  ## Wrapping it up 🎉

  Congrats on the journey so far! You've seen Keploy's power, flexed your coding muscles, and had a bit of fun too! Now, go out there and keep exploring, innovating, and creating! Remember, with the right tools and a sprinkle of fun, anything's possible.😊🚀

  Happy coding! ✨👩‍💻👨‍💻✨

   </details>
