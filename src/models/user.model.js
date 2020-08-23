const BaseModel = require('./base.model');

const { userSerializer } = rootRequire('serializers/user.serializer');

module.exports = class UserModel extends BaseModel {
  constructor(userdata) {
    super();
    this.id = userdata.id;
    this.name = userdata.name;
    this.phone = userdata.phone;
    this.email = userdata.email;
  }

  async serialize() {
    return userSerializer().serialize(this);
  }
};
