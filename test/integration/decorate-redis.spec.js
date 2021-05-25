const { assert } = require('chai');
const redis = require('redis');

const AsyncRedis = require('../../src');
const getRedisCommands = require('../../src/redis-commands');
const getTestRedisConfig = require('../util/getTestRedisConfig');

describe('AsyncRedis.decorate', () => {
  const options = getTestRedisConfig();
  const redisClient = redis.createClient(options);
  const asyncRedisClient = AsyncRedis.decorate(redisClient);

  it('should have decorated every command', async () => {
    const commands = getRedisCommands(redisClient).commands;
    commands.forEach((command) => {
      assert.isFunction(asyncRedisClient[command], `redis.${command} isn't decorated`);
    });
  });
});
