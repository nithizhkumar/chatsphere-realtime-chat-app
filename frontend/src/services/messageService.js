import axiosClient from '../api/axiosClient';

export const fetchConversation = async (userId, withUser) => {
  const { data } = await axiosClient.get('/messages', { params: { userId, withUser } });
  return data.data;
};

export const sendMessageRest = async (senderId, receiverId, message) => {
  const { data } = await axiosClient.post('/messages', { senderId, receiverId, message });
  return data.data;
};

export const markMessagesRead = async (userId, withUser) => {
  const { data } = await axiosClient.patch('/messages/read', { userId, withUser });
  return data;
};
