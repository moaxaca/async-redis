"use strict";

const { assert } = require('chai');
const objectDecorator = require('../../src/object-decorator');

const Mock = function () {
  this.add = function(a, b) {
    return a + b;
  };
  this.subtract = function(a, b) {
    return a - b;
  };
};

describe('Object Decorator', function () {
  it('should decorate a method', async () => {
    let mock = new Mock();
    let mockTwo = new Mock();
    objectDecorator(mock, (name, method) => {
      switch(name) {
        case 'add':
          return (...args) => {
            let a = args[0] + 1;
            let b  = args[1] + 1;
            return method(a, b);
          };
          break;
        case 'subtract':
          return (...args) => {
            let a = args[0];
            let b  = args[1] + 1;
            return method(a, b);
          };
          break;
        default:
          return method;
      }
    });

    assert.equal(mock.add(1, 2), 5);
    assert.equal(mock.subtract(1, 2), -2);
    assert.equal(mockTwo.subtract(1, 2), -1);
  });
});
