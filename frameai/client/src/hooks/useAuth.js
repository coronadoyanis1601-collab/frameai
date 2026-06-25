import { useState, useEffect, createContext, useContext, createElement } from 'react';
import api from '../lib/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('frameai_user');
    const token = localStorage.getItem('frameai_token');
    if (stored && token) {
      setUser(JSON.parse(stored));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    localStorage.setItem('frameai_token', res.data.token);
    localStorage.setItem('frameai_user', JSON.stringify(res.data.user));
    setUser(res.data.user);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('frameai_token');
    localStorage.removeItem('frameai_user');
    setUser(null);
  };

  const value = { user, login, logout, loading, isAdmin: user?.role === 'ADMIN' };
  return createElement(AuthContext.Provider, { value }, children);
};

export const useAuth = () => useContext(AuthContext);
