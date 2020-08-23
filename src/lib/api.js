const axios = require('axios');
const qs = require('qs');
const { UNAUTHORIZED, FORBIDDEN } = require('http-status-codes');

const UnauthorizedError = require('./errors/unauthorized.error');

// Uri params interpolation
const getURI = (uri, params = {}) => {
  const matches = uri.match(/\{params.([a-zA-Z0-9_]+)}/g);

  if (matches) {
    matches.forEach((match) => {
      const name = match.replace('{params.', '').replace('}', '');
      // eslint-disable-next-line no-param-reassign
      uri = uri.replace(match, params[name]);
    });
  }

  return uri;
};

// Direct axios call method
const createDirectCallMethod = (axiosInstance, method) => (
  uri,
  info,
  data,
  config,
) => {
  const logTimer = app.log.createTimer();

  let axiosCall;

  if (['get', 'delete', 'head', 'options'].includes(method)) {
    axiosCall = axiosInstance[method](uri, config);
  } else {
    axiosCall = axiosInstance[method](uri, data, config);
  }

  return axiosCall.then((response) => {
    // IMPORTANT: We can't save the full response coming from axios
    // because the request attribute creates a "circular structure".
    delete response.config;
    delete response.request;

    logTimer.stop(`API ${uri} was called`, {
      response,
      info,
    });

    return response;
  });
};

// Perform cached request, if there is no data in cache, perform a direct call
// and then persist the response in cache
const performCachedRequest = (directCallMethod, requestConfig, cacheConfig) => new Promise((resolve, reject) => {
  const {
    uri,
    info,
    data,
    config,
  } = requestConfig;
  const { key, invalidAfter } = cacheConfig;
  const logTimer = app.log.createTimer();

  app.cache.get(key, async (err, value) => {
    if (err || !value) {
      logTimer.stop(`Cache missed for URL ${key}`, { info });

      try {
        const response = await directCallMethod(uri, info, data, config);
        // IMPORTANT: We can't save the full response coming from axios
        // because the request attribute creates a "circular structure".
        delete response.config;
        delete response.request;

        app.cache.setex(key, invalidAfter, JSON.stringify(response));
        app.log.info({ info, message: `Saving cache for URL ${key}` });

        resolve(response);
      } catch (error) {
        reject(error);
      }
    } else {
      const parsedValue = JSON.parse(value);

      logTimer.stop(`Cache hit for URL ${key}`, { value: parsedValue, info });

      resolve(parsedValue);
    }
  });
});

// Axios instance auth error response interceptor
const authErrorResponseInterceptor = (error) => {
  if (error.response) {
    const { status } = error.response;

    if ([UNAUTHORIZED, FORBIDDEN].includes(status)) {
      throw new UnauthorizedError();
    }
  }

  return Promise.reject(error);
};

module.exports = class API {
  constructor({
    endpoints = {},
    baseURL,
    headers,
    responseType,
  }) {
    const paramsSerializer = (params) => qs.stringify(params, { arrayFormat: 'brackets' });

    this.axios = axios.create({
      baseURL,
      headers,
      responseType,
      paramsSerializer,
    });

    this.axios.interceptors.response.use(
      (response) => response,
      authErrorResponseInterceptor,
    );

    Object.keys(endpoints).forEach((endpointName) => {
      const { method, uri, cache = {} } = endpoints[endpointName];

      let { enabled: cacheEnabled, invalidAfter } = cache;

      this[endpointName] = ({
        url,
        info = {},
        config = {},
        data = {},
        cache: routeCacheConfig = {},
      } = {}) => {
        const directCallMethod = createDirectCallMethod(this.axios, method);
        const composedUri = getURI(uri, url);

        cacheEnabled = 'cacheEnabled' in routeCacheConfig
          ? !!routeCacheConfig.cacheEnabled
          : !!cacheEnabled;
        invalidAfter = routeCacheConfig.invalidAfter || invalidAfter;

        if (cacheEnabled) {
          if (!invalidAfter || typeof invalidAfter !== 'number') {
            // eslint-disable-next-line max-len
            throw new TypeError(`When cache is enabled invalidAfter needs to be a number. The number of seconds to cache the response of the API. ${cache.invalidAfter} was given`);
          }

          const key = `apis:cache:${endpointName}:${composedUri}`;

          return performCachedRequest(
            directCallMethod,
            {
              info,
              data,
              config,
              uri: composedUri,
            },
            { key, invalidAfter },
          );
        }

        return directCallMethod(composedUri, info, data, config);
      };
    });
  }
};
