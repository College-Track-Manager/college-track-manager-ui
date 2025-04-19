import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';

const Header = () => {
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();
  
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
            <div className="flex items-center gap-8">
              {isAuthenticated ? (
                <>
                  <span className="text-sm font-medium text-gray-700">{user?.email}</span>
                  <button
                    onClick={logout}
                    className="text-red-600 hover:text-red-800 border border-red-200 rounded px-3 py-1 ml-2"
                  >
                    تسجيل الخروج
                  </button>
                </>
              ) : (
                <NavLink to="/login" isActive={location.pathname === '/login'}>
                  تسجيل الدخول
                </NavLink>
              )}
              <NavLink to="/registration" isActive={location.pathname === '/registration'}>
                إنشاء حساب
              </NavLink>
            </div>
          </nav>
        </div>
      </div>
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
