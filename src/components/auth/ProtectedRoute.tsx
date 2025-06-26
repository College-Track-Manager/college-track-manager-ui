import React, { useEffect, useState, useCallback } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { getToken, isTokenExpired, removeToken } from '@/services/login';

interface ProtectedRouteProps {
  children: JSX.Element;
  requiredRole?: 'Admin' | 'Student' | null;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole = null 
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, hasRequiredRole } = useAuth();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  
  const checkAuth = useCallback(() => {
    const token = getToken();
    
    // Case 1: No token at all
    if (!token) {
      console.log('❌ No token found');
      setIsAuthorized(false);
      return false;
    }
    
    // Case 2: Token exists but is expired
    if (isTokenExpired(token)) {
      console.log('⌛ Token expired');
      removeToken();
      setIsAuthorized(false);
      return false;
    }
    
    // Case 3: Role-based access control
    if (requiredRole !== null && !hasRequiredRole(requiredRole)) {
      console.log('🚫 Insufficient permissions');
      setIsAuthorized(false);
      return false;
    }
    
    // All checks passed
    console.log('✅ Authorized');
    setIsAuthorized(true);
    return true;
  }, [requiredRole, hasRequiredRole]);
  
  // Initial check on mount and when location changes
  useEffect(() => {
    const token = getToken();
    
    // If we have a valid token, trust it even if context isn't loaded yet
    if (token && !isTokenExpired(token) && isAuthorized === null) {
      console.log('🔑 Valid token found, trusting it');
      setIsAuthorized(true);
      return;
    }
    
    // Otherwise, perform full auth check
    checkAuth();
    
    // Set up interval to check auth status periodically
    const interval = setInterval(checkAuth, 30000); // Check every 30 seconds
    
    return () => clearInterval(interval);
  }, [checkAuth, location.pathname, isAuthorized]);
  
  // Handle redirects based on auth status
  useEffect(() => {
    if (isAuthorized === false) {
      console.log('🔁 Redirecting to login');
      navigate('/login', { 
        state: { 
          from: location,
          sessionExpired: true 
        }, 
        replace: true 
      });
    }
  }, [isAuthorized, location, navigate]);
  
  // Show loading state while checking
  if (isAuthorized === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  // If not authorized, we'll show nothing as the useEffect will handle the redirect
  if (!isAuthorized) {
    return null;
  }
  
  // If we get here, the user is authorized to see the page
  return children;
};

export default ProtectedRoute;
