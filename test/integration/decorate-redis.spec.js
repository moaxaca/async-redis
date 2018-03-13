const { assert } = require('chai');
const redis = require('redis');
const redisCommands = require('redis-commands');
const AsyncRedis = require('../../src');

describe('AsyncRedis.decorate', function () {
  const client = redis.createClient();
  const asyncRedisClient = AsyncRedis.decorate(client);

  it('should have decorated every command', async () => {
    const commands = redisCommands.list;
    commands.forEach(command => {
      assert.isFunction(asyncRedisClient[command], `redis.${command} isn't decorated`);
    });
  });
});
