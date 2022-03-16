---
id: ui-contrib-guide
title: Keploy UI Contribution Guide
label: UI Contribution Guide
---

Make sure you're using **Node version 14.x.x**

### 1. Start the Keploy Server

There's a separate [docker-compose](docker-compose-dev.yaml) file which helps which exposes the mongo server and also builds the dockerfile from local code. The `build` flag ensures that the binary is built again to reflect the latest code changes. There's also [docker-compose-debug.yaml](docker-compose-debug.yaml) which can help remote debugging the go server on port 4000.

```shell
git clone https://github.com/keploy/keploy.git && cd keploy
docker-compose -f docker-compose-dev.yaml up --build
```

### 2. Start the Keploy Console/UI

```shell
git clone https://github.com/keploy/ui.git && cd ui
npm i
```

For development, we'll add the API URL as local keploy server url running at http://localhost:8081

```shell
export GATSBY_API_URL=http://localhost:8081/api
```

Now let's start the Gatsby Server

```shell
gatsby develop
```

If you make some UI/design changes and want to add test data. In the new directory, clone test data repo :

```shell
git clone https://github.com/keploy/test-data.git && cd test-data
```

Within test-data directory

#### Install mongo-database-tools

```
brew tap mongodb/brew
brew install mongodb-database-tools
```

#### Restore DB

```
mongorestore  dump/
```

You should now be able to see test data on the UI.
