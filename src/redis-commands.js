const queueCommands = new Set(['batch', 'multi']);
const multiCommands = new Set(['exec', 'exec_atomic']);

/**
 * @param redisClient
 * @returns {{queueCommands: Set<string>, multiCommands: Set<string>, commands: Set<any>}}
 */
module.exports = (redisClient) => {
  const commands = [];
  for (const prop in redisClient) {
    if (typeof redisClient[prop] === 'function') {
      commands.push(prop);
    }
  }
  return {
    commands: new Set(commands.filter(c => !queueCommands.has(c))),
    queueCommands,
    multiCommands,
  }
};
