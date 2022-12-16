const express = require('express');
const cors = require('cors');
const winston = require('winston');
const expressWinston = require('express-winston');
const StackdriverTransport = require('@google-cloud/logging-winston');
const Raven = require('raven');
const bodyParser = require('body-parser');
const { validationResult } = require('express-validator');
const { Deserializer } = require('jsonapi-serializer');
const { getStatusText, INTERNAL_SERVER_ERROR } = require('http-status-codes');

const routes = rootRequire('routes');
const RequestContext = rootRequire('lib/request-context');
const TheWallError = rootRequire('lib/errors/the-wall.error');
const UnhandledError = rootRequire('lib/errors/unhandled.error');
const ValidationError = rootRequire('lib/errors/validation.error');
const { generateUniqueId } = rootRequire('util/string.util');

// Raven Config
const setupRaven = (environment) => {
  Raven.config(process.env.SENTRY_DSN, {
    environment,
    release: process.env.GAE_VERSION,
    parseUser: (req) => {
      const { info, requestId } = new RequestContext(req);

      return {
        ...info,
        requestId,
      };
    },
  }).install();
};

// Winston logger base configuration
const getEnvLoggerBaseConfig = (appEnv) => {
  const baseLogFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format((info) => {
      // eslint-disable-next-line no-param-reassign
      info.level = info.level.toUpperCase();
      return info;
    })()
  );
  const splunkLogFormat = winston.format.combine(baseLogFormat, winston.format.json());
  const prettyLogFormat = winston.format.combine(baseLogFormat, winston.format.prettyPrint());

  return {
    level: process.env.LOG_LEVEL,
    format: process.env.PRETTY_LOGS ? prettyLogFormat : splunkLogFormat,
    dynamicMeta: (req) => {
      const { requestId } = new RequestContext(req);
      return { requestId };
    },
    transports: appEnv.isProduction() ? [new StackdriverTransport()] : [new winston.transports.Console()],
  };
};

// Add extra abstraction layer to resolvers
const resolverWrapper = (resolver) => (req, res, next) => {
  const resolverContext = new RequestContext(req);

  resolver(req, res, resolverContext).catch((err) => next(err));
};

// Global route validation middleware
const routeValidationMiddleware = (req, res, next) => {
  const result = validationResult(req);

  if (result.isEmpty()) {
    next();
  } else {
    const validationError = new ValidationError(result);

    if (!next) {
      throw validationError;
    }

    next(validationError);
  }
};

// Global body deserialization middleware
const bodyDeserializationMiddleware = (req, res, next) => {
  if (Object.entries(req.body).length) {
    new Deserializer({ keyForAttribute: 'snake_case' }).deserialize(req.body, (err, body) => {
      if (err) {
        next(err);

        return;
      }

      req.body = body;
      next();
    });
  } else {
    next();
  }
};

// Setup express application
const createExpressApplication = (appEnv) => {
  const app = express();
  const loggerBaseConfig = getEnvLoggerBaseConfig(appEnv);

  if (appEnv.isProduction()) {
    setupRaven(appEnv.getActive());

    // Setup raven for crash reporting
    // IMPORTANT: The raven request handler must be the first middleware on the app
    app.use(Raven.requestHandler());

    // Setup error handler setup
    // IMPORTANT: The error handler must be before any other error middleware
    app.use(Raven.errorHandler());
  }

  if (!appEnv.isTest()) {
    // Setup wiston logger
    // IMPORTANT: Request logs need to be registered before the routes
    app.use(expressWinston.logger(loggerBaseConfig));
  }

  // Express setup
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(cors());
  app.use(bodyDeserializationMiddleware);
  app.use((req, res, next) => {
    req.requestId = generateUniqueId();
    next();
  });

  app.get('/are-you-alive', (req, res) => {
    res.sendStatus(200);
  });

  routes.forEach((route) => {
    const [method, routePath, resolver, validators] = route;
    const validationMiddlewares = [];

    if (validators) {
      validationMiddlewares.push(validators);
    }

    app[method](routePath, validationMiddlewares, routeValidationMiddleware, resolverWrapper(resolver));
  });

  if (!appEnv.isTest()) {
    // Setup wiston error logger
    // IMPORTANT: Request logs need to be registered after the routes
    app.use(
      expressWinston.errorLogger({
        ...loggerBaseConfig,
        exceptionToMeta: (err) => {
          if (err.isAxiosError) {
            const { url, method, baseURL, data } = err.config;

            return winston.exceptions.getAllInfo({
              ...err.toJSON(),
              config: {
                url,
                method,
                baseURL,
                data,
              },
            });
          }

          return winston.exceptions.getAllInfo(err);
        },
      })
    );
  }

  // App validation middleware: entire error handling reside within this middleware
  // IMPORTANT: error handler middleware need to be registered after the routes
  // and expressWinston error logger
  // eslint-disable-next-line no-unused-vars
  app.use((error, req, res, next) => {
    const responseErr =
      error instanceof TheWallError
        ? error
        : new UnhandledError({
            code: getStatusText(INTERNAL_SERVER_ERROR),
            error,
          });

    responseErr.sendResponse(res);
  });

  return app;
};

module.exports = (App) => {
  // eslint-disable-next-line no-param-reassign
  App.express = createExpressApplication(App.env);
};
