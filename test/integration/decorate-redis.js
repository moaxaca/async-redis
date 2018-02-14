const { assert } = require('chai');
const redis = require('redis');
const commands = require('redis-commands').list;

const AsyncRedis = require('../../index');

describe('AsyncRedis.decorate', function () {
  const client = redis.createClient();
  const asyncRedisClient = AsyncRedis.decorate(client);

  it('should have decorated every command', async () => {
    for (let command of commands) {
      assert.isFunction(asyncRedisClient[command], `Command isn't decorated ${command}`);
    }
  });
});
