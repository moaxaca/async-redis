/**
 * @param proxy
 * @param object
 * @param name
 * @returns void
 */
module.exports = (proxy, object, name) => {
  proxy[name] = (...args) => {
    return new Promise((resolve, reject) => {
      args.push((error, ...results) => {
        if (error) {
          reject(error, ...results);
        } else {
          resolve(...results);
        }
      });
      object[name](...args);
    });
  };
};
