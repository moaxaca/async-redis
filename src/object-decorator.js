/**
 * @param object
 * @param decorator
 * @returns {*}
 */
module.exports = (object, decorator) => {
  for (const prop in object) {
    if (typeof object[prop] === 'function') {
      decorator(prop, object[prop]);
    }
  }
  return object;
};
