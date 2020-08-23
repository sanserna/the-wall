const bootConfig = require('./bootloaders/boot-config');
const bootEnvironment = require('./bootloaders/boot-environment');
const bootExpress = require('./bootloaders/boot-express');
const bootLogger = require('./bootloaders/boot-logger');
const bootApi = require('./bootloaders/boot-api');
const bootCache = require('./bootloaders/boot-cache');

/**
 * IMPORTANT: The bootloaders order of precedence must be maintained, changes
 * in the order could make the app brake
 */
const bootFunctions = [
  bootConfig,
  bootEnvironment,
  bootLogger,
  bootExpress,
  bootApi,
  bootCache,
];

const App = {
  config: undefined,
  env: undefined,
  log: undefined,
  express: undefined,
  api: undefined,
  cache: undefined,

  boot() {
    bootFunctions.forEach((bootFunction) => bootFunction(this));
  },
};

module.exports = App;
