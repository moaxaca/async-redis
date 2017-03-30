Async Redis
===========================

This is a light weight wrapper over the node_redis library with first call promise support. Ideal for ES7 async functions. 

## Usage Example

```js
const asyncRedis = require("async-redis");
const client = asyncRedis.createClient();

client.on("error", function (err) {
    console.log("Error " + err);
});

const async asyncBlock() {
  return await client.set("string key", "string val");
};
```

## Decorating Existing Connection
```js
const redis = require("redis");
const client = redis.createClient();
const asyncRedis = require("async-redis");
const asyncRedisClient = asyncRedis.decorate(client);
```

## API Information
This library does very little modification to the api of node_redis. 
It simply appends a promise resolving/rejecting callback to every command. 

For information on redis commands and configuration visit node_redis 
[docs](http://redis.js.org). 


