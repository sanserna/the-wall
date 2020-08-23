// Resolvers
const getUserResolver = require('./request-resolvers/user/get-user.resolver');

/* eslint-disable no-unused-vars */
// HTTP Methods the API can respond to
const GET = 'get';
const POST = 'post';
const PUT = 'put';
const DELETE = 'delete';
/* eslint-enable no-unused-vars */

/**
 * The set of routes and handlers for the API
 * each item in the array is an array with the form:
 * [http-method, path, resolver funcion, validators]
 *
 * IMPORTANT: The routes order of precedence makes API behave different, this
 * must be taken into account
 */
const routes = [
  // User ----------------------------------------------------------------------

  /**
   * User data
   * Send the user data for the given id
   *
   * @name get_user
   * @route {GET} /user/{user-id}
   */
  [
    GET,
    '/user/:id',
    getUserResolver.getUser,
    getUserResolver.validationRules,
  ],
];

module.exports = routes;
