const ApplicationError = require('./applicationError');

module.exports = class UnprocessableEntity extends ApplicationError {
  constructor(field, message) {
    super(message);
    this.status = 422;
    this.field = field;
  }

  getField() {
    return this.field;
  }
};
