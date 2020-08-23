/* eslint class-methods-use-this: 0 */
const { UNAUTHORIZED } = require('http-status-codes');

const TheWallError = require('./the-wall.error');

module.exports = class UnauthorizedError extends TheWallError {
  sendResponse(res) {
    res.sendStatus(UNAUTHORIZED);
  }
};
