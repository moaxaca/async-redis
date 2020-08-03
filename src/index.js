const redis = require('redis');
const commands = require('redis-commands').list;
const objectDecorator = require('./object-decorator');

const AsyncRedis = function (args) {
  const client = Array.isArray(args) ? redis.createClient(...args) : redis.createClient(args);
  return AsyncRedis.decorate(client);
};

AsyncRedis.createClient = (...args) => new AsyncRedis(args);

const commandsToSkipSet = new Set(['multi']);
const commandSet = new Set(commands.filter(c => !commandsToSkipSet.has(c)));
const queueCommandSet = new Set(['batch', 'multi']);
const multiCommandSet = new Set(['exec', 'exec_atomic']);

const promisify = function (object, method) {
  return (...args) => new Promise((resolve, reject) => {
    args.push((error, ...results) => {
      if (error) {
        reject(error, ...results);
      } else {
        resolve(...results);
      }
    });
    method.apply(object, args);
  });
};

AsyncRedis.decorate = redisClient => objectDecorator(redisClient, (name, method) => {
  if (commandSet.has(name)) {
    return promisify(redisClient, method);
  } else if (queueCommandSet.has(name)) {
    return (...args) => {
      const multi = method.apply(redisClient, args);
      return objectDecorator(multi, (multiName, multiMethod) => {
        if (multiCommandSet.has(multiName)) {
          return promisify(multi, multiMethod);
        }
        return multiMethod;
      });
    }
  }
  return method;
});

module.exports = AsyncRedis;
