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

const Login = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsSubmitting(true);
    try {
      // Simulate API call with credentials check
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          // Simple validation - in real app this would be an API call
          if (data.email && data.password) {
            resolve(true);
          } else {
            reject(new Error('Invalid credentials'));
          }
        }, 1000);
      });
      
      // Store login state (in real app, you'd store a token)
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userEmail', data.email);
      
      toast.success('تم تسجيل الدخول بنجاح', {
        description: 'مرحباً بك في لوحة التحكم',
        duration: 5000,
        icon: <CheckCircle className="h-5 w-5 text-green-500" />,
        style: {
          background: '#f0fdf4',
          border: '1px solid #86efac',
          color: '#166534',
        },
      });

      // Redirect to student dashboard
      navigate('/student/dashboard', { replace: true });
    } catch (error) {
      console.error('Login failed:', error);
      toast.error('فشل تسجيل الدخول', {
        description: 'يرجى التحقق من البريد الإلكتروني وكلمة المرور والمحاولة مرة أخرى',
        duration: 5000,
        icon: <XCircle className="h-5 w-5 text-red-500" />,
        style: {
          background: '#fef2f2',
          border: '1px solid #fca5a5',
          color: '#991b1b',
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-[calc(100vh-5rem)] flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">تسجيل الدخول</CardTitle>
          <CardDescription className="text-center">
            قم بتسجيل الدخول للوصول إلى البرامج الدراسية
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
  );
};

export default Login; 