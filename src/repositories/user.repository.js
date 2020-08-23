const BaseRepository = require('./base.repository');

const UserModel = rootRequire('./models/user.model');

class UserRepository extends BaseRepository {
  async getUserById(userId) {
    const userDataResponse = await app.api.jsonPlaceholder.getUserById({
      url: {
        id: userId,
      },
    });

    return new UserModel(userDataResponse.data);
  }
}

module.exports = UserRepository;
