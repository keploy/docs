---
id: samples-bunjs
title: BunJS Sample Application
sidebar_label: BunJS + Mongo
description: The following sample app showcases how to use BunJS framework and the Keploy Platform.
tags:
  - BunJS Framework
  - MongoDB
keyword:
  - BunJS Framework
  - MongoDB
  - BunJS
  - API Test generator
  - Auto Testcase generation
---

# Sample Bun.js and MongoDB app

This is a sample app to test Keploy integration capabilities using [Bun.js](https://bun.sh) and [MongoDB](https://www.mongodb.com/).

## Pre-requsite 🛠️

- Install WSL (`wsl --install`) for <img src="/docs/img/os/windows.png" alt="Windows" width="3%" /> Windows.
- Install Colima( `brew install colima && colima start` ) for <img src="/docs/img/os/macos.png" alt="MacOS" width="3%" /> MacOs.
- Install BunJS ( `curl -fsSL https://bun.sh/install | bash` )


## Setup app

Now that we have bun installed, we will setup our application 

```zsh
git clone https://github.com/keploy/samples-typescript && cd samples-typescript/bun-mongo

# Install the dependencies
bun install
```

## Installation 📥

There are two ways to use Keploy:-

Depending on your OS, choose your adventure:

- <details>
    <summary><img src="/docs/img/os/linux.png" alt="Linux" width="3%" /> Linux or <img src="/docs/img/os/windows.png" alt="Windows" width="3%" /> Windows</summary>
    Keploy can be installed on Linux directly and on Windows with the help of WSL. Based on your system architecture, install the keploy latest binary release from here:-

    #### Linux
    
    1. AMD Architecture
    
    ```zsh
    curl --silent --location "https://github.com/keploy/keploy/releases/latest/download/keploy_linux_amd64.tar.gz" | tar xz -C /tmp
    
    sudo mkdir -p /usr/local/bin && sudo mv /tmp/keploy /usr/local/bin && keploy
    ```
    
    <details> 
    <Summary> 2. ARM Architecture </Summary>
    
    ```zsh
    curl --silent --location "https://github.com/keploy/keploy/releases/latest/download/keploy_linux_arm64.tar.gz" | tar xz -C /tmp
    
    sudo mkdir -p /usr/local/bin && sudo mv /tmp/keploy /usr/local/bin && keploy
    ```
    
    </details>
    
    #### Windows Subsystem for Linux (WSL)
    
    On Windows, WSL is required to run Keploy Binary. You must be running Windows 10 version 2004 and higher (Build 19041 and higher) or Windows 11 to use the commands below.
    
    ```bash
    wsl --install
    ```
    
    Once installed download and Install "Keploy Binary" :
    
    ```bash
    curl --silent --location "https://github.com/keploy/keploy/releases/latest/download/keploy_linux_amd64.tar.gz" | tar xz -C /tmp
    
    sudo mkdir -p /usr/local/bin && sudo mv /tmp/keploy /usr/local/bin && keploy
    ```
    
    ### Let's start the MongoDB Instance
    
    ```zsh
    docker-compose up -d
    ```
    
    > **Since we have setup our sample-app natively, we need to update the mongoDB host on line 41, in `supabun.ts`, from `mongodb://mongoDb-bun:27017/keploy` to `mongodb://localhost:27017/keploy`.**
    
    ### Capture the testcases
    
    ```bash
    sudo -E env PATH=$PATH keploy record -c 'bun run supabun.ts'
    ```
    
    Make API Calls using [Hoppscotch](https://hoppscotch.io), [Postman](https://postman.com) or cURL command. Keploy with capture those calls to generate the test-suites containing testcases and data mocks.
    
    1. Generate the testcases
    
    ```bash
    curl --request POST localhost:420/save
    ```
    
    we will get the output:
    
    ```
    {"succes":true}
    ```
    
    2. Fetch the data
    
    ```bash
    curl --request GET localhost:420/fetch
    ```
    
    this will provide us with the output:-
    
    ```
    {"succes":{"_id":"6513cfec0bc1a17a36c06337","name":"Cow","sound":"Moo","__v":0}}
    ```
    
    We will get the following output in our terminal
    
    ![Testcase](/img/testcase-bun.png)

  </details>
   <br/>

- <details> 
    <summary><img src="/docs/img/os/macos.png" alt="MacOS" width="3%" /> MacOs </summary>
    Keploy can be used on Linux & Windows through Docker, and on MacOS with the help of Colima.

    ## Create Keploy Alias
    
    We need to create an alias for Keploy:
    
    ```bash
    alias keploy='sudo docker run --pull always --name keploy-v2 -p 16789:16789 --privileged --pid=host -it -v "$(pwd)":/files -v /sys/fs/cgroup:/sys/fs/cgroup -v /sys/kernel/debug:/sys/kernel/debug -v /sys/fs/bpf:/sys/fs/bpf -v /var/run/docker.sock:/var/run/docker.sock --rm ghcr.io/keploy/keploy'
    ```
    
    ## Let's start the MongoDB Instance
    
    ```bash
    docker-compose up -d
    ```
    
    ## Capture the testcases
    
    1. We first need to build dockerimage of our application:-
    
    ```bash
    docker build -t bun-app:1.0 .
    ```
    
    2. Now we will run the keploy in record mode:-
    
    ```bash
    keploy record -c "docker run -p 420:420 --name bunMongoApp --network keploy-network bun-app:1.0"
    ```
    
    ### Let's generate the testcases.
    
    Make API Calls using [Hoppscotch](https://hoppscotch.io), [Postman](https://postman.com) or cURL command. Keploy with capture those calls to generate the test-suites containing testcases and data mocks.
    
    ```bash
    curl --request POST localhost:420/save
    ```
    
    we will get the output:
    
    ```
    {"succes":true}
    ```
    
    2. Fetch the data
    
    ```bash
    curl --request GET localhost:420/fetch
    ```
    
    this will provide us with the output:-
    
    ```
    {"succes":{"_id":"6513cfec0bc1a17a36c06337","name":"Cow","sound":"Moo","__v":0}}
    ```
    
    We will get the following output in our terminal
    
    ![Testcase](/img/testcase-bun.png)
    

  </details>

## Running the testcases

This is WIP and depended upon the issue by oven/bun & elysia:- https://github.com/elysiajs/elysia/issues/231
