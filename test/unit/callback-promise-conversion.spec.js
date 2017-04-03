"use strict";

const { assert } = require('chai');
const redis = require("redis-mock");
const asyncRedis = require('../../index');

const client = redis.createClient();
const asyncClient = asyncRedis.decorate(client);

describe('Callback Promise Conversion', function () {
  beforeEach(async() => {
    await asyncClient.flushall();
  });

  it('shouldn\'t apply conversion', async () => {
    let status = await asyncClient.set('key', 'value');
    assert.equal(status, 'OK');
  });

  it('should apply conversion when last argument is function', async (done) => {
    await asyncClient.set('key', 'value', (err, result) => {
      assert.equal(err, undefined);
      assert.equal(result, 'OK');
      done();
    });
  });
});