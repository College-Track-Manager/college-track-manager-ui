import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  const handleLogoutClick = () => {
    setIsLogoutDialogOpen(true);
  };

  const handleConfirmLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      toast.success('تم تسجيل الخروج بنجاح', {
        position: 'top-center',
        duration: 3000,
        className: 'bg-green-50 text-green-800 border-green-200 rtl font-tajawal flex items-center justify-center gap-2',
        style: {
          direction: 'rtl',
          fontFamily: 'Tajawal, sans-serif',
          padding: '0.75rem 1.5rem',
          borderRadius: '0.5rem',
          minWidth: '300px',
          textAlign: 'center',
        },
        icon: (
          <div className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-green-100 flex-shrink-0">
            <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        ),
      });
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      toast.error('حدث خطأ', {
        description: 'تعذر تسجيل الخروج. يرجى المحاولة مرة أخرى',
        position: 'top-center',
        duration: 4000,
        className: 'bg-red-50 text-red-800 border-red-200 rtl text-right font-tajawal',
        style: {
          direction: 'rtl',
          fontFamily: 'Tajawal, sans-serif',
        },
        descriptionClassName: 'mt-1 text-sm text-red-700 mr-2',
        icon: (
          <div className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-red-100 mr-2">
            <svg className="h-4 w-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        ),
      });
    } finally {
      setIsLoggingOut(false);
      setIsLogoutDialogOpen(false);
    }
  };

  const handleCancelLogout = () => {
    setIsLogoutDialogOpen(false);
  };
  
  return (
    <header className="bg-white border-b sticky top-0 z-50">
      <div className="container-content">
        <div className="flex items-center justify-between h-24">
          {/* Logo and College Name */}
          <Link to="/" className="flex items-center gap-4">
            <img 
              src="/images/4c8c79f0-18df-43cd-ae29-1ac5134baf4c.png" 
              alt="شعار جامعة القاهرة" 
              className="h-16 w-16"
            />
            <div className="flex flex-col gap-0.5">
              <span className="font-semibold text-xl text-[#002b4e]">جامعة القاهرة</span>
              <span className="text-[15px] text-gray-600">كلية الدراسات العليا للبحوث الإحصائية</span>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-10">
            <NavLink to="/" isActive={location.pathname === '/'}>
              الرئيسية
            </NavLink>
            <NavLink to="/tracks" isActive={location.pathname.startsWith('/tracks')}>
              البرامج
            </NavLink>
            {isAuthenticated && (
              <NavLink to="/profile" isActive={location.pathname === '/profile'}>
                الملف الشخصى
              </NavLink>
            )}
            <div className="flex items-center gap-8">
              {isAuthenticated ? (
                <>
                  {user?.role === 'Admin' && (
                    <NavLink to="/admin/dashboard" isActive={location.pathname.startsWith('/admin/dashboard')}>
                      لوحة التحكم
                    </NavLink>
                  )}
                  {user?.role === 'Student' && (
                    <>
                      <NavLink to="/student/dashboard" isActive={location.pathname.startsWith('/student/dashboard')}>
                        لوحة التحكم
                      </NavLink>
                      <NavLink to="/program-registration" isActive={location.pathname === '/program-registration'}>
                        تسجيل البرامج
                      </NavLink>
                    </>
                  )}
                  <button
                    onClick={handleLogoutClick}
                    className={cn(
                      "group flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors",
                      "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    )}
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="18" 
                      height="18" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      className="rtl:rotate-180 transition-transform group-hover:translate-x-0.5"
                    >
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                      <path d="m16 17 5-5-5-5" />
                      <path d="M21 12H9" />
                    </svg>
                    <span>تسجيل الخروج</span>
                  </button>
                </>
              ) : (
                <>
                  <NavLink to="/login" isActive={location.pathname === '/login'}>
                    تسجيل الدخول
                  </NavLink>
                  <NavLink to="/registration" isActive={location.pathname === '/registration'}>
                    إنشاء حساب
                  </NavLink>
                </>
              )}
            </div>
          </nav>
        </div>
      </div>
      {/* Logout Confirmation Dialog */}
      <Dialog open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen}>
        <DialogContent className="sm:max-w-md bg-white rounded-lg shadow-xl">
          <DialogHeader>
            <div className="flex items-center justify-center mb-4">
              <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-50 sm:mx-0 sm:h-10 sm:w-10">
                <svg
                  className="h-6 w-6 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
                  />
                </svg>
              </div>
            </div>
            <DialogTitle className="text-center text-xl font-bold text-gray-900">
              تأكيد تسجيل الخروج
            </DialogTitle>
            <DialogDescription className="text-center text-gray-600 mt-2">
              هل أنت متأكد من رغبتك في تسجيل الخروج؟
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-row justify-between gap-4 mt-6 px-1">
            <div className="flex-1">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancelLogout}
                className="w-full px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                إلغاء
              </Button>
            </div>
            <div className="flex-1">
              <Button
                type="button"
                variant="default"
                onClick={handleConfirmLogout}
                disabled={isLoggingOut}
                className="w-full px-6 py-2 text-sm font-medium bg-primary hover:bg-primary/90 focus:ring-primary focus:ring-offset-2 focus:ring-2 disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
              >
                {isLoggingOut ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    جاري تسجيل الخروج...
                  </>
                ) : 'تأكيد الخروج'}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </header>
  );
};

const NavLink = ({ children, to, isActive }: { children: React.ReactNode; to: string; isActive: boolean }) => {
  return (
    <Link
      to={to}
      className={cn(
        "text-base transition-colors relative py-2",
        isActive ? "text-primary font-medium" : "text-gray-600 hover:text-gray-900"
      )}
    >
      {children}
    </Link>
  );
};

export default Header;
