---
id: supported-frameworks
title: Supported Frameworks
description: Keploy platform automatically mocks application dependencies and safely replay writes. It does accurate noise detection and statistical de-duplication.
tags:
  - go
  - developer-guide
---

## Supported Routers

### Chi

<details>
<summary>Integration</summary>

```go
r := chi.NewRouter()
kchi.ChiV5(k,r)
```

</details>
<details>
<summary>Example</summary>

```go
import("github.com/keploy/go-sdk/integrations/kchi")

r := chi.NewRouter()
port := "6789"
k := keploy.New(keploy.Config{
           App: keploy.AppConfig{
               Name: "my_app",
               Port: port,
           },
           Server: keploy.ServerConfig{
               URL: "http://localhost:6789/api",
           },
         })
kchi.ChiV5(k,r)
http.ListenAndServe(":" + port, r)
```

</details>


### Gin

<details>
<summary>Integration</summary>

```go
r:=gin.New()
kgin.GinV1(k, r)
```

</details>
<details>
<summary>Example</summary>

```go
import("github.com/keploy/go-sdk/integrations/kgin/v1")

r:=gin.New()
port := "6789"
k := keploy.New(keploy.Config{
  App: keploy.AppConfig{
      Name: "my_app",
      Port: port,
  },
  Server: keploy.ServerConfig{
      URL: "http://localhost:6789/api",
  },
})
kgin.GinV1(k, r)
r.Run(":" + port)
```

</details>

### Echo

<details>
<summary>Integration</summary>

```go
e := echo.New()
kecho.EchoV4(k, e)
```
</details>
<details>
<summary>Example</summary>

```go
import("github.com/keploy/go-sdk/integrations/kecho/v4")

e := echo.New()
port := "6789"
k := keploy.New(keploy.Config{
  App: keploy.AppConfig{
      Name: "my-app",
      Port: port,
  },
  Server: keploy.ServerConfig{
      URL: "http://localhost:6789/api",
  },
})
kecho.EchoV4(k, e)
e.Start(":" + port)
```
</details>

### WebGo

<details>
<summary>WebGo V4 Integration</summary>

```go
router := webgo.NewRouter(cfg, getRoutes())
kwebgo.WebGoV4(k, router)
```
</details>

<details>
<summary>WebGo V56 Integration</summary>

```go
kwebgo.WebGoV6(k, router)
router.Start()
```
</details>

<details>
<summary>Example</summary>

```go
import("github.com/keploy/go-sdk/integrations/kwebgo/v4")

port := "6789"
k := keploy.New(keploy.Config{
  App: keploy.AppConfig{
      Name: "my-app",
      Port: port,
  },
  Server: keploy.ServerConfig{
      URL: "http://localhost:6789/api",
  },
})

kwebgo.WebGoV4(k

, router)
router.Start()
```
</details>

### Gorilla/Mux


<details>
<summary>Integration</summary>

```go
r := mux.NewRouter()
kmux.Mux(k, r)
```
</details>

<details>
<summary>Example</summary>

```go
import(
    "github.com/keploy/go-sdk/integrations/kmux"
    "net/http"
)

r := mux.NewRouter()
port := "6789"
k := keploy.New(keploy.Config{
  App: keploy.AppConfig{
      Name: "my-app",
      Port: port,
  },
  Server: keploy.ServerConfig{
      URL: "http://localhost:6789/api",
  },
})
kmux.Mux(k, r)
http.ListenAndServe(":"+port, r)
```

</details>

## Supported Databases

### MongoDB

<details>
<summary>Integration</summary>

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

</details>

### DynamoDB

<details>
<summary>Integration</summary>

```go
import("github.com/keploy/go-sdk/integrations/kddb")

client := kddb.NewDynamoDB(dynamodb.New(sess))
```

Following operations are supported:

- QueryWithContext
- GetItemWithContext
- PutItemWithContext

</details>

### SQL Driver

<details>
<summary>Integration</summary>

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

Its compatible with gORM. 
</details>


<details>
<summary>Example</summary>

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
</details>

###  Elasticsearch

<details>
<summary>Integration</summary>

The elastic-search client uses http client to do CRUD operations. 
There is a Transport field in `elasticsearch.config` which allows you to
completely replace the default HTTP client used by the package.
So, we use `khttp` as an interceptor and assign it to the Transport field.


Here is an example of making elastic search client with keploy's http interceptor -

```go
import (
	"net/http"
	"github.com/elastic/go-elasticsearch/v8"
	"github.com/keploy/go-sdk/integrations/khttpclient"
)

func ConnectWithElasticsearch(ctx context.Context) *elasticsearch.Client {
	// integrate http with keploy
	interceptor := khttpclient.NewInterceptor(http.DefaultTransport)
	newClient, err := elasticsearch.NewClient(elasticsearch.Config{
		Addresses: []string{
			"http://localhost:9200",
		},
		// use khttp as custom http client
		Transport: interceptor,
	})
	if err != nil {
		panic(err)
	}
	return newClient
}


```
> The heavy operations like bulk indexing will take time depending on the configuration of the machine on which the keploy is running.

</details>

###  Redis

<details>
<summary>Integration</summary>

```go
import(
    "context"
	"time"
	"github.com/go-redis/redis/v8"
    "github.com/keploy/go-sdk/integrations/kredis"
)

type redisCache struct {
	host    string
	db      int
	expires time.Duration
}

func (cache *redisCache) getClient() redis.UniversalClient {
	client := redis.NewClient(&redis.Options{
		Addr:     cache.host,
		Password: "",
		DB:       cache.db,
	})
	return kredis.NewRedisClient(client)
}
```
Following operations are supported:
- Get
- Set
- Del

</details>

## Supported Clients

### net/http

<details>
<summary>Integration</summary>

```go
khttpclient.NewHttpClient(&http.Client{})
```

</details>

<details>
<summary>Example</summary>

```go
import("github.com/keploy/go-sdk/integrations/khttpclient")

func(w http.ResponseWriter, r *http.Request){
    client := khttpclient.NewHttpClient(&http.Client{})
// ensure to add request context to all outgoing http requests
    client.SetCtxHttpClient(r.Context())
    resp, err := client.Get("https://example.com")
}
```

>  ensure to add pass request context to all external requests like http requests, db calls, etc.

</details>

### gRPC

<details>
<summary>Integration</summary>

```go
conn, err := grpc.Dial(address, grpc.WithInsecure(), kgrpc.WithClientUnaryInterceptor(k))
```

</details>

<details>

<summary>Example</summary>

```go
import("github.com/keploy/go-sdk/integrations/kgrpc")

port := "6789"
k := keploy.New(keploy.Config{
  App: keploy.AppConfig{
      Name: "my-app",
      Port: port,
  },
  Server: keploy.ServerConfig{
      URL: "http://localhost:6789/api",
  },
})

conn, err := grpc.Dial(address, grpc.WithInsecure(), kgrpc.WithClientUnaryInterceptor(k))
```

> Currently streaming is not yet supported.

</details>