---
id: redis
title: Redis Support
sidebar_label: Redis Support
---

## Introduction

The Redis wire protocol is a simple, text-based protocol used to communicate with the Redis server over a TCP/IP socket. It follows a request-response model where the client sends a command to the server, and the server responds with a reply.

**Port :** The default port for a `Redis` server is 6379.

**Byte Ordering :** Redis uses little-endian byte order, particularly in its binary protocol formats like in RDB (Redis Database) and AOF (Append-Only File) persistence formats.

**Message Types :** Redis commands are sent from the client to the server as an array of bulk strings. This is known as the RESP (REdis Serialization Protocol) format. Each command is represented by a list of strings, where the first string is the command name, followed by its arguments.

For more information, check out Redis serialization protocol specification from redis docs.

## How it works ?

### Record Mode

In record mode, the encode function is utilized. Its primary responsibility is to process incoming user traffic and store this data in mock files. For Redis specifically, the function starts by reading the first 5 bytes of the incoming call to identify the type of call.

Redis commands are distinguished by specific initial characters such as `'+', '-', ':', '$', '*', '_', '#', ',', '(', '!', '=', '%', '~', '>'`.

The record mode process begins with the `RecordOutgoing` function, which initiates by reading the initial request from the client. This request is then encoded using the encodeRedis function. This function logs the request, writes it to the destination server, and processes the responses. The responses are read, written back to the client, and stored in the mock files. If there are any remaining responses before reaching the end of the stream, these are also sent to the client and stored.

### Test Mode

In test mode, the decode function is activated. Its role is to match incoming requests with pre-recorded mocks, decode the necessary information, and write it back to the user.

The test mode process starts with the `MockOutgoing` function, which reads the initial request from the client. The request is then decoded using the `decodeRedis` function. This function reads the request stream, attempts to match the request with existing mocks using a fuzzy matching algorithm, and retrieves the corresponding responses. If a match is found, the responses are decoded and written back to the client.

Hope this helps you out, if you still have any questions, reach out to us .

import GetSupport from '../concepts/support.md'

<GetSupport/>
