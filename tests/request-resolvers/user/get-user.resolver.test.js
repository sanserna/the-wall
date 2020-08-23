const { OK, BAD_REQUEST } = require('http-status-codes');

beforeEach(() => {
  app.bootWithMocks();
});

describe('get user request resolver', () => {
  it('validates required path params', () => app.request()
    .get('/user/abc')
    .expect(BAD_REQUEST, {
      errors: [
        {
          code: 'invalid-params',
          title: 'Parameter id invalid',
          detail: 'Invalid value',
        },
      ],
    }));

  it('should send user data', () => {
    app.api.jsonPlaceholder.mockAdapter
      .onGet('/users/1')
      .reply(OK, {
        id: '1',
        name: 'Leanne Graham',
        email: 'Sincere@april.biz',
        phone: '1-770-736-8031 x56442',
      });

    return app.request()
      .get('/user/1')
      .expect(OK, {
        meta: {},
        data: {
          id: '1',
          type: 'user',
          attributes: {
            id: '1',
            name: 'Leanne Graham',
            email: 'Sincere@april.biz',
            phone: '1-770-736-8031 x56442',
          },
        },
      });
  });
});
