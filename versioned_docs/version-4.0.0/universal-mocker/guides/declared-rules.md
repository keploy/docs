---
id: declared-rules
title: Declare in keploy.yml what your app does on its own
sidebar_label: Rules in keploy.yml
description: How the mock.rules of keploy.yml name the calls your app makes after a test or on its own timer, the times it reads from its clock and the ids it mints, what keploy mock record and keploy mock replay do with each rule with KEPLOY_PROVEN=1, what keploy refuses, and the lines the rules leave. Read from the Keploy 3.9.10 code.
tags:
  - mocks
  - replay
  - background work
  - noise
keywords:
  - keploy mock
  - mock.rules
  - trailing rule
  - background rule
  - clock rule
  - minted rule
  - mock.times
  - KEPLOY_PROVEN
  - service virtualization
---

# Declare in keploy.yml what your app does on its own

Some calls belong to a test but come after its last request, or come from a
timer no test starts. Some values in a call change on every run because your app
reads them from its clock or makes them anew. This page shows how to name both
under `mock.rules` in your project's `keploy.yml`, and what `keploy mock` does
with each rule. It describes Keploy 3.9.10, as its code is written.

Rules act with [`KEPLOY_PROVEN=1`](../mock-your-tests.md#proven): `keploy mock
record` reads them before anything runs, and `keploy mock replay` serves and
checks what they cover. The open-source `keploy` does not read them.

## Declare the calls your app makes after a test

Some calls belong to a test but come after its last request: a clean-up your app
runs in a goroutine once a delete has answered, or a sweep that repeats that
clean-up every minute. Keploy records such a call in the next test's window, or
between two tests. Left there, it is required of whichever test it landed in, so
that test fails whenever the clean-up comes earlier or later.

Declare these calls under `mock.rules` in `keploy.yml`. `keploy mock record`
then places each recording a rule covers with the test it belongs to, and
`keploy mock replay` serves and checks it there. `trailing` rules cover MongoDB
calls, and `background` rules MongoDB calls and, with `once: true`, HTTP calls.

```yaml
mock:
  rules:
    - id: order-items-cleanup
      kind: trailing
      why: Deleting an order deletes its items by order_id in a goroutine, and a sweep repeats it every minute.
      match:
        {mongo: {db: shop, command: delete, collection: [items, itemNotes]}}
      boundBy: [body.docs.msgs.0.q.order_id]
    - id: empty-carts-delete
      kind: background
      why: A timer deletes the carts left with no items.
      match: {mongo: {db: shop, command: delete, collection: carts}}
      where: [{field: body.docs.msgs.0.q.items, equals: []}]
```

| Key       | What it says                                                                                                                                                                                                             |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `id`      | The rule's name: 3 to 64 lowercase letters, digits and dashes, starting with a letter or digit. Each rule needs its own.                                                                                                 |
| `kind`    | `trailing`: work the app does for a test after the test asked for it. `background`: a request the app repeats on its own timer. `clock` and `minted`: see [Times and ids your app makes](#times-and-ids-your-app-makes). |
| `why`     | Why the app makes the call, in your words, up to 1000 bytes. Required; it is not part of the rule's digest, so rewording it changes nothing.                                                                             |
| `match`   | `mongo: {db, command, collection}`, each a literal name (no patterns). `collection` is one name or a list. Or `http: {method, host, path}`, where the rule's kind allows it.                                             |
| `where`   | Optional, up to 8 conditions on the recorded request: `{field: <place>, equals: <value>}`, or `{field: <place>, prefix: <text>}` for a text that starts with it. Not on an `http` target.                                |
| `boundBy` | `trailing` only, and required there: the places in the recorded request that hold the trailed test's value, such as the deleted id.                                                                                      |
| `once`    | `background` only: `true` says the app makes the call once per process, for whichever test needs it first.                                                                                                               |
| `chain`   | With `once: true` only: up to 4 targets of the calls the app makes just before this one on the same connection, in order.                                                                                                |
| `due`     | With `once: true` only: a duration such as `10s`, the most time after your app starts that its timer makes the call.                                                                                                     |

An `http` target names a method, a host (with its port if it has one) and a
path, each literally; a path segment `{}` stands for exactly one segment,
whatever it holds.

**What a `trailing` rule does.** A recording the rule covers goes with the test
that first sent the value at a `boundBy` place, and the replay serves it wherever
its call lands. When the app repeats the call more times than were recorded, the
last recording answers each repeat, so a slower or faster sweep does not miss.
Each repeat must still match the recorded request, and a call that carries the
test's value at a `boundBy` place but another value elsewhere fails that test.

A trailing write is required once per run of the test it trails: if the app never
makes it, that test fails with `RULE NOT MADE`. Before it decides, the replay
waits while the app is still making progress on what it owes, with no fixed
timeout. A read, or a write whose every recording changed nothing (its reply
counts `n` 0, and `nModified` 0 where it has one; for a `findAndModify`, its
`lastErrorObject` counts them and its `value` is null), is served but not
required.

On macOS and Windows, keploy waits only on what it can see still running. On
macOS it tells that the app still runs from the process group your test command
started; a process that leaves that group, such as a daemon started with
`setsid`, is not waited on. On Windows it does not wait on the app once your test
command exits. Either way, a trailing write still owed then fails its test with
`RULE NOT MADE`, never a silent pass.

**What keploy refuses, and why.** keploy places or binds a call only when it can
tell which test sent the value, and otherwise leaves the call where it was
recorded:

- A test with no recorded requests (no cases) cannot show which values it sent
  the app, so a rule's call recorded in its window stays that test's own.
- If the test sent the value first at two fields of its requests, keploy cannot
  tell which one the clean-up's value came from, so the call is not bound to that
  test's value and stays where it was recorded.

**What a `background` rule does.** One request with one answer that the app
makes in several windows is served in any window. A background write is required
once in a run that reaches the test it was first recorded in. A request the set
recorded only once is served once in the run and not required: a second call of
it misses.

With `once: true`, the rule covers a call your app makes once per process, such
as fetching a token at its first use. The replay serves its recording once in
the run, in whichever test's window or between tests the call comes, and never
again: a second call of the same request misses, so an app that starts making
the call per request fails. If the set holds more than one recording of the
request, or the calls just before it on its connection are not its `chain`, in
order, in one test's window, the recording stays where it was; when they are,
they are placed with it, as one series. With `due`, the
replay requires the write only in a run your app outlived that bound; in a
shorter run it prints `RULE NOT DUE` and passes on it.

Where a `once` rule would place a call, keploy suggests one: a
`RULE WOULD COVER` line prints the rule's YAML to paste under `mock.rules`, its
`why` set to `TODO: say why the app makes this call`. Keploy refuses the rule
while its `why` still says that, so write your own.

**Rules are read whole or not at all.** If keploy cannot read every rule, it
prints `RULES REFUSED` with the first problem and runs no `keploy mock` command
until you fix it. Problems that refuse the set include an unknown key, a missing
`id`, `kind`, `why` or `match`, two rules with one `id`, a pattern in a name, an
unknown command, a place that does not parse, a `trailing` rule without
`boundBy`, a key of another kind of rule, an `http` target on a kind that does
not take one, `chain` or `due` without `once: true`, a document as a `where`
value (name each of its fields in a condition of its own), a `why` over 1000
bytes or still the suggested `TODO` text, a kind (`client-value`, `answer`) or
key (`vary`, `answers`, `from`, `tests`) this keploy does not build, and more
than 200 rules.

**What the rules leave behind.**

- Each recording a rule placed names it in `mappings.yaml` (`rule: <id>@<8 hex>`)
  with the reason it was placed. A recording two rules cover stays where it was
  (`RULES CONFLICT`), and one a rule matched but could not place says why
  (`RULE DID NOT HOLD`).
- `keploy.lock` pins the rules each set was recorded with, with a note such as
  `5 rules (trailing 4, background 1); 412 calls placed, for 31 tests`. A replay
  whose `keploy.yml` rules differ prints `RULES CHANGED` and does not run: record
  the set again with the new rules, or put back the old ones.
- At the end of a replay, one `RULE USED` line per rule says what its series
  answered, how many repeats went past the recorded count, and how many required
  series were made, not made, or not due because their test did not run.

## Times and ids your app makes

When `keploy mock record` runs your tests a second time to learn what changes
from run to run, two kinds of field differ in every run: a time your app reads
from its clock, and an id it makes anew for a call. Keploy checks a changed time
by its type and format with no rule. Declare an id your app mints with a
`minted` rule in `keploy.yml`.

**Times are checked by their type and format.** On a MongoDB call, a time that
changed between the two runs passes at replay with any value of the type and
format it was recorded in: the same BSON type, an epoch number in the same unit
(seconds, milliseconds, microseconds or nanoseconds), or a text with the same
field order, separators and zone form, with or without a fraction of a second.
A time your app wrote in two formats in the two runs (a zone offset in one and
`Z` in the other, or an epoch in seconds in one and in milliseconds in the
other) passes in either. Keploy does not check the time's range or which clock
read it: your tests' own assertions check the test, and keploy's check is a
bonus over them. A value of another type or format fails the test, and the line
names both. On an HTTP call, a time your app copied from an earlier read of its
clock passes by its format where it no longer equals that read; HTTP's other
times, and times on other calls, are still checked by their range and which
clock read them.

A field is a time when its decoder types it as one (a BSON datetime or
timestamp), when keploy learned it as a read of your app's clock, or when a
`clock` rule declares it. A text that only looks like a date, or a number that
only looks like an epoch, is not a time: keploy checks it like any other value.

To check times strictly instead (the range, the cut, the zone and which clock
read the value), set `strict`, the only value `mock.times` takes. Any other value
is refused with `RULES REFUSED` before anything runs.

```yaml
mock:
  times: strict
```

**Declare a read of the clock.** A `clock` rule says your app reads a field from
its clock for the call. Keploy then learns the field as a read of the clock even
where the same moment also stands in an earlier answer, but only where the
replay's own clock check holds it in both runs. With the time default on, a
time keploy learns as a read of the clock needs no rule. Declare one for a time
your app copies from an earlier answer, such as a record's creation time written
again in an audit row: keploy learns that as a copy, and the time default does
not cover a copy.

```yaml
mock:
  rules:
    - id: audit-audited-at
      kind: clock
      why: The audit insert sets auditedAt to time.Now().Unix().
      match: {mongo: {db: shop, command: insert, collection: audits}}
      field: body.docs.msgs.0.auditedAt.$numberLong
      clock: {min: -1s, max: 0s, res: 1s}
```

With `mock.times: strict`, keploy prints `RULE NEVER CHECKED` for a clock rule
whose range lies all on one side of the call at a unit of a second or finer,
and runs: a replay then compares that field as one no rule names. A range
around the call, from `min` at or below `0s` to `max` at or above it, is
checked.

**Declare an id your app mints.** A `minted` rule says your app makes the field's
whole value anew for the call, such as the UUID it gives a new document:

```yaml
mock:
  rules:
    - id: order-id
      kind: minted
      why: CreateOrder gives each new order a fresh uuid.NewString().
      match: {mongo: {db: shop, command: insert, collection: orders}}
      field: body.docs.msgs.0._id
```

At replay keploy binds the new id, and every later call that uses it must send
the same value, as must any other field of the same request that recorded the
whole id, alone or inside a longer text, or a part of it long enough not to be
there by chance (32 bits or more, such as a UUID's last group, or two groups of
a key like `QX7K-M2RD-T9VB-W4HZ`). A short piece of the id that stands in
another field by chance, such as one letter, a UUID's four-digit group or one
group of such a key, does not tie that field to the id. A recording no test
owns, such as a background worker's insert, mints its own id at each call:
keploy checks that id the same way, and a field of the same request that
recorded the whole id must carry the call's new one, but no later call is held
to it. On such a recording, a field that holds the id's words rather than the
whole id, such as `apps/<uuid>` for a UUID id or the bare UUID of an
`apps/<uuid>` id, is not learned. The id fails its test with `minted value
reused` when it is the recorded value, or one the run already bound at a minted
field, and with `minted value of another shape` when it lacks the prefix the
recorded ids share or its length lies outside theirs. Keploy does not check
which characters follow the prefix, so a fresh id never fails for a character
the recordings did not show. A part of the id your app copied from an earlier
call, such as the tenant in `<tenant>-<random>`, is still checked against this
run's value.

| Key     | What it says                                                                                                                                                                 |
| ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `field` | `clock` and `minted`: one place in the recorded request that names a whole value, such as `body.docs.msgs.0._id`. Not a word of a value (`#n`) or a decoding step.           |
| `clock` | `clock` only: `{min, max, res}`, each a duration with its unit. The value lies from `min` to `max` of the call, read at the cut `res`; the range is at most two cuts and 1s. |

Minted rules cover MongoDB calls. A clock rule covers MongoDB calls, and HTTP
calls with its `field` in the request body. A minted rule on an `http` target
is refused with `RULES REFUSED`.

**What these rules leave behind.** Each recording a `clock` or `minted` rule
covers carries the rule as `sources:` in `mappings.yaml`. `keploy.lock` pins
them, and a pull writes them back, so CI's replay checks the field as the judge
did. One `RULE DECLARED` line per rule says how many recordings it matched and
how many it declared. A recording it matched but could not declare is named in a
`RULE DID NOT HOLD` line, for example when the request holds no value at the
field. Two rules that declare one field of one recording are a `RULES CONFLICT`,
and neither applies.

## See also

- [Start-up calls and background work](./background-workers.md): where a call
  made outside every test is recorded, and `sessionCalls`.
- [Times, dates and ids that change](./changing-values.md): what a replay does
  with a value that is new on every run.
- [keploy.yml and keploy.lock](./keploy-yml-and-lock.md): what the lock pins.
- [Reference](../reference.md#the-last-replay): the `rule_not_made` reason of a
  replay's result.
