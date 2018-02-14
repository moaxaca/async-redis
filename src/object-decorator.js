/**
 * @param object
 * @param decorator
 * @returns {*}
 */
module.exports = (object, decorator) => {
  for (const prop in object) {
    if (object.hasOwnProperty(prop) && typeof object[prop] === 'function') {
      object[prop] = decorator(prop, object[prop]);
    }
  }
  return object;
};
