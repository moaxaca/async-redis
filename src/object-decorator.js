/**
 * @param object
 * @param decorator
 * @returns {*}
 */
module.exports = (object, decorator) => {
  for (const prop in object) {
    if (typeof object[prop] === 'function') {
      const returned = decorator(prop, object[prop]);
      if (typeof returned === 'function') {
        object[prop] = returned;
      }
    }
  }
  return object;
};
