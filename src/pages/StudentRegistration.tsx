import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { motion, useInView } from 'framer-motion';
import { CheckCircle, XCircle } from 'lucide-react';

// Error messages
const ERROR_MESSAGES = {
  required: 'هذا الحقل مطلوب',
  firstName: {
    min: 'الاسم الأول يجب أن يكون حرفين على الأقل',
    max: 'الاسم الأول يجب ألا يتجاوز ٥٠ حرفاً',
    format: 'الاسم الأول يجب أن يحتوي على حروف فقط'
  },
  lastName: {
    min: 'الاسم الأخير يجب أن يكون حرفين على الأقل',
    max: 'الاسم الأخير يجب ألا يتجاوز ٥٠ حرفاً',
    format: 'الاسم الأخير يجب أن يحتوي على حروف فقط'
  },
  email: {
    invalid: 'عنوان البريد الإلكتروني غير صالح',
    format: 'يجب أن يكون بريداً إلكترونياً صالحاً'
  },
  phone: {
    length: 'رقم الهاتف يجب أن يتكون من ١١ رقم',
    format: 'رقم الهاتف يجب أن يحتوي على أرقام فقط'
  },
  nationalId: {
    length: 'الرقم القومي يجب أن يتكون من ١٤ رقم',
    format: 'الرقم القومي يجب أن يحتوي على أرقام فقط'
  },
  password: {
    min: 'كلمة المرور يجب أن تكون ٦ أحرف على الأقل',
    max: 'كلمة المرور يجب ألا تتجاوز ٥٠ حرفاً',
    format: 'كلمة المرور يجب أن تحتوي على حرف كبير وحرف صغير ورقم على الأقل'
  },
  passwordMatch: 'كلمات المرور غير متطابقة'
} as const;

// Schema definition with enhanced validation
const registrationSchema = z.object({
  firstName: z.string()
    .min(2, { message: ERROR_MESSAGES.firstName.min })
    .max(50, { message: ERROR_MESSAGES.firstName.max })
    .regex(/^[\u0600-\u06FFa-zA-Z\s]+$/, { message: ERROR_MESSAGES.firstName.format }),
  lastName: z.string()
    .min(2, { message: ERROR_MESSAGES.lastName.min })
    .max(50, { message: ERROR_MESSAGES.lastName.max })
    .regex(/^[\u0600-\u06FFa-zA-Z\s]+$/, { message: ERROR_MESSAGES.lastName.format }),
  email: z.string()
    .min(1, { message: ERROR_MESSAGES.required })
    .email({ message: ERROR_MESSAGES.email.invalid })
    .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, { message: ERROR_MESSAGES.email.format }),
  phone: z.string()
    .length(11, { message: ERROR_MESSAGES.phone.length })
    .regex(/^[0-9]+$/, { message: ERROR_MESSAGES.phone.format }),
  nationalId: z.string()
    .length(14, { message: ERROR_MESSAGES.nationalId.length })
    .regex(/^[0-9]+$/, { message: ERROR_MESSAGES.nationalId.format }),
  address: z.string().optional(),
  password: z.string()
    .min(6, { message: ERROR_MESSAGES.password.min })
    .max(50, { message: ERROR_MESSAGES.password.max })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, { message: ERROR_MESSAGES.password.format }),
  confirmPassword: z.string()
    .min(1, { message: ERROR_MESSAGES.required })
}).refine((data) => data.password === data.confirmPassword, {
  message: ERROR_MESSAGES.passwordMatch,
  path: ['confirmPassword']
});

// Type for form values
type RegistrationFormValues = z.infer<typeof registrationSchema>;

// Form field configuration for reusability and consistency
const FORM_FIELDS = {
  firstName: {
    label: 'الاسم الأول',
    placeholder: 'الاسم الأول',
    required: true
  },
  lastName: {
    label: 'الاسم الأخير',
    placeholder: 'الاسم الأخير',
    required: true
  },
  nationalId: {
    label: 'الرقم القومي',
    placeholder: 'أدخل الرقم القومي المكون من ١٤ رقم',
    required: true
  },
  email: {
    label: 'البريد الإلكتروني',
    placeholder: 'your@email.com',
    type: 'email',
    required: true
  },
  phone: {
    label: 'رقم الهاتف',
    placeholder: '(123) 456-7890',
    required: true
  },
  address: {
    label: 'العنوان',
    placeholder: 'عنوانك (اختياري)',
    required: false
  },
  password: {
    label: 'كلمة المرور',
    placeholder: 'أدخل كلمة المرور',
    type: 'password',
    required: true
  },
  confirmPassword: {
    label: 'تأكيد كلمة المرور',
    placeholder: 'أعد إدخال كلمة المرور',
    type: 'password',
    required: true
  }
} as const;

// Toast styles
const toastStyles = {
  success: {
    className: 'group',
    style: {
      backgroundColor: '#f0fdf4',
      border: '1px solid #bbf7d0',
      color: '#15803d',
      fontSize: '0.938rem',
      fontWeight: '500',
      marginTop: '4rem',
      width: '90%',
      maxWidth: '42rem'
    },
    descriptionClassName: 'text-emerald-700 mt-1.5 text-[0.875rem] leading-5',
    icon: <CheckCircle className="w-5 h-5 text-emerald-500" />,
    duration: 5000,
    position: 'top-center'
  },
  error: {
    className: 'group',
    style: {
      backgroundColor: '#fef2f2',
      border: '1px solid #fecaca',
      color: '#dc2626',
      fontSize: '0.938rem',
      fontWeight: '500',
      marginTop: '4rem',
      width: '90%',
      maxWidth: '42rem'
    },
    descriptionClassName: 'text-red-700 mt-1.5 text-[0.875rem] leading-5',
    icon: <XCircle className="w-5 h-5 text-red-500" />,
    duration: 5000,
    position: 'top-center'
  }
} as const;

const StudentRegistration = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

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
      confirmPassword: ''
    }
  });

  // Input validation handlers
  const handleNameInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow Arabic letters, English letters, and spaces
    if (!/^[\u0600-\u06FFa-zA-Z\s]*$/.test(value)) {
      e.preventDefault();
      return;
    }
    if (value.length > 50) {
      e.preventDefault();
      return;
    }
  };

  const handleNumberInput = (e: React.ChangeEvent<HTMLInputElement>, maxLength: number) => {
    const value = e.target.value;
    // Only allow numbers
    if (!/^\d*$/.test(value)) {
      e.preventDefault();
      return;
    }
    if (value.length > maxLength) {
      e.preventDefault();
      return;
    }
  };

  const handlePhoneInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleNumberInput(e, 11);
  };

  const handleNationalIdInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleNumberInput(e, 14);
  };

  const onSubmit = async (data: RegistrationFormValues) => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('تم إنشاء الحساب بنجاح', {
        ...toastStyles.success,
        description: 'سيتم تحويلك إلى صفحة تسجيل الدخول'
      });
      navigate('/login');
    } catch (error) {
      console.error('Registration failed:', error);
      toast.error('فشل في إنشاء الحساب', {
        ...toastStyles.error,
        description: 'حدث خطأ أثناء إنشاء الحساب. الرجاء المحاولة مرة أخرى'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Updated FormFieldComponent with input validation
  const FormFieldComponent = ({ 
    name, 
    label, 
    placeholder, 
    type = 'text',
    required = false,
    isTextarea = false 
  }: {
    name: keyof RegistrationFormValues;
    label: string;
    placeholder: string;
    type?: string;
    required?: boolean;
    isTextarea?: boolean;
  }) => (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
        const getInputProps = () => {
          const baseProps = {
            placeholder,
            className: "text-base",
            ...field
          };

          switch (name) {
            case 'firstName':
            case 'lastName':
              return {
                ...baseProps,
                onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                  handleNameInput(e);
                  field.onChange(e);
                },
                maxLength: 50
              };
            case 'phone':
              return {
                ...baseProps,
                onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                  handlePhoneInput(e);
                  field.onChange(e);
                },
                maxLength: 11,
                inputMode: 'numeric' as const
              };
            case 'nationalId':
              return {
                ...baseProps,
                onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                  handleNationalIdInput(e);
                  field.onChange(e);
                },
                maxLength: 14,
                inputMode: 'numeric' as const
              };
            case 'email':
              return {
                ...baseProps,
                type: 'email',
                dir: 'ltr'
              };
            case 'password':
            case 'confirmPassword':
              return {
                ...baseProps,
                type: 'password',
                maxLength: 50
              };
            default:
              return baseProps;
          }
        };

        return (
          <FormItem>
            <FormLabel className="text-base font-medium">
              {label}
              {required && <span className="text-destructive mr-1">*</span>}
            </FormLabel>
            <FormControl>
              {isTextarea ? (
                <Textarea 
                  placeholder={placeholder} 
                  className="text-base resize-none" 
                  {...field} 
                />
              ) : (
                <Input 
                  {...getInputProps()}
                />
              )}
            </FormControl>
            <FormMessage className="text-sm font-medium" />
          </FormItem>
        );
      }}
    />
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-grow flex items-center justify-center py-6">
        <div className="w-full max-w-2xl mx-auto px-4">
          <Card className="w-full shadow-sm">
            <CardHeader className="space-y-3 pb-6 border-b">
              <CardTitle className="text-2xl font-bold text-center text-gray-900">
                تسجيل طالب جديد
              </CardTitle>
              <CardDescription className="text-center text-base text-gray-600">
                قم بإنشاء حساب جديد للوصول إلى البرامج الدراسية
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <Form {...form}>
                <motion.form 
                  ref={ref}
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  onSubmit={form.handleSubmit(onSubmit)} 
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormFieldComponent {...FORM_FIELDS.firstName} name="firstName" />
                    <FormFieldComponent {...FORM_FIELDS.lastName} name="lastName" />
                  </div>

                  <div className="space-y-4">
                    <FormFieldComponent {...FORM_FIELDS.nationalId} name="nationalId" />
                    <FormFieldComponent {...FORM_FIELDS.email} name="email" />
                    <FormFieldComponent {...FORM_FIELDS.phone} name="phone" />
                    <FormFieldComponent {...FORM_FIELDS.address} name="address" isTextarea />
                    <FormFieldComponent {...FORM_FIELDS.password} name="password" />
                    <FormFieldComponent {...FORM_FIELDS.confirmPassword} name="confirmPassword" />
                  </div>

                  <div className="pt-2">
                    <Button 
                      type="submit" 
                      className="w-full h-11 text-base font-medium bg-primary hover:bg-primary/90 transition-colors" 
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'جاري إنشاء الحساب...' : 'إنشاء حساب'}
                    </Button>
                  </div>
                </motion.form>
              </Form>
            </CardContent>
            <div className="border-t py-4 px-6">
              <p className="text-center text-gray-600 text-sm">
                لديك حساب بالفعل؟{' '}
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="text-primary hover:text-primary/90 font-medium transition-colors"
                >
                  تسجيل الدخول
                </button>
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StudentRegistration;