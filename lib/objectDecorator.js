"use strict";

module.exports = (object, decorator) => {
  for(let prop in object) {
    if(typeof object[prop] === "function") {
      object[prop] = decorator(prop, object[prop])
    }
  }
  return object;
};
