---
id: samples-gin
title: Sample URL Shortener App (Golang)
sidebar_label: Gin + Mongo
description: The following sample app showcases how to use gin framework and the Keploy Platform.
tags:
  - go
  - quickstart
  - samples
  - examples
  - tutorial
keyword:
  - Gin Framework
  - MongoDB Mock
  - Golang
  - API Test generator
  - Auto Testcase generation
---

## Introduction

🪄 Dive into the world of URL shorteners and see how seamlessly Keploy integrates with [Gin](https://gin-gonic.com/) and [MongoDB](https://www.mongodb.com/). Buckle up, it's gonna be a fun ride! 🎢

## Pre-Requisite 🛠️

- Install WSL (`wsl --install`) for <img src="/docs/img/os/windows.png" alt="Windows" width="3%" /> Windows.

## Optional 🛠️

- Install Colima( `brew install colima && colima start` ) for <img src="/docs/img/os/macos.png" alt="MacOS" width="3%" /> MacOs.

## Get Started! 🎬

## Clone a sample URL shortener app 🧪

```bash
git clone https://github.com/keploy/samples-go.git && cd samples-go/gin-mongo
go mod download
```

## Installation 📥

Depending on your OS, choose your adventure:

- <details>
   <summary><img src="/docs/img/os/linux.png" alt="Linux" width="3%" /> Linux or <img src="/docs/img/os/windows.png" alt="Windows" width="3%" /> Windows</summary>

  Alright, let's equip ourselves with the **latest Keploy binary**:

  ```bash
  curl --silent --location "https://github.com/keploy/keploy/releases/latest/download/keploy_linux_amd64.tar.gz" | tar xz -C /tmp

  sudo mkdir -p /usr/local/bin && sudo mv /tmp/keploy /usr/local/bin && keploy
  ```

  If everything goes right, your screen should look a bit like this:

   <img src="/docs/img/code-snippets/install-keploy-logs.png" alt="Test Case Generator" width="50%" />

  Moving on...
   <details>
   <summary style={{ fontWeight: 'bold', fontSize: '1.17em', marginLeft: '0.5em' }}> Run App with <img src="/docs/img/os/docker.png" alt="Docker Container" width="3%" /> Docker </summary>

  #### Add alias for Keploy:

  ```bash
  alias keploy='sudo docker run --pull always --name keploy-v2 -p 16789:16789 --privileged --pid=host -it -v "$(pwd)":/files -v /sys/fs/cgroup:/sys/fs/cgroup -v /sys/kernel/debug:/sys/kernel/debug -v /sys/fs/bpf:/sys/fs/bpf -v /var/run/docker.sock:/var/run/docker.sock -v '"$HOME"'/.keploy-config:/root/.keploy-config -v '"$HOME"'/.keploy:/root/.keploy --rm ghcr.io/keploy/keploy'
  ```

  ### Lights, Camera, Record! 🎥

  Fire up the application and mongoDB instance with Keploy. Keep an eye on the two key flags:
  `-c`: Command to run the app (e.g., `docker compose up`).

  `--containerName`: The container name in the `docker-compose.yml` for traffic interception.

  ```bash
  keploy record -c "docker compose up" --containerName "ginMongoApp"
  ```

  Getting logs like this? Perfect! 👌

   <img src="/docs/img/code-snippets/keploy-record-docker.png" alt="Keploy Record Test case" width="100%" />
   <img src="/docs/img/code-snippets/keploy-record-docker2.png" alt="Keploy record mocks" width="100%" />

  🔥 Challenge time! Generate some test cases. How? Just **make some API calls**. Postman, Hoppscotch or even curl - take your pick!

  Let's make URLs short and sweet:

  #### Generate shortened url

  ```bash
  curl --request POST \
    --url http://localhost:8080/url \
    --header 'content-type: application/json' \
    --data '{
    "url": "https://google.com"
  }'
  ```

  Here's a peek of what you get:

  ```json
  {
    "ts": 1645540022,
    "url": "http://localhost:8080/Lhr4BWAi"
  }
  ```

  🎉 Woohoo! With a simple API call, you've crafted a test case with a mock! Dive into the Keploy directory and feast your eyes on the newly minted `test-1.yml` and `mocks.yml`

  ```yaml
  version: api.keploy.io/v1beta2
  kind: Http
  name: test-1
  spec:
    metadata: {}
    req:
      method: POST
      proto_major: 1
      proto_minor: 1
      url: http://localhost:8080/url
      header:
        Accept: "*/*"
        Content-Length: "33"
        Content-Type: application/json
        Host: localhost:8080
        User-Agent: curl/7.77.0
      body: |-
        {
          "url": "https://google.com"
        }
      body_type: ""
    resp:
      status_code: 200
      header:
        Content-Length: "65"
        Content-Type: application/json; charset=utf-8
        Date: Sun, 01 Oct 2023 15:15:47 GMT
      body: '{"ts":1696173347979970488,"url":"http://localhost:8080/Lhr4BWAi"}'
      body_type: ""
      status_message: ""
      proto_major: 0
      proto_minor: 0
    objects: []
    assertions:
      noise:
        - header.Date
    created: 1696173352
  ```

  this is how the generated **mock.yml** will look like:

  ```yaml
  version: api.keploy.io/v1beta2
  kind: Mongo
  name: mocks
  spec:
    metadata:
      operation: '{ OpMsg flags: 0, sections: [{ SectionSingle msg: {"update":"url-shortener","ordered":true,"writeConcern":{"w":"majority"},"lsid":{"id":{"$binary":{"base64":"eRaUQwDxR2qw3Jcbpn0Gfw==","subType":"04"}}},"$db":"keploy"} }, { SectionSingle identifier: updates , msgs: [ {"q":{"_id":"Lhr4BWAi"},"u":{"$set":{"_id":"Lhr4BWAi","created":{"$date":{"$numberLong":"1696173347975"}},"updated":{"$date":{"$numberLong":"1696173347975"}},"url":"https://google.com"}},"upsert":true} ] }], checksum: 0 }'
    requests:
      - header:
          length: 301
          requestId: 11
          responseTo: 0
          Opcode: 2013
        message:
          flagBits: 0
          sections:
            - '{ SectionSingle msg: {"update":"url-shortener","ordered":true,"writeConcern":{"w":"majority"},"lsid":{"id":{"$binary":{"base64":"eRaUQwDxR2qw3Jcbpn0Gfw==","subType":"04"}}},"$db":"keploy"} }'
            - '{ SectionSingle identifier: updates , msgs: [ {"q":{"_id":"Lhr4BWAi"},"u":{"$set":{"_id":"Lhr4BWAi","created":{"$date":{"$numberLong":"1696173347975"}},"updated":{"$date":{"$numberLong":"1696173347975"}},"url":"https://google.com"}},"upsert":true} ] }'
          checksum: 0
        read_delay: 41060962050
    responses:
      - header:
          length: 60
          requestId: 14
          responseTo: 11
          Opcode: 2013
        message:
          flagBits: 0
          sections:
            - '{ SectionSingle msg: {"n":{"$numberInt":"1"},"nModified":{"$numberInt":"1"},"ok":{"$numberDouble":"1.0"}} }'
          checksum: 0
        read_delay: 2506709
    created: 1696173347
  ---
  version: api.keploy.io/v1beta2
  kind: Mongo
  name: mocks
  spec:
    metadata:
      operation: '{ OpMsg flags: 0, sections: [{ SectionSingle msg: {"find":"url-shortener","filter":{"_id":"Lhr4BWAi"},"limit":{"$numberLong":"1"},"singleBatch":true,"lsid":{"id":{"$binary":{"base64":"eRaUQwDxR2qw3Jcbpn0Gfw==","subType":"04"}}},"$db":"keploy"} }], checksum: 0 }'
    requests:
      - header:
          length: 162
          requestId: 48
          responseTo: 0
          Opcode: 2013
        message:
          flagBits: 0
          sections:
            - '{ SectionSingle msg: {"find":"url-shortener","filter":{"_id":"Lhr4BWAi"},"limit":{"$numberLong":"1"},"singleBatch":true,"lsid":{"id":{"$binary":{"base64":"eRaUQwDxR2qw3Jcbpn0Gfw==","subType":"04"}}},"$db":"keploy"} }'
          checksum: 0
        read_delay: 355688136129
    responses:
      - header:
          length: 197
          requestId: 90
          responseTo: 48
          Opcode: 2013
        message:
          flagBits: 0
          sections:
            - '{ SectionSingle msg: {"cursor":{"firstBatch":[{"_id":"Lhr4BWAi","created":{"$date":{"$numberLong":"1696173347975"}},"updated":{"$date":{"$numberLong":"1696173347975"}},"url":"https://google.com"}],"id":{"$numberLong":"0"},"ns":"keploy.url-shortener"},"ok":{"$numberDouble":"1.0"}} }'
          checksum: 0
        read_delay: 4509611
    created: 1696173703
  ```

  _Time to perform more API magic!_
  Follow the breadcrumbs... or the shortened URLs:

  #### Redirect to original url from shortened url

  ```bash
  curl --request GET \  --url http://localhost:8080/Lhr4BWAi
  ```

  Or just type `http://localhost:8080/Lhr4BWAi` in your browser. Your choice!

  Spotted the new test and mock files in your project? High five! 🙌

  <img src="/docs/img/code-snippets/gin-mongo-test-sample.png" alt="Sample Keploy Test case and Mock for Gin MongoDB" width="100%" style={{ borderRadius: '5px' }}/>

  Want to see if everything works as expected?

  #### Run Tests

  Time to put things to the test 🧪

  ```bash
  keploy test -c "docker compose up" --containerName "ginMongoApp" --delay 10
  ```

  > The `--delay` flag? Oh, that's just giving your app a little breather (in seconds) before the test cases come knocking.

  Your results should be looking all _snazzy_, like this:

  <img src="/docs/img/code-snippets/url-shortner-test-result.png" alt="Sample Keploy Test Result Gin MongoDB" width="100%" style={{ borderRadius: '5px' }}/>

  Did you spot that the ts (timestamp) is showing some differences? Yep, time has a way of doing that! 🕰️

  Worry not, just add the ever-changing fields (like our **ts** here) to the **noise parameter** to **dodge those assertions**.

  > Pro tip: Add `body.ts` to noise in `test-x.yaml`.

  <img src="/docs/img/code-snippets/noise-addition.png" alt="Adding Noise to Test case Gin MongoDB" width="70%" style={{ borderRadius: '5px' }}/>

  Run that keploy record command once more and watch as everything falls into place with all tests passing!🌟

  Final thoughts? Dive deeper! Try different API calls, tweak the DB response in the `mocks.yml`, or fiddle with the request or response in `test-x.yml`. Run the tests again and see the magic unfold!✨👩‍💻👨‍💻✨

  ## Wrapping it up 🎉

  Congrats on the journey so far! You've seen Keploy's power, flexed your coding muscles, and had a bit of fun too! Now, go out there and keep exploring, innovating, and creating! Remember, with the right tools and a sprinkle of fun, anything's possible.😊🚀

  Happy coding! ✨👩‍💻👨‍💻✨

   </details>
   <br/>

   <details>
   <summary style={{ fontWeight: 'bold', fontSize: '1.17em', marginLeft: '0.5em' }}>Run App on 🐧 Linux  </summary>

  We'll be running our sample application right on Linux, but just to make things a tad more thrilling, we'll have the database (mongoDB) chill on Docker. Ready? Let's get the party started!🎉
  First things first, update the MongoDB URL to `localhost:27017` on **line 21** of our trusty `main.go` file.

  <img src="/docs/img/code-snippets/gin-mongo-linux-cmd.png" alt="Linux change Gin MongoDB" width="100%" style={{ borderRadius: '5px' }}/>

  #### 🍃 Kickstart MongoDB

  Let's breathe life into your mongo container. A simple spell should do the trick:

  ```bash
  docker compose up mongo
  ```

  ### 📼 Roll the Tape - Recording Time!

  Ready, set, record! Here's how:

  ```bash
  sudo -E env PATH=$PATH keploy record -c "go run main.go handler.go"
  ```

  Keep an eye out for the `-c `flag! It's the command charm to run the app. Whether you're using `go run main.go handler.go` or the binary path like `./test-app-url-shortener`, it's your call.
  If you're seeing logs that resemble the ones below, you're on the right track:

   <img src="/docs/img/code-snippets/keploy-record-docker.png" alt="Keploy Record Test case" width="100%" />
   <img src="/docs/img/code-snippets/keploy-record-docker2.png" alt="Keploy record mocks" width="100%" />

  Alright, magician! With the app alive and kicking, let's weave some test cases. The spell? Making some API calls! Postman, Hoppscotch, or the classic curl - pick your wand.

  #### Generate shortened url

  ✨ A pinch of URL magic:

  ```bash
  curl --request POST \
    --url http://localhost:8080/url \
    --header 'content-type: application/json' \
    --data '{
    "url": "https://google.com"
  }'
  ```

  And... voila! A shortened URL appears:

  ```json
  {
    "ts": 1645540022,
    "url": "http://localhost:8080/Lhr4BWAi"
  }
  ```

  Give yourself a pat on the back! With that simple spell, you've conjured up a test case with a mock! Explore the **Keploy directory** and you'll discover your handiwork in `test-1.yml` and `mocks.yml`.

  ```yaml
  version: api.keploy.io/v1beta2
  kind: Http
  name: test-1
  spec:
    metadata: {}
    req:
      method: POST
      proto_major: 1
      proto_minor: 1
      url: http://localhost:8080/url
      header:
        Accept: "*/*"
        Content-Length: "33"
        Content-Type: application/json
        Host: localhost:8080
        User-Agent: curl/7.77.0
      body: |-
        {
          "url": "https://google.com"
        }
      body_type: ""
    resp:
      status_code: 200
      header:
        Content-Length: "65"
        Content-Type: application/json; charset=utf-8
        Date: Sun, 01 Oct 2023 15:15:47 GMT
      body: '{"ts":1696173347979970488,"url":"http://localhost:8080/Lhr4BWAi"}'
      body_type: ""
      status_message: ""
      proto_major: 0
      proto_minor: 0
    objects: []
    assertions:
      noise:
        - header.Date
    created: 1696173352
  ```

  this is how the generated **mock.yml** will look like:

  ```yaml
  version: api.keploy.io/v1beta2
  kind: Mongo
  name: mocks
  spec:
    metadata:
      operation: '{ OpMsg flags: 0, sections: [{ SectionSingle msg: {"update":"url-shortener","ordered":true,"writeConcern":{"w":"majority"},"lsid":{"id":{"$binary":{"base64":"eRaUQwDxR2qw3Jcbpn0Gfw==","subType":"04"}}},"$db":"keploy"} }, { SectionSingle identifier: updates , msgs: [ {"q":{"_id":"Lhr4BWAi"},"u":{"$set":{"_id":"Lhr4BWAi","created":{"$date":{"$numberLong":"1696173347975"}},"updated":{"$date":{"$numberLong":"1696173347975"}},"url":"https://google.com"}},"upsert":true} ] }], checksum: 0 }'
    requests:
      - header:
          length: 301
          requestId: 11
          responseTo: 0
          Opcode: 2013
        message:
          flagBits: 0
          sections:
            - '{ SectionSingle msg: {"update":"url-shortener","ordered":true,"writeConcern":{"w":"majority"},"lsid":{"id":{"$binary":{"base64":"eRaUQwDxR2qw3Jcbpn0Gfw==","subType":"04"}}},"$db":"keploy"} }'
            - '{ SectionSingle identifier: updates , msgs: [ {"q":{"_id":"Lhr4BWAi"},"u":{"$set":{"_id":"Lhr4BWAi","created":{"$date":{"$numberLong":"1696173347975"}},"updated":{"$date":{"$numberLong":"1696173347975"}},"url":"https://google.com"}},"upsert":true} ] }'
          checksum: 0
        read_delay: 41060962050
    responses:
      - header:
          length: 60
          requestId: 14
          responseTo: 11
          Opcode: 2013
        message:
          flagBits: 0
          sections:
            - '{ SectionSingle msg: {"n":{"$numberInt":"1"},"nModified":{"$numberInt":"1"},"ok":{"$numberDouble":"1.0"}} }'
          checksum: 0
        read_delay: 2506709
    created: 1696173347
  ---
  version: api.keploy.io/v1beta2
  kind: Mongo
  name: mocks
  spec:
    metadata:
      operation: '{ OpMsg flags: 0, sections: [{ SectionSingle msg: {"find":"url-shortener","filter":{"_id":"Lhr4BWAi"},"limit":{"$numberLong":"1"},"singleBatch":true,"lsid":{"id":{"$binary":{"base64":"eRaUQwDxR2qw3Jcbpn0Gfw==","subType":"04"}}},"$db":"keploy"} }], checksum: 0 }'
    requests:
      - header:
          length: 162
          requestId: 48
          responseTo: 0
          Opcode: 2013
        message:
          flagBits: 0
          sections:
            - '{ SectionSingle msg: {"find":"url-shortener","filter":{"_id":"Lhr4BWAi"},"limit":{"$numberLong":"1"},"singleBatch":true,"lsid":{"id":{"$binary":{"base64":"eRaUQwDxR2qw3Jcbpn0Gfw==","subType":"04"}}},"$db":"keploy"} }'
          checksum: 0
        read_delay: 355688136129
    responses:
      - header:
          length: 197
          requestId: 90
          responseTo: 48
          Opcode: 2013
        message:
          flagBits: 0
          sections:
            - '{ SectionSingle msg: {"cursor":{"firstBatch":[{"_id":"Lhr4BWAi","created":{"$date":{"$numberLong":"1696173347975"}},"updated":{"$date":{"$numberLong":"1696173347975"}},"url":"https://google.com"}],"id":{"$numberLong":"0"},"ns":"keploy.url-shortener"},"ok":{"$numberDouble":"1.0"}} }'
          checksum: 0
        read_delay: 4509611
    created: 1696173703
  ```

  Now, the real fun begins. Let's weave more spells!

  #### Redirect to original url from shortened url

  🚀 Follow the URL road...!

  ```bash
  curl --request GET \  --url http://localhost:8080/Lhr4BWAi
  ```

  Or simply wander over to your browser and visit `http://localhost:8080/Lhr4BWAi`.

  Did you spot the new test and mock scrolls in your project library? Awesome! 👏

  <img src="/docs/img/code-snippets/gin-mongo-test-sample.png" alt="Sample Keploy Test case and Mock for Gin MongoDB" width="100%" style={{ borderRadius: '5px' }}/>

  ### Run Tests 🏁

  Ready to put your spells to the test?

  ```bash
  sudo -E env PATH=$PATH keploy test -c "go run main.go handler.go" --delay 10
  ```

  Did you spot that the ts (timestamp) is showing some differences? Yep, time has a way of doing that! 🕰️

  Worry not, just add the ever-changing fields (like our **ts** here) to the **noise parameter** to **dodge those assertions**.

  > Pro tip: Add `body.ts` to noise in `test-x.yaml`.

  <img src="/docs/img/code-snippets/noise-addition.png" alt="Adding Noise to Test case Gin MongoDB" width="70%" style={{ borderRadius: '5px' }}/>

  Run that keploy record command once more and watch as everything falls into place with all tests passing! 🌟

  Final thoughts? Dive deeper! Try different API calls, tweak the DB response in the `mocks.yml`, or fiddle with the request or response in `test-x.yml`. Run the tests again and see the magic unfold! ✨👩‍💻👨‍💻✨

  ## Wrapping it up 🎉

  Congrats on the journey so far! You've seen Keploy's power, flexed your coding muscles, and had a bit of fun too! Now, go out there and keep exploring, innovating, and creating! Remember, with the right tools and a sprinkle of fun, anything's possible. 😊🚀

  Happy coding! ✨👩‍💻👨‍💻✨
   </details>

   </details>

   <br/>

- <details>
   <summary><img src="/docs/img/os/macos.png" alt="MacOS" width="3%" /> MacOs </summary>

  Dive straight in, but first in case you're using **Keploy** with **Colima**, give it a gentle nudge with (`colima start`). Let's make sure it's awake and ready for action!

  ### Use Keploy with Docker-Desktop

  #### Creating Docker Volume

  ```bash
  docker volume create --driver local --opt type=debugfs --opt device=debugfs debugfs
  ```

  #### Add alias for Keploy 🐰:

  For the sake of convenience (and a bit of Mac magic 🪄), let's set up a shortcut for Keploy:

  ```bash
  alias keploy='sudo docker run --pull always --name keploy-v2 -p 16789:16789 --privileged --pid=host -it -v "$(pwd)":/files -v /sys/fs/cgroup:/sys/fs/cgroup -v debugfs:/sys/kernel/debug:rw -v /sys/fs/bpf:/sys/fs/bpf -v /var/run/docker.sock:/var/run/docker.sock -v '"$HOME"'/.keploy-config:/root/.keploy-config -v '"$HOME"'/.keploy:/root/.keploy --rm ghcr.io/keploy/keploy'
  ```

  ### Use Keploy with Colima

  ```bash
  alias keploy='sudo docker run --pull always --name keploy-v2 -p 16789:16789 --privileged --pid=host -it -v "$(pwd)":/files -v /sys/fs/cgroup:/sys/fs/cgroup -v /sys/kernel/debug:/sys/kernel/debug -v /sys/fs/bpf:/sys/fs/bpf -v /var/run/docker.sock:/var/run/docker.sock -v '"$HOME"'/.keploy-config:/root/.keploy-config -v '"$HOME"'/.keploy:/root/.keploy --rm ghcr.io/keploy/keploy'
  ```

  ### Lights, Camera, Record! 🎥

  Fire up the application and mongoDB instance with Keploy. Keep an eye on the two key flags:
  `-c`: Command to run the app (e.g., `docker compose up`).

  `--containerName`: The container name in the `docker-compose.yml` for traffic interception.

  ```bash
  keploy record -c "docker compose up" --containerName "ginMongoApp"
  ```

  Getting logs like this? Perfect! 👌

   <img src="/docs/img/code-snippets/keploy-record-docker.png" alt="Keploy Record Test case" width="100%" />
   <img src="/docs/img/code-snippets/keploy-record-docker2.png" alt="Keploy record mocks" width="100%" />

  🔥 Challenge time! Generate some test cases. How? Just **make some API calls**. Postman, Hoppscotch or even curl - take your pick!

  Let's make URLs short and sweet:

  #### Generate shortened url

  ```bash
  curl --request POST \
    --url http://localhost:8080/url \
    --header 'content-type: application/json' \
    --data '{
    "url": "https://google.com"
  }'
  ```

  Here's a peek of what you get:

  ```json
  {
    "ts": 1645540022,
    "url": "http://localhost:8080/Lhr4BWAi"
  }
  ```

  🎉 Woohoo! With a simple API call, you've crafted a test case with a mock! Dive into the Keploy directory and feast your eyes on the newly minted `test-1.yml` and `mocks.yml`

  ```yaml
  version: api.keploy.io/v1beta2
  kind: Http
  name: test-1
  spec:
    metadata: {}
    req:
      method: POST
      proto_major: 1
      proto_minor: 1
      url: http://localhost:8080/url
      header:
        Accept: "*/*"
        Content-Length: "33"
        Content-Type: application/json
        Host: localhost:8080
        User-Agent: curl/7.77.0
      body: |-
        {
          "url": "https://google.com"
        }
      body_type: ""
    resp:
      status_code: 200
      header:
        Content-Length: "65"
        Content-Type: application/json; charset=utf-8
        Date: Sun, 01 Oct 2023 15:15:47 GMT
      body: '{"ts":1696173347979970488,"url":"http://localhost:8080/Lhr4BWAi"}'
      body_type: ""
      status_message: ""
      proto_major: 0
      proto_minor: 0
    objects: []
    assertions:
      noise:
        - header.Date
    created: 1696173352
  ```

  this is how the generated **mock.yml** will look like:

  ```yaml
  version: api.keploy.io/v1beta2
  kind: Mongo
  name: mocks
  spec:
    metadata:
      operation: '{ OpMsg flags: 0, sections: [{ SectionSingle msg: {"update":"url-shortener","ordered":true,"writeConcern":{"w":"majority"},"lsid":{"id":{"$binary":{"base64":"eRaUQwDxR2qw3Jcbpn0Gfw==","subType":"04"}}},"$db":"keploy"} }, { SectionSingle identifier: updates , msgs: [ {"q":{"_id":"Lhr4BWAi"},"u":{"$set":{"_id":"Lhr4BWAi","created":{"$date":{"$numberLong":"1696173347975"}},"updated":{"$date":{"$numberLong":"1696173347975"}},"url":"https://google.com"}},"upsert":true} ] }], checksum: 0 }'
    requests:
      - header:
          length: 301
          requestId: 11
          responseTo: 0
          Opcode: 2013
        message:
          flagBits: 0
          sections:
            - '{ SectionSingle msg: {"update":"url-shortener","ordered":true,"writeConcern":{"w":"majority"},"lsid":{"id":{"$binary":{"base64":"eRaUQwDxR2qw3Jcbpn0Gfw==","subType":"04"}}},"$db":"keploy"} }'
            - '{ SectionSingle identifier: updates , msgs: [ {"q":{"_id":"Lhr4BWAi"},"u":{"$set":{"_id":"Lhr4BWAi","created":{"$date":{"$numberLong":"1696173347975"}},"updated":{"$date":{"$numberLong":"1696173347975"}},"url":"https://google.com"}},"upsert":true} ] }'
          checksum: 0
        read_delay: 41060962050
    responses:
      - header:
          length: 60
          requestId: 14
          responseTo: 11
          Opcode: 2013
        message:
          flagBits: 0
          sections:
            - '{ SectionSingle msg: {"n":{"$numberInt":"1"},"nModified":{"$numberInt":"1"},"ok":{"$numberDouble":"1.0"}} }'
          checksum: 0
        read_delay: 2506709
    created: 1696173347
  ---
  version: api.keploy.io/v1beta2
  kind: Mongo
  name: mocks
  spec:
    metadata:
      operation: '{ OpMsg flags: 0, sections: [{ SectionSingle msg: {"find":"url-shortener","filter":{"_id":"Lhr4BWAi"},"limit":{"$numberLong":"1"},"singleBatch":true,"lsid":{"id":{"$binary":{"base64":"eRaUQwDxR2qw3Jcbpn0Gfw==","subType":"04"}}},"$db":"keploy"} }], checksum: 0 }'
    requests:
      - header:
          length: 162
          requestId: 48
          responseTo: 0
          Opcode: 2013
        message:
          flagBits: 0
          sections:
            - '{ SectionSingle msg: {"find":"url-shortener","filter":{"_id":"Lhr4BWAi"},"limit":{"$numberLong":"1"},"singleBatch":true,"lsid":{"id":{"$binary":{"base64":"eRaUQwDxR2qw3Jcbpn0Gfw==","subType":"04"}}},"$db":"keploy"} }'
          checksum: 0
        read_delay: 355688136129
    responses:
      - header:
          length: 197
          requestId: 90
          responseTo: 48
          Opcode: 2013
        message:
          flagBits: 0
          sections:
            - '{ SectionSingle msg: {"cursor":{"firstBatch":[{"_id":"Lhr4BWAi","created":{"$date":{"$numberLong":"1696173347975"}},"updated":{"$date":{"$numberLong":"1696173347975"}},"url":"https://google.com"}],"id":{"$numberLong":"0"},"ns":"keploy.url-shortener"},"ok":{"$numberDouble":"1.0"}} }'
          checksum: 0
        read_delay: 4509611
    created: 1696173703
  ```

  _Time to perform more API magic!_
  Follow the breadcrumbs... or the shortened URLs:

  #### Redirect to original url from shortened url

  ```bash
  curl --request GET \  --url http://localhost:8080/Lhr4BWAi
  ```

  Or just type `http://localhost:8080/Lhr4BWAi` in your browser. Your choice!

  Spotted the new test and mock files in your project? High five! 🙌

  <img src="/docs/img/code-snippets/gin-mongo-test-sample.png" alt="Sample Keploy Test case and Mock for Gin MongoDB" width="100%" style={{ borderRadius: '5px' }}/>

  Want to see if everything works as expected?

  #### Run Tests

  Time to put things to the test 🧪

  ```bash
  keploy test -c "docker compose up" --containerName "ginMongoApp" --delay 10
  ```

  > The `--delay` flag? Oh, that's just giving your app a little breather (in seconds) before the test cases come knocking.

  Your results should be looking all _snazzy_, like this:

  <img src="/docs/img/code-snippets/url-shortner-test-result.png" alt="Sample Keploy Test Result Gin MongoDB" width="100%" style={{ borderRadius: '5px' }}/>

  Did you spot that the ts (timestamp) is showing some differences? Yep, time has a way of doing that! 🕰️

  Worry not, just add the ever-changing fields (like our **ts** here) to the **noise parameter** to **dodge those assertions**.

  > Pro tip: Add `body.ts` to noise in `test-x.yaml`.

  <img src="/docs/img/code-snippets/noise-addition.png" alt="Adding Noise to Test case Gin MongoDB" width="70%" style={{ borderRadius: '5px' }}/>

  Run that keploy record command once more and watch as everything falls into place with all tests passing! 🌟

  Final thoughts? Dive deeper! Try different API calls, tweak the DB response in the `mocks.yml`, or fiddle with the request or response in `test-x.yml`. Run the tests again and see the magic unfold! ✨👩‍💻👨‍💻✨

  ## Wrapping it up 🎉

  Congrats on the journey so far! You've seen Keploy's power, flexed your coding muscles, and had a bit of fun too! Now, go out there and keep exploring, innovating, and creating! Remember, with the right tools and a sprinkle of fun, anything's possible. 😊🚀

  Happy coding! ✨👩‍💻👨‍💻✨
   </details>
