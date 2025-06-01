import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  FileText,
  CreditCard,
  Settings,
  BarChart,
  LifeBuoy,
  LogOut,
  Menu,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';

const menuItems = [
  {
    title: 'لوحة التحكم',
    icon: LayoutDashboard,
    href: '/admin',
  },
  {
    title: 'الطلبات',
    icon: FileText,
    href: '/admin/applications',
  },
  {
    title: 'الطلاب المسجلين',
    icon: Users,
    href: '/admin/students',
  },
  {
    title: 'المدفوعات',
    icon: CreditCard,
    href: '/admin/payments',
  },
  {
    title: 'التقارير',
    icon: BarChart,
    href: '/admin/reports',
  },
  {
    title: 'دعم الطلاب',
    icon: LifeBuoy,
    href: '/admin/support',
  },
  {
    title: 'الإعدادات',
    icon: Settings,
    href: '/admin/settings',
  },
];

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);

  const NavItems = () => (
    <>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold">القائمة الرئيسية</h2>
          <div className="space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  'flex items-center rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground',
                  location.pathname === item.href
                    ? 'bg-accent text-accent-foreground'
                    : 'transparent'
                )}
              >
                <item.icon className="ml-2 h-4 w-4" />
                {item.title}
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-auto p-4">
        <Button variant="outline" className="w-full" onClick={() => {}}>
          <LogOut className="ml-2 h-4 w-4" />
          تسجيل الخروج
        </Button>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className={cn('hidden lg:flex lg:flex-col h-screen border-l', className)}>
        <ScrollArea className="flex-1">
          <NavItems />
        </ScrollArea>
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            className="lg:hidden fixed top-4 right-4 z-40"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-64 p-0">
          <ScrollArea className="h-full">
            <NavItems />
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </>
  );
}
