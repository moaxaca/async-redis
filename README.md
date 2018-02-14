Async Redis
===========================

[![npm](https://img.shields.io/npm/v/async-redis.svg)]()
[![npm](https://img.shields.io/npm/dm/async-redis.svg)]()
[![Build Status](https://travis-ci.org/moaxaca/async-redis.svg?branch=master)](https://travis-ci.org/moaxaca/async-redis)
[![Coverage Status](https://coveralls.io/repos/github/moaxaca/async-redis/badge.svg)](https://coveralls.io/github/moaxaca/async-redis)

A light weight wrapper over the node_redis library with first class promise support. Ideal for ES7 async functions. 

## Usage Example

### Creating Connection
```js
const asyncRedis = require("async-redis");
const client = asyncRedis.createClient();

client.on("error", function (err) {
    console.log("Error " + err);
});

const asyncBlock = async () => {
  return await client.set("string key", "string val");
};
```

### Decorating Existing Connections
```js
const redis = require("redis");
const client = redis.createClient();
const asyncRedis = require("async-redis");
const asyncRedisClient = asyncRedis.decorate(client);
```

## API Information
This library does very little modification to the api of node_redis. 
It simply appends a promise resolving/rejecting callback for every command. 

For information on redis commands and configuration visit node_redis 
[docs](http://redis.js.org). 


