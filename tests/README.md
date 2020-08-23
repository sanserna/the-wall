# Testing considerations

At the very least, every API **The Wall** exposes should be tested so that
- every possible response is tested.
- every possible response from any external service is mocked and properly handled.

# Examples
If the `request-resolver` has `validation-rules`, you must tests they are applied correctly.

```javascript
it('should validate required query params', () =>
  app.request()
    .get('/user/aa')
    .expect(400, {
      errors: [
        {
          code: 'invalid-params',
          title: 'Parameter id invalid',
          detail: 'Invalid value',
        }
      ]
    }));
```

You must test all the possible scenarios that could arise, that means any possible `http-status` code or any response structure variation depending on the data sent by the client or any variation in consequence of an external service response.

```javascript
it('should send force update action if the app version is outdated', () => {
  app.api.externalApi.mockAdapter
    .onGet('app-versions/check/15.7/ios')
    .reply(412, {
      storeUrl: 'http://any.url.com/store/apps/details?id=com.app'
    });

  return app.request()
    .get('/status', {
      osType: 'ios',
      appVersion: '15.7'
    }).expect(412, {
      meta: {
        actions: ['upgrade-app']
      },
      data: {
        type: 'action',
        id: 'upgrade-app',
        attributes: {
          'app-store-link': 'http://any.url.com/store/apps/details?id=com.app'
        }
      }
    });
});
```

If you need to mock any external service call response, you can do so using the [axios-mock-adapter](https://github.com/ctimmerm/axios-mock-adapter).

```javascript
app.api.externalApi.mockAdapter
  .onGet('https://jsonplaceholder.typicode.com/users/1')
  .reply(OK, {
    id: '1',
    name: 'Leanne Graham',
    email: 'Sincere@april.biz',
    phone: '1-770-736-8031 x56442',
  });
```
