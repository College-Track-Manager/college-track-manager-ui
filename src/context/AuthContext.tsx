import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { getToken, removeToken, setToken } from '@/services/login';
import { useNavigate } from 'react-router-dom';

const ROLE_CLAIM = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";

interface User {
  email: string;
  name?: string;
  role: 'Admin' | 'Student' | null;
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
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Failed to parse JWT:", error);
    return null;
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  const logout = useCallback(() => {
    removeToken();
    setUser(null);
    setIsAuthenticated(false);
    navigate('/login', { replace: true, state: { sessionExpired: true } });
  }, [navigate]);

  const checkAuthStatus = useCallback(() => {
    const token = getToken();
    if (token) {
      const payload = parseJwt(token);
      if (payload && payload.exp * 1000 > Date.now()) {
        setUser({
          email: payload?.email || payload?.sub,
          name: payload?.name || payload?.sub,
          role: payload[ROLE_CLAIM],
          ...payload
        });
        setIsAuthenticated(true);
      } else {
        logout();
      }
    } else {
      setIsAuthenticated(false);
      setUser(null);
    }
  }, [logout]);

  useEffect(() => {
    checkAuthStatus();
    window.addEventListener('storage', checkAuthStatus);
    const interval = setInterval(checkAuthStatus, 60000); // Check every minute

    return () => {
      window.removeEventListener('storage', checkAuthStatus);
      clearInterval(interval);
    };
  }, [checkAuthStatus]);

  const login = (token: string) => {
    setToken(token);
    const payload = parseJwt(token);
    if (payload) {
      const userRole = payload[ROLE_CLAIM];
      setUser({
        email: payload?.email || payload?.sub,
        name: payload?.name || payload?.sub,
        role: userRole,
        ...payload
      });
      setIsAuthenticated(true);

      if (userRole === 'Admin') {
        navigate('/admin/dashboard');
      } else if (userRole === 'Student') {
        navigate('/student/dashboard');
      } else {
        navigate('/');
      }
    } else {
      logout();
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, logout, login }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
