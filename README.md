Async Redis
===========================

[![npm](https://img.shields.io/npm/v/async-redis.svg)](https://www.npmjs.com/package/async-redis)
[![npm](https://img.shields.io/npm/dm/async-redis.svg)](https://www.npmjs.com/package/async-redis)
[![Build Status](https://travis-ci.org/moaxaca/async-redis.svg?branch=master)](https://travis-ci.org/moaxaca/async-redis)
[![Coverage Status](https://coveralls.io/repos/github/moaxaca/async-redis/badge.svg)](https://coveralls.io/github/moaxaca/async-redis)
[![Maintainability](https://api.codeclimate.com/v1/badges/141c7e0d80d10b10c42a/maintainability)](https://codeclimate.com/github/moaxaca/async-redis/maintainability)
[![Known Vulnerabilities](https://snyk.io/test/github/moaxaca/async-redis/badge.svg?targetFile=package.json)](https://snyk.io/test/github/moaxaca/async-redis?targetFile=package.json)

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


