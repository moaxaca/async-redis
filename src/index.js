const redis = require('redis');
const objectDecorator = require('./object-decorator');
const objectPromisify = require('./object-promisify');
const redisCommands = require('./redis-commands');

const redisClients = new Map();

/**
 * @return RedisClient
 */
const AsyncRedis = function (args=null) {
  if (args) {
    const serializedArgs = JSON.stringify(args);
    if (!redisClients.has(serializedArgs)) {
      redisClients.set(serializedArgs, Array.isArray(args) ? redis.createClient(...args) : redis.createClient(args));
    }
    this.setup(redisClients.get(serializedArgs));
  }
};

AsyncRedis.prototype.setup = function(redisClient) {
  this.__redisClient = redisClient;
  const commandConfigs = redisCommands(redisClient);
  objectDecorator(redisClient, (name, method) => {
    if (commandConfigs.commands.has(name)) {
      objectPromisify(this, redisClient, name);
    } else if (commandConfigs.queueCommands.has(name)) {
      return (...args) => {
        const multi = method.apply(redisClient, args);
        return objectDecorator(multi, (multiName, multiMethod) => {
          if (commandConfigs.multiCommands.has(multiName)) {
            return objectPromisify(multi, multiMethod);
          }
          return multiMethod;
        });
      }
    }
  });
};

AsyncRedis.createClient = (...args) => new AsyncRedis(args);

AsyncRedis.decorate = (redisClient) => {
  const asyncClient = new AsyncRedis();
  asyncClient.setup(redisClient);
  return asyncClient;
};

module.exports = AsyncRedis;
