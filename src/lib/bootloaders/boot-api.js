const API = require('../api');

module.exports = (App) => {
  const apisConfig = App.config.get('apis');
  const apis = {};

  Object.keys(apisConfig).forEach((key) => {
    const api = new API(apisConfig[key]);

    if (App.env.isTest()) {
      // Create axios mockAdapter for testing
      const MockAdapter = require('axios-mock-adapter'); // eslint-disable-line global-require
      api.mockAdapter = new MockAdapter(api.axios);
    }

    apis[key] = api;
  });

  // eslint-disable-next-line no-param-reassign
  App.api = apis;
};
