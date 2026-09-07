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

> Sample Application Port: localhost:8080

- `/user` : POST - Create a new user in the database
- `/user/:userId` : GET - Get a user from the database
- `/user/:userId` : PUT - Edit an existing user in the database
- `/user/:userId` : DELETE - Delete an existing user from the database
- `/users` : GET - Get all users from the database

## Generate Test Cases

To generate Test Cases, you need to make some API calls. It could be using Thunder Client, Postman Desktop Agent, or your preferred API testing tool.

Let's see some requests here using Thunder Client:

- POST Request
  <img src="https://keploy-devrel.s3.us-west-2.amazonaws.com/docs/webp-s3/img/POST-request.webp" alt="POST-Request" width="2176" height="844" style={{maxWidth:'100%',height:'auto'}} />
- GET Request
  <img src="https://keploy-devrel.s3.us-west-2.amazonaws.com/docs/webp-s3/img/GET-request.webp" alt="GET-Request" width="2178" height="964" style={{maxWidth:'100%',height:'auto'}} />

Once done, you can see the Test Cases on the Keploy server, like this:

<img src="https://keploy-devrel.s3.us-west-2.amazonaws.com/docs/webp-s3/img/keploy-test-cases.webp" alt="keploy-test-cases" width="2362" height="1208" style={{maxWidth:'100%',height:'auto'}} />

## Generate Test Runs

To generate Test Runs, **close the application** and **run the below command** in the same _users-profile_ directory:

```
export KEPLOY_MODE=test
go test -v -coverpkg=./... -covermode=atomic  ./...
```

Once done, the Keploy terminal should look like this:

<img src="https://keploy-devrel.s3.us-west-2.amazonaws.com/docs/webp-s3/img/keploy-test-runs.webp" alt="keploy-test-runs" width="1434" height="1174" style={{maxWidth:'100%',height:'auto'}} />

## Check the MongoDB database

To check the actual data being changed in the database. Open MongoDB Compass and enter the URI below to check the data:

> mongodb://localhost:27017

\*Would be used while making PUT Request - to get the "id" of a user

**That's all for the users-profile!**
