const ApplicationError = require('./applicationError');

module.exports = class NotFoundError extends ApplicationError {
  constructor() {
    super();
    this.status = 404;
  }

  getStatus() {
    return this.status;
  }
};
