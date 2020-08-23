const Redis = require('redis');
const { promisify } = require('util');

// TODO: make sure connections to redis are password protected
const createConnection = (App) => {
  const port = process.env.REDIS_PORT || 6379;
  const host = process.env.REDIS_HOST || '127.0.0.1';
  const authPass = process.env.REDIS_AUTH_PASS;

  const options = process.env.REDIS_PORT
    && process.env.REDIS_HOST
    && process.env.REDIS_AUTH_PASS
    ? {
      auth_pass: authPass,
      tls: { servername: host },
    }
    : undefined;

  const client = Redis.createClient(port, host, options).on('error', (err) => {
    App.log.error('There was an error in Redis', err);
  });

  // Setup promisified redis procedures
  client.getAsync = promisify(client.get).bind(client);
  client.setAsync = promisify(client.set).bind(client);
  client.setexAsync = promisify(client.setex).bind(client);
  client.delAsync = promisify(client.del).bind(client);

  // eslint-disable-next-line no-param-reassign
  App.cache = client;
};

module.exports = createConnection;
