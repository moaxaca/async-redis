const { assert } = require('chai');

const objectDecorator = require('../../src/object-decorator');

const Mock = function() {
  this.add = (a, b) => a + b;
  this.subtract = (a, b) => a - b;
};

describe('Object Decorator', () => {
  it('should decorate a method', async () => {
    const mock = new Mock();
    const mockTwo = new Mock();
    objectDecorator(mock, (name, method) => {
      switch (name) {
        case 'add':
          return (...args) => {
            const a = args[0] + 1;
            const b = args[1] + 1;
            return method(a, b);
          };
        case 'subtract':
          return (...args) => {
            const a = args[0];
            const b = args[1] + 1;
            return method(a, b);
          };
        default:
          return method;
      }
    });

    assert.equal(mock.add(1, 2), 5);
    assert.equal(mock.subtract(1, 2), -2);
    assert.equal(mockTwo.subtract(1, 2), -1);
  });
});
