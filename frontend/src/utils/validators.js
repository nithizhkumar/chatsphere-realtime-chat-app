import { USERNAME_REGEX, MOBILE_REGEX } from '../constants/appConstants';

export const isValidUsername = (value) => USERNAME_REGEX.test(value.trim());
export const isValidMobile = (value) => MOBILE_REGEX.test(value.trim());

/** Prevents sending empty or whitespace-only chat messages. */
export const isValidMessage = (value) => Boolean(value && value.trim().length > 0);
