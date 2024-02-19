---
id: rename-testcases
title: Rename Default Test-names
sidebar_label: Rename Testname
description: This section documents how to rename testcases & testsets
tags:
  - rename testcases
  - rename testsets
keywords:
  - testcases
  - documentation
  - rename
  - testsets
---

## Rename Test-Cases

To name your test case, make an API call and **add a header field** whose key is set to `Keploy-Test-Name` and value is set to the name you want for your test case.

### Example

To demonstrate this, let's consider the [gin-mongo](https://github.com/keploy/samples-go/tree/main/gin-mongo) sample application.

1. Clone the repository and build the application.

```bash
git clone https://github.com/keploy/samples-go && cd samples-go/gin-mongo
go build
```

2. Run keploy in record mode and provide the path to the binary.

```bash
sudo -E keploy record -c "./test-app-url-shortener"
```

3. Make an api call and add a header field with key set to `Keploy-Test-Name` and value set to the name you want for your testcase, let's say 'renametest'.

```bash
curl --request POST \
  --url http://localhost:8080/url \
  --header 'content-type: application/json' \
  --header 'Keploy-Test-Name: renamed-test' \
  --data '{
  "url": "https://google.com"
}'
```

5. Test case with the name `renamed-test.yaml` has been successfully created. 🎉

## Rename Test-Sets

To rename your test set, you can manually override the default name from `test-set-0` to a `kTest-0` in the `keploy` folder.
