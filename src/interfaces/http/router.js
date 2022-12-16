const express = require('express');
const helmet = require('helmet');
const xss = require('xss-clean');
const compression = require('compression');
const cors = require('cors');
const { partialRight } = require('ramda');

const httpLogger = require('./middlewares/http-logger');
const createController = require('./utils/create-controller');

function makeRouter({ config, logger }) {
  const router = express.Router();
  const apiRouter = express.Router();

  if (config.env !== 'test') {
    router.use(httpLogger(logger));
  }

  apiRouter
    // enable cors
    .use(
      cors({
        origin: '',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
      })
    )
    // set security HTTP headers
    .use(helmet())
    // parse json request body
    .use(express.json())
    // parse urlencoded request body
    .use(express.urlencoded({ extended: true }))
    // sanitize request data
    .use(xss())
    // gzip compression
    .use(compression());

  /*
   * API routes
   *
   * You can use the `controllers` helper like this:
   * apiRouter.use('/users', controller(controllerPath))
   *
   * The `controllerPath` is relative to the `interfaces/http` folder
   */
  apiRouter.use('/users', createController('user').router);

  router.use(`/api/v1`, apiRouter);

  return router;
}

module.exports = makeRouter;
