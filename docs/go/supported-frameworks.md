---
id: supported-frameworks
title: Supported Frameworks for Go
sidebar_label: Supported Frameworks
description: Keploy platform automatically mocks application dependencies and safely replay writes. It does accurate noise detection and statistical de-duplication.
tags:
  - go
  - developer-guide
---

## Supported Routers

### 1. Chi

```go
r := chi.NewRouter()
kchi.ChiV5(k,r)
```

#### Example

```go
import("github.com/keploy/go-sdk/integrations/kchi")

r := chi.NewRouter()
port := "8080"
k := keploy.New(keploy.Config{
           App: keploy.AppConfig{
               Name: "my_app",
               Port: port,
           },
           Server: keploy.ServerConfig{
               URL: "http://localhost:8081/api",
           },
         })
kchi.ChiV5(k,r)
http.ListenAndServe(":" + port, r)
```

### 2. Gin

```go
r:=gin.New()
kgin.GinV1(k, r)
```

#### Example

```go
import("github.com/keploy/go-sdk/integrations/kgin/v1")

r:=gin.New()
port := "8080"
k := keploy.New(keploy.Config{
  App: keploy.AppConfig{
      Name: "my_app",
      Port: port,
  },
  Server: keploy.ServerConfig{
      URL: "http://localhost:8081/api",
  },
})
kgin.GinV1(k, r)
r.Run(":" + port)
```

### 3. Echo

```go
e := echo.New()
kecho.EchoV4(k, e)
```

#### Example

```go
import("github.com/keploy/go-sdk/integrations/kecho/v4")

e := echo.New()
port := "8080"
k := keploy.New(keploy.Config{
  App: keploy.AppConfig{
      Name: "my-app",
      Port: port,
  },
  Server: keploy.ServerConfig{
      URL: "http://localhost:8081/api",
  },
})
kecho.EchoV4(k, e)
e.Start(":" + port)
```

### 4. WebGo

#### WebGoV4

```go
router := webgo.NewRouter(cfg, getRoutes())
kwebgo.WebGoV4(k, router)
```

#### WebGoV6

```go
kwebgo.WebGoV6(k, router)
router.Start()
```

#### Example

```go
import("github.com/keploy/go-sdk/integrations/kwebgo/v4")

port := "8080"
k := keploy.New(keploy.Config{
  App: keploy.AppConfig{
      Name: "my-app",
      Port: port,
  },
  Server: keploy.ServerConfig{
      URL: "http://localhost:8081/api",
  },
})

kwebgo.WebGoV4(k

, router)
router.Start()
```

### 5. Gorilla/Mux

```go
r := mux.NewRouter()
kmux.Mux(k, r)
```

#### Example

```go
import(
    "github.com/keploy/go-sdk/integrations/kmux"
    "net/http"
)

r := mux.NewRouter()
port := "8080"
k := keploy.New(keploy.Config{
  App: keploy.AppConfig{
      Name: "my-app",
      Port: port,
  },
  Server: keploy.ServerConfig{
      URL: "http://localhost:8081/api",
  },
})
kmux.Mux(k, r)
http.ListenAndServe(":"+port, r)
```

## Supported Databases

### 1. MongoDB

```go
import("github.com/keploy/go-sdk/integrations/kmongo")

db  := client.Database("testDB")
col := kmongo.NewCollection(db.Collection("Demo-Collection"))
```

Following operations are supported:

- FindOne - Err and Decode method of mongo.SingleResult
- Find - Next, TryNext, Err, Close, All and Decode methods of mongo.cursor
- InsertOne
- InsertMany
- UpdateOne
- UpdateMany
- DeleteOne
- DeleteMany
- CountDocuments
- Distinct
- Aggregate - Next, TryNext, Err, Close, All and Decode methods of mongo.cursor

### 2. DynamoDB

```go
import("github.com/keploy/go-sdk/integrations/kddb")

client := kddb.NewDynamoDB(dynamodb.New(sess))
```

Following operations are supported:

- QueryWithContext
- GetItemWithContext
- PutItemWithContext

### 3. SQL Driver

```go
import(
    "github.com/keploy/go-sdk/integrations/ksql"
    "github.com/lib/pq"
)

func init(){
	driver := ksql.Driver{Driver: pq.Driver{}}
	sql.Register("keploy", &driver)
}
```

Its compatible with gORM. Here is an example -

```go
    pSQL_URI := fmt.Sprintf("host=%s user=%s dbname=%s sslmode=disable password=%s port=%s", "localhost", "postgres", "Book_Keeper", "8789", "5432")
    // set DisableAutomaticPing to true for capturing and replaying the outputs of querries stored in requests context.
    pSQL_DB, err :=  gorm.Open(postgres.New(postgres.Config{DriverName: "keploy", DSN: pSQL_URI}), &gorm.Config{ DisableAutomaticPing: true })
    if err!=nil{
        log.Fatal(err)
    } else {
	fmt.Println("Successfully connected to postgres")
    }
    r:=gin.New()
    kgin.GinV1(kApp, r)
    r.GET("/gin/:color/*type", func(c *gin.Context) {
        // set the context of *gorm.DB with request's context of http Handler function before queries.
        pSQL_DB = pSQL_DB.WithContext(r.Context())
	// Find
	var (
		people []Book
	)
	x := pSQL_DB.Find(&people)
    }))
```

## Supported Clients

### net/http

```go
khttpclient.NewHttpClient(&http.Client{})
```

#### Example

```go
import("github.com/keploy/go-sdk/integrations/khttpclient")

func(w http.ResponseWriter, r *http.Request){
    client := khttpclient.NewHttpClient(&http.Client{})
// ensure to add request context to all outgoing http requests
    client.SetCtxHttpClient(r.Context())
    resp, err := client.Get("https://example.com")
}
```

**Note**: ensure to add pass request context to all external requests like http requests, db calls, etc.

### gRPC

```go
conn, err := grpc.Dial(address, grpc.WithInsecure(), kgrpc.WithClientUnaryInterceptor(k))
```

#### Example

```go
import("github.com/keploy/go-sdk/integrations/kgrpc")

port := "8080"
k := keploy.New(keploy.Config{
  App: keploy.AppConfig{
      Name: "my-app",
      Port: port,
  },
  Server: keploy.ServerConfig{
      URL: "http://localhost:8081/api",
  },
})

conn, err := grpc.Dial(address, grpc.WithInsecure(), kgrpc.WithClientUnaryInterceptor(k))
```

**Note**: Currently streaming is not yet supported.
