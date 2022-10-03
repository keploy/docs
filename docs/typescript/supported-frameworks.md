---
id: supported-frameworks
title: Supported Frameworks
description: Supported Frameworks
tags:
  - developer-guide
  - typescript
---

## Supported Frameworks
### 1. Express
```js
require("typescript-sdk/dist/integrations/express/register");
```
#### Example
```js
require("typescript-sdk/dist/integrations/express/register");
const express = require('express');
const app = express();
const port = process.env.PORT || 5050;

app.use(express.json());

app.get("/", (req, res) => {
  res.json({"field": "App is healthy", "opacity": Math.random()})
})

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
})
```
Note:- Import statements can't be used. Use require instead of import.

## Development Setup

- This project uses [Yarn](https://yarnpkg.com/) for package management. To install yarn, please make sure [Node](https://nodejs.org/en/) is installed and then:

```sh
npm i -g yarn
```

- To install local dependencies, assuming you are at root of the project:

```sh
yarn install
```