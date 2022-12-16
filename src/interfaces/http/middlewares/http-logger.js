const morgan = require('morgan');

module.exports = (logger) =>
  morgan('common', {
    stream: {
      write: (message) => {
        logger.info(message.slice(0, -1));
      },
    },
  });
