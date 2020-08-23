/* eslint class-methods-use-this: 0 */
module.exports = class TheWallError extends Error {
  sendResponse() {
    throw new Error('Need to implement sendResponse() method for errors extending TheWallError');
  }
};
