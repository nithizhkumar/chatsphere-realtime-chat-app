import axiosClient from '../api/axiosClient';

/**
 * Logs in (or auto-registers) a user with either a username or a mobile number.
 * @param {{ username?: string, mobileNumber?: string }} credentials
 */
export const loginUser = async (credentials) => {
  const { data } = await axiosClient.post('/auth/login', credentials);
  return data.data;
};

export const logoutUser = async (userId) => {
  const { data } = await axiosClient.post('/auth/logout', { userId });
  return data;
};
