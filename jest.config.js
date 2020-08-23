module.exports = {
  name: 'the-wall',
  verbose: true,
  testRegex: 'tests/.*\\.(test|spec)\\.(ts|js)$',
  transformIgnorePatterns: [
    'node_modules/'
  ],
  setupFiles: ['<rootDir>/jest.setup.js'],
  coverageReporters: [
    'lcov'
  ],
  collectCoverageFrom: [
    'src/**/*.js'
  ]
};
