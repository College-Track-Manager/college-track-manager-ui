import React, { useState, useEffect } from 'react';
import { useAuth } from '../../lib/auth';
import { Mail, Key, Eye, EyeOff, Loader2 } from 'lucide-react';
import { FormError } from '../../components/ui/form-error';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/ui/card';
import { Label } from '../../components/ui/label';
import { useToast } from '../../components/ui/use-toast';
import { Toaster } from '../../components/ui/toaster';
import { PageTransition } from '../../components/page-transition';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface LoginFormData {
  email: string;
  password: string;
}

export const AdminLoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Partial<LoginFormData>>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [twoFactorError, setTwoFactorError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [capsLockOn, setCapsLockOn] = useState(false);

  const handleKeyPress = (e: KeyboardEvent) => {
    setCapsLockOn(e.getModifierState('CapsLock'));
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    window.addEventListener('keyup', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      window.removeEventListener('keyup', handleKeyPress);
    };
  }, []);

  const validateForm = () => {
    const newErrors: Partial<LoginFormData> = {};
    if (!formData.email) {
      newErrors.email = 'البريد الإلكتروني مطلوب';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
      newErrors.email = 'البريد الإلكتروني غير صالح';
    }
    if (!formData.password) {
      newErrors.password = 'كلمة المرور مطلوبة';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const { login, verifyTwoFactor, resetPassword } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      await login(formData.email, formData.password);
      
      // For demo purposes, show 2FA if email contains "2fa"
      if (formData.email.includes('2fa')) {
        setShowTwoFactor(true);
      } else {
        navigate('/admin/dashboard');
      }
    } catch (error) {
      setErrors({
        email: error instanceof Error ? error.message : 'خطأ في تسجيل الدخول',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTwoFactorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!twoFactorCode) {
      setTwoFactorError('الرجاء إدخال رمز التحقق');
      return;
    }

    setLoading(true);
    try {
      await verifyTwoFactor(twoFactorCode);
      navigate('/admin/dashboard');
    } catch (error) {
      setTwoFactorError(error instanceof Error ? error.message : 'رمز التحقق غير صحيح');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    try {
      await resetPassword(formData.email);
      // Show success message
      toast({
        title: 'تم إرسال رابط إعادة تعيين كلمة المرور',
        description: 'يرجى التحقق من بريدك الإلكتروني',
        variant: 'default',
      });
    } catch (error) {
      toast({
        title: 'خطأ',
        description: error instanceof Error ? error.message : 'حدث خطأ غير متوقع',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    // تحقق من وجود رمز المصادقة عند تحميل الصفحة
    const token = localStorage.getItem('auth_token');
    if (token) {
      navigate('/admin/dashboard');
    }
  }, [navigate]);

  return (
    <PageTransition>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8">
        <Toaster />
        <Card className={cn(
          "w-full max-w-md shadow-lg transition-all duration-300",
          "hover:shadow-xl hover:scale-[1.02]",
          "dark:bg-gray-900 dark:border-gray-800"
        )}>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">تسجيل دخول المشرف</CardTitle>
          <CardDescription>
            قم بتسجيل الدخول للوصول إلى لوحة التحكم
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!showTwoFactor ? (
            <form onSubmit={handleSubmit} className="space-y-6" dir="rtl">
              <div className="space-y-2">
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="mt-1 pr-10"
                    placeholder="admin@example.com"
                    dir="ltr"
                  />
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
                </div>
                {errors.email && <FormError message={errors.email} />}
              </div>

              <div className="space-y-2">
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="mt-1 pr-10"
                    dir="ltr"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleSubmit(e as any);
                      }
                    }}
                  />
                  {capsLockOn && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute -top-8 left-0 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 text-sm px-2 py-1 rounded"
                    >
                      Caps Lock مفعل
                    </motion.div>
                  )}
                  <Key className="absolute left-8 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.password && <FormError message={errors.password} />}
              </div>

              <div className="flex items-center justify-between space-y-2 flex-col sm:flex-row sm:space-y-0 sm:space-x-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="rememberMe"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 text-[#002b4e] focus:ring-[#002b4e] border-gray-300 rounded"
                  />
                  <label htmlFor="rememberMe" className="text-sm text-gray-600 dark:text-gray-400">
                    تذكرني
                  </label>
                </div>
                <motion.button
                  type="button"
                  onClick={handleForgotPassword}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={cn(
                    "text-sm font-medium",
                    "text-[#002b4e] hover:text-[#00375f]",
                    "dark:text-[#4d94ff] dark:hover:text-[#80b3ff]",
                    "transition-colors duration-300",
                    "focus:outline-none focus:ring-2 focus:ring-[#002b4e] focus:ring-offset-2",
                    "dark:focus:ring-[#4d94ff] dark:focus:ring-offset-gray-900",
                    "rounded-md px-2 py-1"
                  )}
                >
                  نسيت كلمة المرور؟
                </motion.button>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                <div className="flex items-center justify-center">
                  {loading ? (
                    <>
                      <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                      جاري تسجيل الدخول...
                    </>
                  ) : (
                    'تسجيل الدخول'
                  )}
                </div>
              </Button>
            </form>
          ) : (
            <form onSubmit={handleTwoFactorSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="twoFactorCode">رمز التحقق</Label>
                <div className="relative">
                  <Input
                    id="twoFactorCode"
                    type="text"
                    value={twoFactorCode}
                    onChange={(e) => setTwoFactorCode(e.target.value)}
                    className="mt-1 pr-10"
                    placeholder="000000"
                    dir="ltr"
                  />
                  <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
                </div>
                {twoFactorError && <FormError message={twoFactorError} />}
              </div>

              <Button 
                type="submit" 
                className={cn(
                  "w-full relative",
                  "bg-[#002b4e] hover:bg-[#00375f]",
                  "dark:bg-[#003366] dark:hover:bg-[#004080]",
                  "transform transition-all duration-300",
                  "hover:scale-[1.02]",
                  loading && "cursor-not-allowed opacity-50"
                )} 
                disabled={loading}
              >
                <div className="flex items-center justify-center">
                  {loading ? (
                    <>
                      <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                      جاري التحقق...
                    </>
                  ) : (
                    'تحقق'
                  )}
                </div>
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
    </PageTransition>
  );
};
