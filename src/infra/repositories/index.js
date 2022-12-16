const user = require('./user');

function makeRepository() {
  return {
    userRepository: user(),
  };
}

module.exports = makeRepository;
