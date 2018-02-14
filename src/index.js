const redis = require('redis');
const commands = require('redis-commands').list;
const objectDecorator = require('./object-decorator');

const AsyncRedis = function (options) {
  const client = redis.createClient(options);
  return AsyncRedis.decorate(client);
};

AsyncRedis.createClient = options => new AsyncRedis(options);

AsyncRedis.decorate = redis => objectDecorator(redis, (name, method) => {
  if (commands.includes(name)) {
    return (...args) => new Promise((resolve, reject) => {
      args.push((error, results) => {
        if (error) {
          reject(results);
        } else {
          resolve(results);
        }
      });
      method.apply(redis, args);
    });
  }
  return method;
});

module.exports = AsyncRedis;
