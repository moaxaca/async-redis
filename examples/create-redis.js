/* eslint no-console: 0 */
const asyncRedis = require('../src');

const client = asyncRedis.createClient();

client.on('error', (err) => {
  console.log(`Error ${err}`);
});

const addToSet = async () => {
  const key = 'exampleSet';
  const values = [
    'item_1',
    'item_2',
    'item_3',
    'item_4',
    'item_5',
  ];
  const promises = values.map(value => client.sadd(key, value));
  await Promise.all(promises);
  return client.smembers(key);
};

const flush = async () => client.flushall();

addToSet()
  .then((results) => {
    console.log(results);
    return flush();
  })
  .then((results) => {
    console.log(results);
    process.exit();
  })
  .catch((error) => {
    console.log(error);
    process.exit();
  });
