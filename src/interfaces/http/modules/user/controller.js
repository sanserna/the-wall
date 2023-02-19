const { get } = require('src/app/user');
const container = require('src/container');

module.exports = () => {
  const {
    repository: { userRepository },
  } = container.cradle;

  const getUseCase = get({ userRepository });

  return {
    getUseCase,
  };
};
