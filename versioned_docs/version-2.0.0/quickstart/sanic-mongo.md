---
id: sanic-mongo
title: Sample Movie Management App (Sanic + Mongo)
sidebar_label: Sanic+Mongo
description: This application is a simple movie management API built using Python's Sanic framework and MongoDB for data storage. It allows you to perform basic CRUD (Create, Read, Update, Delete) operations on Movie records.

tags:
  - python
  - quickstart
  - samples
  - examples
  - tutorial
  - python-framework
  - sanic
  - postgres
  - sms
  - Mongo
keyword:
  - FastAPI Framework
  - MongoDB
  - Sanic
  - Python
  - API Test generator
  - Auto case generation
---

## Introduction

This application is a simple movie management API built using Python's [Sanic framework](https://sanic.dev/en/) and [MongoDB](https://mongodb.com/) for data storage. It allows you to perform basic CRUD (Create, Read, Update, Delete) operations on Movie records.

import InstallationGuide from '../concepts/installation.md'

<InstallationGuide/>

## Get Started! 🎬

## Clone the app 🧪

```bash
git clone https://github.com/keploy/samples-python.git && cd samples-python/sanic-mongo
```
## Installation Keploy

Depending on your OS, choose your adventure:

There are 2 ways you can run this sample application.

- [Using Docker compose : running application as well as Mongo on Docker container](#using-docker-compose-)
- [Using Docker container for Mongo and running application locally](#running-app-locally-on-linuxwsl-)

## Download the requirements.txt file

Head to the folder of the application and run 
```shell
pip3 install -r requirements.txt
```

### Lights, Camera, Record! 🎥

Capture the test-cases-

```shell
keploy record -c "python3 server.py"
```

🔥**Make some API calls**. Postman, Hoppscotch or even curl - take your pick!

Let's make URLs short and sweet:

### Generate testcases

To generate testcases we just need to **make some API calls.**

1. **Make a POST request:**

```bash
  curl -X "POST" "http://127.0.0.1:8000/add_movie" \
    -H 'Accept: application/json' \
    -H 'Content-Type: application/json; charset=utf-8' \
    -d '{
        "name": "Whiplash"
    }'
```

2. **Make a GET request:**

```bash
  curl -X "GET" "http://127.0.0.1:8000/movies" \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json; charset=utf-8'
```

3. **Make a DELETE request:**

```bash
  curl -X "DELETE" "http://127.0.0.1:8000/movies" \
    -H 'Accept: application/json' \
    -H 'Content-Type: application/json; charset=utf-8'

```

**Time to put things to the test 🧪:**

```bash
 keploy test -c "python server.py"
```
And once you are done, you can stop the recording and give yourself a pat on the back! With that simple spell, you've conjured up a test case with a mock! Explore the **keploy** directory and you'll discover your handiwork in `tests` directory and `mocks.yml`.

```yaml
version: api.keploy.io/v1beta1
kind: Http
name: test-1
spec:
    metadata: {}
    req:
        method: GET
        proto_major: 1
        proto_minor: 1
        url: http://127.0.0.1:8001/
        header:
            Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7
            Accept-Encoding: gzip, deflate, br, zstd
            Accept-Language: en-GB,en-US;q=0.9,en;q=0.8
            Connection: keep-alive
            Host: 127.0.0.1:8001
            Sec-Ch-Ua: '"Not)A;Brand";v="99", "Google Chrome";v="127", "Chromium";v="127"'
            Sec-Ch-Ua-Mobile: ?0
            Sec-Ch-Ua-Platform: '"macOS"'
            Sec-Fetch-Dest: document
            Sec-Fetch-Mode: navigate
            Sec-Fetch-Site: none
            Sec-Fetch-User: ?1
            Upgrade-Insecure-Requests: "1"
            User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36
        body: ""
        timestamp: 2024-08-11T21:46:19.836003574+05:30
    resp:
        status_code: 404
        header:
            Connection: keep-alive
            Content-Length: "11164"
            Content-Type: text/html; charset=utf-8
        body: |-
            <!DOCTYPE html><html lang=en id=sanic><meta charset="utf-8"><title>Application Mp Main cannot handle your request</title><script>const scrollto=id=>document.getElementById(id).scrollIntoView({behavior:'smooth',block:'nearest',inline:'start'})</script><style>/** BasePage **/

            :root {
                --sanic: #ff0d68;
                --sanic-yellow: #FFE900;
                --sanic-background: #efeced;
                --sanic-text: #121010;
                --sanic-text-lighter: #756169;
                --sanic-link: #ff0d68;
                --sanic-block-background: #f7f4f6;
                --sanic-block-text: #000;
                --sanic-block-alt-text: #6b6468;
                --sanic-header-background: #272325;
                --sanic-header-border: #fff;
                --sanic-header-text: #fff;
                --sanic-highlight-background: var(--sanic-yellow);
                --sanic-highlight-text: var(--sanic-text);
                --sanic-tab-background: #f7f4f6;
                --sanic-tab-shadow: #f7f6f6;
                --sanic-tab-text: #222021;
                --sanic-tracerite-var: var(--sanic-text);
                --sanic-tracerite-val: #ff0d68;
                --sanic-tracerite-type: #6d6a6b;
            }


            @media (prefers-color-scheme: dark) {
                :root {
                    --sanic-text: #f7f4f6;
                    --sanic-background: #121010;
                    --sanic-block-background: #0f0d0e;
                    --sanic-block-text: #f7f4f6;
                    --sanic-header-background: #030203;
                    --sanic-header-border: #000;
                    --sanic-highlight-text: var(--sanic-background);
                    --sanic-tab-background: #292728;
                    --sanic-tab-shadow: #0f0d0e;
                    --sanic-tab-text: #aea7ab;
                }
            }

            html {
                font: 16px sans-serif;
                background: var(--sanic-background);
                color: var(--sanic-text);
                scrollbar-gutter: stable;
                overflow: hidden auto;
            }

            body {
                margin: 0;
                font-size: 1.25rem;
                line-height: 125%;
            }

            body>* {
                padding: 1rem 2vw;
            }

            @media (max-width: 1000px) {
                body>* {
                    padding: 0.5rem 1.5vw;
                }

                html {
                    /* Scale everything by rem of 6px-16px by viewport width */
                    font-size: calc(6px + 10 * 100vw / 1000);
                }
            }

            main {
                /* Make sure the footer is closer to bottom */
                min-height: 70vh;
                /* Generous padding for readability */
                padding: 1rem 2.5rem;
            }

            .smalltext {
                font-size: 1.0rem;
            }

            .container {
                min-width: 600px;
                max-width: 1600px;
            }

            header {
                background: var(--sanic-header-background);
                color: var(--sanic-header-text);
                border-bottom: 1px solid var(--sanic-header-border);
                text-align: center;
            }

            footer {
                text-align: center;
                display: flex;
                flex-direction: column;
                font-size: 0.8rem;
                margin: 2rem;
                line-height: 1.5em;
            }

            h1 {
                text-align: left;
            }

            a {
                text-decoration: none;
                color: var(--sanic-link);
            }

            a:hover,
            a:focus {
                text-decoration: underline;
                outline: none;
            }


            span.icon {
                margin-right: 1rem;
            }

            #logo-simple {
                height: 1.75rem;
                padding: 0 0.25rem;
            }


            @media (prefers-color-scheme: dark) {
                #logo-simple path:last-child {
                    fill: #e1e1e1;
                }
            }

            #sanic pre,
            #sanic code {
                font-family: "Fira Code",
                    "Source Code Pro",
                    Menlo,
                    Meslo,
                    Monaco,
                    Consolas,
                    Lucida Console,
                    monospace;
                font-size: 0.8rem;
            }
            /** ErrorPage **/
            #enduser {
                max-width: 30em;
                margin: 5em auto 5em auto;
                text-align: justify;
                /*text-justify: both;*/
            }

            #enduser a {
                color: var(--sanic-blue);
            }

            #enduser p:last-child {
                text-align: right;
            }

            summary {
                margin-top: 3em;
                color: var(--sanic-text-lighter);
                cursor: pointer;
            }

            .tracerite {
                --tracerite-var: var(--sanic-tracerite-var);
                --tracerite-val: var(--sanic-tracerite-val);
                --tracerite-type: var(--sanic-tracerite-type);
                --tracerite-exception: var(--sanic);
                --tracerite-highlight: var(--sanic-yellow);
                --tracerite-tab: var(--sanic-tab-background);
                --tracerite-tab-text: var(--sanic-tab-text);
            }

            .tracerite>h3 {
                margin: 0.5rem 0 !important;
            }

            #sanic .tracerite .traceback-labels button {
                font-size: 0.8rem;
                line-height: 120%;
                background: var(--tracerite-tab);
                color: var(--tracerite-tab-text);
                transition: 0.3s;
                cursor: pointer;
            }

            .tracerite .traceback-labels {
                padding-top: 5px;
            }

            .tracerite .traceback-labels button:hover {
                filter: contrast(150%) brightness(120%) drop-shadow(0 -0 2px var(--sanic-tab-shadow));
            }

            #sanic .tracerite .tracerite-tooltip::before {
                bottom: 1.75em;
            }

            #sanic .tracerite .traceback-details mark span {
                background: var(--sanic-highlight-background);
                color: var(--sanic-highlight-text);
            }

            header {
                background: var(--sanic-header-background);
            }

            h2 {
                font-size: 1.3rem;
                color: var(--sanic-text);
            }

            .key-value-display,
            .exception-wrapper {
                padding: 0.5rem;
                margin-top: 1rem;
            }

            .key-value-display {
                background-color: var(--sanic-block-background);
                color: var(--sanic-block-text);
            }

            .key-value-display h2 {
                margin-bottom: 0.2em;
            }

            dl.key-value-table {
                width: 100%;
                margin: 0;
                display: grid;
                grid-template-columns: 1fr 5fr;
                grid-gap: .3em;
                white-space: pre-wrap;
            }

            dl.key-value-table * {
                margin: 0;
            }

            dl.key-value-table dt {
                color: var(--sanic-block-alt-text);
                word-break: break-word;
            }

            dl.key-value-table dd {
                /* Better breaking for cookies header and such */
                word-break: break-all;
            }
            /** TraceRite **/
            :root {
              --tracerite-var: #8af;
              --tracerite-type: #5c8;
              --tracerite-val: #8af;
              --tracerite-tab: #aaaa;
              --tracerite-highlight: #ff0;
              --tracerite-exception: gray;
              --tracerite-tab-hover: #ddd;
              --tracerite-tooltip: #000;
              --tracerite-tooltip-bg: var(--tracerite-highlight);
            }

            .tracerite,
            .tracerite *,
            .tracerite > h3 {
              margin: 0;
              padding: 0;
              outline: none;
              box-sizing: border-box;
              overflow: hidden;
              font: inherit;
            }
            .tracerite strong,
            .tracerite > h3 {
              font-weight: bold;
            }
            .tracerite .after {
              margin: 0;
              padding: 1em 0 0 0;
              font-size: 1.2em;
            }
            .tracerite > h3 {
              font-size: 1.2em;
            }
            .tracerite .excmessage {
              max-height: 12em;
              overflow: auto;
            }
            .tracerite .exctype { color: var(--tracerite-exception) }

            .tracerite .traceback-details p {
              margin: 1em 0;
            }
            .tracerite .traceback-details pre {
              width: 100%;
              padding: .5em;
            }
            .tracerite .traceback-details .codeline {
              text-indent: 4ch each-line;
            }
            .tracerite .traceback-details .codeline::before {
              content: attr(data-lineno);
              color: #888;
              opacity: 0.0;
              transition: all 0.4s;
              display: inline-block;
              text-align: right;
              text-indent: 0;
              white-space: nowrap;
              word-break: keep-all;
              padding-right: 1ch;
              width: 4ch;
            }
            .tracerite .traceback-details pre:hover .codeline::before {
              opacity: 1.0;
            }

            .tracerite .traceback-details mark {
              background: none;
            }
            .tracerite .traceback-details mark span {
              background: var(--tracerite-highlight);
            }
            .tracerite .traceback-details mark::after {
              display: inline-block;
              content: attr(data-symbol);
              margin: -1ch;
              transform: translate(2em, 0) scale(1.8);
              color: var(--tracerite-highlight);
              -webkit-text-stroke: .05em black;
            }
            .tracerite .tracerite-tooltip {
              position: relative;
            }
            .tracerite .tracerite-tooltip::before {
              position: absolute;
              content: attr(data-tooltip);
              display: none;
              color: var(--tracerite-tooltip);
              background: var(--tracerite-highlight);
              bottom: 3em;
              right: -3em;
              transform: translate(50%, 0);  /* center of itself */
              font-size: 0.8em;
              padding: 0.5em 1em;
              border-radius: 3px;
              text-align: center;
              z-index: 2;
            }
            .tracerite .tracerite-tooltip:hover::before {
              display: block;
            }

            .tracerite .traceback-labels {
              display: flex;
              align-items: center;
              border-bottom: 3px solid var(--tracerite-tab);
              margin-top: 0.3em;
            }
            .tracerite .traceback-labels button {
              background: var(--tracerite-tab);
              color: black;
              border: 0;
              border-radius: .5em .5em 0 0;
              flex-shrink: 1;
              line-height: 1.0;
              padding: .5em;
              margin-right: .2em;
            }
            .tracerite .traceback-labels button:hover { background: var(--tracerite-tab-hover) }
            .tracerite .traceback-labels * {
              white-space: nowrap;
              text-overflow: ellipsis;
              overflow: hidden;
            }

            .tracerite .traceback-tabs .content {
              scroll-snap-type: x mandatory;
              display: flex;
              align-items: flex-start;
              overflow-x: auto;
              scrollbar-width: none;
            }
            .tracerite .traceback-tabs .content::-webkit-scrollbar {
              width: 0;
              height: 0;
            }
            .tracerite .traceback-details {
              min-width: 20ch;
              max-width: 100%;
              margin: 0 .3em;
              flex-shrink: 0;
              scroll-snap-align: start;
              border-radius: .5em;
              padding: .2em;
            }
            .tracerite .traceback-details:last-child {
              width: 100%;
            }

            .tracerite table.inspector { margin-left: 3.5em; width: auto; word-break: break-word; }
            .tracerite .inspector tbody tr,
            .tracerite .inspector th,
            .tracerite .inspector td {
              padding: 0;
              background: none;
              text-align: left;
              max-width: 20em;
              text-overflow: ellipsis;
              overflow: hidden;
            }
            .tracerite .inspector .var { font-weight: bold; color: var(--tracerite-var) }
            .tracerite .inspector .type { white-space: nowrap; color: var(--tracerite-type) }
            .tracerite .inspector .val { white-space: pre-wrap; color: var(--tracerite-val) }
            /* matrix value on a variable */
            .tracerite .inspector table td {
              color: var(--tracerite-val);
              min-width: 3em;
              word-break: keep-all;
              overflow: hidden;
              padding: 0;
              font-size: 0.8em;
              border-collapse: collapse;
              text-align: right;
            }
            </style><header><div>Application <strong>Mp Main</strong> cannot handle your request</div></header><main><h1>⚠️ 404 — Not Found</h1><p>Requested URL  not found<div id=enduser><p>We're sorry, but it looks like something went wrong. Please try refreshing the page or navigating back to the homepage. If the issue persists, our technical team is working to resolve it as soon as possible. We apologize for the inconvenience and appreciate your patience.<p><a href="/">Front Page</a></div></main><footer><div>powered by</div><div><a href="https://sanic.dev" target="_blank" referrerpolicy="no-referrer"><svg id=logo-simple viewBox="0 0 964 279"><desc>Sanic</desc><path d="M107 222c9-2 10-20 1-22s-20-2-30-2-17 7-16 14 6 10 15 10h30zm115-1c16-2 30-11 35-23s6-24 2-33-6-14-15-20-24-11-38-10c-7 3-10 13-5 19s17-1 24 4 15 14 13 24-5 15-14 18-50 0-74 0h-17c-6 4-10 15-4 20s16 2 23 3zM251 83q9-1 9-7 0-15-10-16h-13c-10 6-10 20 0 22zM147 60c-4 0-10 3-11 11s5 13 10 12 42 0 67 0c5-3 7-10 6-15s-4-8-9-8zm-33 1c-8 0-16 0-24 3s-20 10-25 20-6 24-4 36 15 22 26 27 78 8 94 3c4-4 4-12 0-18s-69 8-93-10c-8-7-9-23 0-30s12-10 20-10 12 2 16-3 1-15-5-18z" fill="#ff0d68"/><path d="M676 74c0-14-18-9-20 0s0 30 0 39 20 9 20 2zm-297-10c-12 2-15 12-23 23l-41 58H340l22-30c8-12 23-13 30-4s20 24 24 38-10 10-17 10l-68 2q-17 1-48 30c-7 6-10 20 0 24s15-8 20-13 20 -20 58-21h50 c20 2 33 9 52 30 8 10 24-4 16-13L384 65q-3-2-5-1zm131 0c-10 1-12 12-11 20v96c1 10-3 23 5 32s20-5 17-15c0-23-3-46 2-67 5-12 22-14 32-5l103 87c7 5 19 1 18-9v-64c-3-10-20-9-21 2s-20 22-30 13l-97-80c-5-4-10-10-18-10zM701 76v128c2 10 15 12 20 4s0-102 0-124s-20-18-20-7z M850 63c-35 0-69-2-86 15s-20 60-13 66 13 8 16 0 1-10 1-27 12-26 20-32 66-5 85-5 31 4 31-10-18-7-54-7M764 159c-6-2-15-2-16 12s19 37 33 43 23 8 25-4-4-11-11-14q-9-3-22-18c-4-7-3-16-10-19zM828 196c-4 0-8 1-10 5s-4 12 0 15 8 2 12 2h60c5 0 10-2 12-6 3-7-1-16-8-16z" fill="#1f1f1f"/></svg></a></div></footer>
        status_message: Not Found
        proto_major: 0
        proto_minor: 0
        timestamp: 2024-08-11T21:46:19.901555174+05:30
    objects: []
    assertions:
        noise: {}
    created: 1723392979
curl: |
    curl --request GET \
      --url http://127.0.0.1:8001/ \
      --header 'Sec-Ch-Ua-Platform: "macOS"' \
      --header 'Sec-Ch-Ua: "Not)A;Brand";v="99", "Google Chrome";v="127", "Chromium";v="127"' \
      --header 'Upgrade-Insecure-Requests: 1' \
      --header 'Sec-Fetch-Site: none' \
      --header 'Accept-Language: en-GB,en-US;q=0.9,en;q=0.8' \
      --header 'Connection: keep-alive' \
      --header 'Sec-Fetch-Dest: document' \
      --header 'Sec-Fetch-Mode: navigate' \
      --header 'Host: 127.0.0.1:8001' \
      --header 'Sec-Ch-Ua-Mobile: ?0' \
      --header 'Accept-Encoding: gzip, deflate, br, zstd' \
      --header 'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7' \
      --header 'Sec-Fetch-User: ?1' \
      --header 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36' \
```