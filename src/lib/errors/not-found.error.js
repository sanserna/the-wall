const { getStatusText, NOT_FOUND } = require('http-status-codes');
const { Error: JSONAPIError } = require('jsonapi-serializer');

const TheWallError = require('./the-wall.error');

module.exports = class NotFoundError extends TheWallError {
  constructor(resource, value = '') {
    super();

    this.resource = resource;
    this.value = value;
  }

  sendResponse(res) {
    res.status(NOT_FOUND).json(new JSONAPIError({
      code: 'resource-not-found',
      title: `Invalid ${this.resource}`,
      detail: `${this.resource} ${this.value} ${getStatusText(NOT_FOUND)}`,
    }));
  }
};
