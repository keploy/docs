---
id: server-contrib-guide
title: Keploy Server Contribution Guide
label: Server Contribution Guide
---

There's a separate [docker-compose](docker-compose-dev.yaml) file which helps with exposing the mongo server and also builds the dockerfile from local code. The `build` flag ensures that the binary is built again to reflect the latest code changes. There's also [docker-compose-debug.yaml](docker-compose-debug.yaml) which can help remote debugging the go server on port 40000.

```shell
docker-compose -f docker-compose-dev.yaml up --build
```

If you are not using docker, you can build and run the keploy server directly. Ensure to provide the Mongo connection string via the `KEPLOY_MONGO_URI` env variable.

```shell
export KEPLOY_MONGO_URI="mongodb://mongo:27017"
go run cmd/server/main.go
```

Keploy exposes GraphQL API for the frontend based on [gqlgen](https://github.com/99designs/gqlgen). After changing the [schema](graph/schema.graphqls) you can autogenerate graphQL [handlers](graph/schema.resolvers.go) using

```shell
go generate ./...
```
