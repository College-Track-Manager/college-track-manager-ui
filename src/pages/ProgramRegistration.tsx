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
import { tracks } from '@/data/tracks';
import { useNavigate } from 'react-router-dom';
import { registrationsApi } from '@/services/registrations';

// Define schema for program registration (step 2 & 3 fields)
const programSchema = z.object({
  track: z.string().min(1, { message: 'الرجاء اختيار مسار' }),
  educationLevel: z.string().min(1, { message: 'الرجاء اختيار المرحلة الدراسية' }),
  education: z.string().min(5, { message: 'الخلفية التعليمية مطلوبة' }),
  statement: z.string().min(50, { message: 'يجب أن تكون الرسالة الشخصية ٥٠ حرفًا على الأقل' }),
});

type ProgramFormValues = z.infer<typeof programSchema>;

const ProgramRegistration = () => {
  const [step, setStep] = useState(2); // Only steps 2 and 3
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
    if (step === 2) {
      form.trigger(['track', 'educationLevel', 'education', 'statement']);
      const errorField = ['track', 'educationLevel', 'education', 'statement'].find(
        (field) => !!form.formState.errors[field as keyof typeof form.formState.errors]
      );
      if (errorField) {
        const el = document.querySelector(`[name="${errorField}"]`);
        if (el && 'focus' in el) (el as HTMLElement).focus();
        return;
      }
      setStep(3);
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    if (step > 2) {
      setStep(step - 1);
      window.scrollTo(0, 0);
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
      // Prepare FormData for program registration
      const formDataToSubmit = new FormData();
      formDataToSubmit.append('Track', data.track);
      formDataToSubmit.append('EducationLevel', data.educationLevel);
      formDataToSubmit.append('Education', data.education);
      formDataToSubmit.append('Statement', data.statement);
      if (documents.resume) formDataToSubmit.append('resume', documents.resume);
      if (documents.transcript) formDataToSubmit.append('transcript', documents.transcript);
      if (documents.idCard) formDataToSubmit.append('idCard', documents.idCard);
      await registrationsApi.submit(formDataToSubmit);
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
              <div style={{ display: step === 2 ? 'block' : 'none' }}>
                {/* StepTwo UI here (track, education, statement) */}
                {/* ... You can extract your StepTwo component here ... */}
              </div>
              <div style={{ display: step === 3 ? 'block' : 'none' }}>
                {/* StepThree UI here (document upload) */}
                {/* ... You can extract your StepThree component here ... */}
              </div>
              <div className="flex justify-between mt-12">
                {step > 2 && (
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

export default ProgramRegistration;
