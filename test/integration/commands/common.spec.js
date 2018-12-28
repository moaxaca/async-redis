const { assert } = require('chai');
const AsyncRedis = require('../../../src');

describe('Commands - Common', function () {
  let redisClient;

  beforeEach(async() => {
    redisClient = new AsyncRedis();
  });

  afterEach(async() => {
    redisClient.flushall();
  });

  describe('test set method', function () {
    it('should return ok', async () => {
      let status = await redisClient.set('hello', 'world');
      assert.equal(status, 'OK');
    });
  });

  describe('test get method', function () {
    it('should return value', async () => {
      await redisClient.set('hello', 'world');
      const value = await redisClient.get('hello');
      assert.equal(value, 'world');
    });
  });

  describe('test del method', function () {
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

  describe('test del method', function () {
    it('should return true', async () => {
      await redisClient.set('hello', 'world');
      const status = await redisClient.del('hello');
      assert.equal(status, true);
    });
  });

  describe('test rejection', function () {
    it('should reject promise on throw', async () => {
      let promise = redisClient.set('hello');
      assert.isRejected(promise, Error);
    });
  });

  describe('test multi not a promise', function () {
    it('should be not equal', async () => {
      let notAPromise = redisClient.multi();
      console.log(notAPromise);
      assert.notEqual(Promise.resolve(notAPromise), notAPromise);
    });
  });
});
