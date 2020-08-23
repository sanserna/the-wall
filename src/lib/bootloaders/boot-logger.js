const StackdriverTransport = require('@google-cloud/logging-winston');
const winston = require('winston');

module.exports = (App) => {
  // Setup stackdriver logging for winston based on environment
  const transports = App.env.isProduction()
    ? [new StackdriverTransport()]
    : [new winston.transports.Console()];

  // eslint-disable-next-line no-param-reassign
  App.log = winston.createLogger({
    transports,
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.json(),
    ),
  });

  // eslint-disable-next-line no-param-reassign
  App.log.createTimer = () => {
    const startedAt = new Date();
    return {
      stop: (message, args) => {
        App.log.info({ message, duration: new Date() - startedAt, ...args });
      },
    };
  };
};
