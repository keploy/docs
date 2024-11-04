---
id: samples-bunjs
title: BunJS Sample Application
sidebar_label: BunJS + Mongo
description: The following sample app showcases how to use BunJS framework and the Keploy Platform.
tags:
  - javascript
  - quickstart
  - samples
  - examples
  - tutorial
  - bun-js-framework
  - mongodb
keyword:
  - BunJS Framework
  - MongoDB
  - BunJS
  - API Test generator
  - Auto Testcase generation
  - javascript
  - typescript
---

# Introduction

This is a sample app to test Keploy integration capabilities using [Bun.js](https://bun.sh) and [MongoDB](https://www.mongodb.com/).

import InstallationGuide from '../concepts/installation.md'

<InstallationGuide/>

## Get Started! 🎬

## Clone a sample user data CRUD app 🧪

```bash
git clone https://github.com/keploy/samples-typescript && cd samples-typescript/bun-mongo

#Install bun using this command

curl -fsSL https://bun.sh/install | bash

# Install the dependencies

bun install
```

## Installation Keploy

Depending on your OS, choose your adventure:

There are 2 ways you can run this sample application.

- [Using Docker container for Postgres and running application locally](#running-app-locally-on-linuxwsl-)

## Running App Locally on Linux/WSL 🐧

We'll be running our sample application right on Linux, but just to make things a tad more thrilling, we'll have the database (MongoDB) chill on Docker. Ready? Let's get the party started!🎉

### 📼 Roll the Tape - Recording Time!

Install the dependencies. Note: using this command directly without installing bun might give an error like `zsh: command not found: bun`

```bash
bun install
```

Using the docker-compose file we will start our Postgres instance:-

```bash
docker-compose up -d mongo
```

Ready, set, record! Here's how:

```bash
sudo -E env PATH=$PATH Keploy record -c 'bun run supabun.ts'
```

Keep an eye out for the `-c `flag! It's the command charm to run the app.

Alright, magician! With the app alive and kicking, let's weave some test cases. The spell? Making some API calls! Postman, Hoppscotch, or the classic curl - pick your wand.

### Generate testcases

To generate testcases we just need to **make some API calls.**

**1. Make a POST request**

```bash
curl --request POST localhost:4200/save

```

**2. Make a GET request**

```bash
curl --request GET localhost:4200/fetch
```

Give yourself a pat on the back! With that simple spell, you've conjured up a test case with a mock! Explore the **Keploy directory** and you'll discover your handiwork in `test-1.yml` and `mocks.yml`.

````yaml
version: api.keploy.io/v1beta1
kind: Http
name: test-1
spec:
  metadata: {}
  req:
    method: POST
    proto_major: 1
    proto_minor: 1
    url: http://localhost:4200/save
    header:
      Accept: "*/*"
      Host: localhost:4200
      User-Agent: curl/8.2.1
    body: ""
    timestamp: 2024-02-24T11:16:49.156825536Z
  resp:
    status_code: 200
    header:
      Access-Control-Allow-Credentials: "true"
      Access-Control-Allow-Headers: "*"
      Access-Control-Allow-Methods: POST
      Access-Control-Allow-Origin: "*"
      Access-Control-Exposed-Headers: "*"
      Content-Length: "16"
      Content-Type: application/json;charset=utf-8
      Date: Sat, 24 Feb 2024 11:16:49 GMT
      Vary: "*"
    body: '{"success":true}'
    status_message: OK
    proto_major: 0
    proto_minor: 0
    timestamp: 2024-02-24T11:16:51.280382177Z
  objects: []
  assertions:
    noise:
      header.Date: []
  created: 1708773411
curl: |
  curl --request POST \
    --url http://localhost:4200/save \
    --header 'User-Agent: curl/8.2.1' \
    --header 'Accept: */*' \
    --header 'Host: localhost:4200' \


```yaml
---
version: api.keploy.io/v1beta1
kind: Mongo
name: mock-0
spec:
    metadata:
        operation: '{ OpQuery flags: [], fullCollectionName: admin.$cmd, numberToSkip: 0, numberToReturn: -1, query: {"ismaster": {"$numberInt":"1"},"helloOk": true,"client": {"driver": {"name": "nodejs|Mongoose","version": "5.9.1|7.6.8"},"platform": "Bun v1.0.29, LE","os": {"name": "linux","architecture": "x64","version": "6.5.0-17-generic","type": "Linux"}},"compression": ["none"]}, returnFieldsSelector:  }'
        type: config
    requests:
        - header:
            length: 298
            requestId: 1
            responseTo: 0
            Opcode: 2004
          message:
            flags: 0
            collection_name: admin.$cmd
            number_to_skip: 0
            number_to_return: -1
            query: '{"ismaster":{"$numberInt":"1"},"helloOk":true,"client":{"driver":{"name":"nodejs|Mongoose","version":"5.9.1|7.6.8"},"platform":"Bun v1.0.29, LE","os":{"name":"linux","architecture":"x64","version":"6.5.0-17-generic","type":"Linux"}},"compression":["none"]}'
            return_fields_selector: ""
    responses:
        - header:
            length: 329
            requestId: 3
            responseTo: 1
            Opcode: 1
          message:
            response_flags: 8
            cursor_id: 0
            starting_from: 0
            number_returned: 1
            documents:
                - '{"helloOk":true,"ismaster":true,"topologyVersion":{"processId":{"$oid":"65d9cff2df019fd437739fbf"},"counter":{"$numberLong":"0"}},"maxBsonObjectSize":{"$numberInt":"16777216"},"maxMessageSizeBytes":{"$numberInt":"48000000"},"maxWriteBatchSize":{"$numberInt":"100000"},"localTime":{"$date":{"$numberLong":"1708773364196"}},"logicalSessionTimeoutMinutes":{"$numberInt":"30"},"connectionId":{"$numberInt":"1"},"minWireVersion":{"$numberInt":"0"},"maxWireVersion":{"$numberInt":"21"},"readOnly":false,"ok":{"$numberDouble":"1.0"}}'
          read_delay: 623599
    created: 1708773364
    reqTimestampMock: 2024-02-24T11:16:04.196109922Z
    resTimestampMock: 2024-02-24T11:16:04.197231354Z
---
version: api.keploy.io/v1beta1
kind: Mongo
name: mock-1
spec:
    metadata:
        operation: '{ OpMsg flags: 0, sections: [{ SectionSingle msg: {"create":"animals","lsid":{"id":{"$binary":{"base64":"zOPs0UhFTzaDZlU+iad5xg==","subType":"04"}}},"$db":"keploy"} }], checksum: 0 }'
    requests:
        - header:
            length: 98
            requestId: 3
            responseTo: 0
            Opcode: 2013
          message:
            flagBits: 0
            sections:
                - '{ SectionSingle msg: {"create":"animals","lsid":{"id":{"$binary":{"base64":"zOPs0UhFTzaDZlU+iad5xg==","subType":"04"}}},"$db":"keploy"} }'
            checksum: 0
          read_delay: 6520498
    responses:
        - header:
            length: 38
            requestId: 5
            responseTo: 3
            Opcode: 2013
          message:
            flagBits: 0
            sections:
                - '{ SectionSingle msg: {"ok":{"$numberDouble":"1.0"}} }'
            checksum: 0
          read_delay: 602253
    created: 1708773364
    reqTimestampMock: 2024-02-24T11:16:04.254900776Z
    resTimestampMock: 2024-02-24T11:16:04.25581579Z
---
version: api.keploy.io/v1beta1
kind: Mongo
name: mock-2
spec:
    metadata:
        operation: '{ OpMsg flags: 65536, sections: [{ SectionSingle msg: {"hello":{"$numberInt":"1"},"maxAwaitTimeMS":{"$numberInt":"10000"},"topologyVersion":{"processId":{"$oid":"65d9cff2df019fd437739fbf"},"counter":{"$numberLong":"0"}},"$db":"admin"} }], checksum: 0 }'
        type: config
    requests:
        - header:
            length: 134
            requestId: 4
            responseTo: 0
            Opcode: 2013
          message:
            flagBits: 65536
            sections:
                - '{ SectionSingle msg: {"hello":{"$numberInt":"1"},"maxAwaitTimeMS":{"$numberInt":"10000"},"topologyVersion":{"processId":{"$oid":"65d9cff2df019fd437739fbf"},"counter":{"$numberLong":"0"}},"$db":"admin"} }'
            checksum: 0
          read_delay: 531789033
    responses:
        - header:
            length: 313
            requestId: 6
            responseTo: 4
            Opcode: 2013
          message:
            flagBits: 2
            sections:
                - '{ SectionSingle msg: {"isWritablePrimary":true,"topologyVersion":{"processId":{"$oid":"65d9cff2df019fd437739fbf"},"counter":{"$numberLong":"0"}},"maxBsonObjectSize":{"$numberInt":"16777216"},"maxMessageSizeBytes":{"$numberInt":"48000000"},"maxWriteBatchSize":{"$numberInt":"100000"},"localTime":{"$date":{"$numberLong":"1708773374735"}},"logicalSessionTimeoutMinutes":{"$numberInt":"30"},"connectionId":{"$numberInt":"1"},"minWireVersion":{"$numberInt":"0"},"maxWireVersion":{"$numberInt":"21"},"readOnly":false,"ok":{"$numberDouble":"1.0"}} }'
            checksum: 0
          read_delay: 10006875186
    created: 1708773374
    reqTimestampMock: 2024-02-24T11:16:04.728966188Z
    resTimestampMock: 2024-02-24T11:16:14.736354258Z
---
version: api.keploy.io/v1beta1
kind: Mongo
name: mock-3
spec:
    metadata:
        operation: '{ OpMsg flags: 0, sections: [{ SectionSingle msg: {"ismaster":{"$numberInt":"1"},"$db":"admin"} }], checksum: 0 }'
        type: config
    requests:
        - header:
            length: 55
            requestId: 6
            responseTo: 0
            Opcode: 2013
          message:
            flagBits: 0
            sections:
                - '{ SectionSingle msg: {"ismaster":{"$numberInt":"1"},"$db":"admin"} }'
            checksum: 0
          read_delay: 10013801234
    responses:
        - header:
            length: 304
            requestId: 9
            responseTo: 6
            Opcode: 2013
          message:
            flagBits: 0
            sections:
                - '{ SectionSingle msg: {"ismaster":true,"topologyVersion":{"processId":{"$oid":"65d9cff2df019fd437739fbf"},"counter":{"$numberLong":"0"}},"maxBsonObjectSize":{"$numberInt":"16777216"},"maxMessageSizeBytes":{"$numberInt":"48000000"},"maxWriteBatchSize":{"$numberInt":"100000"},"localTime":{"$date":{"$numberLong":"1708773384750"}},"logicalSessionTimeoutMinutes":{"$numberInt":"30"},"connectionId":{"$numberInt":"3"},"minWireVersion":{"$numberInt":"0"},"maxWireVersion":{"$numberInt":"21"},"readOnly":false,"ok":{"$numberDouble":"1.0"}} }'
            checksum: 0
          read_delay: 361888
    created: 1708773384
    reqTimestampMock: 2024-02-24T11:16:24.750477084Z
    resTimestampMock: 2024-02-24T11:16:24.751206134Z
---
version: api.keploy.io/v1beta1
kind: Mongo
name: mock-4
spec:
    metadata:
        operation: '{ OpMsg flags: 0, sections: [{ SectionSingle msg: {"insert":"animals","documents":[{"name":"Cow","sound":"Moo","_id":{"$oid":"65d9d02107882a00d23b5ac0"},"__v":{"$numberInt":"0"}}],"ordered":true,"lsid":{"id":{"$binary":{"base64":"zOPs0UhFTzaDZlU+iad5xg==","subType":"04"}}},"$db":"keploy"} }], checksum: 0 }'
    requests:
        - header:
            length: 187
            requestId: 9
            responseTo: 0
            Opcode: 2013
          message:
            flagBits: 0
            sections:
                - '{ SectionSingle msg: {"insert":"animals","documents":[{"name":"Cow","sound":"Moo","_id":{"$oid":"65d9d02107882a00d23b5ac0"},"__v":{"$numberInt":"0"}}],"ordered":true,"lsid":{"id":{"$binary":{"base64":"zOPs0UhFTzaDZlU+iad5xg==","subType":"04"}}},"$db":"keploy"} }'
            checksum: 0
          read_delay: 44940206029
    responses:
        - header:
            length: 45
            requestId: 14
            responseTo: 9
            Opcode: 2013
          message:
            flagBits: 0
            sections:
                - '{ SectionSingle msg: {"n":{"$numberInt":"1"},"ok":{"$numberDouble":"1.0"}} }'
            checksum: 0
          read_delay: 4726351
    created: 1708773409
    reqTimestampMock: 2024-02-24T11:16:49.196056727Z
    resTimestampMock: 2024-02-24T11:16:49.201252579Z
---
version: api.keploy.io/v1beta1
kind: Mongo
name: mock-5
spec:
    metadata:
        operation: '{ OpMsg flags: 0, sections: [{ SectionSingle msg: {"find":"animals","filter":{"name":"Cow"},"limit":{"$numberInt":"1"},"singleBatch":true,"batchSize":{"$numberInt":"1"},"lsid":{"id":{"$binary":{"base64":"zOPs0UhFTzaDZlU+iad5xg==","subType":"04"}}},"$db":"keploy"} }], checksum: 0 }'
    requests:
        - header:
            length: 163
            requestId: 11
            responseTo: 0
            Opcode: 2013
          message:
            flagBits: 0
            sections:
                - '{ SectionSingle msg: {"find":"animals","filter":{"name":"Cow"},"limit":{"$numberInt":"1"},"singleBatch":true,"batchSize":{"$numberInt":"1"},"lsid":{"id":{"$binary":{"base64":"zOPs0UhFTzaDZlU+iad5xg==","subType":"04"}}},"$db":"keploy"} }'
            checksum: 0
          read_delay: 8924817543
    responses:
        - header:
            length: 166
            requestId: 17
            responseTo: 11
            Opcode: 2013
          message:
            flagBits: 0
            sections:
                - '{ SectionSingle msg: {"cursor":{"firstBatch":[{"_id":{"$oid":"65d9cd7b1052611b2d2aaf42"},"name":"Cow","sound":"Moo","__v":{"$numberInt":"0"}}],"id":{"$numberLong":"0"},"ns":"keploy.animals"},"ok":{"$numberDouble":"1.0"}} }'
            checksum: 0
          read_delay: 574025
    created: 1708773418
    reqTimestampMock: 2024-02-24T11:16:58.126078397Z
    resTimestampMock: 2024-02-24T11:16:58.127001556Z

````

Want to see if everything works as expected?

#### Run Tests

Time to put things to the test 🧪

```shell
sudo -E env PATH=$PATH keploy test -c 'bun run supabun.ts'
```

> The `--delay` flag? Oh, that's just giving your app a little breather (in seconds) before the test cases come knocking.

Final thoughts? Dive deeper! Try different API calls, tweak the DB response in the `mocks.yml`, or fiddle with the request or response in `test-x.yml`. Run the tests again and see the magic unfold!✨👩‍💻👨‍💻✨

### Wrapping it up 🎉

Congrats on the journey so far! You've seen Keploy's power, flexed your coding muscles, and had a bit of fun too! Now, go out there and keep exploring, innovating, and creating! Remember, with the right tools and a sprinkle of fun, anything's possible. 😊🚀

Hope this helps you out, if you still have any questions, reach out to us .

import GetSupport from '../concepts/support.md'

<GetSupport/>
