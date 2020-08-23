jest.mock('./src/lib/app');
const app = require('./src/lib/app');

global.app = app;

app.bootWithMocks();

jest.mock('redis', () => {
  const client = {};
  client.on = jest.fn().mockReturnValue(client);
  client.get = jest.fn().mockReturnValue(client);
  client.set = jest.fn().mockReturnValue(client);
  client.del = jest.fn().mockReturnValue(client);
  client.setex = jest.fn().mockReturnValue(client);

  return {
    createClient: jest.fn().mockReturnValue(client)
  };
});
