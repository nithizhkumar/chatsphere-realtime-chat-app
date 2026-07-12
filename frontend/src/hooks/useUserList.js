import { useCallback, useEffect, useState } from 'react';
import { SOCKET_EVENTS } from '../constants/socketEvents';
import { fetchAllUsers } from '../services/userService';

/**
 * Fetches every other user once, then keeps their online/offline
 * status live via Socket.io broadcasts.
 */
const useUserList = (socket, currentUser) => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadUsers = useCallback(() => {
    if (!currentUser) return;
    setIsLoading(true);
    fetchAllUsers(currentUser._id)
      .then(setUsers)
      .catch((err) => setError(err.message || 'Failed to load users'))
      .finally(() => setIsLoading(false));
  }, [currentUser]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  useEffect(() => {
    if (!socket) return undefined;

    const handleOnline = ({ userId, lastSeen }) => {
      setUsers((prev) => prev.map((u) => (u._id === userId ? { ...u, online: true, lastSeen } : u)));
    };
    const handleOffline = ({ userId, lastSeen }) => {
      setUsers((prev) => prev.map((u) => (u._id === userId ? { ...u, online: false, lastSeen } : u)));
    };

    socket.on(SOCKET_EVENTS.USER_ONLINE, handleOnline);
    socket.on(SOCKET_EVENTS.USER_OFFLINE, handleOffline);

    return () => {
      socket.off(SOCKET_EVENTS.USER_ONLINE, handleOnline);
      socket.off(SOCKET_EVENTS.USER_OFFLINE, handleOffline);
    };
  }, [socket]);

  return { users, isLoading, error, refetch: loadUsers };
};

export default useUserList;
