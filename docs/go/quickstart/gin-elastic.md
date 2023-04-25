---
id: gin-elastic
title: Sample elastic-search app
sidebar_label: Gin-Elastic Sample
tags:
  - quickstart
  - go
  - sdk
  - tutorial
---


# Example Sample elastic-search app for performing CRUD operations
A sample elastic-search app to test Keploy integration capabilities

## Installation Setup
 
#### MacOS
```shell
curl --silent --location "https://github.com/keploy/keploy/releases/latest/download/keploy_darwin_all.tar.gz" | tar xz -C /tmp

sudo mv /tmp/keploy /usr/local/bin

# start keploy with default settings
keploy
```
#### Linux
```shell
curl --silent --location "https://github.com/keploy/keploy/releases/latest/download/keploy_linux_amd64.tar.gz" | tar xz -C /tmp

sudo mv /tmp/keploy /usr/local/bin

# start keploy with default settings
keploy
```

#### Linux ARM
```shell
curl --silent --location "https://github.com/keploy/keploy/releases/latest/download/keploy_linux_arm64.tar.gz" | tar xz -C /tmp

sudo mv /tmp/keploy /usr/local/bin

# start keploy with default settings
keploy
```
#### Windows
```shell
Download the Keploy Windows AMD64 from "https://github.com/keploy/keploy/releases/latest/download/keploy_windows_amd64.tar.gz", and extract the files from the zip folder.

Run the keploy.exe file.
```

#### Windows ARM
```shell
Download the Keploy Windows ARM64 from "https://github.com/keploy/keploy/releases/latest/download/keploy_windows_arm64.tar.gz", and extract the files from the zip folder.

Run the keploy.exe file.
```

### Setup elastic-search app
```bash
git clone https://github.com/keploy/samples-go && cd gin-elastic
go mod download
```

### Run the application
```shell
# Start the elastic server
docker-compose up -d

# run the sample app
go run handler.go main.go

# run the sample app in record mode
export KEPLOY_MODE=record && go run handler.go main.go

```

## Generate testcases

To genereate testcases we just need to make some API calls. You can use [Postman](https://www.postman.com/), [Hoppscotch](https://hoppscotch.io/), or simply `curl`

###1. Create an index

```bash
curl --request POST \
  --url http://localhost:8080/indexName \
  --header 'content-type: application/json' \
  --data '{
  "indexName": "es-test"
}'
```
this will create an index named "es-test" in elastic-search. The ts would automatically be ignored during testing because it'll always be different. 
```
{
  "index": "es-test indexed !",
  "ts": 1662460300125603000
}
```

###2. Get the movie name from elastic-search
```bash
curl --request GET \
  --url http://localhost:8080/param \
  --header 'content-type: application/json' \
  --data '{
  "indexName": "es-test",
  "docId":"1"
}'
```

###3. Delete a document from elastic-search
```bash
curl --request DELETE \
  --url http://localhost:8080/param \
  --header 'content-type: application/json' \
  --data '{
  "indexName": "es-test",
  "docId":"1"
}'
```

Now these API calls were captured as a testcase and should be visible in the keploy-tests folder of your app.

Now, let's see the magic! 🪄💫


## Test mode

Now that we have our testcase captured, run the tests.
```shell
 export KEPLOY_MODE=test && go run handler.go  main.go
```
This will set Keploy in test mode
output should look like
```shell
test run completed      {"run id": "c2c957df-a7c5-47d9-92e3-525848c9f535", "passed overall": true}
```

So no need to setup dependencies like elastic-search locally or write mocks for your testing.

**The application thinks it's talking to
elastic-search 😄**

### Make a code change
Now try changing something like renaming `Movie Name` to `Movie Names` in [handler.go](./handler.go) on line 56 and running the tests again

#### Test Run Result
```shell
result  {"testcase id": "86abed73-0423-43ae-83dd-3fc8dda2d385", "passed": false}
result  {"testcase id": "32f3353b-881e-41bd-81c1-be2debd20731", "passed": true}
result  {"testcase id": "7f10ffbe-96e9-44d7-bc29-624754f23d89", "passed": true}
result  {"testcase id": "81f70fe5-309e-4b71-b6ee-1172ce160d86", "passed": true}
result  {"testcase id": "99ad47a6-b179-4389-b535-6cb4ae9ab4b7", "passed": false}
result  {"testcase id": "76c70c11-e350-49c2-bc81-04274f9feb84", "passed": false}
result  {"testcase id": "913bad56-b642-4f2f-8f3b-98e5bb13f451", "passed": false}
result  {"testcase id": "f3c826c0-eb7d-470a-93d5-3236402c07a1", "passed": true}
test run completed      {"run id": "d9ffa99a-d0a6-462c-bd63-587394e603a7", "passed overall": false}
```
