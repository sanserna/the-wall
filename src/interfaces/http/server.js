const express = require('express');

function makeServer({ config, router, logger }) {
  const app = express();

  // app router
  app.use(router);

  return {
    start() {
      return new Promise((resolve) => {
        app.listen(config.port, () => {
          logger.info(`Listening to port ${config.port}`);
          resolve();
        });
      });
    },
  };
}

module.exports = makeServer;
