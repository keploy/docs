---
id: mock-library
title: How to use mock library ?
description: How to use mock library ?
tags:
  - developer-guide
  - typescript
---

The external calls from unit tests will be recorded and replayed as mocks from yaml files under a directory named mocks.

Following is an example of unit test with octokit :

#### Example
```js
require("typescript-sdk/dist/integrations/octokit/require")
var {NewContext} = require ("typescript-sdk/dist/mock/mock")
var assert = require('assert');
const { Octokit, App } = require("octokit");
describe('routes', function () {
    var server, octokit;
    beforeEach(function () {
        NewContext({Mode: "record", Name: "your demo app name"})  // Set your keploy mode and name here.
        // Clears the cache so a new server instance is used for each test.
        // delete require.cache[require.resolve('../app')];

        octokit = new Octokit({ auth: "your authentication token"});

    });
    // Test to make sure URLs respond correctly.
    it("url/", async function () {
        return new Promise(function(resolve){
            octokit.rest.users.getAuthenticated({}).then((result) => {
                assert.equal(result.data.login, "your github username")
                resolve()    
            });
        })
    });
});
```