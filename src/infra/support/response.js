const { assoc } = require('ramda');

function makeResponse({ config }) {
  const defaultResponse = (success = true) => ({
    success,
    version: config.version,
    date: new Date(),
  });

  const success = (data) => assoc('data', data, defaultResponse(true));
  const fail = (data) => assoc('error', data, defaultResponse(false));

  return {
    success,
    fail,
  };
}

module.exports = makeResponse;
