import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, useInView } from 'framer-motion';
import { ChevronLeft, Upload, CheckCircle } from 'lucide-react';
import PageTransition from '@/components/ui/PageTransition';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { tracks } from '@/data/tracks';
import { useNavigate } from 'react-router-dom';
import { registrationsApi } from '@/services/registrations';
import { toast } from 'sonner';

const registrationSchema = z.object({
  firstName: z.string()
    .min(2, { message: 'الاسم الأول مطلوب' })
    .regex(/^[\u0600-\u06FFa-zA-Z\s]+$/, { message: 'الاسم الأول يجب أن يحتوي على حروف فقط' }),
  lastName: z.string().min(2, { message: 'الاسم الأخير مطلوب' }),
  email: z.string().email({ message: 'عنوان البريد الإلكتروني غير صالح' }),
  phone: z.string().min(10, { message: 'رقم هاتف صالح مطلوب' }),
  nationalId: z.string().length(14, { message: 'الرقم القومي يجب أن يتكون من ١٤ رقم' }).regex(/^\d+$/, { message: 'الرقم القومي يجب أن يحتوي على أرقام فقط' }),
  address: z.string().min(5, { message: 'العنوان مطلوب' }),
  track: z.string().min(1, { message: 'الرجاء اختيار مسار' }),
  educationLevel: z.string().min(1, { message: 'الرجاء اختيار المرحلة الدراسية' }),
  education: z.string().min(5, { message: 'الخلفية التعليمية مطلوبة' }),
  statement: z.string().min(50, { message: 'يجب أن تكون الرسالة الشخصية ٥٠ حرفًا على الأقل' }),
});

type RegistrationFormValues = z.infer<typeof registrationSchema>;

const Registration = () => {
  const [step, setStep] = useState(1);
  const [documents, setDocuments] = useState({
    resume: null,
    transcript: null,
    idCard: null,
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    FirstName: '',
    LastName: '',
    Email: '',
    Phone: '',
    Address: '',
    Track: '',
    Education: '',
    Statement: '',
  });
  const [files, setFiles] = useState({
    resume: null as File | null,
    transcript: null as File | null,
    idCard: null as File | null,
  });
  
  const form = useForm<RegistrationFormValues>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      nationalId: '',
      address: '',
      track: '',
      educationLevel: '',
      education: '',
      statement: '',
    },
  });
  
  const handleDocumentUpload = (type, e) => {
    const file = e.target.files[0];
    if (file) {
      setDocuments({
        ...documents,
        [type]: file,
      });
      
      toast({
        title: "تم رفع المستند",
        description: `تم رفع ${file.name} بنجاح.`,
      });
    }
  };
  
  const nextStep = () => {
    if (step === 1) {
      form.trigger(['firstName', 'lastName', 'email', 'phone', 'nationalId', 'address']);
      const hasErrors = !!form.formState.errors.firstName || 
                        !!form.formState.errors.lastName || 
                        !!form.formState.errors.email || 
                        !!form.formState.errors.phone ||
                        !!form.formState.errors.nationalId ||
                        !!form.formState.errors.address;
                        
      if (!hasErrors) {
        setStep(2);
        window.scrollTo(0, 0);
      }
    } else if (step === 2) {
      form.trigger(['track', 'educationLevel', 'education', 'statement']);
      const hasErrors = !!form.formState.errors.track || 
                        !!form.formState.errors.educationLevel || 
                        !!form.formState.errors.education || 
                        !!form.formState.errors.statement;
                        
      if (!hasErrors) {
        setStep(3);
        window.scrollTo(0, 0);
      }
    }
  };
  
  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
      window.scrollTo(0, 0);
    }
  };
  
  const onSubmit = async (data: RegistrationFormValues) => {
    if (!documents.resume || !documents.transcript || !documents.idCard) {
      toast({
        title: "خطأ",
        description: "يرجى رفع جميع المستندات المطلوبة",
        variant: "destructive",
      });
      return;
    }
    
    console.log('Form submitted:', { ...data, documents });
    
    setFormSubmitted(true);
    window.scrollTo(0, 0);
    
    setIsSubmitting(true);
    
    try {
      const formDataToSubmit = new FormData();
      
      // Add form fields
      Object.entries(data).forEach(([key, value]) => {
        formDataToSubmit.append(key, value);
      });

      // Add files if they exist
      if (documents.resume) formDataToSubmit.append('resume', documents.resume);
      if (documents.transcript) formDataToSubmit.append('transcript', documents.transcript);
      if (documents.idCard) formDataToSubmit.append('idCard', documents.idCard);

      await registrationsApi.submit(formDataToSubmit);
      toast({
        title: "تم تقديم الطلب",
        description: "تم تقديم طلبك بنجاح وهو قيد المراجعة.",
      });
      navigate('/tracks');
    } catch (error) {
      console.error('Failed to submit registration:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تقديم طلب التسجيل",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (formSubmitted) {
    return (
      <PageTransition>
        <div className="py-16 md:py-24">
          <div className="container-content max-w-2xl mx-auto text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle size={40} className="text-green-600" />
            </div>
            <h1 className="mt-6 text-3xl font-bold">تم تقديم الطلب!</h1>
            <p className="mt-4 text-muted-foreground">
              شكرًا لتقديم طلبك إلى برنامج كوليدج تراك. تم استلام طلبك وهو الآن قيد المراجعة من قبل فريق القبول لدينا.
            </p>
            <div className="mt-8 p-6 bg-secondary/50 rounded-lg text-right">
              <h3 className="font-semibold">ماذا يحدث بعد ذلك؟</h3>
              <ol className="mt-4 space-y-4">
                <li className="flex">
                  <span className="bg-primary/10 text-primary font-medium h-6 w-6 rounded-full flex items-center justify-center ml-3 flex-shrink-0">١</span>
                  <span>سيقوم فريق القبول لدينا بمراجعة طلبك والمستندات.</span>
                </li>
                <li className="flex">
                  <span className="bg-primary/10 text-primary font-medium h-6 w-6 rounded-full flex items-center justify-center ml-3 flex-shrink-0">٢</span>
                  <span>ستتلقى إشعارًا عبر البريد الإلكتروني حول حالة طلبك في غضون ٥-٧ أيام عمل.</span>
                </li>
                <li className="flex">
                  <span className="bg-primary/10 text-primary font-medium h-6 w-6 rounded-full flex items-center justify-center ml-3 flex-shrink-0">٣</span>
                  <span>إذا تمت الموافقة، ستتلقى تعليمات للدفع والخطوات التالية.</span>
                </li>
              </ol>
            </div>
            <div className="mt-8">
              <Button onClick={() => window.location.href = '/'}>
                العودة إلى الصفحة الرئيسية
              </Button>
            </div>
          </div>
        </div>
      </PageTransition>
    );
  }
  
  return (
    <PageTransition>
      <div className="py-12">
        <div className="container-content max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold">التسجيل في البرنامج</h1>
            <p className="mt-2 text-muted-foreground">
              أكمل نموذج الطلب للتسجيل في المسار الذي اخترته
            </p>
          </div>
          
          <div className="mb-12">
            <div className="flex items-center justify-between">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex flex-col items-center">
                  <div 
                    className={`h-10 w-10 rounded-full flex items-center justify-center ${
                      step >= i ? 'bg-primary text-white' : 'bg-secondary text-muted-foreground'
                    }`}
                  >
                    {step > i ? <CheckCircle size={16} /> : i}
                  </div>
                  <span className={`mt-2 text-xs ${step >= i ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
                    {i === 1 ? 'البيانات الشخصية' : i === 2 ? 'اختيار البرنامج' : 'رفع المستندات'}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-2 relative">
              <div className="absolute top-0 left-0 right-0 h-1 bg-secondary"></div>
              <div 
                className="absolute top-0 right-0 h-1 bg-primary transition-all duration-500"
                style={{ width: `${((step - 1) / 2) * 100}%` }}
              ></div>
            </div>
          </div>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {step === 1 && (
                <StepOne form={form} />
              )}
              
              {step === 2 && (
                <StepTwo form={form} />
              )}
              
              {step === 3 && (
                <StepThree handleDocumentUpload={handleDocumentUpload} documents={documents} />
              )}
              
              <div className="flex justify-between mt-12">
                {step > 1 && (
                  <Button type="button" variant="outline" onClick={prevStep}>
                    السابق
                  </Button>
                )}
                
                {step < 3 ? (
                  <Button type="button" onClick={nextStep} className="mr-auto">
                    متابعة <ChevronLeft size={16} className="mr-1" />
                  </Button>
                ) : (
                  <Button type="submit" className="mr-auto" disabled={isSubmitting}>
                    {isSubmitting ? 'جاري التقديم...' : 'تقديم الطلب'}
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </div>
      </div>
    </PageTransition>
  );
};

const StepOne = ({ form }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  
  return (
    <motion.div 
      ref={ref}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-xl font-semibold mb-6">المعلومات الشخصية</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
      </div>
      
      <div className="mt-6">
        <FormField
          control={form.control}
          name="nationalId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>الرقم القومي <span className="text-destructive">*</span></FormLabel>
              <FormControl>
                <Input type="text" placeholder="أدخل الرقم القومي المكون من ١٤ رقم" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <div className="mt-6">
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
      </div>
      
      <div className="mt-6">
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>رقم الهاتف</FormLabel>
              <FormControl>
                <Input placeholder="(123) 456-7890" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <div className="mt-6">
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
      </div>
    </motion.div>
  );
};

const StepTwo = ({ form }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  
  return (
    <motion.div 
      ref={ref}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-xl font-semibold mb-6">اختيار البرنامج</h2>
      
      <div className="space-y-6">
        <FormField
          control={form.control}
          name="track"
          render={({ field }) => (
            <FormItem className="text-right">
              <FormLabel>اختر المسار</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="text-right">
                    <SelectValue placeholder="اختر مسارًا" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent align="end" className="text-right">
                  {tracks.map((track) => (
                    <SelectItem key={track.id} value={track.id}>
                      {track.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="educationLevel"
          render={({ field }) => (
            <FormItem className="text-right">
              <FormLabel>المرحلة الدراسية <span className="text-destructive">*</span></FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="text-right">
                    <SelectValue placeholder="اختر المرحلة الدراسية" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent align="end" className="text-right">
                  <SelectItem value="diploma">دبلوم</SelectItem>
                  <SelectItem value="masters">ماجستير</SelectItem>
                  <SelectItem value="phd">دكتوراه</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="education"
          render={({ field }) => (
            <FormItem>
              <FormLabel>الخلفية التعليمية</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="صف خلفيتك التعليمية، بما في ذلك الشهادات التي حصلت عليها والمؤسسات التي درست فيها"
                  {...field}
                  className="min-h-[100px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="statement"
          render={({ field }) => (
            <FormItem>
              <FormLabel>الرسالة الشخصية</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="أخبرنا لماذا أنت مهتم بهذا البرنامج وما الذي تأمل في تحقيقه"
                  {...field}
                  className="min-h-[150px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </motion.div>
  );
};

const StepThree = ({ handleDocumentUpload, documents }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  
  const documentTypes = [
    { 
      id: 'resume', 
      label: 'السيرة الذاتية', 
      description: 'قم برفع سيرتك الذاتية الحالية (بتنسيق PDF)',
      file: documents.resume
    },
    { 
      id: 'transcript', 
      label: 'السجل الأكاديمي', 
      description: 'قم برفع سجلك الأكاديمي الرسمي أو غير الرسمي (بتنسيق PDF)',
      file: documents.transcript
    },
    { 
      id: 'idCard', 
      label: 'بطاقة الهوية/جواز السفر', 
      description: 'قم برفع نسخة من بطاقة هويتك الحكومية أو جواز سفرك (بتنسيق PDF أو صورة)',
      file: documents.idCard
    }
  ];
  
  return (
    <motion.div 
      ref={ref}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-xl font-semibold mb-6">رفع المستندات</h2>
      <p className="text-muted-foreground mb-6">
        يرجى رفع المستندات المطلوبة التالية لإكمال طلبك
      </p>
      
      <div className="space-y-6">
        {documentTypes.map((doc) => (
          <div key={doc.id} className="border border-border rounded-lg overflow-hidden">
            <div className="p-4 bg-secondary/30">
              <h3 className="font-medium">{doc.label} <span className="text-destructive">*</span></h3>
              <p className="text-sm text-muted-foreground mt-1">{doc.description}</p>
            </div>
            
            <div className="p-4">
              {doc.file ? (
                <div className="flex items-center">
                  <CheckCircle size={18} className="text-green-600 ml-2" />
                  <span className="text-sm">{doc.file.name}</span>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm" 
                    className="mr-auto text-muted-foreground hover:text-destructive"
                    onClick={() => handleDocumentUpload(doc.id, { target: { files: [] } })}
                  >
                    استبدال
                  </Button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center relative">
                  <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                  <p className="mt-2 text-sm font-medium">انقر للرفع أو اسحب وأفلت</p>
                  <p className="mt-1 text-xs text-muted-foreground">PDF, JPG, أو PNG (الحد الأقصى ٥ ميجابايت)</p>
                  <input
                    type="file"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={(e) => handleDocumentUpload(doc.id, e)}
                    accept=".pdf,.jpg,.jpeg,.png"
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8 p-4 bg-secondary/30 rounded-lg">
        <p className="text-sm text-muted-foreground">
          بتقديم هذا الطلب، فإنك تؤكد أن جميع المعلومات المقدمة دقيقة وكاملة. قد تؤدي المعلومات الخاطئة إلى رفض طلبك أو إنهاء التسجيل.
        </p>
      </div>
    </motion.div>
  );
};

export default Registration;
