---
id: capture-loss
title: Fix "could not record an app's bytes" warnings
sidebar_label: Capture loss warnings
description: Fix the Keploy warning that it could not record an app's bytes — sendfile, splice, io_uring, MSG_TRUNC, missed call ends, calls over 16 MiB — and what to change.
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
and its sockets. A few calls move bytes without copying them through the app's
memory, so there is nothing for Keploy to read. A few others go unseen by
Keploy's hooks, or move more than the 16 MiB Keploy records of one call.
Keploy does not record those bytes. It marks the gap on the connection so the
protocol parser resyncs past it (or stops on that connection) instead of
reading garbage, and it tells you once per app and cause in a warning like
this:

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
- `lostBytes` is the size of the one call that triggered the warning. For
  [calls whose end Keploy did not see](#unseen), it is all the bytes they
  moved in that direction since Keploy last looked at the connection, which
  can span several calls. Later losses are counted in the periodic warning
  below.
- `toRecordIt` says what to change so the bytes are recorded.
- `docs` links the section of this page on the cause.

Every minute in which more bytes were lost, Keploy also logs a periodic
warning for each cause, across all apps:

```text
🐰 Keploy: 2026-10-07T10:07:43.043391152Z 	WARN	proxyless capture: payloads are missing from the recordings: the app sent them with sendfile(2), which moves a file's pages straight into the socket; each was marked lost on its connection, whose parser resyncs or stops there	{"newlyLost": 3, "lost": 12, "lostBytes": 196608, "toRecordIt": "turn sendfile off for traffic Keploy records — nginx: sendfile off; …", "docs": "https://keploy.io/docs/running-keploy/capture-loss/#sendfile"}
```

`newlyLost` counts the gaps marked since the last report, and `lost` and
`lostBytes` count every gap and byte since the agent started. A gap is one
call, except for [calls whose end Keploy did not see](#unseen), where one gap
can span several.

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
| "the capture's hooks missed them"                               | [Keep Keploy's hooks from missing TCP bytes](#unseen)                       |
| "more than 16 MiB"                                              | [Split sends and receives of more than 16 MiB](#too-large)                  |
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

### Keep Keploy's hooks from missing TCP bytes {#unseen}

The app moved bytes on a TCP connection that Keploy's hooks did not capture:
in calls whose end they did not see, or with no send or receive call at all.
Keploy finds them later, from how far the connection's TCP stream moved, and
marks that many bytes. It does this at the connection's next send or receive
in the same direction, or when the connection is disconnected or closed. The
app's calls themselves complete normally. It happens in these cases:

- **Another eBPF tool started or stopped on the node or machine, on an
  x86-64 kernel older than 6.3.** Attaching a program to the kernel's TCP
  send or receive functions, or detaching one, makes the kernel skip
  Keploy's hook at the end of the calls the app is in at that moment. A
  receive waiting for data is in its call the whole time it waits, so idle
  keep-alive connections are hit too. Any Keploy agent or sidecar starting
  or stopping on the same machine does this. On those kernels Keploy still
  records `send`, `recv`, `read`, `write` and similar calls when this
  happens, but not `sendmmsg`, `recvmmsg`, io_uring, or the calls of a 32-bit
  process. To fix it, do one of these:
  - Record on kernel 6.3 or later, where Keploy records every such call.
  - Don't start or stop eBPF tools on the machine while recording.
  - Use plain send and receive calls instead of `sendmmsg`, `recvmmsg` or
    io_uring, from a 64-bit build of the app.
- **The app used a TCP zero-copy receive** (`getsockopt` with
  `TCP_ZEROCOPY_RECEIVE`). Use plain receives for the traffic Keploy records.
- **A sockmap program moved the bytes.** Some service meshes and CNIs speed
  up connections between pods on one node with sockmap programs, which move
  bytes without the app's send and receive calls. Turn that acceleration off
  for the traffic Keploy records.
- **Two threads sent, or received, on one connection at once.** Keploy can
  then mark bytes it also recorded: the recording holds those bytes and a
  lost marker for them. Send, and receive, on one connection from one thread
  at a time.
- **Rarely, on any kernel, Keploy missed a call on a busy CPU.** Keploy
  attaches two copies of each hook, and both missed the start of the call.
  Nothing in the app causes it.

This covers plain TCP connections. On UDP and kTLS connections, the calls
listed in the first case are not marked, and no warning is logged for them.

If none of these applies and the warning recurs, report it with the agent's
logs on [Slack](https://keploy.io/slack) or as a
[GitHub issue](https://github.com/keploy/keploy/issues).

### Split sends and receives of more than 16 MiB {#too-large}

One send or receive of the app's moved more than 16 MiB. Keploy records at
most 16 MiB of one call, so it marked what the call moved lost instead of
recording part of it (`lostBytes`). On a kTLS connection, a send that asked to
send more than 16 MiB is marked too, even when it sent less: `lostBytes` is
then what it sent. A blocking write of a large buffer is a single call,
however long it waits. For the traffic Keploy records, write and read such
payloads in parts of at most 16 MiB each.

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
