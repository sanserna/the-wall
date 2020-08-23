module.exports = class BaseModel {
  async serialize() {
    throw new Error('Need to implement serialize() method for models extending BaseModel');
  }
};
