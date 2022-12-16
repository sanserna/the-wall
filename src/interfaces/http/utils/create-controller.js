const path = require('path');

function createControllerRoutes(controllerUri) {
  const controllerPath = path.resolve(
    'src/interfaces/http/modules',
    controllerUri
  );
  // eslint-disable-next-line security/detect-non-literal-require, import/no-dynamic-require, global-require
  const Controller = require(controllerPath);

  return Controller();
}

module.exports = createControllerRoutes;
