import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

const Header = () => {
  const location = useLocation();
  
  return (
    <header className="bg-white shadow-sm">
      <div className="container-content">
        <div className="flex items-center justify-between h-20">
          {/* Logo and College Name */}
          <Link to="/" className="flex items-center gap-3">
            <img 
              src="/images/4c8c79f0-18df-43cd-ae29-1ac5134baf4c.png" 
              alt="شعار جامعة القاهرة" 
              className="h-14 w-14"
            />
            <div className="flex flex-col">
              <span className="font-semibold text-base text-[#002b4e]">جامعة القاهرة</span>
              <span className="text-sm text-muted-foreground">كلية الدراسات العليا للبحوث الإحصائية</span>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-8">
            <NavLink to="/" isActive={location.pathname === '/'}>
              الرئيسية
            </NavLink>
            <NavLink to="/tracks" isActive={location.pathname.startsWith('/tracks')}>
              البرامج الدراسية
            </NavLink>
            <NavLink to="/registration" isActive={location.pathname === '/registration'}>
              التسجيل
            </NavLink>
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
        "text-base transition-colors relative py-1",
        isActive ? "text-primary font-medium" : "text-foreground/80 hover:text-foreground"
      )}
    >
      {children}
    </Link>
  );
};

export default Header;
