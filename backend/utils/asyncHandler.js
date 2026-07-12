/**
 * Wraps an async route handler so any thrown error/rejected promise
 * is automatically forwarded to Express's error-handling middleware,
 * avoiding repetitive try/catch blocks in every controller.
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncHandler;
