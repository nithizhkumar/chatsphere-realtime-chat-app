import axiosClient from '../api/axiosClient';

export const fetchAllUsers = async (excludeId) => {
  const { data } = await axiosClient.get('/users', { params: { exclude: excludeId } });
  return data.data;
};

export const fetchOnlineUsers = async (excludeId) => {
  const { data } = await axiosClient.get('/users/online', { params: { exclude: excludeId } });
  return data.data;
};
