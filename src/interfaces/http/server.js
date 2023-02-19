const express = require('express');

function makeServer({ config, router, logger }) {
  const app = express();

  app.disable('x-powered-by');
  app.use(router);

  return {
    start() {
      return new Promise((resolve) => {
        app.listen(config.port, () => {
          logger.info(`Listening on port ${config.port}`);
          resolve();
        });
      });
    },
  };
}

module.exports = makeServer;
