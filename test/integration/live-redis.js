"use strict";

const { assert } = require('chai');
const AsyncRedis = require('../../index');

describe('AsyncDecorator', function () {
  let redisClient = AsyncRedis.createClient();

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
});
