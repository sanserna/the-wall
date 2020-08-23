const MockAdapter = require('axios-mock-adapter');

const Api = rootRequire('lib/api');

beforeEach(() => {
  app.bootWithMocks();
});

it('creates methods based on endpoints', async () => {
  expect.assertions(2);
  const api = new Api({
    baseURL: 'https://potato.com/',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    endpoints: {
      getPotato: {
        method: 'get',
        uri: 'potato',
      },
    },
  });
  const mock = new MockAdapter(api.axios);
  mock.onGet('/potato').reply(200, { thisis: 'potato' });

  expect(api.getPotato).toBeInstanceOf(Function);
  const res = await api.getPotato();
  expect(res.data).toEqual({ thisis: 'potato' });
});

it('receives parameters in URLs', async () => {
  expect.assertions(1);
  const api = new Api({
    baseURL: 'https://potato.com/',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    endpoints: {
      getPotato: {
        method: 'get',
        uri: 'potato/{params.potato}?randomico={params.randomico}',
      },
    },
  });
  const mock = new MockAdapter(api.axios);
  mock
    .onGet('/potato/algo?randomico=my_randomico')
    .reply(200, { thisis: 'potato' });

  const res = await api.getPotato({
    url: { potato: 'algo', randomico: 'my_randomico' },
  });
  expect(res.data).toEqual({ thisis: 'potato' });
});

it('Fails if cache is enabled but no timeout is given', () => {
  const api = new Api({
    baseURL: 'https://potato.com/',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    endpoints: {
      getPotato: {
        method: 'get',
        uri: 'potato/{params.potato}',
        cache: {
          enabled: true,
        },
      },
    },
  });

  expect(() => {
    api.getPotato({ url: { potato: 'algo' } });
  }).toThrow(TypeError);
});

it('Caches responses', async () => {
  expect.assertions(3);

  const api = new Api({
    baseURL: 'https://potato.com/',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    endpoints: {
      getPotato: {
        method: 'get',
        uri: 'potato/{params.potato}',
        cache: {
          enabled: true,
          invalidAfter: 99,
        },
      },
    },
  });
  const mock = new MockAdapter(api.axios);
  mock.onGet('/potato/algo').reply(200, { thisis: 'potato' });

  await api.getPotato({ url: { potato: 'algo' } });
  await api.getPotato({ url: { potato: 'algo' } });
  const res = await api.getPotato({ url: { potato: 'algo' } });

  expect(res.data).toEqual({ thisis: 'potato' });

  expect(app.cache.get).toHaveBeenCalledWith(
    expect.stringMatching(/potato/),
    expect.any(Function),
  );
  expect(app.cache.setex).toHaveBeenCalledWith(
    expect.stringMatching(/potato/),
    99,
    expect.stringMatching(/thisis/),
  );
});

it('Caches responses if cache configuration is sent from resolver', async () => {
  expect.assertions(3);

  const api = new Api({
    baseURL: 'https://potato.com/',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    endpoints: {
      getPotato: {
        method: 'get',
        uri: 'potato/{params.potato}',
      },
    },
  });
  const mock = new MockAdapter(api.axios);
  mock.onGet('/potato/algo').reply(200, { thisis: 'potato' });

  const res = await api.getPotato({
    url: { potato: 'algo' },
    cache: { cacheEnabled: true, invalidAfter: 99 },
  });

  expect(res.data).toEqual({ thisis: 'potato' });

  expect(app.cache.get).toHaveBeenCalledWith(
    expect.stringMatching(/potato/),
    expect.any(Function),
  );
  expect(app.cache.setex).toHaveBeenCalledWith(
    expect.stringMatching(/potato/),
    99,
    expect.stringMatching(/thisis/),
  );
});
