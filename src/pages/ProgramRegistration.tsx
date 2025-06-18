import { useState, useRef, useEffect } from 'react';
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
import { useToast } from '@/hooks/use-toast';
import { useTracksByType } from '@/services/tracks';
import { useNavigate } from 'react-router-dom';
import { programRegistrationApi } from '@/services/program-registration';

// Define schema for program registration (step 2 & 3 fields)
const programSchema = z.object({
  trackType: z.union([z.literal(1), z.literal(2)]).nullable().refine(val => val !== null, {
    message: 'الرجاء اختيار نوع المسار',
  }),
  track: z.string().min(1, { message: 'الرجاء اختيار مسار' }),
  educationLevel: z.string().min(1, { message: 'الرجاء اختيار المرحلة الدراسية' }),
  studyType: z.enum(['online', 'offline'], { required_error: 'الرجاء اختيار نوع الدراسة' }),
  education: z.string()
    .min(5, { message: 'الخلفية التعليمية مطلوبة' })
    .max(500, { message: 'يجب ألا تتجاوز الخلفية التعليمية 500 حرف' }),
  statement: z.string()
    .min(1, { message: 'الرسالة الشخصية مطلوبة' })
    .max(500, { message: 'يجب ألا تتجاوز الرسالة الشخصية 500 حرف' }),
});

type ProgramFormValues = z.infer<typeof programSchema>;

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes
const ALLOWED_FILE_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png'];

const ProgramRegistration = () => {
  const [documents, setDocuments] = useState({
    resume: null as File | null,
    transcript: null as File | null,
    idCard: null as File | null,
  });
  const [fileErrors, setFileErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Read trackId and type from query params
  const searchParams = new URLSearchParams(window.location.search);
  const hasTrackParams = searchParams.has('trackId') && searchParams.has('type');
  const preselectedTrackId = hasTrackParams ? searchParams.get('trackId') || '' : '';
  const preselectedType = hasTrackParams ? (Number(searchParams.get('type')) === 2 ? 2 : 1) : null;

  const form = useForm<ProgramFormValues>({
    resolver: zodResolver(programSchema),
    defaultValues: {
      trackType: null,
      track: '',
      educationLevel: '',
      studyType: undefined as any,
      education: '',
      statement: '',
    },
  });

  // Watch trackType for dynamic fetching
  const trackType = form.watch('trackType');
  const { data: tracks = [], isLoading: tracksLoading } = useTracksByType(trackType);

  // Set initial trackType and track when component mounts if they are provided in URL
  useEffect(() => {
    if (preselectedType !== null) {
      // Type assertion to ensure trackType is 1 or 2
      const trackType = (preselectedType === 2 ? 2 : 1) as 1 | 2;
      form.setValue('trackType', trackType);
      
      // Preselect the track after tracks are loaded
      if (
        preselectedTrackId &&
        tracks.length > 0 &&
        tracks.some(t => String(t.id) === preselectedTrackId)
      ) {
        form.setValue('track', preselectedTrackId);
      }
    }
  }, [preselectedType, preselectedTrackId, tracks, form]);

  const validateFile = (file: File, type: string): string | null => {
    if (file.size > MAX_FILE_SIZE) {
      return 'حجم الملف يجب أن يكون أقل من 5 ميجابايت';
    }
    
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return 'نوع الملف غير مدعوم. يرجى رفع ملف PDF أو Word أو صورة';
    }
    
    return null;
  };

  const handleDocumentUpload = (type: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const error = validateFile(file, type);
      
      if (error) {
        setFileErrors(prev => ({
          ...prev,
          [type]: error
        }));
        // Clear the input
        e.target.value = '';
        return;
      }
      
      // Clear any previous error
      setFileErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[type];
        return newErrors;
      });
      
      setDocuments(prev => ({
        ...prev,
        [type]: file
      }));
      toast({
        title: "تم رفع المستند",
        description: `تم رفع ${file.name} بنجاح.`,
      });
    }
  };


  const onSubmit = async (data: ProgramFormValues) => {
    console.log('onSubmit called', data, documents);
  
    console.log('onSubmit called', data, documents);
    if (!documents.resume || !documents.transcript || !documents.idCard) {
      toast({
        title: "خطأ",
        description: "يرجى رفع جميع المستندات المطلوبة",
        variant: "destructive",
      });
      return;
    }
    setIsSubmitting(true);
    window.scrollTo(0, 0);
    try {
      // Submit new program registration
      // Get user info from JWT token
      const token = localStorage.getItem('token');
      let userInfo: any = {};
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          userInfo = payload;
        } catch (e) {
          console.error('Failed to decode token', e);
        }
      }
      await programRegistrationApi.submit({
        email: 'test@example.com',
        studyType: data.studyType,
        trackType: data.trackType,
        trackDegree: data.educationLevel,
        track: data.track,
        education: data.education,
        statement: data.statement,
        resume: documents.resume,
        transcript: documents.transcript,
        idCard: documents.idCard,
        AcademicYear: '2025'
      });
      toast({
        title: "تم تقديم الطلب",
        description: "تم تقديم طلب البرنامج بنجاح وهو قيد المراجعة.",
      });
      navigate('/program-registration-success');
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تقديم طلب البرنامج",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Debug: log form errors
  useEffect(() => {
    if (form.formState.errors && Object.keys(form.formState.errors).length > 0) {
      console.log('Form validation errors:', form.formState.errors);
    }
  }, [form.formState.errors]);

  return (
    <PageTransition>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f8fafc] to-[#e0e7ef] py-10">
        <div className="w-full max-w-2xl mx-auto rounded-2xl shadow-xl bg-white/90 p-8 md:p-12">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-extrabold text-foreground mb-2">استكمال التسجيل في البرنامج</h1>
            <p className="text-lg text-muted-foreground">اختر البرنامج وارفع المستندات المطلوبة</p>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} dir="rtl" className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                <FormField
                  control={form.control}
                  name="trackType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="mr-3">نوع المسار</FormLabel>
                      <Select
                        onValueChange={val => field.onChange(Number(val))} value={field.value == null ? "" : String(field.value)}
                        name="trackType"
                      >
                        <SelectTrigger className="text-right w-full" dir="rtl">
                          <SelectValue placeholder="اختر نوع المسار" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">أكاديمي</SelectItem>
                          <SelectItem value="2">مهني</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="track"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="mr-3">المسار</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value} name="track" disabled={tracksLoading || tracks.length === 0}>
                        <SelectTrigger className="text-right w-full" dir="rtl">
                          <SelectValue placeholder={"اختر المسار"} />
                        </SelectTrigger>
                        <SelectContent>
                          {tracks.map((track) => (
                            <SelectItem key={track.id} value={String(track.id)}>{track.title}</SelectItem>
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
                    <FormItem>
                      <FormLabel className="mr-3">المرحلة الدراسية</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value} name="educationLevel">
                        <SelectTrigger className="text-right w-full" dir="rtl">
                          <SelectValue placeholder="اختر المرحلة الدراسية" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="bachelor" className="text-right" dir="rtl">دبلوما</SelectItem>
                          <SelectItem value="master" className="text-right" dir="rtl">ماجستير</SelectItem>
                          <SelectItem value="phd" className="text-right" dir="rtl">دكتوراه</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="studyType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="mr-3">نوع الدراسة</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value} name="studyType">
                        <SelectTrigger className="text-right w-full" dir="rtl">
                          <SelectValue placeholder="اختر نوع الدراسة" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="offline" className="text-right" dir="rtl">حضوري</SelectItem>
                          <SelectItem value="online" className="text-right" dir="rtl">عن بعد</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="education"
                render={({ field }) => {
                  const value = field.value || '';
                  return (
                    <FormItem>
                      <div className="flex justify-between items-center">
                        <FormLabel className="mr-3">الخلفية التعليمية</FormLabel>
                        <span className="text-sm text-muted-foreground">
                          {value.length}/500
                        </span>
                      </div>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          name="education" 
                          placeholder="أدخل الخلفية التعليمية" 
                          rows={3}
                          maxLength={500}
                          className={value.length >= 500 ? 'border-red-500' : ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="statement"
                render={({ field }) => {
                  const value = field.value || '';
                  return (
                    <FormItem>
                      <div className="flex justify-between items-center">
                        <FormLabel className="mr-3">الرسالة الشخصية</FormLabel>
                        <span className="text-sm text-muted-foreground">
                          {value.length}/500
                        </span>
                      </div>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          name="statement" 
                          placeholder="أدخل رسالتك الشخصية" 
                          rows={5}
                          maxLength={500}
                          className={value.length >= 500 ? 'border-red-500' : ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <div className="space-y-4">
                <div>
                  <FormLabel className="mr-3">رفع السيرة الذاتية (PDF, Word)</FormLabel>
                  <Input 
                    type="file" 
                    accept=".pdf,.doc,.docx" 
                    onChange={(e) => handleDocumentUpload('resume', e)} 
                    className={fileErrors['resume'] ? 'border-red-500' : ''}
                  />
                  {fileErrors['resume'] && (
                    <p className="text-red-500 text-sm mt-1">{fileErrors['resume']}</p>
                  )}
                  {documents.resume && !fileErrors['resume'] && (
                    <div className="text-green-600 mt-1 flex items-center gap-1">
                      <CheckCircle size={16} /> 
                      {documents.resume.name} ({(documents.resume.size / (1024 * 1024)).toFixed(2)} MB)
                    </div>
                  )}
                </div>
                
                <div>
                  <FormLabel className="mr-3">رفع كشف الدرجات (PDF, Word)</FormLabel>
                  <Input 
                    type="file" 
                    accept=".pdf,.doc,.docx" 
                    onChange={(e) => handleDocumentUpload('transcript', e)} 
                    className={fileErrors['transcript'] ? 'border-red-500' : ''}
                  />
                  {fileErrors['transcript'] && (
                    <p className="text-red-500 text-sm mt-1">{fileErrors['transcript']}</p>
                  )}
                  {documents.transcript && !fileErrors['transcript'] && (
                    <div className="text-green-600 mt-1 flex items-center gap-1">
                      <CheckCircle size={16} /> 
                      {documents.transcript.name} ({(documents.transcript.size / (1024 * 1024)).toFixed(2)} MB)
                    </div>
                  )}
                </div>
                
                <div>
                  <FormLabel className="mr-3">رفع بطاقة الهوية (صورة أو PDF)</FormLabel>
                  <Input 
                    type="file" 
                    accept=".pdf,.jpg,.jpeg,.png" 
                    onChange={(e) => handleDocumentUpload('idCard', e)} 
                    className={fileErrors['idCard'] ? 'border-red-500' : ''}
                  />
                  {fileErrors['idCard'] && (
                    <p className="text-red-500 text-sm mt-1">{fileErrors['idCard']}</p>
                  )}
                  {documents.idCard && !fileErrors['idCard'] && (
                    <div className="text-green-600 mt-1 flex items-center gap-1">
                      <CheckCircle size={16} /> 
                      {documents.idCard.name} ({(documents.idCard.size / (1024 * 1024)).toFixed(2)} MB)
                    </div>
                  )}
                </div>
                
                <div className="text-sm text-muted-foreground mt-2">
                  <p>• الحد الأقصى لحجم الملف: 5 ميجابايت</p>
                  <p>• صيغ الملفات المقبولة: PDF, Word, JPG, PNG</p>
                </div>
              </div>
              <div className="flex justify-center mt-12">
                <Button type="submit" className="mx-auto" disabled={isSubmitting}>
                  {isSubmitting ? 'جاري التقديم...' : 'تقديم الطلب'}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </PageTransition>
  );
};

export default ProgramRegistration;
