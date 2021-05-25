const { assert } = require('chai');

const AsyncRedis = require('../../src');
const getTestRedisConfig = require('../util/getTestRedisConfig');

describe('AsyncRedis.createClient', () => {
  const options = getTestRedisConfig();
  const url = `redis://${options.host}:${options.port}`;

  it('should create using constructor syntax', async () => {
    const asyncRedisClient = new AsyncRedis(options);
    assert.instanceOf(asyncRedisClient, AsyncRedis);
  });

  it('should create using url syntax', async () => {
    const asyncRedisClient = AsyncRedis.createClient(url);
    assert.instanceOf(asyncRedisClient, AsyncRedis);
  });

  it('should create using options', async () => {
    const asyncRedisClient = AsyncRedis.createClient(options);
    assert.instanceOf(asyncRedisClient, AsyncRedis);
  });
});
