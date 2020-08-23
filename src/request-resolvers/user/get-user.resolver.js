const { OK, NOT_FOUND } = require('http-status-codes');
const { param } = require('express-validator');

const UserRepository = rootRequire('repositories/user.repository');
const NotFoundError = rootRequire('lib/errors/not-found.error');

const getUser = async (req, res, context) => {
  const { id } = req.params;
  const userRepo = new UserRepository(context);

  try {
    const user = await userRepo.getUserById(id);

    res.status(OK).json(await user.serialize());
  } catch (error) {
    if (error.response && error.response.status === NOT_FOUND) {
      throw new NotFoundError('user', id);
    }

    throw error;
  }
};

const validationRules = [
  param('id')
    .exists()
    .isNumeric(),
];

module.exports = { getUser, validationRules };
