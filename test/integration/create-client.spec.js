const { assert } = require('chai');
const { RedisClient } = require('redis');
const AsyncRedis = require('../../src');

describe('AsyncRedis.createClient', function () {
  const options = {
    host: '127.0.0.1',
    port: 6379,
  };
  const url = `redis://${options.host}:${options.port}`;

  it('should create using constructor syntax', async () => {
    const asyncRedisClient = new AsyncRedis(options);
    assert.instanceOf(asyncRedisClient, RedisClient);
  });

  it('should create using url syntax', async () => {
    const asyncRedisClient = AsyncRedis.createClient(url);
    assert.instanceOf(asyncRedisClient, RedisClient);
  });

  it('should create using options', async () => {
    const asyncRedisClient = AsyncRedis.createClient(options);
    assert.instanceOf(asyncRedisClient, RedisClient);
  });
});
