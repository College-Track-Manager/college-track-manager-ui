import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Unauthorized = () => {
  const navigate = useNavigate();

  const handleBackToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">انتهت الجلسة</h1>
        <p className="text-gray-600 mb-6">لقد انتهت صلاحية الجلسة الحالية. يرجى تسجيل الدخول مرة أخرى للمتابعة.</p>
        <Button 
          onClick={handleBackToLogin}
          className="bg-primary hover:bg-primary/90"
        >
          العودة إلى صفحة تسجيل الدخول
        </Button>
      </div>
    </div>
  );
};

export default Unauthorized;
