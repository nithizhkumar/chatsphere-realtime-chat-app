import ApiError from '../utils/ApiError.js';

const USERNAME_REGEX = /^[a-zA-Z0-9_]{3,20}$/;
const MOBILE_REGEX = /^\d{10}$/;

/**
 * Validates the login payload. Exactly one identifier (username OR mobileNumber)
 * must be supplied, and it must match the expected format.
 */
export const validateLoginInput = (req, res, next) => {
  const { username, mobileNumber } = req.body;

  if (!username && !mobileNumber) {
    return next(new ApiError(400, 'Please provide a username or a mobile number'));
  }

  if (username && mobileNumber) {
    return next(new ApiError(400, 'Please provide only one identifier: username or mobile number'));
  }

  if (username && !USERNAME_REGEX.test(username.trim())) {
    return next(
      new ApiError(400, 'Username must be 3-20 characters and contain only letters, numbers, and underscores')
    );
  }

  if (mobileNumber && !MOBILE_REGEX.test(mobileNumber.trim())) {
    return next(new ApiError(400, 'Mobile number must be exactly 10 digits'));
  }

  next();
};
