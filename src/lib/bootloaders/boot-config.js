/* eslint no-param-reassign: 0 global-require: 0 */
module.exports = (App) => {
  require('dotenv').config();
  App.config = require('config');
};
