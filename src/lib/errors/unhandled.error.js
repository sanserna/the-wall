const { Error: JSONAPIError } = require('jsonapi-serializer');
const { getStatusText, INTERNAL_SERVER_ERROR } = require('http-status-codes');

module.exports = class UnhandledError extends Error {
  constructor({ error, status = INTERNAL_SERVER_ERROR }) {
    super(getStatusText(status));
    this.error = error;
    this.status = status;
  }

  sendResponse(res) {
    if (app.env.isDevelopment()) {
      res.status(this.status).send(this.error.stack);

      return;
    }

    if (app.env.isTest()) {
      console.error(this.error);
    }

    if (this.errors) {
      res.status(this.status).json(new JSONAPIError(this.errors));
    } else {
      res.sendStatus(this.status);
    }
  }
};
