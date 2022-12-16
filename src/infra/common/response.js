const { assoc } = require('ramda');

class Response {
  constructor({ config }) {
    this.config = config;
  }

  getDefaultResponse(success = true) {
    return {
      success,
      version: this.config.version,
      date: new Date(),
    };
  }

  success(data) {
    return assoc('data', data, this.defaultResponse(true));
  }

  fail(data) {
    return assoc('error', data, this.defaultResponse(false));
  }
}

module.exports = Response;
