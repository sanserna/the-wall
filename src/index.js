/* eslint global-require: 0 import/no-dynamic-require: 0 */

// Require wrapper to facilitate files imports
global.rootRequire = (path) => require(`${__dirname}/${path}`);

const app = require('./lib/app');

app.boot();

if (app.env.isProduction()) {
  console.log('Starting google trace agent.....');
  require('@google-cloud/trace-agent').start();
}

// IMPORTANT: because node doesn't have the import/export features of ES6 the
// app is better "exported" as a global variable since: index boots it the rest
// of the code just use it it's easier to mock
global.app = app;

app.express.listen(8080, () => {
  console.log('The Wall listening at http://127.0.0.1:8080');
});
