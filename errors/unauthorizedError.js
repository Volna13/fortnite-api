const ApplicationError = require('./applicationError');

module.exports = class UnauthorizedError extends ApplicationError {
  constructor() {
    super();
    this.status = 401;
  }

  getStatus() {
    return this.status;
  }
};
