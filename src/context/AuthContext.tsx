import React, { createContext, useContext, useEffect, useState } from 'react';
import { getToken, removeToken } from '@/services/auth';
import { useNavigate } from 'react-router-dom';

interface User {
  email: string;
  name?: string;
  [key: string]: any;
}

interface AuthContextProps {
  isAuthenticated: boolean;
  user: User | null;
  logout: () => void;
  login: (token: string) => void;
}

const AuthContext = createContext<AuthContextProps>({
  isAuthenticated: false,
  user: null,
  logout: () => {},
  login: () => {},
});

function parseJwt(token: string): any {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!getToken());
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = getToken();
    if (token) {
      const payload = parseJwt(token);
      setUser({
        email: payload?.email || payload?.sub,
        name: payload?.name || payload?.sub,
        ...payload
      });
      setIsAuthenticated(true);
    } else {
      setUser(null);
      setIsAuthenticated(false);
    }
    const checkAuth = () => {
      const token = getToken();
      if (token) {
        const payload = parseJwt(token);
        setUser({
          email: payload?.email || payload?.sub,
          name: payload?.name || payload?.sub,
          ...payload
        });
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    };
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  const login = (token: string) => {
    localStorage.setItem('token', token);
    const payload = parseJwt(token);
    setUser({
      email: payload?.email || payload?.sub,
      name: payload?.name || payload?.sub,
      ...payload
    });
    setIsAuthenticated(true);
  };

  const logout = () => {
    removeToken();
    setUser(null);
    setIsAuthenticated(false);
    navigate('/login', { replace: true, state: { sessionExpired: true } });
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, logout, login }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
