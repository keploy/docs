---
id: custom-mocks
title: Adding a custom Mock to the Keploy Mock File
sidebar_label: Custom HTTP Mocks
description: This section documents how to use custom http mocks with keploy test cases
tags:
  - mocks
  - custom mocks
  - self written mocks
  - mock with test
keywords:
  - mocks
  - custom mocks
  - self written mocks
  - mock with test
---

If you can't run a dependency service and want to mock it, keploy supports adding manually written mocks.

When adding a mock to the Keploy mock file, it's crucial to ensure that all fields are accurately filled out and that the **timestamps align with the request and response timestamps** of the mock's respective test case.
This document provides a schema and guidelines to assist you in this process.

## Mocks Schema

```yaml
- version: api.keploy.io/v1beta1
  kind: Http
  name: <mock_name>
  spec:
      request:
          method: <HTTP_method>
          proto_major: 1
          proto_minor: 1
          url: <request_url>
          header: <request_headers>
          body: <request_body>
          timestamp: <request_timestamp>
      response:
          status_code: <response_status_code>
          header: <response_headers>
          body: <response_body>
          timestamp: <response_timestamp>
___
```

### Field Descriptions

- `version`: `api.keploy.io/v1beta1`
- `kind`: Since custom mocks are HTTP mocks, the kind is `Http`.
- `name`: The name of the mock needs to be **unique**.
- `request`: The request details.
  - `method`: The HTTP method (e.g., GET, POST).
  - `url`: The URL of the request.
  - `header`: The array of request headers.
  - `body`: The request body.
  - `timestamp`: The timestamp of the request, which must match the timestamp of the request in the associated test case.
- `response`: The response details.
  - `status_code`: The HTTP status code of the response.
  - `header`: The response headers.
  - `body`: The response body.
  - `timestamp`: The timestamp of the response, which must match the timestamp of the response in the associated test case.

## Guidelines for Adding a Mock

1. **Ensure Unique Name**: Each mock must have a unique `name` to avoid conflicts.
2. **Match Timestamps**: The `timestamp` fields in both the request and response sections must be within the associated testcase timestamps. This ensures that the mock is accurately linked to the correct point in the test case's execution.
3. **Provide Accurate Details**: Ensure that the method, URL, headers, and body accurately reflect the request and response you intend to mock.

## Example

```yaml
---
version: api.keploy.io/v1beta1
kind: Http
name: mock-n
spec:
  req:
    method: POST
    proto_major: 1
    proto_minor: 1
    url: http://localhost:9966/petclinic/api/owners
    header:
      Accept: application/json, text/plain, */*
      Accept-Encoding: gzip, deflate, br
      Accept-Language: en-GB,en-US;q=0.9,en;q=0.8
      Connection: keep-alive
      Content-Length: "128"
      Content-Type: application/json
      Host: localhost:9966
      Origin: http://localhost:4200
      Referer: http://localhost:4200/
      Sec-Ch-Ua: '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"'
      Sec-Ch-Ua-Mobile: ?0
      Sec-Ch-Ua-Platform: '"macOS"'
      Sec-Fetch-Dest: empty
      Sec-Fetch-Mode: cors
      Sec-Fetch-Site: same-site
      User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36
    body: '{"id":null,"firstName":"Bugs","lastName":"Bunny","address":"Rabbit Hole","city":"California","telephone":"9911229933"}'
    timestamp: 2024-02-19T13:14:27.885643357Z

  resp:
    status_code: 201
    header:
      Access-Control-Allow-Origin: "*"
      Access-Control-Expose-Headers: errors, content-type
      Cache-Control: no-cache, no-store, max-age=0, must-revalidate
      Connection: keep-alive
      Content-Type: application/json
      Date: Mon, 19 Feb 2024 13:14:28 GMT
      Expires: "0"
      Keep-Alive: timeout=60
      Location: /api/owners/1
      Pragma: no-cache
      Vary: Origin,Access-Control-Request-Method,Access-Control-Request-Headers
      X-Content-Type-Options: nosniff
      X-Frame-Options: DENY
      X-Xss-Protection: "0"
    body: '{"firstName":"Jhon","lastName":"Doe","address":"Rabbit Hole","city":"California","telephone":"9911229933","id":1,"pets":[]}'
    timestamp: 2024-02-19T13:14:28.145240844Z
---
```
