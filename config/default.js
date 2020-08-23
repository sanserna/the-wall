module.exports = {
  apis: {
    jsonPlaceholder: {
      baseURL: 'https://jsonplaceholder.typicode.com',
      endpoints: {
        getUserById: {
          method: 'get',
          uri: '/users/{params.id}',
        },
      },
    },
  },
};
