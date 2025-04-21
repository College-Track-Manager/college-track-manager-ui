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
  trackType: z.union([z.literal(1), z.literal(2)]).default(1),
  track: z.string().min(1, { message: 'الرجاء اختيار مسار' }),
  educationLevel: z.string().min(1, { message: 'الرجاء اختيار المرحلة الدراسية' }),
  education: z.string().min(5, { message: 'الخلفية التعليمية مطلوبة' }),
  statement: z.string().min(50, { message: 'يجب أن تكون الرسالة الشخصية ٥٠ حرفًا على الأقل' }),
});

type ProgramFormValues = z.infer<typeof programSchema>;

const ProgramRegistration = () => {
  const [documents, setDocuments] = useState({
    resume: null,
    transcript: null,
    idCard: null,
  });
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ProgramFormValues>({
    resolver: zodResolver(programSchema),
    defaultValues: {
      trackType: 1, // Academic by default
      track: '',
      educationLevel: '',
      education: '',
      statement: '',
    },
  });

  // Watch trackType for dynamic fetching
  const trackType = form.watch('trackType');
  const { data: tracks = [], isLoading: tracksLoading } = useTracksByType(trackType);

  const handleDocumentUpload = (type, e) => {
    const file = e.target.files[0];
    if (file) {
      setDocuments((prevDocs) => ({
        ...prevDocs,
        [type]: file,
      }));
      toast({
        title: "تم رفع المستند",
        description: `تم رفع ${file.name} بنجاح.`,
      });
    }
  };


  const onSubmit = async (data: ProgramFormValues) => {
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
        firstName: userInfo.firstName || '',
        lastName: userInfo.lastName || '',
        email: userInfo.email || '',
        phone: userInfo.phone || '',
        address: userInfo.address || '',
        studyType: userInfo.studyType || '',
        trackType: data.trackType,
        trackDegree: data.educationLevel,
        track: data.track,
        education: data.education,
        statement: data.statement,
        resume: documents.resume,
        transcript: documents.transcript,
        idCard: documents.idCard,
      });
      toast({
        title: "تم تقديم الطلب",
        description: "تم تقديم طلب البرنامج بنجاح وهو قيد المراجعة.",
      });
      navigate('/dashboard');
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

  return (
    <PageTransition>
      <div className="py-12">
        <div className="container-content max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold">استكمال التسجيل في البرنامج</h1>
            <p className="mt-2 text-muted-foreground">
              اختر البرنامج وارفع المستندات المطلوبة
            </p>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">






              <FormField
                control={form.control}
                name="trackType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>نوع المسار</FormLabel>
                    <Select
                      onValueChange={(val) => field.onChange(Number(val))}
                      value={String(field.value)}
                      name="trackType"
                    >
                      <SelectTrigger>
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
                    <FormLabel>المسار</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} name="track" disabled={tracksLoading || tracks.length === 0}>
                      <SelectTrigger>
                        <SelectValue placeholder={tracksLoading ? "جاري تحميل المسارات..." : "اختر المسار"} />
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
                    <FormLabel>المرحلة الدراسية</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} name="educationLevel">
                      <SelectTrigger>
                        <SelectValue placeholder="اختر المرحلة الدراسية" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bachelor">دبلوما</SelectItem>
                        <SelectItem value="master">ماجستير</SelectItem>
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
                      <Input {...field} name="education" placeholder="أدخل الخلفية التعليمية" />
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
                      <Textarea {...field} name="statement" placeholder="أدخل رسالتك الشخصية" rows={5} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div>
                <FormLabel>رفع السيرة الذاتية</FormLabel>
                <Input type="file" accept=".pdf,.doc,.docx" onChange={(e) => handleDocumentUpload('resume', e)} />
                {documents.resume && (
                  <div className="text-green-600 mt-1 flex items-center gap-1"><CheckCircle size={16} /> {documents.resume.name}</div>
                )}
              </div>
              <div>
                <FormLabel>رفع كشف الدرجات</FormLabel>
                <Input type="file" accept=".pdf,.doc,.docx" onChange={(e) => handleDocumentUpload('transcript', e)} />
                {documents.transcript && (
                  <div className="text-green-600 mt-1 flex items-center gap-1"><CheckCircle size={16} /> {documents.transcript.name}</div>
                )}
              </div>
              <div>
                <FormLabel>رفع بطاقة الهوية</FormLabel>
                <Input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => handleDocumentUpload('idCard', e)} />
                {documents.idCard && (
                  <div className="text-green-600 mt-1 flex items-center gap-1"><CheckCircle size={16} /> {documents.idCard.name}</div>
                )}
              </div>
              <div className="flex justify-end mt-12">
                <Button type="submit" className="mr-auto" disabled={isSubmitting}>
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
