import { createContext, useState, useEffect, useCallback } from 'react';
import { STORAGE_KEY } from '../constants/appConstants';
import { logoutUser } from '../services/authService';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isRestoring, setIsRestoring] = useState(true);

  // Restore session from localStorage on first load
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    } finally {
      setIsRestoring(false);
    }
  }, []);

  const login = useCallback((userData) => {
    setUser(userData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
  }, []);

  const logout = useCallback(async () => {
    if (user?._id) {
      try {
        await logoutUser(user._id);
      } catch {
        // Even if the network call fails, still clear the local session
      }
    }
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, login, logout, isRestoring }}>{children}</AuthContext.Provider>
  );
};
