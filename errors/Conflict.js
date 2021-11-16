class Conflict extends Error {
  constructor(message) {
    super(message);
    this.err.statusCode = 409;
  }
}
module.exports = Conflict;
