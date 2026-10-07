---
id: capture-loss
title: Fix "could not record an app's bytes" warnings
sidebar_label: Capture loss warnings
description: Fix the Keploy warning that it could not record an app's bytes — the sendfile, splice, io_uring and MSG_TRUNC calls behind it, and what to change in the app.
tags:
  - troubleshooting
  - recording
  - ebpf
  - kubernetes
keywords:
  - keploy capture loss
  - could not record an app's bytes
  - payloads are missing from the recordings
  - sendfile
  - splice
  - io_uring
  - nginx sendfile
  - keploy low latency recording
  - keploy daemonset recording
---

When Keploy records with its eBPF capture (`keploy record --low-latency`, a
Kubernetes Sidecar with `low_latency_mode`, and the DaemonSet agent), it
records what your app's send and receive calls copy between the app's memory
and its sockets. A few calls move bytes without copying them through the
app's memory, so there is nothing for Keploy to read. Keploy does not record
those bytes. It marks the gap on the connection so the protocol parser
resyncs past it (or stops on that connection) instead of reading garbage, and
it tells you once per app and cause in a warning like this:

```text
🐰 Keploy: 2026-10-07T10:06:43.043391152Z 	WARN	proxyless capture could not record an app's bytes: the app sent them with sendfile(2), which moves a file's pages straight into the socket — those bytes are missing from the recording; the gap is marked on the connection so its parser resyncs or stops there	{"pod": "web-7c9d6b5f4-x2kqp", "process": "nginx", "pid": 4242, "connID": 2563235, "connection": "10.0.0.5:8080", "direction": "response", "lostBytes": 16384, "ktls": false, "toRecordIt": "turn sendfile off for traffic Keploy records — nginx: sendfile off; …", "docs": "https://keploy.io/docs/running-keploy/capture-loss/#sendfile"}
```

The fields:

- `pod`, `process` and `pid` name the app. `pod` is empty outside the
  Kubernetes DaemonSet agent.
- `connection` is the server end of the connection: the address the app
  dialed, or, on a connection the app accepted, its own listening address.
  `connID` is Keploy's ID for the connection.
- `direction`, on a TCP connection, is `request` (client to server) or
  `response` (server to client). On a connection using the kernel's TLS
  (`"ktls": true`), it is the app's `sent` or `received`. Page references
  also come from UDP and Unix socket calls, and `MSG_TRUNC` from UDP; there
  `direction` is the call's (`request` for a send, `response` for a receive)
  and `connection` may not be a server's address.
- `lostBytes` is the size of the one call that triggered the warning. Later
  losses are counted in the periodic warning below.
- `toRecordIt` says what to change so the bytes are recorded.
- `docs` links the section of this page on the cause.

Every minute in which more bytes were lost, Keploy also logs a periodic
warning for each cause, across all apps:

```text
🐰 Keploy: 2026-10-07T10:07:43.043391152Z 	WARN	proxyless capture: payloads are missing from the recordings: the app sent them with sendfile(2), which moves a file's pages straight into the socket; each was marked lost on its connection, whose parser resyncs or stops there	{"newlyLost": 3, "lost": 12, "lostBytes": 196608, "toRecordIt": "turn sendfile off for traffic Keploy records — nginx: sendfile off; …", "docs": "https://keploy.io/docs/running-keploy/capture-loss/#sendfile"}
```

`newlyLost` counts the calls since the last report, and `lost` and `lostBytes`
count every call and byte since the agent started.

## Find the cause and fix it

Find the words your warning uses, and go to that section:

| The warning says                                                | Section                                                                     |
| --------------------------------------------------------------- | --------------------------------------------------------------------------- |
| "the app sent them with sendfile(2)"                            | [Turn off sendfile](#sendfile)                                              |
| "the app moved them from a pipe into the socket with splice(2)" | [Copy through a buffer instead of splicing into the socket](#splice-send)   |
| "the app took them out of the socket into a pipe"               | [Copy through a buffer instead of splicing out of the socket](#splice-recv) |
| "a send or receive of the app's moved them by page references"  | [Use plain send and receive calls](#kernel-pages)                           |
| "the app received them with MSG_TRUNC"                          | [Leave MSG_TRUNC receives as they are](#msg-trunc)                          |
| "their page was not resident to the capture hook"               | [Report a page-not-resident error](#read-fault)                             |
| "Failed to attach do_splice_direct and do_splice", at startup   | [Check for unmarked losses at startup](#unmarked)                           |
| "Failed to attach sock_splice_read", at startup                 | [Check for unmarked losses at startup](#unmarked)                           |

### Turn off sendfile {#sendfile}

The app sent a file's pages straight into the socket, so they were never in
its memory. Turn sendfile off for the traffic Keploy records:

- nginx: `sendfile off;`
- Apache: `EnableSendfile Off`
- Tomcat: `useSendfile="false"` on the Connector (on by default)
- gunicorn: `--no-sendfile`
- aiohttp: set `AIOHTTP_NOSENDFILE=1`
- Java: don't use `FileChannel.transferTo` or Netty's `FileRegion` for this
  traffic.
- Go, on plain TCP (`crypto/tls` never uses sendfile). These use sendfile:
  `http.ServeFile`, `http.FileServer` over `http.Dir`, `http.ServeContent` of
  an `*os.File`, `io.Copy` from an `*os.File` into a `net.Conn`, or into an
  `http.ResponseWriter` whose response is not chunked (`Content-Length` is
  set, or the client speaks HTTP/1.0), and an `http.Client` request whose
  `Body` is an `*os.File` with `ContentLength` set. `io.CopyN` and
  `io.CopyBuffer` take the same path; passing your own buffer does not
  avoid it. Hide the socket or the file from the copy:

  ```go
  // http.ServeFile
  http.ServeFile(struct{ http.ResponseWriter }{w}, r, name)

  // http.FileServer
  h := http.FileServer(root)
  handler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
      h.ServeHTTP(struct{ http.ResponseWriter }{w}, r)
  })

  // io.Copy from a file, into a connection or a ResponseWriter
  io.Copy(struct{ io.Writer }{conn}, f)
  io.Copy(struct{ io.Writer }{w}, f)

  // an http.Client request body read from a file (io.NopCloser(f) alone is
  // not enough: net/http unwraps it)
  req.Body = io.NopCloser(struct{ io.Reader }{f})
  ```

### Copy through a buffer instead of splicing into the socket {#splice-send}

The app moved bytes from a pipe into the socket with `splice(2)` or io_uring's
`IORING_OP_SPLICE`. Copy through a buffer instead:

- Go, never on `crypto/tls`: `io.Copy` into a TCP connection from another TCP
  or Unix stream connection splices. Hide both ends from it:
  `io.Copy(struct{ io.Writer }{dst}, struct{ io.Reader }{src})`.
- HAProxy: leave `option splice-*` off.

### Copy through a buffer instead of splicing out of the socket {#splice-recv}

The app took received bytes out of the socket with `splice(2)` or
`sendfile(2)`, typically on to a file or another socket, without ever holding
them in its own memory. Copy through a buffer instead:

- Go, never on `crypto/tls`: `io.Copy` from a TCP connection into another TCP
  or Unix stream connection, as a forwarding proxy does, or into an
  `*os.File`, splices. Hide both ends from it:
  `io.Copy(struct{ io.Writer }{dst}, struct{ io.Reader }{src})`.
- HAProxy: leave `option splice-*` off.

### Use plain send and receive calls {#kernel-pages}

The bytes moved by page references the kernel holds, not through the app's
memory. This happens with io_uring registered (fixed) buffers. It also
happens, from kernel 6.5, with a sendfile or splice send when Keploy could not
attach its splice hooks (see [Check for unmarked losses at startup](#unmarked)).

Use plain `send`/`recv`, or io_uring without registered buffers, for the
traffic Keploy records. For sendfile or splice, turn them off as described
above.

### Leave MSG_TRUNC receives as they are {#msg-trunc}

The app received with `MSG_TRUNC`, which discards the bytes without copying
them. There is nothing to change: the app never read them, and the
connection's parser resyncs past the gap.

### Report a page-not-resident error {#read-fault}

This one is logged as an error, once per agent rather than once per app: a
page of the payload could not be read without faulting it in, which Keploy's
hook cannot do. This is a limitation of the capture, not something the
app chose. The error names no app; its fields are `shard`, `connID`,
`direction` (`0` for request, `1` for response), `lostBytes`, `destPort`,
`ktls` and `docs`.

If it recurs, report it with the agent's logs on
[Slack](https://keploy.io/slack) or as a
[GitHub issue](https://github.com/keploy/keploy/issues).

## Check for unmarked losses at startup {#unmarked}

Keploy marks sendfile and splice losses through hooks on the kernel's sendfile
and splice paths. When one of them cannot attach, the agent warns once at
startup, and some losses are then not marked at all, with no warning for each
connection:

- `Failed to attach do_splice_direct and do_splice`: before kernel 6.5, what
  sendfile and splice send goes unmarked. From 6.5, the kernel hands those
  bytes to Keploy's data hooks, which mark them as
  [page references](#kernel-pages).
- `Failed to attach sock_splice_read`: what splice takes out of a socket goes
  unmarked, on any kernel.

If you see either, turn sendfile and splice off for the traffic Keploy
records, as described above, even when no capture loss warning follows.

## Know what TLS changes

TLS through a library (OpenSSL, Go's `crypto/tls`, Java's JSSE) encrypts in
the app's memory, so it does not take the sendfile or splice paths, unless the
library hands encryption to the kernel. OpenSSL 3 does that with its kTLS
option, for example nginx with `ssl_conf_command Options KTLS;`. That is the
kernel's TLS (kTLS): Keploy marks those bytes on the kTLS stream
(`"ktls": true`), and turning sendfile off applies there too.

## Understand why these bytes cannot be read

sendfile and splice move page references inside the kernel: from a file's
page cache, or from a socket's receive queue, into a pipe or another socket.
The bytes never pass through a buffer of the app's that Keploy's hook could
read. Keploy hooks these calls on every kernel its eBPF capture runs on
(x86-64 from 5.10, arm64 from 6.4). Where the hooks attach (the agent warns at
startup when one does not), Keploy knows exactly which bytes were lost and on
which connection, and says so instead of recording a stream with silent holes.

## Related

- [Troubleshooting guide](../keploy-explained/common-errors.md)
- [DaemonSet recording architecture](k8s-proxy-daemonset-architecture.md)
- [Platform requirements](../concepts/platform-requirements.md)
