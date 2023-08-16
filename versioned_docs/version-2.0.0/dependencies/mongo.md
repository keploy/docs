---
id: mongo
title: MongoDB Support
sidebar_label: MongoDB
---

## Introduction

The [MongoDB Wire Protocol](https://www.mongodb.com/docs/manual/reference/mongodb-wire-protocol/) is a simple socket-based, request-response style protocol. Clients communicate with the database server through a regular TCP/IP socket.

## How it works ?

When the application sends requests to MongoDB, those requests/responses are in the form of "wiremessages," which are low-level data packets. These wiremessages are intercepted by the Keploy proxy before reaching the actual MongoDB instance.

Once intercepted, the proxy's functionality includes parsing these wiremessages, which involves extracting the relevant data and metadata from the packets. After parsing, the extracted information is transformed into a human-readable and editable format. This format could be more user-friendly and easy to understand, making it convenient for developers and administrators to analyze and manipulate the data if necessary. Hence, this proxy serves as an intermediary that captures and mocks the traffic calls.

The system is built to support wiremessage `MongoDB version => 5.1.X`, which refers to the specific version of the communication protocol used between the application and the MongoDB server. This version indicates the specific structure and rules governing the wiremessages exchanged between the two components.

**References**

[1] MongoDB 5.1 removes support for both `OP_QUERY` find operations and `OP_QUERY` commands. As an exception, `OP_QUERY` is still supported for running the [hello](https://www.mongodb.com/docs/manual/reference/command/hello/#mongodb-dbcommand-dbcmd.hello) and [isMaster](https://www.mongodb.com/docs/v4.4/reference/command/isMaster/#mongodb-dbcommand-dbcmd.isMaster) commands as part of the connection handshake.
