import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CheckCircle } from 'lucide-react';
import PageTransition from '@/components/ui/PageTransition';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useNavigate } from 'react-router-dom';
import { registrationsApi } from '@/services/registrations';

const registrationSchema = z.object({
  firstName: z.string()
    .min(2, { message: 'الاسم الأول مطلوب' })
    .regex(/^[\u0600-\u06FFa-zA-Z\s]+$/, { message: 'الاسم الأول يجب أن يحتوي على حروف فقط' }),
  lastName: z.string().min(2, { message: 'الاسم الأخير مطلوب' }),
  email: z.string().email({ message: 'عنوان البريد الإلكتروني غير صالح' }),
  phone: z.string().min(10, { message: 'رقم هاتف صالح مطلوب' }),
  nationalId: z.string().length(14, { message: 'الرقم القومي يجب أن يتكون من ١٤ رقم' }).regex(/^[0-9]+$/, { message: 'الرقم القومي يجب أن يحتوي على أرقام فقط' }),
  address: z.string().min(5, { message: 'العنوان مطلوب' }),
  password: z.string().min(6, { message: 'كلمة المرور مطلوبة ويجب أن تكون 6 أحرف على الأقل' }),
  confirmPassword: z.string().min(6, { message: 'تأكيد كلمة المرور مطلوب' }),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'كلمتا المرور غير متطابقتين',
  path: ['confirmPassword'],
});

type RegistrationFormValues = z.infer<typeof registrationSchema>;

const Registration = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const form = useForm<RegistrationFormValues>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      nationalId: '',
      address: '',
      password: '',
      confirmPassword: '',
    },
  });



  const onSubmit = async (data: RegistrationFormValues) => {
    console.log("onSubmit called!", data); // Debug log
    setIsSubmitting(true);
    setFormSubmitted(false);
    try {
      // Prepare JSON payload
      const payload = {
        FirstName: data.firstName,
        LastName: data.lastName,
        Email: data.email,
        Phone: data.phone,
        NationalId: data.nationalId,
        Address: data.address,
        Password: data.password,
        ConfirmPassword: data.confirmPassword,
      };
      console.log("Calling registrationsApi.submit", payload); // Debug log
      const response = await registrationsApi.submit(payload);
      if (!response || response.error) {
        alert(response?.error || "فشل في إرسال البيانات");
        setIsSubmitting(false);
        return;
      }
      alert("تم إنشاء الحساب بنجاح. يمكنك الآن تسجيل الدخول.");
      setFormSubmitted(true);
      navigate('/login');
    } catch (error) {
      alert("حدث خطأ أثناء إنشاء الحساب");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (formSubmitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <CheckCircle size={64} className="text-green-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2">تم إنشاء الحساب بنجاح</h2>
        <Button onClick={() => navigate('/login')}>تسجيل الدخول</Button>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
        <h1 className="text-2xl font-bold mb-6 text-center">تسجيل حساب جديد</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>الاسم الأول</FormLabel>
                  <FormControl>
                    <Input placeholder="الاسم الأول" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>الاسم الأخير</FormLabel>
                  <FormControl>
                    <Input placeholder="الاسم الأخير" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>البريد الإلكتروني</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="your@email.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>رقم الهاتف</FormLabel>
                  <FormControl>
                    <Input placeholder="رقم الهاتف" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="nationalId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>الرقم القومي</FormLabel>
                  <FormControl>
                    <Input placeholder="الرقم القومي" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>العنوان</FormLabel>
                  <FormControl>
                    <Textarea placeholder="عنوانك" {...field} />
                  </FormControl>
                  <FormMessage />
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
                    <Input type="password" placeholder="كلمة المرور" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>تأكيد كلمة المرور</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="تأكيد كلمة المرور" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Debug: Show validation errors */}
            {Object.values(form.formState.errors).length > 0 && (
              <div style={{ color: 'red', marginBottom: 16 }}>
                {Object.entries(form.formState.errors).map(([field, error]) => (
                  <div key={field}>{field}: {(error as any)?.message}</div>
                ))}
              </div>
            )}
            {/* Debug: Show when submitting */}
            {isSubmitting && <div style={{ color: 'blue', marginBottom: 8 }}>Submitting...</div>}
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'جاري إنشاء الحساب...' : 'إنشاء الحساب'}
            </Button>
          </form>
        </Form>
      </div>
    </PageTransition>
  );
};

export default Registration;
