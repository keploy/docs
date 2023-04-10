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
r.Use(kchi.ChiMiddlewareV5(k))
```

</details>
<details>
<summary>Example</summary>

```go
import(
  "github.com/keploy/go-sdk/integrations/kchi"
	"github.com/keploy/go-sdk/keploy"
	"github.com/go-chi/chi"
)

func main(){
    r := chi.NewRouter()
    port := "8080"
    k := keploy.New(keploy.Config{
            App: keploy.AppConfig{
                Name: "my_app",
                Port: port,
            },
            Server: keploy.ServerConfig{
                URL: "http://localhost:6789/api",
            },
            })
    r.Use(kchi.ChiMiddlewareV5(k))
    http.ListenAndServe(":" + port, r)
}
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
import(
  "github.com/keploy/go-sdk/integrations/kgin/v1"
	"github.com/keploy/go-sdk/keploy"
)

func main(){
	r:=gin.New()
	port := "8080"
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
}
```

</details>

### Echo

<details>
<summary>Integration</summary>

```go
import(
  "github.com/keploy/go-sdk/integrations/kecho/v4"
	"github.com/keploy/go-sdk/keploy"
	"github.com/labstack/echo/v4"
)

func main(){
    e := echo.New()
    port := "8080"
    k := keploy.New(keploy.Config{
      App: keploy.AppConfig{
          Name: "my-app",
          Port: port,
      },
      Server: keploy.ServerConfig{
          URL: "http://localhost:6789/api",
      },
    })
    e.Use(kecho.EchoMiddlewareV4(k))
    e.Start(":" + port)
}
```
</details>

### WebGo

<details>
<summary>WebGo V4 Integration</summary>

```go
router := webgo.NewRouter(cfg, getRoutes())
router.Use(kwebgo.WebgoMiddlewareV4(k))
router.Start()
```
</details>

<details>
<summary>WebGo V6 Integration</summary>

```go
router := webgo.NewRouter(cfg, getRoutes())
router.Use(kwebgo.WebgoMiddlewareV6(k))
router.Start()
```
</details>

<details>
<summary>Example</summary>

```go
import(
  "github.com/keploy/go-sdk/integrations/kwebgo/v4"
	"github.com/keploy/go-sdk/keploy"
	"github.com/bnkamalesh/webgo/v4"
)

func main(){
    port := "8080"
    k := keploy.New(keploy.Config{
      App: keploy.AppConfig{
          Name: "my-app",
          Port: port,
      },
      Server: keploy.ServerConfig{
          URL: "http://localhost:6789/api",
      },
    })
    router := webgo.NewRouter(&webgo.Config{
		Host:         "",
		Port:         port,
		ReadTimeout:  15 * time.Second,
		WriteTimeout: 60 * time.Second,
	}, []*webgo.Route{})
    router.Use(kwebgo.WebgoMiddlewareV4(k))
    router.Start()
}
```
</details>

### Gorilla/Mux


<details>
<summary>Integration</summary>

```go
r := mux.NewRouter()
r.Use(kmux.MuxMiddleware(k))
```
</details>

<details>
<summary>Example</summary>

```go
import(
  "github.com/keploy/go-sdk/integrations/kmux"
	"github.com/keploy/go-sdk/keploy"
	"github.com/gorilla/mux"
  "net/http"
)

func main(){
    r := mux.NewRouter()
    port := "8080"
    k := keploy.New(keploy.Config{
      App: keploy.AppConfig{
          Name: "my-app",
          Port: port,
      },
      Server: keploy.ServerConfig{
          URL: "http://localhost:6789/api",
      },
    })
    r.Use(kmux.MuxMiddleware(k))
    http.ListenAndServe(":"+port, r)
}
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

Keploy inplements most of the sql driver's interface for mocking the outputs of sql queries which are called from your API handler.  

Since, keploy uses request context for mocking outputs of SQL queries thus, SQL methods having request context as parameter should be called from API handler.

#### v1
This version records the outputs and store them as binary in exported yaml files
#### v2
This version records and stores the outputs as readable/editable format in exported yaml file.
Sample: 
```yaml
version: api.keploy.io/v1beta1
kind: SQL
name: Sample-App # App_Id from keploy config or mock name from mock.Config
spec:
    metadata:
        name: SQL
        operation: QueryContext.Close
        type: SQL_DB
    type: table
    table:
        cols:
            - name: id
              type: int64
              precision: 0
              scale: 0
            - name: uuid
              type: '[]uint8'
              precision: 0
              scale: 0
            - name: name
              type: string
              precision: 0
              scale: 0
        rows:
            - "[`3` | `[50 101 101]` | `qwertt2` | ]"
    int: 0
    error:
        - nil
        - nil
```

Here is an example for postgres driver and binary encoded outputs -
```go
    import (
        "github.com/keploy/go-sdk/integrations/ksql/v1" // the outputs of sql queries are stored as binary encoded in exported yaml files
        "github.com/lib/pq"
    )
    func main(){
        // Register keploy sql driver to database/sql package.
        driver := ksql.Driver{Driver: pq.Driver{}}
		sql.Register("keploy", &driver)
        
        pSQL_URI := fmt.Sprintf("host=%s user=%s dbname=%s sslmode=disable password=%s port=%s", "localhost", "postgres", "Book_Keeper", "8789", "5432")
        // keploy driver will internally open the connection using dataSourceName string parameter
        db, err := sql.Open("keploy", pSQL_URI)
        if err!=nil{
            log.Fatal(err)
        } else {
            fmt.Println("Successfully connected to postgres")
        }
        defer db.Close

        r:=gin.New()
        kgin.GinV1(kApp, r)
        r.GET("/gin/:color/*type", func(c *gin.Context) {
            // ctx parameter of PingContext should be request context.
            err = db.PingContext(r.Context())
            if err!=nil{
                log.Fatal(err)
            }
            id := 47
            result, err := db.ExecContext(r.Context(), "UPDATE balances SET balance = balance + 10 WHERE user_id = ?", id)
            if err != nil {
                log.Fatal(err)
            }
        }))
    }
```
> Its compatible with gORM. To integerate with gORM set DisableAutomaticPing of gorm.Config to true. Also pass request context to methods as params. 
Example for gORM with GCP-Postgres driver:
```go
    import (
		gcppostgres "github.com/GoogleCloudPlatform/cloudsql-proxy/proxy/dialers/postgres"
        "github.com/keploy/go-sdk/integrations/ksql/v1" // the outputs of sql queries are stored as binary encoded in exported yaml files
        "gorm.io/driver/postgres"
	    "gorm.io/gorm"
    )
    type Person struct {
        gorm.Model
        Name  string
        Email string `gorm:"typevarchar(100);unique_index"`
        Books []Book
    }
    type Book struct {
        gorm.Model
        Title      string
        Author     string
        CallNumber int64 `gorm:"unique_index"`
        PersonID   int
    }
    func main(){
        // Register keploy sql driver to database/sql package.
        driver := ksql.Driver{Driver: gcppostgres.Driver{}}
        sql.Register("keploy", &driver)

        pSQL_URI := fmt.Sprintf("host=%s user=%s dbname=%s sslmode=disable password=%s", GCPHost, "postgres", "Book_Keeper", "8789", "5432")

        // set DisableAutomaticPing to true so that .
        pSQL_DB, err :=  gorm.Open( postgres.New(postgres.Config{
                DriverName: "keploy", 
                DSN: pSQL_URI
            }), &gorm.Config{ 
                DisableAutomaticPing: true 
        }
        pSQL_DB.AutoMigrate(&Person{})
        pSQL_DB.AutoMigrate(&Book{})
        r:=gin.New()
        kgin.GinV1(kApp, r)
        r.GET("/gin/:color/*type", func(c *gin.Context) {
            // set the context of *gorm.DB with request's context of http Handler function before queries.
            pSQL_DB = pSQL_DB.WithContext(c.Request.Context())
            // Find
            var (
                people []Book
            )
            x := pSQL_DB.Find(&people)
        }))
    }
```

<!-- Its compatible with gORM.  -->
</details>

<!-- 
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
</details> -->

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
interceptor := khttpclient.NewInterceptor(http.DefaultTransport)
client := http.Client{
    Transport: interceptor,
}
```

</details>

<details>
<summary>Example</summary>

```go
import("github.com/keploy/go-sdk/integrations/khttpclient")

func main(){
	// initialize a gorilla mux
	r := mux.NewRouter()
	// keploy config
	port := "8080"
	kApp := keploy.New(keploy.Config{
		App: keploy.AppConfig{
			Name: "Mux-Demo-app",
			Port: port,
		},
		Server: keploy.ServerConfig{
			URL: "http://localhost:6789/api",
		},
	})
	// configure mux for integeration with keploy
	kmux.Mux(kApp, r)
	// configure http client with keploy's interceptor
	interceptor := khttpclient.NewInterceptor(http.DefaultTransport)
	client := http.Client{
		Transport: interceptor,
	}
	
	r.HandleFunc("/mux/httpGet",func (w http.ResponseWriter, r *http.Request)  {
		// SetContext should always be called once in a http handler before http.Client's Get or Post or Head or PostForm method.
        // Passing requests context as parameter.
		interceptor.SetContext(r.Context())
		// make Get, Post, etc request to external http service
		resp, err := client.Get("https://example.com/getDocs")
		if err != nil {
			log.Fatal(err)
		}
		defer resp.Body.Close()
		body, err := io.ReadAll(resp.Body)
		fmt.Println("BODY : ", body)
	})

	r.HandleFunc("/mux/httpDo", func(w http.ResponseWriter, r *http.Request){
		putBody, _ := json.Marshal(map[string]interface{}{
		    "name":  "Ash",
		    "age": 21,
		    "city": "Palet town",
		})
		PutBody := bytes.NewBuffer(putBody)
		// Use handler request's context or SetContext before http.Client.Do method call
		req,err := http.NewRequestWithContext(r.Context(), http.MethodPut, "https://example.com/updateDocs", PutBody)
		req.Header.Set("Content-Type", "application/json; charset=utf-8")
		if err!=nil{
		    log.Fatal(err)
		}
		resp,err := cl.Do(req)
		if err!=nil{
		    log.Fatal(err)
		}
		defer resp.Body.Close()
		body, err := io.ReadAll(resp.Body)
		if err!=nil{
		    log.Fatal(err)
		}
		fmt.Println(" response Body: ", string(body))

	})

	// gcp compute API integeration
	client, err := google.DefaultClient(context.TODO(), compute.ComputeScope)
	if err != nil {
		fmt.Println(err)
	}
	// add keploy interceptor to gcp httpClient
	intercept := khttpclient.NewInterceptor(client.Transport)
	client.Transport = intercept

	r.HandleFunc("/mux/gcpDo", func(w http.ResponseWriter, r *http.Request){
		computeService, err := compute.NewService(r.Context(), option.WithHTTPClient(client), option.WithCredentialsFile("/Users/abc/auth.json"))
		zoneListCall := computeService.Zones.List(project)
		zoneList, err := zoneListCall.Do()
	})
}
```
> ensure to pass request context to all external requests like http requests, db calls, etc. 

</details>

### gRPC

<details>
<summary>Integration</summary>

The outputs of external gRPC calls from API handlers can be mocked by registering keploy's gRPC client interceptor(called WithClientUnaryInterceptor of go-sdk/integrations/kgrpc package). 
```go
conn, err := grpc.Dial(address, grpc.WithInsecure(), kgrpc.WithClientUnaryInterceptor(k))
```
</details>

<details>

<summary>Example</summary>

```go
import(
	"github.com/keploy/go-sdk/integrations/kgrpc"
	"github.com/keploy/go-sdk/keploy"
)

func main() {
	port := "8080"
	k := keploy.New(keploy.Config{
	  App: keploy.AppConfig{
		  Name: "my-app",
		  Port: port,
	  },
	  Server: keploy.ServerConfig{
		  URL: "http://localhost:6789/api",
	  },
	})
	
	// Make gRPC client connection
	conn, err := grpc.Dial(address, grpc.WithInsecure(), kgrpc.WithClientUnaryInterceptor(k))
}
```
> Currently streaming is not yet supported. 

</details>