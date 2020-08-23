/* eslint import/no-extraneous-dependencies: 0, global-require: 0, import/no-dynamic-require: 0 */

// Require wrapper to facilitate files imports
global.rootRequire = (path) => require(`${__dirname}/../../${path}`);

const request = require('supertest');

const bootConfig = rootRequire('lib/bootloaders/boot-config');
const bootEnvironment = rootRequire('lib/bootloaders/boot-environment');
const bootExpress = rootRequire('lib/bootloaders/boot-express');
const bootApi = rootRequire('lib/bootloaders/boot-api');

module.exports = {
  bootWithMocks() {
    const val = {};

    this.cache = {
      get: jest.fn((key, cb) => cb(undefined, val[key])),
      setex: jest.fn((key, secs, value) => {
        val[key] = value;
      }),
      set: jest.fn((key, value) => {
        val[key] = value;
      }),
      del: jest.fn((key) => {
        val[key] = undefined;
      }),
      getAsync: jest.fn((key) => Promise.resolve(val[key])),
      setAsync: jest.fn((key, value) => {
        val[key] = value;
        return Promise.resolve();
      }),
      delAsync: jest.fn((key) => {
        val[key] = undefined;
        return Promise.resolve();
      }),
      setexAsync: jest.fn((key, secs, value) => {
        val[key] = value;
        return Promise.resolve();
      }),
    };

    this.log = {
      error: jest.fn(),
      info: jest.fn(),
      createTimer: () => ({ stop: () => {} }),
    };

    [
      bootConfig,
      bootEnvironment,
      bootExpress,
      bootApi,
    ].forEach((boot) => boot(this));

    this.request = () => request(this.express);
  },
};
