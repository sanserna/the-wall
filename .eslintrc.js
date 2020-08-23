module.exports = {
  root: true,
  env: {
    node: true,
    jest: true,
  },
  extends: [
    'airbnb/base',
    'plugin:jest/recommended',
  ],
  rules: {
    quotes: ['error', 'single', { avoidEscape: true }],
    indent: ['error', 2],
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'max-len': ['error', {
      code: 150,
      ignoreTrailingComments: true,
      ignoreStrings: true,
    }],
    'no-use-before-define': ['error', { functions: false }],
    'class-methods-use-this': 'off',
    'jest/expect-expect': ['error', {
      assertFunctionNames: ['expect', 'app.request.*.expect', 'request.*.expect'],
    }],
  },
  globals: {
    request: true,
    app: true,
    rootRequire: true,
  },
  parserOptions: {
    ecmaVersion: 2018,
  },
};
