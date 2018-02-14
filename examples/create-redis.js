const asyncRedis = require("../src");
const client = asyncRedis.createClient();

client.on("error", function (err) {
  console.log("Error " + err);
});

let addToSet = async () => {
  let key = 'exampleSet';
  let values = [
    'item_1',
    'item_2',
    'item_3',
    'item_4',
    'item_5',
  ];
  let promises = values.map((value) => {
    return client.sadd(key, value);
  });
  await Promise.all(promises);
  return await client.smembers(key);
};

let flush = async () => {
  return await client.flushall();
};

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
