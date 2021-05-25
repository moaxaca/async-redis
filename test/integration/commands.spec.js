require('../setup');
const { assert } = require('chai');

/**
 * @type {AsyncRedis}
 */
const AsyncRedis = require('../../src');
const getTestRedisConfig = require('../util/getTestRedisConfig');

describe('Commands', () => {
  let redis;

  beforeEach(async () => {
    redis = new AsyncRedis(getTestRedisConfig());
  });

  afterEach(async () => {
    await redis.flushall();
  });

  describe('Auth', () => {
    it('should check decoration', async () => {
      assert.equal(typeof redis.auth, 'function');
    });

    xit('should test rejection', async () => {
      const promise = redis.auth('bad_password');
      assert.isRejected(promise, Error);
    });
  });

  describe('CRUD - AOF (Append Only File)', () => {
    // TODO Figure a better way to clear this state between redis servers
    xit('should work with AOF', async () => {
      await redis.config('set', 'appendonly', 'no');
      await redis.config('rewrite');
      let status = await redis.bgrewriteaof();
      assert.equal(status, 'Background append only file rewriting started');
      status = await redis.set('test', 'value');
      assert.equal(status, 'OK');
      status = await redis.bgsave();
      await redis.bgrewriteaof();
      assert.equal(status, 'Background saving started');
    });
  });

  describe('CRUD (append, set, get, del, exists)', () => {
    it('should execute append', async () => {
      let status = await redis.append('KEY', 'hello');
      assert.equal(status, 5);
      status = await redis.append('KEY', 'world');
      assert.equal(status, 10);
    });

    it('should execute exists', async () => {
      let status = await redis.exists('KEY');
      assert.equal(status, 0);
      await redis.set('KEY', '');
      status = await redis.exists('KEY');
      assert.equal(status, 1);
    });

    it('should set and return ok', async () => {
      const status = await redis.set('hello', 'world');
      assert.equal(status, "OK");
    });

    it('should get value', async () => {
      await redis.set('hello', 'world');
      const value = await redis.get('hello');
      assert.equal(value, "world");
    });

    it('should del and return true', async () => {
      await redis.set('hello', 'world');
      const status = await redis.del('hello');
      assert.equal(status, true);
    });

    it('should return false', async () => {
      const status = await redis.del('hello');
      assert.equal(status, false);
    });
  });

  describe('test multi not a promise', () => {
    let multiClient = null;
    beforeEach(async () => {
      multiClient = redis.multi();
      multiClient.set('test', 'value');
      multiClient.set('foo', 'bar')
        .set('hello', 'world')
        .del('hello');
    });

    afterEach(async () => {
      await redis.del('test');
    });

    it('should run multi into exec', async () => {
      const results = await multiClient.exec();
      assert.equal(results, true);
      const value = await redis.get('test');
      assert.equal(value, "value");
    });

    it('should run multi into exec_atomic', async () => {
      const results = await multiClient.exec_atomic();
      assert.equal(results, true);
      const value = await redis.get('test');
      assert.equal(value, "value");
    });
  });

  describe('test batch not a promise', () => {
    let multiClient = null;
    beforeEach(async () => {
      multiClient = redis.batch();
      multiClient.set('test', 'value');
      multiClient.set('foo', 'bar')
        .set('hello', 'world')
        .del('hello');
    });

    afterEach(async () => {
      await redis.del('test');
    });

    it('should run multi into exec', async () => {
      const results = await multiClient.exec();
      assert.equal(results, true);
      const value = await redis.get('test');
      assert.equal(value, "value");
    });

    it('should run multi into exec_atomic', async () => {
      const results = await multiClient.exec_atomic();
      assert.equal(results, true);
      const value = await redis.get('test');
      assert.equal(value, "value");
    });
  });

  describe('Increment | Decrement functions', () => {
    it('should return server info', async () => {
      let info = await redis.info();
      assert.equal(info.slice(0, 8), '# Server');
    });
  });

  describe('PubSub', () => {
    it('should return server info', async () => {
      let info = await redis.info();
      assert.equal(info.slice(0, 8), '# Server');
    });
  });

  describe('Utility', () => {
    it('should return server info', async () => {
      let info = await redis.info();
      assert.equal(info.slice(0, 8), '# Server');
    });

    it('should ping', async () => {
      let reply = await redis.ping();
      assert.equal(reply, 'PONG');
    });

    it('should return db size', async () => {
      let status = await redis.set('test', 'value');
      assert.equal(status, 'OK');
      status = await redis.dbsize();
      assert.equal(status, 1);
    });

    it('should execute debug', async () => {
      let status = await redis.set('test', 'value');
      assert.equal(status, 'OK');
      status = await redis.debug('object', 'test');
      assert(status);
    });

    it('should execute monitor', async () => {
      const promises = [];
      promises.push(new Promise((resolve, reject) => {
        redis.monitor((error, status) => {
          if (error) {
            reject(error)
          } else {
            assert.equal(status, 'OK');
            resolve();
          }
        });
      }));
      promises.push(new Promise((resolve) => {
        redis.once('monitor', function(time, args) {
          assert.equal(args.length, 3);
          assert.equal(args[0], 'set');
          assert.equal(args[1], 'hello');
          assert.equal(args[2], 'world');
          resolve();
        });
      }));
      promises.push(redis.set('hello', 'world'));
      await Promise.all(promises);
    });
  });
});
