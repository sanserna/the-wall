/**
 * function for getter user.
 */
module.exports = ({ userRepository }) => {
  // code for getting all the items
  const all = async () => userRepository.getAll();

  return {
    all,
  };
};
