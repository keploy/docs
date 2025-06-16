---
id: http
title: HTTP Support
sidebar_label: HTTP
---

## Introduction

HTTP (Hypertext Transfer Protocol) `Wire Protocol` refers to the underlying communication mechanism that enables the transfer of data between a client (such as a web browser) and a server over the internet. It defines how messages are formatted and transmitted, including rules for their semantics, status codes, headers, and other aspects.

**Port :** HTTP typically uses port `80 for non-secure` connections (HTTP) and port `443 for secure connections` (HTTPS). These are default ports, but HTTP servers can technically be configured to listen on any port.

**Byte Ordering :** It operates at the application layer of the `TCP/IP stack`, where byte ordering is not a concern. However, if encryption is involved (e.g., HTTPS), then cryptographic algorithms may have specific byte ordering requirements, but this is handled at a lower level than HTTP.

**Message Types :** In the context of HTTP, there are primarily two types of messages:

1. _HTTP Request Messages_: These messages are sent from the client to the server to request resources or perform actions. They contain information such as the request method (e.g., GET, POST), the requested URL, headers (such as Accept, User-Agent), and optionally a message body (for methods like POST). Example:-

```bash
GET /index.html HTTP/1.1
Host: www.example.com
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9
```

2. _HTTP Response Messages_: These messages are sent from the server to the client in response to a request. They contain a status line indicating the outcome of the request (e.g., status code 200 for success), headers providing metadata about the response (such as Content-Type, Content-Length), and optionally a message body containing the requested resource or data. Example:-

```yaml
HTTP/1.1 200 OK
Date: Fri, 24 May 2024 12:00:00 GMT
Content-Type: text/html; charset=UTF-8
Content-Length: 1234
Server: Apache
```

## How it works ?

The http parser is basically divided into two sections, `encode` and `decode`, the encode function is used during the keploy record mode when we need to process the user traffic and store it in mocks and whereas the decode function is used in the test mode when we need to match the mock with the request, decode the information from the mock and write it back to the user.

So in the record mode, the encode function is provided with the initial request, which is written to the destination connection and checked if the request is chunked, if it is then parser keeps reading the request from the client connection and write it to the destination connection.

Next, if the request contains the expect header or not. The expect header is used by a client when sending very large requests. So it is basically used to ask the server if it is ready to accept such a large req or not, if it is, then the server responds with a `"100-continue"` response. This is what we also check by writing the request to the destination connection and reading the response from it. We start reading the response and we handle chunking in that case as well. Then finally, keploy parse the request and response to store it in mocks.

Hope this helps you out, if you still have any questions, reach out to us .

import GetSupport from '../concepts/support.md'

<GetSupport/>
