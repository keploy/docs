---
id: rename-testcases
title: Rename TestCases
sidebar_label: Rename Testcases
description: This section documents how to rename testcases
tags:
  - rename testcases
keywords:
  - testcases
  - documentation
  - rename
---

First Ensure keploy is running in record mode.

To name your testcase, make an api call and add a header field whose key is set to `Keploy-Test-Name` and value is set to the name you want for your testcase.

To demonstrate this, let's consider the [gin-mongo](https://github.com/keploy/samples-go/tree/main/gin-mongo) sample application.

1. Clone the repository and move to gin-mongo folder

```bash
git clone https://github.com/keploy/samples-go && cd samples-go/gin-mongo
```

2. Create a binary for the application.

```bash
go build
```

3. Run keploy in record mode and provide the path to the binary.

```bash
sudo -E keploy record -c "./test-app-url-shortener"
```

4. Make an api call and add a header field with key set to `Keploy-Test-Name` and value set to the name you want for your testcase, let's say 'renametest'.

```shell
curl --request POST \
  --url http://localhost:8080/url \
  --header 'content-type: application/json' \
  --header 'Keploy-Test-Name: renametest' \
  --data '{
  "url": "https://google.com"
}'
```

5. Test case with the name 'renametest' has been successfully created. 🎉
   <img src="/docs/img/rename-testcase.png" alt="rename testcases"/>
