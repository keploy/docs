---
id: users-profile-sample-application
title: Users Profile Sample Application
sidebar_label: Gin-Mongo Sample 2
tags:
  - quickstart
  - go
  - sdk
  - tutorial
---

# Users-Profile

A sample application that get, create, update, and delete the data of a user in the database (MongoDB for this application).

## Prerequisites

1. [Go](https://go.dev/doc/install) 1.16 or later
2. [Docker](https://docs.docker.com/engine/install/) for running Keploy server
3. [Thunder Client](https://marketplace.visualstudio.com/items?itemName=rangav.vscode-thunder-client) / [Postman Desktop Agent](https://www.postman.com/downloads/postman-agent/) for testing localhost APIs
4. Code Editor ([VSCode](https://code.visualstudio.com/download), [Sublime Text](https://www.sublimetext.com/download), etc.)

## Installation

### Start Keploy Server

```
git clone https://github.com/keploy/keploy.git
cd keploy
docker-compose up
```

### Start Users-Profile sample application

```
git clone https://github.com/keploy/samples-go
cd samples-go
cd users-profile
go get .
go run .
```

## Routes

> Sample Application Port: http://localhost:8080

- `/user` : POST - Create a new user in the database
- `/user/:userId` : GET - Get a user from the database
- `/user/:userId` : PUT - Edit an existing user in the database
- `/user/:userId` : DELETE - Delete an existing user from the database
- `/users` : GET - Get all users from the database

## Generate Test Cases

> Keploy Port: http://localhost:8081/testlist

To generate Test Cases, you need to make some API calls. It could be using Thunder Client, Postman Desktop Agent, or your preferred API testing tool.

Once done, you can see the Test Cases on the Keploy server, like this:

![test-cases-ss](https://raw.githubusercontent.com/keploy/samples-go/main/users-profile/assets/test-cases-ss.png)

## Check the MongoDB database

To check the actual data being changed in the database. Open [MongoDB Compass](https://www.mongodb.com/products/compass) and enter the URI below to check the data.

> mongodb+srv://littleironical:users-profile-testing-password@cluster0.gqdrru8.mongodb.net/?retryWrites=true&w=majority

NOTE: This is just a testing URI. Do not use it for public use. If you want, you can create your own MongoDB and add data to it.

The current URI might or might not work. It's better to setup your own MongoDB and connect it with the application. To do that, check the **Setup your MongoDB** section below.

## Generate Test Runs

To generate Test Runs, close the application and run the below command:

```
go test -coverpkg=./... -covermode=atomic  ./...
```

```
test run completed
{"run id": "0e5f88eb-2746-40de-ab58-c0864ef869ee", "passed overall": false}
--- FAIL: TestKeploy (6.70s)
    keploy.go:44: Keploy test suite failed
FAIL
coverage: 100.0% of statements
FAIL    users-profile   8.489s
?       users-profile/configs   [no test files]
?       users-profile/controllers       [no test files]
?       users-profile/models    [no test files]
?       users-profile/responses [no test files]
?       users-profile/routes    [no test files]
FAIL
```

Once done, you can see the Test Runs on the Keploy server, like this:

![test-runs-ss1](https://raw.githubusercontent.com/keploy/samples-go/main/users-profile/assets/test-runs-ss1.png)
![test-runs-ss2](https://raw.githubusercontent.com/keploy/samples-go/main/users-profile/assets/test-runs-ss2.png)
![test-runs-ss3](https://raw.githubusercontent.com/keploy/samples-go/main/users-profile/assets/test-runs-ss3.png)

## Setup your MongoDB

Start with creating an account on [MongoDB](https://www.mongodb.com/) and follow the below steps:

### **Step 1: Create a New Project**

Open the Project dropdown in the top-left corner and press the New Project button

![mongodb-setup-ss1](https://raw.githubusercontent.com/keploy/samples-go/main/users-profile/assets/mongodb-setup-ss1.png)

Name your project and hit **Next**

![mongodb-setup-ss2](https://github.com/keploy/samples-go/raw/main/users-profile/assets/mongodb-setup-ss2.png)

If you wish to add members, you can add their email address, then press the **Create Project** button

![mongodb-setup-ss3](https://github.com/keploy/samples-go/raw/main/users-profile/assets/mongodb-setup-ss3.png)

### **Step 2: Create a Database**

Click on **Build a Database** button

![mongodb-setup-ss4](https://github.com/keploy/samples-go/raw/main/users-profile/assets/mongodb-setup-ss4.png)

Choose the **Shared plan** and click **Continue**

![mongodb-setup-ss5](https://github.com/keploy/samples-go/raw/main/users-profile/assets/mongodb-setup-ss5.png)

Click **Create Cluster**, you can continue with the default cluster setup

![mongodb-setup-ss6](https://github.com/keploy/samples-go/raw/main/users-profile/assets/mongodb-setup-ss6.png)

Now, you have to create a user and setup network controls to access the database.

First, add a username and create a password, then hit **Create User**

![mongodb-setup-ss7](https://github.com/keploy/samples-go/raw/main/users-profile/assets/mongodb-setup-ss7.png)

Then you have to add the IP addresses with which you want to connect the cluster. You can continue by clicking on **Add My Current IP Address** then **Finish and Close**

> Alternatively, you can add `0.0.0.0` to let any IP address access the cluster.

![mongodb-setup-ss8](https://github.com/keploy/samples-go/raw/main/users-profile/assets/mongodb-setup-ss8.png)

### **Step 3: Connect with the Sample Application**

Click on the **Connect** button

![mongodb-setup-ss9](https://github.com/keploy/samples-go/raw/main/users-profile/assets/mongodb-setup-ss9.png)

Choose the **Connect your application** option

![mongodb-setup-ss10](https://github.com/keploy/samples-go/raw/main/users-profile/assets/mongodb-setup-ss10.png)

Next, you have to select your driver and version.

In this sample application, we are using **Go** driver with **1.6 or later** version. Once, you've entered the driver and version, copy the URI provided and close the popup.

![mongodb-setup-ss11](https://github.com/keploy/samples-go/raw/main/users-profile/assets/mongodb-setup-ss11.png)

### **Step 4: Add URI to code**

Open the sample application in the code editor and open **.env** file

![mongodb-setup-ss12](https://github.com/keploy/samples-go/raw/main/users-profile/assets/mongodb-setup-ss12.png)

Create a variable `MONGO-DB-URI` in that file and paste the URI like this:

```
MONGO-DB-URI=mongodb+srv://littleironical:users-profile-testing-password@cluster0.gqdrru8.mongodb.net/?retryWrites=true&w=majority
```

"To check the database, on MongoDB Compass, use this URI if you've setup your own MongoDB instead of the provided one."

### Perfect! You've now connected the MongoDB with the sample application 🥳