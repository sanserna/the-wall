const { StatusCodes, getReasonPhrase } = require('http-status-codes');

const ApiError = require('../utils/api-error');

const errorConventer = (err, req, res, next) => {
  let error = err;

  if (!(err instanceof ApiError)) {
    const statusCode = error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
    const message =
      error.message || getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR);

    error = new ApiError(statusCode, message, err.stack);
  }

  next(error);
};

const errorHandler = (err, req, res, next, logger, config) => {
  let { statusCode, message } = err;

  if (config.env === 'production') {
    statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
    message = getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR);
  }

  const response = {
    message,
    code: statusCode,
    ...(config.env === 'development' && { stack: err.stack }),
  };

  if (config.env === 'development') {
    logger.error(err);
  }

  res.status(statusCode).send(response);
};

module.exports = { errorConventer, errorHandler };
