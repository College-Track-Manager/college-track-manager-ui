import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { getToken, removeToken, setToken } from '@/services/login';
import { useNavigate, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const ROLE_CLAIM = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";

export interface User {
  email: string;
  name?: string;
  role: 'Admin' | 'Student' | null;
  [key: string]: any;
}

interface AuthContextProps {
  isAuthenticated: boolean;
  user: User | null;
  logout: (sessionExpired?: boolean) => void;
  login: (token: string) => void;
  hasRequiredRole: (requiredRole?: 'Admin' | 'Student' | null) => boolean;
}

interface JwtPayload {
  exp: number;
  [key: string]: any;
}

const AuthContext = createContext<AuthContextProps>({
  isAuthenticated: false,
  user: null,
  logout: () => {},
  login: () => {},
  hasRequiredRole: () => false,
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
  const location = useLocation();

  const logout = useCallback((sessionExpired: boolean = false) => {
    removeToken();
    setUser(null);
    setIsAuthenticated(false);
    
    if (sessionExpired) {
      // Store the current location to redirect back after login
      const returnTo = location.pathname !== '/login' ? { from: location.pathname } : undefined;
      navigate('/unauthorized', { state: { sessionExpired: true, returnTo }, replace: true });
    } else {
      navigate('/login', { replace: true });
    }
  }, [navigate, location]);

  const checkTokenExpiration = useCallback((token: string): boolean => {
    console.log('🔍 Validating token...');
    try {
      // First, check if token exists and is not expired
      if (!token) {
        console.log('❌ No token provided');
        logout();
        return false;
      }

      // Decode the token
      const decoded = jwtDecode<JwtPayload>(token);
      const currentTime = Date.now() / 1000; // Convert to seconds
      
      console.log('🔑 Token exp:', new Date(decoded.exp * 1000).toISOString());
      console.log('⏰ Current time:', new Date().toISOString());
      
      const isExpired = decoded.exp < currentTime;
      
      if (isExpired) {
        console.log('⌛ Token expired');
        logout(true);
        return false;
      }
      
      // If token is valid, update user state
      const userRole = decoded[ROLE_CLAIM];
      const userData = {
        email: decoded?.email || decoded?.sub || '',
        name: decoded?.name || decoded?.sub || '',
        role: userRole === 'Admin' || userRole === 'Student' ? userRole : null,
        ...decoded
      };
      
      console.log('✅ Token valid, user:', userData);
      setUser(userData);
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error('❌ Error validating token:', error);
      logout(true);
      return false;
    }
  }, [logout]);
  
  // Check token on mount and when auth state changes
  useEffect(() => {
    console.log('🔄 Auth state changed, checking token...');
    const token = getToken();
    
    if (token) {
      console.log('🔑 Token found, validating...');
      const isValid = checkTokenExpiration(token);
      console.log('🔍 Token validation result:', isValid ? '✅ Valid' : '❌ Invalid');
    } else {
      console.log('❌ No token found, logging out...');
      setIsAuthenticated(false);
      setUser(null);
    }
    
    // Set up interval to check token periodically
    const interval = setInterval(() => {
      console.log('⏰ Periodic token check...');
      const currentToken = getToken();
      if (currentToken) {
        checkTokenExpiration(currentToken);
      } else {
        setIsAuthenticated(false);
        setUser(null);
        clearInterval(interval);
      }
    }, 30000); // Check every 30 seconds
    
    return () => clearInterval(interval);
  }, [checkTokenExpiration]);

  const checkAuthStatus = useCallback(() => {
    const token = getToken();
    if (token) {
      checkTokenExpiration(token);
    } else {
      setIsAuthenticated(false);
      setUser(null);
    }
  }, [checkTokenExpiration]);
  
  const hasRequiredRole = useCallback((requiredRole?: 'Admin' | 'Student' | null): boolean => {
    if (!requiredRole) return true; // No role required
    if (!user?.role) return false; // User has no role
    return user.role === requiredRole;
  }, [user]);

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
    
    // Check token validity and extract user info
    if (checkTokenExpiration(token)) {
      const payload = jwtDecode<JwtPayload>(token);
      const userRole = payload[ROLE_CLAIM];
      
      // Redirect based on role or return URL
      const returnTo = location.state?.from || 
                     (userRole === 'Admin' ? '/admin/dashboard' : '/student/dashboard');
      
      navigate(returnTo, { replace: true });
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        isAuthenticated, 
        user, 
        logout, 
        login,
        hasRequiredRole
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
