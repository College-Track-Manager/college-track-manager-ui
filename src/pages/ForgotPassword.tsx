import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { forgotPassword } from '@/services/auth';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    type ForgotPasswordResponse = {
      ok: boolean;
      status: number;
      message?: string;
      [key: string]: any;
    };
    try {
      const response = await forgotPassword(email) as ForgotPasswordResponse;
      if (response.ok) {
        navigate("/status", {
          state: {
            type: "success",
            title: "تم إرسال الرابط",
            message:
              typeof response.message === "string" && response.message.length > 0
                ? response.message
                : "تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني. يرجى التحقق من بريدك.",
            buttonText: "العودة إلى تسجيل الدخول",
            buttonTo: "/login",
          },
        });
      } else {
        navigate("/status", {
          state: {
            type: "error",
            title: "تعذر إرسال الطلب",
            message:
              typeof response.message === "string" && response.message.length > 0
                ? response.message
                : "يرجى التحقق من البريد الإلكتروني والمحاولة مرة أخرى.",
            buttonText: "حاول مرة أخرى",
            buttonTo: "/forgot-password",
          },
        });
      }
    } catch (error) {
      navigate("/status", {
        state: {
          type: "error",
          title: "خطأ في الاتصال",
          message: "حدث خطأ أثناء إرسال طلب إعادة تعيين كلمة المرور. يرجى المحاولة لاحقاً.",
          buttonText: "العودة",
          buttonTo: "/forgot-password",
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
<div className="flex flex-col items-center bg-neutral-100 px-4 py-8 text-center mt-20">
<Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">نسيت كلمة المرور؟</CardTitle>
          <CardDescription className="text-center">
            أدخل بريدك الإلكتروني لإرسال رابط إعادة تعيين كلمة المرور
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              type="email"
              required
              placeholder="البريد الإلكتروني"
              className="w-full"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <Button
              type="submit"
              className="w-full bg-primary text-white mt-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'جاري الإرسال...' : 'إرسال رابط إعادة تعيين كلمة المرور'}
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="w-full mt-2"
              onClick={() => navigate('/login')}
            >
              العودة إلى تسجيل الدخول
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPassword;
