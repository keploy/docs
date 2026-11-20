---
id: network-isolation
title: Network isolation in replay
sidebar_label: Network isolation
description: What keploy mock replay sends to the real network and what it keeps from it, how to let a call out on purpose with --on-miss passthrough, --pass-through-ports and --allow-egress dns, how to tell whether a replay reached a real service, and what a replay doesn't intercept. Every output is from Keploy 3.9.4.
tags:
  - mocks
  - replay
  - network isolation
keywords:
  - keploy mock replay
  - network isolation
  - offline tests
  - pass-through-ports
  - on-miss passthrough
  - allow-egress
  - real egress
  - service virtualization
---

# Network isolation in replay

`keploy mock replay` answers the calls your tests make from the recording, so
the tests run with no real dependency. This page shows what a replay keeps
from the real network, the flags that let a call out on purpose, and how to
tell whether one did.

Every output here is from Keploy 3.9.4 on Linux, in a Go project whose tests
call a rates API on `localhost:8090`, with the recordings kept in the
repository (`--local`). The output is trimmed: timestamps and lines that
don't matter are cut. Tags such as `#a9a4b64f98a3` change on every run, so
this page shows them as `#…`.

## What a replay does with each call

| The call                                                                                           | What the replay does                                                                                                                                                                                                                                               |
| -------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| A connection the recording has: an HTTP or gRPC service, a database, a queue                       | Keploy answers it from the recording. The real service is never asked.                                                                                                                                                                                             |
| A connection the recording doesn't have                                                            | It never reaches the real service. An HTTP call gets `502 Bad Gateway`, and the replay names the call. By default, the run fails when a test fails on that answer, or with `--strict`. See [A call the recording doesn't have](#a-call-the-recording-doesnt-have). |
| A connection to a port on your machine that nothing listens on, and that the recording never calls | It fails with `connection refused`, as it would without Keploy.                                                                                                                                                                                                    |
| A DNS lookup the recording has                                                                     | Keploy answers it from the recording.                                                                                                                                                                                                                              |
| A DNS lookup the recording doesn't have                                                            | Keploy answers it itself. In a replay on your machine, the name's address is `127.0.0.1`, so a call that follows goes to Keploy, not to the real host. See [DNS lookups](#dns-lookups).                                                                            |
| UDP that isn't DNS, ICMP (`ping`), and raw sockets                                                 | Keploy doesn't intercept them: they reach their real destination. See [What a replay doesn't intercept](#what-a-replay-doesnt-intercept).                                                                                                                          |

These flags let a call out on purpose:

| Flag                        | What it lets out                                                                                 |
| --------------------------- | ------------------------------------------------------------------------------------------------ |
| `--on-miss passthrough`     | An HTTP call the recording doesn't have goes to the real service. It isn't saved.                |
| `--on-miss record`          | The same, and Keploy adds the call to the recording.                                             |
| `--pass-through-ports PORT` | Every connection to that port, to any host, goes to the real destination. Keploy doesn't see it. |
| `--allow-egress dns`        | A DNS lookup the recording doesn't have goes to the resolvers in `/etc/resolv.conf`.             |

## A call the recording doesn't have

The recording has the tests' call to the rates API. Say you then add a test
that calls a ledger service on `localhost:8091`, and replay with the ledger
service running:

```bash
keploy mock replay --local -c "go test -count=1 ./..."
```

```
🐰 Keploy: INFO  Replaying mocks for your test command  {"mock-set": "default", "program": "go", "args": 3, "on-miss": "fail"}
🐰 Keploy(agent): WARN  mock mismatch: no matching mock for outgoing call  {"protocol": "HTTP", "destination": "{}:8091 #…", "call": "GET /{}", …}
--- FAIL: TestBalance (0.00s)
    balance_test.go:9: GET http://localhost:8091/balance?account=42: 502 Bad Gateway
FAIL
FAIL	example.com/netiso	0.182s
FAIL
🐰 Keploy: INFO  mock replay summary  {"loaded": 1, "consumed": 1, "missed": 1}
…
  Mock mismatch: [HTTP] GET /balance [path tag #…]  →  localhost:8091 [host tag #…]
…
🐰 Keploy: INFO  test command exited non-zero; mirroring its exit code  {"phase": "replay", "exitCode": 1}
🐰 Keploy: INFO  this replay did not prove the tests run with the dependencies off  {"mock-set": "default", "reason": "the test command failed"}
```

The ledger service was up, but the call never reached it: Keploy answered it
with `502 Bad Gateway`. To fix it, record again with the service running, or
add the call with `--on-miss record`. [Troubleshooting](../troubleshooting.md#a-call-has-no-recording)
shows both.

### A test that doesn't fail on the answer

The run fails above because `TestBalance` fails on the `502`. A test that
doesn't check the answer passes, and by default, so does the run. Say the new
test only logs what the ledger service answers:

```go
func TestBalanceTolerant(t *testing.T) {
	resp, err := http.Get("http://localhost:8091/balance?account=42")
	if err != nil {
		t.Logf("ledger call error: %v", err)
		return
	}
	resp.Body.Close()
	t.Logf("ledger answer: %s", resp.Status)
}
```

```bash
keploy mock replay --local -c "go test -count=1 -v ./..."
```

```
=== RUN   TestBalanceTolerant
    tolerant_test.go:17: ledger answer: 502 Bad Gateway
--- PASS: TestBalanceTolerant (0.00s)
PASS
ok  	example.com/netiso	0.194s
🐰 Keploy: INFO  mock replay summary  {"loaded": 1, "consumed": 1, "missed": 1}
…
  Mock mismatch: [HTTP] GET /balance [path tag #…]  →  localhost:8091 [host tag #…]
…
🐰 Keploy: INFO  test command finished successfully  {"phase": "replay"}
🐰 Keploy: INFO  this replay did not prove the tests run with the dependencies off  {"mock-set": "default", "reason": "1 call(s) matched nothing in the recording"}
```

The call still never reached the ledger service, and the replay names it. But
this replay exits `0`: only its last line says it didn't prove the tests run
with the dependencies off. To fail such a run, add `--strict`:

```bash
keploy mock replay --local --strict -c "go test -count=1 -v ./..."
```

```
🐰 Keploy: INFO  mock replay summary  {"loaded": 1, "consumed": 1, "missed": 1}
…
🐰 Keploy: ERROR  replay failed under --strict: recorded dependency calls were missed  {"missed": 1, "next_step": "a dependency contract drifted; re-record the set (keploy mock record) or add the new calls with --on-miss record"}
🐰 Keploy: INFO  this replay did not prove the tests run with the dependencies off  {"mock-set": "default", "reason": "1 call(s) matched nothing in the recording"}
```

It exits `1`.

## Let a call out on purpose

### `--on-miss passthrough`

With `--on-miss passthrough`, an HTTP call the recording doesn't have goes to
the real service:

```bash
keploy mock replay --local --on-miss passthrough -c "go test -count=1 ./..."
```

```
🐰 Keploy: INFO  Replaying mocks for your test command  {"mock-set": "default", "program": "go", "args": 3, "on-miss": "passthrough"}
🐰 Keploy(agent): INFO  real egress opened by onMiss passthrough (--on-miss passthrough): an HTTP call no mock answers goes to its real destination
ok  	example.com/netiso	0.130s
🐰 Keploy: INFO  mock replay summary  {"loaded": 1, "consumed": 1, "missed": 0}
🐰 Keploy: INFO  test command finished successfully  {"phase": "replay"}
🐰 Keploy: INFO  this replay did not prove the tests run with the dependencies off  {"mock-set": "default", "reason": "--on-miss passthrough lets a call the recording does not have reach the real dependency"}
```

The tests pass, but the replay says it didn't prove anything, because a call
reached a real service. The recording still has only the rates call: the
ledger call isn't saved. To save it, use `--on-miss record` instead, as the
[Python quickstart](../mock-quickstart.md#step-5-add-a-call-the-recording-doesnt-have)
does.

### `--pass-through-ports`

`--pass-through-ports` keeps Keploy out of every connection to the ports you
name. The kernel hands them to the real destination, so Keploy doesn't
answer, record or report them:

```bash
keploy mock replay --local --pass-through-ports 8091 -c "go test -count=1 ./..."
```

```
🐰 Keploy: INFO  Replaying mocks for your test command  {"mock-set": "default", "program": "go", "args": 3, "on-miss": "fail"}
🐰 Keploy(agent): INFO  real egress opened by bypassRules naming only a port: any host on these ports; the kernel hands their connections to the real destination, so keploy neither serves nor reports them  {"ports": [8091]}
ok  	example.com/netiso	0.173s
🐰 Keploy: INFO  mock replay summary  {"loaded": 1, "consumed": 1, "missed": 0}
🐰 Keploy: INFO  test command finished successfully  {"phase": "replay"}
🐰 Keploy: INFO  this replay did not prove the tests run with the dependencies off  {"mock-set": "default", "reason": "bypass rules send calls to :8091 to the real service"}
```

With the ledger service stopped, the same replay fails the way the test
would fail without Keploy, because the call goes to the real port:

```
--- FAIL: TestBalance (0.00s)
    balance_test.go:9: Get "http://localhost:8091/balance?account=42": dial tcp [::1]:8091: connect: connection refused
```

Keep these in mind:

- The flag names a port, not a host. `--pass-through-ports 443` lets every
  call to port 443 out, whatever its host.
- Keploy doesn't save the flag. A record with `--pass-through-ports 8091`
  leaves the ledger call out of the recording, and a replay without the flag
  then answers that call with `502 Bad Gateway`. Pass it to the record and to
  every replay.

### `--allow-egress dns`

`--allow-egress dns` sends a DNS lookup the recording doesn't have to the
resolvers in `/etc/resolv.conf`. [DNS lookups](#dns-lookups) shows what it
changes. `dns` is the only value Keploy takes. Any other is refused:

```bash
keploy mock replay --local --allow-egress web -c "go test -count=1 -v ./..."
```

```
Error: test.allowEgress entry "web" is not one keploy can open; the supported entries are: dns
```

The replay exits with code 1, before it runs the tests.

## DNS lookups

A test that looks up `example.com`, a name the recording doesn't have, gets
its real addresses without Keploy:

```bash
go test -count=1 -v ./...
```

```
=== RUN   TestLookup
    lookup_test.go:10: example.com: [104.20.23.154 172.66.147.243 2606:4700:91b5:72db:f276:0:ef6b:ff98] <nil>
--- PASS: TestLookup (0.00s)
```

In a replay, Keploy answers the lookup itself:

```bash
keploy mock replay --local -c "go test -count=1 -v ./..."
```

```
🐰 Keploy(agent): INFO  in this replay, a DNS query no mock answers is forwarded only to a resolver inside the replay's own network, and only for a name that network owns (one docker's resolver holds for the replay's networks, as the keploy CLI lists them, or one under the cluster domain); keploy answers every other name itself, and the host's and public resolvers are not asked
…
=== RUN   TestLookup
    lookup_test.go:10: example.com: [127.0.0.1] <nil>
--- PASS: TestLookup (0.00s)
=== RUN   TestRate
--- PASS: TestRate (0.00s)
PASS
ok  	example.com/netiso	0.182s
🐰 Keploy: INFO  mock replay summary  {"loaded": 1, "consumed": 1, "missed": 2}
…
🐰 Keploy: INFO  this replay ran with every dependency answered from the recording  {"mock-set": "default", "served": 1}
```

The two misses in the summary are the lookup's two queries, one for an IPv4
address and one for an IPv6 address. A DNS miss doesn't fail the replay.

The first line says where a lookup can go. In a replay on your machine,
Keploy answers every name the recording doesn't have. In a Docker or Docker
Compose replay, a container or service name on the replay's Docker network
still goes to Docker's resolver.

With `--allow-egress dns`, the lookup goes to the real resolvers:

```bash
keploy mock replay --local --allow-egress dns -c "go test -count=1 -v ./..."
```

```
🐰 Keploy(agent): INFO  real egress opened by test.allowEgress (dns): a DNS query no mock answers is forwarded to the resolvers in resolv.conf  {"resolvers": ["1.1.1.1", "8.8.8.8"]}
…
=== RUN   TestLookup
    lookup_test.go:10: example.com: [104.20.23.154 172.66.147.243 2606:4700:91b5:72db:f276:0:ef6b:ff98] <nil>
--- PASS: TestLookup (0.01s)
```

To set it for every replay, add it to `keploy.yml`:

```yaml
test:
  allowEgress: [dns]
```

A replay with no `--allow-egress` flag then prints the same
`real egress opened by test.allowEgress (dns)` line. The flag, when you pass
it, replaces the list in `keploy.yml`.

In Keploy 3.9.4, a replay that sent a lookup to the real resolvers still ends
with "this replay ran with every dependency answered from the recording".
Look for the `real egress opened by` line to know.

## Tell whether a replay reached the real network

- **The last line.** "this replay ran with every dependency answered from the
  recording" means the recording answered every connection the tests opened.
  It doesn't count lookups sent out with `--allow-egress dns`, or the traffic
  in [What a replay doesn't intercept](#what-a-replay-doesnt-intercept).
  "this replay did not prove the tests run with the dependencies off" gives
  the reason, such as
  `bypass rules send calls to :8091 to the real service`.
- **The `real egress opened by` lines.** Each flag that lets something out
  prints one line that starts with `real egress opened by`, says which flag,
  and says what it lets out. Search the output, or the log file the replay
  names, for it.
- **`keploy mock status`.** Its summary repeats the reason:

  ```
  summary:  1 recording(s); not yet proven to run with the dependencies off: default (bypass rules send calls to :8091 to the real service).
  ```

- **`keploy/default/last-replay.yaml`.** It has `isolated: false`, the
  reason in `isolationNote`, and the bypassed ports in `bypass`. The
  [reference](../reference.md#the-last-replay) lists its fields.

Every replay also prints this line, with a port that changes on each run:

```
🐰 Keploy(agent): INFO  real egress opened by keploy mock's agent API port: any host on these ports; the kernel hands their connections to the real destination, so keploy neither serves nor reports them  {"ports": [62514]}
```

It is the port that `keploy mock` uses to talk to its own agent, which Keploy
keeps out of the replay so that it can reach the agent.

## What a replay doesn't intercept

In Keploy 3.9.4, a replay intercepts TCP connections and DNS. UDP that isn't
DNS, ICMP and raw sockets aren't intercepted: they reach their real
destination, and Keploy doesn't report them.

Here, a test sends a UDP datagram to an echo service on `127.0.0.1:9999`, and
the replay doesn't stop it:

```bash
keploy mock replay --local -c "go test -count=1 -v ./..."
```

```
=== RUN   TestUDP
    udp_test.go:24: udp answer: "ping"
--- PASS: TestUDP (0.00s)
PASS
ok  	example.com/netiso	0.170s
🐰 Keploy: INFO  mock replay summary  {"loaded": 1, "consumed": 1, "missed": 0}
🐰 Keploy: INFO  this replay ran with every dependency answered from the recording  {"mock-set": "default", "served": 1}
```

With the echo service stopped, the test gets the real port's answer:

```
    udp_test.go:22: no answer: read udp 127.0.0.1:43821->127.0.0.1:9999: read: connection refused
```

So the last line's "every dependency answered from the recording" counts TCP
and DNS only. If your tests send UDP, such as StatsD metrics or syslog, point
them at an address on your machine while they run.

## See also

- [A call has no recording](../troubleshooting.md#a-call-has-no-recording):
  re-record, or add the call with `--on-miss record`.
- [`keploy mock replay` flags](../reference.md#keploy-mock-replay): every
  flag on this page, in full.
- [Replay results](../reference.md#replay-results): the fields of
  `last-replay.yaml` and the status report.
- [Times, dates and ids that change](./changing-values.md): what a replay
  does with a value that is new on every run.
- [keploy.yml and keploy.lock](./keploy-yml-and-lock.md): with
  `KEPLOY_PROVEN=1`, `mock.real` names destinations every run reaches for
  real.
