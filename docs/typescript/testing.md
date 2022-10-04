---
id: testing
title: Test your application
description: Test your application
tags:
  - developer-guide
  - typescript
---

## Integration with Mocha testing framework
You just need to do some imports and call a built-in assert function in your code in your unit test file and that's it!!🔥🔥🔥
```js
const {runServer} = require('../server') //your server wrapper
const {keploy}  = require('typescript-sdk/dist/integrations/express/register')
const {describe,test,before,after}=  require('mocha')
describe("test function", ()=>{
    before( (done)=>{
            keploy.setTestMode();
            runServer()
            done()
          })
    test("should be running", async ()=> {
      return keploy.assertTests();
    });
    after(()=>{
         process.exit(1); //exits the node server
       })
})
```
Note:- To see code coverage please use nyc mocha and see how many lines are covered!!

Note:- Jest is not supported currently!!

- Furthermore, to commit your changes use `yarn commit` instead of `git commit` for better commit experience.

- For VSCode setup, make sure these extensions are installed:
  - [EditorConfig](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig)
  - [Eslint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
