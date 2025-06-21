import { Button } from '@/components/ui/button';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

const Unauthorized = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isSessionExpired = location.state?.sessionExpired;
  const returnTo = location.state?.from || '/';

  useEffect(() => {
    // Clear any existing tokens when landing on this page
    localStorage.removeItem('token');
  }, []);

  const handleBackToLogin = () => {
    navigate('/login', { 
      state: { from: returnTo },
      replace: true 
    });
  };

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-md w-full">
        <div className="mb-6">
          <svg 
            className="mx-auto h-16 w-16 text-red-500" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
            />
          </svg>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          {isSessionExpired ? 'انتهت الجلسة' : 'غير مصرح بالوصول'}
        </h1>
        
        <p className="text-gray-600 mb-6">
          {isSessionExpired 
            ? 'لقد انتهت صلاحية الجلسة الحالية. يرجى تسجيل الدخول مرة أخرى للمتابعة.'
            : 'عذراً، ليس لديك صلاحية للوصول إلى هذه الصفحة.'}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={handleBackToLogin}
            className="bg-primary hover:bg-primary/90 w-full sm:w-auto"
          >
            {isSessionExpired ? 'تسجيل الدخول' : 'تسجيل الدخول بحساب آخر'}
          </Button>
          
          {!isSessionExpired && (
            <Button 
              variant="outline" 
              onClick={handleGoHome}
              className="w-full sm:w-auto"
            >
              العودة للصفحة الرئيسية
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
