function makeApp({ server, logger }) {
  return {
    start() {
      logger.info('Starting core backend');
      return Promise.resolve().then(server.start);
    },
  };
}

module.exports = makeApp;
