"use strict";

const redis = require('redis');
const commands = require('redis-commands').list;
const objectDecorator = require('./lib/objectDecorator');

const AsyncRedis = function (options) {
  let client = redis.createClient(options);
  return AsyncRedis.decorate(client);
};

AsyncRedis.createClient = (options) => {
  return new AsyncRedis(options);
};

AsyncRedis.decorate = (redis) => {
  return objectDecorator(redis, (name, method) => {
    if (commands.includes(name)) {
      return (...args) => {
        return new Promise((resolve, reject) => {
          args.push((error, results) => {
            if (error) {
              reject(results);
            } else {
              resolve(results);
            }
          });
          method.apply(redis, args);
        });
      };
    }
    return method;
  });
};

module.exports = AsyncRedis;
