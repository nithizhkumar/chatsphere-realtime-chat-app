import { createContext, useEffect, useRef, useState, useContext } from 'react';
import { io } from 'socket.io-client';
import { SOCKET_EVENTS } from '../constants/socketEvents';
import { AuthContext } from './AuthContext';

export const SocketContext = createContext(null);

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

export const SocketProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const socketRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const [socketError, setSocketError] = useState(null);

  useEffect(() => {
    if (!user?._id) {
      // No logged-in user: ensure any previous socket is torn down.
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      return;
    }

    const socket = io(SOCKET_URL, {
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      setIsConnected(true);
      setSocketError(null);
      socket.emit(SOCKET_EVENTS.JOIN, user._id);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('connect_error', () => {
      setSocketError('Unable to connect in real time. Retrying…');
    });

    socket.on('reconnect', () => {
      // Re-announce presence after a dropped connection is restored
      socket.emit(SOCKET_EVENTS.JOIN, user._id);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [user?._id]);

  return (
    <SocketContext.Provider value={{ socket: socketRef.current, isConnected, socketError }}>
      {children}
    </SocketContext.Provider>
  );
};
