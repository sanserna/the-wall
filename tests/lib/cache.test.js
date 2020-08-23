const Redis = require('redis');

const bootCache = rootRequire('lib/bootloaders/boot-cache');

it('rconnects & econnects to redis on errors', () => {
  const client = Redis.createClient();

  let errors = 0;

  app.bootWithMocks();

  client.on = jest.fn((name, callback) => {
    if (errors < 5) {
      callback();
      errors += 1;
    }
    return client;
  });

  bootCache(app);

  // first time is in the test preparation
  // second time is the creation
  // third time is the reconnect
  expect(Redis.createClient).toHaveBeenCalledTimes(2);
});
