const { assert } = require('chai');
const AsyncRedis = require('../../../src');

describe('Commands - Common', () => {
  let redisClient;

  beforeEach(async () => {
    redisClient = new AsyncRedis();
  });

  afterEach(async () => {
    redisClient.flushall();
  });

  describe('test set method', () => {
    it('should return ok', async () => {
      const status = await redisClient.set('hello', 'world');
      assert.equal(status, 'OK');
    });
  });

  describe('test get method', () => {
    it('should return value', async () => {
      await redisClient.set('hello', 'world');
      const value = await redisClient.get('hello');
      assert.equal(value, 'world');
    });
  });

  describe('test del method', () => {
    it('should return true', async () => {
      await redisClient.set('hello', 'world');
      const status = await redisClient.del('hello');
      assert.equal(status, true);
    });

    it('should return false', async () => {
      const status = await redisClient.del('hello');
      assert.equal(status, false);
    });
  });

  describe('test del method', () => {
    it('should return true', async () => {
      await redisClient.set('hello', 'world');
      const status = await redisClient.del('hello');
      assert.equal(status, true);
    });
  });

  describe('test rejection', () => {
    it('should reject promise on throw', async () => {
      const promise = redisClient.set('hello');
      assert.isRejected(promise, Error);
    });
  });

  describe('test multi not a promise', () => {
    it('should be not equal', async () => {
      const notAPromise = redisClient.multi();
      assert.notEqual(Promise.resolve(notAPromise), notAPromise);
    });
  });
});
