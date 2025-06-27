import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { CheckCircle, XCircle } from 'lucide-react';

const loginSchema = z.object({
  email: z.string({
    required_error: "البريد الإلكتروني مطلوب",
  }).email({
    message: "يرجى إدخال بريد إلكتروني صحيح",
  }).min(5, {
    message: "البريد الإلكتروني يجب أن يكون 5 أحرف على الأقل",
  }).max(100, {
    message: "البريد الإلكتروني يجب أن لا يتجاوز 100 حرف",
  }),
  password: z.string({
    required_error: "كلمة المرور مطلوبة",
  })
});

type LoginFormValues = z.infer<typeof loginSchema>;

import { useLocation } from 'react-router-dom';

import { useAuth } from '@/context/AuthContext';

import { forgotPassword } from '@/services/login';

const Login = () => {
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [changePwForm, setChangePwForm] = useState({
    email: '',
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [isChangingPw, setIsChangingPw] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const onSubmit = async (data: LoginFormValues) => {
    // Client-side validation
    const validation = loginSchema.safeParse(data);
    
    if (!validation.success) {
      // This will show validation errors in the form
      const errors = validation.error.format();
      console.log('Validation errors:', errors);
      return;
    }

    setIsSubmitting(true);
    try {
      // Use backend API for login
      const { loginUser } = await import("@/services/login");
      const response = await loginUser({ email: data.email, password: data.password });
      console.log('Login response:', response);
      
      if (response?.token) {
        login(response.token); // Immediate auth context update
        console.log('Token after login():', localStorage.getItem('token'));

        // Robust redirection: avoid redirecting back to /login or undefined
        const from = (location.state as any)?.from?.pathname;
        console.log('Navigating to:', from);
        if (from && from !== '/login') {
          navigate(from, { replace: true });
        } else {
          navigate('/', { replace: true });
        }
        // Fallback: if navigation fails, force reload
        setTimeout(() => {
          if (window.location.pathname === '/login') {
            window.location.replace('/');
          }
        }, 500);
      } else {
        // Show error message from server if available, otherwise show default message
        const errorMessage = response?.message || 'يرجى التحقق من البريد الإلكتروني وكلمة المرور والمحاولة مرة أخرى';
        toast.error('فشل تسجيل الدخول', {
          description: errorMessage,
          duration: 5000,
          icon: <XCircle className="h-5 w-5 text-red-500" />, 
          className: 'shadow-lg',
          style: {
            background: '#fef2f2',
            border: '1px solid #fca5a5',
            color: '#991b1b',
            padding: '1rem 1.25rem',
            borderRadius: '0.5rem',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          },
          position: 'top-center',
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      let errorMessage = 'حدث خطأ في الاتصال بالخادم';
      
      // Handle different types of errors
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      toast.error('فشل تسجيل الدخول', {
        description: errorMessage,
        duration: 5000,
        icon: <XCircle className="h-5 w-5 text-red-500" />, 
        className: 'shadow-lg',
        style: {
          background: '#fef2f2',
          border: '1px solid #fca5a5',
          color: '#991b1b',
          padding: '1rem 1.25rem',
          borderRadius: '0.5rem',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        },
        position: 'top-center',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Change Password Modal rendered outside the main Form to avoid nested <form>
  const changePasswordModal = showChangePassword && (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative" dir="rtl">
        <button
          className="absolute left-4 top-4 text-gray-500 hover:text-gray-700 text-2xl"
          onClick={() => setShowChangePassword(false)}
          aria-label="إغلاق"
        >
          ×
        </button>
        <h2 className="text-xl font-bold mb-4 text-center">تغيير كلمة المرور</h2>
        <form
          className="space-y-4"
          onSubmit={async e => {
            e.preventDefault();
            setIsChangingPw(true);
            type ForgotPasswordResponse = {
              ok: boolean;
              status: number;
              message?: string;
              [key: string]: any;
            };
            try {
              const response = await forgotPassword(changePwForm.email) as ForgotPasswordResponse;
              if (response.ok) {
                toast.success(
                  typeof response.message === 'string' && response.message.length > 0
                    ? response.message
                    : 'تم إرسال رابط تغيير كلمة المرور إلى بريدك الإلكتروني'
                );
                setShowChangePassword(false);
              } else {
                toast.error('تعذر إرسال طلب تغيير كلمة المرور', {
                  description:
                    typeof response.message === 'string' && response.message.length > 0
                      ? response.message
                      : 'يرجى التحقق من البريد الإلكتروني والمحاولة مرة أخرى',
                });
              }
            } catch (error) {
              toast.error('حدث خطأ أثناء إرسال طلب تغيير كلمة المرور');
            } finally {
              setIsChangingPw(false);
            }
          }}
        >
          <Input
            type="email"
            required
            placeholder="البريد الإلكتروني"
            className="w-full"
            value={changePwForm.email}
            onChange={e => setChangePwForm(f => ({ ...f, email: e.target.value }))}
          />
          <Input
            type="password"
            required
            placeholder="كلمة المرور الحالية"
            className="w-full"
            value={changePwForm.oldPassword}
            onChange={e => setChangePwForm(f => ({ ...f, oldPassword: e.target.value }))}
          />
          <Input
            type="password"
            required
            placeholder="كلمة المرور الجديدة"
            className="w-full"
            value={changePwForm.newPassword}
            onChange={e => setChangePwForm(f => ({ ...f, newPassword: e.target.value }))}
          />
          <Input
            type="password"
            required
            placeholder="تأكيد كلمة المرور الجديدة"
            className="w-full"
            value={changePwForm.confirmPassword}
            onChange={e => setChangePwForm(f => ({ ...f, confirmPassword: e.target.value }))}
          />
          <Button type="submit" className="w-full bg-primary text-white mt-2" disabled={isChangingPw}>
            {isChangingPw ? 'جاري الإرسال...' : 'تغيير كلمة المرور'}
          </Button>
        </form>
      </div>
    </div>
  );

  return (
    <>
      {changePasswordModal}
      <div className="flex flex-col flex-1 min-h-0">
        <div className="flex flex-1 min-h-0 items-center justify-center">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center text-[#002b4e]">تسجيل الدخول</CardTitle>
              <CardDescription className="text-center">
                قم بتسجيل الدخول للوصول إلى البرامج
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>البريد الإلكتروني</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            type="email" 
                            placeholder="example@example.com"
                            autoComplete="email"
                            className="h-12 text-base"
                          />
                        </FormControl>
                        <FormMessage className="text-sm" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>كلمة المرور</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            type="password" 
                            placeholder="أدخل كلمة المرور"
                            autoComplete="current-password"
                            className="h-12 text-base"
                          />
                        </FormControl>
                        <FormMessage className="text-sm" />
                      </FormItem>
                    )}
                  />
                  <Button 
                    type="submit" 
                    className="w-full bg-primary hover:bg-primary/90 text-white h-12 text-base" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
                  </Button>
                  <p className="text-center text-sm text-muted-foreground">
                    <button
                      type="button"
                      className="text-primary hover:underline font-medium"
                      style={{ direction: 'rtl' }}
                      onClick={() => navigate('/forgot-password')}
                    >
                      نسيت كلمة المرور؟
                    </button>
                  </p>
                  <p className="text-center text-sm text-muted-foreground">
                    ليس لديك حساب؟{' '}
                    <button
                      type="button"
                      onClick={() => navigate('/registration')}
                      className="text-primary hover:text-primary/90 transition-colors font-medium"
                    >
                      إنشاء حساب جديد
                    </button>
                  </p>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Login; 