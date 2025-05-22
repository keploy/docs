---
id: mongo
title: MongoDB Support
sidebar_label: MongoDB Support
---

## Introduction

The MongoDB Wire Protocol is a simple socket-based, request-response style protocol. Clients communicate with the database server through a regular TCP/IP socket. Clients should connect to the database with a regular TCP/IP socket.

**Port :** The default port number for `mongod` and `mongos` instances is 27017. The port number for `mongod` and `mongos` is configurable and may vary.

**Byte Ordering :** All integers in the MongoDB wire protocol use little-endian byte order: that is, least-significant byte first.

**Message Types :** MongoDB uses the `OP_MSG` opcode for both client requests and database replies. There are several message formats used in older versions of MongoDB which have been deprecated in favor of `OP_MSG`.

For more information, check out mongodb-wire-protocol/#standard-message-header section.

## How it works ?

When the application sends requests to MongoDB, those requests/responses are in the form of "wiremessages," which are low-level data packets. These wiremessages are intercepted by the Keploy proxy before reaching the actual MongoDB instance.

Once intercepted, the proxy's functionality includes parsing these wiremessages, which involves extracting the relevant data and metadata from the packets. After parsing, the extracted information is transformed into a human-readable and editable format. This format could be more user-friendly and easy to understand, making it convenient for developers and administrators to analyze and manipulate the data if necessary. Hence, this proxy serves as an intermediary that captures and mocks the traffic calls.

The system is built to support wiremessage `MongoDB version => 5.1.X`, which refers to the specific version of the communication protocol used between the application and the MongoDB server. This version indicates the specific structure and rules governing the wiremessages exchanged between the two components.

## Example of message queries

In general, each message consists of a standard message header followed by request-specific data. The standard message header is structured as follows:

```go
struct MsgHeader {
    int32 messageLength;  // total message size, including this
    int32 requestID;  // identifier for this message
    int32 responseTo;  // requestID from the original request (used in responses from the database)
    int32 opCode;  // message type
}
```

`OP_MSG` is an extensible message format used to encode both client requests and server replies on the wire.
`OP_MSG` has the following format:

```shell
OP_MSG {
    MsgHeader header;   // standard message header
    uint32 flagBits;    // message flags
    Sections[] sections;    // data sections
    optional<uint32> checksum;  // optional CRC-32C checksum
}
```

**Note**

- MongoDB 5.1 removes support for both `OP_QUERY` find operations and `OP_QUERY` commands. As an exception, `OP_QUERY` is still supported for running the `hello` and `isMaster` commands as part of the connection handshake.

- In version 4.2, MongoDB removes the deprecated internal `OP_COMMAND` and `OP_COMMANDREPLY` protocol.

Hope this helps you out, if you still have any questions, reach out to us .

import GetSupport from '../concepts/support.md'

<GetSupport/>
