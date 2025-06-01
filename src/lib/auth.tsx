import React, { createContext, useContext, useState } from 'react';

interface User {
  id: string;
  email: string;
  role: 'admin' | 'user';
  name: string;
  avatar?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  verifyTwoFactor: (code: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  const login = async (email: string, password: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (email === 'admin@example.com' && password === 'password') {
        const user: User = {
          id: '1',
          email,
          role: 'admin',
          name: 'مشرف النظام',
          avatar: '/images/admin-avatar.png'
        };
        
        setIsAuthenticated(true);
        setUser(user);
        
        // Store auth token
        localStorage.setItem('auth_token', 'dummy_token');
      } else {
        throw new Error('بيانات الدخول غير صحيحة');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw new Error('فشل تسجيل الدخول. الرجاء المحاولة مرة أخرى.');
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('auth_token');
    window.location.href = '/admin/login';
  };

  const verifyTwoFactor = async (code: string) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      if (code === '123456') {
        const user: User = {
          id: '1',
          email: 'admin@example.com',
          role: 'admin',
          name: 'مشرف النظام',
          avatar: '/images/admin-avatar.png'
        };
        setIsAuthenticated(true);
        setUser(user);
        localStorage.setItem('auth_token', 'dummy_token');
        return;
      }
      throw new Error('رمز التحقق غير صحيح');
    } catch (error) {
      console.error('2FA error:', error);
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Simulate sending reset email
      console.log('Password reset email sent to:', email);
    } catch (error) {
      console.error('Password reset error:', error);
      throw new Error('فشل إرسال رابط إعادة تعيين كلمة المرور');
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setUser(prev => prev ? { ...prev, ...data } : null);
    } catch (error) {
      console.error('Profile update error:', error);
      throw new Error('فشل تحديث الملف الشخصي');
    }
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      user, 
      login, 
      logout,
      verifyTwoFactor,
      resetPassword,
      updateProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
