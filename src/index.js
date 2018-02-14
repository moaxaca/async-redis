const redis = require('redis');
const commands = require('redis-commands').list;
const objectDecorator = require('./object-decorator');

const AsyncRedis = function (options) {
  const client = redis.createClient(options);
  return AsyncRedis.decorate(client);
};

AsyncRedis.createClient = options => new AsyncRedis(options);

AsyncRedis.decorate = redisClient => objectDecorator(redisClient, (name, method) => {
  if (commands.includes(name)) {
    return (...args) => new Promise((resolve, reject) => {
      args.push((error, ...results) => {
        if (error) {
          reject(error, ...results);
        } else {
          resolve(...results);
        }
      });
      method.apply(redisClient, args);
    });
  }
  return method;
});

module.exports = AsyncRedis;
