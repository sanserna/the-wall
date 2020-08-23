const { Serializer } = require('jsonapi-serializer');

module.exports = {
  userSerializer: (meta = {}) => new Serializer('user', {
    meta,
    pluralizeType: false,
    keyForAttribute: 'camelCase',
    attributes: ['id', 'name', 'phone', 'email'],
  }),
};
