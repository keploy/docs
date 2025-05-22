---
id: gin-mongo-2
title: Users Profile Sample Application (v1.0.0)
sidebar_label: Gin-Mongo Sample 2
tags:
  - quickstart
  - go
  - sdk
  - tutorial
keywords:
  - SDK
  - Docker
  - MongoDB
  - API Testing
---

# User Profile Management Sample App

A sample application that does CRUD (get, create, update, and delete) operations on a user in mongoDB .

## Installation

Navigate to [Installation guide](../../server/server-installation.md) to quickly install and run the keploy server.

### Start Docker and MongoDB locally

1. Open Docker application
2. Run the command `docker container run -it -p27017:27017 mongo` to start MongoDB locally

### Start Users-Profile sample application

```
git clone https://github.com/keploy/samples-go
cd samples-go
cd users-profile
go get .
export KEPLOY_MODE=record
go run .
```

> export KEPLOY_MODE="record" changes the environment variables to record test cases

## Routes

> Sample Application Port: http://localhost:8080

- `/user` : POST - Create a new user in the database
- `/user/:userId` : GET - Get a user from the database
- `/user/:userId` : PUT - Edit an existing user in the database
- `/user/:userId` : DELETE - Delete an existing user from the database
- `/users` : GET - Get all users from the database

## Generate Test Cases

To generate Test Cases, you need to make some API calls. It could be using Thunder Client, Postman Desktop Agent, or your preferred API testing tool.

Let's see some requests here using Thunder Client:

- POST Request
  ![POST-Request](/img/POST-request.png)
- GET Request
  ![GET-Request](/img/GET-request.png)

Once done, you can see the Test Cases on the Keploy server, like this:

![keploy-test-cases](/img/keploy-test-cases.png)

## Generate Test Runs

To generate Test Runs, **close the application** and **run the below command** in the same _users-profile_ directory:

```
export KEPLOY_MODE=test
go test -v -coverpkg=./... -covermode=atomic  ./...
```

Once done, the Keploy terminal should look like this:

![keploy-test-runs](/img/keploy-test-runs.png)

## Check the MongoDB database

To check the actual data being changed in the database. Open MongoDB Compass and enter the URI below to check the data:

> mongodb://localhost:27017

\*Would be used while making PUT Request - to get the "id" of a user

**That's all for the users-profile!**
