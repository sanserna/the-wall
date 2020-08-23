module.exports = (App) => {
  const active = App.config.util.getEnv('NODE_ENV');

  // eslint-disable-next-line no-param-reassign
  App.env = {
    getActive() {
      return active;
    },
    isProduction() {
      return active === 'production';
    },
    isTest() {
      return active === 'test';
    },
    isDevelopment() {
      return active === 'development';
    },
  };
};
