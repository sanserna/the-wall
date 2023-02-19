const path = require('path');

function createControllerRoutes(controllerUri) {
  const controllerPath = path.resolve(
    'src/interfaces/http/modules',
    controllerUri
  );
  // eslint-disable-next-line security/detect-non-literal-require, import/no-dynamic-require, global-require
  const createController = require(controllerPath);

  return createController();
}

module.exports = createControllerRoutes;
