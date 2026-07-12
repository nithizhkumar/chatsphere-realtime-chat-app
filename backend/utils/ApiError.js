/**
 * Custom error class carrying an HTTP status code, used throughout
 * controllers/validators so the central error handler can respond consistently.
 */
class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'ApiError';
  }
}

export default ApiError;
