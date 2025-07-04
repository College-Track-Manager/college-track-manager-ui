import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CheckCircle } from 'lucide-react';
import { RegistrationFields } from './RegistrationFields';
import PageTransition from '@/components/ui/PageTransition';
import { Button } from '@/components/ui/button';
import { Form} from '@/components/ui/form';
import { useNavigate } from 'react-router-dom';
import { registrationsApi } from '@/services/registrations';

const registrationSchema = z.object({
  firstName: z.string()
    .min(2, { message: 'الاسم الأول مطلوب' })
    .regex(/^[\u0600-\u06FFa-zA-Z\s]+$/, { message: 'الاسم الأول يجب أن يحتوي على حروف فقط' }),
  lastName: z.string().min(2, { message: 'الاسم الأخير مطلوب' }),
  email: z.string()
    .min(1, { message: 'البريد الإلكتروني مطلوب' })
    .max(100, { message: 'يجب ألا يتجاوز البريد الإلكتروني 100 حرف' })
    .email({ message: 'عنوان البريد الإلكتروني غير صالح' })
    .regex(
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/, 
      { message: 'صيغة البريد الإلكتروني غير صالحة' }
    ),
  phone: z.string()
    .length(11, { message: 'رقم الهاتف يجب أن يتكون من 11 رقم' })
    .regex(/^[0-9]+$/, { message: 'رقم الهاتف يجب أن يحتوي على أرقام فقط' }),
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
      setFormSubmitted(true);
      // Do not navigate immediately, let user see the success UI
    } catch (error: any) {
      // If backend returns validation errors, show the first error for password
      if (error?.response?.data?.errors && Array.isArray(error.response.data.errors)) {
        // Set error for password field
        const passwordError = error.response.data.errors.find((err: any) => err.code && err.description && err.code.toLowerCase().includes('password') && !err.code.toLowerCase().includes('confirmpassword'));
        if (passwordError) {
          form.setError('password', { type: 'manual', message: passwordError.description });
        }
        // Set error for email/username taken
        const emailError = error.response.data.errors.find((err: any) =>
          err.code && err.description &&
          (err.code.toLowerCase().includes('email') || err.code.toLowerCase().includes('username')) &&
          (err.description.toLowerCase().includes('taken') || err.description.toLowerCase().includes('مستخدم'))
        );
        if (emailError) {
          form.setError('email', { type: 'manual', message: emailError.description });
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (formSubmitted) {
    return (
      <div className="flex flex-col items-center bg-neutral-100 px-4 py-8 text-center mt-20">
        <div className="flex items-center justify-center w-24 h-24 rounded-full bg-neutral-200 mb-6 shadow-sm mx-auto">
          <CheckCircle size={56} color="#1992c8" />
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold mb-4 text-neutral-800">تم إنشاء الحساب بنجاح</h1>
        <p className="text-neutral-600 mb-8 max-w-md mx-auto">
          يمكنك الآن تسجيل الدخول باستخدام بريدك الإلكتروني وكلمة المرور
        </p>
        <Button 
          onClick={() => navigate('/login')}
          className="text-[#1992c8] text-lg md:text-xl font-normal py-3 rounded-lg bg-transparent border-0 outline-none transition-all duration-150 hover:underline hover:bg-[#1992c80d] focus:ring-2 focus:ring-[#1992c8] focus:ring-opacity-40"
        >
          تسجيل الدخول
        </Button>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="max-w-2xl mx-auto mt-20 mb-12 p-8 bg-white rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold mb-8 text-center text-[#002b4e]">تسجيل حساب جديد</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <RegistrationFields control={form.control} />
            {isSubmitting && <div style={{ color: 'blue', marginBottom: 8 }}>Submitting...</div>}
            <Button type="submit" className="w-full mt-8" disabled={isSubmitting}>
              {isSubmitting ? 'جاري إنشاء الحساب...' : 'إنشاء الحساب'}
            </Button>
          </form>
        </Form>
      </div>

    </PageTransition>

  );
};

export default Registration;
