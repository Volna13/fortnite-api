const ApplicationError = require('./applicationError');

module.exports = class Forbidden extends ApplicationError {
  constructor() {
    super();
    this.status = 403;
  }

  getStatus() {
    return this.status;
  }
};
