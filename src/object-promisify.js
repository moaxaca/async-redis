/**
 * @param object
 * @param method
 * @returns {*}
 */
module.exports = (object, method) => {
  return (...args) => new Promise((resolve, reject) => {
    args.push((error, ...results) => {
      console.log(results);
      if (error) {
        reject(error, ...results);
      } else {
        resolve(...results);
      }
    });
    objects.
    method.apply(object, args);
  });
};
