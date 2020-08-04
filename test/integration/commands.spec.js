const { assert } = require('chai');

const AsyncRedis = require('../../src');
const getTestRedisConfig = require('../util/getTestRedisConfig');

describe('Commands', () => {
  let redis;

  beforeEach(async () => {
    redis = new AsyncRedis(getTestRedisConfig());
  });

  afterEach(async () => {
    redis.flushall();
  });

  xdescribe('APPEND Commands', () => {
    it('should execute append', async () => {
      const status = await redis.append('SETUSER', 'hello');
      assert.equal(status, 'OK');
    });

    it('should execute exists', async () => {
      const status = await redis.append('SETUSER', 'world');
      assert.equal(status, 'OK');
    });
  });

  describe('CRUD (set, get, del)', () => {
    it('should return ok', async () => {
      const status = await redis.set('hello', 'world');
      assert.equal(status, "OK");
    });

    it('should return true', async () => {
      await redis.set('hello', 'world');
      const status = await redis.del('hello');
      assert.equal(status, true);
    });

    it('should return false', async () => {
      const status = await redis.del('hello');
      assert.equal(status, false);
    });
  });

  xdescribe('test rejection', () => {
    it('should reject promise on throw', async () => {
      const promise = redis.set('hello');
      assert.isRejected(promise, Error);
    });
  });

  xdescribe('test multi not a promise', () => {
    it('should be not equal', async () => {
      const notAPromise = redis.multi();
      assert.notEqual(Promise.resolve(notAPromise), notAPromise);
    });
  });
});
