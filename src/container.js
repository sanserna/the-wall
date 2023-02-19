const awilix = require('awilix');

const config = require('./infra/config');
const makeApp = require('./app');
const makeServer = require('./interfaces/http/server');
const makeRouter = require('./interfaces/http/router');
const makeLogger = require('./infra/logger');
const makeRepository = require('./infra/repositories');
const makeResponse = require('./infra/support/response');

const container = awilix.createContainer({
  injectionMode: awilix.InjectionMode.PROXY,
});

container.register({
  config: awilix.asValue(config),
  app: awilix.asFunction(makeApp).singleton(),
  server: awilix.asFunction(makeServer).singleton(),
  router: awilix.asFunction(makeRouter).singleton(),
  logger: awilix.asFunction(makeLogger).singleton(),
  repository: awilix.asFunction(makeRepository).singleton(),
  response: awilix.asFunction(makeResponse).singleton(),
});

module.exports = container;
