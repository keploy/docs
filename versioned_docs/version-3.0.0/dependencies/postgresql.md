---
id: postgres
title: PostgresSQL Support
sidebar_label: PostgresSQL
---

## Introduction

The [Postgres Wire Protocol](https://www.postgresql.org/docs/current/protocol.html/) is a communication protocol used for client-server interaction in PostgreSQL, allowing clients to communicate with the PostgreSQL database server for executing queries, retrieving results, and performing various database operations.

**Port :** The default port number for `postgres` or `pgAdmin` instances is 5432. The port number for `postgres` or `pgAdmin` is configurable and may vary.

**Byte Ordering :** All integers in the PostgresQL wire protocol use big-endian byte order: that is, most-significant byte first.

**Message Types :** The PostgreSQL wire protocol uses various message types to facilitate communication between clients and the server. These messages include client-initiated types like `StartupMessage` for connection initiation, Query for executing SQL commands, and `Terminate` for ending sessions, as well as server responses like `RowDescription` for describing result sets, DataRow for transmitting row data, and `CommandComplete` for signaling query completion. Each message type is identified by a single-byte type code, followed by a length field and message-specific content.

## How it works ?

Keploy intercepts the traffic and act as a middle to the `sourceConnection`(client) and `destConnection`(server). So Keploy acts as **destination** for the real client and as client for the real **destination Connection**. So whenever traffic is intercepted keploy gets the byte data and from which we need to ensure the protocol which the connection is using it can be Postgres, mongo etc.. Once keploy identifies it as Postgres keploy send it into the Postgres parser.

Once intercepted, the Keploy's functionality includes parsing these wiremessages, which involves extracting the relevant data and metadata from the packets. After parsing, the extracted information is transformed into a human-readable and editable format. This format could be more user-friendly and easy to understand, making it convenient for developers and administrators to analyze and manipulate the data if necessary. Hence, this proxy serves as an intermediary that captures and mocks the traffic calls. Keploy user `pgproto3` library as base to store the this data into go structs.

## Examples of Message Query

In general, each message consists of a standard message header followed by request-specific data. Here are the few request (frontend) and response(backend) structs in which the data is saved:

```go
type PostgresSpec struct {
	Metadata map[string]string `json:"metadata" yaml:"metadata"`
	PostgresRequests []Backend `json:"RequestBin,omitempty"`
	PostgresResponses []Frontend `json:"ResponseBin,omitempty"`
	ReqTimestampMock time.Time `json:"ReqTimestampMock,omitempty"`
	ResTimestampMock time.Time `json:"ResTimestampMock,omitempty"`
}
```

In above, backend and frontend are the structs representing PostgreSQL requests and responses : -

```go
// Backend is PG Request Packet Transcoder
type Backend struct {
    PacketTypes   []string `json:"header,omitempty" yaml:"header,omitempty,flow"`
    Identfier     string   `json:"identifier,omitempty" yaml:"identifier,omitempty"`
    Length        uint32   `json:"length,omitempty" yaml:"length,omitempty"`
    Payload       string   `json:"payload,omitempty" yaml:"payload,omitempty"`
    Bind          pgproto3.Bind          `yaml:"-"`
    Binds         []pgproto3.Bind         `json:"bind,omitempty" yaml:"bind,omitempty"`
    // other fields...
}

type Frontend struct {
    PacketTypes             []string                  `json:"header,omitempty" yaml:"header,omitempty,flow"`
    Identfier               string                    `json:"identifier,omitempty" yaml:"identifier,omitempty"`
    Length                  uint32                    `json:"length,omitempty" yaml:"length,omitempty"`
    Payload                 string                    `json:"payload,omitempty" yaml:"payload,omitempty"`
    AuthenticationOk        pgproto3.AuthenticationOk        `json:"authentication_ok,omitempty" yaml:"authentication_ok,omitempty"`
    AuthenticationCleartextPassword pgproto3.AuthenticationCleartextPassword `json:"authentication_cleartext_password,omitempty" yaml:"authentication_cleartext_password,omitempty"`
    // other fields...
}

type StartupPacket struct {
    Length           uint32
    ProtocolVersion  uint32
}

type RegularPacket struct {
    Identifier  byte
    Length      uint32
    Payload     []byte
}
```

Hope this helps you out, if you still have any questions, reach out to us .

import GetSupport from '../concepts/support.md'

<GetSupport/>
