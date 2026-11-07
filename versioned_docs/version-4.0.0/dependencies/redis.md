---
id: redis
title: Redis Support
sidebar_label: Redis Support
description: "How Keploy Enterprise records and mocks Redis (RESP) traffic, and how the open-source Keploy passes Redis calls through."
---

:::note Recording and mocking Redis needs Keploy Enterprise

Keploy records and mocks Redis calls, and calls to servers that speak Redis's protocol such as Valkey, KeyDB and Dragonfly, only in [Keploy Enterprise](/docs/keploy-cloud/cloud-installation/), which is the `keploy` that the [install script](/docs/server/installation/) installs by default. A free account is enough to record and replay with it; free-tier runs are subject to a usage allowance.

The open-source `keploy` is the `keploy` that you build from the open-source repository, install with `curl --silent -O -L https://keploy.io/install.sh && source install.sh --oss`, download from the keploy/keploy GitHub releases, or run from the `ghcr.io/keploy/keploy` image. It detects a Redis connection by its first command, which Redis client libraries send as a RESP array. It then passes the connection through to the real Redis server, in `keploy record` and in `keploy test` alike:

- It records no Mocks for that connection and serves none. Test-Sets that Keploy Enterprise or some earlier open-source releases recorded hold Redis calls as `Redis` Mocks: the open-source `keploy` skips those, and logs a warning each time it loads the Test-Set, with how many it skipped. Test-Sets from other open-source releases hold them as `Generic` Mocks. It leaves those out of the replay too, and logs a warning once per run that it does, so those Test-Sets need Redis running as well.
- It logs a warning, once for each Redis address, that the Redis calls are skipped, with a link to the [Keploy Enterprise page](/docs/keploy-cloud/cloud-installation/) that this note links to above.
- Redis must be running while `keploy test` runs, with the data the recorded tests expect. The app reads and writes the live Redis, and the recording and every earlier test run wrote to it too, so a key that was written, changed, or expired since the recording can change the app's responses.
- `keploy test` connects to Redis directly. If the app reached Redis through an HTTP `CONNECT` proxy when it was recorded, Redis must be reachable from `keploy` without that proxy: on a network that lets traffic out only through the proxy, `keploy test` can't reach Redis.

When a connection doesn't open with a RESP array that names a Redis command the open-source `keploy` knows, such as an inline command typed in a telnet session, a command of a Redis module it doesn't know, or a command only a Redis-compatible server has, such as Tile38's `NEARBY`, it doesn't detect the connection as Redis. It records the connection as `Generic` Mocks, as before.

:::

## Introduction

The Redis wire protocol is a simple, text-based protocol used to communicate with the Redis server over a TCP/IP socket. It follows a request-response model where the client sends a command to the server, and the server responds with a reply.

**Port :** The default port for a `Redis` server is 6379.

**Byte Ordering :** Redis uses little-endian byte order, particularly in its binary protocol formats like in RDB (Redis Database) and AOF (Append-Only File) persistence formats.

**Message Types :** Redis commands are sent from the client to the server as an array of bulk strings. This is known as the RESP (REdis Serialization Protocol) format. Each command is represented by a list of strings, where the first string is the command name, followed by its arguments.

For more information, check out Redis serialization protocol specification from redis docs.

## How it works ?

Keploy Enterprise records and replays Redis calls on Linux, and in Docker or WSL. Natively on macOS and Windows, Keploy doesn't understand Redis calls, so use Docker on macOS, and Docker or WSL on Windows.

### Record Mode

In record mode, the encode function is utilized. Its primary responsibility is to process incoming user traffic and store this data in mock files. For Redis specifically, the function starts by reading the first 5 bytes of the incoming call to identify the type of call.

Redis commands are distinguished by specific initial characters such as `'+', '-', ':', '$', '*', '_', '#', ',', '(', '!', '=', '%', '~', '>'`.

The record mode process begins with the `RecordOutgoing` function, which initiates by reading the initial request from the client. This request is then encoded using the encodeRedis function. This function logs the request, writes it to the destination server, and processes the responses. The responses are read, written back to the client, and stored in the mock files. If there are any remaining responses before reaching the end of the stream, these are also sent to the client and stored.

### Test Mode

In test mode, the decode function is activated. Its role is to match incoming requests with pre-recorded mocks, decode the necessary information, and write it back to the user.

The test mode process starts with the `MockOutgoing` function, which reads the initial request from the client. The request is then decoded using the `decodeRedis` function. This function reads the request stream, attempts to match the request with existing mocks using a fuzzy matching algorithm, and retrieves the corresponding responses. If a match is found, the responses are decoded and written back to the client.

Hope this helps you out, if you still have any questions, reach out to us .
