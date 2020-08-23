module.exports = class RequestContext {
  constructor(request) {
    this.info = {};
    this.requestId = request.requestId;
    this.token = request.headers.authorization;
  }

  get isAuthenticatedUser() {
    return !!this.token;
  }

  get authHeaders() {
    return {
      Authorization: this.token || '',
    };
  }
};
