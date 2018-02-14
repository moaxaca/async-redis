/**
 * @param object
 * @param decorator
 * @returns {*}
 */
module.exports = (object, decorator) => {
  /* eslint-disable */
  for (const prop in object) {
    if (typeof object[prop] === 'function') {
      object[prop] = decorator(prop, object[prop]);
    }
  }
  /* eslint-enable */
  return object;
};
