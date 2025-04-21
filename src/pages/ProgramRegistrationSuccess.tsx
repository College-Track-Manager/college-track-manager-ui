import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

export default function ProgramRegistrationSuccess() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center bg-neutral-100 px-4 py-8 text-center mt-20">
      <div className="flex items-center justify-center w-24 h-24 rounded-full bg-neutral-200 mb-6 shadow-sm mx-auto">
        <CheckCircle size={56} color="#1992c8" />
      </div>
      <h1 className="text-2xl md:text-3xl font-extrabold mb-4 text-neutral-800">تم إرسال طلبك!</h1>
      <p className="text-base md:text-lg mb-8 text-neutral-700 leading-relaxed w-full max-w-4xl px-6 mx-auto" style={{wordBreak: 'break-word'}}>
        شكراً لتقديمك على البرنامج. سيتم مراجعة طلبك من قبل الإدارة والتواصل معك قريباً عبر البريد الإلكتروني.<br />
        إذا لم يصلك رد خلال أيام، يمكنك مراجعة حالة الطلب من خلال حسابك أو التواصل مع الدعم.
      </p>
      <button
        type="button"
        className="w-full max-w-xs mx-auto text-[#1992c8] text-lg md:text-xl font-normal py-3 rounded-lg bg-transparent border-0 outline-none transition-all duration-150 hover:underline hover:bg-[#1992c80d] focus:ring-2 focus:ring-[#1992c8] focus:ring-opacity-40"
        onClick={() => navigate('/')}
      >
        العودة للرئيسية
      </button>
    </div>
  );
}
