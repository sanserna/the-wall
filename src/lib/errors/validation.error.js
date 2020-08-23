const { BAD_REQUEST } = require('http-status-codes');
const { Error: JSONAPIError } = require('jsonapi-serializer');

const TheWallError = require('./the-wall.error');

module.exports = class ValidationError extends TheWallError {
  constructor(validationResult) {
    super();
    this.buildErrors(validationResult);
  }

  buildErrors(result) {
    this.errors = result
      .array({ onlyFirstError: true })
      .map((validationError) => {
        if (validationError.param === '_error') {
          return {
            code: 'invalid-request',
            title: 'Invalid entry structure',
            detail: validationError.msg,
          };
        }
        return {
          code: `invalid-${validationError.location}`,
          title: `Parameter ${validationError.param} invalid`,
          detail: validationError.msg,
        };
      });
  }

  sendResponse(res) {
    res.status(BAD_REQUEST).json(new JSONAPIError(this.errors));
  }
};
