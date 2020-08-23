const { PRECONDITION_FAILED } = require('http-status-codes');

const TheWallError = require('./the-wall.error');

const { ActionSerializer } = rootRequire('serializers/action.serializer');

module.exports = class PreconditionFailedError extends TheWallError {
  constructor(actionId, params = {}) {
    super();

    this.actionId = actionId;
    this.params = params;
  }

  sendResponse(res) {
    res.status(PRECONDITION_FAILED).json(ActionSerializer({
      actions: [this.actionId],
    }).serialize({
      ...this.params,
      id: this.actionId,
    }));
  }
};
